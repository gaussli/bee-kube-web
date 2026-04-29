<template>
  <div class="menu-detail">
    <!-- 详情头部 -->
    <div class="detail-header">
      <BeeButton :border="false" @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">菜单详情</span>
    </div>

    <!-- 详情主体 -->
    <transition name="fade-slide" mode="out-in">
      <div class="detail-body" v-if="loaded">
        <!-- 菜单关键信息 -->
        <div class="menu-header">
          <div class="menu-icon">
            <el-icon :size="36"><component :is="menuIcon || 'Menu'" /></el-icon>
          </div>
          <div class="menu-meta">
            <div class="menu-name-row">
              <span class="menu-name">{{ menuData.name }}</span>
              <el-tag :type="typeTagMap[menuData.type]" size="small">{{ typeTextMap[menuData.type] }}</el-tag>
              <el-tag :type="menuData.status === 1 ? 'success' : 'danger'" size="small">
                {{ menuData.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </div>
            <div class="menu-code">
              <TextCopyableCell :text="menuData.code" />
            </div>
          </div>
        </div>

        <!-- 菜单信息网格 -->
        <div class="info-grid">
          <!-- 基本信息 -->
          <div class="info-section">
            <div class="section-title">
              <el-icon><Menu /></el-icon>
              <span>基本信息</span>
              <span class="section-title-en">/ Basic Info</span>
            </div>
            <div class="info-list">
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Key /></el-icon>
                  <span class="label-zh">菜单ID</span>
                  <span class="label-en">Menu ID</span>
                </div>
                <span class="info-value">{{ menuData.id || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Collection /></el-icon>
                  <span class="label-zh">菜单编码</span>
                  <span class="label-en">Code</span>
                </div>
                <span class="info-value">{{ menuData.code || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><User /></el-icon>
                  <span class="label-zh">菜单名称</span>
                  <span class="label-en">Name</span>
                </div>
                <span class="info-value">{{ menuData.name || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Folder /></el-icon>
                  <span class="label-zh">父菜单</span>
                  <span class="label-en">Parent</span>
                </div>
                <span class="info-value">{{ menuData.parentName || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Sort /></el-icon>
                  <span class="label-zh">排序</span>
                  <span class="label-en">Sort</span>
                </div>
                <span class="info-value">{{ menuData.sort ?? '-' }}</span>
              </div>
            </div>
          </div>

          <!-- 路由信息 -->
          <div class="info-section">
            <div class="section-title">
              <el-icon><Link /></el-icon>
              <span>路由信息</span>
              <span class="section-title-en">Route</span>
            </div>
            <div class="info-list">
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Link /></el-icon>
                  <span class="label-zh">路由路径</span>
                  <span class="label-en">Path</span>
                </div>
                <span class="info-value path-value">{{ menuData.frontPath || '-' }}</span>
              </div>
              <div class="info-item info-item-full">
                <div class="info-label">
                  <el-icon><Document /></el-icon>
                  <span class="label-zh">组件路径</span>
                  <span class="label-en">Component</span>
                </div>
                <span class="info-value component-value">{{ menuData.frontComponent || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Lock /></el-icon>
                  <span class="label-zh">权限标识</span>
                  <span class="label-en">Permission</span>
                </div>
                <span class="info-value permission-value">{{ menuData.permission || '-' }}</span>
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
                <span class="info-value">{{ menuData.createBy || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Clock /></el-icon>
                  <span class="label-zh">创建时间</span>
                  <span class="label-en">Create At</span>
                </div>
                <span class="info-value">{{ menuData.createAt || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><EditPen /></el-icon>
                  <span class="label-zh">更新人</span>
                  <span class="label-en">Update By</span>
                </div>
                <span class="info-value">{{ menuData.updateBy || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Timer /></el-icon>
                  <span class="label-zh">更新时间</span>
                  <span class="label-en">Update At</span>
                </div>
                <span class="info-value">{{ menuData.updateAt || '-' }}</span>
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
              {{ menuData.description || '暂无描述' }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Clock, Collection, Document, EditPen, Folder, Key, Link, Lock, Menu, Plus, Sort, Timer, User } from '@element-plus/icons-vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import TextCopyableCell from '@/components/TextCopyableCell/index.vue'
import { getMenuDetail } from '@/api'
import type { MenuDetailResp } from '@/types'

defineOptions({ name: 'MenuDetail' })

const router = useRouter()
const loaded = ref(false)
const menuId = router.currentRoute.value.query.id as string

const typeTextMap: Record<number, string> = { 0: '目录', 1: '菜单', 2: '按钮' }
const typeTagMap: Record<number, string> = { 0: 'warning', 1: 'primary', 2: 'info' }

const menuData = ref<MenuDetailResp>({
  id: menuId,
  code: 'system_menu',
  name: '系统管理',
  description: '系统管理菜单',
  frontPath: '/system',
  frontComponent: '@/views/system/index.vue',
  frontIcon: 'Menu',
  type: 0,
  permission: 'system:menu:view',
  sort: 1,
  status: 1,
  createBy: 'system',
  createAt: '2024-01-01 10:00:00',
  updateBy: 'admin',
  updateAt: '2024-01-15 14:30:00'
})

const menuIcon = computed(() => {
  return menuData.value.frontIcon || 'Menu'
})

async function loadData() {
  try {
    const data = await getMenuDetail(menuId)
    menuData.value = data
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
.menu-detail {
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

.menu-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background-color: $bg-color;
  border-radius: 12px;

  .menu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    background-color: #ecf5ff;
    border-radius: 16px;
    color: #409eff;
  }

  .menu-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;

    .menu-name-row {
      display: flex;
      align-items: center;
      gap: 12px;

      .menu-name {
        font-size: 20px;
        font-weight: 600;
        color: $text-primary;
      }
    }

    .menu-code {
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

        &-full {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;

          .info-value {
            text-align: left;
            word-break: break-all;
          }
        }

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

        .path-value {
          font-family: 'Monaco', 'Menlo', monospace;
          color: $color-success;
        }

        .component-value {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 12px;
          color: $color-primary;
        }

        .permission-value {
          font-family: 'Monaco', 'Menlo', monospace;
          color: $color-warning;
        }
      }
    }
  }
}

.description {
  font-size: 14px;
  color: $text-secondary;
  line-height: 1.6;
}

// 渐入渐出动画
.fade-slide-enter-active {
  animation: fadeSlideIn 0.3s ease-out;
}

.fade-slide-leave-active {
  animation: fadeSlideOut 0.2s ease-in;
}
</style>
