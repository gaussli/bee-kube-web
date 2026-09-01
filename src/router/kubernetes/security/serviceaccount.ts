import type { RouteRecordRaw } from 'vue-router'

export const serviceAccountRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/serviceaccounts',
    name: 'kubernetes:security:serviceaccount',
    component: () => import('@/views/kubernetes/security/serviceaccount/index.vue'),
    meta: {
      title: '服务账号',
      permission: 'kubernetes:security:serviceaccount:view',
      activeCode: 'kubernetes:security:serviceaccount',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name',
    name: 'kubernetes:security:serviceaccount:detail',
    component: () => import('@/views/kubernetes/security/serviceaccount/detail/index.vue'),
    meta: {
      title: '服务账号详情',
      permission: 'kubernetes:security:serviceaccount:view',
      activeCode: 'kubernetes:security:serviceaccount',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/serviceaccounts/create',
    name: 'kubernetes:security:serviceaccount:create',
    component: () => import('@/views/kubernetes/security/serviceaccount/create/index.vue'),
    meta: {
      title: '创建服务账号',
      permission: 'kubernetes:security:serviceaccount:create',
      activeCode: 'kubernetes:security:serviceaccount',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/serviceaccounts/create/yaml',
    name: 'kubernetes:security:serviceaccount:create:yaml',
    component: () => import('@/views/kubernetes/security/serviceaccount/create/yaml.vue'),
    meta: {
      title: '创建服务账号 YAML',
      permission: 'kubernetes:security:serviceaccount:create',
      activeCode: 'kubernetes:security:serviceaccount',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/edit',
    name: 'kubernetes:security:serviceaccount:edit',
    component: () => import('@/views/kubernetes/security/serviceaccount/edit/index.vue'),
    meta: {
      title: '编辑服务账号',
      permission: 'kubernetes:security:serviceaccount:edit',
      activeCode: 'kubernetes:security:serviceaccount',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/serviceaccounts/:name/edit/yaml',
    name: 'kubernetes:security:serviceaccount:edit:yaml',
    component: () => import('@/views/kubernetes/security/serviceaccount/edit/yaml.vue'),
    meta: {
      title: '编辑服务账号 YAML',
      permission: 'kubernetes:security:serviceaccount:edit',
      activeCode: 'kubernetes:security:serviceaccount',
    },
  },
]
