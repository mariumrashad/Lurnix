import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  linkWithCredential,
  EmailAuthProvider
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = (email, password) => 
    createUserWithEmailAndPassword(auth, email, password);
  
  const login = (email, password) => 
    signInWithEmailAndPassword(auth, email, password);
  
  const loginWithGoogle = () => 
    signInWithPopup(auth, googleProvider);
  
  const logout = () => signOut(auth);

  const linkAccountWithPassword = async (password) => {
    if (!auth.currentUser) {
      throw new Error(" You must be logged in to link an account.");
    }

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email, 
        password
      );
      const result = await linkWithCredential(auth.currentUser, credential);
      console.log("✅ Account linked successfully");
      return result;
    } catch (error) {
      console.error("Link Error:", error.code, error.message);
      throw error;
    }
  };

  const value = { 
    currentUser: user, 
    signup, 
    login, 
    loginWithGoogle, 
    logout, 
    linkAccountWithPassword,  
    loading 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};