<template>
  <aside class="aside" :style="{ width: appStore.sidebarOpened ? '200px' : '64px' }">
    <div class="logo">
      <img src="@/assets/vue.svg" alt="logo" />
      <span v-show="appStore.sidebarOpened">Bee Kube</span>
    </div>
    <el-menu :default-active="route.path" :collapse="!appStore.sidebarOpened" :collapse-transition="false" router class="aside-menu">
      <template v-for="item in menuList" :key="item.id">
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
import { useAppStore } from '@/stores'
import type { CurrentMenu } from '@/types/auth'
import { HomeFilled, Setting } from '@element-plus/icons-vue'
import type { Component } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'LayoutAside' })

const props = defineProps<{
  menus: CurrentMenu[]
}>()

const appStore = useAppStore()
const route = useRoute()

// 默认 dashboard 菜单
const dashboardMenu: CurrentMenu = {
  id: 'dashboard',
  code: 'dashboard',
  name: '仪表盘',
  frontPath: '/dashboard',
  frontIcon: 'HomeFilled',
  type: 1
}

// 合并后的菜单列表（dashboard 在首位）
const menuList = computed(() => [dashboardMenu, ...props.menus])

const iconMap: Record<string, Component> = {
  HomeFilled,
  Setting,
  User: () => import('@element-plus/icons-vue').then(m => m.User),
  Role: () => import('@element-plus/icons-vue').then(m => m.UserFilled)
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
</style>
