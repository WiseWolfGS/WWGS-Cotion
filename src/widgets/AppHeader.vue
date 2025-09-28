<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/app/store/auth.store'
import Button from '@/shared/ui/AppButton.vue'

const authStore = useAuthStore()
const { isLoggedIn, user } = storeToRefs(authStore)
const { loginWithGoogle, logout } = authStore
</script>

<template>
  <header
    class="fixed top-0 w-[85%] bg-blue-300 text-white p-2 shadow-md flex items-center justify-between"
  >
    <a href="/" class="flex items-center text-xl font-bold">
      <img src="../shared/assets/CotionLogo.svg" alt="Logo" width="64px" height="64px" />
      <h1>Notion Clone</h1>
    </a>

    <nav>
      <ul class="flex space-x-4">
        <li><a href="#" class="hover:text-red-200">Home</a></li>
        <li><a href="#" class="hover:text-red-200">Docs</a></li>
        <li><a href="#" class="hover:text-red-200">Q&A</a></li>
      </ul>
    </nav>

    <!-- Right Section: Actions -->
    <div class="flex items-center space-x-4">
      <!-- Search Button -->
      <Button v-if="isLoggedIn" variant="ghost">Search</Button>

      <!-- Notifications Button -->
      <Button v-if="isLoggedIn" variant="ghost" size="icon">
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
      </Button>

      <!-- Auth Block -->
      <div v-if="isLoggedIn && user" class="flex items-center space-x-2">
        <img class="w-8 h-8 rounded-full" :src="user.photoURL || ''" alt="User Avatar" />
        <span class="text-sm font-medium text-gray-800">{{ user.displayName }}</span>
        <Button @click="logout" variant="secondary">Logout</Button>
      </div>

      <div v-else>
        <Button @click="loginWithGoogle" variant="primary">Login with Google</Button>
      </div>
    </div>
  </header>
</template>
