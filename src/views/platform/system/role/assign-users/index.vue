<template>
  <div class="role-assign-users">
    <!-- 顶部导航 -->
    <div class="assign-header">
      <BeeButton @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">配置用户</span>
    </div>

    <!-- 内容主体 -->
    <transition mode="out-in" name="fade-slide">
      <div v-if="loaded" class="assign-body">
        <!-- 角色信息 -->
        <div class="role-header">
          <div class="role-icon">
            <el-icon :size="36"><UserFilled /></el-icon>
          </div>
          <div class="role-meta">
            <div class="role-name-row">
              <span class="role-name">{{ roleData.name }}</span>
              <el-tag size="small" :type="roleData.status === 1 ? 'success' : 'danger'">
                {{ roleData.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </div>
            <div class="role-code">
              <BeeLabelCopyable :label="roleData.code" />
            </div>
          </div>
        </div>

        <!-- 用户分配 -->
        <BeeTransfer
          v-model="selectedUserIds"
          label-key="username"
          :left-data="availableUsers"
          left-title="可选用户"
          :right-data="selectedUsers"
          right-title="已选用户"
          value-key="id"
        >
          <template #left="{ item }">
            <div class="user-item-content">
              <div class="user-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="user-info">
                <div class="user-name">{{ item.username }}</div>
                <div class="user-detail">
                  <el-icon><Message /></el-icon>
                  <span>{{ item.email || '-' }}</span>
                </div>
              </div>
              <div class="user-tags">
                <BeeTag v-if="item.nickname" type="info">{{ item.nickname }}</BeeTag>
                <BeeTag :type="item.status === 1 ? 'success' : 'danger'">
                  {{ item.status === 1 ? '启用' : '禁用' }}
                </BeeTag>
              </div>
            </div>
          </template>
          <template #right="{ item }">
            <div class="user-item-content">
              <div class="user-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="user-info">
                <div class="user-name">{{ item.username }}</div>
                <div class="user-detail">
                  <el-icon><Message /></el-icon>
                  <span>{{ item.email || '-' }}</span>
                </div>
              </div>
              <div class="user-tags">
                <BeeTag v-if="item.nickname" type="info">{{ item.nickname }}</BeeTag>
                <BeeTag :type="item.status === 1 ? 'success' : 'danger'">
                  {{ item.status === 1 ? '启用' : '禁用' }}
                </BeeTag>
              </div>
            </div>
          </template>
        </BeeTransfer>
      </div>
    </transition>

    <!-- 底部操作 -->
    <div class="assign-footer">
      <BeeButton @click="handleBack">取消</BeeButton>
      <BeeButton type="primary" @click="handleSubmit">保存</BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'

import { ArrowLeft, Message, User, UserFilled } from '@element-plus/icons-vue'

import type { UserResp } from '@/types/index'
import type { RoleDetailResp } from '@/types/index'

import BeeButton from '@/components/base/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import BeeLabelCopyable from '@/components/BeeLabelCopyable/index.vue'
import { BeeMessage } from '@/components/BeeMessage'
import BeeTag from '@/components/BeeTag/index.vue'
import BeeTransfer from '@/components/BeeTransfer/index.vue'

defineOptions({ name: 'RoleAssignUsers' })

const router = useRouter()
const loaded = ref(false)

const roleId = router.currentRoute.value.query.roleId as string
const roleData = ref<RoleDetailResp>({
  id: roleId,
  code: 'admin',
  name: '管理员',
  status: 1,
})

// 模拟所有用户数据
const allUsers = ref<UserResp[]>([])
for (let i = 1; i <= 55; i++) {
  allUsers.value.push({
    id: String(i),
    username: `user_${i}`,
    nickname: i <= 10 ? `用户${i}` : '',
    email: `user${i}@example.com`,
    status: i % 5 === 0 ? 0 : 1,
    createAt: '',
    updateAt: '',
  })
}

// 已选中的用户ID
const selectedUserIds = ref<string[]>(['1', '2'])

// 已选用户列表
const selectedUsers = computed(() => {
  return allUsers.value.filter(user => selectedUserIds.value.includes(user.id))
})

// 可选用户列表（排除已选的）
const availableUsers = computed(() => {
  return allUsers.value.filter(user => !selectedUserIds.value.includes(user.id))
})

function handleBack() {
  router.back()
}

async function handleSubmit() {
  console.log('提交参数:', { roleId, userIds: selectedUserIds.value })
  // TODO: 调用 API
  BeeMessage.success('保存成功')
  router.back()
}

onMounted(() => {
  // TODO: 加载角色信息和已有用户
  loaded.value = true
})
</script>

<style lang="scss" scoped>
.role-assign-users {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $color-bg-surface;
}

.assign-header {
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

.assign-body {
  display: flex;
  gap: 16px;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow: hidden;
  animation: fade-slide-in 0.3s ease-out;

  :deep(.bee-transfer) {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
}

.assign-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  padding: 16px 20px;
  border-top: 1px solid rgba($color-text-secondary, 0.1);
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
    justify-content: center;
    align-items: center;
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

// 用户项内容
.user-item-content {
  display: flex;
  gap: 10px;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 14px;
  color: $color-primary;
  background: linear-gradient(135deg, rgba($color-primary, 0.15) 0%, rgba($color-primary, 0.08) 100%);
  transition: all 0.25s ease;

  .user-item.is-selected & {
    color: #fff;
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-400 100%);
  }
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: $color-text-primary;
}

.user-detail {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 2px;
  font-size: 12px;
  color: $color-text-secondary;

  .el-icon {
    font-size: 12px;
    color: $color-primary;
    opacity: 0.6;
  }
}

.user-tags {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

// 渐入渐出动画
.fade-slide-enter-active {
  animation: fade-slide-in 0.3s ease-out;
}

@keyframes fade-slide-in {
  from {
    opacity: 0;
    transform: translateX(20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
