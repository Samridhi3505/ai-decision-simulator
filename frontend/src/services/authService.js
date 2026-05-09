// authService.js

export const login = () => {
  localStorage.setItem("user", "true");
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return localStorage.getItem("user") !== null;
};