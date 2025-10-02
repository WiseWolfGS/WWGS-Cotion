<script setup lang="ts">
import { type PropType, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePageStore } from '@/entities/page/page.store'
import { storeToRefs } from 'pinia'
import AppButton from '@/shared/ui/AppButton.vue'
import AppLogo from '@/shared/ui/AppLogo.vue'

// Prop for mobile sidebar toggle
defineProps({
  onToggleMobileSidebar: {
    type: Function as PropType<() => void>,
    required: true,
  },
})

// --- Logic for Save Button and Page Title ---
const route = useRoute()
const pageStore = usePageStore()

const { getPageById } = storeToRefs(pageStore)

// Get current page based on route params
const currentPage = computed(() => {
  const pageId = route.params.pageId as string
  if (pageId && getPageById.value) {
    return getPageById.value(pageId)
  }
  return null
})

// Send save signal via Pinia store
function triggerSave() {
  pageStore.saveTrigger++
}
</script>

<template>
  <header class="flex items-center p-2 border-b border-gray-200 dark:border-gray-700">
    <!-- Hamburger Menu Button (Mobile Only) -->
    <AppButton variant="ghost" size="icon" class="md:hidden mr-2" @click="onToggleMobileSidebar">
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
    <div class="flex items-center gap-2 text-sm font-semibold">
      <AppLogo class="w-11 h-11" />
      <!-- Show current page title or workspace as fallback -->
      <span v-if="currentPage">{{ currentPage.title }}</span>
      <span v-else>Workspace</span>
    </div>

    <!-- Action Buttons -->
    <div class="ml-auto flex items-center gap-2">
      <AppButton variant="ghost">Share</AppButton>
      <!-- Show save button only when on a specific page -->
      <AppButton v-if="currentPage" @click="triggerSave">저장</AppButton>
    </div>
  </header>
</template>