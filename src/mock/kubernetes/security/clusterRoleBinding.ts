/**
 * ClusterRoleBinding Mock API
 * @module mock/kubernetes/security/clusterRoleBinding
 */
import type { PageVo } from '@/types/common'
import type { ClusterRoleBindingResp, ClusterRoleBindingQueryReq, ClusterRoleBindingReq } from '@/types/kubernetes/security/clusterRoleBinding'
import { generateId } from '@/mock/utils'

/**
 * 获取 ClusterRoleBinding 分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns 分页数据
 */
function getClusterRoleBindingPage(clusterId: string, params: Partial<ClusterRoleBindingQueryReq>): PageVo<ClusterRoleBindingResp> {
  const { name, showSystem, page = 1, pageSize = 10 } = params || {}
  let filtered = mockClusterRoleBindings.filter(b => b.clusterId === clusterId)
  if (!showSystem) filtered = filtered.filter(b => !b.isSystem)
  if (name) filtered = filtered.filter(b => b.name.toLowerCase().includes(name.toLowerCase()))
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)
  return { list, total, page, pageSize }
}

/**
 * 获取 ClusterRoleBinding 详情
 * @param clusterId - 集群 ID
 * @param name - ClusterRoleBinding 名称
 * @returns ClusterRoleBinding 详情
 */
function getClusterRoleBindingDetail(clusterId: string, name: string): ClusterRoleBindingResp | null {
  return mockClusterRoleBindings.find(b => b.clusterId === clusterId && b.name === name) || null
}

/**
 * 创建 ClusterRoleBinding
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 */
function createClusterRoleBinding(clusterId: string, data: Partial<ClusterRoleBindingReq>): void {
  const created: ClusterRoleBindingResp = {
    id: generateId(),
    name: data.name || '',
    clusterId,
    clusterName: 'prod-cluster',
    isSystem: false,
    roleRef: { kind: 'ClusterRole', name: data.clusterRoleName || '' },
    subjects: data.subjects || [],
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockClusterRoleBindings.push(created)
}

/**
 * 更新 ClusterRoleBinding
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 */
function updateClusterRoleBinding(clusterId: string, data: Partial<ClusterRoleBindingReq>): void {
  const index = mockClusterRoleBindings.findIndex(b => b.clusterId === clusterId && b.name === data.name)
  if (index === -1) {
    console.error('[Update ClusterRoleBinding] can not find clusterrolebinding:', data.name)
    return
  }
  const updated = {
    ...mockClusterRoleBindings[index],
    ...data,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
  mockClusterRoleBindings[index] = updated
}

/**
 * 更新 ClusterRoleBinding 标签
 * @param clusterId - 集群 ID
 * @param name - ClusterRoleBinding 名称
 * @param labels - 标签键值对
 * @param operation - 操作类型
 */
function manageClusterRoleBindingLabels(clusterId: string, name: string, labels: Record<string, string>, operation: number): void {
  const index = mockClusterRoleBindings.findIndex(b => b.clusterId === clusterId && b.name === name)
  if (index === -1) {
    console.error('[Update ClusterRoleBinding Labels] can not find clusterrolebinding:', name)
    return
  }
  const currentLabels = mockClusterRoleBindings[index].labels || {}
  if (operation === 1) {
    mockClusterRoleBindings[index].labels = { ...currentLabels, ...labels }
  } else if (operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(labels).forEach(key => delete newLabels[key])
    mockClusterRoleBindings[index].labels = newLabels
  } else if (operation === 3) {
    mockClusterRoleBindings[index].labels = labels
  }
}

/**
 * 更新 ClusterRoleBinding 注解
 * @param clusterId - 集群 ID
 * @param name - ClusterRoleBinding 名称
 * @param annotations - 注解键值对
 * @param operation - 操作类型
 */
function manageClusterRoleBindingAnnotations(clusterId: string, name: string, annotations: Record<string, string>, operation: number): void {
  const index = mockClusterRoleBindings.findIndex(b => b.clusterId === clusterId && b.name === name)
  if (index === -1) {
    console.error('[Update ClusterRoleBinding Annotations] can not find clusterrolebinding:', name)
    return
  }
  const currentAnnotations = mockClusterRoleBindings[index].annotations || {}
  if (operation === 1) {
    mockClusterRoleBindings[index].annotations = { ...currentAnnotations, ...annotations }
  } else if (operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(annotations).forEach(key => delete newAnnotations[key])
    mockClusterRoleBindings[index].annotations = newAnnotations
  } else if (operation === 3) {
    mockClusterRoleBindings[index].annotations = annotations
  }
}

/**
 * 更新 ClusterRoleBinding 主体
 * @param clusterId - 集群 ID
 * @param name - ClusterRoleBinding 名称
 * @param subjects - 主体列表
 * @param operation - 操作类型
 */
function manageClusterRoleBindingSubjects(clusterId: string, name: string, subjects: ClusterRoleBindingReq['subjects'], operation: number): void {
  const index = mockClusterRoleBindings.findIndex(b => b.clusterId === clusterId && b.name === name)
  if (index === -1) {
    console.error('[Update ClusterRoleBinding Subjects] can not find clusterrolebinding:', name)
    return
  }
  if (operation === 1) {
    mockClusterRoleBindings[index].subjects = [...mockClusterRoleBindings[index].subjects, ...subjects]
  } else if (operation === 2) {
    mockClusterRoleBindings[index].subjects = mockClusterRoleBindings[index].subjects.filter(s => !subjects.some(ns => ns.name === s.name && ns.kind === s.kind))
  } else if (operation === 3) {
    mockClusterRoleBindings[index].subjects = subjects
  }
}

/**
 * 删除 ClusterRoleBinding
 * @param clusterId - 集群 ID
 * @param name - ClusterRoleBinding 名称
 */
function deleteClusterRoleBinding(clusterId: string, name: string): void {
  const index = mockClusterRoleBindings.findIndex(b => b.clusterId === clusterId && b.name === name)
  if (index === -1) {
    console.error('[Delete ClusterRoleBinding] can not find clusterrolebinding:', name)
    return
  }
  mockClusterRoleBindings.splice(index, 1)
}

/**
 * 批量删除 ClusterRoleBinding
 * @param clusterId - 集群 ID
 * @param names - 待删除的 ClusterRoleBinding 名称列表
 */
function deleteClusterRoleBindings(clusterId: string, names: string[]): void {
  names.forEach(name => {
    const index = mockClusterRoleBindings.findIndex(b => b.clusterId === clusterId && b.name === name)
    if (index === -1) {
      console.error('[Delete ClusterRoleBindings] can not find clusterrolebinding:', name)
    } else {
      mockClusterRoleBindings.splice(index, 1)
    }
  })
}

/**
 * ClusterRoleBinding 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/clusterrolebindings - 获取 ClusterRoleBinding 分页列表
 * - GET /kubernetes/clusters/:clusterId/clusterrolebindings/:name - 获取 ClusterRoleBinding 详情
 * - POST /kubernetes/clusters/:clusterId/clusterrolebindings - 创建 ClusterRoleBinding
 * - PUT /kubernetes/clusters/:clusterId/clusterrolebindings/:name - 更新 ClusterRoleBinding
 * - PUT /kubernetes/clusters/:clusterId/clusterrolebindings/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterId/clusterrolebindings/:name/annotations - 更新注解
 * - PUT /kubernetes/clusters/:clusterId/clusterrolebindings/:name/subjects - 更新主体
 * - DELETE /kubernetes/clusters/:clusterId/clusterrolebindings/:name - 删除 ClusterRoleBinding
 * - DELETE /kubernetes/clusters/:clusterId/clusterrolebindings - 批量删除 ClusterRoleBinding
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/clusterrolebindings',
    handler: (pathParams: Record<string, string>, params: Partial<ClusterRoleBindingQueryReq>) => getClusterRoleBindingPage(pathParams.clusterId, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/clusterrolebindings/:name',
    handler: (pathParams: Record<string, string>) => getClusterRoleBindingDetail(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/clusterrolebindings',
    handler: (pathParams: Record<string, string>, _params: unknown, data: Partial<ClusterRoleBindingReq>) => createClusterRoleBinding(pathParams.clusterId, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/clusterrolebindings/:name',
    handler: (pathParams: Record<string, string>, _params: unknown, data: Partial<ClusterRoleBindingReq>) => updateClusterRoleBinding(pathParams.clusterId, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/clusterrolebindings/:name/labels',
    handler: (pathParams: Record<string, string>, _params: unknown, data: { labels: Record<string, string>; operation: number }) =>
      manageClusterRoleBindingLabels(pathParams.clusterId, pathParams.name, data.labels, data.operation)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/clusterrolebindings/:name/annotations',
    handler: (pathParams: Record<string, string>, _params: unknown, data: { annotations: Record<string, string>; operation: number }) =>
      manageClusterRoleBindingAnnotations(pathParams.clusterId, pathParams.name, data.annotations, data.operation)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/clusterrolebindings/:name/subjects',
    handler: (pathParams: Record<string, string>, _params: unknown, data: { subjects: ClusterRoleBindingReq['subjects']; operation: number }) =>
      manageClusterRoleBindingSubjects(pathParams.clusterId, pathParams.name, data.subjects, data.operation)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/clusterrolebindings/:name',
    handler: (pathParams: Record<string, string>) => deleteClusterRoleBinding(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/clusterrolebindings',
    handler: (pathParams: Record<string, string>, _params: unknown, data: string[]) => deleteClusterRoleBindings(pathParams.clusterId, data)
  }
]

/**
 * ClusterRoleBinding Mock 数据
 */
const mockClusterRoleBindings: ClusterRoleBindingResp[] = [
  {
    id: generateId(),
    name: 'cluster-admin',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    roleRef: { kind: 'ClusterRole', name: 'cluster-admin' },
    subjects: [{ kind: 'User', name: 'admin', apiGroup: 'rbac.authorization.k8s.io' }],
    creationTimestamp: '2024-01-01T00:00:00Z',
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
    name: 'system:node-bootstrap',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    roleRef: { kind: 'ClusterRole', name: 'system:node-bootstrap' },
    subjects: [{ kind: 'Group', name: 'system:bootstrappers:kubeadm:default-node-token', apiGroup: 'rbac.authorization.k8s.io' }],
    creationTimestamp: '2024-01-01T00:00:00Z',
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
    name: 'developer-binding',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    roleRef: { kind: 'ClusterRole', name: 'cluster-developer' },
    subjects: [
      { kind: 'User', name: 'developer@example.com', apiGroup: 'rbac.authorization.k8s.io' },
      { kind: 'Group', name: 'engineering', apiGroup: 'rbac.authorization.k8s.io' }
    ],
    creationTimestamp: '2024-03-10T10:00:00Z',
    labels: { 'app.kubernetes.io/name': 'developer-binding' },
    deletable: true,
    createAt: '2024-03-10T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T10:00:00Z',
    updateBy: 'admin'
  }
]
