<template>
  <aside class="aside" :style="{ width: appStore.sidebarOpened ? '220px' : '64px' }">
    <div class="logo">
      <img src="@/assets/vue.svg" alt="logo" />
      <span v-show="appStore.sidebarOpened">Bee Kube</span>
    </div>

    <el-menu :default-active="route.meta.activeCode as string" :collapse="!appStore.sidebarOpened" :collapse-transition="false" @select="handleSelect" class="aside-menu">
      <template v-for="item in currentMenuList" :key="item.id">
        <el-menu-item v-if="!item.children?.length" :index="item.code">
          <el-icon v-if="item.icon">
            <component :is="getIcon(item.icon)" />
          </el-icon>
          <template #title>{{ item.name }}</template>
        </el-menu-item>
        <el-sub-menu v-else :index="item.code">
          <template #title>
            <el-icon v-if="item.icon">
              <component :is="getIcon(item.icon)" />
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="child in item.children" :key="child.id" :index="child.code">
            <el-icon v-if="child.icon">
              <component :is="getIcon(child.icon)" />
            </el-icon>
            <span>{{ child.name }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  HomeFilled,
  Setting,
  Odometer,
  Box,
  FolderOpened,
  Cpu,
  Document,
  Collection,
  Monitor,
  DocumentCopy,
  Lock,
  User,
  Avatar,
  Menu,
  Goods,
  Connection,
  Share,
  Guide,
  Aim,
  Files,
  Grid,
  Coin,
  Key,
  UserFilled,
  Link,
  Timer,
  Clock
} from '@element-plus/icons-vue'
import { useAppStore, useUserStore } from '@/stores'
import type { Component } from 'vue'

defineOptions({ name: 'LayoutAside' })

const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

// 根据当前 tab 获取菜单列表
const currentMenuList = computed(() => {
  return userStore.getCurrentMenus().find(menu => menu.code === appStore.currentTab)?.children
})

onMounted(() => {
  console.log(router.getRoutes())
})

const iconMap: Record<string, Component> = {
  HomeFilled,
  Setting,
  Odometer,
  Box,
  FolderOpened,
  Cpu,
  Document,
  Collection,
  Monitor,
  DocumentCopy,
  Lock,
  User,
  Avatar,
  Menu,
  Goods,
  Connection,
  Share,
  Guide,
  Aim,
  Files,
  Grid,
  Coin,
  Key,
  UserFilled,
  Link,
  Timer,
  Clock
}

function getIcon(iconName?: string): Component {
  return iconName ? iconMap[iconName] || HomeFilled : HomeFilled
}

// 使用 name 跳转路由
function handleSelect(index: string) {
  console.log(index)
  router.push({ name: index })
}
</script>

<style lang="scss" scoped>
.aside {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: none;
  transition: width 0.3s;

  .logo {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    height: 60px;
    padding: 0 $spacing-md;
    background: none;
    font-weight: bold;

    img {
      width: 32px;
      height: 32px;
    }
  }

  .cluster-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    margin: 0 8px 8px;

    .cluster-select {
      flex: 1;

      :deep(.el-select__wrapper) {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .cluster-actions {
      display: flex;
      gap: 4px;
    }
  }

  .cluster-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .aside-menu {
    flex: 1;
    border-right: none;
    background: transparent;
    overflow-y: auto;

    :deep(.el-menu--inline) {
      background: none;
    }
  }
}

.delete-content {
  p {
    margin-bottom: 12px;
  }
}
</style>
