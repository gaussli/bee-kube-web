<template>
  <div class="deployment-events">
    <!-- 工具栏 -->
    <div class="deployment-events__toolbar">
      <BeeSearchInput v-model="queryForm.reason" class="deployment-events__toolbar-search" placeholder="按原因搜索" />
      <BeeSearchInput v-model="queryForm.note" class="deployment-events__toolbar-search" placeholder="按事件信息搜索" />
      <BeeSelect v-model="queryForm.type" :options="EVENT_TYPE_OPTIONS" placeholder="类型筛选" />
      <BeeButton icon="basic-search" @click="handleSearch"> 搜索 </BeeButton>
      <BeeButton icon="basic-refresh" @click="handleReset"> 重置 </BeeButton>
    </div>

    <!-- 表格 -->
    <div class="deployment-events__table">
      <BeeTable :data="events" :loading="loading" row-key="uid">
        <!-- 类型 -->
        <BeeTableColumn :width="100">
          <template #default="{ row }">
            <BeeCapsule
              :copyable="false"
              :label="eventTypeLabel(row.type)"
              size="small"
              :type="eventTypeTheme(row.type)"
            />
          </template>
        </BeeTableColumn>
        <!-- 原因 -->
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeTableCommonCell :label="row.reason || '-'" sublabel="原因" />
          </template>
        </BeeTableColumn>
        <!-- 关联对象 -->
        <BeeTableColumn :width="220">
          <template #default="{ row }">
            <BeeTableCommonCell :label="row.regarding?.name || '-'" :sublabel="row.regarding?.kind || '关联对象'" />
          </template>
        </BeeTableColumn>
        <!-- 事件信息 -->
        <BeeTableColumn :min-width="320">
          <template #default="{ row }">
            <BeeTableCommonCell :label="row.note || '-'" sublabel="事件信息" />
          </template>
        </BeeTableColumn>
        <!-- 上报组件 -->
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeTableCommonCell :label="row.reportingController || '-'" sublabel="上报组件" />
          </template>
        </BeeTableColumn>
        <!-- 发生次数 -->
        <BeeTableColumn :width="120">
          <template #default="{ row }">
            <BeeTableCommonCell :label="String(row.series?.count ?? 1)" sublabel="发生次数" />
          </template>
        </BeeTableColumn>
        <!-- 最后触发时间 -->
        <BeeTableColumn :width="200">
          <template #default="{ row }">
            <BeeTableCommonCell :label="lastObservedTime(row)" sublabel="最后触发时间" />
          </template>
        </BeeTableColumn>
      </BeeTable>
    </div>

    <!-- 底栏 -->
    <div class="deployment-events__footer">
      <BeePagination
        v-model:page="pageData.page"
        v-model:page-size="pageData.pageSize"
        :total="pageData.total"
        @change="fetchEvents"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Deployment 详情 - 事件信息
 * @module views/kubernetes/workload/deployment/detail/events
 * @description 展示该无状态应用的事件（Event），支持按类型 / 原因 / 事件信息筛选与分页
 */
import { computed, onMounted, reactive, ref } from 'vue'

import { useRoute } from 'vue-router'

import type { EventListVo } from '@/types/kubernetes/event'

import type { BeeType } from '@/config'
import type { EventType } from '@/config/kubernetes/event'

import { getDeploymentEventList } from '@/api/kubernetes/workload/deployment'

import BeeButton from '@/components/base/BeeButton/index.vue'
import BeeCapsule from '@/components/base/BeeCapsule/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeePagination from '@/components/base/BeePagination/index.vue'
import BeeSearchInput from '@/components/base/BeeSearchInput/index.vue'
import BeeSelect from '@/components/base/BeeSelect/index.vue'
import BeeTableColumn from '@/components/BeeTable/BeeTableColumn.vue'
import BeeTableCommonCell from '@/components/BeeTable/BeeTableCommonCell.vue'
import BeeTable from '@/components/BeeTable/index.vue'

import { EVENT_TYPE_OPTIONS } from '@/config/kubernetes/event'

defineOptions({ name: 'DeploymentEvents' })

const route = useRoute()

// ==================== Computed ====================
/** 所属集群 UID（路由参数） */
const clusterUid = computed(() => route.params.clusterUid as string)
/** 所属命名空间名称（路由参数） */
const namespace = computed(() => route.params.namespace as string)
/** 被查看无状态应用名称（路由参数） */
const deploymentName = computed(() => route.params.name as string)

// ==================== Reactive State ====================
/** 列表加载态 */
const loading = ref(false)
/** 事件列表 */
const events = ref<EventListVo[]>([])
/** 查询条件：原因与事件信息为模糊匹配关键词 */
const queryForm = reactive<{ type: EventType | undefined; reason: string; note: string }>({
  type: undefined,
  reason: '',
  note: '',
})
/** 分页数据 */
const pageData = reactive({ page: 1, pageSize: 10, total: 0 })

// ==================== Method ====================
/**
 * 加载事件列表
 */
async function fetchEvents() {
  if (!clusterUid.value || !namespace.value || !deploymentName.value) {
    events.value = []
    pageData.total = 0
    return
  }
  loading.value = true
  try {
    const { list, total, page, pageSize } = await getDeploymentEventList(
      clusterUid.value,
      namespace.value,
      deploymentName.value,
      {
        type: queryForm.type,
        reason: queryForm.reason || undefined,
        note: queryForm.note || undefined,
        page: pageData.page,
        pageSize: pageData.pageSize,
      },
    )
    events.value = list
    pageData.total = total
    pageData.page = page
    pageData.pageSize = pageSize
  } catch {
    BeeMessage.error('加载事件列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 事件类型中文标签
 * @param type - 事件类型
 * @returns 中文标签，未匹配时返回原值
 */
function eventTypeLabel(type?: EventType): string {
  if (!type) return '-'
  return EVENT_TYPE_OPTIONS.find(item => item.value === type)?.label || type
}

/**
 * 事件类型对应的标签配色
 * @param type - 事件类型
 * @returns 标签配色
 */
function eventTypeTheme(type?: EventType): BeeType {
  return EVENT_TYPE_OPTIONS.find(item => item.value === type)?.type || 'default'
}

/**
 * 计算最后触发时间
 * @param row - 事件行数据
 * @returns 系列事件最近观测时间，无系列信息时取事件时间
 */
function lastObservedTime(row: EventListVo): string {
  return row.series?.lastObservedTime || row.eventTime || '-'
}

// ==================== Handler ====================
/**
 * 搜索
 */
function handleSearch() {
  pageData.page = 1
  void fetchEvents()
}

/**
 * 重置搜索条件
 */
function handleReset() {
  queryForm.type = undefined
  queryForm.reason = ''
  queryForm.note = ''
  pageData.page = 1
  pageData.pageSize = 10
  void fetchEvents()
}

// ==================== Lifecycle ====================
onMounted(() => {
  void fetchEvents()
})
</script>

<style lang="scss" scoped>
.deployment-events {
  display: flex;
  gap: 16px;
  flex-flow: column;
  justify-content: flex-start;
  align-items: stretch;
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow: hidden;

  &__toolbar {
    display: flex;
    gap: 8px;
    flex-flow: row wrap;
    align-items: center;

    &-search {
      flex: 1;
      min-width: 100px;
    }
  }

  &__table {
    flex: 1;
    min-height: 0;
  }

  &__footer {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
