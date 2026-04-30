<template>
  <div class="namespace-edit">
    <!-- 表单头部 -->
    <div class="form-header">
      <BeeButton :border="false" @click="handleBack">
        <template #icon><ArrowLeft /></template>
        返回
      </BeeButton>
      <BeeDivider direction="vertical" :length="25" margin="12px" />
      <span class="header-title">编辑命名空间</span>
    </div>

    <!-- 表单主体 -->
    <transition name="fade-slide" mode="out-in">
      <div class="form-body" v-if="loaded">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="名称">
            <el-input v-model="formData.name" disabled />
          </el-form-item>
          <el-form-item label="标签" prop="labels">
            <BeeKeyValueEditor v-model="formData.labels" placeholder="请输入标签" />
          </el-form-item>
          <el-form-item label="注释" prop="annotations">
            <BeeKeyValueEditor v-model="formData.annotations" placeholder="请输入注释" />
          </el-form-item>
        </el-form>
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
import { ArrowLeft, Check, Close } from '@element-plus/icons-vue'
import BeeButton from '@/components/BeeButton/index.vue'
import BeeDivider from '@/components/BeeDivider/index.vue'
import BeeKeyValueEditor from '@/components/BeeKeyValueEditor/index.vue'

defineOptions({ name: 'NamespaceEdit' })

const router = useRouter()
const formRef = ref()
const namespace = router.currentRoute.value.query.name as string
const loaded = ref(false)

const formData = ref({
  name: '',
  labels: {},
  annotations: {}
})
const rules = {}

async function loadData() {
  try {
    // TODO: 调用获取命名空间详情 API
    // const data = await getNamespaceDetail(namespace)
    formData.value.name = namespace
  } finally {
    loaded.value = true
  }
}

function handleBack() {
  router.back()
}

async function handleUpdate() {
  try {
    await formRef.value?.validate()
    // TODO: 调用更新命名空间 API
    // await updateNamespace(namespace, formData.value)
    router.push({ name: 'kubernetes:namespace' })
  } catch {
    // 验证失败
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.namespace-edit {
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
  padding: 20px;
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

.fade-slide-enter-active {
  animation: fadeSlideIn 0.3s ease-out;
}

.fade-slide-leave-active {
  animation: fadeSlideOut 0.2s ease-in;
}
</style>
