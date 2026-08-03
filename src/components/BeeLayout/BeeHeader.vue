<template>
  <header class="bee-header">
    <div class="header-left">
      <BeeSegmentedControl v-model="currentTab" :options="tabOptions" @select="handleTabChange" />
    </div>

    <div class="header-title">
      <img src="@/assets/bee.svg" alt="logo" />
      <span>Bee Kube</span>
    </div>

    <div class="header-right">
      <BeeCircleButton icon="basic-help" :border="false" tooltip="帮助" />
      <BeeCircleButton :icon="fullscreenIcon" :tooltip="fullscreenTooltip" :border="false" @click="toggleFullscreen" />
      <BeeDropdown :options="dropdownOptions" @change="handleDropdownChange">
        <BeeHeaderUserInfo
          :img="currentUser?.avatarId"
          :nickname="currentUser?.nickname || ''"
          :username="currentUser?.username || ''"
        />
      </BeeDropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * 顶部导航栏组件
 * @module components/BeeLayout/BeeHeader
 */
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { TabType } from '@/stores/app'
import { logout } from '@/api/auth/auth'
import BeeCircleButton from '@/components/BeeCircleButton/index.vue'
import BeeDropdown from '@/components/BeeDropdown/index.vue'
import BeeHeaderUserInfo from '@/components/BeeHeaderUserInfo/index.vue'
import BeeSegmentedControl from '@/components/BeeSegmentedControl/index.vue'
import { useAppStore, useKubernetesStore, useUserStore } from '@/stores'

defineOptions({ name: 'BeeHeader' })

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const kubernetesStore = useKubernetesStore()

const isFullscreen = ref(false)

/** 全屏按钮图标，根据全屏状态动态切换 */
const fullscreenIcon = computed(() => (isFullscreen.value ? 'basic-close' : 'basic-fullscreen'))
/** 全屏按钮 tooltip 提示文字 */
const fullscreenTooltip = computed(() => (isFullscreen.value ? '退出全屏' : '全屏'))
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
    currentMenus.value?.map(menu => ({
      label: menu.name,
      value: menu.code,
      icon: menu.icon
    })) ?? []
)

/** 用户下拉菜单选项 */
const dropdownOptions: { label: string; value: string; icon: string; divided?: boolean }[] = [
  { label: '用户信息', value: 'profile', icon: 'basic-userinfo' },
  { label: '系统设置', value: 'setting', icon: 'basic-system-setting' },
  { label: '退出登录', value: 'logout', icon: 'basic-logout', divided: true }
]

function handleTabChange(tab?: string | number) {
  if (tab) {
    appStore.setCurrentTab(tab as TabType)
    if (activeClusterId.value || tab !== 'kubernetes') {
      router.push({ name: tab as string })
    } else {
      router.push({ name: 'kubernetes:cluster' })
    }
  }
}

/** 监听全屏状态变化（覆盖 ESC 退出等非按钮触发场景） */
function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

async function handleDropdownChange(command: string | number) {
  switch (command) {
    case 'profile':
      ElMessage.info('用户信息功能开发中')
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
</script>

<style lang="scss" scoped>
.bee-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  padding: $spacing-8 $spacing-16;
  background: $color-bg-page;

  &::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    background: linear-gradient(to right, $color-bg-page 10%, $color-primary 50%, $color-bg-page 90%);
    content: '';
  }

  .header-left {
    display: flex;
    gap: $spacing-16;
    align-items: center;
    height: 100%;
  }

  .header-title {
    position: absolute;
    left: 50%;
    display: flex;
    gap: $spacing-8;
    align-items: center;
    height: 100%;
    transform: translateX(-50%);

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
    gap: $spacing-16;
    align-items: center;
    height: 100%;
  }
}
</style>
