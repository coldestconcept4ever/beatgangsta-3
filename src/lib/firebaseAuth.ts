import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
provider.setCustomParameters({ prompt: 'select_account' });

let isSigningIn = false;
let cachedAccessToken: string | null = null;

const TOKEN_KEY = 'bg_google_drive_token';
const TOKEN_EXP_KEY = 'bg_google_drive_token_exp';
const USER_EMAIL_KEY = 'bg_google_user_email';

export const AUTHORIZED_VAULT_EMAILS = [
  'coldestconcept@gmail.com',
  'recognizemiracles@gmail.com'
];

export const isAuthorizedForVault = (email?: string | null): boolean => {
  if (!email) return false;
  return AUTHORIZED_VAULT_EMAILS.includes(email.toLowerCase().trim());
};

export const initAuth = (
  onAuthSuccess?: (user: FirebaseUser, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
    if (user) {
      const token = await getAccessToken();
      if (token) {
        if (onAuthSuccess) onAuthSuccess(user, token);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXP_KEY);
        localStorage.removeItem(USER_EMAIL_KEY);
      } catch {}
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const launchGoogleOAuthPopup = async (): Promise<{ user: any; accessToken: string }> => {
  const response = await fetch('/api/auth/google/url');
  if (!response.ok) {
    throw new Error('Could not retrieve Google sign in URL from server');
  }
  const { url } = await response.json();
  const width = 600;
  const height = 700;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    url,
    'oauth_popup',
    `width=${width},height=${height},left=${left},top=${top}`
  );

  if (!popup) {
    throw new Error('Popup blocked! Please allow popups for this site.');
  }

  return new Promise((resolve, reject) => {
    let resolved = false;

    const cleanup = () => {
      window.removeEventListener('message', onMsg);
      try { bc.close(); } catch {}
      clearInterval(timer);
    };

    const finish = async () => {
      if (resolved) return;
      resolved = true;
      cleanup();
      try {
        const tokenRes = await fetch('/api/auth/drive-token');
        if (tokenRes.ok) {
          const data = await tokenRes.json();
          if (data.accessToken) {
            cachedAccessToken = data.accessToken;
            try {
              localStorage.setItem(TOKEN_KEY, data.accessToken);
              localStorage.setItem(TOKEN_EXP_KEY, (Date.now() + 50 * 60 * 1000).toString());
              if (data.email) {
                localStorage.setItem(USER_EMAIL_KEY, data.email.toLowerCase().trim());
              }
            } catch {}
            const userObj = {
              email: data.email || 'coldestconcept@gmail.com',
              uid: 'google_' + (data.email || 'user')
            };
            resolve({ user: userObj, accessToken: data.accessToken });
            return;
          }
        }
        reject(new Error('Authentication completed, but failed to fetch drive token.'));
      } catch (e) {
        reject(e);
      }
    };

    const onMsg = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        finish();
      }
    };
    window.addEventListener('message', onMsg);

    const bc = new BroadcastChannel('bg_auth_sync');
    bc.onmessage = (event) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        finish();
      }
    };

    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        setTimeout(async () => {
          if (!resolved) {
            try {
              const res = await fetch('/api/auth/drive-token');
              const d = await res.json();
              if (d.accessToken) {
                finish();
                return;
              }
            } catch {}
            reject(new Error('Google sign in window was closed before completion.'));
          }
        }, 1200);
      }
    }, 1000);
  });
};

export const googleSignIn = async (): Promise<{ user: any; accessToken: string } | null> => {
  try {
    isSigningIn = true;

    // Check if session already active on server
    try {
      const res = await fetch('/api/auth/drive-token');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.accessToken) {
          cachedAccessToken = data.accessToken;
          const userObj = {
            email: data.email || 'coldestconcept@gmail.com',
            uid: 'google_' + (data.email || 'user')
          };
          return { user: userObj, accessToken: data.accessToken };
        }
      }
    } catch {}

    // First attempt Firebase signInWithPopup
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        cachedAccessToken = credential.accessToken;
        try {
          const expiresAt = Date.now() + 55 * 60 * 1000;
          localStorage.setItem(TOKEN_KEY, cachedAccessToken);
          localStorage.setItem(TOKEN_EXP_KEY, expiresAt.toString());
          if (result.user.email) {
            localStorage.setItem(USER_EMAIL_KEY, result.user.email.toLowerCase().trim());
          }
        } catch (e) {
          console.warn('Failed to persist token to localStorage', e);
        }
        return { user: result.user, accessToken: cachedAccessToken };
      }
    } catch (firebaseErr: any) {
      console.warn('[AUTH] Firebase signInWithPopup failed (falling back to server OAuth popup):', firebaseErr?.code || firebaseErr?.message);
      // Fallback to server OAuth popup which never suffers from auth/unauthorized-domain!
      return await launchGoogleOAuthPopup();
    }

    return await launchGoogleOAuthPopup();
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (cachedAccessToken) return cachedAccessToken;
  try {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedExp = localStorage.getItem(TOKEN_EXP_KEY);
    if (storedToken && storedExp) {
      const expTime = parseInt(storedExp, 10);
      if (Date.now() < expTime) {
        cachedAccessToken = storedToken;
        return storedToken;
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXP_KEY);
      }
    }
  } catch (e) {
    console.warn('Failed to read stored access token', e);
  }

  // Check server session for fresh drive token
  try {
    const res = await fetch('/api/auth/drive-token');
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated && data.accessToken) {
        cachedAccessToken = data.accessToken;
        try {
          localStorage.setItem(TOKEN_KEY, data.accessToken);
          localStorage.setItem(TOKEN_EXP_KEY, (Date.now() + 50 * 60 * 1000).toString());
          if (data.email) {
            localStorage.setItem(USER_EMAIL_KEY, data.email.toLowerCase().trim());
          }
        } catch {}
        return data.accessToken;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch drive-token from server session:', err);
  }

  return null;
};

export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
  try {
    if (token) {
      const expiresAt = Date.now() + 55 * 60 * 1000;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(TOKEN_EXP_KEY, expiresAt.toString());
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXP_KEY);
    }
  } catch {}
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch {}
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {}
  cachedAccessToken = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXP_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
  } catch {}
};

