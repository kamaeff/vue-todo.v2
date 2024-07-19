<script setup>
import { onMounted, ref, } from 'vue';
import { Loader } from 'lucide-vue-next';

import MainTemplate from '@/components/Home/main/MainTemplate.vue'

const loader = ref(true)

onMounted(() => {
  const timeout = setTimeout(() => {
    loader.value = false

    console.log('Component mounted');
  }, 1500)

  return () => clearTimeout(timeout)
})
</script>

<template>

  <div v-if="loader"
       class="loader">
    <div class="container">
      <Loader class="item"
              :size="30" />

      <div class="text">
        <p>#TaskList</p>

        <p class="sub">Simple and Fast</p>
      </div>

    </div>
  </div>

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