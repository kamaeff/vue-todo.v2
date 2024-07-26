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
    resetState() {
      this.id = '';
      this.token = '';
      this.username = '';
      this.name = '';
      this.tasks = [];
    },
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
          this.resetState();
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
        return error.response?.status || '400';
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
        console.error('Failed to fetch tasks:', error);
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
      }
      return false;
    },
    async addTask(task) {
      console.log(task);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/${this.id}/add`,
          {
            id: this.id,
            task,
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
        return false;
      }
    },
    async updateTask(updatedTask) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/user/update/${updatedTask.id}`,
          updatedTask,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          },
        );

        if (response.status === 200) {
          console.log('Task updated successfully:', response.data);
          return true;
        }
      } catch (e) {
        console.error('Error updating task:', e);
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
