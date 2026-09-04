<template>
  <BeeCard class="bee-cluster-overview-event">
    <div class="bee-cluster-overview-event__header">
      <div class="bee-cluster-overview-event__title">
        <BeeIcon name="kubernetes-event" :size="16" />
        最近事件
      </div>
    </div>
    <div class="bee-cluster-overview-event__body">
      <BeeTable :data="tableData" :loading="loading">
        <BeeTableColumn :width="100">
          <template #default="{ row }">
            <BeeTag size="small" :type="row.type === 'Warning' ? 'warning' : 'default'">
              {{ row.type }}
            </BeeTag>
          </template>
        </BeeTableColumn>
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeTableCommonCell subtext="原因" :text="row.reason" />
          </template>
        </BeeTableColumn>
        <BeeTableColumn :min-width="200">
          <template #default="{ row }">
            <BeeTableCommonCell subtext="关联资源" :text="`${row.regarding?.kind} / ${row.regarding?.name}`" />
          </template>
        </BeeTableColumn>
        <BeeTableColumn>
          <template #default="{ row }">
            <BeeTableCommonCell subtext="事件信息" :text="row.note" />
          </template>
        </BeeTableColumn>
        <BeeTableColumn :width="180">
          <template #default="{ row }">
            <BeeTableCommonCell subtext="最后触发时间" :text="row.eventTime" />
          </template>
        </BeeTableColumn>
      </BeeTable>
    </div>
  </BeeCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import type { EventListVo } from '@/types/kubernetes/event'

import { getClusterEventList } from '@/api/kubernetes/cluster'

import BeeIcon from '@/components/base/BeeIcon/index.vue'
import BeeCard from '@/components/BeeCard/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'

defineOptions({ name: 'BeeClusterOverviewEvent' })

const props = defineProps<{
  /** 集群 UID */
  clusterUid: string
}>()

/** 最近事件数据 */
const tableData = ref<EventListVo[]>([])

/** 加载状态 */
const loading = ref(false)

/**
 * 加载事件数据
 * @remarks 获取第一页事件，每页 10 条
 */
async function loadData() {
  if (!props.clusterUid) return
  loading.value = true
  try {
    const resp = await getClusterEventList(props.clusterUid, { page: 1, pageSize: 20 })
    tableData.value = resp.list
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadData()
})
</script>

<style lang="scss" scoped>
.bee-cluster-overview-event {
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    padding: 0 $spacing-16;
    font-weight: 500;
  }

  &__title {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  &__actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &__body {
    padding: 0 $spacing-16 $spacing-16;
  }
}
</style>
