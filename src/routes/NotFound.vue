<script setup>
import {ServerCrash} from 'lucide-vue-next';
import {RouterLink} from 'vue-router';
</script>

<template>
  <div class="errPage">
    <p><ServerCrash :size="30" />404 Not Found :(</p>
    <p class="sub">
      Please return to the <RouterLink to="/">main page</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.errPage {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 5px;

  p {
    display: flex;
    align-items: center;

    gap: 5px;

    font-size: 22px;
  }

  .sub {
    font-size: 14px;
    font-weight: 300;

    a {
      color: var(--color-border);
      text-decoration: none;

      transition: 0.3s ease-in-out;

      &:hover {
        color: var(--color-text);

        transform: translateX(5px);
      }
    }
  }
}
</style>
