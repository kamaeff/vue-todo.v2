<script setup>
import HeaderTemplate from '@/views/Home/header/HeaderTemplate.vue';
</script>

<template>
  <div>
    <HeaderTemplate />
    <main>
      <router-view />
    </main>
    <!--<FooterTemplate />-->
  </div>
</template>
