<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { usePageStore } from '@/entities/page/page.store';
import { storeToRefs } from 'pinia';
import AppButton from '@/shared/ui/AppButton.vue';

const route = useRoute();
const pageStore = usePageStore();
const { pages, getPageById } = storeToRefs(pageStore);

const currentPage = computed(() => {
  const pageId = Array.isArray(route.params.pageId) ? route.params.pageId[0] : route.params.pageId;
  if (pageId && getPageById.value) {
    return getPageById.value(pageId);
  }
  return null;
});

// --- 에디터 로직 시작 ---

// 1. 컴포넌트 내부의 로컬 상태를 만듭니다. textarea의 내용과 바인딩됩니다.
const localContent = ref('');

// 2. 페이지가 변경될 때마다(currentPage가 바뀔 때마다) currentPage의 내용을 localContent에 복사합니다.
//    이렇게 해야 다른 페이지로 이동했을 때 textarea의 내용도 함께 바뀝니다.
watch(
  currentPage,
  (newPage) => {
    if (newPage) {
      // newPage.content가 null이나 undefined일 경우를 대비해 빈 문자열로 처리합니다.
      localContent.value = newPage.content || '';
    }
  },
  { immediate: true } // 컴포넌트가 처음 로드될 때도 즉시 실행합니다.
);

// 3. 저장 버튼을 눌렀을 때 실행될 함수입니다.
async function handleSave() {
  if (!currentPage.value) {
    alert('페이지 정보를 찾을 수 없습니다.');
    return;
  }
  await pageStore.updatePageContent(currentPage.value.id, localContent.value);
  alert('저장되었습니다!'); // 사용자에게 피드백을 줍니다.
}

// --- 에디터 로직 끝 ---

watchEffect(() => {
  if (pages.value.length === 0) {
    pageStore.fetchPages();
  }
});
</script>

<template>
  <div v-if="currentPage">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">{{ currentPage.title }}</h1>
      <AppButton @click="handleSave">저장</AppButton>
    </div>

    <!-- 
      v-model="localContent"를 통해 textarea의 내용을 
      컴포넌트의 localContent 상태와 양방향으로 묶습니다.
      사용자가 타이핑하면 localContent가 업데이트되고,
      localContent가 바뀌면 textarea의 내용도 바뀝니다.
    -->
    <textarea
      v-model="localContent"
      class="w-full h-96 p-2 border rounded bg-gray-50 dark:bg-gray-800"
      placeholder="내용을 입력하세요..."
    ></textarea>
  </div>
  <div v-else>
    <p>페이지를 불러오는 중이거나, 존재하지 않는 페이지입니다.</p>
  </div>
</template>

<style scoped>
/* 스타일은 필요에 따라 추가 */
</style>
