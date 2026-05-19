/**
 * NetworkPolicy Mock API
 * @module mock/kubernetes/network/networkPolicy
 */
import type { PageResp } from '@/types/common'
import type { NetworkPolicyResp, NetworkPolicyQueryReq, NetworkPolicyReq } from '@/types/kubernetes/network/networkPolicy'
import { generateId } from '@/mock/utils'

/**
 * 获取 NetworkPolicy 分页列表
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页数据
 */
function getNetworkPolicyPage(clusterId: string, namespaceName: string, params: Partial<NetworkPolicyQueryReq>): PageResp<NetworkPolicyResp> {
  const { name, page = 1, pageSize = 10 } = params || {}
  let filtered = mockNetworkPolicys.filter(n => n.clusterId === clusterId && n.namespace === namespaceName)
  if (name) filtered = filtered.filter(n => n.name.toLowerCase().includes(name.toLowerCase()))
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)
  return { list, total, page, pageSize }
}

/**
 * 获取 NetworkPolicy 详情
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - NetworkPolicy 名称
 * @returns NetworkPolicy 详情
 */
function getNetworkPolicyDetail(clusterId: string, namespaceName: string, name: string): NetworkPolicyResp | null {
  return mockNetworkPolicys.find(n => n.clusterId === clusterId && n.namespace === namespaceName && n.name === name) || null
}

/**
 * 创建 NetworkPolicy
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 */
function createNetworkPolicy(clusterId: string, data: Partial<NetworkPolicyReq>): void {
  const created: NetworkPolicyResp = {
    id: generateId(),
    name: data.name || '',
    namespace: data.namespace || '',
    clusterId,
    clusterName: 'prod-cluster',
    podSelector: data.podSelector || {},
    ingress: data.ingress,
    egress: data.egress,
    policyTypes: data.policyTypes,
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockNetworkPolicys.push(created)
}

/**
 * 更新 NetworkPolicy
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 */
function updateNetworkPolicy(clusterId: string, data: Partial<NetworkPolicyReq>): void {
  const index = mockNetworkPolicys.findIndex(n => n.clusterId === clusterId && n.namespace === data.namespace && n.name === data.name)
  if (index === -1) {
    console.error('[Update NetworkPolicy] can not find networkpolicy:', data.name)
    return
  }
  const updated = {
    ...mockNetworkPolicys[index],
    ...data,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
  mockNetworkPolicys[index] = updated
}

/**
 * 更新 NetworkPolicy 标签
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - NetworkPolicy 名称
 * @param labels - 标签键值对
 * @param operation - 操作类型
 */
function manageNetworkPolicyLabels(clusterId: string, namespaceName: string, name: string, labels: Record<string, string>, operation: number): void {
  const index = mockNetworkPolicys.findIndex(n => n.clusterId === clusterId && n.namespace === namespaceName && n.name === name)
  if (index === -1) {
    console.error('[Update NetworkPolicy Labels] can not find networkpolicy:', name)
    return
  }
  const currentLabels = mockNetworkPolicys[index].labels || {}
  if (operation === 1) {
    mockNetworkPolicys[index].labels = { ...currentLabels, ...labels }
  } else if (operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(labels).forEach(key => delete newLabels[key])
    mockNetworkPolicys[index].labels = newLabels
  } else if (operation === 3) {
    mockNetworkPolicys[index].labels = labels
  }
}

/**
 * 更新 NetworkPolicy 注解
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - NetworkPolicy 名称
 * @param annotations - 注解键值对
 * @param operation - 操作类型
 */
function manageNetworkPolicyAnnotations(clusterId: string, namespaceName: string, name: string, annotations: Record<string, string>, operation: number): void {
  const index = mockNetworkPolicys.findIndex(n => n.clusterId === clusterId && n.namespace === namespaceName && n.name === name)
  if (index === -1) {
    console.error('[Update NetworkPolicy Annotations] can not find networkpolicy:', name)
    return
  }
  const currentAnnotations = mockNetworkPolicys[index].annotations || {}
  if (operation === 1) {
    mockNetworkPolicys[index].annotations = { ...currentAnnotations, ...annotations }
  } else if (operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(annotations).forEach(key => delete newAnnotations[key])
    mockNetworkPolicys[index].annotations = newAnnotations
  } else if (operation === 3) {
    mockNetworkPolicys[index].annotations = annotations
  }
}

/**
 * 删除 NetworkPolicy
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - NetworkPolicy 名称
 */
function deleteNetworkPolicy(clusterId: string, namespaceName: string, name: string): void {
  const index = mockNetworkPolicys.findIndex(n => n.clusterId === clusterId && n.namespace === namespaceName && n.name === name)
  if (index === -1) {
    console.error('[Delete NetworkPolicy] can not find networkpolicy:', name)
    return
  }
  mockNetworkPolicys.splice(index, 1)
}

/**
 * 批量删除 NetworkPolicy
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param names - 待删除的 NetworkPolicy 名称列表
 */
function deleteNetworkPolicys(clusterId: string, namespaceName: string, names: string[]): void {
  names.forEach(name => {
    const index = mockNetworkPolicys.findIndex(n => n.clusterId === clusterId && n.namespace === namespaceName && n.name === name)
    if (index === -1) {
      console.error('[Delete NetworkPolicys] can not find networkpolicy:', name)
    } else {
      mockNetworkPolicys.splice(index, 1)
    }
  })
}

/**
 * NetworkPolicy 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies - 获取 NetworkPolicy 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies/:name - 获取 NetworkPolicy 详情
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies - 创建 NetworkPolicy
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies/:name - 更新 NetworkPolicy
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies/:name - 删除 NetworkPolicy
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies - 批量删除 NetworkPolicy
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies',
    handler: (pathParams: Record<string, string>, params: Partial<NetworkPolicyQueryReq>) => getNetworkPolicyPage(pathParams.clusterId, pathParams.namespaceName, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies/:name',
    handler: (pathParams: Record<string, string>) => getNetworkPolicyDetail(pathParams.clusterId, pathParams.namespaceName, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies',
    handler: (pathParams: Record<string, string>, _params: unknown, data: Partial<NetworkPolicyReq>) => createNetworkPolicy(pathParams.clusterId, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies/:name',
    handler: (pathParams: Record<string, string>, _params: unknown, data: Partial<NetworkPolicyReq>) => updateNetworkPolicy(pathParams.clusterId, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies/:name/labels',
    handler: (pathParams: Record<string, string>, _params: unknown, data: { labels: Record<string, string>; operation: number }) =>
      manageNetworkPolicyLabels(pathParams.clusterId, pathParams.namespaceName, pathParams.name, data.labels, data.operation)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies/:name/annotations',
    handler: (pathParams: Record<string, string>, _params: unknown, data: { annotations: Record<string, string>; operation: number }) =>
      manageNetworkPolicyAnnotations(pathParams.clusterId, pathParams.namespaceName, pathParams.name, data.annotations, data.operation)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies/:name',
    handler: (pathParams: Record<string, string>) => deleteNetworkPolicy(pathParams.clusterId, pathParams.namespaceName, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/networkpolicies',
    handler: (pathParams: Record<string, string>, _params: unknown, data: string[]) => deleteNetworkPolicys(pathParams.clusterId, pathParams.namespaceName, data)
  }
]

/**
 * NetworkPolicy Mock 数据
 */
const mockNetworkPolicys: NetworkPolicyResp[] = [
  {
    id: generateId(),
    name: 'default-deny-all',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    podSelector: {},
    policyTypes: ['Ingress', 'Egress'],
    labels: { 'networking.gke.io/managed-policy': 'true' },
    deletable: true,
    createAt: '2024-03-01T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-01T10:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'allow-dns',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    podSelector: {},
    egress: [
      {
        ports: [
          { protocol: 'UDP', port: 53 },
          { protocol: 'TCP', port: 53 }
        ],
        to: [{ kind: 'NamespaceSelector', namespaceSelector: { 'kubernetes.io/metadata.name': 'kube-system' } }]
      }
    ],
    policyTypes: ['Egress'],
    labels: { 'app.kubernetes.io/name': 'allow-dns' },
    deletable: true,
    createAt: '2024-03-05T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-05T09:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'frontend-network-policy',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    podSelector: { app: 'frontend' },
    ingress: [{ ports: [{ protocol: 'TCP', port: 8080 }], from: [{ kind: 'PodSelector', podSelector: { app: 'nginx' } }] }],
    egress: [{ ports: [{ protocol: 'TCP', port: 6379 }], to: [{ kind: 'PodSelector', podSelector: { app: 'redis' } }] }],
    policyTypes: ['Ingress', 'Egress'],
    labels: { 'app.kubernetes.io/name': 'frontend-network-policy' },
    deletable: true,
    createAt: '2024-03-10T14:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T14:00:00Z',
    updateBy: 'admin'
  }
]
