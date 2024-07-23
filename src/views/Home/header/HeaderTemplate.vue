<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {
  ChevronsRight,
  CircleUserRound,
  FilePenLine,
  SquareCheckBig,
  Tally5,
  TriangleAlert,
  X,
} from 'lucide-vue-next';
import {useUserStore} from '@/store/user.js';
import {notification} from '@/lib/toastService.js';

const isModalOpen = ref(false);
const username = ref('');
const name = ref('');

const userStore = useUserStore();

const isEdit = ref(false);
const saveUser = () => {
  userStore.setUser(username.value, name.value);

  notification(`Updates for ${username.value}`, 'success');

  isEdit.value = false;
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleEscKey = event => {
  if (event.key === 'Escape') {
    closeModal();
  }
};

watch(isModalOpen, newVal => {
  newVal
    ? document.addEventListener('keyup', handleEscKey)
    : document.removeEventListener('keyup', handleEscKey);
});

onMounted(() => {
  userStore.loadUser();
  username.value = userStore.username;
  name.value = userStore.name;
});

onUnmounted(() => {
  document.removeEventListener('keyup', handleEscKey);
});

const totalTasks = computed(() => userStore.tasks.length);
const doneTasks = computed(
  () => userStore.tasks.filter(task => task.status === 'done').length,
);
const inProgressTasks = computed(
  () => userStore.tasks.filter(task => task.status === 'inProgress').length,
);
const todoTasks = computed(
  () => userStore.tasks.filter(task => task.status === 'new').length,
);
</script>

<template>
  <header>
    <div class="profile">
      <button
        :title="userStore.username !== '' ? 'Profile' : 'Sign in'"
        type="button"
        @click="openModal"
      >
        <CircleUserRound :size="22" :strokeWidth="1" />
        {{ userStore.username !== '' ? userStore.username : 'Sign in' }}
      </button>
    </div>
  </header>

  <div v-if="isModalOpen" class="overlay" @click="closeModal"></div>

  <Transition name="right">
    <div v-if="isModalOpen" class="modal" @click.stop>
      <button class="close" title="Close" @click="closeModal">
        <X />
      </button>

      <div class="content">
        <h2>
          <CircleUserRound :size="26" :strokeWidth="1" />
          {{ userStore.username !== '' ? userStore.username : 'User' }}
        </h2>

        <form class="form" @submit.prevent="saveUser">
          <input
            v-model="username"
            :class="{scale: isEdit}"
            :disabled="!isEdit"
            :placeholder="
              userStore.username !== '' ? userStore.name : 'Paste nickname'
            "
            type="text"
          />

          <input
            v-model="name"
            :class="{scale: isEdit}"
            :disabled="!isEdit"
            :placeholder="userStore.name !== '' ? userStore.name : 'Paste name'"
            type="text"
          />

          <button
            v-show="!isEdit"
            title="Edit username"
            type="button"
            @click="isEdit = true"
          >
            <FilePenLine :size="18" />
            #Edit
          </button>

          <button v-show="isEdit" title="Submit" type="submit">
            <ChevronsRight :size="18" />
          </button>
        </form>
      </div>

      <div class="stats">
        <h2>Stats</h2>

        <div class="item">
          <p>
            <Tally5 :size="16" color="gray" />
            Total
          </p>
          <span>{{ totalTasks }}</span>
        </div>

        <div class="item">
          <p>
            <SquareCheckBig :size="16" color="green" />
            Done
          </p>
          <span>{{ doneTasks }}</span>
        </div>

        <div class="item">
          <p>
            <TriangleAlert :size="16" color="yellow" />
            InProgress
          </p>
          <span>{{ inProgressTasks }}</span>
        </div>

        <div class="item">
          <p>
            <X :size="16" color="red" />
            ToDo
          </p>
          <span>{{ todoTasks }}</span>
        </div>
      </div>

      <div class="warning">
        <TriangleAlert :size="18" />
        Careful! All data will be stored in your browser ;)
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@import 'header.css';
</style>
