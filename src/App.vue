<script setup>
import HeaderTemplate from '@/components/Home/header/HeaderTemplate.vue'
import FooterTemplate from '@/components/Home/footer/FooterTemplate.vue'
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