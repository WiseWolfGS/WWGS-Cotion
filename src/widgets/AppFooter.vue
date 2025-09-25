<template>
  <footer
    class="fixed bottom-0 w-[85%] bg-gray-100 text-gray-600 p-4 text-center border-t border-gray-200 mt-8"
  >
    <p>&copy; {{ new Date().getFullYear() }} Notion Clone. All rights reserved.</p>
    <div class="flex justify-center space-x-4 mt-2">
      <a href="#" class="hover:text-gray-800">Privacy Policy</a>
      <a href="#" class="hover:text-gray-800">Terms of Service</a>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No script needed for static footer
</script>

<style scoped>
/* Tailwind handles styling */
</style>
