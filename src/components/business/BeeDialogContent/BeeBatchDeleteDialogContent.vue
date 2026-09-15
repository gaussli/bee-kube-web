<template>
  <div class="bee-batch-delete-dialog-content">
    <template v-if="nonDeletableData.length > 0">
      <span>
        您共选中 <strong>{{ deleteData.length }}</strong> 个{{ props.resourceType }}。其中以下
        <strong>{{ nonDeletableData.length }}</strong> 个{{ props.resourceType }}不可删除，将忽略：
      </span>
      <div class="content-tags">
        <BeeCapsule v-for="item in nonDeletableData" :key="item.uid" :label="item.name" size="small" />
      </div>
    </template>
    <template v-if="deletableData.length > 0">
      <span
        >您确认删除以下 <strong>{{ deletableData.length }}</strong> 个{{ resourceType }}吗？</span
      >
      <div class="content-tags">
        <BeeCapsule v-for="item in deletableData" :key="item.uid" :label="item.name" size="small" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import BeeCapsule from '@/components/base/BeeCapsule/index.vue'

// ==================== Prop & Emit ====================
const props = defineProps<{
  resourceType: string
  deleteData: {
    uid: string
    name: string
    deletable: boolean
  }[]
}>()

// ==================== Reactive State ====================
const deletableData = computed(() => props.deleteData.filter(row => row.deletable))
const nonDeletableData = computed(() => props.deleteData.filter(row => !row.deletable))
</script>

<style lang="scss" scoped>
.bee-batch-delete-dialog-content {
  display: flex;
  gap: 12px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  overflow-y: auto;

  .content-tags {
    display: flex;
    gap: 8px;
    flex-flow: row wrap;
    width: 100%;
  }
}
</style>
