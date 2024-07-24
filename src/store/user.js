import {defineStore} from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: '',
    token: '',
    username: '',
    name: '',
    password: '',
    tasks: [],
  }),
  actions: {
    async register(data) {
      const {id, username, name, password} = data;

      console.log(import.meta.env.VITE_API_URL);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/reg`,
          {
            id,
            username,
            name,
            password,
          },
        );

        const {access_token, user} = response.data;

        console.log(response.data);

        if (access_token && user) {
          const {userId, username, name} = user;

          this.token = access_token;
          this.id = userId;
          this.username = username;
          this.name = name;
          this.tasks = [];

          localStorage.setItem(
            'user',
            JSON.stringify({
              userId,
              token: access_token,
              username,
              name,
              tasks: [],
            }),
          );

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
          localStorage.setItem(
            'user',
            JSON.stringify({id, token: access_token, username, name, tasks}),
          );

          this.token = access_token;
          this.id = id;
          this.username = username;
          this.tasks = tasks || [];
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        if (error.response) {
          console.error('Error response data:', error.response.data);
          alert(
            `Login failed: ${error.response.data.message || 'Unknown error'}`,
          );
        } else if (error.request) {
          console.error('Error request data:', error.request);
          alert('Login failed: No response from server');
        } else {
          console.error('Error message:', error.message);
          alert(`Login failed: ${error.message}`);
        }
      }
    },
    loadUser() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        this.id = user.id;
        this.username = user.username;
        this.name = user.name;
        this.token = user.token;
        this.tasks = user.tasks || [];
      }
    },
    addTask(task) {
      this.tasks.push(task);
      this.saveTasks();
    },
    updateTask(id, updatedTask) {
      const index = this.tasks.findIndex(task => task.id === id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
        this.saveTasks();
      }
    },

    removeTask(id) {
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.saveTasks();
    },
    saveTasks() {
      if (this.username) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: this.id,
            token: this.token,
            username: this.username,
            name: this.name,
            tasks: this.tasks,
          }),
        );
      }
    },
    logout() {
      this.$reset();

      localStorage.removeItem('user');
    },
  },
});
