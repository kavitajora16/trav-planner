import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

// Check if Firebase config is available
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Only initialize Firebase if all config values are present
let auth: any = null;
let isFirebaseConfigured = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId) {
    console.log("Initializing Firebase with config:", {
      apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'missing',
      projectId: firebaseConfig.projectId,
      appId: firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 15)}...` : 'missing'
    });
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    isFirebaseConfigured = true;
    console.log("Firebase initialized successfully");
  } else {
    console.warn("Firebase configuration incomplete:", {
      hasApiKey: !!firebaseConfig.apiKey,
      hasProjectId: !!firebaseConfig.projectId,
      hasAppId: !!firebaseConfig.appId
    });
  }
} catch (error) {
  console.warn("Firebase initialization failed:", error);
}

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase not configured properly. Please check your environment variables.");
  }
  
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Google sign-in successful:", result.user.email);
    return result;
  } catch (error: any) {
    console.error("Google sign-in error:", error);
    
    if (error.code === 'auth/popup-blocked') {
      throw new Error("Popup was blocked. Please allow popups and try again.");
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error("This domain is not authorized. Please add it to Firebase console.");
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error("Google sign-in is not enabled in Firebase console.");
    }
    
    throw error;
  }
};

export const signOutUser = () => {
  if (!auth) return Promise.resolve();
  return signOut(auth);
};

export const onAuthStateChangedListener = (callback: (user: any) => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export { auth, isFirebaseConfigured };
