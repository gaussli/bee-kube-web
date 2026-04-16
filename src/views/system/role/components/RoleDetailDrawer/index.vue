<template>
  <el-drawer v-model="visible" direction="rtl" size="500px" :with-header="false" class="role-drawer">
    <div class="drawer-content">
      <div class="close-btn" @click="handleClose">
        <el-icon><Close /></el-icon>
      </div>

      <div class="role-key-info">
        <div class="role-icon">
          <el-icon :size="32"><UserFilled /></el-icon>
        </div>
        <div class="role-meta">
          <div class="role-name">{{ roleData.name }}</div>
          <div class="role-code">{{ roleData.code }}</div>
        </div>
        <el-tag :type="roleData.status === 1 ? 'success' : 'danger'" size="small">
          {{ roleData.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </div>

      <BeeTab v-model="activeTab" :tabs="tabs">
        <template #roleInfo>
          <div class="info-list">
            <div class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><Key /></el-icon>
                <div>
                  <div class="label-zh">角色ID</div>
                  <div class="label-en">Role ID</div>
                </div>
              </div>
              <span class="info-value">{{ roleData.id }}</span>
            </div>
            <div class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><Collection /></el-icon>
                <div>
                  <div class="label-zh">排序</div>
                  <div class="label-en">Sort</div>
                </div>
              </div>
              <span class="info-value">{{ roleData.sort ?? '-' }}</span>
            </div>
            <div class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><Document /></el-icon>
                <div>
                  <div class="label-zh">描述</div>
                  <div class="label-en">Description</div>
                </div>
              </div>
              <span class="info-value">{{ roleData.description || '-' }}</span>
            </div>
            <div class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><Lock /></el-icon>
                <div>
                  <div class="label-zh">系统角色</div>
                  <div class="label-en">System Role</div>
                </div>
              </div>
              <span class="info-value">{{ roleData.isSystem ? '是' : '否' }}</span>
            </div>
          </div>
        </template>
        <template #permissions>
          <div class="empty-state">
            <el-icon :size="48"><Setting /></el-icon>
            <span>暂未配置权限</span>
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
              <span class="info-value">{{ roleData.createBy || '-' }}</span>
            </div>
            <div class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><Clock /></el-icon>
                <div>
                  <div class="label-zh">创建时间</div>
                  <div class="label-en">Created At</div>
                </div>
              </div>
              <span class="info-value">{{ roleData.createAt || '-' }}</span>
            </div>
            <div class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><EditPen /></el-icon>
                <div>
                  <div class="label-zh">更新人</div>
                  <div class="label-en">Updated By</div>
                </div>
              </div>
              <span class="info-value">{{ roleData.updateBy || '-' }}</span>
            </div>
            <div class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><Timer /></el-icon>
                <div>
                  <div class="label-zh">更新时间</div>
                  <div class="label-en">Updated At</div>
                </div>
              </div>
              <span class="info-value">{{ roleData.updateAt || '-' }}</span>
            </div>
          </div>
        </template>
      </BeeTab>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Close, Clock, Collection, Document, EditPen, Key, Lock, Setting, Timer, User, UserFilled } from '@element-plus/icons-vue'
import type { RoleDetailResp } from '@/types'
import BeeTab from '@/components/BeeTab/index.vue'

defineOptions({ name: 'RoleDetailDrawer' })

const props = defineProps<{
  modelValue: boolean
  roleData: RoleDetailResp
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const activeTab = ref('roleInfo')

const tabs = [
  { key: 'roleInfo', label: '角色信息' },
  { key: 'permissions', label: '权限配置' },
  { key: 'audit', label: '审计信息' }
]

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

function handleClose() {
  visible.value = false
}
</script>

<style lang="scss" scoped>
.role-drawer {
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

  .role-key-info {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 20px;

    .role-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background-color: #ecf5ff;
      border-radius: 12px;
      color: #409eff;
    }

    .role-meta {
      flex: 1;

      .role-name {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 4px;
      }

      .role-code {
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
