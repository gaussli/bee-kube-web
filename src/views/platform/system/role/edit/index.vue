<template>
  <div class="role-edit">
    <!-- 表单头部 -->
    <div class="form-header">
      <BeeButton @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">编辑角色</span>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-subtitle">ID：{{ roleId }}</span>
    </div>

    <!-- 表单主体 -->
    <transition name="fade-slide" mode="out-in">
      <div class="form-body">
        <RoleForm v-if="loaded" ref="roleFormRef" :data="roleData" />
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

import type { RoleDetailResp } from '@/types/platform/role'

import { getRoleDetail, updateRole } from '@/api/platform/role'

import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import RoleForm from '@/components/RoleForm/index.vue'

defineOptions({ name: 'RoleEdit' })

const router = useRouter()
const roleFormRef = ref<InstanceType<typeof RoleForm>>()
const loaded = ref(false)

const roleId = router.currentRoute.value.query.id as string
const roleData = ref<RoleDetailResp>({} as RoleDetailResp)

function handleBack() {
  router.back()
}

async function handleSubmit() {
  try {
    await roleFormRef.value?.validate()
    const formData = roleFormRef.value?.getFormData()
    await updateRole(roleId, formData!)
    ElMessage.success('保存成功')
    router.push({ name: 'platform:system:role' }).catch(() => {})
  } catch {
    // 验证失败
  }
}

async function loadRoleDetail() {
  try {
    roleData.value = await getRoleDetail(roleId)
    loaded.value = true
  } catch {
    ElMessage.error('加载角色详情失败')
    router.back()
  }
}

onMounted(() => {
  void loadRoleDetail()
})
</script>

<style lang="scss" scoped>
.role-edit {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $color-bg-surface;
}

.form-header {
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

  .header-subtitle {
    font-size: 12px;
    color: $color-text-tertiary;
  }
}

.form-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.form-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  padding: 16px 20px;
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
