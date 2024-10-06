import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import tokenService from './tokenService';

// Set up the Axios interceptor to refresh token if expired,
// then set it the 'Authorization' header
axios.interceptors.request.use(async (config) => {

    /* Skip the interceptor for token refresh.
    Otherwise the Axios interceptor will be invoked, which
    will lead to an infinite loop.
    The API call for the token refreshment is done below
    in 'tokenService.getNewAccessToken' */
    if (config.url.includes('/token')) {
      return config;
    }

    let token = tokenService.getToken();
    const refreshToken = tokenService.getRefreshToken();
    // If there's no token (e.g., during registration), skip the refresh process
    if (!token) {
      return config;
    }
  
    if (tokenService.isTokenExpired(token)) {
      try {
        token = await tokenService.getNewAccessToken(refreshToken);
        tokenService.setToken(token);
      } catch (error) {
        // console.error('Failed to refresh token', error);
      }
    }
  
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

const app = createApp(App);
app.use(router);
app.mount('#app');