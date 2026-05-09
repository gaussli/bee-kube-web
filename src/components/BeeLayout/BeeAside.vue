<template>
  <aside class="bee-aside">
    <el-menu class="aside-menu" :default-active="route.meta.activeCode ?? route.name" unique-opened @select="handleSelect">
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
import { useAppStore, useUserStore, useKubernetesStore } from '@/stores'
import type { Component } from 'vue'

defineOptions({ name: 'BeeAside' })

const appStore = useAppStore()
const userStore = useUserStore()
const kubernetesStore = useKubernetesStore()
const route = useRoute()
const router = useRouter()

// 根据当前 tab 获取菜单列表
const currentMenuList = computed(() => {
  return userStore.getCurrentMenus().find(menu => menu.code === appStore.currentTab)?.children
})

onMounted(() => {
  console.log('current route: ', route.name, route.meta.activeCode)
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
  // 集群管理特殊处理：存在 activeClusterId 则跳转 dashboard，否则跳转列表
  if (index === 'kubernetes:cluster' && kubernetesStore.activeClusterId) {
    router.push({ name: 'kubernetes:dashboard' })
    return
  }
  router.push({ name: index })
}
</script>

<style lang="scss" scoped>
.bee-aside {
  display: flex;
  flex-direction: column;
  width: 220px;
  height: 100%;
  border-radius: $radius-sm;
  scrollbar-width: none; // 隐藏滚动条（Firefox）

  .aside-menu {
    flex: 1;
    border-right: none;
    overflow-y: auto;
  }
}

::-webkit-scrollbar {
  display: none; // 隐藏滚动条（Chrome、Edge、Safari）
}
</style>
