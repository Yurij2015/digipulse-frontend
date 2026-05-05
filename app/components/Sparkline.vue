<template>
  <div class="w-full h-10 overflow-hidden">
    <svg 
      v-if="data && data.length > 1" 
      class="w-full h-full" 
      preserveAspectRatio="none" 
      viewBox="0 0 100 100"
    >
      <!-- Gradient Fill -->
      <defs>
        <linearGradient :id="`gradient-${id}`" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :stop-color="color" stop-opacity="0.3" />
          <stop offset="100%" :stop-color="color" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Area -->
      <path 
        :d="areaPath" 
        :fill="`url(#gradient-${id})`"
        stroke="none"
      />

      <!-- Line -->
      <path 
        :d="linePath" 
        fill="none" 
        :stroke="color" 
        stroke-width="2.5" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      />
    </svg>
    <div v-else class="w-full h-full flex items-center justify-center">
      <div class="w-full h-px bg-neutral-100 dark:bg-white/5"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: number[];
  color?: string;
}>();

const id = Math.random().toString(36).substring(2, 9);
const color = computed(() => props.color || '#10b981'); // default emerald-500

const points = computed(() => {
  if (!props.data || props.data.length < 2) return [];
  
  const min = Math.min(...props.data);
  const max = Math.max(...props.data);
  const range = max - min || 1;
  
  return props.data.map((val, i) => ({
    x: (i / (props.data.length - 1)) * 100,
    y: 90 - ((val - min) / range) * 80 // 90 to 10 to keep some padding
  }));
});

const linePath = computed(() => {
  if (points.value.length < 2) return '';
  return points.value.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');
});

const areaPath = computed(() => {
  if (points.value.length < 2) return '';
  const first = points.value[0];
  const last = points.value[points.value.length - 1];
  return `${linePath.value} L ${last.x} 100 L ${first.x} 100 Z`;
});
</script>
