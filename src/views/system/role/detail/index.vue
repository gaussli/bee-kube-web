<template>
  <div class="role-detail">
    <!-- 详情头部 -->
    <div class="detail-header">
      <BeeButton :border="false" @click="handleBack">
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
              <TextCopyableCell :text="roleData.code" />
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
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import TextCopyableCell from '@/components/TextCopyableCell/index.vue'
import { getRoleDetail } from '@/api'
import type { RoleDetailResp } from '@/types'

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
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $bg-page;
}

.detail-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 8px;
  border-bottom: 1px solid rgba($text-secondary, 0.1);

  .header-title {
    color: $text-secondary;
    font-weight: 600;
  }
}

.detail-body {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 20px;
}

.role-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background-color: $bg-color;
  border-radius: 12px;

  .role-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    background-color: #ecf5ff;
    border-radius: 16px;
    color: #409eff;
  }

  .role-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;

    .role-name-row {
      display: flex;
      align-items: center;
      gap: 12px;

      .role-name {
        font-size: 20px;
        font-weight: 600;
        color: $text-primary;
      }
    }

    .role-code {
      font-size: 12px;
      color: $text-secondary;
    }
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  .info-section {
    background-color: $bg-color;
    border-radius: 12px;
    padding: 20px;

    &-full {
      grid-column: 1 / -1;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid $bg-selected;

      .el-icon {
        color: $color-primary;
        font-size: 16px;
      }

      .section-title-en {
        font-size: 12px;
        font-weight: 400;
        color: $text-tertiary;
        margin-left: 4px;
      }
    }

    .info-list {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;

        .info-label {
          display: flex;
          align-items: center;
          gap: 8px;

          .el-icon {
            color: $text-tertiary;
            font-size: 14px;
            flex-shrink: 0;
          }

          .label-zh {
            font-size: 14px;
            color: $text-secondary;
          }

          .label-en {
            font-size: 12px;
            color: $text-tertiary;
            margin-left: 2px;
          }
        }

        .info-value {
          font-size: 14px;
          color: $text-primary;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

// 渐入渐出动画
.fade-slide-enter-active {
  animation: fadeSlideIn 0.3s ease-out;
}

.fade-slide-leave-active {
  animation: fadeSlideOut 0.2s ease-in;
}
</style>
