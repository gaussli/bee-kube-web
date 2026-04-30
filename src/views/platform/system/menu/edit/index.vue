<template>
  <div class="menu-edit">
    <!-- 表单头部 -->
    <div class="form-header">
      <BeeButton :border="false" @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">编辑菜单</span>
    </div>

    <!-- 表单主体 -->
    <transition name="fade-slide" mode="out-in">
      <div class="form-body" v-if="loaded">
        <MenuForm ref="menuFormRef" :data="menuData" />
      </div>
    </transition>

    <!-- 表单底部 -->
    <div class="form-footer">
      <BeeButton @click="handleBack">
        <template #icon><Close /></template>
        取消
      </BeeButton>
      <BeeButton type="primary" @click="handleUpdate">
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
import { ArrowLeft, Check, Close } from '@element-plus/icons-vue'
import { getMenuDetail, updateMenu } from '@/api'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import MenuForm from '@/components/MenuForm/index.vue'
import type { MenuDetailResp } from '@/types'

defineOptions({ name: 'MenuEdit' })

const router = useRouter()
const menuFormRef = ref<InstanceType<typeof MenuForm>>()
const menuId = router.currentRoute.value.query.id as string
const loaded = ref(false)

const menuData = ref<MenuDetailResp>({
  id: menuId,
  code: '',
  name: '',
  type: 1,
  status: 1
})

async function loadData() {
  try {
    const data = await getMenuDetail(menuId)
    menuData.value = data
  } finally {
    loaded.value = true
  }
}

function handleBack() {
  router.back()
}

async function handleUpdate() {
  try {
    await menuFormRef.value?.validate()
    const formData = menuFormRef.value?.getFormData()
    await updateMenu(menuId, formData!)
    ElMessage.success('保存成功')
    router.push({ name: 'platform:system:menu' })
  } catch {
    // 验证失败
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.menu-edit {
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
}

.form-body {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  animation: fadeSlideIn 0.3s ease-out;
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
