<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-position="left" class="permission-form">
    <div class="form-content">
      <el-form-item label="权限编码" prop="code">
        <template #label>
          <el-icon><Key /></el-icon>
          <span>权限编码</span>
        </template>
        <el-input v-model="formData.code" placeholder="请输入权限编码，如 system:user:view" :disabled="isEdit" />
      </el-form-item>

      <el-form-item label="权限名称" prop="name">
        <template #label>
          <el-icon><Key /></el-icon>
          <span>权限名称</span>
        </template>
        <el-input v-model="formData.name" placeholder="请输入权限名称，如 查看用户" />
      </el-form-item>

      <el-form-item label="排序" prop="sort">
        <template #label>
          <el-icon><Collection /></el-icon>
          <span>排序</span>
        </template>
        <el-input-number v-model="formData.sort" :min="0" :max="9999" placeholder="数值越小越靠前" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <template #label>
          <el-icon><Switch /></el-icon>
          <span>状态</span>
        </template>
        <el-radio-group v-model="formData.status">
          <el-radio :value="1">
            <span class="radio-status active">
              <span class="status-dot"></span>
              启用
            </span>
          </el-radio>
          <el-radio :value="0">
            <span class="radio-status disabled">
              <span class="status-dot"></span>
              禁用
            </span>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="描述" prop="description" class="form-item-full">
        <template #label>
          <el-icon><Document /></el-icon>
          <span>描述</span>
        </template>
        <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入权限描述" />
      </el-form-item>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Collection, Document, Key, Switch } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { PermissionDetailResp } from '@/types'

defineOptions({ name: 'PermissionForm' })

const props = defineProps<{
  data?: PermissionDetailResp
}>()

const formRef = ref<FormInstance>()
const isEdit = computed(() => !!props.data?.id)

const formData = reactive({
  code: '',
  name: '',
  description: '',
  sort: 0,
  status: 1
})

const formRules: FormRules = {
  code: [
    { required: true, message: '请输入权限编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_:]*$/, message: '权限编码以字母开头，只能包含字母、数字、冒号和下划线', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入权限名称', trigger: 'blur' },
    { min: 2, max: 20, message: '权限名称长度为 2-20 个字符', trigger: 'blur' }
  ]
}

watch(
  () => props.data,
  val => {
    if (val) {
      Object.assign(formData, val)
    }
  },
  { immediate: true }
)

function validate() {
  return formRef.value?.validate()
}

function resetFields() {
  formRef.value?.resetFields()
}

function getFormData() {
  return { ...formData }
}

defineExpose({ validate, resetFields, getFormData })
</script>

<style lang="scss" scoped>
.permission-form {
  display: flex;
  flex-direction: column;
  padding: 16px 20px;
}

.form-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-item-full {
  grid-column: span 2;

  @media (max-width: 768px) {
    grid-column: span 1;
  }
}

:deep(.el-form-item__label) {
  color: $text-secondary;
  white-space: nowrap;
  display: flex;
  align-items: center;
  width: 100px;
  flex-shrink: 0;

  .el-icon {
    margin-right: 4px;
    color: $text-secondary;
    font-size: 14px;
  }
}

:deep(.el-input__wrapper) {
  border: 1px solid rgba($text-secondary, 0.15);
  border-radius: 8px;
  box-shadow: none;
  padding: 4px 12px;

  &:focus {
    border-color: $color-primary;
    box-shadow: none;
  }
}

:deep(.el-input__inner) {
  color: $text-primary;

  &::placeholder {
    color: $text-placeholder;
  }
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__wrapper) {
  padding: 0 12px;
}

:deep(.el-textarea__inner) {
  background: rgba($bg-color, 0.6);
  border: 1px solid rgba($text-secondary, 0.15);
  border-radius: 8px;
  color: $text-primary;

  &::placeholder {
    color: $text-placeholder;
  }

  &:hover {
    border-color: rgba($text-secondary, 0.3);
  }

  &:focus {
    border-color: $color-primary;
    box-shadow: none;
  }
}

:deep(.el-radio) {
  margin-right: 16px;
  display: inline-flex;
  align-items: center;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background: $color-primary;
  border-color: $color-primary;
}

:deep(.el-radio__inner) {
  background: rgba($bg-color, 0.6);
  border-color: rgba($text-secondary, 0.3);
}

:deep(.el-radio__label) {
  color: $text-primary;
}

.radio-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  &.active .status-dot {
    background: $color-success;
  }

  &.disabled .status-dot {
    background: $color-danger;
  }
}

:deep(.el-form-item) {
  margin-bottom: 0;
}
</style>
