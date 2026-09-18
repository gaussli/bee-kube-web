<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeeBackHeader :actions="actionItems" title="编辑集群" @action="handleHeaderActions" @back="handleBack" />

    <!-- 表单 Body -->
    <BeeCard class="edit-body">
      <div class="edit-basic">
        <BeeFieldInput id="uid" v-model="detailData.uid" disabled icon="basic-id" label="UID" />
        <BeeFieldInput id="name" v-model="detailData.name" disabled icon="basic-field-name" label="名称 / Name" />
        <BeeFieldTextarea
          id="desc"
          v-model="detailData.description"
          class="grid-line"
          icon="basic-description"
          label="描述"
          :max-length="255"
          :rows="5"
          tip="描述长度不能超过 255 个字符"
        />
      </div>
    </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import { useRouter } from 'vue-router'

import type { ClusterDetailVo } from '@/types/kubernetes/cluster'

import BeeFieldInput from '@/components/base/BeeFieldInput/index.vue'
import BeeFieldTextarea from '@/components/base/BeeFieldTextarea/index.vue'
import BeeBackHeader, { type ActionItem } from '@/components/business/BeeBackHeader/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

defineOptions({ name: 'ClusterEdit' })

const router = useRouter()

// ==================== Reactive State ====================
const detailData = reactive<ClusterDetailVo>({
  uid: 'fjkdalfafdasifklqwureioqw',
  name: 'cluster-fdjaklfjkkasdfas',
  description: '飞经理开始点击发送看了卷发恐龙时代俊峰快乐',
  status: 'Healthy',
  statusMsg: 'jsfklasdjfklas daklfjaslfj',
  apiServer: 'https://192.23.234.54:6443',
  k8sVersion: 'v1.25.4',
  certExpireAt: '2028-08-21 23:34:56',
  resource: { capacity: {}, allocation: {}, usage: {} },
  deletable: false,
})

const actionItems = ref<ActionItem[]>([
  {
    value: 'save',
    label: '暂存',
    icon: 'basic-save',
  },
  {
    value: 'submit',
    label: '提交',
    icon: 'basic-right',
    type: 'success',
  },
])

/**
 * 处理页面返回
 */
function handleBack() {
  router.back()
}

/**
 * 处理操作按钮组逻辑
 * @param value
 */
async function handleHeaderActions(value: string) {
  switch (value) {
    case 'save': {
      await handleSave()
      break
    }
    case 'submit': {
      await handleSubmit()
      break
    }
  }
}

/**
 * 暂存集群数据
 */
async function handleSave() {}

/**
 * 提交集群数据
 */
async function handleSubmit() {}
</script>

<style lang="scss" scoped>
.edit-body {
  display: flex;
  gap: 16px;
  flex-direction: column;
  flex: 1;
  padding: 16px;
  overflow: hidden auto;

  .edit-basic {
    display: grid;
    gap: 24px;
    grid-template-columns: 1fr 1fr;

    > .grid-line {
      grid-column: 1 / 3;
    }
  }
}
</style>
