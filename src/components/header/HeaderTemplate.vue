<script setup>
import { ref } from 'vue';
import { X, CircleUserRound, FilePenLine, ChevronsRight, SquareCheckBig, Tally5, TriangleAlert } from 'lucide-vue-next';

// Общие состояния
const isModalOpen = ref(false);
const username = ref('');
const name = ref('');

// Состояния для формы изменения пользователя
const isEditUser = ref(false);
const saveUser = (e) => {
  // first char to uppercase
  username.value = e.target[0].value.charAt(0).toUpperCase() + e.target[0].value.slice(1);
  isEditUser.value = false;
};

// Состояния для формы изменения имени
const isEditName = ref(false);
const saveName = (e) => {
  name.value = e.target[0].value;
  isEditName.value = false;
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <header>
    <div class="profile">
      <button type="button"
              @click="openModal">
        <CircleUserRound :size="22"
                         :strokeWidth="1" />
        {{ username !== '' ? username : 'Sign in' }}
      </button>
    </div>
  </header>

  <div v-if="isModalOpen"
       class="modal"
       @click.stop>
    <button class="close"
            @click="closeModal">
      <X />
    </button>

    <div class="content">
      <h2>
        <CircleUserRound :size="26"
                         :strokeWidth="1" />
        {{ username !== '' ? username : 'User' }}
      </h2>

      <!-- NOTE: Форма изменения пользователя -->
      <form class="form"
            @submit.prevent="saveUser">

        <input type="text"
               v-model="username"
               :disabled="!isEditUser"
               :placeholder="username !== '' ? name : 'Paste nickname'"
               :class="{ 'scale': isEditUser }" />

        <button type="button"
                v-show="!isEditUser"
                @click="isEditUser = true">

          <FilePenLine />
        </button>

        <button type="submit"
                v-show="isEditUser">

          <ChevronsRight />
        </button>

      </form>

      <!-- NOTE: Форма изменения имени -->
      <form class="form"
            @submit.prevent="saveName">

        <input type="text"
               v-model="name"
               :disabled="!isEditName"
               :placeholder="name !== '' ? name : 'Paste name'"
               :class="{ 'scale': isEditName }" />

        <button type="button"
                v-show="!isEditName"
                @click="isEditName = true">

          <FilePenLine />
        </button>

        <button type="submit"
                v-show="isEditName">

          <ChevronsRight />
        </button>

      </form>
    </div>

    <div class="stats">
      <h2>Stats</h2>
      <p class="name">{{ name !== '' ? name : 'My name' }}</p>

      <div class="item">
        <p>
          <Tally5 :size="16"
                  color="gray" />
          Total
        </p>
        <span>123</span>
      </div>

      <div class="item">
        <p>
          <SquareCheckBig :size="16"
                          color="green" /> Done
        </p>
        <span>50</span>
      </div>

      <div class="item">
        <p>
          <TriangleAlert :size="16"
                         color="yellow" /> InProgress
        </p>
        <span>2</span>
      </div>

      <div class="item">
        <p>
          <X :size="16"
             color="red" /> New
        </p>
        <span>56</span>
      </div>
    </div>
  </div>
</template>
