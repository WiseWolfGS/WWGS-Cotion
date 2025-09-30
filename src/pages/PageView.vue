<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { usePageStore } from '@/entities/page/page.store';
import { storeToRefs } from 'pinia';

const route = useRoute();
const pageStore = usePageStore();
// saveTrigger를 스토어에서 가져옵니다.
const { pages, getPageById, saveTrigger } = storeToRefs(pageStore);

const currentPage = computed(() => {
  const pageId = Array.isArray(route.params.pageId) ? route.params.pageId[0] : route.params.pageId;
  if (pageId && getPageById.value) {
    return getPageById.value(pageId);
  }
  return null;
});

const localContent = ref('');

watch(
  currentPage,
  (newPage) => {
    if (newPage) {
      localContent.value = newPage.content || '';
    }
  },
  { immediate: true }
);

async function handleSave() {
  if (!currentPage.value) {
    // 이 시점에는 페이지가 있어야 하므로, alert 대신 console.error 사용
    console.error('저장할 페이지 정보를 찾을 수 없습니다.');
    return;
  }
  await pageStore.updatePageContent(currentPage.value.id, localContent.value);
  alert('저장되었습니다!');
}

// 스토어의 saveTrigger 값이 변경될 때마다 handleSave 함수를 호출합니다.
// (초기 실행은 방지하기 위해 { immediate: false }와 유사하게 동작)
watch(saveTrigger, () => {
  // 현재 페이지가 있을 때만 저장 로직을 실행합니다.
  if (currentPage.value) {
    handleSave();
  }
});

watchEffect(() => {
  if (pages.value.length === 0) {
    pageStore.fetchPages();
  }
});
</script>

<template>
  <div v-if="currentPage" class="h-full">
    <textarea
      v-model="localContent"
      class="w-full h-full p-2 border-none rounded focus:outline-none bg-transparent dark:text-gray-100"
      placeholder="내용을 입력하세요..."
    ></textarea>
    <!-- 저장 버튼이 헤더로 이동했으므로 여기서 제거합니다. -->
  </div>
  <div v-else>
    <p>페이지를 불러오는 중이거나, 존재하지 않는 페이지입니다.</p>
  </div>
</template>