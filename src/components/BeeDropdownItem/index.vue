<template>
  <div class="bee-dropdown__item" :class="{ 'is-divided': divided }" @click="$emit('click')">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    divided?: boolean
  }>(),
  {
    divided: false
  }
)

defineEmits<{
  click: []
}>()

defineOptions({ name: 'BeeDropdownItem' })
</script>

<style lang="scss" scoped>
.bee-dropdown__item {
  &.is-divided {
    padding-top: 8px;
    margin-top: 4px;

    // border-top: 1px solid $border-color;
  }
}
</style>
