<template>
  <div class="user-detail">
    <!-- 返回按钮区域 - 不参与滚动 -->
    <div class="back-bar">
      <div class="back-btn" @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回</span>
      </div>
    </div>

    <el-card class="user-detail-card">
      <transition name="fade-slide" mode="out-in">
        <div class="detail-content" v-if="loaded">
          <!-- 用户关键信息 -->
          <div class="user-header">
            <UserAvatar :name="userData.username" :size="72" />
            <div class="user-meta">
              <div class="user-name-row">
                <span class="user-name">{{ userData.username }}</span>
                <el-tag :type="userData.status === 1 ? 'success' : 'danger'" size="small">
                  {{ userData.status === 1 ? '启用' : '禁用' }}
                </el-tag>
              </div>
              <div class="user-id">
                <TextCopyableCell :text="userData.id" />
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
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Calendar, Clock, EditPen, Male, Message, Phone, Plus, Postcard, User } from '@element-plus/icons-vue'
import TextCopyableCell from '@/components/TextCopyableCell/index.vue'
import UserAvatar from '@/components/UserAvatar/index.vue'
import type { UserDetailResp } from '@/types'

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
  updateAt: '2024-01-15 14:30:00'
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
  height: 100%;
  display: flex;
  flex-direction: column;
}

.back-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 48px;
  background-color: $bg-page;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  margin-left: 8px;
  cursor: pointer;
  border-radius: 8px;
  color: $text-secondary;
  width: fit-content;
  transition: all 0.3s;

  &:hover {
    color: $text-primary;
    background-color: $bg-hover;
  }
}

.user-detail-card {
  flex: 1;
  overflow: hidden;
  background-color: $bg-page;

  :deep(.el-card__body) {
    height: 100%;
    overflow-y: auto;
    padding-top: 0;
  }
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background-color: $bg-color;
  border-radius: 12px;
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  color: $text-primary;
}

.user-id {
  font-size: 12px;
  color: $text-secondary;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.info-section {
  background-color: $bg-color;
  border-radius: 12px;
  padding: 20px;

  &-full {
    grid-column: 1 / -1;
  }
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
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
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

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeSlideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
}
</style>
