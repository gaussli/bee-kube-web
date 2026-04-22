<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top" class="user-form">
    <!-- 表单分组 -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-icon">
          <el-icon><User /></el-icon>
        </div>
        <span class="section-title">基础信息</span>
        <span class="section-title-en">Basic Info</span>
      </div>
      <div class="section-content">
        <el-form-item label="用户名" prop="username">
          <template #label>
            <div class="custom-label">
              <el-icon><User /></el-icon>
              <span>用户名</span>
              <span class="label-en">Username</span>
            </div>
          </template>
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            :disabled="isEdit"
          >
            <template #prefix>
              <el-icon class="input-icon"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <template #label>
            <div class="custom-label">
              <el-icon><UserFilled /></el-icon>
              <span>昵称</span>
              <span class="label-en">Nickname</span>
            </div>
          </template>
          <el-input v-model="formData.nickname" placeholder="请输入昵称">
            <template #prefix>
              <el-icon class="input-icon"><UserFilled /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="真实姓名" prop="realname">
          <template #label>
            <div class="custom-label">
              <el-icon><Postcard /></el-icon>
              <span>真实姓名</span>
              <span class="label-en">Realname</span>
            </div>
          </template>
          <el-input v-model="formData.realname" placeholder="请输入真实姓名">
            <template #prefix>
              <el-icon class="input-icon"><Postcard /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <template #label>
            <div class="custom-label">
              <el-icon><Male v-if="formData.gender === 1" /><Female v-else-if="formData.gender === 2" /><Help v-else /></el-icon>
              <span>性别</span>
              <span class="label-en">Gender</span>
            </div>
          </template>
          <el-radio-group v-model="formData.gender">
            <el-radio :value="0">
              <span class="radio-label">未知</span>
              <span class="radio-en">Unknown</span>
            </el-radio>
            <el-radio :value="1">
              <span class="radio-label">男</span>
              <span class="radio-en">Male</span>
            </el-radio>
            <el-radio :value="2">
              <span class="radio-label">女</span>
              <span class="radio-en">Female</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
    </div>

    <div class="form-section">
      <div class="section-header">
        <div class="section-icon">
          <el-icon><Message /></el-icon>
        </div>
        <span class="section-title">联系信息</span>
        <span class="section-title-en">Contact</span>
      </div>
      <div class="section-content">
        <el-form-item label="手机号" prop="mobile">
          <template #label>
            <div class="custom-label">
              <el-icon><Phone /></el-icon>
              <span>手机号</span>
              <span class="label-en">Mobile</span>
            </div>
          </template>
          <el-input v-model="formData.mobile" placeholder="请输入手机号">
            <template #prefix>
              <el-icon class="input-icon"><Phone /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <template #label>
            <div class="custom-label">
              <el-icon><Message /></el-icon>
              <span>邮箱</span>
              <span class="label-en">Email</span>
            </div>
          </template>
          <el-input v-model="formData.email" placeholder="请输入邮箱">
            <template #prefix>
              <el-icon class="input-icon"><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="生日" prop="birthday">
          <template #label>
            <div class="custom-label">
              <el-icon><Calendar /></el-icon>
              <span>生日</span>
              <span class="label-en">Birthday</span>
            </div>
          </template>
          <el-date-picker v-model="formData.birthday" type="date" placeholder="选择生日" style="width: 100%" />
        </el-form-item>
      </div>
    </div>

    <div class="form-section">
      <div class="section-header">
        <div class="section-icon">
          <el-icon><Setting /></el-icon>
        </div>
        <span class="section-title">账户设置</span>
        <span class="section-title-en">Account</span>
      </div>
      <div class="section-content">
        <el-form-item label="状态" prop="status">
          <template #label>
            <div class="custom-label">
              <el-icon><Switch /></el-icon>
              <span>状态</span>
              <span class="label-en">Status</span>
            </div>
          </template>
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">
              <span class="radio-status active">
                <span class="status-dot"></span>
                <span class="radio-label">启用</span>
                <span class="radio-en">Enabled</span>
              </span>
            </el-radio>
            <el-radio :value="0">
              <span class="radio-status disabled">
                <span class="status-dot"></span>
                <span class="radio-label">禁用</span>
                <span class="radio-en">Disabled</span>
              </span>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="简介" prop="description" class="form-item-full">
          <template #label>
            <div class="custom-label">
              <el-icon><Document /></el-icon>
              <span>简介</span>
              <span class="label-en">Description</span>
            </div>
          </template>
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入简介"
          />
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { UserDetailResp } from '@/types'
import {
  User,
  UserFilled,
  Postcard,
  Male,
  Female,
  Help,
  Phone,
  Message,
  Calendar,
  Setting,
  Switch,
  Document
} from '@element-plus/icons-vue'

defineOptions({ name: 'UserForm' })

const props = defineProps<{
  data?: UserDetailResp
}>()

const formRef = ref<FormInstance>()
const isEdit = computed(() => !!props.data?.id)

const formData = reactive({
  username: '',
  nickname: '',
  realname: '',
  gender: 0,
  mobile: '',
  email: '',
  birthday: '',
  status: 1,
  description: ''
})

const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为 3-20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  mobile: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
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

defineExpose({ validate, resetFields })
</script>

<style lang="scss" scoped>
.user-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-section {
  background: rgba($bg-color, 0.5);
  border: 1px solid rgba($text-secondary, 0.1);
  border-radius: 10px;
  padding: 16px 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba($text-secondary, 0.1);
}

.section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-400 100%);
  border-radius: 6px;
  font-size: 14px;
  color: #fff;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
}

.section-title-en {
  font-size: 12px;
  color: $text-secondary;
}

.section-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

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

.custom-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: $text-primary;
  font-weight: 500;

  .el-icon {
    color: $color-primary;
    font-size: 14px;
  }

  .label-en {
    margin-left: 4px;
    font-size: 12px;
    color: $text-secondary;
    font-weight: 400;
  }
}

.input-icon {
  font-size: 14px;
  color: $text-secondary;
}

:deep(.el-input__wrapper) {
  background: rgba($bg-color, 0.6);
  border: 1px solid rgba($text-secondary, 0.15);
  border-radius: 8px;
  box-shadow: none;
  padding: 4px 12px;

  &:hover {
    border-color: rgba($text-secondary, 0.3);
  }

  &:focus {
    border-color: $color-primary;
    box-shadow: none;
  }
}

:deep(.el-input__inner) {
  color: $text-primary;

  &::placeholder {
    color: rgba($text-secondary, 0.5);
  }
}

:deep(.el-textarea__inner) {
  background: rgba($bg-color, 0.6);
  border: 1px solid rgba($text-secondary, 0.15);
  border-radius: 8px;
  color: $text-primary;

  &::placeholder {
    color: rgba($text-secondary, 0.5);
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
  margin-right: 0;
  display: flex;
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

.radio-label {
  color: $text-primary;
  font-weight: 500;
}

.radio-en {
  margin-left: 4px;
  font-size: 12px;
  color: $text-secondary;
}

.radio-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba($bg-color, 0.6);
  border: 1px solid rgba($text-secondary, 0.15);

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

:deep(.el-date-editor .el-input__wrapper) {
  background: rgba($bg-color, 0.6);
  border: 1px solid rgba($text-secondary, 0.15);
  border-radius: 8px;
}
</style>
