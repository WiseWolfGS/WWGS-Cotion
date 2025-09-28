<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/app/store/auth.store';

onMounted(() => {
  const authStore = useAuthStore();
  authStore.init();
});
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>