import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebase";

// Define the shape of the context
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
});

// Custom hook to access the context from any component
export const useAuth = () => useContext(AuthContext);

// AuthProvider component that wraps your app and provides auth state
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Tracks the logged-in user
  const [loading, setLoading] = useState(true); // Tracks auth state loading status

  // Listen for Firebase auth state changes on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);     // Set the user (or null if logged out)
      setLoading(false);        // Done loading once state is known
    });

    // Clean up the listener when component unmounts
    return unsubscribe;
  }, []);

  // Provide the current user and loading state to all children
  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
