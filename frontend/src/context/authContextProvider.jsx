import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { makeRequest } from "../axios";
import axios from "axios";

function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const item = localStorage.getItem("user");
      return item ? JSON.parse(item) : null;
    } catch (err) {
      console.error("Invalid JSON in localStorage:", err);
      return null;
    }
  });

  const login = async (inputs) => {
    const res = await makeRequest.post("auth/login", inputs);
    setCurrentUser(res.data);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
}
export { AuthContextProvider };
