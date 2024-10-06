<template>
    <div>
      <div>
        <h2>Tasks</h2>
        <ul>
          <li v-for="task in tasks" :key="task.id">
            <h3>{{ task.title }}</h3>
            <p>{{ task.description }}</p>
            <button @click="startEditing(task)">Edit</button>
            <button @click="deleteTask(task.id)">Delete</button>
          </li>
        </ul>
        <form @submit.prevent="addTask">
          <input v-model="addedTaskTitle" placeholder="Task Title" required />
          <textarea v-model="addedTaskDescription" placeholder="Task Description" required></textarea>
          <button type="submit">Add Task</button>
        </form>
      </div>
      <!-- Edit Form -->
      <div v-if="editingTask">
        <h3>Edit Task</h3>
        <form @submit.prevent="submitEdit">
          <input v-model="editingTaskTitle" placeholder="Task Title" required />
          <textarea v-model="editingTaskDescription" placeholder="Task Description" required></textarea>
          <button type="submit">Save Changes</button>
          <button type="button" @click="cancelEdit">Cancel</button>
        </form>
      </div>
      <!-- Navigation Links -->
      <div>
        <router-link to="/register">Go to Register Page</router-link>
        <br />
        <router-link to="/login">Go to Login Page</router-link>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import tokenService from '../tokenService';

  export default {
    data() {
      return {
        tasks: [], // Tasks associated with the current user
        addedTaskTitle: '',
        addedTaskDescription: '',

        // Properties for editing an existing task
        editingTask: null, // Stores the task currently being edited
        editingTaskTitle: '', // Temporary storage for the edited title
        editingTaskDescription: '', // Temporary storage for the edited description
      };
    },
    methods: {
      async fetchTasks() {
        // Fetch tasks from backend
        try {
    const response = await axios.get('https://localhost:3000/tasks', {
      headers: {
        Authorization: `Bearer ${tokenService.getToken()}`,
      },
    });
    this.tasks = response.data; // Assuming the response contains an array of tasks
  } catch (error) {
    // console.error('Failed to fetch tasks:', error);
  }
      },
      async addTask() {
        try {
    const response = await axios.post(
      'https://localhost:3000/tasks',
      {
        title: this.addedTaskTitle,
        description: this.addedTaskDescription,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenService.getToken()}`,
        },
      }
    );
    this.tasks.push(response.data); // Add the newly created task to the list
    // Clear the input fields
    this.addedTaskTitle = '';
    this.addedTaskDescription = '';
  } catch (error) {
    // console.error('Failed to add task:', error);
  }
      },
      // The functions below are not required to be asynchronous,
      // since they make no http requests
      startEditing(task) {
        this.editingTask = task; // Store the task being edited
        this.editingTaskTitle = task.title; // Pre-fill the form with the current title
        this.editingTaskDescription = task.description; // Pre-fill the form with the current description
      },
      cancelEdit() {
        this.editingTask = null; // Hide the form and clear the editing task
        this.editingTaskTitle = '';
        this.editingTaskDescription = '';
      },
    async submitEdit() {
      if (!this.editingTask) return;

      try {
        const response = await axios.put(
          `https://localhost:3000/tasks/${this.editingTask.id}`,
          {
            title: this.editingTaskTitle,
            description: this.editingTaskDescription,
          },
          {
            headers: {
              Authorization: `Bearer ${tokenService.getToken()}`,
            },
          }
        );

        // Update the task in the local list
        const index = this.tasks.findIndex(t => t.id === this.editingTask.id);
        if (index !== -1) {
          this.tasks[index] = response.data;
        } else {
          // console.error(`No task with id ${this.editingTask.id} was found`);
        }

        // Clear the editing state
        this.cancelEdit();
      } catch (error) {
        // console.error('Failed to edit task:', error);
      }
    },
      async deleteTask(taskId) {
        try {
    await axios.delete(`https://localhost:3000/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${tokenService.getToken()}`,
      },
    });
    // If the task is being edited, we remove the edit form,
    // as we don't want to edit a deleted task
    if (this.editingTask && this.editingTask.id == taskId) {
      this.cancelEdit();
    }
    // Remove the task from the frontend
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  } catch (error) {
    // console.error('Failed to delete task:', error);
  }
      }
    },
    // We want to fetch the tasks and display them on the web whenever the
    // the component is added to the DOM
    mounted() {
      this.fetchTasks();
    }
  };
  </script>
  