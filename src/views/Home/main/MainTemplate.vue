<script setup>
import {SquareCheckBig, TriangleAlert, X} from 'lucide-vue-next';

import MainForm from '@/views/Home/main/components/MainForm.vue';
</script>

<template>
  <div class="main">
    <MainForm />

    <div class="list">
      <div class="new">
        <p class="title">
          <X :size="20" color="red" />
          #New
        </p>

        <ul class="item">
          <li>#Task</li>
        </ul>
      </div>

      <div class="inProgress">
        <p class="title">
          <TriangleAlert :size="20" color="yellow" />
          #In Progress
        </p>

        <ul class="item">
          <li>#Task</li>
        </ul>
      </div>

      <div class="done">
        <p class="title">
          <SquareCheckBig :size="20" color="green" />
          #Done
        </p>

        <ul class="item">
          <li>#Task</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'main.css';
</style>
