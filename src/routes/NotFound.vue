<script setup>
import { Loader } from 'lucide-vue-next';

</script>

<template>
  <div class="errPage">
    <p>
      <Loader class="item"
              :size="32" />
      #404 Not Found
    </p>

    <a href="/">Home</a>
  </div>
</template>

<style scoped>
.errPage {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  a {
    font-size: 16px;
    color: var(--color-text);
  }

  p {
    display: flex;
    align-items: center;
    gap: 5px;

    font-size: 22px;

    .item {
      animation: rotate 2s linear infinite;
    }
  }
}
</style>