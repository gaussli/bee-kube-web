<template>
  <header class="bee-header">
    <div class="header-left">
      <BeeRadioSearch :default="currentTab" :options="tabOptions" @select="handleTabChange" />
    </div>

    <div class="header-title">
      <img src="@/assets/bee.svg" alt="logo" />
      <span>Bee Kube</span>
    </div>

    <div class="header-right">
      <el-tooltip content="帮助说明" placement="bottom">
        <el-icon class="header-icon">
          <QuestionFilled />
        </el-icon>
      </el-tooltip>
      <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
        <el-icon class="header-icon" @click="toggleFullscreen">
          <FullScreen v-if="!isFullscreen" />
          <Close v-else />
        </el-icon>
      </el-tooltip>
      <BeeDropdown :options="dropdownOptions" @change="handleDropdownChange">
        <template #trigger>
          <span class="user-dropdown">
            <el-avatar :size="32" :src="currentUser?.avatarId || defaultAvatar" />
            <span class="username">{{ currentUser?.nickname || currentUser?.username || 'Admin' }}</span>
            <el-icon class="arrow-icon"><ArrowDown /></el-icon>
          </span>
        </template>
        <template #option="{ option }">
          <div class="dropdown-item">
            <el-icon v-if="option.icon">
              <component :is="option.icon" />
            </el-icon>
            <span>{{ option.label }}</span>
          </div>
        </template>
      </BeeDropdown>
    </div>

    <!-- 修改密码弹窗 -->
    <el-dialog v-model="passwordDialogVisible" title="修改密码" width="400px">
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="80px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePasswordSubmit">确定</el-button>
      </template>
    </el-dialog>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Close, FullScreen, QuestionFilled } from '@element-plus/icons-vue'
import { Lock, Setting, SwitchButton, User } from '@element-plus/icons-vue'
import { logout } from '@/api'
import { useAppStore, useKubernetesStore, useUserStore } from '@/stores'
import BeeDropdown from '@/components/BeeDropdown/index.vue'
import BeeRadioSearch from '@/components/BeeRadioSearch/index.vue'
import type { TabType } from '@/stores/app'

defineOptions({ name: 'BeeHeader' })

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const kubernetesStore = useKubernetesStore()

const isFullscreen = ref(false)
const passwordDialogVisible = ref(false)
const passwordFormRef = ref()

const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

const currentUser = computed(() => userStore.getCurrentUser())
const currentMenus = computed(() => userStore.getCurrentMenus())

const currentTab = computed({
  get: () => appStore.currentTab,
  set: (val: TabType) => appStore.setCurrentTab(val)
})

const activeClusterId = computed(() => kubernetesStore.activeClusterId)

// tabOptions 从用户菜单第一层获取，label 对应 name，value 对应 code
const tabOptions = computed(
  () =>
    currentMenus.value.map(menu => ({
      label: menu.name,
      value: menu.code
    })) ?? []
)

const dropdownOptions = [
  { label: '用户信息', value: 'profile', icon: User },
  { label: '修改密码', value: 'password', icon: Lock },
  { label: '系统设置', value: 'setting', icon: Setting },
  { label: '退出登录', value: 'logout', icon: SwitchButton, divided: true }
]

function handleTabChange(tab?: string | number) {
  if (tab) {
    appStore.setCurrentTab(tab as TabType)
    console.log(activeClusterId.value)
    if (activeClusterId.value || tab !== 'kubernetes') {
      router.push({ name: tab as string })
    } else {
      router.push({ name: 'kubernetes:cluster' })
    }
  }
}

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (_rule: any, value: string, callback: any) => {
  if (value !== passwordForm.value.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

async function handleDropdownChange(command: string) {
  switch (command) {
    case 'profile':
      ElMessage.info('用户信息功能开发中')
      break
    case 'password':
      passwordDialogVisible.value = true
      break
    case 'setting':
      ElMessage.info('系统设置功能开发中')
      break
    case 'logout':
      await handleLogout()
      break
  }
}

async function handleLogout() {
  await ElMessageBox.confirm('确定要退出登录吗？', '提示', { type: 'warning' })
  try {
    await logout()
    ElMessage.success('退出登录成功')
  } catch {
    // 忽略退出接口错误，继续清理
  }
  userStore.clear()
  router.push('/login')
}

function handlePasswordSubmit() {
  passwordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      ElMessage.success('密码修改成功')
      passwordDialogVisible.value = false
      passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
    }
  })
}
</script>

<style lang="scss" scoped>
.bee-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 0 $spacing-md;
  background: none;

  .header-left {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }

  .header-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    img {
      width: 32px;
      height: 32px;
    }

    span {
      font-weight: bold;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    .header-icon {
      font-size: 20px;
      cursor: pointer;
      color: $text-regular;

      &:hover {
        color: $color-primary;
      }
    }

    .user-dropdown {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }

      .username {
        color: $text-primary;
        font-size: 14px;
      }

      .arrow-icon {
        font-size: 12px;
        color: $text-secondary;
      }
    }
  }
}
</style>
