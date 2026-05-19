/**
 * Kubernetes Deployment 管理 Mock API
 * @module mock/kubernetes/workload/deployment
 */
import type { PageResp } from '@/types/common'
import type { DeploymentQueryReq, DeploymentReq, DeploymentResp, DeploymentLabelsReq, DeploymentAnnotationsReq, DeploymentScaleReq, DeploymentYamlReq } from '@/types/kubernetes/workload/deployment'
import { generateId } from '@/mock/utils'

/**
 * Deployment 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments - 获取 Deployment 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name - 获取 Deployment 详情
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/yaml - 查看 YAML
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments - 创建 Deployment
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name - 更新 Deployment
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/scale - 扩缩容
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/restart - 重启
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/rollback - 回滚
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name - 删除 Deployment
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/batch - 批量删除
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/export - 导出 CSV
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/import - 导入 Deployment
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments',
    handler: (pathParams: Record<string, string>, params: Partial<DeploymentQueryReq>): PageResp<DeploymentResp> => getDeploymentPage(pathParams.clusterId, pathParams.namespace, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name',
    handler: (pathParams: Record<string, string>): DeploymentResp => getDeploymentDetail(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/yaml',
    handler: (pathParams: Record<string, string>): string => getDeploymentYaml(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments',
    handler: (pathParams: Record<string, string>, data: Partial<DeploymentReq>): void => createDeployment(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name',
    handler: (pathParams: Record<string, string>, data: Partial<DeploymentReq>): void => updateDeployment(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/scale',
    handler: (pathParams: Record<string, string>, data: Partial<DeploymentScaleReq>): void => scaleDeployment(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/restart',
    handler: (pathParams: Record<string, string>): void => restartDeployment(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/rollback',
    handler: (pathParams: Record<string, string>): void => rollbackDeployment(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/labels',
    handler: (pathParams: Record<string, string>, data: Partial<DeploymentLabelsReq>): void => manageDeploymentLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name/annotations',
    handler: (pathParams: Record<string, string>, data: Partial<DeploymentAnnotationsReq>): void => manageDeploymentAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name',
    handler: (pathParams: Record<string, string>): void => deleteDeployment(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/batch',
    handler: (pathParams: Record<string, string>, data: string[]): void => deleteDeployments(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/export',
    handler: (pathParams: Record<string, string>, params: Partial<DeploymentQueryReq>): void => exportDeployment(pathParams.clusterId, pathParams.namespace, params)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/import',
    handler: (pathParams: Record<string, string>, data: Partial<DeploymentYamlReq>): void => importDeployment(pathParams.clusterId, pathParams.namespace, data)
  }
]

/**
 * 获取 Deployment 分页列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param params - 查询参数
 * @returns 分页数据
 */
function getDeploymentPage(clusterId: string, namespace: string, params: Partial<DeploymentQueryReq>): PageResp<DeploymentResp> {
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
function getDeploymentDetail(clusterId: string, namespace: string, name: string): DeploymentResp {
  const deployment = mockDeployments.find(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (!deployment) {
    console.error('[Get Deployment Detail] can not find deployment:', clusterId, namespace, name)
  }
  return deployment!
}

/**
 * 查看 Deployment YAML
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @returns Deployment YAML 配置
 */
function getDeploymentYaml(clusterId: string, namespace: string, name: string): string {
  const deployment = mockDeployments.find(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (!deployment) {
    console.error('[Get Deployment Yaml] can not find deployment:', clusterId, namespace, name)
    return ''
  }

  const labels = Object.entries(deployment.labels || {})
    .map(([key, value]) => `      ${key}: "${value}"`)
    .join('\n')

  const annotations = Object.entries(deployment.annotations || {})
    .map(([key, value]) => `      ${key}: "${value}"`)
    .join('\n')

  const containers = deployment.images
    .map((image, index) => {
      return `      - name: ${deployment.name}-container-${index}
        image: ${image}
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"
        livenessProbe:
          httpGet:
            path: /
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5`
    })
    .join('\n')

  const yaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${deployment.name}
  namespace: ${deployment.namespace}
  labels:
${labels}
  annotations:
${annotations}
  creationTimestamp: "${deployment.createAt}"
  resourceVersion: "${generateId()}"
  uid: "${generateId()}"
  managedFields:
    - manager: kubectl-client-side-apply
      operation: Update
      apiVersion: apps/v1
      time: "${deployment.updateAt}"
      fieldsType: FieldsV1
      fieldsV1:
        f:metadata:
          f:annotations:
            f:deployment.kubernetes.io/revision: {}
        f:spec:
          f:progressDeadlineSeconds: {}
          f:replicas: {}
          f:revisionHistoryLimit: {}
          f:selector: {}
          f:strategy:
            f:type: {}
          f:template:
            f:metadata:
              f:creationTimestamp: {}
            f:spec:
              f:containers: {}
            f:dnsPolicy: {}
            f:restartPolicy: {}
            f:schedulerName: {}
            f:terminationGracePeriodSeconds: {}
spec:
  replicas: ${deployment.replicas}
  selector:
    matchLabels:
${Object.entries(deployment.selector || { app: deployment.name })[0] ? `      ${Object.entries(deployment.selector || { app: deployment.name })[0][0]}: "${Object.entries(deployment.selector || { app: deployment.name })[0][1]}"` : ''}
  strategy:
    type: ${deployment.strategy || 'RollingUpdate'}
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
  revisionHistoryLimit: 10
  progressDeadlineSeconds: 600
  template:
    metadata:
      creationTimestamp: "${deployment.createAt}"
      labels:
${labels}
    spec:
      containers:
${containers}
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      schedulerName: default-scheduler
      terminationGracePeriodSeconds: 30
status:
  observedGeneration: ${deployment.revision || 1}
  replicas: ${deployment.replicas}
  updatedReplicas: ${deployment.replicas}
  readyReplicas: ${deployment.readyReplicas}
  availableReplicas: ${deployment.availableReplicas}
  conditions:
    - type: Available
      status: "True"
      lastUpdateTime: "${deployment.updateAt}"
      lastTransitionTime: "${deployment.updateAt}"
      reason: MinimumReplicasAvailable
      message: Deployment has minimum availability.
    - type: Progressing
      status: "True"
      lastUpdateTime: "${deployment.updateAt}"
      lastTransitionTime: "${deployment.createAt}"
      reason: NewReplicaSetAvailable
      message: ReplicaSet "${deployment.name}" has successfully progressed.`

  return yaml
}

/**
 * 创建 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param data - 创建参数
 */
function createDeployment(clusterId: string, namespace: string, data: Partial<DeploymentReq>): void {
  const created: DeploymentResp = {
    id: generateId(),
    name: data.name || '',
    namespace: namespace,
    clusterId: clusterId,
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: data.replicas || 1,
    readyReplicas: data.replicas || 1,
    availableReplicas: data.replicas || 1,
    revision: 1,
    strategy: data.strategy || 'RollingUpdate',
    images: data.containers?.map(c => c.image) || [],
    selector: data.selector || {},
    labels: data.labels || {},
    annotations: data.annotations || {},
    deletable: true,
    createBy: 'admin',
    createAt: new Date().toLocaleString(),
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
  mockDeployments.push(created)
}

/**
 * 更新 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param data - 更新参数
 */
function updateDeployment(clusterId: string, namespace: string, name: string, data: Partial<DeploymentReq>): void {
  const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) {
    console.error('[Update Deployment] can not find deployment:', clusterId, namespace, name)
    return
  }
  mockDeployments[index] = {
    ...mockDeployments[index],
    ...data,
    images: data.containers?.map(c => c.image) || mockDeployments[index].images,
    revision: mockDeployments[index].revision + 1,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
}

/**
 * 扩缩容 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param data - 扩缩容参数
 */
function scaleDeployment(clusterId: string, namespace: string, name: string, data: Partial<DeploymentScaleReq>): void {
  const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) {
    console.error('[Scale Deployment] can not find deployment:', clusterId, namespace, name)
    return
  }
  mockDeployments[index] = {
    ...mockDeployments[index],
    replicas: data.replicas,
    readyReplicas: data.replicas,
    availableReplicas: data.replicas,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
}

/**
 * 重启 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 */
function restartDeployment(clusterId: string, namespace: string, name: string): void {
  const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) {
    console.error('[Restart Deployment] can not find deployment:', clusterId, namespace, name)
    return
  }
  mockDeployments[index] = {
    ...mockDeployments[index],
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
}

/**
 * 回滚 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 */
function rollbackDeployment(clusterId: string, namespace: string, name: string): void {
  const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) {
    console.error('[Rollback Deployment] can not find deployment:', clusterId, namespace, name)
    return
  }
  mockDeployments[index] = {
    ...mockDeployments[index],
    revision: Math.max(1, mockDeployments[index].revision - 1),
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
}

/**
 * 更新 Deployment 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param data - 标签数据
 */
function manageDeploymentLabels(clusterId: string, namespace: string, name: string, data: Partial<DeploymentLabelsReq>): void {
  const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) {
    console.error('[Manage Deployment Labels] can not find deployment:', clusterId, namespace, name)
    return
  }

  const currentLabels = mockDeployments[index].labels || {}

  if (data.operation === 1) {
    mockDeployments[index].labels = { ...currentLabels, ...data.labels }
  } else if (data.operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(data.labels || {}).forEach(key => delete newLabels[key])
    mockDeployments[index].labels = newLabels
  } else if (data.operation === 3) {
    mockDeployments[index].labels = data.labels || {}
  }

  mockDeployments[index].updateBy = 'admin'
  mockDeployments[index].updateAt = new Date().toLocaleString()
}

/**
 * 更新 Deployment 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param data - 注解数据
 */
function manageDeploymentAnnotations(clusterId: string, namespace: string, name: string, data: Partial<DeploymentAnnotationsReq>): void {
  const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) {
    console.error('[Manage Deployment Annotations] can not find deployment:', clusterId, namespace, name)
    return
  }

  const currentAnnotations = mockDeployments[index].annotations || {}

  if (data.operation === 1) {
    mockDeployments[index].annotations = { ...currentAnnotations, ...data.annotations }
  } else if (data.operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations || {}).forEach(key => delete newAnnotations[key])
    mockDeployments[index].annotations = newAnnotations
  } else if (data.operation === 3) {
    mockDeployments[index].annotations = data.annotations || {}
  }

  mockDeployments[index].updateBy = 'admin'
  mockDeployments[index].updateAt = new Date().toLocaleString()
}

/**
 * 删除 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 */
function deleteDeployment(clusterId: string, namespace: string, name: string): void {
  const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) {
    console.error('[Delete Deployment] can not find deployment:', clusterId, namespace, name)
    return
  }
  mockDeployments.splice(index, 1)
}

/**
 * 批量删除 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param names - Deployment 名称数组
 */
function deleteDeployments(clusterId: string, namespace: string, names: string[]): void {
  names.forEach((name: string) => {
    const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
    if (index === -1) {
      console.error('[Delete Deployments] can not find deployment:', name)
    } else {
      mockDeployments.splice(index, 1)
    }
  })
}

/**
 * 导出 Deployment CSV
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param params - 查询参数
 */
function exportDeployment(clusterId: string, namespace: string, params: Partial<DeploymentQueryReq>): void {
  const deployments = mockDeployments.filter(d => d.clusterId === clusterId && d.namespace === namespace)

  const headers = ['名称', '命名空间', '集群名称', '状态', '期望副本数', '就绪副本数', '可用副本数', '版本', '更新策略', '镜像', '标签', '创建时间', '创建人', '更新时间', '更新人']
  const rows = deployments.map(d => [
    d.name,
    d.namespace,
    d.clusterName,
    d.status,
    d.replicas,
    d.readyReplicas,
    d.availableReplicas,
    d.revision,
    d.strategy,
    d.images.join(';'),
    Object.entries(d.labels)
      .map(([k, v]) => `${k}=${v}`)
      .join(';'),
    d.createAt,
    d.createBy,
    d.updateAt,
    d.updateBy
  ])

  const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n')
  console.log('[Export Deployment CSV]', csvContent)
}

/**
 * 导入 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param data - YAML 配置
 */
function importDeployment(clusterId: string, namespace: string, data: Partial<DeploymentYamlReq>): void {
  console.log('[Import Deployment]', clusterId, namespace, data)
}

/**
 * 模拟 Deployment 数据
 * @remarks 包含系统组件、应用服务、监控组件等多种类型的 Deployment
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
    revision: 2,
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
    deletable: true,
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
    revision: 1,
    strategy: 'RollingUpdate',
    images: ['registry.k8s.io/coredns/coredns:v1.11.1'],
    selector: { 'k8s-app': 'kube-dns' },
    labels: {
      'k8s-app': 'kube-dns',
      'kubernetes.io/name': 'CoreDNS'
    },
    annotations: {},
    deletable: false,
    createAt: '2024-01-15 10:30:30',
    createBy: 'system',
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
    revision: 1,
    strategy: 'RollingUpdate',
    images: ['registry.k8s.io/metrics-server/metrics-server:v0.7.0'],
    selector: { 'k8s-app': 'metrics-server' },
    labels: {
      'k8s-app': 'metrics-server'
    },
    annotations: {},
    deletable: true,
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
    revision: 3,
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
    deletable: true,
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
    revision: 5,
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
    deletable: true,
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
    revision: 2,
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
    deletable: true,
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
    revision: 1,
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
    deletable: true,
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
    revision: 4,
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
    deletable: true,
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
    revision: 2,
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
    deletable: true,
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
    revision: 3,
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
    deletable: true,
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
    revision: 1,
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
    deletable: true,
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
    revision: 1,
    strategy: 'RollingUpdate',
    images: ['registry.example.com/frontend:v2.0.5'],
    selector: { app: 'staging-frontend' },
    labels: {
      app: 'staging-frontend',
      env: 'staging'
    },
    annotations: {},
    deletable: true,
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
    revision: 1,
    strategy: 'RollingUpdate',
    images: ['registry.example.com/backend:v3.1.0'],
    selector: { app: 'staging-backend' },
    labels: {
      app: 'staging-backend',
      env: 'staging'
    },
    annotations: {},
    deletable: true,
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
    revision: 1,
    strategy: 'RollingUpdate',
    images: ['registry.example.com/app:latest'],
    selector: { app: 'dev-app' },
    labels: {
      app: 'dev-app',
      env: 'development'
    },
    annotations: {},
    deletable: true,
    createAt: '2024-03-01 09:00:00',
    createBy: 'developer',
    updateAt: '2024-03-20 16:00:00',
    updateBy: 'developer'
  }
]
