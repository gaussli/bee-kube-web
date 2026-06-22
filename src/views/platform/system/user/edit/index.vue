<template>
  <div class="user-edit">
    <!-- 表单头部 -->
    <div class="form-header">
      <BeeButton @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">编辑用户</span>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-subtitle">ID：{{ userData.id }}</span>
    </div>

    <!-- 表单主体 -->
    <transition name="fade-slide" mode="out-in">
      <div class="form-body">
        <UserForm ref="userFormRef" :data="userData" />
      </div>
    </transition>

    <!-- 表单底部 -->
    <div class="form-footer">
      <BeeButton type="danger" @click="handleBack">
        <template #icon><Close /></template>
        取消
      </BeeButton>
      <BeeButton type="primary" @click="handleSubmit">
        <template #icon><Check /></template>
        保存
      </BeeButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Close, Check } from '@element-plus/icons-vue'
import type { UserDetailResp } from '@/types'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import UserForm from '@/components/UserForm/index.vue'

defineOptions({ name: 'UserEdit' })

const router = useRouter()
const userFormRef = ref<InstanceType<typeof UserForm>>()
const loaded = ref(false)

const userId = router.currentRoute.value.query.id as string

// TODO: 从 API 获取用户数据
const userData = ref<UserDetailResp>({
  id: userId,
  username: 'admin',
  nickname: '管理员',
  realname: '张三',
  gender: 1,
  status: 1,
  mobile: '13800138000',
  email: 'admin@example.com',
  description: '这是一段用户简介',
  createBy: 'system',
  createAt: '2024-01-01 10:00:00',
  updateBy: 'admin',
  updateAt: '2024-01-15 14:30:00'
})

function handleBack() {
  router.back()
}

async function handleSubmit() {
  try {
    await userFormRef.value?.validate()
    // TODO: 调用更新 API
    ElMessage.success('保存成功')
    router.push({ name: 'platform:system:user' })
  } catch {
    // 验证失败
  }
}

onMounted(() => {
  loaded.value = true
})
</script>

<style lang="scss" scoped>
.user-edit {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $bg-page;
}

.form-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 48px;
  padding: 0 8px;
  border-bottom: 1px solid rgba($text-secondary, 0.1);

  .header-title {
    font-weight: 600;

    // margin-left: 8px;
    color: $text-secondary;
  }

  .header-subtitle {
    font-weight: 600;
    color: $text-secondary;
  }
}

.form-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.form-footer {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid rgba($text-secondary, 0.1);
}

// 渐入渐出动画
.fade-slide-enter-active {
  animation: fade-slide-in 0.3s ease-out;
}

.fade-slide-leave-active {
  animation: fade-slide-out 0.2s ease-in;
}
</style>
