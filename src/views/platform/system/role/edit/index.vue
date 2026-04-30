<template>
  <div class="role-edit">
    <!-- 表单头部 -->
    <div class="form-header">
      <BeeButton :border="false" @click="handleBack">
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
import { getRoleDetail, updateRole } from '@/api'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import RoleForm from '@/components/RoleForm/index.vue'
import type { RoleDetailResp } from '@/types'

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
    router.push({ name: 'platform:system:role' })
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
  loadRoleDetail()
})
</script>

<style lang="scss" scoped>
.role-edit {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $bg-page;
}

.form-header {
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

  .header-subtitle {
    color: $text-tertiary;
    font-size: 12px;
  }
}

.form-body {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.form-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid rgba($text-secondary, 0.1);
}

// 渐入渐出动画
.fade-slide-enter-active {
  animation: fadeSlideIn 0.3s ease-out;
}

.fade-slide-leave-active {
  animation: fadeSlideOut 0.2s ease-in;
}
</style>
