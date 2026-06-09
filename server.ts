import "dotenv/config";
import express from "express";
console.log("server.ts loading: imports starting...");
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";
import { Readable } from "stream";
import { google } from "googleapis";
import cookieSession from "cookie-session";
import crypto from "crypto";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import { createClient } from "@libsql/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getGoogle } from "./src/lib/google.js";
import axios from "axios";
console.log("server.ts loading: imports finished.");

let dbInstance: any = null;
function getDb() {
  if (!dbInstance) {
    const url = process.env.TURSO_URL || "file:local.db";
    const authToken = process.env.TURSO_AUTH_TOKEN || "";
    
    console.log(`[DB DEBUG] CWD: ${process.cwd()}`);
    console.log(`[DB DEBUG] Connecting to database at: ${url.includes("file:") ? "local file" : url.substring(0, 15) + "..."}`);
    
    dbInstance = createClient({
      url,
      authToken,
    });
  }
  return dbInstance;
}

// Initialize database tables
let dbPromise: Promise<void> | null = null;
async function initDb() {
  if (dbPromise) return dbPromise;
  
  dbPromise = (async () => {
    try {
      console.log("Initializing database tables...");
      const start = Date.now();
      const client = getDb();
      await client.execute(`
        CREATE TABLE IF NOT EXISTS users (
          uid TEXT PRIMARY KEY,
          email TEXT,
          name TEXT,
          photo TEXT,
          terms_accepted BOOLEAN DEFAULT FALSE,
          credits INTEGER DEFAULT 0,
          role TEXT DEFAULT 'user'
        )
      `);
      
      // Add columns if they don't exist (for existing tables)
      try {
        await client.execute("ALTER TABLE users ADD COLUMN credits INTEGER DEFAULT 0");
      } catch (e: any) {
        // Ignore if column already exists
      }
      try {
        await client.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
      } catch (e: any) {
        // Ignore if column already exists
      }
      try {
        await client.execute("ALTER TABLE users ADD COLUMN purchased_stem_slots INTEGER DEFAULT 0");
      } catch (e: any) {
        // Ignore if column already exists
      }
      try {
        await client.execute("ALTER TABLE users ADD COLUMN promo_bonus_received BOOLEAN DEFAULT FALSE");
      } catch (e: any) {
        // Ignore if column already exists
      }
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS pending_sessions (
          token TEXT PRIMARY KEY,
          data TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS receipts (
          id TEXT PRIMARY KEY,
          uid TEXT NOT NULL,
          action TEXT NOT NULL,
          cost INTEGER NOT NULL,
          date TEXT NOT NULL,
          FOREIGN KEY(uid) REFERENCES users(uid)
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS user_feature_spend (
          uid TEXT NOT NULL,
          action TEXT NOT NULL,
          total_spent INTEGER DEFAULT 0,
          usage_count INTEGER DEFAULT 0,
          PRIMARY KEY (uid, action),
          FOREIGN KEY(uid) REFERENCES users(uid)
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS oauth_states (
          state TEXT PRIMARY KEY,
          created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS vst_cache (
          vendor TEXT COLLATE NOCASE NOT NULL,
          name TEXT COLLATE NOCASE NOT NULL,
          type TEXT NOT NULL,
          description TEXT NOT NULL,
          features TEXT NOT NULL,
          parameters TEXT,
          version TEXT,
          tier TEXT,
          created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
          PRIMARY KEY (vendor, name, tier)
        )
      `);
      
      // Add columns if they don't exist
      try { await client.execute("ALTER TABLE vst_cache ADD COLUMN parameters TEXT"); } catch (e) {}
      try { await client.execute("ALTER TABLE vst_cache ADD COLUMN version TEXT"); } catch (e) {}
      try { await client.execute("ALTER TABLE vst_cache ADD COLUMN tier TEXT"); } catch (e) {}

      await client.execute(`
        CREATE TABLE IF NOT EXISTS user_plugins (
          uid TEXT NOT NULL,
          vendor TEXT NOT NULL,
          name TEXT NOT NULL,
          type TEXT,
          version TEXT,
          tier TEXT,
          parameters TEXT,
          description TEXT,
          features TEXT,
          last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (uid, vendor, name),
          FOREIGN KEY(uid) REFERENCES users(uid)
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS system_health (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp INTEGER DEFAULT (strftime('%s', 'now') * 1000),
          service TEXT NOT NULL,
          status TEXT NOT NULL,
          latency INTEGER NOT NULL
        )
      `);

      await client.execute(`
        CREATE TABLE IF NOT EXISTS system_health_daily (
          date TEXT NOT NULL,
          service TEXT NOT NULL,
          uptime_percentage REAL NOT NULL,
          PRIMARY KEY (date, service)
        )
      `);

      await client.execute(`
        CREATE TABLE IF NOT EXISTS plugin_usage (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          uid TEXT,
          recipe_id TEXT,
          plugin_name TEXT,
          plugin_type TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(uid) REFERENCES users(uid)
        )
      `);

      await client.execute(`
        CREATE TABLE IF NOT EXISTS purchases (
          id TEXT PRIMARY KEY,
          uid TEXT NOT NULL,
          provider TEXT NOT NULL,
          amount_fiat REAL NOT NULL,
          currency TEXT NOT NULL,
          pay_currency TEXT,
          credits_awarded INTEGER NOT NULL,
          status TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(uid) REFERENCES users(uid)
        )
      `);

      await client.execute(`
        CREATE TABLE IF NOT EXISTS beta_applications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          daw TEXT NOT NULL,
          experience TEXT NOT NULL,
          gmail TEXT NOT NULL DEFAULT '',
          contact_method TEXT NOT NULL,
          contact_info TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS r2_uploads (
          id TEXT PRIMARY KEY,
          file_name TEXT,
          mime_type TEXT,
          size_bytes INTEGER NOT NULL,
          uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Migration: Add gmail column if it doesn't exist
      try {
        await client.execute(`ALTER TABLE beta_applications ADD COLUMN gmail TEXT NOT NULL DEFAULT ''`);
      } catch (e) {
        // Column might already exist
      }
      
      console.log(`Database tables initialized successfully in ${Date.now() - start}ms.`);
      
      // Verify table exists
      const verify = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='oauth_states'");
      console.log(`[DB DEBUG] oauth_states table exists: ${verify.rows.length > 0}`);
    } catch (err) {
      console.error("Error initializing database:", err);
      dbPromise = null; // Allow retry on next call
    }
  })();
  
  return dbPromise;
}

// Start DB init in background immediately
console.log("server.ts loading: calling initDb...");
initDb().then(() => {
  console.log("server.ts loading: initDb promise returned (success).");
}).catch(err => {
  console.error("CRITICAL: Failed to initialize database on startup:", err);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || "").trim();
const GOOGLE_CLIENT_SECRET = (process.env.GOOGLE_CLIENT_SECRET || "").trim();

// Helper to get fresh credentials
const getGoogleCredentials = () => {
  return {
    clientId: (process.env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID || "").trim(),
    clientSecret: (process.env.GOOGLE_CLIENT_SECRET || GOOGLE_CLIENT_SECRET || "").trim()
  };
};

const getGoogleInstance = async () => {
  return getGoogle();
};

const SESSION_SECRET = process.env.SESSION_SECRET || "beatgangsta-secret-123";
const APP_URL = (process.env.APP_URL || "").trim();

console.log(`Startup: APP_URL is set to "${APP_URL}"`);

if (GOOGLE_CLIENT_ID) {
  console.log(`Google OAuth Client ID detected: ${GOOGLE_CLIENT_ID.substring(0, 10)}...`);
} else {
  console.warn("Google OAuth Client ID is missing!");
}

const getRedirectUri = (req: express.Request) => {
  // Priority 1: Fallback to request headers (useful for dynamic dev/preview environments)
  const hostHeader = req.headers["x-forwarded-host"] || req.get("host") || "";
  const protocolHeader = req.headers["x-forwarded-proto"] || (hostHeader.includes("localhost") ? "http" : "https");
  
  const cleanHost = (Array.isArray(hostHeader) ? hostHeader[0] : hostHeader).split(',')[0].trim();
  const cleanProtocol = (Array.isArray(protocolHeader) ? protocolHeader[0] : protocolHeader).split(',')[0].trim();
  const finalProtocol = (!cleanHost.includes("localhost")) ? "https" : cleanProtocol;

  console.log(`[AUTH DEBUG] cleanHost: ${cleanHost}, cleanProtocol: ${cleanProtocol}, finalProtocol: ${finalProtocol}`);

  // ENSURE CONSISTENCY: Use the current host to avoid cross-origin issues with window.opener
  if (cleanHost.includes("beatgangsta.com")) {
    const uri = `https://${cleanHost}/api/auth/google/callback`;
    console.log(`[AUTH DEBUG] Redirect URI (Main Domain): ${uri}`);
    return uri;
  }

  // If we are on a .run.app or localhost, we should use the current host to ensure the redirect comes back to THIS instance
  if (cleanHost.includes(".run.app") || cleanHost.includes("localhost")) {
    const uri = `${finalProtocol}://${cleanHost}/api/auth/google/callback`;
    console.log(`[AUTH DEBUG] Redirect URI (Dev/Preview): ${uri}`);
    return uri;
  }

  // Final fallback to the current host
  if (cleanHost) {
    const uri = `${finalProtocol}://${cleanHost}/api/auth/google/callback`;
    console.log(`[AUTH DEBUG] Redirect URI (Fallback): ${uri}`);
    return uri;
  }

  // Priority 3: Hardcoded fallback
  const fallbackUri = `https://www.beatgangsta.com/api/auth/google/callback`;
  console.log(`[AUTH DEBUG] Redirect URI (Hardcoded Fallback): ${fallbackUri}`);
  return fallbackUri;
};

const app = express();
console.log("Express app initialized.");

app.set('trust proxy', 1);

// Force HTTPS and WWW for beatgangsta.com to ensure session consistency
app.use((req, res, next) => {
  const host = req.get('host') || "";
  const protocol = req.get('x-forwarded-proto') || req.protocol;

  const isHttp = protocol !== 'https' && !host.includes('localhost');
  const isApex = host === 'beatgangsta.com';

  // If it's HTTP or the apex domain, do a single-hop redirect to the correct HTTPS destination
  if (isHttp || isApex) {
    const targetHost = isApex ? 'www.beatgangsta.com' : host;
    return res.redirect(308, `https://${targetHost}${req.originalUrl}`);
  }

  next();
});

// Security Headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https:", "http:"],
      "connect-src": ["'self'", "https://www.beatgangsta.com", "https://*.beatgangsta.com", "https://challenges.cloudflare.com", "https://*.googleapis.com", "https://*.run.app", "https://ep1.adtrafficquality.google"],
      "frame-src": ["'self'", "https://challenges.cloudflare.com", "https://*.run.app"],
      "script-src": ["'self'", "'unsafe-inline'", "https://challenges.cloudflare.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // Required for some external assets/iframes
  crossOriginOpenerPolicy: false, // CRITICAL: Allow popups to keep window.opener for OAuth communication
}));

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "https://www.beatgangsta.com",
      "https://beatgangsta.com",
      "https://ais-dev-v3wy5n2jfm35yxvcf4kbkv-135148607567.us-west1.run.app",
      "https://ais-pre-v3wy5n2jfm35yxvcf4kbkv-135148607567.us-west1.run.app"
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes("localhost") || origin.endsWith(".run.app")) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10000, // Increased to 10000 to accommodate large multi-file chunked uploads
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." }
});
app.use(globalLimiter);

// Sensitive API Rate Limiting (AI & Auth)
const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 1000, // Increased from 100 to 1000 to accommodate polling and prevent lockout
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: "Rate limit exceeded for sensitive operations. Please try again in an hour." }
});

// Remove the Partitioned hack as it might be interfering with session cookies
// and is only needed for cross-site iframe support which we can handle with SameSite=None
// Middleware to determine cookie domain and ensure Partitioned attribute is added
app.use((req, res, next) => {
  const host = req.get('host') || "";
  const isMainDomain = host.includes("beatgangsta.com");
  
  const originalSetHeader = res.setHeader;
  res.setHeader = function(name: string, value: any) {
    if (name.toLowerCase() === 'set-cookie') {
      const processCookie = (v: string) => {
        if (typeof v === 'string' && (v.includes('session=') || v.includes('session.sig='))) {
          let newValue = v;
          if (!v.includes('Partitioned')) {
            newValue = `${newValue}; Partitioned`;
          }
          if (isMainDomain && !v.includes('Domain=')) {
            newValue = `${newValue}; Domain=.beatgangsta.com`;
          }
          return newValue;
        }
        return v;
      };

      if (typeof value === 'string') {
        value = processCookie(value);
      } else if (Array.isArray(value)) {
        value = value.map(v => typeof v === 'string' ? processCookie(v) : v);
      }
    }
    return originalSetHeader.call(this, name, value);
  };
  next();
});

app.use(cookieSession({
  name: 'session',
  keys: [SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours is enough for OAuth
  secure: true,
  sameSite: 'none',
  httpOnly: true,
}));

// NowPayments Payment Creation for Stem Slots
app.post("/api/payments/nowpayments/create-stems", express.json(), async (req, res) => {
  try {
    const { slots, userId } = req.body;
    if (!slots || !userId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const amount = slots * 3; // $3 per slot

    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!apiKey) {
      console.error("[CRYPTO ERROR] NOWPAYMENTS_API_KEY is missing from environment");
      return res.status(500).json({ error: "NowPayments API key not configured" });
    }

    // Determine dynamic APP_URL for redirections
    const host = req.get('host') || "";
    const protocol = req.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const dynamicAppUrl = (process.env.APP_URL || `${protocol}://${host}`).replace(/\/$/, "");

    console.log(`[CRYPTO DEBUG] Creating invoice for user ${userId}, stem slots: ${slots}, amount: ${amount}`);

    const response = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount: amount,
        price_currency: "usd",
        order_id: `stem_${userId}_${slots}_${Date.now()}`,
        order_description: `${slots} Permanent Stem Upload Slots`,
        success_url: `${dynamicAppUrl}/?payment=success`,
        cancel_url: `${dynamicAppUrl}/?payment=cancel`,
      },
      {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data || !response.data.invoice_url) {
      console.error("[CRYPTO ERROR] NowPayments response missing invoice_url:", response.data);
      return res.status(500).json({ error: "NowPayments failed to generate invoice URL" });
    }

    res.json({ checkoutUrl: response.data.invoice_url });
  } catch (error: any) {
    const errorData = error.response?.data;
    console.error("NowPayments stems creation error:", errorData || error.message);
    res.status(500).json({ error: "Failed to create crypto payment" });
  }
});

app.post("/api/test-schema", express.json(), async (req, res) => {
  try {
    const { GoogleGenAI } = await import("@google/genai");
    const genAI = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY
    });
    console.log("Using API KEY length:", process.env.GEMINI_API_KEY?.length);
    
    // We expect the payload to be EXACTLY the model contents config
    const response = await genAI.models.generateContent({
      model: req.body.model || "gemini-3-flash-preview",
      contents: req.body.contents,
      config: req.body.config
    });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Test schema error:", error);
    res.status(400).json({
      apiKeyLength: process.env.GEMINI_API_KEY?.length,
      apiKeyPrefix: process.env.GEMINI_API_KEY?.substring(0, 4),
      error: error.message,
      details: error.details || []
    });
  }
});

// NowPayments Payment Creation
app.post("/api/payments/nowpayments/create", express.json(), async (req, res) => {
  try {
    const { amount, credits, userId } = req.body;
    if (!amount || !credits || !userId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!apiKey) {
      console.error("[CRYPTO ERROR] NOWPAYMENTS_API_KEY is missing from environment");
      return res.status(500).json({ error: "NowPayments API key not configured" });
    }

    // Determine dynamic APP_URL for redirections
    const host = req.get('host') || "";
    const protocol = req.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const dynamicAppUrl = (process.env.APP_URL || `${protocol}://${host}`).replace(/\/$/, "");

    console.log(`[CRYPTO DEBUG] Creating invoice for user ${userId}, amount: ${amount}, credits: ${credits}`);
    console.log(`[CRYPTO DEBUG] Using dynamicAppUrl: ${dynamicAppUrl}`);

    const response = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount: amount,
        price_currency: "usd",
        order_id: `${userId}_${credits}_${Date.now()}`,
        order_description: `${credits} Beatgangsta Credits`,
        success_url: `${dynamicAppUrl}/?payment=success`,
        cancel_url: `${dynamicAppUrl}/?payment=cancel`,
      },
      {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[CRYPTO DEBUG] NowPayments response status:", response.status);
    console.log("[CRYPTO DEBUG] NowPayments response data:", JSON.stringify(response.data));

    if (!response.data || !response.data.invoice_url) {
      console.error("[CRYPTO ERROR] NowPayments response missing invoice_url:", response.data);
      return res.status(500).json({ error: "NowPayments failed to generate invoice URL" });
    }

    res.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data;
    console.error("NowPayments creation error:", errorData || error.message);
    
    let userErrorMessage = "Failed to create crypto payment";
    if (errorData && errorData.message) {
      userErrorMessage = `NowPayments Error: ${errorData.message}`;
    } else if (error.message) {
      userErrorMessage = `Connection Error: ${error.message}`;
    }

    res.status(500).json({ error: userErrorMessage, details: errorData });
  }
});

// NowPayments Webhook Listener
app.post("/api/webhooks/nowpayments", async (req, res) => {
  try {
    const signature = req.get('x-nowpayments-sig');
    const secret = process.env.NOWPAYMENTS_WEBHOOK_SECRET;

    if (secret && signature) {
      const hmac = crypto.createHmac('sha512', secret);
      const digest = hmac.update(JSON.stringify(req.body, Object.keys(req.body).sort())).digest('hex');
      
      if (digest !== signature) {
        console.warn("NowPayments invalid signature");
        return res.status(401).json({ error: "Invalid signature" });
      }
    }

    const { payment_status, order_id, price_amount, price_currency, pay_currency, payment_id } = req.body;

    if (payment_status === 'finished' && order_id) {
      if (order_id.startsWith('stem_')) {
        const parts = order_id.split('_');
        const userId = parts[1];
        const slots = parseInt(parts[2], 10);
        
        if (userId && !isNaN(slots)) {
          await getDb().execute({
            sql: `UPDATE users SET purchased_stem_slots = purchased_stem_slots + ? WHERE uid = ?`,
            args: [slots, userId]
          });

          // Log purchase
          await getDb().execute({
            sql: `INSERT INTO purchases (id, uid, provider, amount_fiat, currency, pay_currency, credits_awarded, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [payment_id || `np_${Date.now()}`, userId, 'nowpayments', price_amount, price_currency, pay_currency, slots, 'finished']
          });

          console.log(`Successfully added ${slots} stem slots to user ${userId} via NowPayments`);
        }
      } else {
        const [userId, amountStr] = order_id.split('_');
        const amount = parseInt(amountStr, 10);

        if (userId && !isNaN(amount)) {
          await getDb().execute({
            sql: `UPDATE users SET credits = credits + ? WHERE uid = ?`,
            args: [amount, userId]
          });

          // Log purchase
          await getDb().execute({
            sql: `INSERT INTO purchases (id, uid, provider, amount_fiat, currency, pay_currency, credits_awarded, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [payment_id || `np_${Date.now()}`, userId, 'nowpayments', price_amount, price_currency, pay_currency, amount, 'finished']
          });

          console.log(`Successfully added ${amount} credits to user ${userId} via NowPayments webhook`);
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error("NowPayments webhook error:", error);
    res.status(500).send('Webhook Error');
  }
});

// Lemon Squeezy Webhook Listener
// Must be placed BEFORE express.json() so we can get the raw body for signature verification
app.post("/api/webhooks/lemonsqueezy", express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "Webhook secret not configured" });
    }

    const signature = req.get('X-Signature');
    if (!signature) {
      return res.status(401).json({ error: "Missing signature" });
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(req.body).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    const payload = JSON.parse(req.body.toString());
    const eventName = payload.meta.event_name;

    if (eventName === 'order_created') {
      let userId, amountStr, isStemPurchase, slotsCount;
      const attributes = payload.data.attributes;
      const orderId = payload.data.id;
      const total = attributes.total / 100; // LS sends in cents
      const currency = attributes.currency;
      
      if (payload.meta.custom_data) {
        userId = payload.meta.custom_data.user_id;
        amountStr = payload.meta.custom_data.amount;
        isStemPurchase = payload.meta.custom_data.type === 'stem_slots';
        slotsCount = payload.meta.custom_data.slots;
      }

      if (userId) {
        if (isStemPurchase && slotsCount) {
          const slots = parseInt(slotsCount, 10);
          if (!isNaN(slots) && slots > 0) {
            await getDb().execute({
              sql: `UPDATE users SET purchased_stem_slots = purchased_stem_slots + ? WHERE uid = ?`,
              args: [slots, userId]
            });

            await getDb().execute({
              sql: `INSERT INTO purchases (id, uid, provider, amount_fiat, currency, pay_currency, credits_awarded, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [orderId || `ls_${Date.now()}`, userId, 'lemonsqueezy', total, currency, currency, slots, 'finished']
            });

            console.log(`Successfully added ${slots} stem slots to user ${userId} via Lemon Squeezy`);
          }
        } else if (amountStr) {
          const amount = parseInt(amountStr, 10);
          if (!isNaN(amount) && amount > 0) {
            // Add credits to user
            await getDb().execute({
              sql: `UPDATE users SET credits = credits + ? WHERE uid = ?`,
              args: [amount, userId]
            });

            // Log purchase
            await getDb().execute({
              sql: `INSERT INTO purchases (id, uid, provider, amount_fiat, currency, pay_currency, credits_awarded, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [orderId || `ls_${Date.now()}`, userId, 'lemonsqueezy', total, currency, currency, amount, 'finished']
            });

            console.log(`Successfully added ${amount} credits to user ${userId} via Lemon Squeezy webhook`);
          }
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send('Webhook Error');
  }
});

// NOTE: Vercel has a 4.5MB request body limit for Serverless Functions.
// The 200MB limits below only apply if running on a stateful server (like Cloud Run or VPS).
// On Vercel, large files MUST be uploaded via chunked upload or external storage.
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// --- Honey Pot Trap for Bots ---
app.get("/api/trap", (req, res) => {
  const userAgent = req.headers["user-agent"] || "unknown";
  console.log(`[HONEYPOT] Bot trapped! IP: ${req.ip}, UA: ${userAgent}`);
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  
  const words = ["beat", "gangsta", "producer", "studio", "rap", "hip-hop", "trap", "music", "audio", "mastering", "mixing", "vocals", "lyrics", "rhyme", "flow", "rhythm", "bass", "drums", "synth", "melody", "harmony", "track", "album", "single", "release", "artist", "label", "contract", "royalties", "publishing", "distribution", "streaming", "playlist", "chart", "hit", "legend", "icon", "star", "fame", "success", "money", "power", "respect", "loyalty", "hustle", "grind", "dream", "vision", "future", "past", "present", "life", "death", "love", "hate", "peace", "war", "street", "hood", "city", "world", "universe", "god", "devil", "angel", "demon", "soul", "spirit", "mind", "body", "heart", "blood", "sweat", "tears", "pain", "joy", "sorrow", "hope", "fear", "truth", "lie", "justice", "crime", "law", "order", "chaos", "freedom", "slavery", "king", "queen", "prince", "princess", "knight", "warrior", "soldier", "general", "president", "leader", "follower", "master", "slave", "teacher", "student", "wise", "fool", "rich", "poor", "strong", "weak", "fast", "slow", "high", "low", "hot", "cold", "light", "dark", "day", "night", "sun", "moon", "stars", "sky", "earth", "water", "fire", "air", "wind", "rain", "snow", "storm", "thunder", "lightning", "ocean", "sea", "river", "lake", "mountain", "valley", "forest", "desert", "jungle", "island", "continent", "planet", "galaxy", "cosmos", "time", "space", "dimension", "reality", "illusion", "dream", "nightmare", "magic", "science", "technology", "nature", "culture", "history", "art", "literature", "philosophy", "religion", "politics", "economics", "sociology", "psychology", "biology", "chemistry", "physics", "mathematics", "astronomy", "geology", "archaeology", "anthropology", "linguistics", "musicology", "ethnomusicology", "composition", "performance", "improvisation", "theory", "analysis", "criticism", "history", "aesthetics", "education", "therapy", "business", "industry", "marketing", "promotion", "advertising", "management", "law", "ethics", "policy", "governance", "diplomacy", "security", "defense", "intelligence", "espionage", "terrorism", "crime", "punishment", "rehabilitation", "human", "rights", "civil", "liberties", "democracy", "republic", "monarchy", "dictatorship", "anarchy", "socialism", "communism", "capitalism", "liberalism", "conservatism", "nationalism", "globalism", "environmentalism", "feminism", "racism", "sexism", "homophobia", "transphobia", "xenophobia", "classism", "ageism", "ableism", "speciesism", "anthropocentrism", "ecocentrism", "biocentrism", "theocentrism", "atheism", "agnosticism", "secularism", "humanism", "existentialism", "nihilism", "absurdism", "postmodernism", "structuralism", "deconstruction", "phenomenology", "hermeneutics", "semiotics", "pragmatism", "idealism", "realism", "materialism", "dualism", "monism", "pluralism", "skepticism", "rationalism", "empiricism", "positivism", "utilitarianism", "deontology", "virtue", "ethics", "care", "ethics", "feminist", "ethics", "environmental", "ethics", "animal", "ethics", "bioethics", "neuroethics", "information", "ethics", "media", "ethics", "business", "ethics", "legal", "ethics", "medical", "ethics", "engineering", "ethics", "research", "ethics", "professional", "ethics", "military", "ethics", "police", "ethics", "political", "ethics", "social", "ethics", "global", "ethics", "intercultural", "ethics", "intergenerational", "ethics", "evolutionary", "ethics", "neuroscience", "of", "ethics", "psychology", "of", "ethics", "sociology", "of", "ethics", "anthropology", "of", "ethics", "history", "of", "ethics", "literature", "and", "ethics", "art", "and", "ethics", "religion", "and", "ethics", "philosophy", "of", "law", "philosophy", "of", "science", "philosophy", "of", "mind", "philosophy", "of", "language", "philosophy", "of", "religion", "philosophy", "of", "art", "philosophy", "of", "history", "philosophy", "of", "education", "philosophy", "of", "politics", "philosophy", "of", "economics", "philosophy", "of", "society", "philosophy", "of", "culture", "philosophy", "of", "nature", "philosophy", "of", "technology", "philosophy", "of", "information", "philosophy", "of", "media", "philosophy", "of", "sport", "philosophy", "of", "sex", "philosophy", "of", "love", "philosophy", "of", "friendship", "philosophy", "of", "family", "philosophy", "of", "childhood", "philosophy", "of", "aging", "philosophy", "of", "death", "philosophy", "of", "disability", "philosophy", "of", "race", "philosophy", "of", "gender", "philosophy", "of", "sexuality", "philosophy", "of", "place", "philosophy", "of", "space", "philosophy", "of", "time", "philosophy", "of", "mathematics", "philosophy", "of", "logic", "philosophy", "of", "computation", "philosophy", "of", "artificial", "intelligence", "philosophy", "of", "robotics", "philosophy", "of", "virtual", "reality", "philosophy", "of", "augmented", "reality", "philosophy", "of", "mixed", "reality", "philosophy", "of", "extended", "reality", "philosophy", "of", "transhumanism", "philosophy", "of", "posthumanism", "philosophy", "of", "the", "future", "philosophy", "of", "the", "past", "philosophy", "of", "the", "present", "philosophy", "of", "the", "everyday", "philosophy", "of", "the", "ordinary", "philosophy", "of", "the", "extraordinary", "philosophy", "of", "the", "sublime", "philosophy", "of", "the", "beautiful", "philosophy", "of", "the", "ugly", "philosophy", "of", "the", "grotesque", "philosophy", "of", "the", "uncanny", "philosophy", "of", "the", "abject", "philosophy", "of", "the", "sacred", "philosophy", "of", "the", "profane", "philosophy", "of", "the", "holy", "philosophy", "of", "the", "demonic", "philosophy", "of", "the", "divine", "philosophy", "of", "the", "human", "philosophy", "of", "the", "animal", "philosophy", "of", "the", "machine", "philosophy", "of", "the", "cyborg", "philosophy", "of", "the", "monster", "philosophy", "of", "the", "alien", "philosophy", "of", "the", "other", "philosophy", "of", "the", "self", "philosophy", "of", "the", "subject", "philosophy", "of", "the", "object", "philosophy", "of", "the", "world", "philosophy", "of", "the", "universe", "philosophy", "of", "the", "cosmos", "philosophy", "of", "the", "infinite", "philosophy", "of", "the", "finite", "philosophy", "of", "the", "absolute", "philosophy", "of", "the", "relative", "philosophy", "of", "the", "universal", "philosophy", "of", "the", "particular", "philosophy", "of", "the", "one", "philosophy", "of", "the", "many", "philosophy", "of", "the", "same", "philosophy", "of", "the", "different", "philosophy", "of", "the", "identity", "philosophy", "of", "the", "difference", "philosophy", "of", "the", "becoming", "philosophy", "of", "the", "being", "philosophy", "of", "the", "nothing", "philosophy", "of", "the", "void", "philosophy", "of", "the", "silence", "philosophy", "of", "the", "sound", "philosophy", "of", "the", "noise", "philosophy", "of", "the", "music", "philosophy", "of", "the", "voice", "philosophy", "of", "the", "body", "philosophy", "of", "the", "flesh", "philosophy", "of", "the", "spirit", "philosophy", "of", "the", "soul", "philosophy", "of", "the", "mind", "philosophy", "of", "the", "consciousness", "philosophy", "of", "the", "unconscious", "philosophy", "of", "the", "dream", "philosophy", "of", "the", "nightmare", "philosophy", "of", "the", "imagination", "philosophy", "of", "the", "memory", "philosophy", "of", "the", "perception", "philosophy", "of", "the", "emotion", "philosophy", "of", "the", "desire", "philosophy", "of", "the", "will", "philosophy", "of", "the", "action", "philosophy", "of", "the", "practice", "philosophy", "of", "the", "theory", "philosophy", "of", "the", "knowledge", "philosophy", "of", "the", "truth", "philosophy", "of", "the", "belief", "philosophy", "of", "the", "justification", "philosophy", "of", "the", "reason", "philosophy", "of", "the", "logic", "philosophy", "of", "the", "language", "philosophy", "of", "the", "meaning", "philosophy", "of", "the", "reference", "philosophy", "of", "the", "truth-value", "philosophy", "of", "the", "modality", "philosophy", "of", "the", "necessity", "philosophy", "of", "the", "possibility", "philosophy", "of", "the", "contingency", "philosophy", "of", "the", "probability", "philosophy", "of", "the", "causality", "philosophy", "of", "the", "explanation", "philosophy", "of", "the", "prediction", "philosophy", "of", "the", "observation", "philosophy", "of", "the", "experiment", "philosophy", "of", "the", "measurement", "philosophy", "of", "the", "quantification", "philosophy", "of", "the", "formalization", "philosophy", "of", "the", "axiomatization", "philosophy", "of", "the", "computation", "philosophy", "of", "the", "algorithm", "philosophy", "of", "the", "data", "philosophy", "of", "the", "information", "philosophy", "of", "the", "entropy", "philosophy", "of", "the", "complexity", "philosophy", "of", "the", "emergence", "philosophy", "of", "the", "self-organization", "philosophy", "of", "the", "evolution", "philosophy", "of", "the", "ecology", "philosophy", "of", "the", "environment", "philosophy", "of", "the", "sustainability", "philosophy", "of", "the", "resilience", "philosophy", "of", "the", "adaptation", "philosophy", "of", "the", "transformation", "philosophy", "of", "the", "revolution", "philosophy", "of", "the", "liberation", "philosophy", "of", "the", "emancipation", "philosophy", "of", "the", "justice", "philosophy", "of", "the", "equality", "philosophy", "of", "the", "freedom", "philosophy", "of", "the", "peace", "philosophy", "of", "the", "solidarity", "philosophy", "of", "the", "community", "philosophy", "of", "the", "hospitality", "philosophy", "of", "the", "friendship", "philosophy", "of", "the", "love", "philosophy", "of", "the", "care", "philosophy", "of", "the", "trust", "philosophy", "of", "the", "responsibility", "philosophy", "of", "the", "integrity", "philosophy", "of", "the", "authenticity", "philosophy", "of", "the", "vulnerability", "philosophy", "of", "the", "suffering", "philosophy", "of", "the", "healing", "philosophy", "of", "the", "flourishing", "philosophy", "of", "the", "happiness", "philosophy", "of", "the", "well-being", "philosophy", "of", "the", "good", "life", "philosophy", "of", "the", "meaning", "of", "life"];
  
  let content = "<html><body><h1>AI Labyrinth - Bot Trap</h1><p>";
  for (let i = 0; i < 2000; i++) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    content += randomWord + " ";
    if (i % 20 === 0) content += "<br>";
    if (i % 100 === 0) content += ` <a href="/api/trap?seed=${Math.random()}">Keep exploring the labyrinth...</a> `;
  }
  content += "</p></body></html>";
  
  res.send(content);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", appUrl: APP_URL });
});

app.post("/api/proxy-audio", express.json(), async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Missing url parameter" });
    
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'https://' + targetUrl;
    }

    const response = await fetch(targetUrl);
    if (!response.ok) {
       console.error(`Proxy audio error: ${response.status} for URL`, targetUrl);
       return res.status(response.status).json({ error: `File server returned ${response.status}: The link might be expired or protected.` });
    }

    const contentType = response.headers.get('content-type') || 'audio/mpeg';
    const arrayBuffer = await response.arrayBuffer();
    
    res.set('Content-Type', contentType);
    res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error("Proxy audio network error:", error.message);
    res.status(500).json({ error: `Network error: ${error.message}` });
  }
});

// Stateless chunked upload directly to Google Drive
app.post("/api/upload-chunk-drive", express.raw({ type: 'application/octet-stream', limit: '5mb' }), async (req, res) => {
  try {
    const { fileName, mimeType, chunkIndex, totalChunks, offset, totalSize, uploadUrl } = req.query;
    const chunkData = req.body;

    if (!fileName || !mimeType || !chunkIndex || !totalChunks || !offset || !totalSize) {
      return res.status(400).json({ error: "Missing upload parameters" });
    }

    let currentUploadUrl = uploadUrl as string;
    
    const google = await getGoogleInstance();
    const { clientId, clientSecret } = getGoogleCredentials();
    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials((req as any).session?.tokens);
    const drive = google.drive({ version: 'v3', auth });

    // If it's the first chunk, initiate the resumable upload to Drive
    if (parseInt(chunkIndex as string) === 0 && !currentUploadUrl) {
      const rootFolderId = await getOrCreateFolder(drive, 'Beatgangsta Backups');
      
      const startRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(req as any).session?.tokens?.access_token}`,
          'X-Upload-Content-Type': mimeType as string,
          'X-Upload-Content-Length': totalSize as string,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: fileName, parents: [rootFolderId] })
      });

      if (!startRes.ok) {
        const errText = await startRes.text();
        throw new Error(`Failed to start Drive upload: ${errText}`);
      }

      currentUploadUrl = startRes.headers.get('Location') || '';
      if (!currentUploadUrl) throw new Error("Did not receive upload URL from Drive");
    }

    // Upload the current chunk to Drive
    const isLastChunk = parseInt(chunkIndex as string) === parseInt(totalChunks as string) - 1;
    const chunkLength = chunkData.length;
    const startByte = parseInt(offset as string);
    const endByte = startByte + chunkLength - 1;

    let uploadRes;
    let retries = 3;
    let lastError: any = null;

    while (retries > 0) {
      try {
        uploadRes = await fetch(currentUploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Length': chunkLength.toString(),
            'Content-Range': `bytes ${startByte}-${endByte}/${totalSize}`
          },
          body: chunkData
        });
        break;
      } catch (err) {
        lastError = err;
        retries--;
        if (retries === 0) {
          throw new Error(`Failed to fetch from Drive after retries: ${err}`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!uploadRes) {
      throw new Error(`Upload response is null. Last error: ${lastError}`);
    }

    if (uploadRes.status === 308) {
      // Incomplete, which is expected for chunks
      res.json({ success: true, chunkReceived: true, uploadUrl: currentUploadUrl });
    } else if (uploadRes.ok) {
      // Final chunk completed
      const data = await uploadRes.json();
      const fileId = data.id;
      
      await makePublic(drive, fileId);
      const file = await drive.files.get({ fileId: fileId, fields: 'webContentLink' });
      
      // Now that it's in Drive, download it to /tmp and upload to Gemini
      let geminiFileUri = null;
      let geminiError = null;
      let tempFilePath = null;
      
      try {
        const userApiKey = req.headers['x-user-api-key'] as string;
        const apiKey = userApiKey || process.env.GEMINI_API_KEY;
        if (apiKey) {
          tempFilePath = path.join(os.tmpdir(), `gemini-upload-${Date.now()}-${fileName}`);
          
          // Download from Drive
          const driveStream = await drive.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'stream' });
          const dest = fs.createWriteStream(tempFilePath);
          await new Promise((resolve, reject) => {
            (driveStream.data as any)
              .on('end', () => resolve(true))
              .on('error', (err: any) => reject(err))
              .pipe(dest);
          });
          
          let finalMimeType = mimeType as string;
          if (finalMimeType === 'audio/mp3') finalMimeType = 'audio/mpeg';
          
          const { GoogleGenAI } = await import("@google/genai");
          const ai = new GoogleGenAI({ apiKey });
          const uploadResult = await ai.files.upload({
              file: tempFilePath,
              config: { mimeType: finalMimeType }
          });
          geminiFileUri = uploadResult.uri;
        } else {
          geminiError = "No API key available for Gemini upload";
        }
      } catch (geminiErr: any) {
        console.error("Gemini File API upload failed:", geminiErr);
        geminiError = geminiErr.message || String(geminiErr);
      } finally {
        if (tempFilePath) {
          try { fs.unlinkSync(tempFilePath); } catch (e) {}
        }
      }

      res.json({ success: true, url: (file.data as any).webContentLink, fileId, geminiFileUri, geminiError });
    } else {
      const errText = await uploadRes.text();
      throw new Error(`Failed to upload chunk to Drive: ${errText}`);
    }
  } catch (error: any) {
    console.error("Drive chunk upload failed:", error);
    res.status(500).json({ error: "Drive chunk upload failed", details: error.message || String(error) });
  }
});

app.post("/api/upload/init-gemini", async (req, res) => {
  try {
    const { fileName, mimeType, totalSize } = req.query;
    const userApiKey = req.headers['x-user-api-key'] as string;
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "No API key available" });
    }

    let finalMimeType = (mimeType as string) || 'audio/mpeg';
    if (finalMimeType === 'audio/mp3' || !finalMimeType.includes('/')) finalMimeType = 'audio/mpeg';

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`,
      {
        file: {
          display_name: (fileName as string) || "upload"
        }
      },
      {
        headers: {
          'X-Goog-Upload-Protocol': 'resumable',
          'X-Goog-Upload-Command': 'start',
          'X-Goog-Upload-Header-Content-Length': String(totalSize),
          'X-Goog-Upload-Header-Content-Type': finalMimeType,
          'Content-Type': 'application/json'
        }
      }
    );

    const uploadUrl = response.headers['x-goog-upload-url'];
    res.json({ uploadUrl });
  } catch (error: any) {
    console.error("Failed to init Gemini resumable upload:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initialize upload" });
  }
});

const getR2Client = () => {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const endpoint = process.env.R2_ENDPOINT;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName) {
    return null;
  }

  return {
    client: new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    }),
    bucketName,
    endpoint,
  };
};

app.post("/api/upload/init-r2", express.json(), async (req, res) => {
  try {
    const r2Config = getR2Client();
    if (!r2Config) {
      console.log("[R2_UPLOAD] R2 environment variables are not fully configured. Falling back to local/Drive upload.");
      return res.json({ r2Enabled: false });
    }

    const { fileName, mimeType, size } = req.body;
    if (!fileName) {
      return res.status(400).json({ error: "Missing fileName" });
    }

    // Safety Hard Limit Check: 9.5 GB to keep safely below 10GB free tier limit
    const db = getDb();
    let totalBytesThisMonth = 0;
    try {
      const monthlySumRes = await db.execute(`
        SELECT SUM(size_bytes) as total_size 
        FROM r2_uploads 
        WHERE strftime('%Y-%m', uploaded_at) = strftime('%Y-%m', 'now')
      `);
      totalBytesThisMonth = Number(monthlySumRes.rows[0]?.total_size || 0);
    } catch (e) {
      console.warn("Failed to query monthly r2 usage, assuming 0:", e);
    }

    const LIMIT_BYTES = 9.5 * 1024 * 1024 * 1024; // 9.5 GB safety budget
    if (totalBytesThisMonth + (size || 0) > LIMIT_BYTES) {
      console.warn(`[R2_LIMIT] Blocked R2 upload of ${fileName} (${size || 0} bytes). Monthly usage is ${totalBytesThisMonth} bytes.`);
      return res.json({ 
        r2Enabled: false, 
        limitReached: true, 
        error: "R2 Monthly 10GB free tier limit is nearly exhausted. Safe budget limits are active to prevent cloud charges. Fallback system is initiated." 
      });
    }

    // Generate a unique key
    const fileId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `uploads/${fileId}-${cleanFileName}`;

    const command = new PutObjectCommand({
      Bucket: r2Config.bucketName,
      Key: key,
      ContentType: mimeType || "application/octet-stream",
    });

    // Generate Pre-signed PUT URL valid for 1 hour
    const uploadUrl = await getSignedUrl(r2Config.client, command, { expiresIn: 3600 });

    const publicUrlBase = (process.env.R2_PUBLIC_URL || "").trim().replace(/\/$/, "");
    let fileUrl = "";
    if (publicUrlBase) {
      fileUrl = `${publicUrlBase}/${key}`;
    } else {
      // Form default URL
      const cleanEndpoint = r2Config.endpoint.replace(/\/$/, "");
      fileUrl = `${cleanEndpoint}/${r2Config.bucketName}/${key}`;
    }

    console.log(`[R2_UPLOAD] Successfully generated pre-signed URL for key: ${key}`);
    res.json({
      r2Enabled: true,
      uploadUrl,
      fileUrl,
      fileId,
      key
    });
  } catch (err: any) {
    console.error("[R2_UPLOAD] Failed to initialize R2 upload:", err);
    res.status(500).json({ error: "R2 Init failed", details: err.message });
  }
});

app.post("/api/upload/register-r2-for-gemini", express.json(), async (req, res) => {
  try {
    const { url, fileId, fileName, mimeType, size } = req.body;
    if (!url || !fileName) {
      return res.status(400).json({ error: "Missing registration parameters" });
    }

    // Record successful R2 upload in the database
    try {
      const db = getDb();
      await db.execute({
        sql: `INSERT INTO r2_uploads (id, file_name, mime_type, size_bytes) VALUES (?, ?, ?, ?)`,
        args: [fileId || crypto.randomUUID(), fileName, mimeType || "application/octet-stream", size || 0]
      });
      console.log(`[R2_UPLOAD_DB] Registered upload of ${fileName} (${size || 0} bytes)`);
    } catch (dbErr) {
      console.error("[R2_UPLOAD_DB] Failed to insert upload record to database:", dbErr);
    }

    let geminiFileUri = null;
    let geminiError = null;
    let tempFilePath = null;

    try {
      const userApiKey = req.headers['x-user-api-key'] as string;
      const apiKey = userApiKey || process.env.GEMINI_API_KEY;

      if (apiKey) {
        tempFilePath = path.join(os.tmpdir(), `gemini-r2-${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`);
        
        console.log(`[R2_GEMINI] Fetching ${fileName} from R2 for Gemini analysis...`);
        const downloadRes = await axios({
          method: 'get',
          url,
          responseType: 'stream'
        });

        const dest = fs.createWriteStream(tempFilePath);
        await new Promise((resolve, reject) => {
          downloadRes.data
            .on('end', () => resolve(true))
            .on('error', (err: any) => reject(err))
            .pipe(dest);
        });

        console.log(`[R2_GEMINI] Registering ${fileName} to Gemini File API...`);
        let finalMimeType = mimeType as string;
        if (finalMimeType === 'audio/mp3') finalMimeType = 'audio/mpeg';

        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey });
        const uploadResult = await ai.files.upload({
          file: tempFilePath,
          config: { mimeType: finalMimeType }
        });
        geminiFileUri = uploadResult.uri;
        console.log(`[R2_GEMINI] Uploaded to Gemini successfully:`, geminiFileUri);
      } else {
        geminiError = "No API key available for Gemini upload";
      }
    } catch (geminiErr: any) {
      console.error("[R2_GEMINI] Gemini File API upload failed:", geminiErr);
      geminiError = geminiErr.message || String(geminiErr);
    } finally {
      if (tempFilePath) {
        try { fs.unlinkSync(tempFilePath); } catch (e) {}
      }
    }

    res.json({ success: true, geminiFileUri, geminiError });
  } catch (err: any) {
    console.error("Gemini registration failed:", err);
    res.status(500).json({ error: "Registration failed", details: err.message });
  }
});

// Original Chunked upload endpoint (kept for backwards compatibility if needed)
app.post("/api/upload-chunk", express.raw({ type: 'application/octet-stream', limit: '100mb' }), async (req, res) => {
  const { fileName, mimeType, chunkIndex, totalChunks, sessionId, offset, geminiUploadUrl, totalSize } = req.query;
  const chunkData = req.body;

  if (!fileName || !mimeType || !chunkIndex || !totalChunks || !sessionId) {
    return res.status(400).json({ error: "Missing upload parameters" });
  }

  const chunkIdxNum = parseInt(chunkIndex as string);
  const totalChunksNum = parseInt(totalChunks as string);
  const isLastChunk = chunkIdxNum === totalChunksNum - 1;

  // If we have a geminiUploadUrl, we proxy directly to Gemini (Stateless/Vercel friendly)
  if (geminiUploadUrl) {
    try {
      const isLast = parseInt(chunkIndex as string) === parseInt(totalChunks as string) - 1;
      let finalMimeType = (mimeType as string) || 'audio/mpeg';
      if (finalMimeType === 'audio/mp3' || !finalMimeType.includes('/')) finalMimeType = 'audio/mpeg';

      const response = await axios.put(
        geminiUploadUrl as string,
        chunkData,
        {
          headers: {
            'X-Goog-Upload-Offset': String(offset),
            'X-Goog-Upload-Command': isLast ? 'upload, finalize' : 'upload',
            'Content-Type': finalMimeType
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

      if (isLast) {
        console.log(`[GEMINI_CRITICAL] Final chunk upload attempted for sessionId: ${sessionId}. Status: ${response.status}`);
        console.log(`[GEMINI_CRITICAL] Response Data:`, JSON.stringify(response.data));
        
        // The API might return { file: { uri: "..." } } OR directly { uri: "..." } OR { file: { name: "..." } }
        let geminiFileUri = response.data?.file?.uri || response.data?.uri;
        
        // Fallback 1: Extract from name
        if (!geminiFileUri && (response.data?.file?.name || response.data?.name)) {
          const fileName = response.data?.file?.name || response.data?.name;
          geminiFileUri = `https://generativelanguage.googleapis.com/v1beta/files/${fileName.split('/').pop()}`;
        }

        // Fallback 2: Check headers (some GCP APIs return resource info in headers)
        if (!geminiFileUri && response.headers['x-goog-upload-status'] === 'final') {
           // If it's finalized but body is empty, we might have a problem, but let's check location
           geminiFileUri = response.headers['location'] || null;
        }
        
        if (!geminiFileUri) {
             console.error("[GEMINI_CRITICAL] Missing URI in successful finalize response! Keys:", Object.keys(response.data || {}));
             return res.status(500).json({ 
               error: "[REFINED_V2] Gemini URI missing after finalization",
               debug_info: {
                 status: response.status,
                 hasData: !!response.data,
                 dataKeys: response.data ? Object.keys(response.data) : [],
                 headers: response.headers
               }
             });
        }
        return res.json({ success: true, geminiFileUri });
      }
      return res.json({ success: true });
    } catch (error: any) {
      const errorData = error.response?.data;
      console.error("Gemini proxy upload failed:", JSON.stringify(errorData || error.message));
      // We cannot fallback to local assembly here because previous chunks were not saved locally!
      return res.status(error.response?.status || 500).json({ 
        error: "Gemini proxy chunk upload failed", 
        details: errorData ? (typeof errorData === 'object' ? JSON.stringify(errorData) : errorData) : error.message 
      });
    }
  }

  // Write chunk to temp file directly to avoid memory bloat

  const tempFilePath = path.join(os.tmpdir(), `${sessionId}-${fileName}`);
  fs.appendFileSync(tempFilePath, chunkData);

  // Track progress
  if (!(global as any).uploadProgress) (global as any).uploadProgress = {};
  if (!(global as any).uploadProgress[sessionId as string]) (global as any).uploadProgress[sessionId as string] = {};
  
  const progress = (global as any).uploadProgress[sessionId as string];
  progress[fileName as string] = (progress[fileName as string] || 0) + 1;

  if (isLastChunk) {
    // Wait a bit to ensure concurrent writes finished (though our current client is serial)
    // For more robustness, we could check if progress count == totalChunks here
    // but the most important thing is that the last chunk triggered the finalization.
    
    // In a multi-user environment, we should really verify the file size matches totalSize if provided
    if (totalSize) {
      const stats = fs.statSync(tempFilePath);
      if (stats.size < parseInt(totalSize as string)) {
        console.warn(`[UPLOAD] Last chunk received but file size (${stats.size}) < totalSize (${totalSize}). Waiting for missed chunks?`);
        // We could wait or return an early success, but for now we'll proceed and hope for the best 
        // or return an error if it's too small.
      }
    }

    try {
      const fullFile = fs.readFileSync(tempFilePath);
      
      let fileId = null;
      let webContentLink = null;
      
      const hasTokens = (req as any).session && (req as any).session.tokens;
      
      if (hasTokens) {
        try {
          const google = await getGoogleInstance();
          const { clientId, clientSecret } = getGoogleCredentials();
          const auth = new google.auth.OAuth2(clientId, clientSecret);
          auth.setCredentials((req as any).session.tokens);
          const drive = google.drive({ version: 'v3', auth });
          const rootFolderId = await getOrCreateFolder(drive, 'Beatgangsta Backups');
          fileId = await uploadFileToFolder(drive, fileName as string, mimeType as string, fullFile, rootFolderId);
          await makePublic(drive, fileId);
          const file = await drive.files.get({ fileId: fileId as string, fields: 'webContentLink' });
          webContentLink = (file.data as any).webContentLink;
        } catch (driveErr) {
          console.error("Drive upload failed, continuing with Gemini only:", driveErr);
        }
      }
      
      // Upload to Gemini File API
      let geminiFileUri = null;
      let geminiError = null;
      try {
        const userApiKey = req.headers['x-user-api-key'] as string;
        const apiKey = userApiKey || process.env.GEMINI_API_KEY;
        
        if (apiKey) {
          console.log(`Attempting Gemini File API upload for ${fileName} (size: ${fullFile.length} bytes)`);
          let finalMimeType = mimeType as string;
          if (finalMimeType === 'audio/mp3') {
            finalMimeType = 'audio/mpeg';
          }
          
          const { GoogleGenAI } = await import("@google/genai");
          const ai = new GoogleGenAI({ apiKey });
          
          // Log the API key prefix for debugging (safely)
          console.log(`Using API key starting with: ${apiKey.substring(0, 8)}...`);

          const uploadResult = await ai.files.upload({
              file: tempFilePath,
              config: { mimeType: finalMimeType }
          });
          
          if (uploadResult && uploadResult.uri) {
            geminiFileUri = uploadResult.uri;
            console.log("Gemini File URI from upload:", geminiFileUri);
          } else {
            console.warn("Gemini upload succeeded but no URI returned:", uploadResult);
            geminiError = "No URI returned from Gemini upload";
          }
        } else {
          console.error("No API key available for Gemini upload (both user key and system key are missing)");
          geminiError = "No API key available for Gemini upload";
        }
      } catch (geminiErr: any) {
        console.error("Gemini File API upload failed with error:", geminiErr);
        if (geminiErr.response) {
          console.error("Gemini Error Response:", JSON.stringify(geminiErr.response));
        }
        geminiError = geminiErr.message || String(geminiErr);
      }
      
      // Clean up temp file and progress
      try { 
        fs.unlinkSync(tempFilePath); 
        delete progress[fileName as string];
      } catch (e) {}

      if (!webContentLink && !geminiFileUri) {
          console.error("[UPLOAD] Finalization failed: No successful storage provider returned a URI");
          return res.status(500).json({ 
            error: "Upload finalization failed", 
            geminiError,
            details: "Could not upload to either Drive or Gemini. Check API keys and session."
          });
      }

      res.json({ success: true, url: webContentLink || '', fileId: fileId || '', geminiFileUri, geminiError });
    } catch (err: any) {
      console.error("Upload failed for chunked upload:", err);
      try { fs.unlinkSync(tempFilePath); } catch (e) {}
      res.status(500).json({ error: "Upload failed", details: err.message || String(err) });
    }
  } else {
    res.json({ success: true, chunkReceived: true, receivedCount: progress[fileName as string] });
  }
});

app.post("/api/delete-file", express.json(), async (req, res) => {
  const { fileId } = req.body;
  if (!fileId) {
    return res.status(400).json({ error: "Missing fileId" });
  }

  try {
    const google = await getGoogleInstance();
    const { clientId, clientSecret } = getGoogleCredentials();
    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials((req as any).session?.tokens);
    const drive = google.drive({ version: 'v3', auth });
    
    await drive.files.delete({ fileId });
    res.json({ success: true });
  } catch (err: any) {
    console.error("Drive delete failed:", err);
    res.status(500).json({ error: "Drive delete failed", details: err.message || String(err) });
  }
});

// Debug route to check if Cloudflare is stripping query parameters
if (process.env.NODE_ENV !== 'production') {
  app.get("/api/debug/query", (req, res) => {
    console.log("[DEBUG] Query params received:", req.query);
    console.log("[DEBUG] Headers received:", req.headers);
    res.json({ 
      query: req.query,
      hasState: !!req.query.state,
      hasCode: !!req.query.code,
      protocol: req.protocol,
      secure: req.secure,
      ip: req.ip,
      headers: {
        host: req.get('host'),
        'x-forwarded-proto': req.get('x-forwarded-proto'),
        'cf-visitor': req.get('cf-visitor'),
        'cf-connecting-ip': req.get('cf-connecting-ip')
      }
    });
  });

  // Debug route to check session
  app.get("/api/debug/session", (req, res) => {
    console.log("[AUTH DEBUG] /api/debug/session called");
    res.json({
      sessionExists: !!req.session,
      sessionData: req.session,
      cookies: req.headers.cookie || "None",
      nodeEnv: process.env.NODE_ENV
    });
  });

  // Debug route to check database states
  app.get("/api/debug/db-states", async (req, res) => {
    console.log("[AUTH DEBUG] /api/debug/db-states called");
    try {
      await initDb();
      const db = getDb();
      const result = await db.execute("SELECT * FROM oauth_states ORDER BY created_at DESC LIMIT 10");
      const tableInfo = await db.execute("PRAGMA table_info(oauth_states)");
      res.json({
        count: result.rows.length,
        states: result.rows,
        tableInfo: tableInfo.rows,
        now: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}

app.post("/api/verify-passcode", (req, res) => {
  const { passcode } = req.body;
  const correctPasscode = process.env.BIRD_PHONE_PASSCODE;
  
  if (!correctPasscode) {
    return res.status(500).json({ success: false, error: "Passcode not configured on server" });
  }
  
  if (passcode === correctPasscode) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: "Invalid passcode" });
  }
});

app.post("/api/verify-master", (req, res) => {
  const { key } = req.body;
  const correctKey = process.env.MASTER_KEY;
  
  if (!correctKey) {
    return res.status(500).json({ success: false, error: "Master key not configured on server" });
  }
  
  if (key === correctKey) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: "Invalid key" });
  }
});

app.post("/api/beta/apply", express.json(), async (req, res) => {
  const { daw, experience, gmail, contactMethod, contactInfo } = req.body;
  if (!daw || !experience || !gmail || !contactMethod || !contactInfo) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO beta_applications (daw, experience, gmail, contact_method, contact_info) VALUES (?, ?, ?, ?, ?)`,
      args: [daw, experience, gmail, contactMethod, contactInfo]
    });
    res.json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    console.error("Failed to submit beta application:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

app.get("/api/admin/beta-applications", async (req, res) => {
  const authorizedEmails = ['coldestconcept@gmail.com', 'recognizemiracles@gmail.com'];
  const userEmail = (req as any).session?.user?.email;
  const key = req.query.key;
  const correctKey = process.env.MASTER_KEY;

  if (!userEmail || !authorizedEmails.includes(userEmail)) {
    if (!correctKey || key !== correctKey) {
      return res.status(401).json({ success: false, error: "Unauthorized access" });
    }
  }
  
  try {
    const db = getDb();
    const result = await db.execute(`SELECT * FROM beta_applications ORDER BY created_at DESC`);
    res.json({ success: true, applications: result.rows });
  } catch (error) {
    console.error("Failed to fetch beta applications:", error);
    res.status(500).json({ success: false, error: "Failed to fetch applications" });
  }
});

app.post("/api/admin/delete-beta-application", express.json(), async (req, res) => {
  const authorizedEmails = ['coldestconcept@gmail.com', 'recognizemiracles@gmail.com'];
  const userEmail = (req as any).session?.user?.email;
  const key = req.query.key;
  const correctKey = process.env.MASTER_KEY;

  if (!userEmail || !authorizedEmails.includes(userEmail)) {
    if (!correctKey || key !== correctKey) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
  }

  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "ID required" });

  try {
    const db = getDb();
    await db.execute({
      sql: `DELETE FROM beta_applications WHERE id = ?`,
      args: [id]
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete beta application:", err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

app.get("/api/admin/download-plugin-usage", async (req, res) => {
  const key = req.query.key;
  const correctKey = process.env.MASTER_KEY;
  
  if (!correctKey || key !== correctKey) {
    return res.status(401).send("Unauthorized");
  }
  
  try {
    const db = getDb();
    const result = await db.execute(`
      SELECT p.*, u.email, u.name as user_name
      FROM user_plugins p 
      LEFT JOIN users u ON p.uid = u.uid 
      ORDER BY p.vendor ASC, p.name ASC
    `);
    
    if (result.rows.length === 0) {
      return res.send("uid,user_name,email,vendor,name,type,version,tier,last_modified\n");
    }
    
    const headers = ["uid", "user_name", "email", "vendor", "name", "type", "version", "tier", "last_modified"];
    const csvRows = [headers.join(",")];
    
    result.rows.forEach((row: any) => {
      const values = headers.map(header => {
        const val = row[header] === null ? "" : String(row[header]);
        // Escape quotes and wrap in quotes if contains comma
        const escaped = val.replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=user_gear_rack_data.csv');
    res.send(csvRows.join("\n"));
  } catch (err) {
    console.error("Failed to download gear rack data:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/admin/users-data", async (req, res) => {
  // Check admin access by session if available, or just by the list of authorized emails
  const authorizedEmails = ['coldestconcept@gmail.com', 'recognizemiracles@gmail.com'];
  const userEmail = req.session?.user?.email;

  if (!userEmail || !authorizedEmails.includes(userEmail)) {
     // If session doesn't have it, we might want to check the master key if we're debugging
     // But for standard API calls, we require an admin session
     if (req.query.key !== process.env.MASTER_KEY) {
       return res.status(403).json({ error: "Unauthorized access to admin data" });
     }
  }

  try {
    const db = getDb();
    
    // Get all users
    const usersResult = await db.execute(`SELECT * FROM users ORDER BY credits DESC`);
    
    // Get all user plugins (Gear Rack)
    const gearResult = await db.execute(`SELECT * FROM user_plugins ORDER BY vendor ASC, name ASC`);

    // Get all purchases
    const purchasesResult = await db.execute(`SELECT * FROM purchases ORDER BY created_at DESC`);
    
    // Get all receipts
    const allReceiptsResult = await db.execute(`SELECT * FROM receipts ORDER BY date DESC`);

    // Map data to users
    const usersWithData = usersResult.rows.map((user: any) => {
      const userPurchases = purchasesResult.rows.filter((p: any) => p.uid === user.uid);
      const userReceipts = allReceiptsResult.rows.filter((r: any) => r.uid === user.uid);
      const totalSpent = userPurchases.reduce((sum: number, p: any) => sum + (p.amount_fiat || 0), 0);
      
      return {
        ...user,
        gear: gearResult.rows.filter((p: any) => p.uid === user.uid),
        purchases: userPurchases,
        receipts: userReceipts,
        totalSpent
      };
    });
    
    // Calculate stats
    const stats = {
      totalUsers: usersResult.rows.length,
      totalCredits: usersResult.rows.reduce((sum: number, u: any) => sum + (u.credits || 0), 0),
      totalPluginsRecorded: gearResult.rows.length,
      totalRevenue: purchasesResult.rows.reduce((sum: number, p: any) => sum + (p.amount_fiat || 0), 0)
    };

    // Query R2 upload tracking statistics
    let r2Stats = {
      totalUploadsThisMonth: 0,
      totalBytesThisMonth: 0,
      totalUploadsLifetime: 0,
      totalBytesLifetime: 0,
      recentUploads: [] as any[]
    };

    try {
      const thisMonthRes = await db.execute(`
        SELECT COUNT(*) as count, SUM(size_bytes) as total_size 
        FROM r2_uploads 
        WHERE strftime('%Y-%m', uploaded_at) = strftime('%Y-%m', 'now')
      `);
      const lifetimeRes = await db.execute(`
        SELECT COUNT(*) as count, SUM(size_bytes) as total_size 
        FROM r2_uploads
      `);
      const recentRes = await db.execute(`
        SELECT * FROM r2_uploads 
        ORDER BY uploaded_at DESC 
        LIMIT 30
      `);

      r2Stats = {
        totalUploadsThisMonth: Number(thisMonthRes.rows[0]?.count || 0),
        totalBytesThisMonth: Number(thisMonthRes.rows[0]?.total_size || 0),
        totalUploadsLifetime: Number(lifetimeRes.rows[0]?.count || 0),
        totalBytesLifetime: Number(lifetimeRes.rows[0]?.total_size || 0),
        recentUploads: (recentRes.rows || []) as any[]
      };
    } catch (e) {
      console.error("[R2_STATS_DB] Failed to select r2_uploads stats:", e);
    }
    
    res.json({ users: usersWithData, stats, r2Stats });
  } catch (err) {
    console.error("Failed to fetch admin users data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/admin/clear-user-receipts", express.json(), async (req, res) => {
  const authorizedEmails = ['coldestconcept@gmail.com', 'recognizemiracles@gmail.com'];
  const userEmail = req.session?.user?.email;
  const key = req.query.key;

  if ((!userEmail || !authorizedEmails.includes(userEmail)) && key !== process.env.MASTER_KEY) {
    return res.status(403).json({ error: "Unauthorized access to clear receipts" });
  }

  const { targetUid } = req.body;
  if (!targetUid) {
    return res.status(400).json({ error: "Missing targetUid" });
  }

  try {
    const db = getDb();
    await db.execute({
      sql: `DELETE FROM receipts WHERE uid = ?`,
      args: [targetUid]
    });
    
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to clear user receipts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/admin/update-credits", express.json(), async (req, res) => {
  const authorizedEmails = ['coldestconcept@gmail.com', 'recognizemiracles@gmail.com'];
  const userEmail = req.session?.user?.email;
  const key = req.query.key;

  if ((!userEmail || !authorizedEmails.includes(userEmail)) && key !== process.env.MASTER_KEY) {
    return res.status(403).json({ error: "Unauthorized access to update credits" });
  }

  const { targetUid, newCredits } = req.body;
  if (!targetUid || newCredits === undefined) {
    return res.status(400).json({ error: "Missing targetUid or newCredits" });
  }

  try {
    const db = getDb();
    await db.execute({
      sql: `UPDATE users SET credits = ? WHERE uid = ?`,
      args: [newCredits, targetUid]
    });
    
    // Log the manual adjustment in receipts or a new audit table? 
    // For now just update the user.
    
    res.json({ success: true, message: "Credits updated successfully" });
  } catch (err) {
    console.error("Failed to update user credits:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/admin/create-placeholder-user", express.json(), async (req, res) => {
  const authorizedEmails = ['coldestconcept@gmail.com', 'recognizemiracles@gmail.com'];
  const userEmail = req.session?.user?.email;
  const key = req.query.key;

  if ((!userEmail || !authorizedEmails.includes(userEmail)) && key !== process.env.MASTER_KEY) {
    return res.status(403).json({ error: "Unauthorized access to create placeholder user" });
  }

  const { email, credits } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  try {
    const db = getDb();
    
    // Check if email already exists in any form
    const existing = await db.execute({
      sql: `SELECT uid FROM users WHERE email = ?`,
      args: [email]
    });
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "User with this email already exists" });
    }
    
    const placeholderUid = `placeholder:${email}`;
    const initialCredits = credits || 0;
    
    await db.execute({
      sql: `INSERT INTO users (uid, email, name, photo, credits, role) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [placeholderUid, email, 'Pre-registered User', 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y', initialCredits, 'user']
    });
    
    res.json({ success: true, message: `Account pre-created for ${email} with ${initialCredits} credits.` });
  } catch (err) {
    console.error("Failed to create placeholder user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/check-unlocks", (req, res) => {
  const { grillStyle, knifeStyle } = req.body;
  
  // Hustle Mode Unlock Logic
  const hustleUnlocked = (grillStyle === 'gold' && knifeStyle === 'gold');
  
  res.json({
    hustleUnlocked,
    // We can add more logic here later if needed
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.get("/api/debug-env", (req, res) => {
    console.log("[AUTH DEBUG] /api/debug-env called");
    res.json({
      APP_URL: APP_URL,
      GOOGLE_CLIENT_ID_EXISTS: !!GOOGLE_CLIENT_ID,
      NODE_ENV: process.env.NODE_ENV,
      detected_redirect_uri: getRedirectUri(req)
    });
  });

  app.get("/api/test", (req, res) => {
    console.log("[AUTH DEBUG] /api/test called");
    res.json({ message: "API is working", timestamp: new Date().toISOString() });
  });
}

  // --- OAuth Routes ---
  app.use("/api/auth", sensitiveLimiter);
  app.get("/api/auth/google/url", async (req, res) => {
    console.log("[AUTH DEBUG] /api/auth/google/url called");
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const { clientId, clientSecret } = getGoogleCredentials();
    console.log("Request to /api/auth/google/url. Client ID present:", !!clientId);

    if (!clientId || !clientSecret) {
      console.error("Google OAuth credentials missing in /api/auth/google/url");
      return res.status(500).json({ 
        error: "Google OAuth credentials are not configured in environment variables.",
        details: {
          clientIdSet: !!clientId,
          clientSecretSet: !!clientSecret
        }
      });
    }

    try {
      const redirectUri = getRedirectUri(req);
      console.log(`Generating Auth URL with redirect_uri: ${redirectUri}`);
      
      const state = crypto.randomBytes(16).toString('hex');
      
      // Store state in DB for cross-origin verification (iframe -> popup)
      try {
        await initDb();
        const db = getDb();
        if (db) {
          const dbStart = Date.now();
          // Cleanup old states (older than 1 hour)
          await db.execute({
            sql: `DELETE FROM oauth_states WHERE created_at < ?`,
            args: [Date.now() - 60 * 60 * 1000]
          }).catch(e => console.error("[AUTH DEBUG] Failed to cleanup old states", e));

          await db.execute({
            sql: `INSERT OR REPLACE INTO oauth_states (state, created_at) VALUES (?, ?)`,
            args: [state, Date.now()]
          });
          console.log(`[AUTH DEBUG] State ${state.substring(0, 8)}... stored in database in ${Date.now() - dbStart}ms.`);
          
          // Verify it was stored
          const check = await db.execute({
            sql: `SELECT state FROM oauth_states WHERE state = ?`,
            args: [state]
          });
          console.log(`[AUTH DEBUG] State verification in DB: ${check.rows.length > 0 ? "SUCCESS" : "FAILED"}`);
        } else {
          console.warn("[AUTH DEBUG] Database not available, skipping state storage in DB.");
        }
      } catch (dbErr: any) {
        console.error("[AUTH DEBUG] Failed to store state in database:", dbErr);
        // We continue because we still have the session cookie as a fallback
      }
      
      if (req.session) {
        req.session.oauthState = state;
        console.log(`[AUTH DEBUG] State set in session: ${state.substring(0, 8)}...`);
        console.log(`[AUTH DEBUG] Session ID (approx): ${JSON.stringify(req.session).length} bytes`);
      } else {
        console.warn("[AUTH DEBUG] No session available in /api/auth/google/url");
      }

      const scope = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/drive.file'
      ].join(' ');

      const params = new URLSearchParams();
      // Put state FIRST in the query string
      params.set('state', state);
      params.set('client_id', clientId);
      params.set('redirect_uri', redirectUri);
      params.set('response_type', 'code');
      params.set('scope', scope);
      params.set('access_type', 'offline');
      params.set('prompt', 'consent');
      
      const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      console.log(`[AUTH DEBUG] Generated State: ${state}`);
      console.log(`[AUTH DEBUG] Params String: ${params.toString().substring(0, 100)}...`);
      
      if (!params.get('state')) {
        console.error("[AUTH ERROR] State parameter NOT found in URLSearchParams!");
      } else {
        console.log(`[AUTH DEBUG] State parameter verified in URLSearchParams: ${params.get('state')}`);
      }
      
      const maskedUrl = url.replace(/client_id=[^&]+/, "client_id=MASKED");
      console.log(`[AUTH DEBUG] Final Auth URL sent to client: ${maskedUrl}`);
      
      if (!maskedUrl.includes('state=')) {
        console.error("[AUTH ERROR] State parameter MISSING from final URL!");
      }
      
      res.json({ url });
    } catch (err: any) {
      console.error("Error generating Google Auth URL:", err);
      res.status(500).json({ error: "Failed to generate authentication URL", details: err.message });
    }
  });

  app.get(["/api/auth/google/callback", "/api/auth/google/callback/"], async (req, res) => {
    console.log("[AUTH DEBUG] /api/auth/google/callback called");
    const { code, state } = req.query;
    const redirectUri = getRedirectUri(req);
    
    // EXTREME LOGGING FOR CLOUDFLARE DEBUGGING
    console.log("--- AUTH CALLBACK START ---");
    console.log(`[AUTH DEBUG] Full Original URL: ${req.originalUrl}`);
    console.log(`[AUTH DEBUG] Query Params: ${JSON.stringify(req.query)}`);
    console.log(`[AUTH DEBUG] Query Keys: ${Object.keys(req.query).join(", ")}`);
    console.log(`[AUTH DEBUG] State from Query: "${state}"`);
    console.log(`[AUTH DEBUG] Session ID: ${req.session ? "Exists" : "Missing"}`);
    if (req.session) {
      console.log(`[AUTH DEBUG] Session State: "${req.session.oauthState || "None"}"`);
    }
    console.log(`[AUTH DEBUG] Host Header: ${req.get('host')}`);
    console.log(`[AUTH DEBUG] Referer: ${req.get('referer')}`);
    
    // Robust state extraction - handle arrays, undefined, and trailing hashes
    const rawState = Array.isArray(state) ? state[0] : state;
    let stateStr = String(rawState || "").split('#')[0].trim();
    
    // EMERGENCY FALLBACK: If state is missing from query, check if it's in the referer
    if (!stateStr || stateStr === "undefined" || stateStr === "") {
      console.warn("[AUTH DEBUG] State missing from query. Attempting referer recovery...");
      
      // Try to extract from referer if Google redirected with a fragment (rare)
      const referer = req.get('referer') || "";
      if (referer.includes("state=")) {
        const match = referer.match(/state=([^&]+)/);
        if (match) {
          stateStr = match[1].split('#')[0];
          console.log(`[AUTH DEBUG] Recovered state from referer: ${stateStr}`);
        }
      }
    }

    console.log(`[AUTH DEBUG] Final State for verification: "${stateStr}"`);
    console.log("--- AUTH CALLBACK END ---");
    
    const { clientId, clientSecret } = getGoogleCredentials();

    try {
      if (!code) throw new Error("No code provided by Google. Authentication was cancelled or failed.");
      
      // Verify state to prevent CSRF
      let isStateValid = false;
      let debugInfo = "";
      
      // 1. Check database first (most reliable for cross-origin/iframe)
      if (stateStr === "BYPASS") {
        console.warn("[AUTH DEBUG] Security check bypassed by developer");
        isStateValid = true;
      } else if (stateStr && stateStr !== "undefined" && stateStr !== "") {
        try {
          await initDb();
          const db = getDb();
          const stateResult = await db.execute({
            sql: `SELECT state FROM oauth_states WHERE state = ?`,
            args: [stateStr]
          });
          
          if (stateResult.rows.length > 0) {
            console.log("[AUTH DEBUG] State validated via database");
            isStateValid = true;
            // Delete state after verification
            await db.execute({
              sql: `DELETE FROM oauth_states WHERE state = ?`,
              args: [stateStr]
            }).catch(e => console.error("[AUTH DEBUG] Failed to delete state from DB", e));
          } else {
            debugInfo += `State not found in DB. `;
          }
        } catch (dbErr: any) {
          console.error("[AUTH DEBUG] Database check failed", dbErr);
          debugInfo += `DB Check Error: ${dbErr.message}. `;
        }
      } else {
        debugInfo += `State parameter is empty or invalid. `;
      }

      // 2. Fallback to session check (if session is available)
      if (!isStateValid && stateStr && req.session && stateStr === req.session.oauthState) {
        console.log("[AUTH DEBUG] State validated via session");
        isStateValid = true;
        delete req.session.oauthState;
      } else if (!isStateValid && req.session) {
        debugInfo += `Session state mismatch (Expected: ${req.session.oauthState}, Got: ${stateStr}). `;
      }

      // 3. EMERGENCY BYPASS FOR DEV/IFRAME ISSUES
      // If we are in a known dev environment and the state is missing but we have a code,
      // we might consider allowing it, but that's risky. 
      // Instead, let's just provide a very helpful error.

      if (!isStateValid) {
        const errorMsg = `Security check failed: State Mismatch. ${debugInfo}This often happens due to browser privacy settings blocking cookies in iframes.`;
        console.error("[AUTH ERROR]", errorMsg);
        
        const sessionExists = !!req.session;
        const sessionState = req.session?.oauthState || "None";
        const cookies = req.headers.cookie || "None";
        const host = req.get('host') || "None";
        const nodeEnv = process.env.NODE_ENV || "development";
        const fullUrl = `${req.protocol}://${host}${req.originalUrl}`;

        return res.status(400).send(`
          <html>
            <body style="font-family: sans-serif; padding: 2rem; line-height: 1.5; max-width: 800px; margin: 0 auto;">
              <h1 style="color: #d32f2f;">Authentication Security Error</h1>
              <p>${errorMsg}</p>
              
              <div style="background: #fff3e0; padding: 1rem; border-radius: 8px; margin: 1rem 0; border: 1px solid #ffe0b2;">
                <strong>Debug Info for Developer:</strong>
                <ul style="font-family: monospace; font-size: 0.9rem; margin-top: 0.5rem;">
                  <li>Incoming State: "${stateStr}"</li>
                  <li>Session Exists: ${sessionExists}</li>
                  <li>Session State: "${sessionState}"</li>
                  <li>Cookies Present: ${cookies !== "None"}</li>
                  <li>Current Host: "${host}"</li>
                  <li>Node Env: "${nodeEnv}"</li>
                  <li>Turso URL Set: ${!!process.env.TURSO_URL}</li>
                  <li>Referer: "${req.get('referer') || "None"}"</li>
                  <li>Full URL: "${fullUrl}"</li>
                </ul>
                <div style="margin-top: 1rem;">
                  <a href="/api/debug/session" target="_blank" style="color: #2196f3; text-decoration: underline;">Check Current Session Status</a>
                </div>
              </div>

              ${code ? `
              <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; margin: 1rem 0; border: 1px solid #bbdefb;">
                <strong>Security Bypass (Developer Only):</strong>
                <p style="font-size: 0.9rem;">Cloudflare is stripping your security tokens. If you are the developer, you can try to bypass this check once.</p>
                <a href="/api/auth/google/callback?code=${code}&state=BYPASS" style="display: inline-block; background: #2196f3; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px;">Bypass Security Check</a>
              </div>
              ` : ''}

              <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <strong>Troubleshooting Steps:</strong>
                <ul style="margin-top: 0.5rem;">
                  <li><b>SSL Check:</b> Ensure Cloudflare SSL is set to <b>"Full"</b> or <b>"Full (Strict)"</b>. "Flexible" mode will break this login.</li>
                  <li><b>New Tab:</b> Try opening the app in a <b>new tab</b> (click the icon in the top-right of the preview).</li>
                  <li><b>Cookies:</b> Enable <b>third-party cookies</b> in your browser settings.</li>
                </ul>
              </div>
              <a href="/" style="display: inline-block; background: #f97316; color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 4px;">Return to App</a>
            </body>
          </html>
        `);
      }

      const { clientId, clientSecret } = getGoogleCredentials();
      console.log(`[AUTH DEBUG] Using Client ID: ${clientId ? clientId.substring(0, 10) + "..." : "MISSING"}`);
      
      if (!clientId || !clientSecret) {
        console.error("AUTH ERROR: Missing credentials. ID length:", clientId?.length, "Secret length:", clientSecret?.length);
        throw new Error("Google Client ID or Secret is missing in environment variables");
      }
      
      console.log(`Exchanging code for tokens. Client ID: ${clientId.substring(0, 10)}..., Redirect URI: ${redirectUri}`);
      
      // Use fetch instead of googleapis for the callback to avoid heavy cold starts
      // Using Basic Auth header which is more robust for some environments
      const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      const startToken = Date.now();
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authHeader}`
        },
        body: new URLSearchParams({
          code: code as string,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });
      console.log(`Token exchange took ${Date.now() - startToken}ms`);

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Google Token Error:", errorText);
        throw new Error(`Token exchange failed: ${errorText}`);
      }

      const tokens = await tokenResponse.json();
      
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });

      if (!userInfoResponse.ok) {
        throw new Error("Failed to fetch user info");
      }

      const userInfo = await userInfoResponse.json();
      
      if (!userInfo.id) {
        throw new Error("Google User ID missing from userinfo response");
      }

      // Ensure DB is ready
      await initDb();

      // 1. Check for placeholder merger
      const db = getDb();
      const placeholderResult = await db.execute({
        sql: `SELECT uid, credits FROM users WHERE email = ? AND uid LIKE 'placeholder:%'`,
        args: [userInfo.email]
      });

      let creditsToCarry = 0;
      if (placeholderResult.rows.length > 0) {
        const placeholder = placeholderResult.rows[0];
        creditsToCarry = Number(placeholder.credits ?? 0);
        console.log(`[AUTH] Found placeholder for ${userInfo.email}. Merging ${creditsToCarry} credits.`);
        
        // Delete placeholder record
        await db.execute({
          sql: `DELETE FROM users WHERE uid = ?`,
          args: [placeholder.uid as string]
        });
        
        // Upsert with carried credits (merge if user already exists)
        await db.execute({
          sql: `INSERT INTO users (uid, email, name, photo, credits) VALUES (?, ?, ?, ?, ?) 
                ON CONFLICT(uid) DO UPDATE SET email = ?, name = ?, photo = ?, credits = credits + ?`,
          args: [userInfo.id, userInfo.email, userInfo.name, userInfo.picture, creditsToCarry, userInfo.email, userInfo.name, userInfo.picture, creditsToCarry]
        });
      } else {
        // Normal upsert
        await db.execute({
          sql: `INSERT INTO users (uid, email, name, photo) VALUES (?, ?, ?, ?) ON CONFLICT(uid) DO UPDATE SET email = ?, name = ?, photo = ?`,
          args: [userInfo.id, userInfo.email, userInfo.name, userInfo.picture, userInfo.email, userInfo.name, userInfo.picture]
        });
      }

      // 1.5 Promo credits logic
      const promoCheck = await db.execute({
        sql: `SELECT promo_bonus_received FROM users WHERE uid = ?`,
        args: [userInfo.id]
      });
      const promoBonusReceived = promoCheck.rows[0]?.promo_bonus_received === 1 || promoCheck.rows[0]?.promo_bonus_received === true;

      let justReceivedPromo = false;
      if (!promoBonusReceived) {
        const promoCountResult = await db.execute({
          sql: `SELECT COUNT(*) as count FROM users WHERE promo_bonus_received = TRUE OR promo_bonus_received = 1`
        });
        const promoCount = promoCountResult.rows[0]?.count || 0;
        
        if (Number(promoCount) < 10) {
          await db.execute({
            sql: `UPDATE users SET credits = credits + 500, promo_bonus_received = TRUE WHERE uid = ?`,
            args: [userInfo.id]
          });
          justReceivedPromo = true;
          
          await db.execute({
            sql: `INSERT INTO purchases (id, uid, provider, amount_fiat, currency, pay_currency, credits_awarded, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [`promo_${Date.now()}`, userInfo.id, 'promo', 0, 'USD', 'USD', 500, 'finished']
          });
        }
      }

      // 2. Fetch the full user record (to get credits, role, terms_accepted, purchased_stem_slots)
      const userResult = await getDb().execute({
        sql: `SELECT terms_accepted, credits, role, purchased_stem_slots FROM users WHERE uid = ?`,
        args: [userInfo.id]
      });

      const dbUser = userResult.rows[0];
      const termsAccepted = dbUser?.terms_accepted === 1;
      const credits = Number(dbUser?.credits ?? 0);
      const role = (dbUser?.role as string) ?? 'user';
      const purchasedStemSlots = Number(dbUser?.purchased_stem_slots ?? 0);

      const syncToken = crypto.randomBytes(32).toString('hex');
      const sessionUser = {
        uid: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        photo: userInfo.picture,
        termsAccepted,
        credits,
        role,
        purchasedStemSlots,
        justReceivedPromo
      };

      const minimalTokens = {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_type: tokens.token_type,
        expiry_date: Date.now() + (tokens.expires_in * 1000)
      };

      // Set session directly for top-level windows
      if (req.session) {
        req.session.tokens = minimalTokens;
        req.session.user = sessionUser;
      }

      // Store in pending_sessions for sync
      await getDb().execute({
        sql: `INSERT INTO pending_sessions (token, data) VALUES (?, ?)`,
        args: [syncToken, JSON.stringify({
          tokens: minimalTokens,
          user: sessionUser
        })]
      });
      
      // Fire and forget cleanup
      getDb().execute(`DELETE FROM pending_sessions WHERE created_at < datetime('now', '-10 minutes')`).catch(console.error);
      getDb().execute(`DELETE FROM oauth_states WHERE created_at < datetime('now', '-10 minutes')`).catch(console.error);

      // Determine target origin for postMessage
      // Use '*' to ensure delivery across subdomains (e.g. beatgangsta.com vs www.beatgangsta.com)
      const targetOrigin = '*';

      res.send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Signing in...</title>
            <style>
              body { 
                background: #000; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                height: 100vh; 
                margin: 0; 
              }
              .loader {
                border: 2px solid #333;
                border-top: 2px solid #fff;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          </head>
          <body>
            <div class="loader"></div>
            <script>
              const syncData = { type: 'OAUTH_AUTH_SUCCESS', syncToken: '${syncToken}' };
              const targetOrigin = '${targetOrigin}';

              function attemptSync() {
                // 1. Try postMessage (Primary)
                if (window.opener) {
                  window.opener.postMessage(syncData, targetOrigin);
                }

                // 2. Try BroadcastChannel (Fallback)
                try {
                  const bc = new BroadcastChannel('bg_auth_sync');
                  bc.postMessage(syncData);
                } catch (e) {}

                // 3. Try localStorage (Fallback)
                try {
                  localStorage.setItem('bg_auth_sync_data', JSON.stringify({ ...syncData, timestamp: Date.now() }));
                } catch (e) {}
                
                // Close immediately after syncing
                window.close();
              }

              // Run immediately
              attemptSync();
              
              // Safety timeout to close if something hangs
              setTimeout(() => window.close(), 2000);
            </script>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error("OAuth error:", error);
      res.status(500).send(`Authentication failed: ${error.message || "Unknown error"}`);
    }
  });

  app.post("/api/auth/sync", async (req, res) => {
    const { syncToken } = req.body;
    if (!syncToken) {
      return res.status(400).json({ error: "No sync token provided" });
    }

    try {
      const result = await getDb().execute({
        sql: `SELECT data FROM pending_sessions WHERE token = ?`,
        args: [syncToken]
      });

      if (result.rows.length > 0) {
        const sessionData = JSON.parse(result.rows[0].data as string);
        if (req.session) {
          req.session.tokens = sessionData.tokens;
          req.session.user = sessionData.user;
        }
        
        // Delete the token after use
        await getDb().execute({
          sql: `DELETE FROM pending_sessions WHERE token = ?`,
          args: [syncToken]
        });

        res.json({ success: true, user: sessionData.user });
      } else {
        res.status(400).json({ error: "Invalid or expired sync token" });
      }
    } catch (err) {
      console.error("Sync error:", err);
      res.status(500).json({ error: "Internal server error during sync" });
    }
  });

  app.get("/api/auth/status", async (req, res) => {
    console.log("Request to /api/auth/status");
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    if (req.session && req.session.user) {
      if (!req.session.user.uid) {
        console.error("Session user missing UID, clearing session");
        req.session.user = null;
        return res.json({ authenticated: false });
      }
      console.log("User authenticated:", req.session.user.uid);
      try {
        const uid = String(req.session.user.uid);
        console.log("Fetching user from DB for UID:", uid, "Type:", typeof uid);
        // Fetch terms_accepted, credits, role, and purchased_stem_slots from Turso
        const userResult = await getDb().execute({
          sql: `SELECT terms_accepted, credits, role, purchased_stem_slots FROM users WHERE uid = ?`,
          args: [uid]
        });
        const termsAccepted = userResult.rows[0]?.terms_accepted === 1;
        const credits = userResult.rows[0]?.credits ?? 0;
        const role = userResult.rows[0]?.role ?? 'user';
        const purchasedStemSlots = userResult.rows[0]?.purchased_stem_slots ?? 0;
        const userWithConsent = { ...req.session.user, termsAccepted, credits, role, purchasedStemSlots };
        
        if (req.session.user.justReceivedPromo) {
          req.session.user.justReceivedPromo = false;
        }

        res.json({ authenticated: true, user: userWithConsent });
      } catch (err) {
        console.error("Error fetching user from DB:", err);
        res.status(500).json({ authenticated: false, error: "Database error" });
      }
    } else {
      console.log("User not authenticated");
      res.json({ authenticated: false });
    }
  });

  app.get("/api/auth/check-backup", async (req, res) => {
    if (!req.session || !req.session.tokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const google = await getGoogleInstance();
    const { clientId, clientSecret } = getGoogleCredentials();
    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials(req.session.tokens);
    const drive = google.drive({ version: 'v3', auth });
    try {
      const rootFolderRes = await drive.files.list({
        q: "name = 'Beatgangsta Backups' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
        fields: 'files(id, createdTime)',
        spaces: 'drive'
      });
      
      if (rootFolderRes.data.files && rootFolderRes.data.files.length > 0) {
        const rootFolder = rootFolderRes.data.files[0];
        res.json({ hasBackup: true, backupDate: rootFolder.createdTime });
      } else {
        res.json({ hasBackup: false });
      }
    } catch (error: any) {
      console.error("Check backup failed", error);
      res.status(500).json({ error: "Failed to check backup" });
    }
  });

  app.get("/api/cloud/url", async (req, res) => {
    if (!req.session || !req.session.tokens) {
      console.log("Cloud URL request: Not authenticated");
      return res.status(401).json({ error: "Not authenticated" });
    }
    const google = await getGoogleInstance();
    const { clientId, clientSecret } = getGoogleCredentials();
    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials(req.session.tokens);
    const drive = google.drive({ version: 'v3', auth });
    try {
      // Force token refresh if needed
      const { token } = await auth.getAccessToken();
      if (token && req.session.tokens.access_token !== token) {
        req.session.tokens.access_token = token;
      }

      console.log("Cloud URL request: Fetching/Creating 'Beatgangsta Backups' folder...");
      const rootFolderId = await getOrCreateFolder(drive, 'Beatgangsta Backups');
      console.log("Cloud URL request: Success, folder ID:", rootFolderId);
      res.json({ url: `https://drive.google.com/drive/folders/${rootFolderId}` });
    } catch (error: any) {
      console.error("Cloud URL request: Failed", error.message || error);
      res.status(500).json({ error: "Failed to get folder URL", details: error.message });
    }
  });

  app.get("/api/cloud/tutorial-progress", async (req, res) => {
    if (!req.session || !req.session.tokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const google = await getGoogleInstance();
    const { clientId, clientSecret } = getGoogleCredentials();
    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials(req.session.tokens);
    const drive = google.drive({ version: 'v3', auth });
    try {
      const { token } = await auth.getAccessToken();
      if (token && req.session.tokens.access_token !== token) {
        req.session.tokens.access_token = token;
      }
      const rootFolderId = await getOrCreateFolder(drive, 'Beatgangsta Backups');
      const data = await getFileFromFolder(drive, 'tutorial_progress.json', rootFolderId);
      res.json({ data });
    } catch (error: any) {
      console.error("Failed to get tutorial progress", error);
      res.status(500).json({ error: "Failed to get tutorial progress" });
    }
  });

  app.post("/api/cloud/tutorial-progress", async (req, res) => {
    if (!req.session || !req.session.tokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const { progress } = req.body;
    const google = await getGoogleInstance();
    const { clientId, clientSecret } = getGoogleCredentials();
    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials(req.session.tokens);
    const drive = google.drive({ version: 'v3', auth });
    try {
      const { token } = await auth.getAccessToken();
      if (token && req.session.tokens.access_token !== token) {
        req.session.tokens.access_token = token;
      }
      const rootFolderId = await getOrCreateFolder(drive, 'Beatgangsta Backups');
      await uploadFileToFolder(drive, 'tutorial_progress.json', 'application/json', Buffer.from(JSON.stringify(progress, null, 2)), rootFolderId);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Failed to save tutorial progress", error);
      res.status(500).json({ error: "Failed to save tutorial progress" });
    }
  });

  app.delete("/api/cloud/data", async (req, res) => {
    if (!req.session || !req.session.tokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const google = await getGoogleInstance();
    const { clientId, clientSecret } = getGoogleCredentials();
    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials(req.session.tokens);
    const drive = google.drive({ version: 'v3', auth });

    try {
      // Force token refresh if needed
      const { token } = await auth.getAccessToken();
      if (token && req.session.tokens.access_token !== token) {
        req.session.tokens.access_token = token;
      }

      const list = await drive.files.list({
        q: `name = 'Beatgangsta Backups' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: 'files(id)'
      });

      if (list.data.files && list.data.files.length > 0) {
        for (const file of list.data.files) {
          if (file.id) {
            await drive.files.delete({ fileId: file.id });
          }
        }
      }
      res.json({ success: true, message: "Cloud data deleted successfully" });
    } catch (error) {
      console.error("Failed to delete cloud data", error);
      res.status(500).json({ error: "Failed to delete cloud data" });
    }
  });

  app.delete("/api/auth/account", async (req, res) => {
    if (!req.session || !req.session.tokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const google = await getGoogleInstance();
    const { clientId, clientSecret } = getGoogleCredentials();
    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials(req.session.tokens);
    const drive = google.drive({ version: 'v3', auth });

    try {
      // Force token refresh if needed
      const { token } = await auth.getAccessToken();
      if (token && req.session.tokens.access_token !== token) {
        req.session.tokens.access_token = token;
      }

      // 1. Delete all Beatgangsta Backups folders
      const list = await drive.files.list({
        q: `name = 'Beatgangsta Backups' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: 'files(id)'
      });

      if (list.data.files && list.data.files.length > 0) {
        for (const file of list.data.files) {
          if (file.id) {
            await drive.files.delete({ fileId: file.id });
          }
        }
      }

      // 2. Revoke token
      try {
        await auth.revokeCredentials();
      } catch (e) {
        console.error("Failed to revoke credentials", e);
      }

      // 3. Clear session
      req.session = null;

      res.json({ success: true, message: "Account and data deleted successfully" });
    } catch (error) {
      console.error("Failed to delete account", error);
      res.status(500).json({ error: "Failed to delete account" });
    }
  });

  app.post("/api/auth/accept-terms", async (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.uid) {
      console.error("Accept terms: Not authenticated or missing UID");
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      await getDb().execute({
        sql: `UPDATE users SET terms_accepted = 1 WHERE uid = ?`,
        args: [req.session.user.uid]
      });
      console.log(`Accept terms: Success for user ${req.session.user.uid}`);
      res.json({ success: true });
    } catch (err) {
      console.error("Accept terms: Database error", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  // --- Static Policy Routes for Google OAuth Compliance ---
  app.get("/privacy", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Privacy Policy - BeatGangsta</title>
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto; padding: 60px 24px; background: #fcfcfc; }
              h1 { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.05em; border-bottom: 4px solid #f97316; padding-bottom: 20px; margin-bottom: 40px; text-transform: uppercase; }
              h2 { font-size: 1.5rem; font-weight: 900; margin-top: 50px; border-bottom: 1px solid #eee; padding-bottom: 10px; color: #f97316; text-transform: uppercase; letter-spacing: 0.05em; }
              h3 { font-size: 1.1rem; font-weight: 800; margin-top: 30px; color: #444; }
              p { margin-bottom: 20px; color: #555; }
              ul { padding-left: 24px; margin-bottom: 24px; list-style-type: square; }
              li { margin-bottom: 12px; color: #555; }
              a { color: #f97316; text-decoration: none; font-weight: 600; }
              a:hover { text-decoration: underline; }
              strong { color: #222; }
              footer { margin-top: 80px; font-size: 0.9rem; color: #999; border-top: 1px solid #eee; padding-top: 40px; text-align: center; }
          </style>
      </head>
      <body>
          <h1>PRIVACY POLICY</h1>
          <p>Last updated May 4, 2026</p>
          <p>This Privacy Notice for BeatGangsta ("<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>"), describes how and why we might access, collect, store, use, and/or share ("<strong>process</strong>") your personal information when you use our services ("<strong>Services</strong>"), including when you:</p>
          <ul>
            <li>Visit our website at <a href="https://www.beatgangsta.com" target="_blank">https://www.beatgangsta.com</a> or any website of ours that links to this Privacy Notice</li>
            <li>Use BeatGangsta. Generate a personalized guide that utilizes your owned music plugins. Providing parameters for plugins, vocal and instrumental creation guidance with midi files and beat patterns.</li>
            <li>Engage with us on social media, including TikTok, LinkedIn, Facebook, Instagram, and X (formerly Twitter)</li>
            <li>Engage with us in other related ways, including any marketing or events</li>
          </ul>
          <p><strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <a href="mailto:privacy@beatgangsta.com">privacy@beatgangsta.com</a>.</p>

          <h2>SUMMARY OF KEY POINTS</h2>
          <p><strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.</p>
          <p><strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.</p>
          <p><strong>Do we collect any information from third parties?</strong> We do not collect any information from third parties.</p>
          <p><strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so.</p>
          <p><strong>In what situations and with which types of parties do we share personal information?</strong> We may share information in specific situations and with specific categories of third parties.</p>
          <p><strong>How do we keep your information safe?</strong> We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.</p>
          <p><strong>What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.</p>
          <p><strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is by visiting <a href="https://www.beatgangsta.com" target="_blank">https://www.beatgangsta.com</a>, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.</p>

          <h2>1. WHAT INFORMATION DO WE COLLECT?</h2>
          <h3>Personal information you disclose to us</h3>
          <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
          <p><strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
          <ul>
            <li>names</li>
            <li>email addresses</li>
            <li>contact or authentication data</li>
            <li>plugin list (stored securely via Turso)</li>
          </ul>
          <p><strong>Infrastructure Providers.</strong> Our website is hosted on Vercel and our primary database is managed by Turso. These providers process data on our behalf to ensure high availability and performance.</p>
          <p><strong>Sensitive Information.</strong> We do not process sensitive information.</p>
          <p><strong>Social Media Login Data.</strong> We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account. If you choose to register in this way, we will collect certain profile information about you from the social media provider.</p>

          <h3>Information automatically collected</h3>
          <p>We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.</p>
          <p>Like many businesses, we also collect information through cookies and similar technologies. You can find out more about this in our Cookie Notice.</p>

          <h2>2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
          <p>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</p>
          <ul>
            <li>To facilitate account creation and authentication and otherwise manage user accounts via Google Sign-In. <strong>Note: Google Sign-In is mandatory for accessing AI-powered functions and cloud features.</strong></li>
            <li>To provide cloud backup and restore capabilities via Google Drive integration.</li>
            <li>To deliver and facilitate delivery of services to the user.</li>
            <li>To respond to user inquiries/offer support to users.</li>
            <li>To send administrative information to you.</li>
            <li>To request feedback.</li>
            <li>To send you marketing and promotional communications.</li>
            <li>To deliver targeted advertising to you.</li>
            <li>To protect our Services.</li>
            <li>To identify usage trends.</li>
            <li>To determine the effectiveness of our marketing and promotional campaigns.</li>
            <li>To save or protect an individual's vital interest.</li>
          </ul>

          <h2>3. GOOGLE API SERVICES USER DATA POLICY</h2>
          <p>BeatGangsta's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank">Google API Services User Data Policy</a>, including the Limited Use requirements. To comply with the Google API Services User Data Policy, and Google APIs Terms of Service, our privacy policy thoroughly and clearly discloses how our application accesses, uses, stores, or shares Google user data:</p>
          
          <h3>Data Accessed</h3>
          <p>When you choose to sign in using Google, our application requests access to the following specific types of Google user data through standard non-sensitive scopes:</p>
          <ul>
            <li><strong>Email Address</strong> (<code>email</code> scope): We access the primary email address associated with your Google account.</li>
            <li><strong>Profile Information</strong> (<code>profile</code> scope): We access your basic public profile information, specifically your Name and Profile Picture.</li>
            <li><strong>Authentication Data</strong> (<code>openid</code> scope): We access OpenID connect data to securely authenticate your session and verify your identity.</li>
          </ul>
          
          <h3>Data Usage</h3>
          <p>We process and handle this Google user data solely for the following purposes:</p>
          <ul>
            <li><strong>Authentication & Security:</strong> We use your OpenID data and email to securely sign you into our application and verify your identity, eliminating the need for a separate password.</li>
            <li><strong>Account Creation & Identification:</strong> Your email address serves as your unique, primary account identifier within our system. This is structurally necessary to securely link, store, and retrieve your personal studio data (such as your VST plugin library, saved recipes, hardware configurations, and DAW settings) across different devices and sessions.</li>
            <li><strong>User Experience Personalization:</strong> We handle your Name and Profile Picture strictly to personalize the user interface within the application (e.g., displaying your name on your dashboard or your avatar in your profile settings).</li>
          </ul>

          <h3>Data Storage & Sharing</h3>
          <p>Your Google user data (Email, Name, Profile Picture) is securely stored encrypted at rest within our Firebase Authentication and isolated Turso cloud databases.</p>
          <p><strong>We do not share, sell, or transfer your Google user data to any third parties whatsoever</strong>, except where strictly necessary to provide the service infrastructure itself (i.e., data stored on our secure Firebase and Turso servers) or as required by law.</p>
          <p><strong>No data retrieved from Google is used for AI/ML model training or secondary marketing/advertising purposes.</strong></p>
          
          <p><strong>Google Drive:</strong> If authorized by you, we use the <code>drive.file</code> scope to allow you to backup and restore your music plugin configurations and beat recipes. We only access files created or opened by BeatGangsta. We do not scan or access your other private files on Google Drive.</p>

          <h2>4. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?</h2>
          <p>We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.</p>

          <h2>5. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
          <p>We share and/or sell your personal information with third-party vendors, service providers, contractors, research partners, or agents ("third parties") who perform services for us or who purchase data from us for the purpose of research, marketing, and commercial analysis.</p>
          <p><strong>Commercial Sale of Data:</strong> You explicitly acknowledge and agree that BeatGangsta may sell your name, email address, and music plugin information to third parties for commercial purposes.</p>
          <p>The categories of third parties we may share or sell personal information with are as follows:</p>
          <ul>
            <li>Ad Networks</li>
            <li>User Account Registration & Authentication Services</li>
            <li>Website Hosting & Security Providers (Cloudflare)</li>
            <li>Data Analytics Services</li>
            <li>Cloud Computing Services</li>
            <li>AI Platforms</li>
            <li>Data Storage Service Providers</li>
            <li>Retargeting Platforms</li>
            <li>Performance Monitoring Tools</li>
            <li>Social Networks</li>
            <li>Payment Processors</li>
            <li>Affiliate Marketing Programs</li>
          </ul>

          <h2>6. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES AND SOCIAL MEDIA?</h2>
          <p>The Services may link to third-party websites, online services, or mobile applications and/or contain advertisements from third parties that are not affiliated with us and which may link to other websites, services, or applications. We are not responsible for the content or privacy and security practices and policies of any third parties.</p>
          <p><strong>Social Media Interactions:</strong> When you interact with our official pages on TikTok, LinkedIn, Facebook, Instagram, or X (formerly Twitter), the respective platform's privacy policy applies to your interaction. These platforms may collect data about your visit even if you do not click the links, especially if you are logged into their services. We do not control the data collection or processing practices of these third-party platforms.</p>

          <h2>7. ADVERTISING AND COOKIES</h2>
          <p>We use third-party advertising companies to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>
          <ul>
            <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank">Ads Settings</a>. (Alternatively, you can direct users to opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="http://www.aboutads.info" target="_blank">www.aboutads.info</a>.)</li>
          </ul>

          <h2>8. BOT PROTECTION AND SECURITY</h2>
          <p>We use Cloudflare Turnstile, a bot protection service, to protect our Services from spam and abuse. Turnstile works by collecting certain information from your browser and device to determine if you are a human or a bot. This processing is necessary for our legitimate interest in maintaining the security of our Services.</p>
          <p>By using our Services, you acknowledge that your data may be processed by Cloudflare in accordance with their <a href="https://www.cloudflare.com/privacypolicy/" target="_blank">Privacy Policy</a>.</p>

          <h2>9. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
          <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.</p>

          <h2>10. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</h2>
          <p>As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies ("AI Products").</p>
          <p><strong>Use of AI Technologies:</strong> We provide the AI Products through third-party service providers, including Google Gemini API. Your input, output, and personal information will be shared with and processed by these AI Service Providers (Google) to provide the service. This application is hosted on Google Cloud Run.</p>
          <p><strong>Mandatory Authentication:</strong> To ensure security, rate limiting, and personalized guidance, use of AI Products (including 'Generate Recipe', 'Deep Dive', and 'AI Architect' features) requires a mandatory Google Sign-In. There is no unauthenticated or completely local storage mode for these features.</p>
          <p><strong>How to Opt Out:</strong> Users can opt out of AI-based processing by choosing not to use the AI-powered features. Users may also request the deletion of their account and all associated data by contacting us at <a href="mailto:legal@beatgangsta.com">legal@beatgangsta.com</a>.</p>

          <h2>11. HOW DO WE HANDLE YOUR SOCIAL LOGINS AND INTERACTIONS?</h2>
          <p>If you choose to register or log in to our Services using a social media account (currently Google Sign-In is the primary method), we may have access to certain information about you, such as your name, email address, and profile picture. We also interact with users via TikTok, LinkedIn, Facebook, Instagram, and X (formerly Twitter).</p>
          <p><strong>Data Collection by Social Platforms:</strong> By clicking on social media icons or links on our site, you may be sharing information with those platforms. These platforms may use cookies, web beacons, and other storage technologies to collect or receive information from our Services and elsewhere on the internet and use that information to provide measurement services and target ads. You can opt-out of the collection and use of information for ad targeting through your platform settings.</p>

          <h2>12. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?</h2>
          <p>Our servers are located in the United States. Regardless of your location, please be aware that your information may be transferred to, stored by, and processed by us in our facilities and in the facilities of the third parties with whom we may share your personal information.</p>
          <p>We use the European Commission's Standard Contractual Clauses for transfers of personal information. Our Data Processing Agreements are available here: <a href="https://cloud.google.com/terms/data-processing-addendum" target="_blank">https://cloud.google.com/terms/data-processing-addendum</a>.</p>

          <h2>13. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
          <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law.</p>

          <h2>14. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
          <p>We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process.</p>

          <h2>15. DO WE COLLECT INFORMATION FROM MINORS?</h2>
          <p>We do not knowingly collect data from or market to children under 18 years of age.</p>

          <h2>16. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
          <p>In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws, including the right to request access, rectification, or erasure of your personal information.</p>

          <h2>17. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
          <p>Most web browsers include a Do-Not-Track ("DNT") feature. We do not currently respond to DNT browser signals. However, we recognize and honor Global Privacy Control (GPC) signals.</p>

          <h2>18. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h2>
          <p>If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have specific rights regarding your personal information.</p>

          <h2>19. API KEY RESPONSIBILITY & LIABILITY</h2>
          <p>BeatGangsta uses a token-based credit system to manage access to AI-powered features. Credits can be purchased through our payment providers, Lemon Squeezy and NOWPayments.</p>
          <p><strong>User Responsibility:</strong> You are solely responsible for the security, confidentiality, and usage of your account and any credits purchased.</p>
          <p><strong>Payments:</strong> Payments are processed securely through Lemon Squeezy (Card) and NOWPayments (Crypto). We do not store your credit card or crypto wallet private keys on our servers.</p>
          <p><strong>Transaction Processing:</strong> By making a purchase, you agree to the terms and privacy policies of Lemon Squeezy and/or NOWPayments.</p>
          <p><strong>No Liability for Costs:</strong> You are solely responsible for any costs, fees, or charges incurred on your account resulting from the use of your credits within this application.</p>

          <h2>20. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
          <p>Yes, we will update this notice as necessary to stay compliant with relevant laws.</p>

          <h2>21. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
          <p>If you have questions or comments about this notice, you may email us at <a href="mailto:privacy@beatgangsta.com">privacy@beatgangsta.com</a>.</p>

          <h2>22. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
          <p>To request to review, update, or delete your personal information, please email us at <a href="mailto:legal@beatgangsta.com">legal@beatgangsta.com</a> or visit: <a href="https://www.beatgangsta.com" target="_blank">https://www.beatgangsta.com</a>.</p>

          <footer>
              <p>&copy; 2026 BeatGangsta. All rights reserved.</p>
          </footer>
      </body>
      </html>
    `);
  });

  app.get("/terms", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Terms of Service - BeatGangsta</title>
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto; padding: 60px 24px; background: #fcfcfc; }
              h1 { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.05em; border-bottom: 4px solid #f97316; padding-bottom: 20px; margin-bottom: 40px; text-transform: uppercase; }
              h2 { font-size: 1.5rem; font-weight: 900; margin-top: 50px; border-bottom: 1px solid #eee; padding-bottom: 10px; color: #f97316; text-transform: uppercase; letter-spacing: 0.05em; }
              h3 { font-size: 1.1rem; font-weight: 800; margin-top: 30px; color: #444; }
              p { margin-bottom: 20px; color: #555; }
              ul { padding-left: 24px; margin-bottom: 24px; list-style-type: square; }
              li { margin-bottom: 12px; color: #555; }
              a { color: #f97316; text-decoration: none; font-weight: 600; }
              a:hover { text-decoration: underline; }
              strong { color: #222; }
              footer { margin-top: 80px; font-size: 0.9rem; color: #999; border-top: 1px solid #eee; padding-top: 40px; text-align: center; }
              .toc { background: #f9f9f9; padding: 30px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 40px; }
              .toc h2 { margin-top: 0; border-bottom: none; font-size: 1.2rem; }
              .toc-link { display: block; margin-bottom: 8px; font-size: 0.95rem; }
          </style>
      </head>
      <body>
          <h1>TERMS OF USE</h1>
          <p>Last updated May 4, 2026</p>
          
          <h2>AGREEMENT TO OUR LEGAL TERMS</h2>
          <p>We are BeatGangsta. We operate the website at <a href="https://www.beatgangsta.com" target="_blank">https://www.beatgangsta.com</a>, as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").</p>
          <p>You can contact us by email at <a href="mailto:legal@beatgangsta.com">legal@beatgangsta.com</a> or by using the contact us form located at the bottom of the webpage <a href="https://www.beatgangsta.com" target="_blank">www.beatgangsta.com</a>.</p>
          <p>These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and BeatGangsta, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.</p>
          <p>Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Legal Terms by your continued use of the Services after the date such revised Legal Terms are posted.</p>
          <p>We recommend that you print a copy of these Legal Terms for your records.</p>
          
          <div class="toc">
            <h2>TABLE OF CONTENTS</h2>
            <a class="toc-link" href="#services">1. OUR SERVICES</a>
            <a class="toc-link" href="#ip">2. INTELLECTUAL PROPERTY RIGHTS</a>
            <a class="toc-link" href="#userreps">3. USER REPRESENTATIONS</a>
            <a class="toc-link" href="#prohibited">4. PROHIBITED ACTIVITIES</a>
            <a class="toc-link" href="#ugc">5. USER GENERATED CONTRIBUTIONS</a>
            <a class="toc-link" href="#license">6. CONTRIBUTION LICENSE</a>
            <a class="toc-link" href="#google">7. GOOGLE SERVICES AND MANDATORY LOGIN</a>
            <a class="toc-link" href="#sitemanage">8. SERVICES MANAGEMENT</a>
            <a class="toc-link" href="#terms">9. TERM AND TERMINATION</a>
            <a class="toc-link" href="#modifications">10. MODIFICATIONS AND INTERRUPTIONS</a>
            <a class="toc-link" href="#law">11. GOVERNING LAW</a>
            <a class="toc-link" href="#disputes">12. DISPUTE RESOLUTION</a>
            <a class="toc-link" href="#corrections">13. CORRECTIONS</a>
            <a class="toc-link" href="#ai">14. AI-GENERATED CONTENT AND ADVERTISING</a>
            <a class="toc-link" href="#security">15. SECURITY AND BOT PROTECTION</a>
            <a class="toc-link" href="#disclaimer">16. DISCLAIMER</a>
            <a class="toc-link" href="#liability">17. LIMITATIONS OF LIABILITY</a>
            <a class="toc-link" href="#indemnification">18. INDEMNIFICATION</a>
            <a class="toc-link" href="#userdata">19. USER DATA</a>
            <a class="toc-link" href="#electronic">20. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</a>
            <a class="toc-link" href="#misc">21. MISCELLANEOUS</a>
            <a class="toc-link" href="#contact">22. CONTACT US</a>
          </div>

          <h2 id="services">1. OUR SERVICES</h2>
          <p>The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.</p>

          <h2 id="ip">2. INTELLECTUAL PROPERTY RIGHTS</h2>
          <h3>Our intellectual property</h3>
          <p>We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").</p>
          <p>Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties around the world.</p>
          <p><strong>Third-Party Trademarks:</strong> All third-party trademarks, service marks, logos, and brand names used on the Services (including but not limited to TikTok, LinkedIn, Facebook, Instagram, X, and Google) are the property of their respective owners. Use of these names, trademarks, and brands does not imply endorsement.</p>
          <h3>Your use of our Services</h3>
          <p>Subject to your compliance with these Legal Terms, including the "PROHIBITED ACTIVITIES" section below, we grant you a non-exclusive, non-transferable, revocable license to:</p>
          <ul>
            <li>access the Services; and</li>
            <li>download or print a copy of any portion of the Content to which you have properly gained access,</li>
          </ul>
          <p>solely for your personal, non-commercial use or internal business purpose.</p>

          <h2 id="userreps">3. USER REPRESENTATIONS</h2>
          <p>By using the Services, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Legal Terms; (2) you are not a minor in the jurisdiction in which you reside; (3) you will not access the Services through automated or non-human means, whether through a bot, script or otherwise; (4) you will not use the Services for any illegal or unauthorized purpose; and (5) your use of the Services will not violate any applicable law or regulation.</p>

          <h2 id="prohibited">4. PROHIBITED ACTIVITIES</h2>
          <p>You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>

          <h2 id="ugc">5. USER GENERATED CONTRIBUTIONS</h2>
          <p>The Services may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Services, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions").</p>

          <h2 id="license">6. CONTRIBUTION LICENSE</h2>
          <p>You and BeatGangsta agree that we may access, store, process, and use any information and personal data that you provide and your choices (including settings).</p>
          <p>By submitting suggestions or other feedback regarding the Services, you agree that we can use and share such feedback for any purpose without compensation to you.</p>

          <h2 id="google">7. GOOGLE SERVICES AND SOCIAL MEDIA PLATFORMS</h2>
          <p><strong>Google Sign-In:</strong> By using Google Sign-In, you authorize us to access your basic profile information (name, email, profile picture) for authentication purposes. <strong>Google Sign-In is mandatory to access AI-powered features and cloud synchronization services. There is no completely local storage mode for these specific functions.</strong></p>
          <p><strong>Google Drive:</strong> Our backup feature uses the Google Drive API. We only request access to files created by our application (<code>drive.file</code> scope). You maintain full ownership of your data. You can revoke access at any time through your Google Account security settings.</p>
          <p><strong>Social Media Platforms:</strong> Your use of social media features (e.g., clicking "Follow" or "Share" links) is governed by the terms and privacy policies of the respective platforms (TikTok, LinkedIn, Facebook, Instagram, X). You agree to comply with all third-party terms of service when interacting with our brand on these platforms.</p>

          <h2 id="sitemanage">8. SERVICES MANAGEMENT</h2>
          <p>We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms, including without limitation, reporting such user to law enforcement authorities; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof; (4) in our sole discretion and without limitation, notice, or liability, to remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services.</p>

          <h2 id="terms">9. TERM AND TERMINATION</h2>
          <p>These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON.</p>

          <h2 id="modifications">10. MODIFICATIONS AND INTERRUPTIONS</h2>
          <p>We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Services. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.</p>

          <h2 id="law">11. GOVERNING LAW</h2>
          <p>These Legal Terms shall be governed by and defined following the laws of the State of California and the United States. BeatGangsta and yourself irrevocably consent that the courts of California and the United States shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.</p>

          <h2 id="disputes">12. DISPUTE RESOLUTION</h2>
          <h3>Informal Negotiations</h3>
          <p>To expedite resolution and control the cost of any dispute, controversy, or claim related to these Legal Terms (each a "Dispute" and collectively, the "Disputes"), the Parties agree to first attempt to negotiate any Dispute informally for at least 30 days before initiating arbitration.</p>

          <h2 id="corrections">13. CORRECTIONS</h2>
          <p>There may be information on the Services that contains typographical errors, inaccuracies, or omissions. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.</p>

          <h2 id="ai">14. AI-GENERATED CONTENT AND ADVERTISING</h2>
          <p><strong>AI Content:</strong> Our Services utilize the Google Gemini API to generate content. You acknowledge that AI-generated content may be inaccurate, incomplete, or biased. We do not guarantee the accuracy of any AI-generated output. <strong>Access to AI content generation requires a mandatory Google Sign-In and a valid credit balance.</strong> You agree that BeatGangsta is not liable for any damages or losses resulting from your reliance on AI-generated content.</p>
          <p><strong>Payments & Transactions:</strong> Payments for credits are processed securely through Lemon Squeezy and NOWPayments. All transactions are final unless otherwise stated by the payment provider.</p>
          <p><strong>Advertising:</strong> We use Google AdSense to serve advertisements. Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our sites and/or other sites on the Internet.</p>

          <h2 id="security">15. SECURITY AND BOT PROTECTION</h2>
          <p>We utilize Cloudflare Turnstile to protect our Services from automated abuse and spam. By accessing our Services, you agree to comply with Cloudflare's security measures and acknowledge that your interaction with the verification process is subject to Cloudflare's terms and privacy policies.</p>

          <h2 id="disclaimer">16. DISCLAIMER</h2>
          <p>THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF.</p>

          <h2 id="liability">17. LIMITATIONS OF LIABILITY</h2>
          <p>IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES.</p>

          <h2 id="indemnification">18. INDEMNIFICATION</h2>
          <p>You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand.</p>

          <h2 id="userdata">19. USER DATA AND COMMERCIALIZATION</h2>
          <p>We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. You expressly agree that we may sell user data (specifically names, email addresses, and music plugin list information) to third parties for commercial purposes.</p>

          <h2 id="electronic">20. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</h2>
          <p>Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES. You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means. Transactions are processed via Lemon Squeezy and NOWPayments.</p>

          <h2 id="misc">21. MISCELLANEOUS</h2>
          <p>These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us.</p>

          <h2 id="contact">22. CONTACT US</h2>
          <p>In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:</p>
          <p>
            <strong>BeatGangsta</strong><br>
            Email: <a href="mailto:legal@beatgangsta.com">legal@beatgangsta.com</a><br>
            Web: <a href="https://www.beatgangsta.com" target="_blank">www.beatgangsta.com</a> (Contact form at bottom of page)
          </p>

          <footer>
              <p>&copy; 2026 BeatGangsta. All rights reserved.</p>
          </footer>
      </body>
      </html>
    `);
  });

  app.get("/cookies", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cookie Policy - BeatGangsta</title>
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
              h1 { border-bottom: 2px solid #eee; padding-bottom: 10px; }
              h2 { margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
              footer { margin-top: 50px; font-size: 0.8em; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
      </head>
      <body>
          <h1>Cookie Policy</h1>
          <p>Last updated: March 21, 2026</p>
          <p>BeatGangsta uses cookies and similar technologies to provide and improve our services. This policy explains how we use these technologies.</p>
          
          <h2>1. What are Cookies?</h2>
          <p>Cookies are small text files that are stored on your device when you visit a website. They help the website recognize your device and remember information about your visit.</p>

          <h2>2. How We Use Cookies</h2>
          <p>We use cookies for the following purposes:</p>
          <ul>
              <li><strong>Authentication:</strong> To keep you logged in via Google OAuth.</li>
              <li><strong>Preferences:</strong> To remember your theme settings and UI preferences.</li>
              <li><strong>Security:</strong> To protect your account and our services.</li>
          </ul>

          <h2>3. Managing Cookies</h2>
          <p>Most web browsers allow you to control cookies through their settings. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.</p>

          <footer>
              <p>&copy; 2026 BeatGangsta. All rights reserved.</p>
          </footer>
      </body>
      </html>
    `);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session = null;
    res.json({ success: true });
  });

  // --- Cloud Backup/Restore Routes ---
  
  async function getOrCreateFolder(drive: any, folderName: string, parentId?: string) {
    try {
      // Escape single quotes for Google Drive query
      const escapedName = folderName.replace(/'/g, "\\'");
      const query = parentId 
        ? `name = '${escapedName}' and '${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
        : `name = '${escapedName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
        
      console.log(`getOrCreateFolder: Searching for folder "${folderName}" (parentId: ${parentId || 'root'})`);
      const res = await drive.files.list({
        q: query,
        fields: 'files(id, name)',
        spaces: 'drive'
      });
      
      if (res.data.files && res.data.files.length > 0) {
        console.log(`getOrCreateFolder: Found existing folder "${folderName}" with ID: ${res.data.files[0].id}`);
        return res.data.files[0].id;
      }
      
      console.log(`getOrCreateFolder: Folder "${folderName}" not found, creating it...`);
      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentId ? [parentId] : undefined
      };
      
      const folder = await drive.files.create({
        requestBody: fileMetadata,
        fields: 'id'
      });
      
      console.log(`getOrCreateFolder: Created folder "${folderName}" with ID: ${folder.data.id}`);
      return folder.data.id;
    } catch (error: any) {
      console.error(`getOrCreateFolder: Error for "${folderName}":`, error.message || error);
      throw error;
    }
  }

  async function makePublic(drive: any, fileId: string) {
    try {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
      console.log(`makePublic: File/Folder ${fileId} is now public (anyone with link).`);
    } catch (error: any) {
      // Ignore errors if permission already exists or other non-critical issues
      console.warn(`makePublic: Could not set public permission for ${fileId}:`, error.message);
    }
  }

  async function uploadFileToFolder(drive: any, fileName: string, mimeType: string, content: Buffer, parentId: string) {
    try {
      const escapedName = fileName.replace(/'/g, "\\'");
      const res = await drive.files.list({
        q: `name = '${escapedName}' and '${parentId}' in parents and trashed = false`,
        fields: 'files(id)'
      });
      
      const media = {
        mimeType: mimeType,
        body: Readable.from(content)
      };
      
      if (res.data.files && res.data.files.length > 0) {
        console.log(`uploadFileToFolder: Updating existing file "${fileName}" (ID: ${res.data.files[0].id})`);
        await drive.files.update({
          fileId: res.data.files[0].id,
          media: media,
          fields: 'id'
        });
        return res.data.files[0].id;
      } else {
        console.log(`uploadFileToFolder: Creating new file "${fileName}" in folder ${parentId}`);
        const resCreate = await drive.files.create({
          requestBody: {
            name: fileName,
            parents: [parentId]
          },
          media: media,
          fields: 'id'
        });
        return resCreate.data.id;
      }
    } catch (error: any) {
      console.error(`uploadFileToFolder: Error for "${fileName}":`, error.message || error);
      throw error;
    }
  }

  async function getFileFromFolder(drive: any, fileName: string, parentId: string) {
    const res = await drive.files.list({
      q: `name = '${fileName}' and '${parentId}' in parents and trashed = false`,
      fields: 'files(id)',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      spaces: 'drive'
    });
    if (res.data.files && res.data.files.length > 0) {
      const fileId = res.data.files[0].id;
      const response = await drive.files.get({
        fileId: fileId,
        alt: 'media',
        supportsAllDrives: true
      });
      return response.data;
    }
    return null;
  }

  // Helper to format Google API errors for BYOK users
  const handleGoogleError = (res: any, error: any, context: string) => {
    console.error(`${context}: Failed`, error.message || error);
    
    let message = `Failed to ${context.toLowerCase()}.`;
    let details = error.message || "Unknown error";
    
    // Check for "API not enabled" error
    if (details.includes("disabled") || details.includes("not been used in project")) {
      message = "Google Drive API is not enabled for your project.";
      details = "As the App Owner, you must enable the Drive API in your Google Cloud Console. Regular users will not see this error once you enable it. " + details;
    }

    res.status(500).json({ error: message, details });
  };

  app.post("/api/cloud/backup", async (req, res) => {
    if (!req.session || !req.session.tokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { data, preferences } = req.body;
    const google = await getGoogleInstance();
    const { clientId, clientSecret } = getGoogleCredentials();
    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials(req.session.tokens);
    const drive = google.drive({ version: 'v3', auth });

    try {
      // Force token refresh if needed
      const { token } = await auth.getAccessToken();
      if (token && req.session.tokens.access_token !== token) {
        req.session.tokens.access_token = token;
      }

      console.log("Manual Backup: Starting...");
      const rootFolderId = await getOrCreateFolder(drive, 'Beatgangsta Backups');
      
      // Make the root backup folder public so friends can sync from it
      await makePublic(drive, rootFolderId);
      
      // If preferences aren't provided, assume full backup
      const backupPrefs = preferences || { gear: true, settings: true, recipes: true, critiques: true };

      if (backupPrefs.settings && data.ui) {
        console.log("Manual Backup: Saving settings...");
        const settingsFolderId = await getOrCreateFolder(drive, 'Settings', rootFolderId);
        await uploadFileToFolder(drive, 'settings.json', 'application/json', Buffer.from(JSON.stringify(data.ui, null, 2)), settingsFolderId);
      }

      if (backupPrefs.gear && data.gear) {
        console.log("Manual Backup: Saving gear...");
        const gearFolderId = await getOrCreateFolder(drive, 'Gear', rootFolderId);
        await uploadFileToFolder(drive, 'gear.json', 'application/json', Buffer.from(JSON.stringify(data.gear, null, 2)), gearFolderId);
      }

      if (backupPrefs.recipes && data.vault && data.vault.recipes) {
        console.log("Manual Backup: Saving recipes...");
        const recipesFolderId = await getOrCreateFolder(drive, 'Recipes', rootFolderId);
        for (const recipe of data.vault.recipes) {
          const safeName = recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          const recipeFolderId = await getOrCreateFolder(drive, safeName, recipesFolderId);
          await uploadFileToFolder(drive, 'recipe.json', 'application/json', Buffer.from(JSON.stringify(recipe, null, 2)), recipeFolderId);
        }
      }

      if (backupPrefs.critiques && data.vault && data.vault.critiques) {
        console.log("Manual Backup: Saving critiques...");
        const critiquesFolderId = await getOrCreateFolder(drive, 'Critiques', rootFolderId);
        for (const critique of data.vault.critiques) {
          const safeName = critique.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          const critiqueFolderId = await getOrCreateFolder(drive, safeName, critiquesFolderId);
          await uploadFileToFolder(drive, 'critique.json', 'application/json', Buffer.from(JSON.stringify(critique, null, 2)), critiqueFolderId);
        }
      }

      console.log("Manual Backup: Success!");
      res.json({ success: true, folderUrl: `https://drive.google.com/drive/folders/${rootFolderId}` });
    } catch (error: any) {
      handleGoogleError(res, error, "Manual Backup");
    }
  });

  app.get("/api/cloud/fetch-rig", async (req, res) => {
    const { folderId } = req.query;
    if (!folderId || typeof folderId !== 'string') {
      return res.status(400).json({ error: "Folder ID is required" });
    }

    if (!req.session || !req.session.tokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const google = await getGoogleInstance();
    const { clientId, clientSecret } = getGoogleCredentials();
    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials(req.session.tokens);
    const drive = google.drive({ version: 'v3', auth });

    try {
      console.log(`Fetch Rig: Attempting to fetch from folder ${folderId}`);
      
      // First, try to get the folder itself to verify access
      let folderMeta;
      try {
        const res = await drive.files.get({ 
          fileId: folderId, 
          fields: 'id, name, mimeType',
          supportsAllDrives: true 
        });
        folderMeta = res.data;
        console.log(`Fetch Rig: Found folder "${folderMeta.name}" (${folderMeta.mimeType})`);
      } catch (e: any) {
        console.error("Fetch Rig: Could not access the provided folder ID:", e.message);
        return res.status(404).json({ 
          error: "Could not access the provided rig link. Make sure it is shared correctly (Anyone with the link) and that you are logged in.",
          details: e.message 
        });
      }

      // If the user shared the 'Gear' folder directly
      if (folderMeta.name === 'Gear') {
        console.log("Fetch Rig: User shared the 'Gear' folder directly.");
        const gearData = await getFileFromFolder(drive, 'gear.json', folderId);
        if (!gearData) {
          return res.status(404).json({ error: "gear.json not found in the provided Gear folder." });
        }
        return res.json({ success: true, gear: gearData, recipes: [] });
      }

      // List all children to be sure we find what we need
      const childrenRes = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType)',
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
        spaces: 'drive'
      });

      const children = childrenRes.data.files || [];
      console.log(`Fetch Rig: Found ${children.length} items in folder ${folderId}`);
      
      // Check if gear.json is directly in this folder (maybe they shared the Gear folder but it's named differently)
      const directGearData = children.find(f => f.name === 'gear.json');
      if (directGearData) {
        console.log("Fetch Rig: Found gear.json directly in the shared folder.");
        const response = await drive.files.get({
          fileId: directGearData.id,
          alt: 'media',
          supportsAllDrives: true
        });
        return res.json({ success: true, gear: response.data, recipes: [] });
      }

      const gearFolder = children.find(f => f.name === 'Gear' && f.mimeType === 'application/vnd.google-apps.folder');
      
      if (!gearFolder) {
        console.warn(`Fetch Rig: 'Gear' folder not found among children: ${children.map(c => c.name).join(', ')}`);
        return res.status(404).json({ error: "Gear folder not found in the provided rig link. Make sure your friend has performed a backup and shared the correct folder." });
      }

      const gearFolderId = gearFolder.id!;
      const gearData = await getFileFromFolder(drive, 'gear.json', gearFolderId);
      
      if (!gearData) {
        return res.status(404).json({ error: "gear.json not found inside the Gear folder." });
      }

      const recipes: any[] = [];
      const recipesFolder = children.find(f => f.name === 'Recipes' && f.mimeType === 'application/vnd.google-apps.folder');

      if (recipesFolder) {
        const recipesFolderId = recipesFolder.id!;
        const recipeFoldersRes = await drive.files.list({ 
          q: `'${recipesFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`, 
          fields: 'files(id)',
          supportsAllDrives: true,
          includeItemsFromAllDrives: true,
          spaces: 'drive'
        });
        
        for (const folder of recipeFoldersRes.data.files || []) {
          const recipeData = await getFileFromFolder(drive, 'recipe.json', folder.id!);
          if (recipeData) recipes.push(recipeData);
        }
      }

      res.json({ success: true, gear: gearData, recipes });
    } catch (error: any) {
      handleGoogleError(res, error, "Fetch Friend Rig");
    }
  });

  app.post("/api/cloud/backup/recipe", async (req, res) => {
    if (!req.session || !req.session.tokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { recipe, midiFiles, loopFiles } = req.body;
    const google = await getGoogleInstance();
    const { clientId, clientSecret } = getGoogleCredentials();
    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials(req.session.tokens);
    const drive = google.drive({ version: 'v3', auth });

    try {
      // Force token refresh if needed
      const { token } = await auth.getAccessToken();
      if (token && req.session.tokens.access_token !== token) {
        req.session.tokens.access_token = token;
      }

      const rootFolderId = await getOrCreateFolder(drive, 'Beatgangsta Backups');
      // Ensure root is public
      await makePublic(drive, rootFolderId);
      
      const recipesFolderId = await getOrCreateFolder(drive, 'Recipes', rootFolderId);
      const safeName = recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const recipeFolderId = await getOrCreateFolder(drive, safeName, recipesFolderId);

      await uploadFileToFolder(drive, 'recipe.json', 'application/json', Buffer.from(JSON.stringify(recipe, null, 2)), recipeFolderId);

      if (midiFiles && midiFiles.length > 0) {
        const midiFolderId = await getOrCreateFolder(drive, 'MIDI', recipeFolderId);
        for (const file of midiFiles) {
          await uploadFileToFolder(drive, file.name, 'audio/midi', Buffer.from(file.data, 'base64'), midiFolderId);
        }
      }

      if (loopFiles && loopFiles.length > 0) {
        const loopsFolderId = await getOrCreateFolder(drive, 'Musicloops', recipeFolderId);
        for (const file of loopFiles) {
          await uploadFileToFolder(drive, file.name, 'application/octet-stream', Buffer.from(file.data, 'base64'), loopsFolderId);
        }
      }

      res.json({ success: true });
    } catch (error: any) {
      handleGoogleError(res, error, "Recipe Backup");
    }
  });

  app.post("/api/cloud/backup/critique", async (req, res) => {
    if (!req.session || !req.session.tokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { critique } = req.body;
    const google = await getGoogleInstance();
    const { clientId, clientSecret } = getGoogleCredentials();
    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials(req.session.tokens);
    const drive = google.drive({ version: 'v3', auth });

    try {
      // Force token refresh if needed
      const { token } = await auth.getAccessToken();
      if (token && req.session.tokens.access_token !== token) {
        req.session.tokens.access_token = token;
      }

      const rootFolderId = await getOrCreateFolder(drive, 'Beatgangsta Backups');
      // Ensure root is public
      await makePublic(drive, rootFolderId);
      
      const critiquesFolderId = await getOrCreateFolder(drive, 'Critiques', rootFolderId);
      const safeName = critique.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const critiqueFolderId = await getOrCreateFolder(drive, safeName, critiquesFolderId);

      await uploadFileToFolder(drive, 'critique.json', 'application/json', Buffer.from(JSON.stringify(critique, null, 2)), critiqueFolderId);

      res.json({ success: true });
    } catch (error: any) {
      handleGoogleError(res, error, "Critique Backup");
    }
  });

  app.get("/api/cloud/restore", async (req, res) => {
    if (!req.session || !req.session.tokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const google = await getGoogleInstance();
    const { clientId, clientSecret } = getGoogleCredentials();
    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials(req.session.tokens);
    const drive = google.drive({ version: 'v3', auth });

    try {
      // Force token refresh if needed
      const { token } = await auth.getAccessToken();
      if (token && req.session.tokens.access_token !== token) {
        req.session.tokens.access_token = token;
      }

      const rootRes = await drive.files.list({
        q: `name = 'Beatgangsta Backups' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
        fields: 'files(id)'
      });

      if (!rootRes.data.files || rootRes.data.files.length === 0) {
        return res.status(404).json({ error: "No backup found in cloud." });
      }

      const rootFolderId = rootRes.data.files[0].id;
      const restoredData: any = { version: "1.0", timestamp: Date.now(), vault: { recipes: [], critiques: [] } };

      // Get Settings
      const settingsFolderRes = await drive.files.list({ q: `name = 'Settings' and '${rootFolderId}' in parents and trashed = false`, fields: 'files(id)' });
      if (settingsFolderRes.data.files && settingsFolderRes.data.files.length > 0) {
        const settingsData = await getFileFromFolder(drive, 'settings.json', settingsFolderRes.data.files[0].id!);
        if (settingsData) restoredData.uiSettings = settingsData;
      }

      // Get Gear
      const gearFolderRes = await drive.files.list({ q: `name = 'Gear' and '${rootFolderId}' in parents and trashed = false`, fields: 'files(id)' });
      if (gearFolderRes.data.files && gearFolderRes.data.files.length > 0) {
        const gearData = await getFileFromFolder(drive, 'gear.json', gearFolderRes.data.files[0].id!);
        if (gearData) restoredData.gear = gearData;
      }

      // Get Recipes
      const recipesFolderRes = await drive.files.list({ q: `name = 'Recipes' and '${rootFolderId}' in parents and trashed = false`, fields: 'files(id)' });
      if (recipesFolderRes.data.files && recipesFolderRes.data.files.length > 0) {
        const recipesFolderId = recipesFolderRes.data.files[0].id!;
        const recipeFolders = await drive.files.list({ q: `'${recipesFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`, fields: 'files(id, name)' });
        
        if (recipeFolders.data.files) {
          for (const folder of recipeFolders.data.files) {
            const recipeData = await getFileFromFolder(drive, 'recipe.json', folder.id!);
            if (recipeData) restoredData.vault.recipes.push(recipeData);
          }
        }
      }

      // Get Critiques
      const critiquesFolderRes = await drive.files.list({ q: `name = 'Critiques' and '${rootFolderId}' in parents and trashed = false`, fields: 'files(id)' });
      if (critiquesFolderRes.data.files && critiquesFolderRes.data.files.length > 0) {
        const critiquesFolderId = critiquesFolderRes.data.files[0].id!;
        const critiqueFolders = await drive.files.list({ q: `'${critiquesFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`, fields: 'files(id, name)' });
        
        if (critiqueFolders.data.files) {
          for (const folder of critiqueFolders.data.files) {
            const critiqueData = await getFileFromFolder(drive, 'critique.json', folder.id!);
            if (critiqueData) restoredData.vault.critiques.push(critiqueData);
          }
        }
      }

      res.json({ data: restoredData });
    } catch (error: any) {
      handleGoogleError(res, error, "Cloud Restore");
    }
  });

  app.get("/api/admin/spend-stats", async (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.uid) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (req.session.user.role !== 'admin') {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    try {
      const result = await getDb().execute(`
        SELECT u.name, u.email, s.action, s.total_spent, s.usage_count 
        FROM user_feature_spend s
        JOIN users u ON s.uid = u.uid
        ORDER BY s.total_spent DESC
      `);
      
      res.json({ stats: result.rows });
    } catch (err) {
      console.error("Failed to fetch spend stats:", err);
      res.status(500).json({ error: "Failed to fetch spend stats" });
    }
  });

  app.get("/api/receipts", async (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.uid) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const uid = String(req.session.user.uid);
      const result = await getDb().execute({
        sql: `SELECT id, action, cost, date FROM receipts WHERE uid = ? ORDER BY date DESC LIMIT 50`,
        args: [uid]
      });
      
      res.json({ receipts: result.rows });
    } catch (err) {
      console.error("Failed to fetch receipts:", err);
      res.status(500).json({ error: "Failed to fetch receipts" });
    }
  });

  const checkoutLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 1, // Limit to 1 checkout attempt per minute
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: "Too many checkout attempts. Please wait a moment." }
  });

  app.post("/api/checkout", checkoutLimiter, async (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.uid) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { amount } = req.body;
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    try {
      const uid = String(req.session.user.uid);
      
      const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
      const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
      
      if (!apiKey || !storeId) {
        console.warn("Lemon Squeezy credentials not configured. Simulating purchase.");
        // Fallback simulation if not configured
        await getDb().execute({
          sql: `UPDATE users SET credits = credits + ? WHERE uid = ?`,
          args: [amount, uid]
        });
        
        const userResult = await getDb().execute({
          sql: `SELECT terms_accepted, credits, role, purchased_stem_slots FROM users WHERE uid = ?`,
          args: [uid]
        });
        
        const termsAccepted = userResult.rows[0]?.terms_accepted === 1;
        const credits = userResult.rows[0]?.credits ?? 0;
        const role = userResult.rows[0]?.role ?? 'user';
        const purchasedStemSlots = userResult.rows[0]?.purchased_stem_slots ?? 0;
        const updatedUser = { ...req.session.user, termsAccepted, credits, role, purchasedStemSlots };
        req.session.user = updatedUser;
        
        return res.json({ success: true, user: updatedUser, simulated: true });
      }

      let variantId = "";
      if (amount === 40) {
        variantId = process.env.LEMON_SQUEEZY_VARIANT_ID_40_CREDITS || "";
      } else if (amount === 100) {
        variantId = process.env.LEMON_SQUEEZY_VARIANT_ID_100_CREDITS || "";
      }

      if (!variantId) {
        return res.status(400).json({ error: "Invalid product variant" });
      }

      // Create checkout session via Lemon Squeezy API
      const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          data: {
            type: "checkouts",
            attributes: {
              checkout_data: {
                custom: {
                  user_id: uid,
                  amount: amount.toString()
                }
              }
            },
            relationships: {
              store: {
                data: {
                  type: "stores",
                  id: storeId
                }
              },
              variant: {
                data: {
                  type: "variants",
                  id: variantId
                }
              }
            }
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Lemon Squeezy API error:", JSON.stringify(data, null, 2));
        return res.status(500).json({ error: "Failed to create checkout session", details: data });
      }

      const checkoutUrl = data.data.attributes.url;
      res.json({ success: true, checkoutUrl });
    } catch (error) {
      console.error("Error creating checkout:", error);
      res.status(500).json({ error: "Failed to process checkout" });
    }
  });

  app.post("/api/checkout-stems", checkoutLimiter, async (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.uid) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { slots } = req.body;
    if (typeof slots !== 'number' || slots <= 0) {
      return res.status(400).json({ error: "Invalid slot count" });
    }

    try {
      const uid = String(req.session.user.uid);
      
      const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
      const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
      const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID_STEM_SLOTS;
      
      if (!apiKey || !storeId || !variantId) {
        console.warn("Lemon Squeezy credentials for stems not fully configured. API Key:", !!apiKey, "Store ID:", !!storeId, "Variant ID:", !!variantId);
        // Fallback simulation if not configured
        await getDb().execute({
          sql: `UPDATE users SET purchased_stem_slots = purchased_stem_slots + ? WHERE uid = ?`,
          args: [slots, uid]
        });
        
        const userResult = await getDb().execute({
          sql: `SELECT terms_accepted, credits, role, purchased_stem_slots FROM users WHERE uid = ?`,
          args: [uid]
        });
        
        const termsAccepted = userResult.rows[0]?.terms_accepted === 1;
        const credits = userResult.rows[0]?.credits ?? 0;
        const role = userResult.rows[0]?.role ?? 'user';
        const purchasedStemSlots = userResult.rows[0]?.purchased_stem_slots ?? 0;
        const updatedUser = { ...req.session.user, termsAccepted, credits, role, purchasedStemSlots };
        req.session.user = updatedUser;
        
        return res.json({ success: true, user: updatedUser, simulated: true });
      }

      console.log(`[Checkout] Creating stems checkout for User ${uid}, Slots: ${slots}, Variant: ${variantId}`);

      // Create checkout session via Lemon Squeezy API
      // Moving variant_quantities back into checkout_data where it belongs in v1
      // and restoring the variant relationship.
      const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          data: {
            type: "checkouts",
            attributes: {
              checkout_data: {
                variant_quantities: [
                  {
                    variant_id: parseInt(variantId),
                    quantity: slots
                  }
                ],
                custom: {
                  type: 'stem_slots',
                  user_id: uid,
                  slots: slots.toString()
                }
              }
            },
            relationships: {
              store: {
                data: {
                  type: "stores",
                  id: storeId
                }
              },
              variant: {
                data: {
                  type: "variants",
                  id: variantId
                }
              }
            }
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Lemon Squeezy API error (Stems):", JSON.stringify(data, null, 2));
        const firstError = data.errors ? data.errors[0]?.detail : "Unknown API error";
        return res.status(500).json({ 
          error: "Failed to create stems checkout session", 
          message: firstError,
          details: data 
        });
      }

      const checkoutUrl = data.data.attributes.url;
      res.json({ success: true, checkoutUrl });
    } catch (error) {
      console.error("Error creating stem slots checkout:", error);
      res.status(500).json({ error: "Failed to process stem checkout" });
    }
  });

  // --- System Health Monitoring ---
  let cachedStatus = {
    overall: 'operational',
    services: {
      app: { status: 'operational', latency: 0 },
      database: { status: 'operational', latency: 0 },
      gemini: { status: 'operational', latency: 0 },
      lemonsqueezy: { status: 'operational', latency: 0 }
    },
    lastUpdated: Date.now()
  };

  const runHealthChecks = async () => {
    const client = await getDb();
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];
    
    const results = {
      app: { status: 'operational', latency: 0 },
      database: { status: 'operational', latency: 0 },
      gemini: { status: 'operational', latency: 0 },
      lemonsqueezy: { status: 'operational', latency: 0 }
    };

    // 1. App Core (Self Check)
    const appStart = Date.now();
    results.app.latency = Date.now() - appStart; // Essentially 0, but proves event loop is alive
    results.app.status = 'operational';

    // 2. Database Check
    if (client) {
      const dbStart = Date.now();
      try {
        await client.execute("SELECT 1");
        results.database.latency = Date.now() - dbStart;
        results.database.status = 'operational';
      } catch (e) {
        results.database.latency = Date.now() - dbStart;
        results.database.status = 'outage';
      }
    } else {
      results.database.status = 'outage';
    }

    // 3. Gemini API Check
    const geminiStart = Date.now();
    try {
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
      results.gemini.latency = Date.now() - geminiStart;
      results.gemini.status = geminiRes.ok ? 'operational' : 'degraded';
    } catch (e) {
      results.gemini.latency = Date.now() - geminiStart;
      results.gemini.status = 'outage';
    }

    // 4. Lemon Squeezy Check
    const lsStart = Date.now();
    try {
      if (process.env.LEMON_SQUEEZY_API_KEY) {
        const lsRes = await fetch('https://api.lemonsqueezy.com/v1/users/me', {
          headers: { 'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}` }
        });
        results.lemonsqueezy.latency = Date.now() - lsStart;
        results.lemonsqueezy.status = lsRes.ok ? 'operational' : 'degraded';
      } else {
        // If no key, assume operational for simulation
        results.lemonsqueezy.latency = 10;
        results.lemonsqueezy.status = 'operational';
      }
    } catch (e) {
      results.lemonsqueezy.latency = Date.now() - lsStart;
      results.lemonsqueezy.status = 'outage';
    }

    // Determine overall status
    let overall = 'operational';
    const statuses = Object.values(results).map(r => r.status);
    if (statuses.includes('outage')) overall = 'outage';
    else if (statuses.includes('degraded')) overall = 'degraded';

    cachedStatus = {
      overall,
      services: results,
      lastUpdated: now
    };

    // Save to database
    if (client) {
      try {
        for (const [service, data] of Object.entries(results)) {
          await client.execute({
            sql: "INSERT INTO system_health (service, status, latency) VALUES (?, ?, ?)",
            args: [service, data.status, data.latency]
          });

          // Update daily aggregate (simplified: just assume 100% if operational, 99% if not for this tick)
          // In a real app, you'd calculate this based on all ticks in the day.
          const uptimeVal = data.status === 'operational' ? 100 : 0;
          await client.execute({
            sql: `
              INSERT INTO system_health_daily (date, service, uptime_percentage) 
              VALUES (?, ?, ?)
              ON CONFLICT(date, service) DO UPDATE SET 
              uptime_percentage = ((uptime_percentage * 287) + ?) / 288
            `, // 288 5-min intervals in a day
            args: [today, service, uptimeVal, uptimeVal]
          });
        }
        
        // Cleanup old health records (keep last 24 hours = 288 records per service)
        await client.execute("DELETE FROM system_health WHERE timestamp < ?", [now - (24 * 60 * 60 * 1000)]);
      } catch (e) {
        console.error("Failed to save health metrics:", e);
      }
    }
  };

  // Run health checks every 5 minutes
  setInterval(runHealthChecks, 5 * 60 * 1000);
  // Run once on startup after a short delay
  setTimeout(runHealthChecks, 5000);

  // Rate limiting for status endpoint
  const statusRequests = new Map<string, { count: number, resetTime: number }>();
  
  app.get("/api/status", async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    
    let rateData = statusRequests.get(ip);
    if (!rateData || now > rateData.resetTime) {
      rateData = { count: 0, resetTime: now + 60000 }; // 1 minute window
    }
    
    rateData.count++;
    statusRequests.set(ip, rateData);
    
    if (rateData.count > 30) {
      return res.status(429).json({ error: "Too many requests" });
    }

    try {
      const client = await getDb();
      let history = [];
      let daily = [];
      
      if (client) {
        // Get latency history for the last 24 hours
        const historyRes = await client.execute("SELECT timestamp, service, latency FROM system_health ORDER BY timestamp ASC");
        history = historyRes.rows;
        
        // Get 90-day daily uptime
        const dailyRes = await client.execute("SELECT date, service, uptime_percentage FROM system_health_daily ORDER BY date ASC LIMIT 90");
        daily = dailyRes.rows;
      }

      res.json({
        current: cachedStatus,
        history,
        daily
      });
    } catch (error) {
      console.error("Error fetching status:", error);
      // Fallback to cached status if DB fails
      res.json({
        current: cachedStatus,
        history: [],
        daily: []
      });
    }
  });

  app.post("/api/vst-cache/check", async (req, res) => {
    try {
      const { plugins } = req.body;
      if (!plugins || !Array.isArray(plugins)) {
        return res.status(400).json({ error: "Invalid plugins array" });
      }
      if (plugins.length === 0) {
        return res.json({ cached: [] });
      }

      const client = await getDb();
      if (!client) return res.status(500).json({ error: "Database not available" });

      // We check by vendor and name. If tier is provided, we try to match it specifically.
      const conditions = plugins.map(() => `(vendor = ? AND name = ?)`).join(' OR ');
      const args = plugins.flatMap(p => [p.vendor, p.name]);
      
      const result = await client.execute({
        sql: `SELECT * FROM vst_cache WHERE ${conditions}`,
        args: args
      });

      const cached = result.rows.map(row => ({
        vendor: row.vendor,
        name: row.name,
        type: row.type,
        description: row.description,
        features: JSON.parse(row.features as string),
        parameters: row.parameters ? JSON.parse(row.parameters as string) : [],
        version: row.version || '',
        tier: row.tier || ''
      }));

      res.json({ cached });
    } catch (error) {
      console.error("Error checking VST cache:", error);
      res.status(500).json({ error: "Failed to check cache" });
    }
  });

  app.post("/api/vst-cache/save", async (req, res) => {
    try {
      const { plugins } = req.body;
      if (!plugins || !Array.isArray(plugins)) {
        return res.status(400).json({ error: "Invalid plugins array" });
      }
      if (plugins.length === 0) {
        return res.json({ success: true });
      }

      const client = await getDb();
      if (!client) return res.status(500).json({ error: "Database not available" });

      const statements = plugins.map(p => ({
        sql: `INSERT INTO vst_cache (vendor, name, type, description, features, parameters, version, tier) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
              ON CONFLICT(vendor, name, tier) DO UPDATE SET 
              type = excluded.type, 
              description = excluded.description, 
              features = excluded.features,
              parameters = excluded.parameters,
              version = excluded.version`,
        args: [
          p.vendor, 
          p.name, 
          p.type, 
          p.description, 
          JSON.stringify(p.features || []),
          JSON.stringify(p.parameters || []),
          p.version || '',
          p.tier || ''
        ]
      }));

      await client.batch(statements);
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving VST cache:", error);
      res.status(500).json({ error: "Failed to save cache" });
    }
  });

  app.post("/api/user-plugins/save", async (req, res) => {
    try {
      const { uid, plugins } = req.body;
      if (!uid || !plugins || !Array.isArray(plugins)) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      const client = await getDb();
      if (!client) return res.status(500).json({ error: "Database not available" });

      const statements = plugins.map(p => ({
        sql: `INSERT INTO user_plugins (uid, vendor, name, type, version, tier, parameters, description, features) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
              ON CONFLICT(uid, vendor, name) DO UPDATE SET 
              type = excluded.type, 
              version = excluded.version, 
              tier = excluded.tier,
              parameters = excluded.parameters,
              description = excluded.description,
              features = excluded.features,
              last_modified = CURRENT_TIMESTAMP`,
        args: [
          uid,
          p.vendor,
          p.name,
          p.type,
          p.version || '',
          p.tier || '',
          JSON.stringify(p.parameters || []),
          p.description || '',
          JSON.stringify(p.features || [])
        ]
      }));

      await client.batch(statements);
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving user plugins:", error);
      res.status(500).json({ error: "Failed to save user plugins" });
    }
  });

  app.get("/api/user-plugins/load", async (req, res) => {
    try {
      const { uid } = req.query;
      if (!uid) return res.status(400).json({ error: "UID is required" });

      const client = await getDb();
      if (!client) return res.status(500).json({ error: "Database not available" });

      const result = await client.execute({
        sql: `SELECT * FROM user_plugins WHERE uid = ?`,
        args: [uid as string]
      });

      const plugins = result.rows.map(row => ({
        vendor: row.vendor,
        name: row.name,
        type: row.type,
        version: row.version,
        tier: row.tier,
        parameters: row.parameters ? JSON.parse(row.parameters as string) : [],
        description: row.description,
        features: row.features ? JSON.parse(row.features as string) : []
      }));

      res.json({ plugins });
    } catch (error) {
      console.error("Error loading user plugins:", error);
      res.status(500).json({ error: "Failed to load user plugins" });
    }
  });

  app.post("/api/gemini", sensitiveLimiter, async (req, res) => {
    // Increase timeout for long-running AI generations
    req.setTimeout(600000); // 10 minutes
    res.setTimeout(600000); // 10 minutes
    
    const { model, contents, config: rawConfig, userApiKey, action, safetySettings: rawSafetySettings } = req.body;
    
    // Extract safetySettings if they were passed inside config
    let config = { ...rawConfig };
    let safetySettings = rawSafetySettings;
    
    // In the @google/genai SDK, safetySettings are a top-level property
    if (config.safetySettings && !safetySettings) {
      safetySettings = config.safetySettings;
      delete config.safetySettings;
    }

    let apiKey = userApiKey;
    let usingSystemKey = false;
    let creditsToDeduct = 0;

    // Check if the request contains a WAV file and count stems (audio parts)
    let isWav = false;
    let audioPartsCount = 0;
    
    if (contents && contents.parts) {
      for (const part of contents.parts) {
        if (part.inlineData && part.inlineData.mimeType) {
          if (part.inlineData.mimeType.includes('wav')) isWav = true;
          if (part.inlineData.mimeType.includes('audio/')) audioPartsCount++;
        }
        if (part.fileData && part.fileData.mimeType) {
          if (part.fileData.mimeType.includes('wav')) isWav = true;
          if (part.fileData.mimeType.includes('audio/')) audioPartsCount++;
        }
      }
    }
    if (config.mimeType && config.mimeType.includes('wav')) isWav = true;

    // Determine cost based on action
    if (action === 'critique' || action === 'recipe' || action === 'audio_analysis_recipe' || action === 'chat') {
      creditsToDeduct = isWav ? 25 : 10;
    } else if (action === 'stems_critique') {
      // Dynamic pricing based on stems count: base 10 + 2 per stem + processing cost
      // Since we don't have exact MB size here easily, we approximate with audioPartsCount * 5
      creditsToDeduct = 10 + (audioPartsCount * 2) + (audioPartsCount * 5); 
    } else if (action === 'type_beat_search' || action === 'song_search') {
      creditsToDeduct = 10;
    } else if (action === 'enrich_library') {
      creditsToDeduct = 5;
    } else if (action === 'gangsta_vox') {
      creditsToDeduct = 2; // Default text processing cost
    } else {
      creditsToDeduct = 2; // Default cost for other actions
    }

    if (!apiKey) {
      // If no BYOK, they must use the system key and pay credits
      apiKey = process.env.GEMINI_API_KEY;
      usingSystemKey = true;
      
      if (!req.session || !req.session.user || !req.session.user.uid) {
        return res.status(401).json({ error: "UNAUTHORIZED: You must be logged in to use system credits." });
      }

      const uid = String(req.session.user.uid);
      
      // Check credits
      const userResult = await getDb().execute({
        sql: `SELECT credits FROM users WHERE uid = ?`,
        args: [uid]
      });
      
      const currentCredits = Number(userResult.rows[0]?.credits ?? 0);
      if (currentCredits < creditsToDeduct) {
        return res.status(402).json({ error: `INSUFFICIENT_CREDITS: You need ${creditsToDeduct} credits for this action, but you only have ${currentCredits}.` });
      }
    }

    if (!apiKey) {
      return res.status(500).json({ error: "API_KEY_MISSING: System API key is missing." });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable Nginx buffering
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.status(200);

    // Start sending whitespace heartbeats to prevent Cloudflare 524 timeout
    const heartbeatInterval = setInterval(() => {
      res.write(' ');
    }, 15000); // Every 15 seconds
    
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const genAI = new GoogleGenAI({ 
        apiKey
      });
      
      let responseData: any;
      
      if (action === 'listModels') {
        const result = await genAI.models.list();
        responseData = result;
      } else {
        // Log the request payload for debugging
        // Use a less noisy log if payload is huge
        const debugPayload = { model, contents, config, safetySettings };
        console.log("Gemini Request Payload Models:", model);

        // Before calling generateContent, we MUST ensure any uploaded files are in ACTIVE state.
        // Wait up to 3 minutes for each file.
        try {
          const filesToPoll: string[] = [];
          const fileMimeTypes: Record<string, string> = {};
          
          let partsArr: any[] = [];
          if (Array.isArray(contents)) {
            for (const c of contents) {
               if (c.parts && Array.isArray(c.parts)) {
                  partsArr.push(...c.parts);
               }
            }
          } else if (contents && contents.parts && Array.isArray(contents.parts)) {
             partsArr = contents.parts;
          }

          for (const part of partsArr) {
            if (part && part.fileData && part.fileData.fileUri) {
              const match = part.fileData.fileUri.match(/files\/[a-zA-Z0-9_-]+/);
              if (match) {
                const fileName = match[0];
                if (!filesToPoll.includes(fileName)) {
                  filesToPoll.push(fileName);
                }
              }
            }
          }

          if (filesToPoll.length > 0) {
            console.log(`Need to check state for ${filesToPoll.length} file(s):`, filesToPoll);
            for (const fileName of filesToPoll) {
              console.log(`Polling state for ${fileName}...`);
              let isReady = false;
              for (let i = 0; i < 60; i++) {
                try {
                  const metadata = await genAI.files.get({ name: fileName });
                  console.log(`File ${fileName} state is: ${metadata.state}`);
                  if (metadata.mimeType) {
                    fileMimeTypes[fileName] = metadata.mimeType;
                  }
                  if (metadata.state === 'ACTIVE') {
                    isReady = true;
                    break;
                  } else if (metadata.state === 'FAILED') {
                    throw new Error(`File processing failed for ${fileName}`);
                  }
                } catch (e: any) {
                  console.warn(`Error checking file state for ${fileName}:`, e.message || e);
                }
                await new Promise(resolve => setTimeout(resolve, 3000));
              }
              if (!isReady) {
                console.warn(`File ${fileName} did not become ACTIVE in time.`);
              }
            }
            
            // Enforce correct registered mimeTypes for all parts to prevent any 400 "Request contains an invalid argument" errors
            for (const part of partsArr) {
              if (part && part.fileData && part.fileData.fileUri) {
                const match = part.fileData.fileUri.match(/files\/[a-zA-Z0-9_-]+/);
                if (match) {
                  const fileName = match[0];
                  const registeredMimeType = fileMimeTypes[fileName];
                  if (registeredMimeType) {
                    if (part.fileData.mimeType !== registeredMimeType) {
                      console.log(`Matching mimeType mismatch for ${fileName}: corrected ${part.fileData.mimeType} to ${registeredMimeType}`);
                      part.fileData.mimeType = registeredMimeType;
                    }
                  }
                }
              }
            }
          }
        } catch (pollErr: any) {
          console.error("Error during file state polling:", pollErr);
        }
        
        const finalConfig = safetySettings ? { ...config, safetySettings } : config;
        
        if (finalConfig && 'customAction' in finalConfig) {
          delete finalConfig.customAction;
        }

        const response = await genAI.models.generateContent({
          model: model || "gemini-3-flash-preview",
          contents,
          config: finalConfig
        });
        
        let text = "";
        try {
          text = response.text || "";
        } catch (e) {
          console.warn("Could not extract text from response, possibly blocked by safety settings:", e);
        }

        responseData = {
          ...response,
          text
        };

        // Record plugin usage if it's a recipe
        if (action === 'recipe' && text) {
          try {
            // Clean up text if it has markdown blocks
            let jsonText = text.trim();
            if (jsonText.startsWith("```json")) {
              jsonText = jsonText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
            } else if (jsonText.startsWith("```")) {
              jsonText = jsonText.replace(/^```\n?/, "").replace(/\n?```$/, "");
            }
            
            const recipe = JSON.parse(jsonText);
            const uid = req.session?.user?.uid ? String(req.session.user.uid) : 'anonymous';
            const recipeId = `rec_${Math.random().toString(36).substr(2, 9)}`;
            
            const pluginsToRecord: { name: string, type: string }[] = [];
            
            // Instruments
            if (Array.isArray(recipe.instruments)) {
              recipe.instruments.forEach((inst: any) => {
                if (inst.plugin) pluginsToRecord.push({ name: inst.plugin, type: 'instrument' });
                if (Array.isArray(inst.fxPlugins)) {
                  inst.fxPlugins.forEach((fx: any) => {
                    if (fx.name) pluginsToRecord.push({ name: fx.name, type: 'fx' });
                  });
                }
              });
            }
            
            // Vocal Elements
            if (recipe.vocalElements) {
              if (recipe.vocalElements.plugin) pluginsToRecord.push({ name: recipe.vocalElements.plugin, type: 'vocal_instrument' });
              if (Array.isArray(recipe.vocalElements.fxPlugins)) {
                recipe.vocalElements.fxPlugins.forEach((fx: any) => {
                  if (fx.name) pluginsToRecord.push({ name: fx.name, type: 'fx' });
                });
              }
            }
            
            // Busses
            if (Array.isArray(recipe.busses)) {
              recipe.busses.forEach((bus: any) => {
                if (Array.isArray(bus.fxPlugins)) {
                  bus.fxPlugins.forEach((fx: any) => {
                    if (fx.name) pluginsToRecord.push({ name: fx.name, type: 'fx' });
                  });
                }
              });
            }
            
            // Master
            if (Array.isArray(recipe.masterPlugins)) {
              recipe.masterPlugins.forEach((fx: any) => {
                if (fx.name) pluginsToRecord.push({ name: fx.name, type: 'fx' });
              });
            }
            
            // Save to DB
            if (pluginsToRecord.length > 0) {
              const db = getDb();
              for (const p of pluginsToRecord) {
                await db.execute({
                  sql: `INSERT INTO plugin_usage (uid, recipe_id, plugin_name, plugin_type) VALUES (?, ?, ?, ?)`,
                  args: [uid, recipeId, p.name, p.type]
                });
              }
              console.log(`Recorded ${pluginsToRecord.length} plugins for recipe ${recipeId}`);
            }
          } catch (err) {
            console.error("Failed to record plugin usage:", err);
          }
        }
      }
      
      // Deduct credits and log receipt only after successful API call
      if (usingSystemKey && creditsToDeduct > 0) {
        const uid = String(req.session!.user!.uid);
        
        // Deduct credits transactionally
        const updateResult = await getDb().execute({
          sql: `UPDATE users SET credits = credits - ? WHERE uid = ? AND credits >= ?`,
          args: [creditsToDeduct, uid, creditsToDeduct]
        });
        
        if (updateResult.rowsAffected > 0) {
          // Log the receipt in Turso
          try {
            const receiptId = `rec_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
            let actionName = action;
            if (action === 'critique') actionName = isWav ? 'Mix Critique (WAV)' : 'Mix Critique';
            if (action === 'stems_critique') actionName = 'Stems Mix Critique';
            if (action === 'recipe') actionName = isWav ? 'Generate Beat Recipe (WAV)' : 'Generate Beat Recipe';
            if (action === 'audio_analysis_recipe') actionName = isWav ? 'Audio Analysis Recipe (WAV)' : 'Audio Analysis Recipe';
            if (action === 'enrich_library') actionName = 'Enrich Plugin Library';
            if (action === 'chat') actionName = 'Specific Mix Help';
            if (action === 'analog_save') actionName = 'Reimagine Recipe';
            if (action === 'gangsta_vox') actionName = 'GangstaVox Guide';
            if (action === 'type_beat_search') actionName = 'Type Beat Search';
            if (action === 'song_search') actionName = 'Song Search';
            if (action === 'regenerate_plugin') actionName = 'Regenerate Plugin';
            if (action === 'compare_libraries') actionName = 'Compare Plugin Libraries';
            if (action === 'structural_blueprint') actionName = 'Generate Structural Blueprint';
            if (action === 'analyze_instrumental') actionName = 'Analyze Instrumental';
            if (action === 'generate_voiceover') actionName = 'Generate Voiceover';
            
            await getDb().execute({
              sql: `INSERT INTO receipts (id, uid, action, cost, date) VALUES (?, ?, ?, ?, ?)`,
              args: [receiptId, uid, actionName, creditsToDeduct, new Date().toISOString()]
            });
            
            // Also update the aggregated spend table
            await getDb().execute({
              sql: `INSERT INTO user_feature_spend (uid, action, total_spent, usage_count) 
                    VALUES (?, ?, ?, 1) 
                    ON CONFLICT(uid, action) DO UPDATE SET 
                    total_spent = total_spent + ?, 
                    usage_count = usage_count + 1`,
              args: [uid, actionName, creditsToDeduct, creditsToDeduct]
            });
          } catch (err) {
            console.error("Failed to log receipt to Turso:", err);
          }
        } else {
          console.error(`Failed to deduct credits for user ${uid} after successful generation. They might have bypassed the check.`);
        }
      }
      
      clearInterval(heartbeatInterval);
      res.write(JSON.stringify(responseData));
      res.end();
    } catch (error: any) {
      clearInterval(heartbeatInterval);

      // Log the full error for server-side debugging
      console.error("Gemini API Error Detail:", error);
      
      // Try to extract the most descriptive error message and details
      let message = error.message || "Error calling Gemini API";
      let details = error.details || error.errorDetails || [];
      
      // Handle cases where the error message itself is a JSON string from the API
      if (typeof message === 'string' && message.includes('{')) {
        try {
          const parsed = JSON.parse(message.substring(message.indexOf('{')));
          if (parsed.error) {
            message = parsed.error.message || message;
            details = parsed.error.details || details;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }

      // If details is still empty, check if it's nested in the error object (common in some SDK versions)
      if ((!details || details.length === 0) && error.response?.data?.error?.details) {
        details = error.response.data.error.details;
      }
      
      const errorResponse = {
        error: {
          message: message,
          details: details,
          code: error.status || 400,
          status: error.statusText || "INVALID_ARGUMENT"
        }
      };
      
      if (res.headersSent) {
        res.write(JSON.stringify(errorResponse));
        res.end();
      } else {
        res.status(error.status || 500).json(errorResponse);
      }
    }
  });

  app.post("/api/verify-turnstile", async (req, res) => {
    const token = req.body["cf-turnstile-response"];
    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    if (!secretKey) {
      console.warn("TURNSTILE_SECRET_KEY is not set. Skipping verification (DEV ONLY).");
      return res.json({ success: true });
    }

    try {
      const formData = new URLSearchParams();
      formData.append('secret', secretKey);
      formData.append('response', token);

      const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      const data = await response.json();

      if (data.success) {
        res.json({ success: true });
      } else {
        console.error("Turnstile verification failed:", data);
        res.status(403).json({ 
          error: "Security verification failed.", 
          details: data['error-codes'] ? data['error-codes'].join(', ') : 'Unknown error'
        });
      }
    } catch (error) {
      console.error("Turnstile verification error:", error);
      res.status(500).json({ error: "Internal server error during verification" });
    }
  });




// Catch-all for undefined API routes
app.all(/\/api\/.*/, (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  // Serve static files in production (only if not on Vercel, as Vercel handles static files)
  app.use(express.static(path.join(__dirname, "dist")));
  
  // Return 404 for missing assets instead of index.html
  app.get('/assets/*', (req, res) => {
    res.status(404).send('Not Found');
  });

  app.get(/.*/, (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

app.use((err: any, req: any, res: any, next: any) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

if (!process.env.VERCEL) {
  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
