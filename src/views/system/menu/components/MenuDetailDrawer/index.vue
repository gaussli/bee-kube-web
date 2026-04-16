<template>
  <el-drawer v-model="visible" direction="rtl" size="500px" :with-header="false" class="menu-drawer">
    <div class="drawer-content">
      <div class="close-btn" @click="handleClose">
        <el-icon><Close /></el-icon>
      </div>

      <div class="menu-key-info">
        <div class="menu-icon">
          <el-icon :size="32"><Menu /></el-icon>
        </div>
        <div class="menu-meta">
          <div class="menu-name">
            {{ menuData.name }}
            <el-tag :type="menuData.type === 0 ? 'warning' : menuData.type === 1 ? 'primary' : 'info'" size="small">
              {{ menuTypeText }}
            </el-tag>
          </div>
          <div class="menu-code">{{ menuData.code }}</div>
        </div>
        <el-tag :type="menuData.status === 1 ? 'success' : 'danger'" size="small">
          {{ menuData.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </div>

      <BeeTab v-model="activeTab" :tabs="tabs">
        <template #menuInfo>
          <div class="info-list">
            <div class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><Key /></el-icon>
                <div>
                  <div class="label-zh">菜单ID</div>
                  <div class="label-en">Menu ID</div>
                </div>
              </div>
              <span class="info-value">{{ menuData.id }}</span>
            </div>
            <div class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><Link /></el-icon>
                <div>
                  <div class="label-zh">路由路径</div>
                  <div class="label-en">Route Path</div>
                </div>
              </div>
              <span class="info-value path">{{ menuData.frontPath || '-' }}</span>
            </div>
            <div class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><Document /></el-icon>
                <div>
                  <div class="label-zh">组件路径</div>
                  <div class="label-en">Component</div>
                </div>
              </div>
              <span class="info-value">{{ menuData.frontComponent || '-' }}</span>
            </div>
            <div class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><Lock /></el-icon>
                <div>
                  <div class="label-zh">权限标识</div>
                  <div class="label-en">Permission</div>
                </div>
              </div>
              <span class="info-value permission">{{ menuData.permission || '-' }}</span>
            </div>
            <div class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><Collection /></el-icon>
                <div>
                  <div class="label-zh">描述</div>
                  <div class="label-en">Description</div>
                </div>
              </div>
              <span class="info-value">{{ menuData.description || '-' }}</span>
            </div>
          </div>
        </template>
        <template #roles>
          <div class="empty-state">
            <el-icon :size="48"><UserFilled /></el-icon>
            <span>暂未关联角色</span>
          </div>
        </template>
        <template #audit>
          <div class="info-list">
            <div class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><User /></el-icon>
                <div>
                  <div class="label-zh">创建人</div>
                  <div class="label-en">Created By</div>
                </div>
              </div>
              <span class="info-value">{{ menuData.createBy || '-' }}</span>
            </div>
            <div class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><Clock /></el-icon>
                <div>
                  <div class="label-zh">创建时间</div>
                  <div class="label-en">Created At</div>
                </div>
              </div>
              <span class="info-value">{{ menuData.createAt || '-' }}</span>
            </div>
            <div class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><EditPen /></el-icon>
                <div>
                  <div class="label-zh">更新人</div>
                  <div class="label-en">Updated By</div>
                </div>
              </div>
              <span class="info-value">{{ menuData.updateBy || '-' }}</span>
            </div>
            <div class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><Timer /></el-icon>
                <div>
                  <div class="label-zh">更新时间</div>
                  <div class="label-en">Updated At</div>
                </div>
              </div>
              <span class="info-value">{{ menuData.updateAt || '-' }}</span>
            </div>
          </div>
        </template>
      </BeeTab>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Close, Clock, Collection, Document, EditPen, Key, Link, Lock, Menu, Timer, User, UserFilled } from '@element-plus/icons-vue'
import type { MenuDetailResp } from '@/types'
import BeeTab from '@/components/BeeTab/index.vue'

defineOptions({ name: 'MenuDetailDrawer' })

const props = defineProps<{
  modelValue: boolean
  menuData: MenuDetailResp
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const activeTab = ref('menuInfo')

const tabs = [
  { key: 'menuInfo', label: '菜单信息' },
  { key: 'roles', label: '关联角色' },
  { key: 'audit', label: '审计信息' }
]

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const menuTypeText = computed(() => {
  const map = { 0: '目录', 1: '菜单', 2: '按钮' }
  return map[props.menuData.type as 0 | 1 | 2] || '未知'
})

function handleClose() {
  visible.value = false
}
</script>

<style lang="scss" scoped>
.menu-drawer {
  .drawer-content {
    position: relative;
    padding: 24px;
  }

  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 10;
    cursor: pointer;
    font-size: 20px;
    color: #909399;
    transition: color 0.3s, transform 0.3s;

    &:hover {
      color: #f56c6c;
      transform: rotate(180deg);
    }
  }

  .menu-key-info {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 20px;

    .menu-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background-color: #ecf5ff;
      border-radius: 12px;
      color: #409eff;
    }

    .menu-meta {
      flex: 1;

      .menu-name {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 4px;
      }

      .menu-code {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .info-list {
    .info-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px dashed #ebeef5;

      &:last-child {
        border-bottom: none;
      }
    }

    .info-left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 120px;
    }

    .info-icon {
      font-size: 20px;
      color: #909399;
    }

    .label-zh {
      font-size: 12px;
      color: #909399;
    }

    .label-en {
      font-size: 10px;
      color: #c0c4cc;
    }

    .info-value {
      font-size: 14px;
      color: #303133;
      font-weight: 500;
      text-align: right;
      word-break: break-all;
      max-width: 55%;
    }

    .path {
      font-family: 'Monaco', 'Menlo', monospace;
      color: #67c23a;
    }

    .permission {
      font-family: 'Monaco', 'Menlo', monospace;
      color: #e6a23c;
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 40px 0;
    color: #c0c4cc;

    span {
      font-size: 14px;
    }
  }
}
</style>
