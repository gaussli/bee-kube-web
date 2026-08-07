import type { RouteRecordRaw } from 'vue-router'

const serviceAccountRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/security/serviceaccount',
    name: 'kubernetes:security:serviceaccount',
    component: () => import('@/views/kubernetes/security/serviceaccount/index.vue'),
    meta: {
      title: '服务账号',
      permission: 'kubernetes:security:serviceaccount:view',
      activeCode: 'kubernetes:security:serviceaccount',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/security/serviceaccount/create',
    name: 'kubernetes:security:serviceaccount:create',
    component: () => import('@/views/kubernetes/security/serviceaccount/create/index.vue'),
    meta: {
      title: '创建服务账号',
      permission: 'kubernetes:security:serviceaccount:create',
      activeCode: 'kubernetes:security:serviceaccount',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/security/serviceaccount/edit',
    name: 'kubernetes:security:serviceaccount:edit',
    component: () => import('@/views/kubernetes/security/serviceaccount/edit/index.vue'),
    meta: {
      title: '编辑服务账号',
      permission: 'kubernetes:security:serviceaccount:edit',
      activeCode: 'kubernetes:security:serviceaccount',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/security/serviceaccount/detail',
    name: 'kubernetes:security:serviceaccount:detail',
    component: () => import('@/views/kubernetes/security/serviceaccount/detail/index.vue'),
    meta: {
      title: '服务账号详情',
      permission: 'kubernetes:security:serviceaccount:view',
      activeCode: 'kubernetes:security:serviceaccount',
    },
  },
]

const clusteRoleRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/security/clusterrole',
    name: 'kubernetes:security:clusterrole',
    component: () => import('@/views/kubernetes/security/clusterrole/index.vue'),
    meta: {
      title: '集群角色',
      permission: 'kubernetes:security:clusterrole:view',
      activeCode: 'kubernetes:security:clusterrole',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/security/clusterrole/create',
    name: 'kubernetes:security:clusterrole:create',
    component: () => import('@/views/kubernetes/security/clusterrole/create/index.vue'),
    meta: {
      title: '创建集群角色',
      permission: 'kubernetes:security:clusterrole:create',
      activeCode: 'kubernetes:security:clusterrole',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/security/clusterrole/edit',
    name: 'kubernetes:security:clusterrole:edit',
    component: () => import('@/views/kubernetes/security/clusterrole/edit/index.vue'),
    meta: {
      title: '编辑集群角色',
      permission: 'kubernetes:security:clusterrole:edit',
      activeCode: 'kubernetes:security:clusterrole',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/security/clusterrole/detail',
    name: 'kubernetes:security:clusterrole:detail',
    component: () => import('@/views/kubernetes/security/clusterrole/detail/index.vue'),
    meta: {
      title: '集群角色详情',
      permission: 'kubernetes:security:clusterrole:view',
      activeCode: 'kubernetes:security:clusterrole',
    },
  },
]

const roleRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/security/role',
    name: 'kubernetes:security:role',
    component: () => import('@/views/kubernetes/security/role/index.vue'),
    meta: {
      title: '角色',
      permission: 'kubernetes:security:role:view',
      activeCode: 'kubernetes:security:role',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/security/role/create',
    name: 'kubernetes:security:role:create',
    component: () => import('@/views/kubernetes/security/role/create/index.vue'),
    meta: {
      title: '创建角色',
      permission: 'kubernetes:security:role:create',
      activeCode: 'kubernetes:security:role',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/security/role/edit',
    name: 'kubernetes:security:role:edit',
    component: () => import('@/views/kubernetes/security/role/edit/index.vue'),
    meta: {
      title: '编辑角色',
      permission: 'kubernetes:security:role:edit',
      activeCode: 'kubernetes:security:role',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/security/role/detail',
    name: 'kubernetes:security:role:detail',
    component: () => import('@/views/kubernetes/security/role/detail/index.vue'),
    meta: {
      title: '角色详情',
      permission: 'kubernetes:security:role:view',
      activeCode: 'kubernetes:security:role',
    },
  },
]

const clusteRoleBindingRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/security/clusterrolebinding',
    name: 'kubernetes:security:clusterrolebinding',
    component: () => import('@/views/kubernetes/security/clusterrolebinding/index.vue'),
    meta: {
      title: '集群角色绑定',
      permission: 'kubernetes:security:clusterrolebinding:view',
      activeCode: 'kubernetes:security:clusterrolebinding',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/security/clusterrolebinding/create',
    name: 'kubernetes:security:clusterrolebinding:create',
    component: () => import('@/views/kubernetes/security/clusterrolebinding/create/index.vue'),
    meta: {
      title: '创建集群角色绑定',
      permission: 'kubernetes:security:clusterrolebinding:create',
      activeCode: 'kubernetes:security:clusterrolebinding',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/security/clusterrolebinding/edit',
    name: 'kubernetes:security:clusterrolebinding:edit',
    component: () => import('@/views/kubernetes/security/clusterrolebinding/edit/index.vue'),
    meta: {
      title: '编辑集群角色绑定',
      permission: 'kubernetes:security:clusterrolebinding:edit',
      activeCode: 'kubernetes:security:clusterrolebinding',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/security/clusterrolebinding/detail',
    name: 'kubernetes:security:clusterrolebinding:detail',
    component: () => import('@/views/kubernetes/security/clusterrolebinding/detail/index.vue'),
    meta: {
      title: '集群角色绑定详情',
      permission: 'kubernetes:security:clusterrolebinding:view',
      activeCode: 'kubernetes:security:clusterrolebinding',
    },
  },
]

const roleBindingRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/security/rolebinding',
    name: 'kubernetes:security:rolebinding',
    component: () => import('@/views/kubernetes/security/rolebinding/index.vue'),
    meta: {
      title: '角色绑定',
      permission: 'kubernetes:security:rolebinding:view',
      activeCode: 'kubernetes:security:rolebinding',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/security/rolebinding/create',
    name: 'kubernetes:security:rolebinding:create',
    component: () => import('@/views/kubernetes/security/rolebinding/create/index.vue'),
    meta: {
      title: '创建角色绑定',
      permission: 'kubernetes:security:rolebinding:create',
      activeCode: 'kubernetes:security:rolebinding',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/security/rolebinding/edit',
    name: 'kubernetes:security:rolebinding:edit',
    component: () => import('@/views/kubernetes/security/rolebinding/edit/index.vue'),
    meta: {
      title: '编辑角色绑定',
      permission: 'kubernetes:security:rolebinding:edit',
      activeCode: 'kubernetes:security:rolebinding',
    },
  },
  {
    path: '/kubernetes/clusters/:clusterUid/security/rolebinding/detail',
    name: 'kubernetes:security:rolebinding:detail',
    component: () => import('@/views/kubernetes/security/rolebinding/detail/index.vue'),
    meta: {
      title: '角色绑定详情',
      permission: 'kubernetes:security:rolebinding:view',
      activeCode: 'kubernetes:security:rolebinding',
    },
  },
]

export const securityRoutes: RouteRecordRaw[] = [
  {
    path: '/kubernetes/clusters/:clusterUid/security',
    name: 'kubernetes:security',
    redirect: '/kubernetes/clusters/:clusterUid/security/serviceaccount',
    meta: {
      title: '安全',
    },
    children: [
      ...serviceAccountRoutes,
      ...clusteRoleRoutes,
      ...roleRoutes,
      ...clusteRoleBindingRoutes,
      ...roleBindingRoutes,
    ],
  },
]
