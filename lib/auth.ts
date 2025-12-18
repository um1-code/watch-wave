export const isAuthenticated = () => true; // Replace with real auth logic
export const logout = () => {
  // Clear session
  localStorage.clear();
  window.location.reload();
};