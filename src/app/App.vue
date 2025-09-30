<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/app/store/auth.store';
import { useTheme } from '@/shared/composables/useTheme'; // 1. useTheme 임포트

// 2. 테마 초기화 함수를 가져와 실행합니다.
//    이 작업은 앱 전체에서 단 한 번만 수행됩니다.
const { initTheme } = useTheme();
initTheme();

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