<template>
  <div class="permission-detail">
    <!-- 详情头部 -->
    <div class="detail-header">
      <BeeButton @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">权限详情</span>
    </div>

    <!-- 详情主体 -->
    <transition name="fade-slide" mode="out-in">
      <div v-if="loaded" class="detail-body">
        <!-- 权限关键信息 -->
        <div class="permission-header">
          <div class="permission-icon">
            <el-icon :size="36"><Key /></el-icon>
          </div>
          <div class="permission-meta">
            <div class="permission-name-row">
              <span class="permission-name">{{ permissionData.name }}</span>
              <el-tag :type="permissionData.status === 1 ? 'success' : 'danger'" size="small">
                {{ permissionData.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </div>
            <div class="permission-code">
              <BeeLabelCopyable :label="permissionData.code" />
            </div>
          </div>
        </div>

        <!-- 权限信息网格 -->
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
                  <span class="label-zh">权限ID</span>
                  <span class="label-en">Permission ID</span>
                </div>
                <span class="info-value">{{ permissionData.id || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Key /></el-icon>
                  <span class="label-zh">权限编码</span>
                  <span class="label-en">Code</span>
                </div>
                <span class="info-value">{{ permissionData.code || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Document /></el-icon>
                  <span class="label-zh">权限名称</span>
                  <span class="label-en">Name</span>
                </div>
                <span class="info-value">{{ permissionData.name || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Collection /></el-icon>
                  <span class="label-zh">排序</span>
                  <span class="label-en">Sort</span>
                </div>
                <span class="info-value">{{ permissionData.sort ?? '-' }}</span>
              </div>
            </div>
          </div>

          <!-- 描述信息 -->
          <div class="info-section">
            <div class="section-title">
              <el-icon><Document /></el-icon>
              <span>描述信息</span>
              <span class="section-title-en">/ Description</span>
            </div>
            <div class="info-list">
              <div class="info-item full-width">
                <div class="info-label">
                  <el-icon><Document /></el-icon>
                  <span class="label-zh">描述</span>
                  <span class="label-en">Description</span>
                </div>
                <span class="info-value">{{ permissionData.description || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- 操作信息 -->
          <div class="info-section">
            <div class="section-title">
              <el-icon><EditPen /></el-icon>
              <span>操作信息</span>
              <span class="section-title-en">/ Operation Info</span>
            </div>
            <div class="info-list">
              <div class="info-item">
                <div class="info-label">
                  <el-icon><User /></el-icon>
                  <span class="label-zh">创建者</span>
                  <span class="label-en">Creator</span>
                </div>
                <span class="info-value">{{ permissionData.createBy || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Clock /></el-icon>
                  <span class="label-zh">创建时间</span>
                  <span class="label-en">Create Time</span>
                </div>
                <span class="info-value">{{ permissionData.createAt || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><User /></el-icon>
                  <span class="label-zh">更新者</span>
                  <span class="label-en">Updater</span>
                </div>
                <span class="info-value">{{ permissionData.updateBy || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Clock /></el-icon>
                  <span class="label-zh">更新时间</span>
                  <span class="label-en">Update Time</span>
                </div>
                <span class="info-value">{{ permissionData.updateAt || '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作栏 -->
        <div class="detail-footer">
          <BeeButton @click="handleBack">
            <template #icon><ArrowLeft /></template>
            返回
          </BeeButton>
          <BeeButton type="primary" @click="handleEdit">
            <template #icon><EditPen /></template>
            编辑
          </BeeButton>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Clock, Collection, Document, EditPen, Key, User } from '@element-plus/icons-vue'
import type { PermissionDetailResp } from '@/types/platform/permission'
import { getPermissionDetail } from '@/api/platform/permission'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import BeeLabelCopyable from '@/components/BeeLabelCopyable/index.vue'

defineOptions({ name: 'PermissionDetail' })

const router = useRouter()
const loaded = ref(false)

const permissionId = router.currentRoute.value.query.id as string
const permissionData = ref<PermissionDetailResp>({} as PermissionDetailResp)

function handleBack() {
  router.back()
}

function handleEdit() {
  router.push({ path: '/platform/system/permission/edit', query: { id: permissionId } })
}

async function loadPermissionDetail() {
  try {
    permissionData.value = await getPermissionDetail(permissionId)
    loaded.value = true
  } catch {
    ElMessage.error('加载权限详情失败')
    router.back()
  }
}

onMounted(() => {
  loadPermissionDetail()
})
</script>

<style lang="scss" scoped>
.permission-detail {
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
  flex: 1;
  min-height: 0;
  padding: 24px;
  overflow-y: auto;
  animation: fade-slide-in 0.3s ease-out;
}

.permission-header {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba($color-primary, 0.08) 0%, rgba($color-primary, 0.02) 100%);

  .permission-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    border-radius: 16px;
    color: $color-primary;
    background: rgba($color-primary, 0.1);
  }

  .permission-meta {
    flex: 1;

    .permission-name-row {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 8px;

      .permission-name {
        font-size: 24px;
        font-weight: 600;
        color: $color-text-primary;
      }
    }

    .permission-code {
      display: inline-flex;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 13px;
      color: $color-primary;
      background: rgba($color-primary, 0.08);
    }
  }
}

.info-grid {
  display: flex;
  gap: 24px;
  flex-direction: column;
}

.info-section {
  padding: 20px;
  border-radius: 12px;
  background: var(--el-bg-color);
  box-shadow: 0 1px 3px rgb(0 0 0 / 5%);

  .section-title {
    display: flex;
    gap: 8px;
    align-items: center;
    padding-bottom: 12px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgba($color-text-secondary, 0.1);
    font-size: 16px;
    font-weight: 600;
    color: $color-text-primary;

    .section-title-en {
      font-size: 13px;
      font-weight: 400;
      color: $color-text-tertiary;
    }
  }
}

.info-list {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(2, 1fr);

  @media (width <= 768px) {
    grid-template-columns: 1fr;
  }
}

.info-item {
  display: flex;
  gap: 8px;
  flex-direction: column;

  &.full-width {
    grid-column: 1 / -1;
  }

  .info-label {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 13px;
    color: $color-text-tertiary;

    .label-zh {
      color: $color-text-secondary;
    }

    .label-en {
      color: $text-quaternary;
    }
  }

  .info-value {
    font-size: 14px;
    font-weight: 500;
    color: $color-text-primary;
  }
}

.detail-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 0;
  margin-top: 24px;
  border-top: 1px solid rgba($color-text-secondary, 0.1);
}

// 渐入渐出动画
.fade-slide-enter-active {
  animation: fade-slide-in 0.3s ease-out;
}

.fade-slide-leave-active {
  animation: fade-slide-out 0.2s ease-in;
}
</style>
