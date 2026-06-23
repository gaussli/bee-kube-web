<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-position="left" class="user-form">
    <div class="form-content">
      <!-- 基础信息 -->
      <el-form-item label="用户名" prop="username">
        <template #label>
          <el-icon><User /></el-icon>
          <span>用户名</span>
        </template>
        <el-input v-model="formData.username" placeholder="请输入用户名" :disabled="isEdit" />
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <template #label>
          <el-icon><UserFilled /></el-icon>
          <span>昵称</span>
        </template>
        <el-input v-model="formData.nickname" placeholder="请输入昵称" />
      </el-form-item>

      <el-form-item label="真实姓名" prop="realname">
        <template #label>
          <el-icon><Postcard /></el-icon>
          <span>真实姓名</span>
        </template>
        <el-input v-model="formData.realname" placeholder="请输入真实姓名" />
      </el-form-item>

      <el-form-item label="身份证号" prop="idCard">
        <template #label>
          <el-icon><Coin /></el-icon>
          <span>身份证号</span>
        </template>
        <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <template #label>
          <el-icon><Male v-if="formData.gender === 1" /><Female v-else-if="formData.gender === 2" /><Help v-else /></el-icon>
          <span>性别</span>
        </template>
        <el-radio-group v-model="formData.gender">
          <el-radio :value="0">未知</el-radio>
          <el-radio :value="1">男</el-radio>
          <el-radio :value="2">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 联系信息 -->
      <el-form-item label="手机号" prop="mobile">
        <template #label>
          <el-icon><Phone /></el-icon>
          <span>手机号</span>
        </template>
        <el-input v-model="formData.mobile" placeholder="请输入手机号" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <template #label>
          <el-icon><Message /></el-icon>
          <span>邮箱</span>
        </template>
        <el-input v-model="formData.email" placeholder="请输入邮箱" />
      </el-form-item>

      <el-form-item label="生日" prop="birthday">
        <template #label>
          <el-icon><Calendar /></el-icon>
          <span>生日</span>
        </template>
        <el-date-picker v-model="formData.birthday" type="date" placeholder="选择生日" style="width: 100%" />
      </el-form-item>

      <!-- 账户设置 -->
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

      <el-form-item label="简介" prop="description" class="form-item-full">
        <template #label>
          <el-icon><Document /></el-icon>
          <span>简介</span>
        </template>
        <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入简介" />
      </el-form-item>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { User, UserFilled, Postcard, Coin, Male, Female, Help, Phone, Message, Calendar, Switch, Document } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { UserDetailResp } from '@/types'

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
  idCard: '',
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
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
  mobile: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }]
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
  color: $text-secondary;
  white-space: nowrap;

  .el-icon {
    margin-right: 4px;
    font-size: 14px;
    color: $text-secondary;
  }
}

:deep(.el-form-item.is-required .el-form-item__label__content) {
  &::before {
    order: 2;
    margin-right: 0;
    margin-left: 2px;
  }
}

:deep(.el-form-item.is-required .el-form-item__label) {
  &::before {
    order: 2;
    margin-right: 0;
    margin-left: 2px;
  }
}

:deep(.el-input__wrapper) {
  padding: 4px 12px;
  border: 1px solid rgba($text-secondary, 0.15);
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
    color: $text-placeholder;
  }
}

:deep(.el-textarea__inner) {
  border: 1px solid rgba($text-secondary, 0.15);
  border-radius: 8px;
  color: $color-text-primary;
  background: rgba($color-bg-page, 0.6);

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
  display: inline-flex;
  align-items: center;
  margin-right: 16px;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  border-color: $color-primary;
  background: $color-primary;
}

:deep(.el-radio__inner) {
  border-color: rgba($text-secondary, 0.3);
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

:deep(.el-date-editor .el-input__wrapper) {
  border: 1px solid rgba($text-secondary, 0.15);
  border-radius: 8px;
  background: rgba($color-bg-page, 0.6);
}
</style>
