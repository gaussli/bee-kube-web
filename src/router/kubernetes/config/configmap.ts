import type { RouteRecordRaw } from 'vue-router'

export const configmapRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/configmaps',
    name: 'kubernetes:config:configmap',
    component: () => import('@/views/kubernetes/config/configmap/index.vue'),
    meta: {
      title: '配置映射',
      permission: 'kubernetes:config:configmap:view',
      activeCode: 'kubernetes:config:configmap',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name',
    name: 'kubernetes:config:configmap:detail',
    component: () => import('@/views/kubernetes/config/configmap/detail/index.vue'),
    meta: {
      title: '配置映射详情',
      permission: 'kubernetes:config:configmap:view',
      activeCode: 'kubernetes:config:configmap',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/configmaps/create',
    name: 'kubernetes:config:configmap:create',
    component: () => import('@/views/kubernetes/config/configmap/create/index.vue'),
    meta: {
      title: '创建配置映射',
      permission: 'kubernetes:config:configmap:create',
      activeCode: 'kubernetes:config:configmap',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/configmaps/create/yaml',
    name: 'kubernetes:config:configmap:create:yaml',
    component: () => import('@/views/kubernetes/config/configmap/create/yaml.vue'),
    meta: {
      title: '创建配置映射 YAML',
      permission: 'kubernetes:config:configmap:create',
      activeCode: 'kubernetes:config:configmap',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/edit',
    name: 'kubernetes:config:configmap:edit',
    component: () => import('@/views/kubernetes/config/configmap/edit/index.vue'),
    meta: {
      title: '编辑配置映射',
      permission: 'kubernetes:config:configmap:edit',
      activeCode: 'kubernetes:config:configmap',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/edit/yaml',
    name: 'kubernetes:config:configmap:edit:yaml',
    component: () => import('@/views/kubernetes/config/configmap/edit/yaml.vue'),
    meta: {
      title: '编辑配置映射 YAML',
      permission: 'kubernetes:config:configmap:edit',
      activeCode: 'kubernetes:config:configmap',
    },
  },
]
