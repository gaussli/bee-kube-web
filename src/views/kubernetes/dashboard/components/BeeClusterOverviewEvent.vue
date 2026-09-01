<template>
  <BeeCard class="bee-cluster-overview-event">
    <div class="bee-cluster-overview-event__header">
      <div class="bee-cluster-overview-event__title">
        <BeeIcon name="basic-id" :size="14" />
        最近事件
      </div>
      <div class="bee-cluster-overview-event__actions">
        <BeeCircleButton :border="false" icon="basic-refresh" size="small" tooltip="刷新" @click="loadEvents" />
      </div>
    </div>
    <div class="bee-cluster-overview-event__body">
      <BeeTable :data="recentEvents">
        <BeeTableColumn :width="100">
          <template #default="{ row }">
            <BeeTag size="small" :type="row.type === 'Warning' ? 'warning' : 'default'">
              {{ row.type }}
            </BeeTag>
          </template>
        </BeeTableColumn>
        <BeeTableColumn :width="180">
          <template #default="{ row }">
            <BeeTableCommonCell subtext="原因" :text="row.reason" />
          </template>
        </BeeTableColumn>
        <BeeTableColumn :min-width="200">
          <template #default="{ row }">
            <BeeTableCommonCell subtext="关联资源" :text="`${row.regarding?.kind}/${row.regarding?.name}`" />
          </template>
        </BeeTableColumn>
        <BeeTableColumn :min-width="300">
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

import BeeCard from '@/components/BeeCard/index.vue'
import BeeCircleButton from '@/components/BeeCircleButton/index.vue'
import BeeIcon from '@/components/BeeIcon/index.vue'
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
const recentEvents = ref<EventListVo[]>([])

/**
 * 加载事件数据
 * @remarks 获取第一页事件，每页 10 条
 */
async function loadEvents() {
  if (!props.clusterUid) return
  const resp = await getClusterEventList(props.clusterUid, { page: 1, pageSize: 20 })
  recentEvents.value = resp.list
}

onMounted(() => {
  void loadEvents()
})
</script>

<style lang="scss" scoped>
.bee-cluster-overview-event {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
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
    padding-bottom: 16px;
  }
}
</style>
