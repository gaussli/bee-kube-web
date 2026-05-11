<template>
  <el-input v-model="searchValue" :placeholder="placeholder" class="search-input" @keydown.enter.prevent="handleSearch">
    <template #append>
      <el-button :icon="Search" @click="handleSearch" />
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

defineOptions({ name: 'InputSearch' })

const props = defineProps<{
  placeholder?: string
}>()

const emit = defineEmits<{
  search: [value?: string]
}>()

const searchValue = ref()

function handleSearch() {
  emit('search', searchValue.value)
}
</script>

<style lang="scss" scoped>
.search-input {
  --el-border-radius-base: 16px;
  --el-font-size-base: 12px;

  width: 200px;

  :deep(.el-input__wrapper) {
    padding: 0 0 0 16px;
    box-shadow: none;
  }

  :deep(.el-input-group__append) {
    padding: 0 8px 0 0;
    box-shadow: none;

    .el-button {
      width: 32px;
      padding: 0;
      margin: 0;
      border: none;
    }
  }
}
</style>
