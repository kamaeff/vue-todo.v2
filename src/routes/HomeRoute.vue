<script setup>
import {onMounted, ref} from 'vue';
import Loader from '@/shared/Loader.vue';

import MainTemplate from '@/views/Home/main/MainTemplate.vue';
import HeaderTemplate from '@/views/Home/header/HeaderTemplate.vue';

const loader = ref(true);

onMounted(() => {
  const timeout = setTimeout(() => {
    loader.value = false;

    console.log('Component mounted');
  }, 1500);

  return () => clearTimeout(timeout);
});
</script>

<template>
  <Loader :isLoading="loader" :size="30" :needSub="true" />

  <HeaderTemplate />

  <Transition name="bounce">
    <div v-show="!loader">
      <MainTemplate />
    </div>
  </Transition>
</template>

<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}
</style>
