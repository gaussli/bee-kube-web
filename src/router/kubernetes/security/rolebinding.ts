import type { RouteRecordRaw } from 'vue-router'

export const roleBindingRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/rolebindings',
    name: 'kubernetes:security:rolebinding',
    component: () => import('@/views/kubernetes/security/rolebinding/index.vue'),
    meta: {
      title: '角色绑定',
      permission: 'kubernetes:security:rolebinding:view',
      activeCode: 'kubernetes:security:rolebinding',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name',
    name: 'kubernetes:security:rolebinding:detail',
    component: () => import('@/views/kubernetes/security/rolebinding/detail/index.vue'),
    meta: {
      title: '角色绑定详情',
      permission: 'kubernetes:security:rolebinding:view',
      activeCode: 'kubernetes:security:rolebinding',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/rolebindings/create',
    name: 'kubernetes:security:rolebinding:create',
    component: () => import('@/views/kubernetes/security/rolebinding/create/index.vue'),
    meta: {
      title: '创建角色绑定',
      permission: 'kubernetes:security:rolebinding:create',
      activeCode: 'kubernetes:security:rolebinding',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/rolebindings/create/yaml',
    name: 'kubernetes:security:rolebinding:create:yaml',
    component: () => import('@/views/kubernetes/security/rolebinding/create/yaml.vue'),
    meta: {
      title: '创建角色绑定 YAML',
      permission: 'kubernetes:security:rolebinding:create',
      activeCode: 'kubernetes:security:rolebinding',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/edit',
    name: 'kubernetes:security:rolebinding:edit',
    component: () => import('@/views/kubernetes/security/rolebinding/edit/index.vue'),
    meta: {
      title: '编辑角色绑定',
      permission: 'kubernetes:security:rolebinding:edit',
      activeCode: 'kubernetes:security:rolebinding',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/rolebindings/:name/edit/yaml',
    name: 'kubernetes:security:rolebinding:edit:yaml',
    component: () => import('@/views/kubernetes/security/rolebinding/edit/yaml.vue'),
    meta: {
      title: '编辑角色绑定 YAML',
      permission: 'kubernetes:security:rolebinding:edit',
      activeCode: 'kubernetes:security:rolebinding',
    },
  },
]
