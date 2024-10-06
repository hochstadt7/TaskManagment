import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Tasks from '../components/Tasks.vue';

// Define your routes
const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/tasks', component: Tasks, meta: { requiresAuth: true } },
  { path: '/', redirect: '/register' },
];

// Create the router instance using Vue 3 syntax
const router = createRouter({
  history: createWebHistory(),  // This replaces mode: 'history'
  routes,
});

// Navigation guard to protect routes that require authentication
router.beforeEach((to, _, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Example check for a token
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login'); // Redirect to login if not authenticated
  } else {
    next(); // Proceed to the route
  }
});

export default router;
