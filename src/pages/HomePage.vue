<script setup lang="ts">
import AppHeader from '@/widgets/AppHeader.vue'
import AppSidebar from '@/widgets/AppSidebar.vue'
import AppFooter from '@/widgets/AppFooter.vue'
</script>

<template>
  <!-- 1. 전체 화면을 차지하는 flex 컨테이너 -->
  <div class="flex h-screen bg-white">
    <!-- 2. 사이드바: 고정 너비를 가짐 -->
    <AppSidebar />

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