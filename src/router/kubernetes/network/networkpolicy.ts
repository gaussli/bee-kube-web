import type { RouteRecordRaw } from 'vue-router'

export const networkPolicyRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/networkpolicies',
    name: 'kubernetes:network:networkpolicy',
    component: () => import('@/views/kubernetes/network/networkpolicy/index.vue'),
    meta: {
      title: '网络策略',
      permission: 'kubernetes:network:networkpolicy:view',
      activeCode: 'kubernetes:network:networkpolicy',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name',
    name: 'kubernetes:network:networkpolicy:detail',
    component: () => import('@/views/kubernetes/network/networkpolicy/detail/index.vue'),
    meta: {
      title: '网络策略详情',
      permission: 'kubernetes:network:networkpolicy:view',
      activeCode: 'kubernetes:network:networkpolicy',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/networkpolicies/create',
    name: 'kubernetes:network:networkpolicy:create',
    component: () => import('@/views/kubernetes/network/networkpolicy/create/index.vue'),
    meta: {
      title: '创建网络策略',
      permission: 'kubernetes:network:networkpolicy:create',
      activeCode: 'kubernetes:network:networkpolicy',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/networkpolicies/create/yaml',
    name: 'kubernetes:network:networkpolicy:create:yaml',
    component: () => import('@/views/kubernetes/network/networkpolicy/create/yaml.vue'),
    meta: {
      title: '创建网络策略 YAML',
      permission: 'kubernetes:network:networkpolicy:create',
      activeCode: 'kubernetes:network:networkpolicy',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/edit',
    name: 'kubernetes:network:networkpolicy:edit',
    component: () => import('@/views/kubernetes/network/networkpolicy/edit/index.vue'),
    meta: {
      title: '编辑网络策略',
      permission: 'kubernetes:network:networkpolicy:edit',
      activeCode: 'kubernetes:network:networkpolicy',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/networkpolicies/:name/edit/yaml',
    name: 'kubernetes:network:networkpolicy:edit:yaml',
    component: () => import('@/views/kubernetes/network/networkpolicy/edit/yaml.vue'),
    meta: {
      title: '编辑网络策略 YAML',
      permission: 'kubernetes:network:networkpolicy:edit',
      activeCode: 'kubernetes:network:networkpolicy',
    },
  },
]
