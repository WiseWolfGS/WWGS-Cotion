<script setup lang="ts">
import Button from '@/shared/ui/AppButton.vue'
</script>

<template>
  <aside
    class="fixed top-0 left-0 h-full w-[15%] bg-gray-800 text-white p-4 flex flex-col space-y-4 shadow-lg"
  >
    <div class="flex items-center justify-between mb-4">
      <span class="text-lg font-bold">Workspace</span>
      <!-- Add workspace options/menu here later -->
    </div>

    <ul class="flex flex-col space-y-2 flex-grow">
      <li><a href="#" class="block p-2 rounded hover:bg-gray-700">My Pages</a></li>
      <li><a href="#" class="block p-2 rounded hover:bg-gray-700">Templates</a></li>
      <li><a href="#" class="block p-2 rounded hover:bg-gray-700">Shared with me</a></li>
      <li><a href="#" class="block p-2 rounded hover:bg-gray-700">Trash</a></li>
    </ul>

    <Button text="New Page" variant="primary" class="w-full" />
  </aside>
</template>
