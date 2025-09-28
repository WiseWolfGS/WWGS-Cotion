<script setup lang="ts">
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/app/store/auth.store';
import { usePageStore } from '@/entities/page/page.store';
import Button from '@/shared/ui/AppButton.vue';

const authStore = useAuthStore();
const { isLoggedIn } = storeToRefs(authStore);

const pageStore = usePageStore();
const { pages, isLoading } = storeToRefs(pageStore);
const { createPage } = pageStore;

// 로그인 상태가 변경될 때 페이지를 가져옵니다.
watch(
  isLoggedIn,
  (loggedIn) => {
    if (loggedIn) {
      pageStore.fetchPages();
    } else {
      // 로그아웃 시 페이지 목록을 비웁니다. (스토어에서 이미 처리하지만 명시적)
      pages.value = [];
    }
  },
  { immediate: true } // 컴포넌트가 마운트될 때 즉시 실행
);
</script>

<template>
  <aside
    class="fixed top-0 left-0 h-full w-[15%] bg-gray-800 text-white p-4 flex flex-col shadow-lg"
  >
    <div class="flex items-center justify-between mb-4">
      <span class="text-lg font-bold">Workspace</span>
      <!-- Add workspace options/menu here later -->
    </div>

    <div v-if="isLoggedIn" class="flex-grow">
      <div v-if="isLoading" class="text-gray-400">Loading pages...</div>
      <ul v-else-if="pages.length > 0" class="flex flex-col space-y-2">
        <li v-for="page in pages" :key="page.id">
          <a href="#" class="block p-2 rounded hover:bg-gray-700">{{ page.title }}</a>
        </li>
      </ul>
      <div v-else class="text-gray-400">No pages yet.</div>
    </div>
    <div v-else class="text-gray-400 flex-grow">Please log in to see your pages.</div>

    <Button v-if="isLoggedIn" @click="createPage" variant="primary" class="w-full mt-4">New Page</Button>
  </aside>
</template>
