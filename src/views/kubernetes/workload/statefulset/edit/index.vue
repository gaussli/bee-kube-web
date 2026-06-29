<template>
  <div class="statefulset-edit">
    <div class="page-header">
      <BeePageTitle :icon="Collection" :title="`编辑有状态应用: ${statefulsetName}`" description="编辑 StatefulSet 配置。" />
    </div>
    <div class="page-body">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px" class="edit-form">
        <el-form-item label="副本数量" prop="replicas">
          <el-input-number v-model="formData.replicas" :min="0" :max="100" />
        </el-form-item>
      </el-form>
    </div>
    <div class="page-footer">
      <BeeButton @click="handleCancel"
        ><template #icon><Close /></template>取消</BeeButton
      >
      <BeeButton type="primary" :loading="submitting" @click="handleSubmit"
        ><template #icon><Check /></template>保存</BeeButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance } from 'element-plus'
import { Collection, Close, Check } from '@element-plus/icons-vue'
import type { StatefulSetListResp } from '@/types/kubernetes/workload/statefulset'
import { getStatefulSetDetail, updateStatefulSet } from '@/api/kubernetes/workload/statefulset'
import BeeButton from '@/components/BeeButton/index.vue'
import BeePageTitle from '@/components/BeePageTitle/index.vue'

defineOptions({ name: 'StatefulSetEdit' })
const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const clusterId = ref(route.params.clusterId as string)
const namespace = ref(route.query.namespace as string)
const statefulsetName = ref(route.query.name as string)
const loading = ref(false)
const submitting = ref(false)
const formData = ref<Partial<StatefulSetListResp>>({ replicas: 1 })
const formRules = { replicas: [{ required: true, message: '请输入副本数量', trigger: 'blur' }] }
async function loadData() {
  if (!clusterId.value || !namespace.value || !statefulsetName.value) return
  loading.value = true
  try {
    const data = await getStatefulSetDetail(clusterId.value, namespace.value, statefulsetName.value)
    formData.value.replicas = data.replicas
  } finally {
    loading.value = false
  }
}
function handleCancel() {
  router.back()
}
async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await updateStatefulSet(clusterId.value, namespace.value, statefulsetName.value, formData.value)
    ElMessage.success('保存成功')
    router.back()
  } catch {
  } finally {
    submitting.value = false
  }
}
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.statefulset-edit {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.page-header {
  flex-shrink: 0;
  padding: 16px 20px 0;
  margin-bottom: 16px;
  background-color: $color-bg-surface;
}

.page-body {
  flex: 1;
  min-height: 0;
  padding: 0 20px;
  overflow-y: auto;
  background-color: $color-bg-surface;
}

.page-footer {
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: $color-bg-surface;
}

.edit-form {
  max-width: 800px;
  padding: 20px 0;
}
</style>
