<template>
  <div class="user-edit">
    <!-- 顶部导航 -->
    <div class="nav-bar">
      <div class="back-btn" @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回</span>
      </div>
      <div class="page-title">
        <span class="title-cn">编辑用户</span>
        <span class="title-en">Edit User</span>
      </div>
    </div>

    <!-- 表单区域 -->
    <el-card class="form-card">
      <transition name="fade-slide" mode="out-in">
        <div v-if="loaded" class="form-content">
          <div class="form-header">
            <div class="form-icon">
              <el-icon><EditPen /></el-icon>
            </div>
            <div class="form-title">
              <h2>用户信息</h2>
              <p>Modify user information below</p>
            </div>
            <div class="user-badge">
              <el-icon><Key /></el-icon>
              <span>{{ userData.id }}</span>
            </div>
          </div>

          <UserForm ref="userFormRef" :data="userData" />

          <div class="form-actions">
            <div class="action-hint">
              <el-icon><WarningFilled /></el-icon>
              <span>修改后需要保存才能生效</span>
            </div>
            <div class="action-buttons">
              <el-button class="btn-cancel" @click="handleBack">
                <el-icon><Close /></el-icon>
                <span>取消</span>
              </el-button>
              <el-button class="btn-submit" @click="handleSubmit">
                <el-icon><Check /></el-icon>
                <span>保存</span>
              </el-button>
            </div>
          </div>
        </div>
      </transition>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, EditPen, Key, WarningFilled, Close, Check } from '@element-plus/icons-vue'
import UserForm from '@/components/UserForm/index.vue'
import type { UserDetailResp } from '@/types'

defineOptions({ name: 'UserEdit' })

const router = useRouter()
const userFormRef = ref<InstanceType<typeof UserForm>>()
const loaded = ref(false)

const userId = router.currentRoute.value.query.id as string

// TODO: 从 API 获取用户数据
const userData = ref<UserDetailResp>({
  id: userId,
  username: 'admin',
  nickname: '管理员',
  realname: '张三',
  gender: 1,
  status: 1,
  mobile: '13800138000',
  email: 'admin@example.com',
  description: '这是一段用户简介',
  createBy: 'system',
  createAt: '2024-01-01 10:00:00',
  updateBy: 'admin',
  updateAt: '2024-01-15 14:30:00'
})

function handleBack() {
  router.back()
}

async function handleSubmit() {
  try {
    await userFormRef.value?.validate()
    // TODO: 调用更新 API
    ElMessage.success('保存成功')
    router.push('/system/user')
  } catch {
    // 验证失败
  }
}

onMounted(() => {
  loaded.value = true
})
</script>

<style lang="scss" scoped>
.user-edit {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $bg-page;
}

.nav-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 48px;
  padding: 0 8px;
  background-color: $bg-page;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 8px;
  color: $text-secondary;
  transition: all 0.3s;

  &:hover {
    color: $text-primary;
    background-color: $bg-hover;
  }
}

.page-title {
  display: flex;
  align-items: baseline;
  gap: 12px;

  .title-cn {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
  }

  .title-en {
    font-size: 12px;
    color: $text-secondary;
  }
}

.form-card {
  flex: 1;
  overflow: hidden;
  background-color: $bg-page;
  border: 1px solid rgba($text-secondary, 0.1);
  border-radius: 12px;

  :deep(.el-card__body) {
    height: 100%;
    overflow-y: auto;
  }
}

.form-content {
  display: flex;
  flex-direction: column;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba($text-secondary, 0.1);
}

.form-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-400 100%);
  border-radius: 8px;
  font-size: 18px;
  color: #fff;
}

.form-title {
  flex: 1;

  h2 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }

  p {
    margin: 2px 0 0;
    font-size: 12px;
    color: $text-secondary;
  }
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: $bg-color;
  border: 1px solid rgba($text-secondary, 0.15);
  border-radius: 6px;
  font-size: 12px;
  color: $text-secondary;
  font-family: monospace;

  .el-icon {
    color: $color-primary;
    opacity: 0.7;
  }
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba($text-secondary, 0.1);
}

.action-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  color: $text-secondary;
  font-size: 13px;

  .el-icon {
    color: $color-warning;
    opacity: 0.8;
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn-cancel,
.btn-submit {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
}

.btn-cancel {
  background: $bg-color;
  border: 1px solid rgba($text-secondary, 0.2);
  color: $text-secondary;

  &:hover {
    color: $text-primary;
    background: $bg-hover;
  }
}

.btn-submit {
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-400 100%);
  border: none;
  color: #fff;
}

// 渐入渐出动画
.fade-slide-enter-active {
  animation: fadeSlideIn 0.3s ease-out;
}

.fade-slide-leave-active {
  animation: fadeSlideOut 0.2s ease-in;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeSlideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
}
</style>
