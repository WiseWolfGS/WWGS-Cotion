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
          <!--
            <RouterLink>는 Vue Router에서 페이지 이동을 위해 사용하는 핵심 컴포넌트입니다.
            일반 <a> 태그와 달리, 페이지 전체를 새로고침하지 않고 URL과 화면만 부드럽게 전환해줍니다. (SPA의 핵심)

            :to 속성에는 이동할 경로 정보를 객체 형태로 전달합니다.
            - name: router/index.ts에서 설정한 라우트의 이름(name: 'PageDetail')을 가리킵니다.
                    이름을 사용하면 나중에 URL 구조가 바뀌어도 코드를 수정할 필요가 없어 편리합니다.
            - params: 라우트 경로에 포함될 동적 파라미터입니다. { pageId: page.id }는
                      URL을 '/pages/실제페이지ID' 형태로 만들어줍니다.
          -->
          <RouterLink
            :to="{ name: 'PageDetail', params: { pageId: page.id } }"
            class="block p-2 rounded hover:bg-gray-700"
          >
            {{ page.title }}
          </RouterLink>
        </li>
      </ul>
      <div v-else class="text-gray-400">No pages yet.</div>
    </div>
    <div v-else class="text-gray-400 flex-grow">Please log in to see your pages.</div>

    <Button v-if="isLoggedIn" @click="createPage" variant="primary" class="w-full mt-4">New Page</Button>
  </aside>
</template>
