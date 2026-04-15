import type { RouteRecordRaw } from 'vue-router'
import type { CurrentMenu } from '@/types'

// 使用 glob 预加载所有 views 下的 .vue 文件
const modules = import.meta.glob('@/views/**/*.vue')

// 将菜单转换为路由配置（子路由版本）
export function generateRoutes(menus: CurrentMenu[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []

  for (const menu of menus) {
    // 只处理目录(0)和菜单(1)，不处理按钮(2)
    if (menu.type > 1 || !menu.frontPath) continue

    const route: RouteRecordRaw = {
      path: menu.frontPath,
      name: menu.code,
      redirect: undefined,
      meta: {
        title: menu.name,
        icon: menu.frontIcon,
        permission: menu.permission
      },
      children: []
    }

    // 动态导入组件
    if (menu.frontComponent) {
      const componentPath = `/src/views/${menu.frontComponent}.vue`
      route.component = modules[componentPath]
    }

    // 处理子菜单（递归）
    if (menu.children && menu.children.length > 0) {
      route.children = generateRoutes(menu.children)
    }

    routes.push(route)
  }

  return routes
}
