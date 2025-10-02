<script setup lang="ts">
import { watch, type PropType } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/app/store/auth.store';
import { usePageStore } from '@/entities/page/page.store';
import AppButton from '@/shared/ui/AppButton.vue';
import { RouterLink } from 'vue-router';
import { useTheme } from '@/shared/composables/useTheme';
import defaultAvatar from '@/shared/assets/images/SampleUserAvatar.png'; // --- 이미지 import 추가 ---

// --- Props 정의 ---
defineProps({
  width: {
    type: Number,
    required: true
  },
  onStartResize: {
    type: Function as PropType<(event: MouseEvent) => void>,
    required: true
  }
});
// --- End of Props ---

const authStore = useAuthStore();
const { isLoggedIn, user } = storeToRefs(authStore);
const { logout, loginWithGoogle } = authStore;

const pageStore = usePageStore();
const { pages, isLoading } = storeToRefs(pageStore);
const { createPage } = pageStore;

const { theme, toggleTheme } = useTheme();

watch(
  isLoggedIn,
  (loggedIn) => {
    if (loggedIn) {
      pageStore.fetchPages();
    } else {
      pages.value = [];
    }
  },
  { immediate: true }
);
</script>

<template>
  <aside
    :style="{ width: width + 'px' }"
    class="relative bg-slate-50 text-gray-800 p-2 flex flex-col border-r border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
  >
    <!-- --- Resize Handle --- -->
    <div
      @mousedown="onStartResize"
      class="absolute top-0 right-0 h-full w-1.5 cursor-col-resize hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
      title="Resize sidebar"
    ></div>
    <!-- --- End of Resize Handle --- -->

    <div v-if="isLoggedIn && user" class="p-2 mb-2">
      <div class="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
        <!-- --- 이미지 경로 수정 --- -->
        <img :src="user.photoURL || defaultAvatar" alt="User Avatar" class="w-6 h-6 rounded-full" />
        <span class="font-bold text-sm truncate">{{ user.displayName || user.email }}'s Notion</span>
      </div>
    </div>

    <div v-if="isLoggedIn" class="flex flex-col gap-1 mb-2 px-2">
      <AppButton variant="ghost" class="justify-start">Search</AppButton>
      <AppButton variant="ghost" class="justify-start">Updates</AppButton>
      <AppButton variant="ghost" class="justify-start">Settings</AppButton>
    </div>

    <div v-if="isLoggedIn" class="flex-grow overflow-y-auto">
      <div v-if="isLoading" class="px-4 text-gray-400">Loading pages...</div>
      <ul v-else-if="pages.length > 0" class="flex flex-col space-y-1 px-2">
        <li v-for="page in pages" :key="page.id">
          <RouterLink
            :to="{ name: 'PageDetail', params: { pageId: page.id } }"
            class="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
          >
            {{ page.title }}
          </RouterLink>
        </li>
      </ul>
      <div v-else class="px-4 text-gray-400">No pages yet.</div>
    </div>
    <div v-else class="text-gray-400 flex-grow px-4">Please log in to see your pages.</div>

    <!-- 로그인 상태에 따라 다른 버튼 그룹을 표시 -->
    <div v-if="isLoggedIn" class="mt-auto p-2 border-t border-gray-200 dark:border-gray-700">
      <AppButton @click="toggleTheme" variant="ghost" class="w-full justify-start mb-2">
        Switch to {{ theme === 'light' ? 'Dark' : 'Light' }} Mode
      </AppButton>
      <AppButton @click="createPage" variant="ghost" class="w-full justify-start mb-2">New Page</AppButton>
      <AppButton @click="logout" variant="ghost" class="w-full justify-start text-red-500 dark:text-red-500">Logout</AppButton>
    </div>
    <div v-else class="mt-auto p-2 border-t border-gray-200 dark:border-gray-700">
      <AppButton @click="loginWithGoogle" variant="primary" class="w-full justify-center">Login with Google</AppButton>
    </div>
  </aside>
</template>

<style scoped>
/* 필요한 경우 여기에 스타일 추가 */
</style>