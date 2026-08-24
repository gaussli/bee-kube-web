/**
 * ClusterRole Mock API
 * @module mock/kubernetes/security/clusterRole
 */
import type { PageVo } from '@/types/common'
import type { ClusterRoleResp, ClusterRoleQueryReq, ClusterRoleReq } from '@/types/kubernetes/security/clusterRole'

import { generateId } from '@/mock/utils'

/**
 * 获取 ClusterRole 分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 分页数据
 */
function getClusterRolePage(clusterUid: string, params: Partial<ClusterRoleQueryReq>): PageVo<ClusterRoleResp> {
  const { name, showSystem, page = 1, pageSize = 10 } = params || {}
  let filtered = mockClusterRoles.filter(c => c.clusterUid === clusterUid)
  if (!showSystem) filtered = filtered.filter(c => !c.isSystem)
  if (name) filtered = filtered.filter(c => c.name.toLowerCase().includes(name.toLowerCase()))
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)
  return { list, total, page, pageSize }
}

/**
 * 获取 ClusterRole 详情
 * @param clusterUid - 集群 UID
 * @param name - ClusterRole 名称
 * @returns ClusterRole 详情
 */
function getClusterRoleDetail(clusterUid: string, name: string): ClusterRoleResp | null {
  return mockClusterRoles.find(c => c.clusterUid === clusterUid && c.name === name) || null
}

/**
 * 创建 ClusterRole
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 */
function createClusterRole(clusterUid: string, data: Partial<ClusterRoleReq>): void {
  const created: ClusterRoleResp = {
    id: generateId(),
    name: data.name || '',
    clusterUid,
    clusterName: 'prod-cluster',
    isSystem: false,
    aggregationRule: data.aggregationRule,
    rules: data.rules || [],
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin',
  }
  mockClusterRoles.push(created)
}

/**
 * 更新 ClusterRole
 * @param clusterUid - 集群 UID
 * @param data - 更新参数
 */
function updateClusterRole(clusterUid: string, data: Partial<ClusterRoleReq>): void {
  const index = mockClusterRoles.findIndex(c => c.clusterUid === clusterUid && c.name === data.name)
  if (index === -1) {
    console.error('[Update ClusterRole] can not find clusterrole:', data.name)
    return
  }
  const updated = {
    ...mockClusterRoles[index],
    ...data,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString(),
  }
  mockClusterRoles[index] = updated
}

/**
 * 更新 ClusterRole 标签
 * @param clusterUid - 集群 UID
 * @param name - ClusterRole 名称
 * @param labels - 标签键值对
 * @param operation - 操作类型
 */
function manageClusterRoleLabels(
  clusterUid: string,
  name: string,
  labels: Record<string, string>,
  operation: number,
): void {
  const index = mockClusterRoles.findIndex(c => c.clusterUid === clusterUid && c.name === name)
  if (index === -1) {
    console.error('[Update ClusterRole Labels] can not find clusterrole:', name)
    return
  }
  const currentLabels = mockClusterRoles[index].labels || {}
  if (operation === 1) {
    mockClusterRoles[index].labels = { ...currentLabels, ...labels }
  } else if (operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(labels).forEach(key => delete newLabels[key])
    mockClusterRoles[index].labels = newLabels
  } else if (operation === 3) {
    mockClusterRoles[index].labels = labels
  }
}

/**
 * 更新 ClusterRole 注解
 * @param clusterUid - 集群 UID
 * @param name - ClusterRole 名称
 * @param annotations - 注解键值对
 * @param operation - 操作类型
 */
function manageClusterRoleAnnotations(
  clusterUid: string,
  name: string,
  annotations: Record<string, string>,
  operation: number,
): void {
  const index = mockClusterRoles.findIndex(c => c.clusterUid === clusterUid && c.name === name)
  if (index === -1) {
    console.error('[Update ClusterRole Annotations] can not find clusterrole:', name)
    return
  }
  const currentAnnotations = mockClusterRoles[index].annotations || {}
  if (operation === 1) {
    mockClusterRoles[index].annotations = { ...currentAnnotations, ...annotations }
  } else if (operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(annotations).forEach(key => delete newAnnotations[key])
    mockClusterRoles[index].annotations = newAnnotations
  } else if (operation === 3) {
    mockClusterRoles[index].annotations = annotations
  }
}

/**
 * 更新 ClusterRole 规则
 * @param clusterUid - 集群 UID
 * @param name - ClusterRole 名称
 * @param rules - 策略规则列表
 */
function updateClusterRoleRules(clusterUid: string, name: string, rules: ClusterRoleReq['rules']): void {
  const index = mockClusterRoles.findIndex(c => c.clusterUid === clusterUid && c.name === name)
  if (index === -1) {
    console.error('[Update ClusterRole Rules] can not find clusterrole:', name)
    return
  }
  mockClusterRoles[index].rules = rules
  mockClusterRoles[index].updateAt = new Date().toLocaleString()
  mockClusterRoles[index].updateBy = 'admin'
}

/**
 * 删除 ClusterRole
 * @param clusterUid - 集群 UID
 * @param name - ClusterRole 名称
 */
function deleteClusterRole(clusterUid: string, name: string): void {
  const index = mockClusterRoles.findIndex(c => c.clusterUid === clusterUid && c.name === name)
  if (index === -1) {
    console.error('[Delete ClusterRole] can not find clusterrole:', name)
    return
  }
  mockClusterRoles.splice(index, 1)
}

/**
 * 批量删除 ClusterRole
 * @param clusterUid - 集群 UID
 * @param names - 待删除的 ClusterRole 名称列表
 */
function deleteClusterRoles(clusterUid: string, names: string[]): void {
  names.forEach(name => {
    const index = mockClusterRoles.findIndex(c => c.clusterUid === clusterUid && c.name === name)
    if (index === -1) {
      console.error('[Delete ClusterRoles] can not find clusterrole:', name)
    } else {
      mockClusterRoles.splice(index, 1)
    }
  })
}

/**
 * ClusterRole 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterUid/clusterroles - 获取 ClusterRole 分页列表
 * - GET /kubernetes/clusters/:clusterUid/clusterroles/:name - 获取 ClusterRole 详情
 * - POST /kubernetes/clusters/:clusterUid/clusterroles - 创建 ClusterRole
 * - PUT /kubernetes/clusters/:clusterUid/clusterroles/:name - 更新 ClusterRole
 * - PUT /kubernetes/clusters/:clusterUid/clusterroles/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterUid/clusterroles/:name/annotations - 更新注解
 * - PUT /kubernetes/clusters/:clusterUid/clusterroles/:name/rules - 更新规则
 * - DELETE /kubernetes/clusters/:clusterUid/clusterroles/:name - 删除 ClusterRole
 * - DELETE /kubernetes/clusters/:clusterUid/clusterroles - 批量删除 ClusterRole
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterroles',
    handler: ({ pathParams, params }: { pathParams: Record<string, string>; params: Partial<ClusterRoleQueryReq> }) =>
      getClusterRolePage(pathParams.clusterUid, params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }) =>
      getClusterRoleDetail(pathParams.clusterUid, pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterroles',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<ClusterRoleReq> }) =>
      createClusterRole(pathParams.clusterUid, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<ClusterRoleReq> }) =>
      updateClusterRole(pathParams.clusterUid, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name/labels',
    handler: ({
      pathParams,
      data,
    }: {
      pathParams: Record<string, string>
      data: { labels: Record<string, string>; operation: number }
    }) => manageClusterRoleLabels(pathParams.clusterUid, pathParams.name, data.labels, data.operation),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name/annotations',
    handler: ({
      pathParams,
      data,
    }: {
      pathParams: Record<string, string>
      data: { annotations: Record<string, string>; operation: number }
    }) => manageClusterRoleAnnotations(pathParams.clusterUid, pathParams.name, data.annotations, data.operation),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name/rules',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: { rules: ClusterRoleReq['rules'] } }) =>
      updateClusterRoleRules(pathParams.clusterUid, pathParams.name, data.rules),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/clusterroles/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }) =>
      deleteClusterRole(pathParams.clusterUid, pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/clusterroles',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: string[] }) =>
      deleteClusterRoles(pathParams.clusterUid, data),
  },
]

/**
 * ClusterRole Mock 数据
 */
const mockClusterRoles: ClusterRoleResp[] = [
  {
    id: generateId(),
    name: 'admin',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    rules: [{ apiGroups: ['*'], resources: ['*'], verbs: ['*'] }],
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    annotations: {
      'rbac.authorization.kubernetes.io/autoupdate': 'true',
      'description': 'Provides full access to most resources',
    },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    name: 'view',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    rules: [
      { apiGroups: [''], resources: ['pods', 'services', 'configmaps', 'secrets'], verbs: ['get', 'list', 'watch'] },
    ],
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    annotations: {
      'rbac.authorization.kubernetes.io/autoupdate': 'true',
      'description': 'Allows read-only access to most resources',
    },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    name: 'cluster-admin',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    rules: [
      { apiGroups: ['*'], resources: ['*'], verbs: ['*'] },
      { nonResourceURLs: ['*'], verbs: ['*'] },
    ],
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    annotations: {
      'rbac.authorization.kubernetes.io/autoupdate': 'true',
      'description': 'Super-user access to all resources',
    },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    name: 'developer',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    rules: [
      {
        apiGroups: [''],
        resources: ['pods', 'services', 'configmaps', 'secrets', 'endpoints'],
        verbs: ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete'],
      },
      {
        apiGroups: ['apps'],
        resources: ['deployments', 'statefulsets'],
        verbs: ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete'],
      },
    ],
    labels: { 'app.kubernetes.io/name': 'developer-role' },
    deletable: true,
    createAt: '2024-03-15T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T10:00:00Z',
    updateBy: 'admin',
  },
]
