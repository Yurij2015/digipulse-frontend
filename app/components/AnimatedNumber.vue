<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  value: number | null
  durationMs?: number
  precision?: number | null
  prefix?: string
  suffix?: string
}>(), {
  durationMs: 700,
  precision: null,
  prefix: '',
  suffix: '',
})

const displayValue = ref<number>(props.value ?? 0)
const rafId = ref<number | null>(null)

const inferredPrecision = (v: number): number => {
  if (!Number.isFinite(v)) return 0
  const s = String(v)
  if (!s.includes('.')) return 0
  const decimals = s.split('.')[1]?.length ?? 0
  // Keep it reasonable for UI (99.97 etc.)
  return Math.min(2, decimals)
}

const effectivePrecision = computed(() => {
  const v = props.value ?? 0
  return props.precision ?? inferredPrecision(v)
})

const formatNumber = (v: number): string => {
  const p = effectivePrecision.value
  if (p <= 0) return `${Math.round(v)}`
  return v.toFixed(p)
}

const stop = () => {
  if (rafId.value) {
    cancelAnimationFrame(rafId.value)
    rafId.value = null
  }
}

const animateTo = (next: number) => {
  stop()

  const duration = Math.max(0, props.durationMs)
  const start = displayValue.value
  const delta = next - start

  // If nothing changes, don't animate.
  if (Math.abs(delta) < Number.EPSILON) {
    displayValue.value = next
    return
  }

  if (duration === 0 || typeof window === 'undefined') {
    displayValue.value = next
    return
  }

  const p = effectivePrecision.value
  const unit = p > 0 ? Math.pow(10, p) : 1

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

  const startTs = performance.now()
  const tick = (now: number) => {
    const elapsed = now - startTs
    const t = Math.min(1, elapsed / duration)
    const eased = easeOutCubic(t)

    // Snap to "UI unit" so it moves by meaningful steps (0.01/0.1/1/10...).
    const raw = start + delta * eased
    const snapped = unit > 1 ? Math.round(raw * unit) / unit : raw

    // Avoid last-frame jitter.
    if (t >= 1) {
      displayValue.value = next
      stop()
      return
    }

    displayValue.value = snapped
    rafId.value = requestAnimationFrame(tick)
  }

  rafId.value = requestAnimationFrame(tick)
}

watch(
  () => props.value,
  (next) => {
    if (next === null || next === undefined) return
    const safeNext = Number(next)
    if (!Number.isFinite(safeNext)) return
    animateTo(safeNext)
  },
  { immediate: false },
)

onBeforeUnmount(() => stop())

const formatted = computed(() => {
  const v = displayValue.value ?? 0
  return `${props.prefix}${formatNumber(v)}${props.suffix}`
})
</script>

<template>
  <span class="inline-block tabular-nums">
    {{ formatted }}
  </span>
</template>

