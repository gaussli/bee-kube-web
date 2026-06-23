<template>
  <div class="role-detail">
    <!-- 详情头部 -->
    <div class="detail-header">
      <BeeButton @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">角色详情</span>
    </div>

    <!-- 详情主体 -->
    <transition name="fade-slide" mode="out-in">
      <div class="detail-body" v-if="loaded">
        <!-- 角色关键信息 -->
        <div class="role-header">
          <div class="role-icon">
            <el-icon :size="36"><UserFilled /></el-icon>
          </div>
          <div class="role-meta">
            <div class="role-name-row">
              <span class="role-name">{{ roleData.name }}</span>
              <el-tag :type="roleData.status === 1 ? 'success' : 'danger'" size="small">
                {{ roleData.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </div>
            <div class="role-code">
              <BeeLabelCopyable :label="roleData.code" />
            </div>
          </div>
        </div>

        <!-- 角色信息网格 -->
        <div class="info-grid">
          <!-- 基本信息 -->
          <div class="info-section">
            <div class="section-title">
              <el-icon><Key /></el-icon>
              <span>基本信息</span>
              <span class="section-title-en">/ Basic Info</span>
            </div>
            <div class="info-list">
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Key /></el-icon>
                  <span class="label-zh">角色ID</span>
                  <span class="label-en">Role ID</span>
                </div>
                <span class="info-value">{{ roleData.id || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Collection /></el-icon>
                  <span class="label-zh">角色编码</span>
                  <span class="label-en">Code</span>
                </div>
                <span class="info-value">{{ roleData.code || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><UserFilled /></el-icon>
                  <span class="label-zh">角色名称</span>
                  <span class="label-en">Name</span>
                </div>
                <span class="info-value">{{ roleData.name || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Collection /></el-icon>
                  <span class="label-zh">排序</span>
                  <span class="label-en">Sort</span>
                </div>
                <span class="info-value">{{ roleData.sort ?? '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Lock /></el-icon>
                  <span class="label-zh">系统角色</span>
                  <span class="label-en">System Role</span>
                </div>
                <span class="info-value">{{ roleData.isSystem ? '是' : '否' }}</span>
              </div>
            </div>
          </div>

          <!-- 审计信息 -->
          <div class="info-section">
            <div class="section-title">
              <el-icon><Clock /></el-icon>
              <span>审计信息</span>
              <span class="section-title-en">Audit</span>
            </div>
            <div class="info-list">
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Plus /></el-icon>
                  <span class="label-zh">创建人</span>
                  <span class="label-en">Create By</span>
                </div>
                <span class="info-value">{{ roleData.createBy || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Clock /></el-icon>
                  <span class="label-zh">创建时间</span>
                  <span class="label-en">Create At</span>
                </div>
                <span class="info-value">{{ roleData.createAt || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><EditPen /></el-icon>
                  <span class="label-zh">更新人</span>
                  <span class="label-en">Update By</span>
                </div>
                <span class="info-value">{{ roleData.updateBy || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Timer /></el-icon>
                  <span class="label-zh">更新时间</span>
                  <span class="label-en">Update At</span>
                </div>
                <span class="info-value">{{ roleData.updateAt || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- 描述信息 -->
          <div class="info-section info-section-full">
            <div class="section-title">
              <el-icon><Document /></el-icon>
              <span>描述信息</span>
              <span class="section-title-en">Description</span>
            </div>
            <div class="description">
              {{ roleData.description || '暂无描述' }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Clock, Collection, Document, EditPen, Key, Lock, Plus, Timer, UserFilled } from '@element-plus/icons-vue'
import type { RoleDetailResp } from '@/types/platform/role'
import { getRoleDetail } from '@/api/platform/role'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import BeeLabelCopyable from '@/components/BeeLabelCopyable/index.vue'

defineOptions({ name: 'RoleDetail' })

const router = useRouter()
const loaded = ref(false)
const roleId = router.currentRoute.value.query.id as string

const roleData = ref<RoleDetailResp>({
  id: roleId,
  code: 'admin',
  name: '管理员',
  description: '系统管理员角色，拥有所有权限',
  sort: 1,
  status: 1,
  isSystem: true,
  createBy: 'system',
  createAt: '2024-01-01 10:00:00',
  updateBy: 'admin',
  updateAt: '2024-01-15 14:30:00'
})

async function loadData() {
  try {
    const data = await getRoleDetail(roleId)
    roleData.value = data
  } finally {
    loaded.value = true
  }
}

function handleBack() {
  router.back()
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.role-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $color-bg-surface;
}

.detail-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 48px;
  padding: 0 8px;
  border-bottom: 1px solid rgba($color-text-secondary, 0.1);

  .header-title {
    font-weight: 600;
    color: $color-text-secondary;
  }
}

.detail-body {
  display: flex;
  gap: 16px;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 16px 20px;
  overflow-y: auto;
}

.role-header {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 24px;
  border-radius: 12px;
  background-color: $color-bg-page;

  .role-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    border-radius: 16px;
    color: #409eff;
    background-color: #ecf5ff;
  }

  .role-meta {
    display: flex;
    gap: 8px;
    flex-direction: column;
    overflow: hidden;

    .role-name-row {
      display: flex;
      gap: 12px;
      align-items: center;

      .role-name {
        font-size: 20px;
        font-weight: 600;
        color: $color-text-primary;
      }
    }

    .role-code {
      font-size: 12px;
      color: $color-text-secondary;
    }
  }
}

.info-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr);

  .info-section {
    padding: 20px;
    border-radius: 12px;
    background-color: $color-bg-page;

    &-full {
      grid-column: 1 / -1;
    }

    .section-title {
      display: flex;
      gap: 8px;
      align-items: center;
      padding-bottom: 12px;
      margin-bottom: 16px;
      border-bottom: 1px solid $bg-selected;
      font-size: 14px;
      font-weight: 600;
      color: $color-text-primary;

      .el-icon {
        font-size: 16px;
        color: $color-primary;
      }

      .section-title-en {
        margin-left: 4px;
        font-size: 12px;
        font-weight: 400;
        color: $color-text-tertiary;
      }
    }

    .info-list {
      display: flex;
      gap: 16px;
      flex-direction: column;

      .info-item {
        display: flex;
        gap: 16px;
        align-items: center;
        justify-content: space-between;

        .info-label {
          display: flex;
          gap: 8px;
          align-items: center;

          .el-icon {
            flex-shrink: 0;
            font-size: 14px;
            color: $color-text-tertiary;
          }

          .label-zh {
            font-size: 14px;
            color: $color-text-secondary;
          }

          .label-en {
            margin-left: 2px;
            font-size: 12px;
            color: $color-text-tertiary;
          }
        }

        .info-value {
          overflow: hidden;
          font-size: 14px;
          color: $color-text-primary;
          text-align: right;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

// 渐入渐出动画
.fade-slide-enter-active {
  animation: fade-slide-in 0.3s ease-out;
}

.fade-slide-leave-active {
  animation: fade-slide-out 0.2s ease-in;
}
</style>
