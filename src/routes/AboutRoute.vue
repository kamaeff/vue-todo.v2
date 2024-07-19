<script setup>
import { House } from 'lucide-vue-next';
</script>

<template>
  <a href="/">
    <House :stroke-width="1" />
  </a>

  <!-- TODO: Придумать как сделать описание и возможно гайд  -->
  <div class="about">
    <p>#This is simple task list. You can add, edit and delete tasks.</p>
  </div>
</template>

<style scoped>
.about {
  height: 80vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    font-size: 16px;
  }
}

a {
  position: absolute;
  top: 3%;
  left: 3%;

  display: flex;
  align-items: center;

  gap: 5px;
  margin-top: 5px;

  font-size: 16px;
  color: var(--color-text);
}
</style>
