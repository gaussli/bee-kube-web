import type { RouteRecordRaw } from 'vue-router'

export const clusterRoleBindingRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/clusterrolebindings',
    name: 'kubernetes:security:clusterrolebinding',
    component: () => import('@/views/kubernetes/security/clusterrolebinding/index.vue'),
    meta: {
      title: '集群角色绑定',
      permission: 'kubernetes:security:clusterrolebinding:view',
      activeCode: 'kubernetes:security:clusterrolebinding',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name',
    name: 'kubernetes:security:clusterrolebinding:detail',
    component: () => import('@/views/kubernetes/security/clusterrolebinding/detail/index.vue'),
    meta: {
      title: '集群角色绑定详情',
      permission: 'kubernetes:security:clusterrolebinding:view',
      activeCode: 'kubernetes:security:clusterrolebinding',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterrolebindings/create',
    name: 'kubernetes:security:clusterrolebinding:create',
    component: () => import('@/views/kubernetes/security/clusterrolebinding/create/index.vue'),
    meta: {
      title: '创建集群角色绑定',
      permission: 'kubernetes:security:clusterrolebinding:create',
      activeCode: 'kubernetes:security:clusterrolebinding',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterrolebindings/create/yaml',
    name: 'kubernetes:security:clusterrolebinding:create:yaml',
    component: () => import('@/views/kubernetes/security/clusterrolebinding/create/yaml.vue'),
    meta: {
      title: '创建集群角色绑定 YAML',
      permission: 'kubernetes:security:clusterrolebinding:create',
      activeCode: 'kubernetes:security:clusterrolebinding',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/edit',
    name: 'kubernetes:security:clusterrolebinding:edit',
    component: () => import('@/views/kubernetes/security/clusterrolebinding/edit/index.vue'),
    meta: {
      title: '编辑集群角色绑定',
      permission: 'kubernetes:security:clusterrolebinding:edit',
      activeCode: 'kubernetes:security:clusterrolebinding',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/edit/yaml',
    name: 'kubernetes:security:clusterrolebinding:edit:yaml',
    component: () => import('@/views/kubernetes/security/clusterrolebinding/edit/yaml.vue'),
    meta: {
      title: '编辑集群角色绑定 YAML',
      permission: 'kubernetes:security:clusterrolebinding:edit',
      activeCode: 'kubernetes:security:clusterrolebinding',
    },
  },
]
