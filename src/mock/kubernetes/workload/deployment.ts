/**
 * Kubernetes Deployment 管理 Mock API
 * @module mock/kubernetes/workload/deployment
 */
import { generateId } from '@/mock/utils'
import type { DeploymentResp, DeploymentQueryReq, DeploymentReq, DeploymentLabelsReq, DeploymentAnnotationsReq, DeploymentScaleReq } from '@/types'

/**
 * Deployment 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments - 获取 Deployment 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name - 获取 Deployment 详情
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments - 创建 Deployment
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name - 更新 Deployment
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/scale - 扩缩容
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/restart - 重启
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/rollback - 回滚
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name - 删除 Deployment
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/batch - 批量删除
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments',
    handler: (pathParams: Record<string, string>, params: Partial<DeploymentQueryReq>) => getDeploymentPage(pathParams.clusterId, pathParams.namespace, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name',
    handler: (pathParams: Record<string, string>, params: any, data: any) => getDeploymentDetail(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments',
    handler: (pathParams: Record<string, string>, params: any, data: Partial<DeploymentReq>) => createDeployment(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name',
    handler: (pathParams: Record<string, string>, params: any, data: Partial<DeploymentReq>) => updateDeployment(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/scale',
    handler: (pathParams: Record<string, string>, params: any, data: DeploymentScaleReq) => scaleDeployment(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/restart',
    handler: (pathParams: Record<string, string>, params: any, data: any) => restartDeployment(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/rollback',
    handler: (pathParams: Record<string, string>, params: any, data: any) => rollbackDeployment(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/labels',
    handler: (pathParams: Record<string, string>, params: any, data: DeploymentLabelsReq) => manageDeploymentLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/annotations',
    handler: (pathParams: Record<string, string>, params: any, data: DeploymentAnnotationsReq) => manageDeploymentAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name',
    handler: (pathParams: Record<string, string>, params: any, data: any) => deleteDeployment(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/batch',
    handler: (pathParams: Record<string, string>, params: any, data: string[]) => deleteDeployments(pathParams.clusterId, pathParams.namespace, data)
  }
]

/**
 * 获取 Deployment 分页列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param params - 查询参数
 * @returns 分页数据
 */
function getDeploymentPage(clusterId: string, namespace: string, params: Partial<DeploymentQueryReq>) {
  const { name, status, page = 1, pageSize = 10 } = params || {}

  let filtered = mockDeployments.filter(d => d.clusterId === clusterId && d.namespace === namespace)

  if (name) {
    filtered = filtered.filter(d => d.name.toLowerCase().includes(name.toLowerCase()))
  }
  if (status) {
    filtered = filtered.filter(d => d.status === status)
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)

  return { list, total, page, pageSize }
}

/**
 * 获取 Deployment 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @returns Deployment 详情
 */
function getDeploymentDetail(clusterId: string, namespace: string, name: string) {
  const deployment = mockDeployments.find(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  return deployment || null
}

/**
 * 创建 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param data - 创建参数
 * @returns 创建的 Deployment ID
 */
function createDeployment(clusterId: string, namespace: string, data: Partial<DeploymentReq>) {
  const newDeployment: DeploymentResp = {
    id: generateId(),
    name: data.name || '',
    namespace: namespace,
    clusterId: clusterId,
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: data.replicas || 1,
    readyReplicas: data.replicas || 1,
    availableReplicas: data.replicas || 1,
    strategy: data.strategy || 'RollingUpdate',
    images: data.containers?.map(c => c.image) || [],
    selector: data.selector,
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockDeployments.push(newDeployment)
  return newDeployment.id
}

/**
 * 更新 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param data - 更新参数
 * @returns 更新后的 Deployment ID
 */
function updateDeployment(clusterId: string, namespace: string, name: string, data: Partial<DeploymentReq>) {
  const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) return null

  const updated = {
    ...mockDeployments[index],
    ...data,
    images: data.containers?.map(c => c.image) || mockDeployments[index].images,
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockDeployments[index] = updated
  return updated.id
}

/**
 * 扩缩容 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param data - 扩缩容参数
 * @returns 操作结果
 */
function scaleDeployment(clusterId: string, namespace: string, name: string, data: DeploymentScaleReq) {
  const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) return false

  mockDeployments[index] = {
    ...mockDeployments[index],
    replicas: data.replicas,
    readyReplicas: data.replicas,
    availableReplicas: data.replicas,
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  return true
}

/**
 * 重启 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @returns 操作结果
 */
function restartDeployment(clusterId: string, namespace: string, name: string) {
  const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) return false

  mockDeployments[index] = {
    ...mockDeployments[index],
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  return true
}

/**
 * 回滚 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @returns 操作结果
 */
function rollbackDeployment(clusterId: string, namespace: string, name: string) {
  const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) return false

  mockDeployments[index] = {
    ...mockDeployments[index],
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  return true
}

/**
 * 更新 Deployment 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param data - 标签数据
 * @returns 操作结果
 */
function manageDeploymentLabels(clusterId: string, namespace: string, name: string, data: DeploymentLabelsReq) {
  const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) return false

  const currentLabels = mockDeployments[index].labels || {}

  if (data.operation === 1) {
    // 新增
    mockDeployments[index].labels = { ...currentLabels, ...data.labels }
  } else if (data.operation === 2) {
    // 移除
    const newLabels = { ...currentLabels }
    Object.keys(data.labels).forEach(key => delete newLabels[key])
    mockDeployments[index].labels = newLabels
  } else if (data.operation === 3) {
    // 全量替换
    mockDeployments[index].labels = data.labels
  }

  mockDeployments[index].updateAt = new Date().toLocaleString()
  mockDeployments[index].updateBy = 'admin'
  return true
}

/**
 * 更新 Deployment 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param data - 注解数据
 * @returns 操作结果
 */
function manageDeploymentAnnotations(clusterId: string, namespace: string, name: string, data: DeploymentAnnotationsReq) {
  const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) return false

  const currentAnnotations = mockDeployments[index].annotations || {}

  if (data.operation === 1) {
    // 新增
    mockDeployments[index].annotations = { ...currentAnnotations, ...data.annotations }
  } else if (data.operation === 2) {
    // 移除
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations).forEach(key => delete newAnnotations[key])
    mockDeployments[index].annotations = newAnnotations
  } else if (data.operation === 3) {
    // 全量替换
    mockDeployments[index].annotations = data.annotations
  }

  mockDeployments[index].updateAt = new Date().toLocaleString()
  mockDeployments[index].updateBy = 'admin'
  return true
}

/**
 * 删除 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @returns 是否删除成功
 */
function deleteDeployment(clusterId: string, namespace: string, name: string) {
  const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) return false

  mockDeployments.splice(index, 1)
  return true
}

/**
 * 批量删除 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param names - Deployment 名称数组
 * @returns 是否删除成功
 */
function deleteDeployments(clusterId: string, namespace: string, names: string[]) {
  names.forEach((name: string) => {
    const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
    if (index !== -1) {
      mockDeployments.splice(index, 1)
    }
  })
  return true
}

/**
 * 模拟 Deployment 数据
 */
const mockDeployments: DeploymentResp[] = [
  {
    id: generateId(),
    name: 'nginx-ingress-controller',
    namespace: 'kube-system',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 3,
    readyReplicas: 3,
    availableReplicas: 3,
    strategy: 'RollingUpdate',
    images: ['registry.k8s.io/ingress-nginx/controller:v1.9.4'],
    selector: { 'app.kubernetes.io/name': 'nginx-ingress-controller' },
    labels: {
      'app.kubernetes.io/name': 'nginx-ingress-controller',
      'app.kubernetes.io/version': 'v1.9.4'
    },
    annotations: {
      description: 'Kubernetes Ingress 控制器'
    },
    createAt: '2024-01-15 10:30:25',
    createBy: 'admin',
    updateAt: '2024-03-20 14:22:18',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'coredns',
    namespace: 'kube-system',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 2,
    readyReplicas: 2,
    availableReplicas: 2,
    strategy: 'RollingUpdate',
    images: ['registry.k8s.io/coredns/coredns:v1.11.1'],
    selector: { 'k8s-app': 'kube-dns' },
    labels: {
      'k8s-app': 'kube-dns',
      'kubernetes.io/name': 'CoreDNS'
    },
    annotations: {},
    createAt: '2024-01-15 10:30:30',
    createBy: 'admin',
    updateAt: '2024-03-19 16:45:30',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'metrics-server',
    namespace: 'kube-system',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 1,
    readyReplicas: 1,
    availableReplicas: 1,
    strategy: 'RollingUpdate',
    images: ['registry.k8s.io/metrics-server/metrics-server:v0.7.0'],
    selector: { 'k8s-app': 'metrics-server' },
    labels: {
      'k8s-app': 'metrics-server'
    },
    annotations: {},
    createAt: '2024-01-20 11:00:00',
    createBy: 'admin',
    updateAt: '2024-03-18 14:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'frontend-app',
    namespace: 'app-frontend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 5,
    readyReplicas: 5,
    availableReplicas: 5,
    strategy: 'RollingUpdate',
    images: ['registry.example.com/frontend:v2.1.0'],
    selector: { app: 'frontend-app' },
    labels: {
      app: 'frontend-app',
      env: 'production',
      version: 'v2.1.0'
    },
    annotations: {
      description: '前端应用服务'
    },
    createAt: '2024-02-01 08:00:00',
    createBy: 'developer',
    updateAt: '2024-03-20 10:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    name: 'backend-api',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 10,
    readyReplicas: 10,
    availableReplicas: 10,
    strategy: 'RollingUpdate',
    images: ['registry.example.com/backend:v3.2.1'],
    selector: { app: 'backend-api' },
    labels: {
      app: 'backend-api',
      env: 'production',
      version: 'v3.2.1'
    },
    annotations: {
      description: '后端 API 服务'
    },
    createAt: '2024-02-01 08:05:00',
    createBy: 'developer',
    updateAt: '2024-03-20 11:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    name: 'prometheus',
    namespace: 'monitoring',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 2,
    readyReplicas: 2,
    availableReplicas: 2,
    strategy: 'RollingUpdate',
    images: ['prom/prometheus:v2.48.0'],
    selector: { app: 'prometheus' },
    labels: {
      'app': 'prometheus',
      'app.kubernetes.io/name': 'prometheus'
    },
    annotations: {
      description: 'Prometheus 监控系统'
    },
    createAt: '2024-02-10 14:20:00',
    createBy: 'admin',
    updateAt: '2024-03-15 09:30:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'grafana',
    namespace: 'monitoring',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 2,
    readyReplicas: 2,
    availableReplicas: 2,
    strategy: 'RollingUpdate',
    images: ['grafana/grafana:10.2.3'],
    selector: { app: 'grafana' },
    labels: {
      'app': 'grafana',
      'app.kubernetes.io/name': 'grafana'
    },
    annotations: {
      description: 'Grafana 可视化平台'
    },
    createAt: '2024-02-10 14:25:00',
    createBy: 'admin',
    updateAt: '2024-03-15 09:35:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'user-service',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Degraded',
    replicas: 8,
    readyReplicas: 6,
    availableReplicas: 6,
    strategy: 'RollingUpdate',
    images: ['registry.example.com/user-service:v1.5.2'],
    selector: { app: 'user-service' },
    labels: {
      app: 'user-service',
      env: 'production'
    },
    annotations: {
      description: '用户服务'
    },
    createAt: '2024-02-15 10:00:00',
    createBy: 'developer',
    updateAt: '2024-03-19 16:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    name: 'order-service',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 6,
    readyReplicas: 6,
    availableReplicas: 6,
    strategy: 'RollingUpdate',
    images: ['registry.example.com/order-service:v2.0.1'],
    selector: { app: 'order-service' },
    labels: {
      app: 'order-service',
      env: 'production'
    },
    annotations: {
      description: '订单服务'
    },
    createAt: '2024-02-15 10:05:00',
    createBy: 'developer',
    updateAt: '2024-03-18 14:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    name: 'payment-service',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Unavailable',
    replicas: 4,
    readyReplicas: 0,
    availableReplicas: 0,
    strategy: 'RollingUpdate',
    images: ['registry.example.com/payment-service:v1.8.0'],
    selector: { app: 'payment-service' },
    labels: {
      app: 'payment-service',
      env: 'production'
    },
    annotations: {
      description: '支付服务'
    },
    createAt: '2024-02-15 10:10:00',
    createBy: 'developer',
    updateAt: '2024-03-20 08:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    name: 'redis-cache',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 3,
    readyReplicas: 3,
    availableReplicas: 3,
    strategy: 'RollingUpdate',
    images: ['redis:7.2-alpine'],
    selector: { app: 'redis-cache' },
    labels: {
      app: 'redis-cache',
      env: 'production'
    },
    annotations: {
      description: 'Redis 缓存服务'
    },
    createAt: '2024-02-15 10:15:00',
    createBy: 'developer',
    updateAt: '2024-03-17 11:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    name: 'staging-frontend',
    namespace: 'staging-app',
    clusterId: 'cls-002-staging',
    clusterName: 'staging-cluster',
    status: 'Available',
    replicas: 2,
    readyReplicas: 2,
    availableReplicas: 2,
    strategy: 'RollingUpdate',
    images: ['registry.example.com/frontend:v2.0.5'],
    selector: { app: 'staging-frontend' },
    labels: {
      app: 'staging-frontend',
      env: 'staging'
    },
    annotations: {},
    createAt: '2024-02-15 10:20:00',
    createBy: 'developer',
    updateAt: '2024-03-19 15:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    name: 'staging-backend',
    namespace: 'staging-app',
    clusterId: 'cls-002-staging',
    clusterName: 'staging-cluster',
    status: 'Available',
    replicas: 2,
    readyReplicas: 2,
    availableReplicas: 2,
    strategy: 'RollingUpdate',
    images: ['registry.example.com/backend:v3.1.0'],
    selector: { app: 'staging-backend' },
    labels: {
      app: 'staging-backend',
      env: 'staging'
    },
    annotations: {},
    createAt: '2024-02-15 10:25:00',
    createBy: 'developer',
    updateAt: '2024-03-19 15:05:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    name: 'dev-app',
    namespace: 'dev-test',
    clusterId: 'cls-003-dev',
    clusterName: 'dev-cluster',
    status: 'Available',
    replicas: 1,
    readyReplicas: 1,
    availableReplicas: 1,
    strategy: 'RollingUpdate',
    images: ['registry.example.com/app:latest'],
    selector: { app: 'dev-app' },
    labels: {
      app: 'dev-app',
      env: 'development'
    },
    annotations: {},
    createAt: '2024-03-01 09:00:00',
    createBy: 'developer',
    updateAt: '2024-03-20 16:00:00',
    updateBy: 'developer'
  }
]
