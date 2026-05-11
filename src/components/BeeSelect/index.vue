<template>
  <div class="bee-select" :class="{ 'is-disabled': disabled }">
    <el-select :model-value="modelValue" :placeholder="placeholder" :clearable="clearable" :disabled="disabled" :loading="loading" @change="handleChange">
      <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ElSelect, ElOption } from 'element-plus'

defineOptions({ name: 'BeeSelect' })

interface Option {
  label: string
  value: string | number | undefined
}

interface Props {
  modelValue?: string | number
  placeholder?: string
  options: Option[]
  clearable?: boolean
  disabled?: boolean
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  clearable: true,
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | undefined): void
  (e: 'change', value: string | number | undefined): void
}>()

function handleChange(value: string | number | undefined) {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style lang="scss" scoped>
.bee-select {
  :deep(.el-select) {
    width: 160px;
  }
}
</style>
