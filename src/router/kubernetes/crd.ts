import type { RouteRecordRaw } from 'vue-router'

export const crdRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterId/crd',
    name: 'kubernetes:crd',
    component: () => import('@/views/kubernetes/crd/index.vue'),
    meta: {
      title: '资源定义',
      icon: 'Coin',
      permission: 'kubernetes:crd:view',
      activeCode: 'kubernetes:crd'
    }
  },
  {
    path: '/kubernetes/clusters/:clusterId/crd/create',
    name: 'kubernetes:crd:create',
    component: () => import('@/views/kubernetes/crd/create/index.vue'),
    meta: {
      title: '创建资源定义',
      icon: 'Coin',
      permission: 'kubernetes:crd:create',
      activeCode: 'kubernetes:crd'
    }
  },
  {
    path: '/kubernetes/clusters/:clusterId/crd/edit',
    name: 'kubernetes:crd:edit',
    component: () => import('@/views/kubernetes/crd/edit/index.vue'),
    meta: {
      title: '编辑资源定义',
      icon: 'Coin',
      permission: 'kubernetes:crd:edit',
      activeCode: 'kubernetes:crd'
    }
  },
  {
    path: '/kubernetes/clusters/:clusterId/crd/detail',
    name: 'kubernetes:crd:detail',
    component: () => import('@/views/kubernetes/crd/detail/index.vue'),
    meta: {
      title: '资源定义详情',
      icon: 'Coin',
      permission: 'kubernetes:crd:view',
      activeCode: 'kubernetes:crd'
    }
  }
]
