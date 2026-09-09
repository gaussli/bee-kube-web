<template>
  <BeePage>
    <!-- 页面 Header -->
    <BeeBackHeader :actions="headerActionItems" title="编辑集群" @action="handleHeaderActions" @back="handleBack" />

    <!-- 表单 Body -->
    <BeeCard class="edit-body">
      <div class="edit-basic">
        <div class="edit-basic__field">
          <div class="edit-basic__field-name">
            <BeeIcon class="edit-basic__field-name-icon" name="basic-id" />
            <span>UID</span>
          </div>
          <div class="edit-basic__field-value is-disabled">
            <input id="uid" v-model="detailData.uid" disabled />
          </div>
        </div>
        <div class="edit-basic__field">
          <div class="edit-basic__field-name">
            <BeeIcon class="edit-basic__field-name-icon" name="basic-field-name" />
            <span>名称 / Name</span>
          </div>
          <div class="edit-basic__field-value is-disabled">
            <input id="name" v-model="detailData.name" disabled />
          </div>
        </div>
        <div class="edit-basic__field grid-line">
          <div class="edit-basic__field-name">
            <BeeIcon class="edit-basic__field-name-icon" name="basic-description" />
            <span>描述</span>
          </div>
          <div class="edit-basic__field-value edit-basic__field-value-textarea">
            <textarea id="desc" v-model="detailData.description" placeholder="集群描述" :rows="5"></textarea>
          </div>
        </div>
      </div>
    </BeeCard>
  </BeePage>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import { useRouter } from 'vue-router'

import type { ClusterDetailVo } from '@/types/kubernetes/cluster'

import BeeIcon from '@/components/base/BeeIcon/index.vue'
import BeeBackHeader, { type ActionItem } from '@/components/business/BeeBackHeader/index.vue'
import BeeCard from '@/components/layout/BeeCard/index.vue'
import BeePage from '@/components/layout/BeePage/index.vue'

defineOptions({ name: 'ClusterEdit' })

// ==================== Route ====================
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

// ==================== Variable ====================
const headerActionItems = ref<ActionItem[]>([
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

// ==================== Handler ====================
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

// ====================  ====================
onMounted(() => {})
</script>

<style lang="scss" scoped>
@use 'sass:map';

.edit-body {
  display: flex;
  gap: 16px;
  flex-direction: column;
  flex: 1;
  padding: 16px;
  overflow: hidden auto;

  .edit-basic {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr 1fr;

    &__field {
      display: flex;
      gap: 8px;
      flex-direction: column;
      width: 100%;

      &-name {
        display: flex;
        gap: 8px;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;
        font-weight: normal;
        color: $color-text-third;
      }

      &-value {
        display: flex;
        gap: 8px;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        min-height: 32px;
        padding: 0 14px;
        border: 1px solid;
        border-color: map.get($colors-default, 'border', 'base');
        border-radius: 9999px;
        font-size: 14px;
        font-weight: normal;
        color: $color-text-primary;

        input,
        textarea {
          flex: 1;
        }

        &-textarea {
          padding: 14px;
          border-radius: 8px;
        }

        &.is-disabled {
          background: map.get($colors-default, 'bg', 'hover');
        }
      }

      &.grid-line {
        grid-column: 1 / 3;
      }
    }
  }
}
</style>
