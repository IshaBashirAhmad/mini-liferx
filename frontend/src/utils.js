const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  const response = await fetch(`${VITE_API_BASE_URL}api/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Refresh token expired");
  }

  const data = await response.json();

  localStorage.setItem("access_token", data.access);

  return data.access;
};