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
  status: 1,
})

const formRules: FormRules = {
  code: [
    { required: true, message: '请输入权限编码', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_:]*$/,
      message: '权限编码以字母开头，只能包含字母、数字、冒号和下划线',
      trigger: 'blur',
    },
  ],
  name: [
    { required: true, message: '请输入权限名称', trigger: 'blur' },
    { min: 2, max: 20, message: '权限名称长度为 2-20 个字符', trigger: 'blur' },
  ],
}

watch(
  () => props.data,
  val => {
    if (val) {
      Object.assign(formData, val)
    }
  },
  { immediate: true },
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
  gap: 16px 24px;
  grid-template-columns: repeat(2, 1fr);

  @media (width <= 768px) {
    grid-template-columns: 1fr;
  }
}

.form-item-full {
  grid-column: span 2;

  @media (width <= 768px) {
    grid-column: span 1;
  }
}

:deep(.el-form-item__label) {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  width: 100px;
  color: $color-text-secondary;
  white-space: nowrap;

  .el-icon {
    margin-right: 4px;
    font-size: 14px;
    color: $color-text-secondary;
  }
}

:deep(.el-input__wrapper) {
  padding: 4px 12px;
  border: 1px solid rgba($color-text-secondary, 0.15);
  border-radius: 8px;
  box-shadow: none;

  &:focus {
    border-color: $color-primary;
    box-shadow: none;
  }
}

:deep(.el-input__inner) {
  color: $color-text-primary;

  &::placeholder {
    color: $color-text-placeholder;
  }
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__wrapper) {
  padding: 0 12px;
}

:deep(.el-textarea__inner) {
  border: 1px solid rgba($color-text-secondary, 0.15);
  border-radius: 8px;
  color: $color-text-primary;
  background: rgba($color-bg-page, 0.6);

  &::placeholder {
    color: $color-text-placeholder;
  }

  &:hover {
    border-color: rgba($color-text-secondary, 0.3);
  }

  &:focus {
    border-color: $color-primary;
    box-shadow: none;
  }
}

:deep(.el-radio) {
  display: inline-flex;
  align-items: center;
  margin-right: 16px;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  border-color: $color-primary;
  background: $color-primary;
}

:deep(.el-radio__inner) {
  border-color: rgba($color-text-secondary, 0.3);
  background: rgba($color-bg-page, 0.6);
}

:deep(.el-radio__label) {
  color: $color-text-primary;
}

.radio-status {
  display: inline-flex;
  gap: 6px;
  align-items: center;

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
