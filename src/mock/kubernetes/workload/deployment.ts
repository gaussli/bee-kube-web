/**
 * Kubernetes Deployment 管理 Mock API
 * @module mock/kubernetes/workload/deployment
 */
import type { PageResp } from '@/types/common'
import type {
  DeploymentQueryReq,
  DeploymentReq,
  DeploymentListResp,
  DeploymentDetailResp,
  DeploymentLabelsReq,
  DeploymentAnnotationsReq,
  DeploymentScaleReq,
  DeploymentYamlReq
} from '@/types/kubernetes/workload/deployment'
import { generateId } from '@/mock/utils'

/**
 * Deployment 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/deployments - 获取 Deployment 分页列表
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
    url: '/kubernetes/clusters/:clusterId/deployments',
    handler: (pathParams: Record<string, string>, params: Partial<DeploymentQueryReq>): PageResp<DeploymentListResp> => getDeploymentPage(pathParams.clusterId, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/deployments/:name',
    handler: (pathParams: Record<string, string>): DeploymentDetailResp => getDeploymentDetail(pathParams.clusterId, pathParams.namespace, pathParams.name)
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
 * @param params - 查询参数
 * @returns 分页数据
 */
function getDeploymentPage(_clusterId: string, params: Partial<DeploymentQueryReq>): PageResp<DeploymentListResp> {
  const { id, name, namespace, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockDeployments]

  if (status) {
    filtered = filtered.filter(d => d.status === status)
  }
  if (namespace) {
    filtered = filtered.filter(d => d.namespace === namespace)
  }

  if (id || name) {
    let searchFiltered: DeploymentListResp[] = []
    if (id) {
      searchFiltered = [...searchFiltered, ...filtered.filter(n => n.id === id)]
      console.log(searchFiltered)
    }
    if (name) {
      searchFiltered = [...searchFiltered, ...filtered.filter(n => n.name.toLowerCase().includes(name.toLowerCase()))]
    }
    console.log(searchFiltered)
    // searchFiltered 基于 id 去重
    const seenIds = new Set<string>()
    filtered = searchFiltered.filter(n => {
      if (seenIds.has(n.id)) return false
      seenIds.add(n.id)
      return true
    })
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
function getDeploymentDetail(clusterId: string, namespace: string, name: string): DeploymentDetailResp {
  const deployment = mockDeployments.find(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (!deployment) {
    console.error('[Get Deployment Detail] can not find deployment:', clusterId, namespace, name)
  }
  return {
    ...deployment!,
    selector: { app: deployment!.name },
    labels: { app: deployment!.name },
    annotations: { 'description': deployment!.description || '' },
    containers: [
      {
        name: deployment!.name,
        image: `${deployment!.name}:latest`
      }
    ]
  }
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
  console.log('[Create Deployment]', clusterId, namespace, data)
}

/**
 * 更新 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param data - 更新参数
 */
function updateDeployment(clusterId: string, namespace: string, name: string, data: Partial<DeploymentReq>): void {
  console.log('[Update Deployment]', clusterId, namespace, name, data)
}

/**
 * 扩缩容 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param data - 扩缩容参数
 */
function scaleDeployment(clusterId: string, namespace: string, name: string, data: Partial<DeploymentScaleReq>): void {
  console.log('[Scale Deployment]', clusterId, namespace, name, data)
}

/**
 * 重启 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 */
function restartDeployment(clusterId: string, namespace: string, name: string): void {
  console.log('[Restart Deployment]', clusterId, namespace, name)
}

/**
 * 回滚 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 */
function rollbackDeployment(clusterId: string, namespace: string, name: string): void {
  console.log('[Rollback Deployment]', clusterId, namespace, name)
}

/**
 * 更新 Deployment 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param data - 标签数据
 */
function manageDeploymentLabels(clusterId: string, namespace: string, name: string, data: Partial<DeploymentLabelsReq>): void {
  console.log('[Manage Deployment Labels]', clusterId, namespace, name, data)
}

/**
 * 更新 Deployment 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param data - 注解数据
 */
function manageDeploymentAnnotations(clusterId: string, namespace: string, name: string, data: Partial<DeploymentAnnotationsReq>): void {
  console.log('[Manage Deployment Annotations]', clusterId, namespace, name, data)
}

/**
 * 删除 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 */
function deleteDeployment(clusterId: string, namespace: string, name: string): void {
  console.log('[Delete Deployment]', clusterId, namespace, name)
}

/**
 * 批量删除 Deployment
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param names - Deployment 名称数组
 */
function deleteDeployments(clusterId: string, namespace: string, names: string[]): void {
  console.log('[Delete Deployments]', clusterId, namespace, names)
}

/**
 * 导出 Deployment CSV
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param params - 查询参数
 */
function exportDeployment(clusterId: string, namespace: string, params: Partial<DeploymentQueryReq>): void {
  console.log('[Export Deployment]', clusterId, namespace, params)
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
const mockDeployments: DeploymentListResp[] = [
  // ==================== Running（运行中）- 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'nginx-ingress-controller',
    namespace: 'kube-system',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: 'Kubernetes Ingress 控制器，管理集群七层流量入口和路由规则',
    status: 'Running',
    replicas: 3,
    availableReplicas: 3,
    strategyType: 'RollingUpdate',
    createAt: '2024-01-15 10:30:25',
    createBy: 'admin',
    updateAt: '2024-03-20 14:22:18',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'coredns',
    namespace: 'kube-system',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: 'Kubernetes 集群 DNS 服务，负责集群内部域名解析',
    status: 'Running',
    replicas: 2,
    availableReplicas: 2,
    strategyType: 'RollingUpdate',
    createAt: '2024-01-15 10:30:30',
    createBy: 'system',
    updateAt: '2024-03-19 16:45:30',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'metrics-server',
    namespace: 'kube-system',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: 'Kubernetes 资源指标采集服务，为 HPA 和 kubectl top 提供 CPU/内存数据',
    status: 'Running',
    replicas: 1,
    availableReplicas: 1,
    strategyType: 'RollingUpdate',
    createAt: '2024-01-20 11:00:00',
    createBy: 'admin',
    updateAt: '2024-03-18 14:00:00',
    updateBy: 'admin'
  },
  // ==================== Available（部分就绪）- 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'frontend-app',
    namespace: 'app-frontend',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '前端应用服务，承载 Web 前端页面和 H5 渲染',
    status: 'Available',
    replicas: 5,
    availableReplicas: 5,
    strategyType: 'RollingUpdate',
    createAt: '2024-02-01 08:00:00',
    createBy: 'developer',
    updateAt: '2024-03-20 10:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'backend-api',
    namespace: 'app-backend',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '后端 API 服务，提供核心业务逻辑和数据接口',
    status: 'Available',
    replicas: 10,
    availableReplicas: 10,
    strategyType: 'RollingUpdate',
    createAt: '2024-02-01 08:05:00',
    createBy: 'developer',
    updateAt: '2024-03-20 11:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'order-service',
    namespace: 'app-backend',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '订单服务，管理订单的创建、流转和履约',
    status: 'Available',
    replicas: 6,
    availableReplicas: 6,
    strategyType: 'RollingUpdate',
    createAt: '2024-02-15 10:05:00',
    createBy: 'developer',
    updateAt: '2024-03-18 14:00:00',
    updateBy: 'developer'
  },
  // ==================== Stopped（已停止）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'staging-frontend',
    namespace: 'staging-app',
    clusterId: generateId(),
    clusterName: 'staging-cluster',
    description: '预发布前端应用，用于生产上线前的集成验证',
    status: 'Stopped',
    statusMessage: '副本已缩容至 0，服务已停止',
    replicas: 2,
    availableReplicas: 0,
    strategyType: 'RollingUpdate',
    createAt: '2024-02-15 10:20:00',
    createBy: 'developer',
    updateAt: '2024-03-19 15:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'dev-app',
    namespace: 'dev-test',
    clusterId: generateId(),
    clusterName: 'dev-cluster',
    description: '开发环境应用，用于日常开发和单元测试',
    status: 'Stopped',
    statusMessage: '开发环境已暂停，副本缩容为 0',
    replicas: 1,
    availableReplicas: 0,
    strategyType: 'RollingUpdate',
    createAt: '2024-03-01 09:00:00',
    createBy: 'developer',
    updateAt: '2024-03-20 16:00:00',
    updateBy: 'developer'
  },
  // ==================== Creating（创建中）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'api-gateway',
    namespace: 'app-backend',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: 'API 网关服务，统一管理和路由所有后端接口请求',
    status: 'Creating',
    statusMessage: 'Pod 正在创建中，等待容器就绪',
    replicas: 3,
    availableReplicas: 1,
    strategyType: 'RollingUpdate',
    createAt: '2024-03-19 14:00:00',
    createBy: 'developer',
    updateAt: '2024-03-19 14:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'search-service',
    namespace: 'app-backend',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '全文检索服务，基于 Elasticsearch 提供高性能搜索能力',
    status: 'Creating',
    statusMessage: '容器镜像正在拉取，Pod 初始化中',
    replicas: 2,
    availableReplicas: 0,
    strategyType: 'Recreate',
    createAt: '2024-03-20 09:30:00',
    createBy: 'developer',
    updateAt: '2024-03-20 09:30:00',
    updateBy: 'developer'
  },
  // ==================== Updating（更新中）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'user-service',
    namespace: 'app-backend',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '用户服务，管理用户资料、会员和账户信息',
    status: 'Updating',
    statusMessage: '滚动更新进行中，旧版本 Pod 正在被逐步替换',
    replicas: 8,
    availableReplicas: 5,
    strategyType: 'RollingUpdate',
    createAt: '2024-02-15 10:00:00',
    createBy: 'developer',
    updateAt: '2024-03-19 16:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'notification-service',
    namespace: 'app-backend',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '消息推送服务，处理短信、邮件和站内信的批量发送',
    status: 'Updating',
    statusMessage: '更新中，新版本 Pod 健康检查尚未通过',
    replicas: 4,
    availableReplicas: 2,
    strategyType: 'RollingUpdate',
    createAt: '2024-02-20 09:00:00',
    createBy: 'developer',
    updateAt: '2024-03-20 15:30:00',
    updateBy: 'developer'
  },
  // ==================== Terminating（终止中）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'prometheus',
    namespace: 'monitoring',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: 'Prometheus 监控系统，采集和存储集群与应用指标数据',
    status: 'Terminating',
    statusMessage: '正在删除 Pod，等待资源回收',
    replicas: 2,
    availableReplicas: 0,
    strategyType: 'Recreate',
    createAt: '2024-02-10 14:20:00',
    createBy: 'admin',
    updateAt: '2024-03-15 09:30:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'grafana',
    namespace: 'monitoring',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: 'Grafana 可视化平台，提供监控面板和告警图表展示',
    status: 'Terminating',
    statusMessage: 'Finalizer 未清理，删除流程阻塞中',
    replicas: 1,
    availableReplicas: 0,
    strategyType: 'Recreate',
    createAt: '2024-02-10 14:25:00',
    createBy: 'admin',
    updateAt: '2024-03-15 09:35:00',
    updateBy: 'admin'
  },
  // ==================== CreateTimeout（创建超时）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'config-center',
    namespace: 'staging-app',
    clusterId: generateId(),
    clusterName: 'staging-cluster',
    description: '配置中心服务，统一管理各应用的运行时配置',
    status: 'CreateTimeout',
    statusMessage: '创建超时：节点资源不足，Pod 无法调度',
    replicas: 2,
    availableReplicas: 0,
    strategyType: 'RollingUpdate',
    createAt: '2024-03-20 08:00:00',
    createBy: 'developer',
    updateAt: '2024-03-20 10:30:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'data-sync',
    namespace: 'staging-app',
    clusterId: generateId(),
    clusterName: 'staging-cluster',
    description: '数据同步服务，负责跨环境数据定时同步和校验',
    status: 'CreateTimeout',
    statusMessage: '超过 10 分钟未完成创建，镜像仓库连接超时',
    replicas: 3,
    availableReplicas: 0,
    strategyType: 'RollingUpdate',
    createAt: '2024-03-19 17:00:00',
    createBy: 'developer',
    updateAt: '2024-03-19 17:12:00',
    updateBy: 'developer'
  },
  // ==================== UpdateTimeout（更新超时）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'payment-service',
    namespace: 'app-backend',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '支付服务，处理交易、退款和对账流程',
    status: 'UpdateTimeout',
    statusMessage: '滚动更新超时，新版本 Pod 健康检查持续失败',
    replicas: 4,
    availableReplicas: 1,
    strategyType: 'RollingUpdate',
    createAt: '2024-02-15 10:10:00',
    createBy: 'developer',
    updateAt: '2024-03-20 08:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'redis-cache',
    namespace: 'app-backend',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: 'Redis 缓存服务，提供高性能内存数据缓存',
    status: 'UpdateTimeout',
    statusMessage: '更新超时：持久化数据迁移耗时超过预期',
    replicas: 3,
    availableReplicas: 2,
    strategyType: 'Recreate',
    createAt: '2024-02-15 10:15:00',
    createBy: 'developer',
    updateAt: '2024-03-17 11:00:00',
    updateBy: 'developer'
  },
  // ==================== Failed（失败异常）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'log-collector',
    namespace: 'monitoring',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '日志采集服务，统一收集和转发各应用日志到日志平台',
    status: 'Failed',
    statusMessage: '所有 Pod 启动失败，CrashLoopBackOff',
    replicas: 2,
    availableReplicas: 0,
    strategyType: 'RollingUpdate',
    createAt: '2024-02-28 08:00:00',
    createBy: 'admin',
    updateAt: '2024-03-20 16:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'staging-backend',
    namespace: 'staging-app',
    clusterId: generateId(),
    clusterName: 'staging-cluster',
    description: '预发布后端应用，用于接口联调和回归测试',
    status: 'Failed',
    statusMessage: '部署失败：OOMKilled，内存不足导致 Pod 被杀死',
    replicas: 2,
    availableReplicas: 0,
    strategyType: 'RollingUpdate',
    createAt: '2024-02-15 10:25:00',
    createBy: 'developer',
    updateAt: '2024-03-19 15:05:00',
    updateBy: 'developer'
  },
  // ==================== Unknown（未知）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'report-service',
    namespace: 'app-backend',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '报表服务，定时生成和导出业务数据报表',
    status: 'Unknown',
    statusMessage: '无法获取 Deployment 状态，API Server 连接异常',
    replicas: 3,
    availableReplicas: 0,
    strategyType: 'RollingUpdate',
    createAt: '2024-01-20 10:00:00',
    createBy: 'developer',
    updateAt: '2024-03-20 17:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'sentinel-dashboard',
    namespace: 'monitoring',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: 'Sentinel 流量控制面板，提供限流、熔断规则管理',
    status: 'Unknown',
    statusMessage: '状态信息丢失，可能与 Etcd 连接中断有关',
    replicas: 1,
    availableReplicas: 0,
    strategyType: 'RollingUpdate',
    createAt: '2024-03-01 14:00:00',
    createBy: 'admin',
    updateAt: '2024-03-20 10:00:00',
    updateBy: 'admin'
  }
]
