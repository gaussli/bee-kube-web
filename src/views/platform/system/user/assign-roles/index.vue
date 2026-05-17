<template>
  <div class="user-assign-roles">
    <!-- 顶部导航 -->
    <div class="assign-header">
      <BeeButton :border="false" @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">配置角色</span>
    </div>

    <!-- 内容主体 -->
    <transition name="fade-slide" mode="out-in">
      <div v-if="loaded" class="assign-body">
        <!-- 用户信息 -->
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
              <BeeLabelCopyable :label="userData.id" />
            </div>
          </div>
        </div>

        <!-- 角色分配 -->
        <BeeTransfer v-model="selectedRoleIds" :left-data="availableRoles" :right-data="selectedRoles" left-title="可选角色" right-title="已选角色" label-key="name" value-key="id">
          <template #left="{ item }">
            <div class="role-item-content">
              <div class="role-icon">
                <el-icon><UserFilled /></el-icon>
              </div>
              <div class="role-info">
                <div class="role-name">{{ item.name }}</div>
                <div class="role-code">
                  <el-icon><Collection /></el-icon>
                  <span>{{ item.code }}</span>
                </div>
              </div>
              <div class="role-tags">
                <BeeTag v-if="item.isSystem" type="warning">系统</BeeTag>
                <BeeTag :type="item.status === 1 ? 'success' : 'danger'">
                  {{ item.status === 1 ? '启用' : '禁用' }}
                </BeeTag>
              </div>
            </div>
          </template>
          <template #right="{ item }">
            <div class="role-item-content">
              <div class="role-icon">
                <el-icon><UserFilled /></el-icon>
              </div>
              <div class="role-info">
                <div class="role-name">{{ item.name }}</div>
                <div class="role-code">
                  <el-icon><Collection /></el-icon>
                  <span>{{ item.code }}</span>
                </div>
              </div>
              <div class="role-tags">
                <BeeTag v-if="item.isSystem" type="warning">系统</BeeTag>
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
import { ElMessage } from 'element-plus'
import { ArrowLeft, Collection, UserFilled } from '@element-plus/icons-vue'
import type { UserDetailResp, UserAssignRoleReq } from '@/types'
import type { RoleResp } from '@/types'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import BeeLabelCopyable from '@/components/BeeLabelCopyable/index.vue'
import BeeTag from '@/components/BeeTag/index.vue'
import BeeTransfer from '@/components/BeeTransfer/index.vue'
import UserAvatar from '@/components/UserAvatar/index.vue'

defineOptions({ name: 'UserAssignRoles' })

const router = useRouter()
const loaded = ref(false)

const userId = router.currentRoute.value.query.userId as string
const userData = ref<UserDetailResp>({
  id: userId,
  username: 'admin',
  nickname: '管理员',
  status: 1
})

// 模拟所有角色数据
const allRoles = ref<RoleResp[]>([])
for (let i = 1; i <= 55; i++) {
  allRoles.value.push({
    id: String(i),
    code: `role_${i}`,
    name: `角色${i}`,
    description: `这是角色${i}的描述信息`,
    status: i % 5 === 0 ? 0 : 1,
    isSystem: i <= 2,
    createAt: '',
    updateAt: ''
  })
}

// 已选中的角色ID
const selectedRoleIds = ref<string[]>(['1', '2'])

// 已选角色列表
const selectedRoles = computed(() => {
  return allRoles.value.filter(role => selectedRoleIds.value.includes(role.id))
})

// 可选角色列表（排除已选的）
const availableRoles = computed(() => {
  return allRoles.value.filter(role => !selectedRoleIds.value.includes(role.id))
})

function handleBack() {
  router.back()
}

async function handleSubmit() {
  const params: UserAssignRoleReq = {
    userId,
    roleIds: selectedRoleIds.value
  }
  console.log('提交参数:', params)
  // TODO: 调用 API
  ElMessage.success('保存成功')
  router.back()
}

onMounted(() => {
  // TODO: 加载用户信息和已有角色
  loaded.value = true
})
</script>

<style lang="scss" scoped>
.user-assign-roles {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $bg-page;
}

.assign-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 48px;
  padding: 0 8px;
  border-bottom: 1px solid rgba($text-secondary, 0.1);

  .header-title {
    font-weight: 600;
    color: $text-secondary;
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
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid rgba($text-secondary, 0.1);
}

.user-header {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 24px;
  border-radius: 12px;
  background-color: $bg-color;

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
        color: $text-primary;
      }
    }

    .user-id {
      font-size: 12px;
      color: $text-secondary;
    }
  }
}

// 渐入渐出动画
.role-item-content {
  display: flex;
  gap: 10px;
  flex: 1;
  align-items: center;
  min-width: 0;
}

.role-info {
  flex: 1;
  min-width: 0;
}

.role-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 14px;
  color: $color-primary;
  background: linear-gradient(135deg, rgba($color-primary, 0.15) 0%, rgba($color-primary, 0.08) 100%);
  transition: all 0.25s ease;

  .role-item.is-selected & {
    color: #fff;
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-400 100%);
  }
}

.role-info {
  flex: 1;
  min-width: 0;
}

.role-name {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: $text-primary;
}

.role-desc {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 2px;
  font-family: 'SF Mono', Consolas, monospace;
  font-size: 12px;
  color: $text-secondary;

  .el-icon {
    font-size: 12px;
    color: $color-primary;
    opacity: 0.6;
  }
}

.role-code {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 2px;
  font-family: 'SF Mono', Consolas, monospace;
  font-size: 12px;
  color: $text-secondary;

  .el-icon {
    font-size: 12px;
    color: $color-primary;
    opacity: 0.6;
  }
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
