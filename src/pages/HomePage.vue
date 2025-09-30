<script setup lang="ts">
import AppHeader from '@/widgets/AppHeader.vue'
import AppSidebar from '@/widgets/AppSidebar.vue' // AppNavigation 대신 AppSidebar 임포트
import AppFooter from '@/widgets/AppFooter.vue'
</script>

<template>
  <div class="flex">
    <AppSidebar />
    <div class="w-full flex-1 ml-[15%]">
      <AppHeader />
      <div class="h-screen p-4 mt-24">
        <!-- 
          <RouterView />는 Vue Router가 제공하는 핵심 컴포넌트입니다.
          현재 URL 경로와 일치하는 라우트 규칙을 찾고, 그 규칙에 연결된 컴포넌트를 이 자리에 렌더링합니다.
          예를 들어, URL이 /pages/123 이면, router/index.ts에 설정한 규칙에 따라 PageView.vue 컴포넌트가 이 자리에 보이게 됩니다.
          만약 일치하는 자식 라우트가 없으면 아무것도 표시되지 않습니다.
        -->
        <RouterView />
      </div>
      <AppFooter />
    </div>
  </div>
</template>