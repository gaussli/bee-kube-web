<template>
  <aside class="bee-aside">
    <BeeMenu :default-active="defaultActive" @select="handleSelect">
      <template v-for="item in currentMenuList" :key="item.id">
        <BeeMenuItem v-if="!item.children?.length" :index="item.code" :label="item.name" :icon="item.icon" />
        <BeeSubMenu v-else :index="item.code" :label="item.name" :icon="item.icon">
          <BeeMenuItem
            v-for="child in item.children"
            :key="child.id"
            :index="child.code"
            :label="child.name"
            :icon="child.icon"
          />
        </BeeSubMenu>
      </template>
    </BeeMenu>
  </aside>
</template>

<script setup lang="ts">
/**
 * 侧边栏导航组件
 * 根据当前 Tab 动态渲染菜单，支持子菜单展开和路由跳转
 * @module components/BeeLayout/BeeAside
 */
import { computed } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import BeeMenu from '@/components/BeeMenu/BeeMenu.vue'
import BeeMenuItem from '@/components/BeeMenu/BeeMenuItem.vue'
import BeeSubMenu from '@/components/BeeMenu/BeeSubMenu.vue'

import { useAppStore, useUserStore, useKubernetesStore } from '@/stores'

defineOptions({ name: 'BeeAside' })

const appStore = useAppStore()
const userStore = useUserStore()
const kubernetesStore = useKubernetesStore()
const route = useRoute()
const router = useRouter()

/** 集群管理相关路由名称常量 */
const CLUSTER_ROUTE = 'kubernetes:cluster' as const
const CLUSTER_DASHBOARD_ROUTE = 'kubernetes:dashboard' as const

/** 当前激活的菜单项，优先使用路由 meta.activeCode，回退到 route.name */
const defaultActive = computed(() => {
  return (route.meta.activeCode ?? route.name) as string | undefined
})

/** 根据当前 tab 获取菜单列表，无匹配时返回空数组 */
const currentMenuList = computed(() => {
  return userStore.getCurrentMenus().find(menu => menu.code === appStore.currentTab)?.children ?? []
})

/**
 * 菜单项选中回调，使用路由名称跳转
 * @param index - 菜单项 code（即路由 name）
 */
function handleSelect(index: string | number) {
  const routeName = String(index)
  // 集群管理特殊处理：存在 activeClusterId 则跳转 dashboard，否则跳转列表
  if (routeName === CLUSTER_ROUTE && kubernetesStore.activeClusterId) {
    router
      .push({ name: CLUSTER_DASHBOARD_ROUTE, params: { clusterId: kubernetesStore.activeClusterId } })
      .catch(() => {})
    return
  }
  // kubernetes 子资源路由需要携带 clusterId
  if (routeName.startsWith('kubernetes:') && routeName !== CLUSTER_ROUTE && routeName !== CLUSTER_DASHBOARD_ROUTE) {
    router.push({ name: routeName, params: { clusterId: kubernetesStore.activeClusterId } }).catch(() => {})
    return
  }
  router.push({ name: routeName }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.bee-aside {
  display: flex;
  flex-direction: column;
  width: 240px;
  height: 100%;
  scrollbar-width: none; // 隐藏滚动条（Firefox）
}

::-webkit-scrollbar {
  display: none; // 隐藏滚动条（Chrome、Edge、Safari）
}
</style>
