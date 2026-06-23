<template>
  <div class="permission-edit">
    <!-- 表单头部 -->
    <div class="form-header">
      <BeeButton @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">编辑权限</span>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-subtitle">ID：{{ permissionId }}</span>
    </div>

    <!-- 表单主体 -->
    <transition name="fade-slide" mode="out-in">
      <div class="form-body">
        <PermissionForm v-if="loaded" ref="permissionFormRef" :data="permissionData" />
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
import type { PermissionDetailResp } from '@/types/platform/permission'
import { getPermissionDetail, updatePermission } from '@/api/platform/permission'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import PermissionForm from '@/components/PermissionForm/index.vue'

defineOptions({ name: 'PermissionEdit' })

const router = useRouter()
const permissionFormRef = ref<InstanceType<typeof PermissionForm>>()
const loaded = ref(false)

const permissionId = router.currentRoute.value.query.id as string
const permissionData = ref<PermissionDetailResp>({} as PermissionDetailResp)

function handleBack() {
  router.back()
}

async function handleSubmit() {
  try {
    await permissionFormRef.value?.validate()
    const formData = permissionFormRef.value?.getFormData()
    await updatePermission(permissionId, formData!)
    ElMessage.success('保存成功')
    router.push({ name: 'platform:system:permission' })
  } catch {
    // 验证失败
  }
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
.permission-edit {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $color-bg-surface;
}

.form-header {
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

  .header-subtitle {
    font-size: 12px;
    color: $text-tertiary;
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
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
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
