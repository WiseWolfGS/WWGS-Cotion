<script setup lang="ts">
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/app/store/auth.store'
import { usePageStore } from '@/entities/page/page.store'
import AppButton from '@/shared/ui/AppButton.vue'
import { RouterLink } from 'vue-router'
import { useTheme } from '@/shared/composables/useTheme' // 1. useTheme 컴포저블 임포트

const authStore = useAuthStore()
const { isLoggedIn, user } = storeToRefs(authStore)
const { logout } = authStore

const pageStore = usePageStore()
const { pages, isLoading } = storeToRefs(pageStore)
const { createPage } = pageStore

const { theme, toggleTheme } = useTheme() // 2. 테마 상태와 토글 함수 가져오기

watch(
  isLoggedIn,
  (loggedIn) => {
    if (loggedIn) {
      pageStore.fetchPages()
    } else {
      pages.value = []
    }
  },
  { immediate: true },
)
</script>

<template>
  <aside
    class="w-60 bg-slate-50 text-gray-800 p-2 flex flex-col border-r border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
  >
    <div v-if="isLoggedIn && user" class="p-2 mb-2">
      <div
        class="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
      >
        <img
          :src="user.photoURL || '/src/shared/assets/images/SampleUserAvatar.png'"
          alt="User Avatar"
          class="w-6 h-6 rounded-full"
        />
        <span class="font-bold text-sm truncate"
          >{{ user.displayName || user.email }}'s Notion</span
        >
      </div>
    </div>

    <div v-if="isLoggedIn" class="flex flex-col gap-1 mb-2 px-2">
      <AppButton variant="ghost" class="justify-start dark:text-gray-100">Search</AppButton>
      <AppButton variant="ghost" class="justify-start dark:text-gray-100">Updates</AppButton>
      <AppButton variant="ghost" class="justify-start dark:text-gray-100">Settings</AppButton>
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

    <div v-if="isLoggedIn" class="mt-auto p-2 border-t border-gray-200 dark:border-gray-700">
      <!-- 3. 테마 전환 버튼 추가 -->
      <AppButton
        @click="toggleTheme"
        variant="ghost"
        class="w-full justify-start mb-2 dark:text-gray-100"
      >
        Switch to {{ theme === 'light' ? 'Dark' : 'Light' }} Mode
      </AppButton>
      <AppButton
        @click="createPage"
        variant="ghost"
        class="w-full justify-start mb-2 dark:text-gray-100"
        >New Page</AppButton
      >
      <AppButton @click="logout" variant="ghost" class="w-full justify-start text-red-500"
        >Logout</AppButton
      >
    </div>
  </aside>
</template>
