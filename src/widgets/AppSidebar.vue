<script setup lang="ts">
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/app/store/auth.store';
import { usePageStore } from '@/entities/page/page.store';
import AppButton from '@/shared/ui/AppButton.vue';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
const { isLoggedIn, user } = storeToRefs(authStore);
const { logout } = authStore;

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
      pages.value = [];
    }
  },
  { immediate: true }
);
</script>

<template>
  <!-- 사이드바 전체 컨테이너: w-60 (240px) 고정 너비, 밝은 회색 배경, 오른쪽 보더 -->
  <aside
    class="w-60 bg-slate-50 text-gray-800 p-2 flex flex-col border-r border-gray-200"
  >
    <!-- 1. 워크스페이스 / 사용자 정보 섹션 -->
    <div v-if="isLoggedIn && user" class="p-2 mb-2">
      <div class="flex items-center gap-2 p-2 rounded hover:bg-gray-200 cursor-pointer">
        <img :src="user.photoURL || '/src/shared/assets/images/SampleUserAvatar.png'" alt="User Avatar" class="w-6 h-6 rounded-full" />
        <span class="font-bold text-sm truncate">{{ user.displayName || user.email }}'s Notion</span>
      </div>
    </div>

    <!-- 2. 주요 기능 버튼 (검색, 알림, 설정) -->
    <div v-if="isLoggedIn" class="flex flex-col gap-1 mb-2 px-2">
      <AppButton variant="ghost" class="justify-start">Search</AppButton>
      <AppButton variant="ghost" class="justify-start">Updates</AppButton>
      <AppButton variant="ghost" class="justify-start">Settings</AppButton>
    </div>

    <!-- 3. 페이지 목록 -->
    <div v-if="isLoggedIn" class="flex-grow overflow-y-auto">
      <div v-if="isLoading" class="px-4 text-gray-400">Loading pages...</div>
      <ul v-else-if="pages.length > 0" class="flex flex-col space-y-1 px-2">
        <li v-for="page in pages" :key="page.id">
          <RouterLink
            :to="{ name: 'PageDetail', params: { pageId: page.id } }"
            class="block p-2 rounded hover:bg-gray-200 text-sm"
          >
            {{ page.title }}
          </RouterLink>
        </li>
      </ul>
      <div v-else class="px-4 text-gray-400">No pages yet.</div>
    </div>
    <div v-else class="text-gray-400 flex-grow px-4">Please log in to see your pages.</div>

    <!-- 4. 새 페이지 버튼 및 로그아웃 -->
    <div v-if="isLoggedIn" class="mt-auto p-2 border-t border-gray-200">
       <AppButton @click="createPage" variant="ghost" class="w-full justify-start mb-2">New Page</AppButton>
       <AppButton @click="logout" variant="ghost" class="w-full justify-start text-red-500">Logout</AppButton>
    </div>
  </aside>
</template>