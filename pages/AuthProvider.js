"use client"; // Ensure this component runs on the client side

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../app/firebase'; 
import { useRouter } from 'next/navigation';

// Create a context
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  const signup = async (email, password) => {
    await auth.createUserWithEmailAndPassword(email, password);
  };

  const logout = async () => {
    await auth.signOut();
    router.push('/login');  // Redirect to login page on sign out
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
