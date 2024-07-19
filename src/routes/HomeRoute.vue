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

  <!-- TODO: Подумать над анимацией появления -->
  <!-- <transition name="scale"
              mode="in-out"> -->
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
  <!-- </transition> -->

  <div v-show="!loader">
    <MainTemplate />
  </div>


</template>