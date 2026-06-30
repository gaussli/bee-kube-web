/**
 * Ingress Mock API
 * @module mock/kubernetes/network/ingress
 */
import type { PageResp } from '@/types/common'
import type { IngressListVo, IngressQueryReq, IngressReq } from '@/types/kubernetes/network/ingress'
import { generateId } from '@/mock/utils'

/**
 * 获取 Ingress 分页列表
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param params - 查询参数
 * @returns 分页数据
 */
function getIngressPage(clusterId: string, namespaceName: string, params: Partial<IngressQueryReq>): PageResp<IngressListVo> {
  const { name, ingressClassName, page = 1, pageSize = 10 } = params || {}
  let filtered = mockIngresses.filter(i => i.clusterId === clusterId && i.namespace === namespaceName)
  if (name) filtered = filtered.filter(i => i.name.toLowerCase().includes(name.toLowerCase()))
  if (ingressClassName) filtered = filtered.filter(i => i.ingressClassName === ingressClassName)
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)
  return { list, total, page, pageSize }
}

/**
 * 获取 Ingress 详情
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Ingress 名称
 * @returns Ingress 详情
 */
function getIngressDetail(clusterId: string, namespaceName: string, name: string): IngressListVo | null {
  return mockIngresses.find(i => i.clusterId === clusterId && i.namespace === namespaceName && i.name === name) || null
}

/**
 * 创建 Ingress
 * @param clusterId - 集群 ID
 * @param data - 创建参数
 */
function createIngress(clusterId: string, data: Partial<IngressReq>): void {
  const created: IngressListVo = {
    id: generateId(),
    name: data.name || '',
    namespace: data.namespace || '',
    clusterId,
    clusterName: 'prod-cluster',
    ingressClassName: data.ingressClassName,
    rules: data.rules || [],
    tls: data.tls,
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockIngresses.push(created)
}

/**
 * 更新 Ingress
 * @param clusterId - 集群 ID
 * @param data - 更新参数
 */
function updateIngress(clusterId: string, data: Partial<IngressReq>): void {
  const index = mockIngresses.findIndex(i => i.clusterId === clusterId && i.namespace === data.namespace && i.name === data.name)
  if (index === -1) {
    console.error('[Update Ingress] can not find ingress:', data.name)
    return
  }
  const updated = {
    ...mockIngresses[index],
    ...data,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
  mockIngresses[index] = updated
}

/**
 * 更新 Ingress 标签
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Ingress 名称
 * @param labels - 标签键值对
 * @param operation - 操作类型
 */
function manageIngressLabels(clusterId: string, namespaceName: string, name: string, labels: Record<string, string>, operation: number): void {
  const index = mockIngresses.findIndex(i => i.clusterId === clusterId && i.namespace === namespaceName && i.name === name)
  if (index === -1) {
    console.error('[Update Ingress Labels] can not find ingress:', name)
    return
  }
  const currentLabels = mockIngresses[index].labels || {}
  if (operation === 1) {
    mockIngresses[index].labels = { ...currentLabels, ...labels }
  } else if (operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(labels).forEach(key => delete newLabels[key])
    mockIngresses[index].labels = newLabels
  } else if (operation === 3) {
    mockIngresses[index].labels = labels
  }
}

/**
 * 更新 Ingress 注解
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Ingress 名称
 * @param annotations - 注解键值对
 * @param operation - 操作类型
 */
function manageIngressAnnotations(clusterId: string, namespaceName: string, name: string, annotations: Record<string, string>, operation: number): void {
  const index = mockIngresses.findIndex(i => i.clusterId === clusterId && i.namespace === namespaceName && i.name === name)
  if (index === -1) {
    console.error('[Update Ingress Annotations] can not find ingress:', name)
    return
  }
  const currentAnnotations = mockIngresses[index].annotations || {}
  if (operation === 1) {
    mockIngresses[index].annotations = { ...currentAnnotations, ...annotations }
  } else if (operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(annotations).forEach(key => delete newAnnotations[key])
    mockIngresses[index].annotations = newAnnotations
  } else if (operation === 3) {
    mockIngresses[index].annotations = annotations
  }
}

/**
 * 删除 Ingress
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param name - Ingress 名称
 */
function deleteIngress(clusterId: string, namespaceName: string, name: string): void {
  const index = mockIngresses.findIndex(i => i.clusterId === clusterId && i.namespace === namespaceName && i.name === name)
  if (index === -1) {
    console.error('[Delete Ingress] can not find ingress:', name)
    return
  }
  mockIngresses.splice(index, 1)
}

/**
 * 批量删除 Ingress
 * @param clusterId - 集群 ID
 * @param namespaceName - 命名空间名称
 * @param names - 待删除的 Ingress 名称列表
 */
function deleteIngresses(clusterId: string, namespaceName: string, names: string[]): void {
  names.forEach(name => {
    const index = mockIngresses.findIndex(i => i.clusterId === clusterId && i.namespace === namespaceName && i.name === name)
    if (index === -1) {
      console.error('[Delete Ingresses] can not find ingress:', name)
    } else {
      mockIngresses.splice(index, 1)
    }
  })
}

/**
 * Ingress 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses - 获取 Ingress 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses/:name - 获取 Ingress 详情
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses - 创建 Ingress
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses/:name - 更新 Ingress
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses/:name - 删除 Ingress
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses - 批量删除 Ingress
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses',
    handler: (pathParams: Record<string, string>, params: Partial<IngressQueryReq>) => getIngressPage(pathParams.clusterId, pathParams.namespaceName, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses/:name',
    handler: (pathParams: Record<string, string>) => getIngressDetail(pathParams.clusterId, pathParams.namespaceName, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses',
    handler: (pathParams: Record<string, string>, _params: unknown, data: Partial<IngressReq>) => createIngress(pathParams.clusterId, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses/:name',
    handler: (pathParams: Record<string, string>, _params: unknown, data: Partial<IngressReq>) => updateIngress(pathParams.clusterId, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses/:name/labels',
    handler: (pathParams: Record<string, string>, _params: unknown, data: { labels: Record<string, string>; operation: number }) =>
      manageIngressLabels(pathParams.clusterId, pathParams.namespaceName, pathParams.name, data.labels, data.operation)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses/:name/annotations',
    handler: (pathParams: Record<string, string>, _params: unknown, data: { annotations: Record<string, string>; operation: number }) =>
      manageIngressAnnotations(pathParams.clusterId, pathParams.namespaceName, pathParams.name, data.annotations, data.operation)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses/:name',
    handler: (pathParams: Record<string, string>) => deleteIngress(pathParams.clusterId, pathParams.namespaceName, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses',
    handler: (pathParams: Record<string, string>, _params: unknown, data: string[]) => deleteIngresses(pathParams.clusterId, pathParams.namespaceName, data)
  }
]

/**
 * Ingress Mock 数据
 */
const mockIngresses: IngressListVo[] = [
  {
    id: generateId(),
    name: 'api-ingress',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    ingressClassName: 'nginx',
    rules: [{ host: 'api.example.com', paths: [{ path: '/', pathType: 'Prefix', serviceName: 'api-service', servicePort: 8080 }] }],
    tls: [{ hosts: ['api.example.com'], secretName: 'api-tls-secret' }],
    loadBalancer: [
      {
        ip: '203.0.113.10',
        hostname: 'api.example.com',
        ports: [
          { port: 80, protocol: 'TCP', name: 'http' },
          { port: 443, protocol: 'TCP', name: 'https' }
        ]
      }
    ],
    labels: { 'app.kubernetes.io/name': 'api-ingress' },
    annotations: { 'nginx.ingress.kubernetes.io/rewrite-target': '/', 'nginx.ingress.kubernetes.io/ssl-redirect': 'true' },
    deletable: true,
    createAt: '2024-03-10T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T10:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'web-ingress',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    ingressClassName: 'nginx',
    rules: [
      { host: 'www.example.com', paths: [{ path: '/', pathType: 'Prefix', serviceName: 'frontend-service', servicePort: 80 }] },
      { host: 'app.example.com', paths: [{ path: '/', pathType: 'Prefix', serviceName: 'frontend-service', servicePort: 80 }] }
    ],
    tls: [{ hosts: ['www.example.com', 'app.example.com'], secretName: 'web-tls-secret' }],
    loadBalancer: [
      {
        ip: '203.0.113.11',
        ports: [
          { port: 80, protocol: 'TCP', name: 'http' },
          { port: 443, protocol: 'TCP', name: 'https' }
        ]
      }
    ],
    labels: { 'app.kubernetes.io/name': 'frontend-ingress' },
    annotations: { 'nginx.ingress.kubernetes.io/proxy-body-size': '50m', 'nginx.ingress.kubernetes.io/proxy-connect-timeout': '30' },
    deletable: true,
    createAt: '2024-03-15T09:30:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T09:30:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'prometheus-ingress',
    namespace: 'monitoring',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    ingressClassName: 'nginx',
    rules: [{ host: 'prometheus.example.com', paths: [{ path: '/', pathType: 'Prefix', serviceName: 'prometheus', servicePort: 9090 }] }],
    tls: [{ hosts: ['prometheus.example.com'], secretName: 'monitoring-tls-secret' }],
    loadBalancer: [{ ip: '203.0.113.12', ports: [{ port: 443, protocol: 'TCP', name: 'https' }] }],
    labels: { 'app.kubernetes.io/name': 'prometheus-ingress', 'app.kubernetes.io/component': 'monitoring' },
    annotations: { 'nginx.ingress.kubernetes.io/auth-type': 'basic', 'nginx.ingress.kubernetes.io/auth-secret': 'basic-auth', 'nginx.ingress.kubernetes.io/auth-realm': 'Prometheus Monitoring' },
    deletable: true,
    createAt: '2024-03-20T14:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-20T14:00:00Z',
    updateBy: 'admin'
  }
]
