<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <span>Bee Kube 管理平台</span>
        </div>
      </template>
      <el-form :model="loginForm" :rules="rules" ref="formRef" label-width="0">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            size="large"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" class="login-btn" @click="handleLogin">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCurrentUser, login } from '@/api/auth/auth'
import { useUserStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true

  try {
    await login(loginForm).then(loginResp => userStore.setToken(loginResp.token))
    await getCurrentUser().then(currentUserResp => {
      userStore.setCurrentUser(currentUserResp.user)
      userStore.setCurrentMenus(currentUserResp.menus)
      userStore.setCurrentPermissions(currentUserResp.permissions)
    })
    ElMessage.success('登录成功')
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;

  // border-radius: $border-radius-lg;
  // box-shadow: $box-shadow;

  .card-header {
    font-size: $font-size-16;
    font-weight: bold;
    color: $color-text-primary;
    text-align: center;
  }

  :deep(.el-form-item) {
    margin-bottom: $spacing-16;
  }

  .login-btn {
    width: 100%;
  }
}
</style>
