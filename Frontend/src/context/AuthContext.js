import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const getTokenExpiration = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); 
      return payload.exp ? payload.exp * 1000 : null; 
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);  
    console.log("User in AuthProvider:", userData);
  };

  const logout = () => {
    setUser(null); 
    localStorage.removeItem("user"); 
  };

  useEffect(() => {
    if (user?.token) {
      const expirationTime = getTokenExpiration(user.token);
      const currentTime = Date.now();

      if (expirationTime && expirationTime <= currentTime) {
        console.log("Token expired! Logging out...");
        logout();
      } else {
        const timeout = expirationTime - currentTime;
        console.log(`Auto logout in ${timeout / 1000} seconds`);
        const timer = setTimeout(logout, timeout);

        return () => clearTimeout(timer); 
      }
    }
  }, [user]);

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
