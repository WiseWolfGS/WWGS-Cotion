<template>
  <button
    :class="[
      'px-4 py-2 rounded-md font-medium transition-colors duration-200',
      variantClasses
    ]"
    @click="handleClick"
  >
    {{ text }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  text: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'ghost', // Default to a less intrusive style
});

const emit = defineEmits(['click']);

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-blue-600 text-white hover:bg-blue-700';
    case 'secondary':
      return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
    case 'ghost':
      return 'text-gray-600 hover:bg-gray-100';
    default:
      return 'text-gray-600 hover:bg-gray-100';
  }
});

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<style scoped>
/* No scoped styles needed if using Tailwind exclusively */
</style>