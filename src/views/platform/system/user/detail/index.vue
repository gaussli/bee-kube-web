<template>
  <div class="user-detail">
    <!-- 详情头部 -->
    <div class="detail-header">
      <BeeButton @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">用户详情</span>
    </div>

    <!-- 详情主体 -->
    <transition mode="out-in" name="fade-slide">
      <div v-if="loaded" class="detail-body">
        <!-- 用户关键信息 -->
        <div class="user-header">
          <UserAvatar :name="userData.username" :size="72" />
          <div class="user-meta">
            <div class="user-name-row">
              <span class="user-name">{{ userData.username }}</span>
              <el-tag size="small" :type="userData.status === 1 ? 'success' : 'danger'">
                {{ userData.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </div>
            <div class="user-id">
              <BeeLabelCopyable :label="userData.id" />
            </div>
          </div>
        </div>

        <!-- 用户信息网格 -->
        <div class="info-grid">
          <!-- 基本信息 -->
          <div class="info-section">
            <div class="section-title">
              <el-icon><User /></el-icon>
              <span>基本信息</span>
              <span class="section-title-en">/ Basic Info</span>
            </div>
            <div class="info-list">
              <div class="info-item">
                <div class="info-label">
                  <el-icon><User /></el-icon>
                  <span class="label-zh">昵称</span>
                  <span class="label-en">Nickname</span>
                </div>
                <span class="info-value">{{ userData.nickname || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Postcard /></el-icon>
                  <span class="label-zh">真实姓名</span>
                  <span class="label-en">Realname</span>
                </div>
                <span class="info-value">{{ userData.realname || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Male /></el-icon>
                  <span class="label-zh">性别</span>
                  <span class="label-en">Gender</span>
                </div>
                <span class="info-value">{{ genderText }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Calendar /></el-icon>
                  <span class="label-zh">生日</span>
                  <span class="label-en">Birthday</span>
                </div>
                <span class="info-value">{{ userData.birthday || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- 联系信息 -->
          <div class="info-section">
            <div class="section-title">
              <el-icon><Message /></el-icon>
              <span>联系信息</span>
              <span class="section-title-en">Contact</span>
            </div>
            <div class="info-list">
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Phone /></el-icon>
                  <span class="label-zh">手机号</span>
                  <span class="label-en">Mobile</span>
                </div>
                <span class="info-value">{{ userData.mobile || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Message /></el-icon>
                  <span class="label-zh">邮箱</span>
                  <span class="label-en">Email</span>
                </div>
                <span class="info-value">{{ userData.email || '-' }}</span>
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
                <span class="info-value">{{ userData.createBy || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Clock /></el-icon>
                  <span class="label-zh">创建时间</span>
                  <span class="label-en">Create At</span>
                </div>
                <span class="info-value">{{ userData.createAt || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><EditPen /></el-icon>
                  <span class="label-zh">更新人</span>
                  <span class="label-en">Update By</span>
                </div>
                <span class="info-value">{{ userData.updateBy || '-' }}</span>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <el-icon><Clock /></el-icon>
                  <span class="label-zh">更新时间</span>
                  <span class="label-en">Update At</span>
                </div>
                <span class="info-value">{{ userData.updateAt || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- 简介 -->
          <div class="info-section info-section-full">
            <div class="section-title">
              <el-icon><Postcard /></el-icon>
              <span>简介</span>
              <span class="section-title-en">Description</span>
            </div>
            <div class="description">
              {{ userData.description || '暂无简介' }}
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

import {
  ArrowLeft,
  Calendar,
  Clock,
  EditPen,
  Male,
  Message,
  Phone,
  Plus,
  Postcard,
  User,
} from '@element-plus/icons-vue'

import type { UserDetailResp } from '@/types/index'

import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import BeeLabelCopyable from '@/components/BeeLabelCopyable/index.vue'
import UserAvatar from '@/components/UserAvatar/index.vue'

defineOptions({ name: 'UserDetail' })

const router = useRouter()

const loaded = ref(false)
const userId = router.currentRoute.value.query.id as string

const userData = ref<UserDetailResp>({
  id: userId,
  username: 'admin',
  nickname: '管理员',
  realname: '张三',
  gender: 1,
  status: 1,
  mobile: '13800138000',
  email: 'admin@example.com',
  description: '这是一段用户简介，描述用户的背景和特点。',
  createBy: 'system',
  createAt: '2024-01-01 10:00:00',
  updateBy: 'admin',
  updateAt: '2024-01-15 14:30:00',
})

const genderText = computed(() => {
  const map: Record<number, string> = { 0: '未知', 1: '男', 2: '女' }
  return userData.value.gender !== undefined ? (map[userData.value.gender] ?? '-') : '-'
})

function handleBack() {
  router.back()
}

onMounted(() => {
  loaded.value = true
})
</script>

<style lang="scss" scoped>
.user-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $color-bg-surface;
}

.detail-header {
  display: flex;
  align-items: center;
  flex-shrink: 0;
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

.user-header {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 24px;
  border-radius: 12px;
  background-color: $color-bg-page;

  .user-meta {
    display: flex;
    gap: 8px;
    flex-direction: column;
    overflow: hidden;

    .user-name-row {
      display: flex;
      gap: 12px;
      align-items: center;

      .user-name {
        font-size: 20px;
        font-weight: 600;
        color: $color-text-primary;
      }
    }

    .user-id {
      font-size: 12px;
      color: $color-text-secondary;
    }
  }
}

.info-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, 1fr);

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
        justify-content: space-between;
        align-items: center;

        .info-label {
          display: flex;
          gap: 8px;
          align-items: center;
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

      // Extracted:避免嵌套深度超过 4 层
      .info-item .info-label {
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
    }
  }
}

.description {
  font-size: 14px;
  line-height: 1.6;
  color: $color-text-secondary;
}

// 渐入渐出动画
.fade-slide-enter-active {
  animation: fade-slide-in 0.3s ease-out;
}

.fade-slide-leave-active {
  animation: fade-slide-out 0.2s ease-in;
}
</style>
