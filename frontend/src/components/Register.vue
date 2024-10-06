<template>
    <div>
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div>
          <label for="username">Username:</label>
          <input id="username" type="text" v-model="username" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input id="password" type="password" v-model="password" required />
        </div>
        <button type="submit">Register</button>
      </form>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
      <!-- Registration form here -->
      <p>Already have an account? <router-link to="/login">Login here</router-link></p>
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
      async register() {
        this.errorMessage = '';
        // Send registration request to backend
        try {
        const response = await axios.post('https://localhost:3000/auth/register', {
          username: this.username,
          password: this.password,
        });
        tokenService.setToken(response.data.token);
        tokenService.setRefreshToken(response.data.refreshToken);
        this.$router.push('/tasks');
      } catch (error) {
        // console.error('Registration failed:', error);
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
  