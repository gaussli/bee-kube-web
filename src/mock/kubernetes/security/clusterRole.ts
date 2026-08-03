/**
 * ClusterRole Mock API
 * @module mock/kubernetes/security/clusterRole
 */
import type { PageVo } from '@/types/common'
import type { ClusterRoleResp, ClusterRoleQueryReq, ClusterRoleReq } from '@/types/kubernetes/security/clusterRole'
import { generateId } from '@/mock/utils'

/**
 * 获取 ClusterRole 分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns 分页数据
 */
function getClusterRolePage(clusterId: string, params: Partial<ClusterRoleQueryReq>): PageVo<ClusterRoleResp> {
  const { name, showSystem, page = 1, pageSize = 10 } = params || {}
  let filtered = mockClusterRoles.filter(c => c.clusterId === clusterId)
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
 * @param clusterId - 集群 ID
 * @param name - ClusterRole 名称
 * @returns ClusterRole 详情
 */
function getClusterRoleDetail(clusterId: string, name: string): ClusterRoleResp | null {
  return mockClusterRoles.find(c => c.clusterId === clusterId && c.name === name) || null
}

/**
 * 创建 ClusterRole
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 */
function createClusterRole(clusterId: string, data: Partial<ClusterRoleReq>): void {
  const created: ClusterRoleResp = {
    id: generateId(),
    name: data.name || '',
    clusterId,
    clusterName: 'prod-cluster',
    isSystem: false,
    aggregationRule: data.aggregationRule,
    rules: data.rules || [],
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockClusterRoles.push(created)
}

/**
 * 更新 ClusterRole
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 */
function updateClusterRole(clusterId: string, data: Partial<ClusterRoleReq>): void {
  const index = mockClusterRoles.findIndex(c => c.clusterId === clusterId && c.name === data.name)
  if (index === -1) {
    console.error('[Update ClusterRole] can not find clusterrole:', data.name)
    return
  }
  const updated = {
    ...mockClusterRoles[index],
    ...data,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
  mockClusterRoles[index] = updated
}

/**
 * 更新 ClusterRole 标签
 * @param clusterId - 集群 ID
 * @param name - ClusterRole 名称
 * @param labels - 标签键值对
 * @param operation - 操作类型
 */
function manageClusterRoleLabels(
  clusterId: string,
  name: string,
  labels: Record<string, string>,
  operation: number
): void {
  const index = mockClusterRoles.findIndex(c => c.clusterId === clusterId && c.name === name)
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
 * @param clusterId - 集群 ID
 * @param name - ClusterRole 名称
 * @param annotations - 注解键值对
 * @param operation - 操作类型
 */
function manageClusterRoleAnnotations(
  clusterId: string,
  name: string,
  annotations: Record<string, string>,
  operation: number
): void {
  const index = mockClusterRoles.findIndex(c => c.clusterId === clusterId && c.name === name)
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
 * @param clusterId - 集群 ID
 * @param name - ClusterRole 名称
 * @param rules - 策略规则列表
 */
function updateClusterRoleRules(clusterId: string, name: string, rules: ClusterRoleReq['rules']): void {
  const index = mockClusterRoles.findIndex(c => c.clusterId === clusterId && c.name === name)
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
 * @param clusterId - 集群 ID
 * @param name - ClusterRole 名称
 */
function deleteClusterRole(clusterId: string, name: string): void {
  const index = mockClusterRoles.findIndex(c => c.clusterId === clusterId && c.name === name)
  if (index === -1) {
    console.error('[Delete ClusterRole] can not find clusterrole:', name)
    return
  }
  mockClusterRoles.splice(index, 1)
}

/**
 * 批量删除 ClusterRole
 * @param clusterId - 集群 ID
 * @param names - 待删除的 ClusterRole 名称列表
 */
function deleteClusterRoles(clusterId: string, names: string[]): void {
  names.forEach(name => {
    const index = mockClusterRoles.findIndex(c => c.clusterId === clusterId && c.name === name)
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
 * - GET /kubernetes/clusters/:clusterId/clusterroles - 获取 ClusterRole 分页列表
 * - GET /kubernetes/clusters/:clusterId/clusterroles/:name - 获取 ClusterRole 详情
 * - POST /kubernetes/clusters/:clusterId/clusterroles - 创建 ClusterRole
 * - PUT /kubernetes/clusters/:clusterId/clusterroles/:name - 更新 ClusterRole
 * - PUT /kubernetes/clusters/:clusterId/clusterroles/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterId/clusterroles/:name/annotations - 更新注解
 * - PUT /kubernetes/clusters/:clusterId/clusterroles/:name/rules - 更新规则
 * - DELETE /kubernetes/clusters/:clusterId/clusterroles/:name - 删除 ClusterRole
 * - DELETE /kubernetes/clusters/:clusterId/clusterroles - 批量删除 ClusterRole
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/clusterroles',
    handler: (pathParams: Record<string, string>, params: Partial<ClusterRoleQueryReq>) =>
      getClusterRolePage(pathParams.clusterId, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/clusterroles/:name',
    handler: (pathParams: Record<string, string>) => getClusterRoleDetail(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/clusterroles',
    handler: (pathParams: Record<string, string>, _params: unknown, data: Partial<ClusterRoleReq>) =>
      createClusterRole(pathParams.clusterId, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/clusterroles/:name',
    handler: (pathParams: Record<string, string>, _params: unknown, data: Partial<ClusterRoleReq>) =>
      updateClusterRole(pathParams.clusterId, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/clusterroles/:name/labels',
    handler: (
      pathParams: Record<string, string>,
      _params: unknown,
      data: { labels: Record<string, string>; operation: number }
    ) => manageClusterRoleLabels(pathParams.clusterId, pathParams.name, data.labels, data.operation)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/clusterroles/:name/annotations',
    handler: (
      pathParams: Record<string, string>,
      _params: unknown,
      data: { annotations: Record<string, string>; operation: number }
    ) => manageClusterRoleAnnotations(pathParams.clusterId, pathParams.name, data.annotations, data.operation)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/clusterroles/:name/rules',
    handler: (pathParams: Record<string, string>, _params: unknown, data: { rules: ClusterRoleReq['rules'] }) =>
      updateClusterRoleRules(pathParams.clusterId, pathParams.name, data.rules)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/clusterroles/:name',
    handler: (pathParams: Record<string, string>) => deleteClusterRole(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/clusterroles',
    handler: (pathParams: Record<string, string>, _params: unknown, data: string[]) =>
      deleteClusterRoles(pathParams.clusterId, data)
  }
]

/**
 * ClusterRole Mock 数据
 */
const mockClusterRoles: ClusterRoleResp[] = [
  {
    id: generateId(),
    name: 'admin',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    rules: [{ apiGroups: ['*'], resources: ['*'], verbs: ['*'] }],
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    annotations: {
      'rbac.authorization.kubernetes.io/autoupdate': 'true',
      'description': 'Provides full access to most resources'
    },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'view',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    rules: [
      { apiGroups: [''], resources: ['pods', 'services', 'configmaps', 'secrets'], verbs: ['get', 'list', 'watch'] }
    ],
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    annotations: {
      'rbac.authorization.kubernetes.io/autoupdate': 'true',
      'description': 'Allows read-only access to most resources'
    },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'cluster-admin',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    rules: [
      { apiGroups: ['*'], resources: ['*'], verbs: ['*'] },
      { nonResourceURLs: ['*'], verbs: ['*'] }
    ],
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    annotations: {
      'rbac.authorization.kubernetes.io/autoupdate': 'true',
      'description': 'Super-user access to all resources'
    },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'developer',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    rules: [
      {
        apiGroups: [''],
        resources: ['pods', 'services', 'configmaps', 'secrets', 'endpoints'],
        verbs: ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete']
      },
      {
        apiGroups: ['apps'],
        resources: ['deployments', 'statefulsets'],
        verbs: ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete']
      }
    ],
    labels: { 'app.kubernetes.io/name': 'developer-role' },
    deletable: true,
    createAt: '2024-03-15T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T10:00:00Z',
    updateBy: 'admin'
  }
]
