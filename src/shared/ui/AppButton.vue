<template>
  <button
    :class="['rounded-md font-medium transition-colors duration-200', variantClasses, sizeClasses]"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'default' | 'icon'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'ghost',
  size: 'default',
})

const emit = defineEmits(['click'])

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-blue-600 text-white hover:bg-blue-700' // Primary is often consistent across themes
    case 'secondary':
      return 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
    case 'ghost':
      return 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
    default:
      return 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'icon':
      return 'p-2'
    case 'default':
    default:
      return 'px-4 py-2'
  }
})

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style scoped>
/* No scoped styles needed if using Tailwind exclusively */
</style>
