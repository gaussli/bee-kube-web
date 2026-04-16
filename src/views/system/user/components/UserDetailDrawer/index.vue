<template>
  <el-drawer v-model="visible" direction="rtl" size="500px" :with-header="false" class="user-drawer" @close="handleClose">
    <div class="drawer-content">
      <!-- 关闭按钮 -->
      <div class="close-btn" @click="handleClose">
        <el-icon><Close /></el-icon>
      </div>

      <!-- 用户关键信息 -->
      <div class="user-key-info">
        <UserAvatar :src="userData.avatarId" :name="userData.username" :size="56" />
        <div class="user-meta">
          <div class="user-name">{{ userData.username }}</div>
          <div class="user-id">
            <TextCopyableCell :text="userData.id" />
          </div>
        </div>
      </div>

      <!-- BeeTab -->
      <BeeTab v-model="activeTab" :tabs="tabs" class="user-detail-tabs">
        <!-- 用户信息 -->
        <template #userInfo>
          <div class="info-list">
            <div v-for="item in userInfoFields" :key="item.key" class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><component :is="item.icon" /></el-icon>
                <div class="info-label">
                  <span class="label-zh">{{ item.label }}</span>
                  <span class="label-en">{{ item.enLabel }}</span>
                </div>
              </div>
              <div class="info-value">
                <StatusCell v-if="item.isStatus" :status="userData.status" :config="statusConfig" />
                <span v-else>{{ item.value }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- 关联角色 -->
        <template #userRoles>
          <el-empty description="暂无关联角色" />
        </template>

        <!-- 审计信息 -->
        <template #auditInfo>
          <div class="info-list">
            <div v-for="item in auditFields" :key="item.key" class="info-item">
              <div class="info-left">
                <el-icon class="info-icon"><component :is="item.icon" /></el-icon>
                <div class="info-label">
                  <span class="label-zh">{{ item.label }}</span>
                  <span class="label-en">{{ item.enLabel }}</span>
                </div>
              </div>
              <div class="info-value">{{ item.value }}</div>
            </div>
          </div>
        </template>
      </BeeTab>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Close, User, Setting, Avatar, Postcard, Phone, Message, Male, Calendar, Bell, Clock, Edit, Plus } from '@element-plus/icons-vue'
import BeeTab from '@/components/BeeTab/index.vue'
import StatusCell from '@/components/StatusCell/index.vue'
import TextCopyableCell from '@/components/TextCopyableCell/index.vue'
import UserAvatar from '@/components/UserAvatar/index.vue'
import type { UserDetailResp } from '@/types'

defineOptions({ name: 'UserDetailDrawer' })

const props = defineProps<{
  modelValue: boolean
  userData: UserDetailResp
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const activeTab = ref('userInfo')

const tabs = [
  { key: 'userInfo', label: '用户信息', icon: User },
  { key: 'userRoles', label: '关联角色', icon: Setting },
  { key: 'auditInfo', label: '审计信息', icon: Clock }
]

const genderText = computed(() => {
  const map: Record<number, string> = { 0: '未知', 1: '男', 2: '女' }
  const gender = props.userData.gender
  return gender !== undefined ? (map[gender] ?? '-') : '-'
})

const statusConfig = [
  { value: 1, label: '启用', color: 'rgb(103, 194, 58)' },
  { value: 0, label: '禁用', color: 'rgb(245, 108, 108)' }
]

const userInfoFields = computed(() => [
  { key: 'nickname', label: '昵称', enLabel: 'Nickname', value: props.userData.nickname || '-', icon: Avatar },
  { key: 'realname', label: '真实姓名', enLabel: 'Realname', value: props.userData.realname || '-', icon: Postcard },
  { key: 'gender', label: '性别', enLabel: 'Gender', value: genderText.value, icon: Male },
  { key: 'status', label: '状态', enLabel: 'Status', value: '', icon: Bell, isStatus: true },
  { key: 'mobile', label: '手机号', enLabel: 'Mobile', value: props.userData.mobile || '-', icon: Phone },
  { key: 'email', label: '邮箱', enLabel: 'Email', value: props.userData.email || '-', icon: Message },
  { key: 'birthday', label: '生日', enLabel: 'Birthday', value: props.userData.birthday || '-', icon: Calendar },
  { key: 'description', label: '简介', enLabel: 'Description', value: props.userData.description || '-', icon: Postcard }
])

const auditFields = computed(() => [
  { key: 'createBy', label: '创建人', enLabel: 'Create By', value: props.userData.createBy || '-', icon: Plus },
  { key: 'createAt', label: '创建时间', enLabel: 'Create At', value: props.userData.createAt || '-', icon: Clock },
  { key: 'updateBy', label: '更新人', enLabel: 'Update By', value: props.userData.updateBy || '-', icon: Edit },
  { key: 'updateAt', label: '更新时间', enLabel: 'Update At', value: props.userData.updateAt || '-', icon: Clock }
])

function handleClose() {
  emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;
  color: #909399;

  &:hover {
    color: #f56c6c;
    transform: rotate(180deg);
    background-color: #fef0f0;
  }
}

.user-key-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-id {
  font-size: 12px;
  color: #909399;
}

.user-detail-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.info-list {
  display: flex;
  flex-direction: column;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
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
  flex-shrink: 0;
}

.info-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
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
  text-align: left;
  flex-shrink: 0;
  max-width: 55%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
