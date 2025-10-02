<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppHeader from '@/widgets/AppHeader.vue';
import AppSidebar from '@/widgets/AppSidebar.vue';
import AppFooter from '@/widgets/AppFooter.vue';

const SIDEBAR_WIDTH_STORAGE_KEY = 'sidebar-width';
const DEFAULT_SIDEBAR_WIDTH = 240;
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 500;

const sidebarWidth = ref(DEFAULT_SIDEBAR_WIDTH);
const isResizing = ref(false);

// --- Resize Logic ---
const startResize = (event: MouseEvent) => {
  event.preventDefault();
  isResizing.value = true;
  window.addEventListener('mousemove', doResize);
  window.addEventListener('mouseup', stopResize);
};

const doResize = (event: MouseEvent) => {
  if (!isResizing.value) return;
  
  const newWidth = event.clientX;
  
  if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
    sidebarWidth.value = newWidth;
  }
};

const stopResize = () => {
  isResizing.value = false;
  window.removeEventListener('mousemove', doResize);
  window.removeEventListener('mouseup', stopResize);
  
  // Save the final width to localStorage
  localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(sidebarWidth.value));
};

// --- Lifecycle Hooks ---
onMounted(() => {
  const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
  if (savedWidth) {
    const parsedWidth = parseInt(savedWidth, 10);
    if (parsedWidth >= MIN_SIDEBAR_WIDTH && parsedWidth <= MAX_SIDEBAR_WIDTH) {
      sidebarWidth.value = parsedWidth;
    }
  }
});
</script>

<template>
  <!-- 1. 전체 화면을 차지하는 flex 컨테이너 -->
  <div class="flex h-screen bg-white dark:bg-gray-900">
    <!-- 2. 사이드바: 너비가 동적으로 조절됨 -->
    <AppSidebar :width="sidebarWidth" :on-start-resize="startResize" />

    <!-- 3. 메인 영역: 남은 공간을 모두 차지하고, 내부에서 수직 flex 레이아웃을 가짐 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 3-1. 헤더 -->
      <AppHeader />

      <!-- 
        3-2. 메인 콘텐츠: 
        - flex-1: 남은 수직 공간을 모두 차지하여 푸터를 아래로 밀어냄
        - overflow-y-auto: 내용이 길어지면 이 영역만 스크롤됨
      -->
      <main class="flex-1 overflow-y-auto p-4">
        <RouterView />
      </main>

      <!-- 3-3. 푸터: 메인 콘텐츠 아래에 위치 -->
      <AppFooter />
    </div>
  </div>
</template>
