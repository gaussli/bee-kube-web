<template>
  <div class="permission-edit">
    <!-- 表单头部 -->
    <div class="form-header">
      <BeeButton :border="false" @click="handleBack">
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
import { getPermissionDetail, updatePermission } from '@/api'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import PermissionForm from '@/components/PermissionForm/index.vue'
import type { PermissionDetailResp } from '@/types'

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
    router.push('/platform/system/permission')
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
