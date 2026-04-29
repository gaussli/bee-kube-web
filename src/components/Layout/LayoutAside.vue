<template>
  <aside class="aside" :style="{ width: appStore.sidebarOpened ? '220px' : '64px' }">
    <div class="logo">
      <img src="@/assets/vue.svg" alt="logo" />
      <span v-show="appStore.sidebarOpened">Bee Kube</span>
    </div>

    <el-menu :default-active="route.meta.activeCode" :collapse="!appStore.sidebarOpened" :collapse-transition="false" router class="aside-menu">
      <template v-for="item in currentMenuList" :key="item.id">
        <el-menu-item v-if="!item.children?.length" :index="item.frontPath || '/'">
          <el-icon>
            <component :is="getIcon(item.frontIcon)" />
          </el-icon>
          <template #title>{{ item.name }}</template>
        </el-menu-item>
        <el-sub-menu v-else :index="item.frontPath || item.code">
          <template #title>
            <el-icon>
              <component :is="getIcon(item.frontIcon)" />
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="child in item.children" :key="child.id" :index="child.frontPath || '/'">
            {{ child.name }}
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { HomeFilled, Setting, Odometer, Box, FolderOpened, Cpu, Document, Collection, Monitor, DocumentCopy, Lock } from '@element-plus/icons-vue'
import { useAppStore, useUserStore } from '@/stores'
import type { Component } from 'vue'

defineOptions({ name: 'LayoutAside' })

const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()

// 根据当前 tab 获取菜单列表
const currentMenuList = computed(() => {
  return userStore
    .getCurrentMenus()
    .find(menu => menu.code === 'home')
    ?.children?.find(menu => menu.code === appStore.currentTab)?.children
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
  User: () => import('@element-plus/icons-vue').then(m => m.User),
  Avatar: () => import('@element-plus/icons-vue').then(m => m.Avatar),
  Menu: () => import('@element-plus/icons-vue').then(m => m.Menu),
  Goods: () => import('@element-plus/icons-vue').then(m => m.Goods)
}

function getIcon(iconName?: string): Component {
  return iconName ? iconMap[iconName] || HomeFilled : HomeFilled
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
