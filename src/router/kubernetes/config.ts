import type { RouteRecordRaw } from 'vue-router'

const configmapRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterId/config/configmap',
    name: 'kubernetes:config:configmap',
    component: () => import('@/views/kubernetes/config/configmap/index.vue'),
    meta: {
      title: '配置映射',
      icon: 'DocumentCopy',
      permission: 'kubernetes:config:configmap:view',
      activeCode: 'kubernetes:config:configmap'
    }
  },
  {
    path: '/kubernetes/clusters/:clusterId/config/configmap/create',
    name: 'kubernetes:config:configmap:create',
    component: () => import('@/views/kubernetes/config/configmap/create/index.vue'),
    meta: {
      title: '创建配置映射',
      icon: 'DocumentCopy',
      permission: 'kubernetes:config:configmap:create',
      activeCode: 'kubernetes:config:configmap'
    }
  },
  {
    path: '/kubernetes/clusters/:clusterId/config/configmap/edit',
    name: 'kubernetes:config:configmap:edit',
    component: () => import('@/views/kubernetes/config/configmap/edit/index.vue'),
    meta: {
      title: '编辑配置映射',
      icon: 'DocumentCopy',
      permission: 'kubernetes:config:configmap:edit',
      activeCode: 'kubernetes:config:configmap'
    }
  },
  {
    path: '/kubernetes/clusters/:clusterId/config/configmap/detail',
    name: 'kubernetes:config:configmap:detail',
    component: () => import('@/views/kubernetes/config/configmap/detail/index.vue'),
    meta: {
      title: '配置映射详情',
      icon: 'DocumentCopy',
      permission: 'kubernetes:config:configmap:view',
      activeCode: 'kubernetes:config:configmap'
    }
  }
]

const secretRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterId/config/secret',
    name: 'kubernetes:config:secret',
    component: () => import('@/views/kubernetes/config/secret/index.vue'),
    meta: {
      title: '密钥',
      icon: 'Lock',
      permission: 'kubernetes:config:secret:view',
      activeCode: 'kubernetes:config:secret'
    }
  },
  {
    path: '/kubernetes/clusters/:clusterId/config/secret/create',
    name: 'kubernetes:config:secret:create',
    component: () => import('@/views/kubernetes/config/secret/create/index.vue'),
    meta: {
      title: '创建密钥',
      icon: 'Lock',
      permission: 'kubernetes:config:secret:create',
      activeCode: 'kubernetes:config:secret'
    }
  },
  {
    path: '/kubernetes/clusters/:clusterId/config/secret/edit',
    name: 'kubernetes:config:secret:edit',
    component: () => import('@/views/kubernetes/config/secret/edit/index.vue'),
    meta: {
      title: '编辑密钥',
      icon: 'Lock',
      permission: 'kubernetes:config:secret:edit',
      activeCode: 'kubernetes:config:secret'
    }
  },
  {
    path: '/kubernetes/clusters/:clusterId/config/secret/detail',
    name: 'kubernetes:config:secret:detail',
    component: () => import('@/views/kubernetes/config/secret/detail/index.vue'),
    meta: {
      title: '密钥详情',
      icon: 'Lock',
      permission: 'kubernetes:config:secret:view',
      activeCode: 'kubernetes:config:secret'
    }
  }
]

export const configRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterId/config',
    name: 'kubernetes:config',
    redirect: '/kubernetes/clusters/:clusterId/config/configmap',
    meta: {
      title: '配置',
      icon: 'Setting'
    },
    children: [...configmapRoutes, ...secretRoutes]
  }
]
