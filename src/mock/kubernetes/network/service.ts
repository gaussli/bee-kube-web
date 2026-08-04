/**
 * Service Mock API
 * @module mock/kubernetes/network/service
 */
import type { PageVo } from '@/types/common'
import type { ServiceListVo, ServiceQueryReq, ServiceReq } from '@/types/kubernetes/network/service'

import { generateId } from '@/mock/utils'

/**
 * 获取 Service 分页列表
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页数据
 */
function getServicePage(
  clusterId: string,
  namespaceName: string,
  params: Partial<ServiceQueryReq>,
): PageVo<ServiceListVo> {
  const { name, type, page = 1, pageSize = 10 } = params || {}
  let filtered = mockServices.filter(s => s.clusterId === clusterId && s.namespace === namespaceName)
  if (name) filtered = filtered.filter(s => s.name.toLowerCase().includes(name.toLowerCase()))
  if (type) filtered = filtered.filter(s => s.type === type)
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)
  return { list, total, page, pageSize }
}

/**
 * 获取 Service 详情
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 * @returns Service 详情
 */
function getServiceDetail(clusterId: string, namespaceName: string, name: string): ServiceListVo | null {
  return mockServices.find(s => s.clusterId === clusterId && s.namespace === namespaceName && s.name === name) || null
}

/**
 * 创建 Service
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 */
function createService(clusterId: string, data: Partial<ServiceReq>): void {
  const created: ServiceListVo = {
    id: generateId(),
    name: data.name || '',
    namespace: data.namespace || '',
    clusterId,
    clusterName: 'prod-cluster',
    type: data.type || 'ClusterIP',
    clusterIp: data.clusterIp || '10.96.0.0',
    ports: data.ports || [],
    selector: data.selector,
    externalName: data.externalName,
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin',
  }
  mockServices.push(created)
}

/**
 * 更新 Service
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 */
function updateService(clusterId: string, data: Partial<ServiceReq>): void {
  const index = mockServices.findIndex(
    s => s.clusterId === clusterId && s.namespace === data.namespace && s.name === data.name,
  )
  if (index === -1) {
    console.error('[Update Service] can not find service:', data.name)
    return
  }
  const updated = {
    ...mockServices[index],
    ...data,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString(),
  }
  mockServices[index] = updated
}

/**
 * 更新 Service 标签
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 * @param labels - 标签键值对
 * @param operation - 操作类型
 */
function manageServiceLabels(
  clusterId: string,
  namespaceName: string,
  name: string,
  labels: Record<string, string>,
  operation: number,
): void {
  const index = mockServices.findIndex(
    s => s.clusterId === clusterId && s.namespace === namespaceName && s.name === name,
  )
  if (index === -1) {
    console.error('[Update Service Labels] can not find service:', name)
    return
  }
  const currentLabels = mockServices[index].labels || {}
  if (operation === 1) {
    mockServices[index].labels = { ...currentLabels, ...labels }
  } else if (operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(labels).forEach(key => delete newLabels[key])
    mockServices[index].labels = newLabels
  } else if (operation === 3) {
    mockServices[index].labels = labels
  }
}

/**
 * 更新 Service 注解
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 * @param annotations - 注解键值对
 * @param operation - 操作类型
 */
function manageServiceAnnotations(
  clusterId: string,
  namespaceName: string,
  name: string,
  annotations: Record<string, string>,
  operation: number,
): void {
  const index = mockServices.findIndex(
    s => s.clusterId === clusterId && s.namespace === namespaceName && s.name === name,
  )
  if (index === -1) {
    console.error('[Update Service Annotations] can not find service:', name)
    return
  }
  const currentAnnotations = mockServices[index].annotations || {}
  if (operation === 1) {
    mockServices[index].annotations = { ...currentAnnotations, ...annotations }
  } else if (operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(annotations).forEach(key => delete newAnnotations[key])
    mockServices[index].annotations = newAnnotations
  } else if (operation === 3) {
    mockServices[index].annotations = annotations
  }
}

/**
 * 删除 Service
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Service 名称
 */
function deleteService(clusterId: string, namespaceName: string, name: string): void {
  const index = mockServices.findIndex(
    s => s.clusterId === clusterId && s.namespace === namespaceName && s.name === name,
  )
  if (index === -1) {
    console.error('[Delete Service] can not find service:', name)
    return
  }
  mockServices.splice(index, 1)
}

/**
 * 批量删除 Service
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param names - 待删除的 Service 名称列表
 */
function deleteServices(clusterId: string, namespaceName: string, names: string[]): void {
  names.forEach(name => {
    const index = mockServices.findIndex(
      s => s.clusterId === clusterId && s.namespace === namespaceName && s.name === name,
    )
    if (index === -1) {
      console.error('[Delete Services] can not find service:', name)
    } else {
      mockServices.splice(index, 1)
    }
  })
}

/**
 * Service 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespaceName/services - 获取 Service 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespaceName/services/:name - 获取 Service 详情
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespaceName/services - 创建 Service
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/services/:name - 更新 Service
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/services/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/services/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespaceName/services/:name - 删除 Service
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespaceName/services - 批量删除 Service
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/services',
    handler: (pathParams: Record<string, string>, params: Partial<ServiceQueryReq>) =>
      getServicePage(pathParams.clusterId, pathParams.namespaceName, params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/services/:name',
    handler: (pathParams: Record<string, string>) =>
      getServiceDetail(pathParams.clusterId, pathParams.namespaceName, pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/services',
    handler: (pathParams: Record<string, string>, _params: unknown, data: Partial<ServiceReq>) =>
      createService(pathParams.clusterId, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/services/:name',
    handler: (pathParams: Record<string, string>, _params: unknown, data: Partial<ServiceReq>) =>
      updateService(pathParams.clusterId, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/services/:name/labels',
    handler: (
      pathParams: Record<string, string>,
      _params: unknown,
      data: { labels: Record<string, string>; operation: number },
    ) =>
      manageServiceLabels(pathParams.clusterId, pathParams.namespaceName, pathParams.name, data.labels, data.operation),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/services/:name/annotations',
    handler: (
      pathParams: Record<string, string>,
      _params: unknown,
      data: { annotations: Record<string, string>; operation: number },
    ) =>
      manageServiceAnnotations(
        pathParams.clusterId,
        pathParams.namespaceName,
        pathParams.name,
        data.annotations,
        data.operation,
      ),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/services/:name',
    handler: (pathParams: Record<string, string>) =>
      deleteService(pathParams.clusterId, pathParams.namespaceName, pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/services',
    handler: (pathParams: Record<string, string>, _params: unknown, data: string[]) =>
      deleteServices(pathParams.clusterId, pathParams.namespaceName, data),
  },
]

/**
 * Service Mock 数据
 */
const mockServices: ServiceListVo[] = [
  {
    id: generateId(),
    name: 'kubernetes',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    type: 'ClusterIP',
    clusterIp: '10.96.0.1',
    ports: [{ name: 'https', protocol: 'TCP', port: 443, targetPort: 443 }],
    selector: { component: 'apiserver' },
    labels: { 'kubernetes.io/cluster-service': 'true', 'kubernetes.io/name': 'kubernetes' },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    name: 'kube-dns',
    namespace: 'kube-system',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    type: 'ClusterIP',
    clusterIp: '10.96.0.10',
    ports: [
      { name: 'dns', protocol: 'UDP', port: 53, targetPort: 53 },
      { name: 'dns-tcp', protocol: 'TCP', port: 53, targetPort: 53 },
    ],
    selector: { 'k8s-app': 'kube-dns' },
    labels: { 'k8s-app': 'kube-dns', 'kubernetes.io/cluster-service': 'true' },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    name: 'frontend-service',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    type: 'ClusterIP',
    clusterIp: '10.96.0.100',
    ports: [{ name: 'http', protocol: 'TCP', port: 80, targetPort: 8080 }],
    selector: { app: 'frontend' },
    labels: { 'app.kubernetes.io/name': 'frontend', 'app.kubernetes.io/component': 'web' },
    deletable: true,
    createAt: '2024-03-10T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T09:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    name: 'backend-service',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    type: 'NodePort',
    clusterIp: '10.96.0.101',
    ports: [{ name: 'http', protocol: 'TCP', port: 8080, targetPort: 8080, nodePort: 30080 }],
    selector: { app: 'backend' },
    labels: { 'app.kubernetes.io/name': 'backend', 'app.kubernetes.io/component': 'api' },
    deletable: true,
    createAt: '2024-03-15T10:30:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T10:30:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    name: 'api-service',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    type: 'LoadBalancer',
    clusterIp: '10.96.0.102',
    ports: [
      { name: 'http', protocol: 'TCP', port: 80, targetPort: 8080 },
      { name: 'https', protocol: 'TCP', port: 443, targetPort: 8443 },
    ],
    selector: { app: 'api' },
    loadBalancer: { ip: '203.0.113.10', ingress: [{ ip: '203.0.113.10' }] },
    labels: { 'app.kubernetes.io/name': 'api-service', 'app.kubernetes.io/component': 'api' },
    annotations: { 'service.beta.kubernetes.io/aws-load-balancer-type': 'nlb' },
    deletable: true,
    createAt: '2024-03-20T14:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-20T14:00:00Z',
    updateBy: 'admin',
  },
]
