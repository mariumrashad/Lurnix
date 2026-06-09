import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase/firebase';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';

const db = getFirestore();
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [myCourses, setMyCourses] = useState([]); 

  const refreshMyCourses = (currentUser) => {
    if (currentUser) {
      const saved = JSON.parse(localStorage.getItem(`enrolled_courses_${currentUser.uid}`)) || [];
      setMyCourses(saved);
    } else {
      setMyCourses([]);
    }
  };

  useEffect(() => {
  
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      refreshMyCourses(currentUser); 
      setLoading(false);
    });

    const handleStorageUpdate = () => {
      const currentUser = auth.currentUser;
      refreshMyCourses(currentUser);
    };

    window.addEventListener("coursesUpdated", handleStorageUpdate);
    
    return () => {
      window.removeEventListener("coursesUpdated", handleStorageUpdate);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      const qWishlist = query(collection(db, "wishlist"), where("userId", "==", user.uid));
      const unsubWishlist = onSnapshot(qWishlist, (snapshot) => {
        setWishlist(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => { unsubWishlist(); };
    } else {
      setWishlist([]);
    }
  }, [user]);

  const signup = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential;
  };
  
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  const value = { 
    currentUser: user, 
    signup, 
    register: signup, 
    login, 
    loginWithGoogle, 
    logout, 
    loading,
    wishlist,
    myCourses 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};