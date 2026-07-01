/**
 * Role Mock API
 * @module mock/kubernetes/security/role
 */
import type { PageVo } from '@/types/common'
import type { RoleResp, RoleQueryReq, RoleReq } from '@/types/kubernetes/security/role'
import { generateId } from '@/mock/utils'

/**
 * 获取 Role 分页列表
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页数据
 */
function getRolePage(clusterId: string, namespaceName: string, params: Partial<RoleQueryReq>): PageVo<RoleResp> {
  const { name, showSystem, page = 1, pageSize = 10 } = params || {}
  let filtered = mockRoles.filter(r => r.clusterId === clusterId && r.namespace === namespaceName)
  if (!showSystem) filtered = filtered.filter(r => !r.isSystem)
  if (name) filtered = filtered.filter(r => r.name.toLowerCase().includes(name.toLowerCase()))
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)
  return { list, total, page, pageSize }
}

/**
 * 获取 Role 详情
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Role 名称
 * @returns Role 详情
 */
function getRoleDetail(clusterId: string, namespaceName: string, name: string): RoleResp | null {
  return mockRoles.find(r => r.clusterId === clusterId && r.namespace === namespaceName && r.name === name) || null
}

/**
 * 创建 Role
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 */
function createRole(clusterId: string, data: Partial<RoleReq>): void {
  const created: RoleResp = {
    id: generateId(),
    name: data.name || '',
    namespace: data.namespace || '',
    clusterId,
    clusterName: 'prod-cluster',
    isSystem: false,
    rules: data.rules || [],
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockRoles.push(created)
}

/**
 * 更新 Role
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 */
function updateRole(clusterId: string, data: Partial<RoleReq>): void {
  const index = mockRoles.findIndex(r => r.clusterId === clusterId && r.namespace === data.namespace && r.name === data.name)
  if (index === -1) {
    console.error('[Update Role] can not find role:', data.name)
    return
  }
  const updated = {
    ...mockRoles[index],
    ...data,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
  mockRoles[index] = updated
}

/**
 * 更新 Role 标签
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Role 名称
 * @param labels - 标签键值对
 * @param operation - 操作类型
 */
function manageRoleLabels(clusterId: string, namespaceName: string, name: string, labels: Record<string, string>, operation: number): void {
  const index = mockRoles.findIndex(r => r.clusterId === clusterId && r.namespace === namespaceName && r.name === name)
  if (index === -1) {
    console.error('[Update Role Labels] can not find role:', name)
    return
  }
  const currentLabels = mockRoles[index].labels || {}
  if (operation === 1) {
    mockRoles[index].labels = { ...currentLabels, ...labels }
  } else if (operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(labels).forEach(key => delete newLabels[key])
    mockRoles[index].labels = newLabels
  } else if (operation === 3) {
    mockRoles[index].labels = labels
  }
}

/**
 * 更新 Role 注解
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Role 名称
 * @param annotations - 注解键值对
 * @param operation - 操作类型
 */
function manageRoleAnnotations(clusterId: string, namespaceName: string, name: string, annotations: Record<string, string>, operation: number): void {
  const index = mockRoles.findIndex(r => r.clusterId === clusterId && r.namespace === namespaceName && r.name === name)
  if (index === -1) {
    console.error('[Update Role Annotations] can not find role:', name)
    return
  }
  const currentAnnotations = mockRoles[index].annotations || {}
  if (operation === 1) {
    mockRoles[index].annotations = { ...currentAnnotations, ...annotations }
  } else if (operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(annotations).forEach(key => delete newAnnotations[key])
    mockRoles[index].annotations = newAnnotations
  } else if (operation === 3) {
    mockRoles[index].annotations = annotations
  }
}

/**
 * 更新 Role 规则
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Role 名称
 * @param rules - 策略规则列表
 */
function updateRoleRules(clusterId: string, namespaceName: string, name: string, rules: RoleReq['rules']): void {
  const index = mockRoles.findIndex(r => r.clusterId === clusterId && r.namespace === namespaceName && r.name === name)
  if (index === -1) {
    console.error('[Update Role Rules] can not find role:', name)
    return
  }
  mockRoles[index].rules = rules
  mockRoles[index].updateAt = new Date().toLocaleString()
  mockRoles[index].updateBy = 'admin'
}

/**
 * 删除 Role
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Role 名称
 */
function deleteRole(clusterId: string, namespaceName: string, name: string): void {
  const index = mockRoles.findIndex(r => r.clusterId === clusterId && r.namespace === namespaceName && r.name === name)
  if (index === -1) {
    console.error('[Delete Role] can not find role:', name)
    return
  }
  mockRoles.splice(index, 1)
}

/**
 * 批量删除 Role
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param names - 待删除的 Role 名称列表
 */
function deleteRoles(clusterId: string, namespaceName: string, names: string[]): void {
  names.forEach(name => {
    const index = mockRoles.findIndex(r => r.clusterId === clusterId && r.namespace === namespaceName && r.name === name)
    if (index === -1) {
      console.error('[Delete Roles] can not find role:', name)
    } else {
      mockRoles.splice(index, 1)
    }
  })
}

/**
 * Role 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles - 获取 Role 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles/:name - 获取 Role 详情
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles - 创建 Role
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles/:name - 更新 Role
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles/:name/annotations - 更新注解
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles/:name/rules - 更新规则
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles/:name - 删除 Role
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles - 批量删除 Role
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles',
    handler: (pathParams: Record<string, string>, params: Partial<RoleQueryReq>) => getRolePage(pathParams.clusterId, pathParams.namespaceName, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles/:name',
    handler: (pathParams: Record<string, string>) => getRoleDetail(pathParams.clusterId, pathParams.namespaceName, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles',
    handler: (pathParams: Record<string, string>, _params: unknown, data: Partial<RoleReq>) => createRole(pathParams.clusterId, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles/:name',
    handler: (pathParams: Record<string, string>, _params: unknown, data: Partial<RoleReq>) => updateRole(pathParams.clusterId, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles/:name/labels',
    handler: (pathParams: Record<string, string>, _params: unknown, data: { labels: Record<string, string>; operation: number }) =>
      manageRoleLabels(pathParams.clusterId, pathParams.namespaceName, pathParams.name, data.labels, data.operation)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles/:name/annotations',
    handler: (pathParams: Record<string, string>, _params: unknown, data: { annotations: Record<string, string>; operation: number }) =>
      manageRoleAnnotations(pathParams.clusterId, pathParams.namespaceName, pathParams.name, data.annotations, data.operation)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles/:name/rules',
    handler: (pathParams: Record<string, string>, _params: unknown, data: { rules: RoleReq['rules'] }) => updateRoleRules(pathParams.clusterId, pathParams.namespaceName, pathParams.name, data.rules)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles/:name',
    handler: (pathParams: Record<string, string>) => deleteRole(pathParams.clusterId, pathParams.namespaceName, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/roles',
    handler: (pathParams: Record<string, string>, _params: unknown, data: string[]) => deleteRoles(pathParams.clusterId, pathParams.namespaceName, data)
  }
]

/**
 * Role Mock 数据
 */
const mockRoles: RoleResp[] = [
  {
    id: generateId(),
    name: 'system:controller:endpoint-controller',
    namespace: 'kube-system',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    rules: [{ apiGroups: [''], resources: ['endpoints'], verbs: ['get', 'list', 'watch', 'create', 'update', 'patch'] }],
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    annotations: { 'rbac.authorization.kubernetes.io/autoupdate': 'true' },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'developer-role',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    rules: [
      { apiGroups: ['apps'], resources: ['deployments', 'statefulsets'], verbs: ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete'] },
      { apiGroups: [''], resources: ['services', 'configmaps', 'secrets'], verbs: ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete'] }
    ],
    labels: { 'app.kubernetes.io/name': 'developer-role' },
    deletable: true,
    createAt: '2024-03-10T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T09:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'readonly-role',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    rules: [
      { apiGroups: ['apps'], resources: ['deployments'], verbs: ['get', 'list', 'watch'] },
      { apiGroups: [''], resources: ['services', 'configmaps'], verbs: ['get', 'list', 'watch'] }
    ],
    labels: { 'app.kubernetes.io/name': 'readonly-role' },
    annotations: { description: 'Read-only access within namespace' },
    deletable: true,
    createAt: '2024-03-15T11:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T11:00:00Z',
    updateBy: 'admin'
  }
]
