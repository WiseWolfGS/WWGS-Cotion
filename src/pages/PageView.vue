<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { usePageStore } from '@/entities/page/page.store';
import { storeToRefs } from 'pinia';

// 1. 라우트와 스토어 인스턴스를 가져옵니다.
const route = useRoute();
const pageStore = usePageStore();

// 2. 스토어의 상태와 getter를 가져옵니다.
// pages는 방어 로직을 위해, getPageById는 페이지를 찾기 위해 필요합니다.
const { pages, getPageById } = storeToRefs(pageStore);

// 3. 현재 페이지를 찾는 반응형 로직을 작성합니다.
// computed를 사용하면 route.params.pageId가 바뀔 때마다 자동으로 다시 계산됩니다.
const currentPage = computed(() => {
  // route.params.pageId는 string | string[] 타입일 수 있으므로, 확실하게 string으로 변환합니다.
  const pageId = Array.isArray(route.params.pageId) ? route.params.pageId[0] : route.params.pageId;

  // pageId가 존재하고, getter가 정의되어 있을 때만 페이지를 찾습니다.
  if (pageId && getPageById.value) {
    return getPageById.value(pageId);
  }
  return null;
});

// 4. 방어 로직: 페이지 목록이 비어있을 경우 데이터를 불러옵니다.
// watchEffect는 내부에서 사용된 반응형 상태(pages)가 변경될 때마다 실행됩니다.
// 사용자가 URL을 직접 치고 들어와 pages가 비어있을 때 fetchPages를 호출해줍니다.
watchEffect(() => {
  if (pages.value.length === 0) {
    pageStore.fetchPages();
  }
});

</script>

<template>
  <!-- currentPage가 찾아지면 내용을 보여주고, 아니면 로딩 또는 에러 메시지를 표시합니다. -->
  <div v-if="currentPage">
    <h1>{{ currentPage.title }}</h1>
    <p>
      <!-- 페이지 콘텐츠가 있다면 보여주고, 없다면 안내 메시지를 표시합니다. -->
      {{ currentPage.content || '아직 작성된 내용이 없습니다.' }}
    </p>
  </div>
  <div v-else>
    <p>페이지를 불러오는 중이거나, 존재하지 않는 페이지입니다.</p>
  </div>
</template>

<style scoped>
/* 이 컴포넌트에만 적용될 스타일 */
h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>