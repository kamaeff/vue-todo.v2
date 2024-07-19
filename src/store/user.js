import {defineStore} from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    name: '',
    tasks: [],
  }),
  actions: {
    setUser(newUsername, newName) {
      this.username = newUsername;
      this.name = newName;
      localStorage.setItem(
        'user',
        JSON.stringify({
          username: newUsername,
          name: newName,
          tasks: this.tasks,
        }),
      );
    },
    loadUser() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        this.username = user.username;
        this.name = user.name;
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
      localStorage.setItem(
        'user',
        JSON.stringify({
          username: this.username,
          name: this.name,
          tasks: this.tasks,
        }),
      );
    },
  },
});
