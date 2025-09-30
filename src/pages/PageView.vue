<script setup lang="ts">
import { useRoute } from 'vue-router';

// useRoute()는 현재 활성화된 라우트의 정보를 담고 있는 객체입니다.
// 이 객체를 통해 URL의 파라미터, 쿼리, 전체 경로 등의 정보에 접근할 수 있습니다.
const route = useRoute();

// route.params는 URL 경로에 포함된 동적 파라미터들을 담고 있습니다.
// 예를 들어, URL이 /pages/12345 라면, route.params.pageId는 '12345'가 됩니다.
// 이 pageId를 이용해 나중에는 Pinia 스토어나 API에서 실제 페이지 데이터를 가져오게 됩니다.
const pageId = route.params.pageId;
</script>

<template>
  <div>
    <h1>페이지 상세 뷰</h1>
    <p>현재 보고 있는 페이지의 ID: {{ pageId }}</p>
    <!-- TODO: 나중에는 여기에 페이지 제목, 내용 등 실제 데이터가 렌더링됩니다. -->
  </div>
</template>

<style scoped>
/* 이 컴포넌트에만 적용될 스타일 */
</style>
