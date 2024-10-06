<template>
  <div>
    <h2>Login</h2>
    <!-- Login form here -->
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input id="username" type="text" v-model="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input id="password" type="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import tokenService from '../tokenService';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      this.errorMessage = "";
      // Send login request to backend
      try {
        const response = await axios.post('https://localhost:3000/auth/login', {
          username: this.username,
          password: this.password,
        });
        // Store the token and refresh token
        tokenService.setToken(response.data.token);
        tokenService.setRefreshToken(response.data.refreshToken);
        // Redirect to the tasks page
        this.$router.push('/tasks');
      } catch (error) {
        // console.error('Login failed:', error);
        // Display the error message to the user
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
      }
    }
  }
};
</script>
