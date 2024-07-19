<script setup>
import { ref, watch, onUnmounted } from 'vue';
import {
  X,
  CircleUserRound,
  FilePenLine,
  ChevronsRight,
  SquareCheckBig,
  Tally5,
  TriangleAlert
} from 'lucide-vue-next';

const isModalOpen = ref(false);
const username = ref('');
const name = ref('');

const isEditUser = ref(false);
const saveUser = () => {
  isEditUser.value = false;
};

const isEditName = ref(false);
const saveName = () => {
  isEditName.value = false;
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleEscKey = (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
};

watch(isModalOpen, (newVal) => {
  newVal
    ? document.addEventListener('keyup', handleEscKey)
    : document.removeEventListener('keyup', handleEscKey);
});

onUnmounted(() => {
  document.removeEventListener('keyup', handleEscKey);
});

</script>

<template>
  <header>
    <div class="profile">
      <button type="button"
              @click="openModal"
              :title="username !== '' ? 'Profile' : 'Sign in'">

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
            @click="closeModal"
            title="Close">
      <X />
    </button>



    <div class="content">
      <h2>
        <CircleUserRound :size="26"
                         :strokeWidth="1" />
        {{ username !== '' ? username : 'User' }}
      </h2>

      <form class="form"
            @submit.prevent="saveUser">

        <input type="text"
               v-model="username"
               :disabled="!isEditUser"
               :placeholder="username !== '' ? name : 'Paste nickname'"
               :class="{ 'scale': isEditUser }" />

        <button type="button"
                v-show="!isEditUser"
                @click="isEditUser = true"
                title="Edit username">

          <FilePenLine />
        </button>

        <button type="submit"
                v-show="isEditUser"
                title="Submit">

          <ChevronsRight />
        </button>

      </form>

      <form class="form"
            @submit.prevent="saveName">

        <input type="text"
               v-model="name"
               :disabled="!isEditName"
               :placeholder="name !== '' ? name : 'Paste name'"
               :class="{ 'scale': isEditName }" />

        <button type="button"
                v-show="!isEditName"
                @click="isEditName = true"
                title="Edit Name">

          <FilePenLine />
        </button>

        <button type="submit"
                v-show="isEditName"
                title="Submit">

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
                          color="green" />
          Done
        </p>
        <span>50</span>
      </div>

      <div class="item">
        <p>
          <TriangleAlert :size="16"
                         color="yellow" />
          InProgress
        </p>
        <span>2</span>
      </div>

      <div class="item">
        <p>
          <X :size="16"
             color="red" />
          New
        </p>
        <span>56</span>
      </div>
    </div>

    <p class="warning">Careful! Data will be in local storage your browser</p>
  </div>
</template>
