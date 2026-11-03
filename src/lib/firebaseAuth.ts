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

export const googleSignIn = async (): Promise<{ user: FirebaseUser; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    try {
      const expiresAt = Date.now() + 55 * 60 * 1000; // ~55 mins
      localStorage.setItem(TOKEN_KEY, cachedAccessToken);
      localStorage.setItem(TOKEN_EXP_KEY, expiresAt.toString());
      if (result.user.email) {
        localStorage.setItem(USER_EMAIL_KEY, result.user.email.toLowerCase().trim());
      }
    } catch (e) {
      console.warn('Failed to persist token to localStorage', e);
    }

    return { user: result.user, accessToken: cachedAccessToken };
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
  await signOut(auth);
  cachedAccessToken = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXP_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
  } catch {}
};

