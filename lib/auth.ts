export const isAuthenticated = () => false; 
export const logout = () => {
  // Clear session
  localStorage.clear();
  window.location.reload();
};