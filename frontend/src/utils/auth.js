export const isAuthenticated = () => { 
  const token = localStorage.getItem("book-manager-token");
  return !!token;
};

export const logout = () => {
  localStorage.removeItem("book-manager-token");
  window.location.href = "/";
};
