import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const ADMIN_USER = "admin";
const ADMIN_PASS = "daniela";

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("sk_auth") === "1",
  );

  function login(user, pass) {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem("sk_auth", "1");
      setAuthed(true);
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem("sk_auth");
    setAuthed(false);
  }

  return (
    <AuthContext.Provider value={{ authed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
