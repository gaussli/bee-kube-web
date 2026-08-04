/**
 * RoleBinding Mock API
 * @module mock/kubernetes/security/roleBinding
 */
import type { PageVo } from '@/types/common'
import type { RoleBindingResp, RoleBindingQueryReq, RoleBindingReq } from '@/types/kubernetes/security/roleBinding'

import { generateId } from '@/mock/utils'

/**
 * 获取 RoleBinding 分页列表
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页数据
 */
function getRoleBindingPage(
  clusterId: string,
  namespaceName: string,
  params: Partial<RoleBindingQueryReq>,
): PageVo<RoleBindingResp> {
  const { name, showSystem, page = 1, pageSize = 10 } = params || {}
  let filtered = mockRoleBindings.filter(b => b.clusterId === clusterId && b.namespace === namespaceName)
  if (!showSystem) filtered = filtered.filter(b => !b.isSystem)
  if (name) filtered = filtered.filter(b => b.name.toLowerCase().includes(name.toLowerCase()))
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)
  return { list, total, page, pageSize }
}

/**
 * 获取 RoleBinding 详情
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - RoleBinding 名称
 * @returns RoleBinding 详情
 */
function getRoleBindingDetail(clusterId: string, namespaceName: string, name: string): RoleBindingResp | null {
  return (
    mockRoleBindings.find(b => b.clusterId === clusterId && b.namespace === namespaceName && b.name === name) || null
  )
}

/**
 * 创建 RoleBinding
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 */
function createRoleBinding(clusterId: string, data: Partial<RoleBindingReq>): void {
  const created: RoleBindingResp = {
    id: generateId(),
    name: data.name || '',
    namespace: data.namespace || '',
    clusterId,
    clusterName: 'prod-cluster',
    isSystem: false,
    roleRef: { kind: data.roleKind || 'Role', name: data.roleName || '' },
    subjects: data.subjects || [],
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin',
  }
  mockRoleBindings.push(created)
}

/**
 * 更新 RoleBinding
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 */
function updateRoleBinding(clusterId: string, data: Partial<RoleBindingReq>): void {
  const index = mockRoleBindings.findIndex(
    b => b.clusterId === clusterId && b.namespace === data.namespace && b.name === data.name,
  )
  if (index === -1) {
    console.error('[Update RoleBinding] can not find rolebinding:', data.name)
    return
  }
  const updated = {
    ...mockRoleBindings[index],
    ...data,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString(),
  }
  mockRoleBindings[index] = updated
}

/**
 * 更新 RoleBinding 标签
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - RoleBinding 名称
 * @param labels - 标签键值对
 * @param operation - 操作类型
 */
function manageRoleBindingLabels(
  clusterId: string,
  namespaceName: string,
  name: string,
  labels: Record<string, string>,
  operation: number,
): void {
  const index = mockRoleBindings.findIndex(
    b => b.clusterId === clusterId && b.namespace === namespaceName && b.name === name,
  )
  if (index === -1) {
    console.error('[Update RoleBinding Labels] can not find rolebinding:', name)
    return
  }
  const currentLabels = mockRoleBindings[index].labels || {}
  if (operation === 1) {
    mockRoleBindings[index].labels = { ...currentLabels, ...labels }
  } else if (operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(labels).forEach(key => delete newLabels[key])
    mockRoleBindings[index].labels = newLabels
  } else if (operation === 3) {
    mockRoleBindings[index].labels = labels
  }
}

/**
 * 更新 RoleBinding 注解
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - RoleBinding 名称
 * @param annotations - 注解键值对
 * @param operation - 操作类型
 */
function manageRoleBindingAnnotations(
  clusterId: string,
  namespaceName: string,
  name: string,
  annotations: Record<string, string>,
  operation: number,
): void {
  const index = mockRoleBindings.findIndex(
    b => b.clusterId === clusterId && b.namespace === namespaceName && b.name === name,
  )
  if (index === -1) {
    console.error('[Update RoleBinding Annotations] can not find rolebinding:', name)
    return
  }
  const currentAnnotations = mockRoleBindings[index].annotations || {}
  if (operation === 1) {
    mockRoleBindings[index].annotations = { ...currentAnnotations, ...annotations }
  } else if (operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(annotations).forEach(key => delete newAnnotations[key])
    mockRoleBindings[index].annotations = newAnnotations
  } else if (operation === 3) {
    mockRoleBindings[index].annotations = annotations
  }
}

/**
 * 更新 RoleBinding 主体
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - RoleBinding 名称
 * @param subjects - 主体列表
 * @param operation - 操作类型
 */
function manageRoleBindingSubjects(
  clusterId: string,
  namespaceName: string,
  name: string,
  subjects: RoleBindingReq['subjects'],
  operation: number,
): void {
  const index = mockRoleBindings.findIndex(
    b => b.clusterId === clusterId && b.namespace === namespaceName && b.name === name,
  )
  if (index === -1) {
    console.error('[Update RoleBinding Subjects] can not find rolebinding:', name)
    return
  }
  if (operation === 1) {
    mockRoleBindings[index].subjects = [...mockRoleBindings[index].subjects, ...subjects]
  } else if (operation === 2) {
    mockRoleBindings[index].subjects = mockRoleBindings[index].subjects.filter(
      s => !subjects.some(ns => ns.name === s.name && ns.kind === s.kind),
    )
  } else if (operation === 3) {
    mockRoleBindings[index].subjects = subjects
  }
}

/**
 * 删除 RoleBinding
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - RoleBinding 名称
 */
function deleteRoleBinding(clusterId: string, namespaceName: string, name: string): void {
  const index = mockRoleBindings.findIndex(
    b => b.clusterId === clusterId && b.namespace === namespaceName && b.name === name,
  )
  if (index === -1) {
    console.error('[Delete RoleBinding] can not find rolebinding:', name)
    return
  }
  mockRoleBindings.splice(index, 1)
}

/**
 * 批量删除 RoleBinding
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param names - 待删除的 RoleBinding 名称列表
 */
function deleteRoleBindings(clusterId: string, namespaceName: string, names: string[]): void {
  names.forEach(name => {
    const index = mockRoleBindings.findIndex(
      b => b.clusterId === clusterId && b.namespace === namespaceName && b.name === name,
    )
    if (index === -1) {
      console.error('[Delete RoleBindings] can not find rolebinding:', name)
    } else {
      mockRoleBindings.splice(index, 1)
    }
  })
}

/**
 * RoleBinding 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings - 获取 RoleBinding 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings/:name - 获取 RoleBinding 详情
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings - 创建 RoleBinding
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings/:name - 更新 RoleBinding
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings/:name/annotations - 更新注解
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings/:name/subjects - 更新主体
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings/:name - 删除 RoleBinding
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings - 批量删除 RoleBinding
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings',
    handler: (pathParams: Record<string, string>, params: Partial<RoleBindingQueryReq>) =>
      getRoleBindingPage(pathParams.clusterId, pathParams.namespaceName, params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings/:name',
    handler: (pathParams: Record<string, string>) =>
      getRoleBindingDetail(pathParams.clusterId, pathParams.namespaceName, pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings',
    handler: (pathParams: Record<string, string>, _params: unknown, data: Partial<RoleBindingReq>) =>
      createRoleBinding(pathParams.clusterId, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings/:name',
    handler: (pathParams: Record<string, string>, _params: unknown, data: Partial<RoleBindingReq>) =>
      updateRoleBinding(pathParams.clusterId, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings/:name/labels',
    handler: (
      pathParams: Record<string, string>,
      _params: unknown,
      data: { labels: Record<string, string>; operation: number },
    ) =>
      manageRoleBindingLabels(
        pathParams.clusterId,
        pathParams.namespaceName,
        pathParams.name,
        data.labels,
        data.operation,
      ),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings/:name/annotations',
    handler: (
      pathParams: Record<string, string>,
      _params: unknown,
      data: { annotations: Record<string, string>; operation: number },
    ) =>
      manageRoleBindingAnnotations(
        pathParams.clusterId,
        pathParams.namespaceName,
        pathParams.name,
        data.annotations,
        data.operation,
      ),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings/:name/subjects',
    handler: (
      pathParams: Record<string, string>,
      _params: unknown,
      data: { subjects: RoleBindingReq['subjects']; operation: number },
    ) =>
      manageRoleBindingSubjects(
        pathParams.clusterId,
        pathParams.namespaceName,
        pathParams.name,
        data.subjects,
        data.operation,
      ),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings/:name',
    handler: (pathParams: Record<string, string>) =>
      deleteRoleBinding(pathParams.clusterId, pathParams.namespaceName, pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/rolebindings',
    handler: (pathParams: Record<string, string>, _params: unknown, data: string[]) =>
      deleteRoleBindings(pathParams.clusterId, pathParams.namespaceName, data),
  },
]

/**
 * RoleBinding Mock 数据
 */
const mockRoleBindings: RoleBindingResp[] = [
  {
    id: generateId(),
    name: 'admin',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    roleRef: { kind: 'ClusterRole', name: 'admin' },
    subjects: [{ kind: 'User', name: 'admin', apiGroup: 'rbac.authorization.k8s.io' }],
    creationTimestamp: '2024-01-01T00:00:00Z',
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    annotations: { 'rbac.authorization.kubernetes.io/autoupdate': 'true' },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    name: 'edit',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    roleRef: { kind: 'ClusterRole', name: 'edit' },
    subjects: [{ kind: 'Group', name: 'system:authenticated', apiGroup: 'rbac.authorization.k8s.io' }],
    creationTimestamp: '2024-01-01T00:00:00Z',
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    annotations: { 'rbac.authorization.kubernetes.io/autoupdate': 'true' },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    name: 'developer-binding',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    roleRef: { kind: 'Role', name: 'namespace-developer' },
    subjects: [{ kind: 'User', name: 'developer@example.com', apiGroup: 'rbac.authorization.k8s.io' }],
    creationTimestamp: '2024-03-10T10:00:00Z',
    labels: { 'app.kubernetes.io/name': 'developer-binding' },
    deletable: true,
    createAt: '2024-03-10T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T10:00:00Z',
    updateBy: 'admin',
  },
]
