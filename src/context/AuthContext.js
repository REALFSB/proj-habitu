import React, { createContext, useContext, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null); // null = deslogado

  const signIn = async (email, password) => setSession(await authService.signIn(email, password));
  const signUp = async (email, password) => setSession(await authService.signUp(email, password));
  const signOut = () => setSession(null);

  return <AuthContext.Provider value={{ session, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
}
