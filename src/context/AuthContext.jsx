import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
const AuthContext = createContext();

const defaultUser = {
  name: "",
  role: "",
  panel: [],
  canEdit: false,
  canDelete: false,
  canView: false,
  canAdd: false,
  isLoggedIn: false,
  allowedModels:{}
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : defaultUser;
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const login = (userData) => {
    setUser({ ...defaultUser, ...userData, isLoggedIn: true });
  };

  const logout = () => {
    localStorage.removeItem("user");
    Cookies.remove("Admin_access");
    setUser(defaultUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
