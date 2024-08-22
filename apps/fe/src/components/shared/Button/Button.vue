<script lang="ts" setup>
import { computed } from 'vue'
import { buttonVariants, tuneColor } from '@/utils'

// Define props
const props = defineProps<{
  className?: string
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  icon?: string
  iconSize?: number
  disabled?: boolean
  isWorking?: boolean
  isActive?: boolean
}>()

// Computed properties
const getButtonStyles = computed(() => {
  const color = buttonVariants[props.variant || 'primary']
  return {
    '--bg-variant': color,
    '--bg-variant-dark': tuneColor.darken(color, 0.1),
    '--bg-variant-light': tuneColor.lighten(color, 0.15),
    '--primary': buttonVariants['primary']
  }
})
</script>

<template>
  <button
    type="button"
    v-bind="$attrs"
    :class="[variant, { iconOnly: !$slots.default }, { isActive }]"
    class="inline-flex items-center justify-center h-8 px-3 leading-none align-middle transition-all duration-100 rounded-sm appearance-none cursor-pointer select-none whitespace-nowrap"
    :disabled="disabled"
    :style="getButtonStyles"
  >
    <j-icon v-if="isWorking" :size="iconSize" name="spin" class="spinner"></j-icon>
    <j-icon v-if="!isWorking && icon" :size="iconSize" :name="icon"></j-icon>

    <div v-if="$slots.default" :class="{ withPadding: isWorking || icon }">
      <slot />
    </div>
  </button>
</template>

<style lang="scss" scoped>
.button {
  font-size: 14.5px;
  &.iconOnly {
    padding-left: 8px;
    padding-right: 8px;
  }
}

.secondary,
.empty {
  font-weight: 400;
  color: rgb(66 82 110);
}
.secondary:not(:disabled):hover,
.empty:not(:disabled):hover {
  background-color: rgb(235 236 240);
}
.secondary:not(:disabled):active,
.empty:not(:disabled):active {
  background-color: rgb(210 229 254);
  color: var(--primary);
}

.button:disabled {
  opacity: 0.5;
  cursor: default;
  pointer-events: none;
}

.withPadding {
  padding-left: 8px;
}

.isActive {
  color: rgb(0 82 204);
  background-color: rgb(210 229 254);
}

.primary,
.success,
.danger,
.info,
.warning {
  color: white;
  font-weight: 500;
  background: var(--bg-variant);
  &:not(:disabled) {
    &:hover {
      background: var(--bg-variant-light);
    }
    &:active {
      background: var(--bg-variant-dark);
    }
    &.active {
      background: var(--bg-variant-dark) !important;
    }
  }
  &:focus,
  &:active {
    outline: none;
    box-shadow: 0 0 0 2px var(--bg-variant);
  }
}

.secondary {
  background: var(--bg-variant);
}
.empty {
  background: white;
  outline: none;
  &:focus,
  &:active {
    outline: none;
  }
}
</style>
