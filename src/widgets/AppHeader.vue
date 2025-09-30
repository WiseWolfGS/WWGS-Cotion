<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePageStore } from '@/entities/page/page.store'
import { storeToRefs } from 'pinia'
import AppButton from '@/shared/ui/AppButton.vue'

const route = useRoute()
const pageStore = usePageStore()

const { getPageById } = storeToRefs(pageStore)
const currentPage = computed(() => {
  const pageId = route.params.pageId as string
  if (pageId && getPageById.value) {
    return getPageById.value(pageId)
  }
  return null
})

// 저장 신호를 보내는 함수
function triggerSave() {
  pageStore.saveTrigger++
}
</script>

<template>
  <header
    class="h-16 border-b border-gray-200 bg-white dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 flex-shrink-0"
  >
    <div class="flex items-center justify-between h-full px-4">
      <!-- 페이지 경로 (Breadcrumb) -->
      <div v-if="currentPage" class="text-sm font-semibold">
        {{ currentPage.title }}
      </div>
      <div v-else class="text-sm font-semibold">Workspace</div>

      <!-- 페이지 액션 버튼들 -->
      <div class="flex items-center gap-2">
        <!-- 현재 페이지가 있을 때만 저장 버튼을 보여줍니다. -->
        <AppButton v-if="currentPage" @click="triggerSave" class="dark:text-gray-100"
          >저장</AppButton
        >
        <!-- 향후 공유, 댓글 등 다른 버튼 추가 -->
      </div>
    </div>
  </header>
</template>
