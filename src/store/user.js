import {defineStore} from 'pinia';
import axios from 'axios';
import CryptoJS from 'crypto-js';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: '',
    token: '',
    username: '',
    name: '',
    tasks: [],
  }),
  actions: {
    async register(data) {
      const {id, usernameReq, name, password} = data;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/reg`,
          {id, username: usernameReq, name, password},
        );

        const {access_token, userId, username} = response.data;

        if (access_token) {
          this.token = access_token;
          this.id = userId;
          this.username = username;
          this.name = name;
          this.tasks = [];
          this.saveUser();
          return true;
        }

        return false;
      } catch (error) {
        console.error('Registration error:', error);
        return error.response?.status || 'Error';
      }
    },
    async login(username, password) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/auth`,
          {username, password},
        );

        const {access_token, user} = response.data;

        if (access_token && user) {
          const {id, name, tasks} = user;
          this.token = access_token;
          this.id = id;
          this.username = username;
          this.name = name;
          this.tasks = tasks || [];
          this.saveUser();
          return true;
        }

        return false;
      } catch (error) {
        // console.error('Login error:', error);
        return error.response?.status || '400';
        // return '400';
      }
    },
    async loadUser() {
      const savedUser = sessionStorage.getItem('user');
      if (savedUser) {
        const decryptedData = CryptoJS.AES.decrypt(
          savedUser,
          import.meta.env.VITE_SECRET_KEY,
        ).toString(CryptoJS.enc.Utf8);
        const {id, token, username, name, tasks} = JSON.parse(decryptedData);
        this.id = id;
        this.token = token;
        this.username = username;
        this.name = name;
        this.tasks = tasks || [];
        await this.fetchTasks();
      }
    },
    async fetchTasks() {
      if (!this.token) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/${this.id}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          },
        );
        if (response.status === 200) {
          this.tasks = response.data.tasks;
        }
      } catch (error) {
        // console.error('Failed to fetch tasks:', error);
        false;
      }
    },
    async saveUser() {
      if (this.token) {
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify({
            id: this.id,
            token: this.token,
            username: this.username,
            name: this.name,
            tasks: this.tasks,
          }),
          import.meta.env.VITE_SECRET_KEY,
        ).toString();
        sessionStorage.setItem('user', encryptedData);

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/user/update`,
            {
              id: this.id,
              username: this.username,
              name: this.name,
              tasks: this.tasks,
            },
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            },
          );

          if (response.status === 200) {
            return true;
          }
        } catch (e) {
          console.error('Error saving user data:', e);
        }
      }
      return false;
    },
    async addTask(task) {
      this.tasks.push(task);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/update`,
          {
            id: this.id,
            username: this.username,
            name: this.name,
            tasks: this.tasks,
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          },
        );

        if (response.status === 200) {
          this.saveUser();
          return true;
        }
      } catch (e) {
        console.error('Error adding task:', e);
      }
      return false;
    },
    async updateTask(id, updatedTask) {
      const index = this.tasks.findIndex(task => task.id === id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/user/update`,
            {
              id: this.id,
              username: this.username,
              name: this.name,
              tasks: this.tasks,
            },
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            },
          );

          if (response.status === 200 || response.status === 201) {
            this.saveUser();
            return true;
          }
        } catch (e) {
          console.error('Error updating task:', e);
        }
      } else {
        console.error('Task not found in local state');
      }
      return false;
    },
    async removeTask(taskId) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/user/${this.id}/tasks/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          },
        );

        if (response.status === 200) {
          this.tasks = this.tasks.filter(task => task.id !== taskId);
          this.saveUser();
          return true;
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
      return false;
    },
    logout() {
      this.$reset();
      sessionStorage.removeItem('user');
    },
  },
});
