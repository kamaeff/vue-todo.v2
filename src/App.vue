<script setup>
import {RouterView, RouterLink} from 'vue-router';
</script>

<template>
  <div>
    <!-- <HeaderTemplate /> -->
    <RouterLink class="logo" to="/">#TaskList</RouterLink>
    <main>
      <RouterView />
    </main>
    <!--<FooterTemplate />-->
  </div>
</template>
