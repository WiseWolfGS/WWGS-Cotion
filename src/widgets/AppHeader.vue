<script setup lang="ts">
import { type PropType } from 'vue';
import AppButton from '@/shared/ui/AppButton.vue';

defineProps({
  onToggleMobileSidebar: {
    type: Function as PropType<() => void>,
    required: true,
  },
});
</script>

<template>
  <header class="flex items-center p-2 border-b border-gray-200 dark:border-gray-700">
    <!-- Hamburger Menu Button (Mobile Only) -->
    <AppButton
      variant="ghost"
      size="icon"
      class="md:hidden mr-2"
      @click="onToggleMobileSidebar"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </AppButton>

    <!-- Breadcrumbs / Page Title -->
    <div class="flex items-center text-sm">
      <span>Page Title</span>
    </div>

    <div class="ml-auto">
      <AppButton variant="ghost">Share</AppButton>
    </div>
  </header>
</template>