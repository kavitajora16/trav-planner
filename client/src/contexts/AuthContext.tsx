import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthStateChangedListener, signInWithGoogle, signOutUser, isFirebaseConfigured } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";
import { User as AppUser } from "@shared/schema";

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  demoSignIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo user in localStorage
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser) {
      setUser(JSON.parse(demoUser));
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChangedListener(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Try to get existing user
          const response = await fetch(`/api/users/firebase/${firebaseUser.uid}`);
          if (response.ok) {
            const appUser = await response.json();
            setUser(appUser);
          } else if (response.status === 404) {
            // Create new user
            const newUser = await apiRequest("POST", "/api/users", {
              firebaseUid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            });
            const createdUser = await newUser.json();
            setUser(createdUser);
          }
        } catch (error) {
          console.error("Error handling user:", error);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    // Firebase is now initialized

    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        console.log("Successfully signed in:", result.user.email);
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw new Error(`Google sign-in failed: ${error.message || 'Unknown error'}`);
    }
  };

  const demoSignIn = async () => {
    try {
      // Create a demo user
      const demoUser: AppUser = {
        id: 999,
        firebaseUid: 'demo-user-123',
        email: 'demo@travelplan.com',
        displayName: 'Demo User',
        photoURL: null,
        createdAt: new Date(),
      };
      
      // Save to localStorage and set as current user
      localStorage.setItem('demoUser', JSON.stringify(demoUser));
      setUser(demoUser);
    } catch (error) {
      console.error("Demo sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (localStorage.getItem('demoUser')) {
        localStorage.removeItem('demoUser');
        setUser(null);
        return;
      }
      
      await signOutUser();
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signIn, signOut, demoSignIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
