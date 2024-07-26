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
          {
            id,
            username: usernameReq,
            name,
            password,
          },
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
        if (error.response && error.response.status === 400) {
          return '404';
        }
        return false;
      }
    },
    async login(username, password) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/auth`,
          {
            username,
            password,
          },
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
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        if (error.response) {
          console.error('Error response data:', error.response.data);
          return '400';
        } else if (error.request) {
          console.error('Error request data:', error.request);
          alert('Login failed: No response from server');
        } else {
          console.error('Error message:', error.message);
          alert(`Login failed: ${error.message}`);
        }
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
        this.tasks = tasks;

        await this.fetchTasks();
      }
    },
    async fetchTasks() {
      try {
        console.log(this.id);
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
        console.error('Failed to fetch tasks:', error);
      }
    },
    saveUser() {
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
          const response = axios.post(
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
          console.error(e);
          return false;
        }
      }
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
        console.error(e);
        return false;
      }
    },
    async updateTask(id, updatedTask) {
      const index = this.tasks.findIndex(task => task.id === id);
      if (index !== -1) {
        // Обновляем задачу в локальном состоянии
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
          } else {
            console.error(`Unexpected response status: ${response.status}`);
            return false;
          }
        } catch (e) {
          console.error(e);
          return false;
        }
      } else {
        console.error('Task not found in local state');
        return false;
      }
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
        } else {
          console.error(`Failed to delete task: ${response.status}`);
          return false;
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        return false;
      }
    },
    saveTasks() {
      this.saveUser();
    },
    logout() {
      this.$reset();
      sessionStorage.removeItem('user');
    },
  },
});
