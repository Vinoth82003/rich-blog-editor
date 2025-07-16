export const handleLogout = async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/signin"; // Redirect to login
};

export async function fetchWithAuth(url, options = {}) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    await handleLogout(); // log out and redirect
    throw new Error("Unauthorized. You have been logged out.");
  }
  return res;
}
