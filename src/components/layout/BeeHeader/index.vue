<template>
  <header class="bee-header">
    <div class="header-left">
      <BeeSegmentedControl v-model="currentTab" :options="tabOptions" @select="handleTabChange" />
    </div>

    <div class="header-title">
      <img alt="logo" src="@/assets/bee.svg" />
      <span>Bee Kube</span>
    </div>

    <div class="header-right">
      <BeeTooltip size="small" tooltip="帮助">
        <BeeIconButton icon="basic-help" />
      </BeeTooltip>
      <BeeTooltip size="small" :tooltip="fullscreenTooltip">
        <BeeIconButton :icon="fullscreenIcon" @click="handleFullscreenToggle" />
      </BeeTooltip>
      <BeeDropdown :options="dropdownOptions" trigger="hover" @change="handleDropdownChange">
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
import { computed, ref, onMounted, onUnmounted } from 'vue'

import { useRouter } from 'vue-router'

import { useFullscreen } from '@vueuse/core'

import type { TabType } from '@/stores/app'

import type { DropdownOption } from '@/components/base/BeeDropdown/types'

import { logout } from '@/api/auth/auth'

import BeeDropdown from '@/components/base/BeeDropdown/index.vue'
import BeeIconButton from '@/components/base/BeeIconButton/index.vue'
import { BeeMessage } from '@/components/base/BeeMessage'
import BeeTooltip from '@/components/base/BeeTooltip/index.vue'
import BeeSegmentedControl from '@/components/BeeSegmentedControl/index.vue'
import BeeHeaderUserInfo from '@/components/business/BeeHeaderUserInfo/index.vue'

import { useAppStore, useUserStore } from '@/stores'

defineOptions({ name: 'BeeHeader' })

// ==================== Route & Store ====================
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

// ==================== Vueuse ====================
const { toggle } = useFullscreen()

// ==================== Reactive State ====================
const isFullscreen = ref(false)

// ==================== Computed ====================
/** 全屏按钮图标，根据全屏状态动态切换 */
const fullscreenIcon = computed(() => (isFullscreen.value ? 'basic-close' : 'basic-fullscreen'))
/** 全屏按钮 tooltip 提示文字 */
const fullscreenTooltip = computed(() => (isFullscreen.value ? '退出全屏' : '全屏'))
const currentUser = computed(() => userStore.getCurrentUser())
const currentMenus = computed(() => userStore.getCurrentMenus())
const currentTab = computed({
  get: () => appStore.currentTab,
  set: (val: TabType) => appStore.setCurrentTab(val),
})
// tabOptions 从用户菜单第一层获取，label 对应 name，value 对应 code
const tabOptions = computed(
  () =>
    currentMenus.value?.map(menu => ({
      label: menu.name,
      value: menu.code,
      icon: menu.icon,
    })) ?? [],
)

// ==================== Variables ====================
/** 用户下拉菜单选项 */
const dropdownOptions: DropdownOption[] = [
  { label: '用户信息', value: 'profile', icon: 'basic-userinfo' },
  { label: '系统设置', value: 'setting', icon: 'basic-system-setting' },
  { label: '退出登录', value: 'logout', icon: 'basic-logout', divided: true },
]

// ==================== Handler ====================
function handleTabChange(tab?: string | number) {
  if (tab) {
    appStore.setCurrentTab(tab as TabType)
    router.push({ name: tab as string }).catch(() => {})
  }
}

async function handleFullscreenToggle() {
  await toggle()
}

async function handleDropdownChange(command: string | number) {
  switch (command) {
    case 'profile':
      BeeMessage.info('用户信息功能开发中')
      break
    case 'setting':
      BeeMessage.info('系统设置功能开发中')
      break
    case 'logout':
      await handleLogout()
      break
  }
}

async function handleLogout() {
  try {
    await logout()
    BeeMessage.success('退出登录成功')
  } catch (err) {
    console.error('[logout]', err)
    BeeMessage.error('退出失败')
  }
  void userStore.clear()
  router.push('/login').catch(() => {})
}

// ==================== Method ====================
/**
 * 监听全屏状态变化（覆盖 ESC 退出等非按钮触发场景）
 */
function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

// ==================== Lifecycle ====================
onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<style lang="scss" scoped>
.bee-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 64px;
  padding: $spacing-8 $spacing-16;
  background: $color-bg-primary;

  &::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    background: linear-gradient(to right, $color-bg-primary 10%, $color-primary 50%, $color-bg-primary 90%);
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
