/**
 * ClusterRoleBinding Mock API
 * @module mock/kubernetes/security/clusterRoleBinding
 */
import type { PageVo } from '@/types/common'
import type {
  ClusterRoleBindingResp,
  ClusterRoleBindingQueryReq,
  ClusterRoleBindingReq,
} from '@/types/kubernetes/security/clusterRoleBinding'

import { generateId } from '@/mock/utils'

/**
 * 获取 ClusterRoleBinding 分页列表
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 * @returns 分页数据
 */
function getClusterRoleBindingPage(
  clusterUid: string,
  params: Partial<ClusterRoleBindingQueryReq>,
): PageVo<ClusterRoleBindingResp> {
  const { name, showSystem, page = 1, pageSize = 10 } = params || {}
  let filtered = mockClusterRoleBindings.filter(b => b.clusterUid === clusterUid)
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
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 * @returns ClusterRoleBinding 详情
 */
function getClusterRoleBindingDetail(clusterUid: string, name: string): ClusterRoleBindingResp | null {
  return mockClusterRoleBindings.find(b => b.clusterUid === clusterUid && b.name === name) || null
}

/**
 * 创建 ClusterRoleBinding
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 */
function createClusterRoleBinding(clusterUid: string, data: Partial<ClusterRoleBindingReq>): void {
  const created: ClusterRoleBindingResp = {
    id: generateId(),
    name: data.name || '',
    clusterUid,
    clusterName: 'prod-cluster',
    isSystem: false,
    roleRef: { kind: 'ClusterRole', name: data.clusterRoleName || '' },
    subjects: data.subjects || [],
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin',
  }
  mockClusterRoleBindings.push(created)
}

/**
 * 更新 ClusterRoleBinding
 * @param clusterUid - 集群 UID
 * @param data - 更新参数
 */
function updateClusterRoleBinding(clusterUid: string, data: Partial<ClusterRoleBindingReq>): void {
  const index = mockClusterRoleBindings.findIndex(b => b.clusterUid === clusterUid && b.name === data.name)
  if (index === -1) {
    console.error('[Update ClusterRoleBinding] can not find clusterrolebinding:', data.name)
    return
  }
  const updated = {
    ...mockClusterRoleBindings[index],
    ...data,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString(),
  }
  mockClusterRoleBindings[index] = updated
}

/**
 * 更新 ClusterRoleBinding 标签
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 * @param labels - 标签键值对
 * @param operation - 操作类型
 */
function manageClusterRoleBindingLabels(
  clusterUid: string,
  name: string,
  labels: Record<string, string>,
  operation: number,
): void {
  const index = mockClusterRoleBindings.findIndex(b => b.clusterUid === clusterUid && b.name === name)
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
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 * @param annotations - 注解键值对
 * @param operation - 操作类型
 */
function manageClusterRoleBindingAnnotations(
  clusterUid: string,
  name: string,
  annotations: Record<string, string>,
  operation: number,
): void {
  const index = mockClusterRoleBindings.findIndex(b => b.clusterUid === clusterUid && b.name === name)
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
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 * @param subjects - 主体列表
 * @param operation - 操作类型
 */
function manageClusterRoleBindingSubjects(
  clusterUid: string,
  name: string,
  subjects: ClusterRoleBindingReq['subjects'],
  operation: number,
): void {
  const index = mockClusterRoleBindings.findIndex(b => b.clusterUid === clusterUid && b.name === name)
  if (index === -1) {
    console.error('[Update ClusterRoleBinding Subjects] can not find clusterrolebinding:', name)
    return
  }
  if (operation === 1) {
    mockClusterRoleBindings[index].subjects = [...mockClusterRoleBindings[index].subjects, ...subjects]
  } else if (operation === 2) {
    mockClusterRoleBindings[index].subjects = mockClusterRoleBindings[index].subjects.filter(
      s => !subjects.some(ns => ns.name === s.name && ns.kind === s.kind),
    )
  } else if (operation === 3) {
    mockClusterRoleBindings[index].subjects = subjects
  }
}

/**
 * 删除 ClusterRoleBinding
 * @param clusterUid - 集群 UID
 * @param name - ClusterRoleBinding 名称
 */
function deleteClusterRoleBinding(clusterUid: string, name: string): void {
  const index = mockClusterRoleBindings.findIndex(b => b.clusterUid === clusterUid && b.name === name)
  if (index === -1) {
    console.error('[Delete ClusterRoleBinding] can not find clusterrolebinding:', name)
    return
  }
  mockClusterRoleBindings.splice(index, 1)
}

/**
 * 批量删除 ClusterRoleBinding
 * @param clusterUid - 集群 UID
 * @param names - 待删除的 ClusterRoleBinding 名称列表
 */
function deleteClusterRoleBindings(clusterUid: string, names: string[]): void {
  names.forEach(name => {
    const index = mockClusterRoleBindings.findIndex(b => b.clusterUid === clusterUid && b.name === name)
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
 * - GET /kubernetes/clusters/:clusterUid/clusterrolebindings - 获取 ClusterRoleBinding 分页列表
 * - GET /kubernetes/clusters/:clusterUid/clusterrolebindings/:name - 获取 ClusterRoleBinding 详情
 * - POST /kubernetes/clusters/:clusterUid/clusterrolebindings - 创建 ClusterRoleBinding
 * - PUT /kubernetes/clusters/:clusterUid/clusterrolebindings/:name - 更新 ClusterRoleBinding
 * - PUT /kubernetes/clusters/:clusterUid/clusterrolebindings/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterUid/clusterrolebindings/:name/annotations - 更新注解
 * - PUT /kubernetes/clusters/:clusterUid/clusterrolebindings/:name/subjects - 更新主体
 * - DELETE /kubernetes/clusters/:clusterUid/clusterrolebindings/:name - 删除 ClusterRoleBinding
 * - DELETE /kubernetes/clusters/:clusterUid/clusterrolebindings - 批量删除 ClusterRoleBinding
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings',
    handler: ({
      pathParams,
      params,
    }: {
      pathParams: Record<string, string>
      params: Partial<ClusterRoleBindingQueryReq>
    }) => getClusterRoleBindingPage(pathParams.clusterUid, params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }) =>
      getClusterRoleBindingDetail(pathParams.clusterUid, pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<ClusterRoleBindingReq> }) =>
      createClusterRoleBinding(pathParams.clusterUid, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<ClusterRoleBindingReq> }) =>
      updateClusterRoleBinding(pathParams.clusterUid, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/labels',
    handler: ({
      pathParams,
      data,
    }: {
      pathParams: Record<string, string>
      data: { labels: Record<string, string>; operation: number }
    }) => manageClusterRoleBindingLabels(pathParams.clusterUid, pathParams.name, data.labels, data.operation),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/annotations',
    handler: ({
      pathParams,
      data,
    }: {
      pathParams: Record<string, string>
      data: { annotations: Record<string, string>; operation: number }
    }) => manageClusterRoleBindingAnnotations(pathParams.clusterUid, pathParams.name, data.annotations, data.operation),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name/subjects',
    handler: ({
      pathParams,
      data,
    }: {
      pathParams: Record<string, string>
      data: { subjects: ClusterRoleBindingReq['subjects']; operation: number }
    }) => manageClusterRoleBindingSubjects(pathParams.clusterUid, pathParams.name, data.subjects, data.operation),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }) =>
      deleteClusterRoleBinding(pathParams.clusterUid, pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/clusterrolebindings',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: string[] }) =>
      deleteClusterRoleBindings(pathParams.clusterUid, data),
  },
]

/**
 * ClusterRoleBinding Mock 数据
 */
const mockClusterRoleBindings: ClusterRoleBindingResp[] = [
  {
    id: generateId(),
    name: 'cluster-admin',
    clusterUid: 'cluster-1',
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
    updateBy: 'system',
  },
  {
    id: generateId(),
    name: 'system:node-bootstrap',
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: true,
    roleRef: { kind: 'ClusterRole', name: 'system:node-bootstrap' },
    subjects: [
      { kind: 'Group', name: 'system:bootstrappers:kubeadm:default-node-token', apiGroup: 'rbac.authorization.k8s.io' },
    ],
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
    clusterUid: 'cluster-1',
    clusterName: 'prod-cluster',
    isSystem: false,
    roleRef: { kind: 'ClusterRole', name: 'cluster-developer' },
    subjects: [
      { kind: 'User', name: 'developer@example.com', apiGroup: 'rbac.authorization.k8s.io' },
      { kind: 'Group', name: 'engineering', apiGroup: 'rbac.authorization.k8s.io' },
    ],
    creationTimestamp: '2024-03-10T10:00:00Z',
    labels: { 'app.kubernetes.io/name': 'developer-binding' },
    deletable: true,
    createAt: '2024-03-10T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T10:00:00Z',
    updateBy: 'admin',
  },
]
