import type { RouteRecordRaw } from 'vue-router'
import type { CurrentMenu } from '@/types'

// 使用 glob 预加载所有 views 下的 .vue 文件
const modules = import.meta.glob('@/views/**/*.vue')

// 将菜单转换为路由配置（子路由版本）
export function generateRoutes(menus: CurrentMenu[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []

  for (const menu of menus) {
    // 只处理目录(0)、菜单(1)和页面(2)，不处理按钮(3)
    if (menu.type > 2) continue

    const route: RouteRecordRaw = {
      path: menu.frontPath ?? '',
      name: menu.code,
      meta: {
        id: menu.id,
        title: menu.name,
        icon: menu.frontIcon,
        permission: menu.permission,
        activeCode: menu.activeCode ?? menu.code
      },
      children: []
    }

    if (menu.frontRedirect) {
      route.redirect = menu.frontRedirect
    }

    // 动态导入组件
    if (menu.frontComponent) {
      const componentPath = `${menu.frontComponent}`
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
