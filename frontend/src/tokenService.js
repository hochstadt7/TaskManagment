import axios from "axios";

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

export default {
  // Check if token is expired
  isTokenExpired(token) {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken.exp * 1000 < Date.now();
  },

  // Get a new access token using the refresh token
  async getNewAccessToken(refreshToken) {
    const response = await axios.post("https://localhost:3000/auth/token", {
      refreshToken,
    });
    return response.data.token;
  },
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken(refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
