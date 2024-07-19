<script setup>
import HeaderTemplate from '@/views/Home/header/HeaderTemplate.vue';
import FooterTemplate from '@/views/Home/footer/FooterTemplate.vue';
</script>

<template>
  <div>
    <HeaderTemplate />
    <main>
      <router-view />
    </main>
    <FooterTemplate />
  </div>
</template>
