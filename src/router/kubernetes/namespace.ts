import type { RouteRecordRaw } from 'vue-router'

export const namespaceRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/namespace',
    name: 'kubernetes:namespace',
    component: () => import('@/views/kubernetes/namespace/index.vue'),
    meta: {
      title: '命名空间',
      icon: 'FolderOpened',
      permission: 'kubernetes:namespace:view',
      activeCode: 'kubernetes:namespace'
    }
  },
  {
    path: '/kubernetes/namespace/detail',
    name: 'kubernetes:namespace:detail',
    component: () => import('@/views/kubernetes/namespace/detail/index.vue'),
    meta: {
      title: '命名空间详情',
      icon: 'FolderOpened',
      permission: 'kubernetes:namespace:view',
      activeCode: 'kubernetes:namespace'
    }
  },
  {
    path: '/kubernetes/namespace/create',
    name: 'kubernetes:namespace:create',
    component: () => import('@/views/kubernetes/namespace/create/index.vue'),
    meta: {
      title: '创建命名空间',
      icon: 'FolderOpened',
      permission: 'kubernetes:namespace:create',
      activeCode: 'kubernetes:namespace'
    }
  },
  {
    path: '/kubernetes/namespace/edit',
    name: 'kubernetes:namespace:edit',
    component: () => import('@/views/kubernetes/namespace/edit/index.vue'),
    meta: {
      title: '编辑命名空间',
      icon: 'FolderOpened',
      permission: 'kubernetes:namespace:edit',
      activeCode: 'kubernetes:namespace'
    }
  }
]
