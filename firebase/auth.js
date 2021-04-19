import React, { useState, useEffect, useContext, createContext } from 'react';
import nookies from 'nookies';
import firebase from './firebase';
// import firebase from "firebase/app";
import 'firebase/auth';
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  //   firebase();
  const [user, setUser] = useState(null);

  useEffect(() => {
    return firebase.auth().onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        nookies.set(undefined, 'token', '', { path: '/' });
        return;
      }

      const token = await user.getIdToken();
      setUser(user);
      nookies.set(undefined, 'token', token, { path: '/' });
    });
  }, []);

  // force refresh the token every 5 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = firebase.auth().currentUser;
      if (user) await user.getIdToken(true);
    }, 5 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
