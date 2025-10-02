<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppHeader from '@/widgets/AppHeader.vue';
import AppSidebar from '@/widgets/AppSidebar.vue';
import AppFooter from '@/widgets/AppFooter.vue';

// --- Desktop Sidebar Resize Logic ---
const SIDEBAR_WIDTH_STORAGE_KEY = 'sidebar-width';
const DEFAULT_SIDEBAR_WIDTH = 240;
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 500;

const sidebarWidth = ref(DEFAULT_SIDEBAR_WIDTH);
const isResizing = ref(false);

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
  localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(sidebarWidth.value));
};

onMounted(() => {
  const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
  if (savedWidth) {
    const parsedWidth = parseInt(savedWidth, 10);
    if (parsedWidth >= MIN_SIDEBAR_WIDTH && parsedWidth <= MAX_SIDEBAR_WIDTH) {
      sidebarWidth.value = parsedWidth;
    }
  }
});

// --- Mobile Sidebar Logic ---
const isMobileSidebarOpen = ref(false);

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
};

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false;
};
</script>

<template>
  <div class="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Backdrop for mobile -->
    <div
      v-if="isMobileSidebarOpen"
      @click="closeMobileSidebar"
      class="fixed inset-0 bg-black/50 z-20 md:hidden"
    ></div>

    <AppSidebar
      :width="sidebarWidth"
      :on-start-resize="startResize"
      :is-mobile-open="isMobileSidebarOpen"
    />

    <div class="flex-1 flex flex-col overflow-hidden">
      <AppHeader :on-toggle-mobile-sidebar="toggleMobileSidebar" />

      <main class="flex-1 overflow-y-auto p-4">
        <RouterView />
      </main>

      <AppFooter />
    </div>
  </div>
</template>