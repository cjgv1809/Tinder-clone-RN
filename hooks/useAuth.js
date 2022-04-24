import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Text, View } from "react-native";
import * as Google from "expo-google-app-auth";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext({}); // setting up the initial state

const config = {
  androidClientId:
    "269131577824-a7d7vvphrf96voausmuk70veggk4v023.apps.googleusercontent.com",
  iosClientId:
    "269131577824-3aar35iqbie835j7j9v4tkj4pnaaotf3.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
};

const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingInitial, seLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // Logged in
          setUser(user);
        } else {
          // Logged out
          setUser(null);
        }
        seLoadingInitial(false);
      }),
    []
  );

  const logout = () => {
    setLoading(true);

    signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  const signInWithGoogle = async () => {
    setLoading(true);

    await Google.logInAsync(config)
      .then(async (logInResult) => {
        if (logInResult.type === "success") {
          // do something with the token
          const { idToken, accessToken } = logInResult;
          const credential = GoogleAuthProvider.credential(
            idToken,
            accessToken
          );
          await signInWithCredential(auth, credential);
        }
        return Promise.reject();
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  };

  // To optimize re-renders, we can use the useMemo hook to memoize the value of the user prop.
  const memoedValue = useMemo(
    () => ({ user, loading, error, signInWithGoogle, logout }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default function useAuth() {
  return useContext(AuthContext);
}
