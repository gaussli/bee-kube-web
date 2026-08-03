/**
 * Kubernetes 命名空间管理 Mock API
 * @module mock/kubernetes/namespace
 */
import type { PageVo } from '@/types/common'
import type {
  NamespaceQueryReq,
  NamespaceReq,
  NamespaceListResp,
  NamespaceDetailResp,
  NamespaceSimpleListResp,
  NamespaceLabelsReq,
  NamespaceAnnotationsReq,
  NamespaceQuotaReq,
  NamespaceImportReq
} from '@/types/kubernetes/namespace'
import { generateId } from '@/mock/utils'

/**
 * 命名空间路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces - 获取命名空间分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:name - 获取命名空间详情
 * - GET /kubernetes/clusters/:clusterId/namespaces/:name/yaml - 查看 YAML
 * - POST /kubernetes/clusters/:clusterId/namespaces - 创建命名空间
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:name - 更新命名空间
 * - POST /kubernetes/clusters/:clusterId/namespaces/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/namespaces/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:name - 删除命名空间
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/batch - 批量删除命名空间
 * - POST /kubernetes/clusters/:clusterId/namespaces/export - 导出命名空间
 * - POST /kubernetes/clusters/:clusterId/namespaces/import - 导入命名空间
 * - POST /kubernetes/clusters/:clusterId/namespaces/:name/quota - 创建配额
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:name/quota - 更新配额
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:name/quota - 删除配额
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces',
    handler: (
      pathParams: Record<string, string>,
      params: Partial<NamespaceQueryReq>
    ): PageVo<NamespaceListResp> | NamespaceSimpleListResp[] => getNamespacePage(pathParams.clusterId, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name',
    handler: (pathParams: Record<string, string>): NamespaceDetailResp =>
      getNamespaceDetail(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name/yaml',
    handler: (pathParams: Record<string, string>): string => getNamespaceYaml(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces',
    handler: (pathParams: Record<string, string>, data: Partial<NamespaceReq>): void =>
      createNamespace(pathParams.clusterId, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name',
    handler: (pathParams: Record<string, string>, data: Partial<NamespaceReq>): void =>
      updateNamespace(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name/labels',
    handler: (pathParams: Record<string, string>, data: Partial<NamespaceLabelsReq>): void =>
      manageNamespaceLabels(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name/annotations',
    handler: (pathParams: Record<string, string>, data: Partial<NamespaceAnnotationsReq>): void =>
      manageNamespaceAnnotations(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name',
    handler: (pathParams: Record<string, string>): void => deleteNamespace(pathParams.clusterId, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/batch',
    handler: (pathParams: Record<string, string>, data: string[]): void => deleteNamespaces(pathParams.clusterId, data)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/export',
    handler: (pathParams: Record<string, string>, params: Partial<NamespaceQueryReq>): void =>
      exportNamespaces(pathParams.clusterId, params)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/import',
    handler: (pathParams: Record<string, string>, data: Partial<NamespaceImportReq>): void =>
      importNamespaces(pathParams.clusterId, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name/quota',
    handler: (pathParams: Record<string, string>, data: Partial<NamespaceQuotaReq>): void =>
      createNamespaceQuota(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name/quota',
    handler: (pathParams: Record<string, string>, data: Partial<NamespaceQuotaReq>): void =>
      updateNamespaceQuota(pathParams.clusterId, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:name/quota',
    handler: (pathParams: Record<string, string>): void => deleteNamespaceQuota(pathParams.clusterId, pathParams.name)
  }
]

/**
 * 获取命名空间分页列表
 * @param clusterId - 集群ID
 * @param params - 查询参数
 * @returns 分页数据（normal）或简化列表（simple）
 */
function getNamespacePage(
  _clusterId: string,
  params: Partial<NamespaceQueryReq>
): PageVo<NamespaceListResp> | NamespaceSimpleListResp[] {
  const { id, name, status, mode = 'normal', page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockNamespaces]

  if (status) {
    filtered = filtered.filter(ns => ns.status === status)
  }

  if (id || name) {
    let searchFiltered: NamespaceListResp[] = []
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

  // simple 模式：不分页，仅返回 id、uid、name
  if (mode === 'simple') {
    return filtered.map(ns => ({
      id: ns.id,
      uid: ns.uid,
      name: ns.name
    }))
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)

  return { list, total, page, pageSize }
}

/**
 * 获取命名空间详情
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @returns 命名空间详情
 */
function getNamespaceDetail(clusterId: string, name: string): NamespaceDetailResp {
  const ns = mockNamespaces.find(n => n.clusterId === clusterId && n.name === name)
  if (!ns) {
    console.error('[Get Namespace Detail] can not find namespace:', clusterId, name)
  }
  return {
    ...ns!,
    labels: { 'app.kubernetes.io/name': ns!.name },
    annotations: { description: ns!.description || '' },
    resourceQuota: {
      requestsCpu: 4,
      requestsMemory: '8Gi',
      limitsCpu: 8,
      limitsMemory: '16Gi',
      persistentvolumeclaims: 10,
      servicesLoadbalancers: 2,
      countDeploymentsApps: 20,
      countPods: 50
    },
    limitRange: {
      container: {
        defaultCpu: 0.5,
        defaultMemory: 512,
        defaultRequestCpu: 0.25,
        defaultRequestMemory: 256,
        maxCpu: 2,
        maxMemory: 4096,
        minCpu: 0.1,
        minMemory: 128
      }
    }
  }
}

/**
 * 查看命名空间 YAML
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @returns 命名空间 YAML 配置
 */
function getNamespaceYaml(clusterId: string, name: string): string {
  const ns = mockNamespaces.find(n => n.clusterId === clusterId && n.name === name)
  if (!ns) {
    console.error('[Get Namespace Yaml] can not find namespace:', clusterId, name)
    return ''
  }

  const labels = Object.entries(ns.labels || {})
    .map(([key, value]) => `    ${key}: "${value}"`)
    .join('\n')

  const annotations = Object.entries(ns.annotations || {})
    .map(([key, value]) => `    ${key}: "${value}"`)
    .join('\n')

  const yaml = `apiVersion: v1
kind: Namespace
metadata:
  name: ${ns.name}
  ${ns.description ? `annotations:\n${annotations}` : ''}
  ${Object.keys(ns.labels || {}).length > 0 ? `labels:\n${labels}` : ''}
  creationTimestamp: "${ns.createAt}"
  resourceVersion: "${generateId()}"
  uid: "${generateId()}"
spec:
  finalizers:
    - kubernetes
status:
  phase: ${ns.status || 'Active'}`

  return yaml
}

/**
 * 创建命名空间
 * @param clusterId - 集群ID
 * @param data - 创建参数
 */
function createNamespace(clusterId: string, data: Partial<NamespaceReq>): void {
  console.log('[Create Namespace]', clusterId, data)
}

/**
 * 更新命名空间
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 更新参数
 */
function updateNamespace(clusterId: string, name: string, data: Partial<NamespaceReq>): void {
  console.log('[Update Namespace]', clusterId, name, data)
}

/**
 * 更新命名空间标签
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 标签数据
 */
function manageNamespaceLabels(clusterId: string, name: string, data: Partial<NamespaceLabelsReq>): void {
  console.log('[Manage Namespace Labels]', clusterId, name, data)
}

/**
 * 更新命名空间注解
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 注解数据
 */
function manageNamespaceAnnotations(clusterId: string, name: string, data: Partial<NamespaceAnnotationsReq>): void {
  console.log('[Manage Namespace Annotations]', clusterId, name, data)
}

/**
 * 删除命名空间
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 */
function deleteNamespace(clusterId: string, name: string): void {
  console.log('[Delete Namespace]', clusterId, name)
}

/**
 * 批量删除命名空间
 * @param clusterId - 集群ID
 * @param names - 命名空间名称数组
 */
function deleteNamespaces(clusterId: string, names: string[]): void {
  console.log('[Delete Namespaces]', clusterId, names)
}

/**
 * 导出命名空间 CSV
 * @param clusterId - 集群ID
 * @param params - 查询参数
 */
function exportNamespaces(clusterId: string, params: Partial<NamespaceQueryReq>): void {
  console.log('[Export Namespaces]', clusterId, params)
}

/**
 * 导入命名空间
 * @param clusterId - 集群ID
 * @param data - 导入配置
 */
function importNamespaces(clusterId: string, data: Partial<NamespaceImportReq>): void {
  console.log('[Import Namespaces]', clusterId, data)
}

/**
 * 创建命名空间配额
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 配额配置
 */
function createNamespaceQuota(clusterId: string, name: string, data: Partial<NamespaceQuotaReq>): void {
  console.log('[Create Namespace Quota]', clusterId, name, data)
}

/**
 * 更新命名空间配额
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 * @param data - 配额配置
 */
function updateNamespaceQuota(clusterId: string, name: string, data: Partial<NamespaceQuotaReq>): void {
  console.log('[Update Namespace Quota]', clusterId, name, data)
}

/**
 * 删除命名空间配额
 * @param clusterId - 集群ID
 * @param name - 命名空间名称
 */
function deleteNamespaceQuota(clusterId: string, name: string): void {
  console.log('[Delete Namespace Quota]', clusterId, name)
}

/**
 * 模拟命名空间数据
 * @remarks 包含系统命名空间、应用命名空间、监控命名空间等
 */
const mockNamespaces: NamespaceListResp[] = [
  {
    id: generateId(),
    uid: generateId(),
    name: 'default',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: 'Kubernetes 默认命名空间，未指定命名空间的资源默认归属于此',
    status: 'Active',
    type: 0,
    createBy: 'system',
    createAt: '2024-01-15 10:30:25',
    updateBy: 'system',
    updateAt: '2024-01-15 10:30:25'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'kube-system',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: 'Kubernetes 系统组件命名空间，包含 kube-dns、kube-proxy 等核心服务',
    status: 'Active',
    type: 0,
    createBy: 'system',
    createAt: '2024-01-15 10:30:30',
    updateBy: 'system',
    updateAt: '2024-01-15 10:30:30'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'kube-public',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '集群公共资源命名空间，对所有用户（含未认证用户）可读',
    status: 'Active',
    type: 0,
    createBy: 'system',
    createAt: '2024-01-15 10:30:35',
    updateBy: 'system',
    updateAt: '2024-01-15 10:30:35'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'kube-node-lease',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '节点心跳租约命名空间，存储各节点的 Lease 对象用于健康检测',
    status: 'Active',
    type: 0,
    createBy: 'system',
    createAt: '2024-01-15 10:30:40',
    updateBy: 'system',
    updateAt: '2024-01-15 10:30:40'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'istio-system',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: 'Istio 服务网格系统命名空间，包含 istiod、ingress-gateway 等控制面组件',
    status: 'Active',
    type: 0,
    createBy: 'system',
    createAt: '2024-01-20 09:00:00',
    updateBy: 'system',
    updateAt: '2024-03-10 11:20:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'cert-manager',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '证书管理命名空间，用于自动颁发和续期 TLS 证书',
    status: 'Active',
    type: 0,
    createBy: 'system',
    createAt: '2024-02-01 10:00:00',
    updateBy: 'system',
    updateAt: '2024-02-01 10:00:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'ingress-nginx',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: 'Nginx Ingress 控制器命名空间，管理集群七层流量入口和路由规则',
    status: 'Active',
    type: 0,
    createBy: 'system',
    createAt: '2024-01-18 14:00:00',
    updateBy: 'system',
    updateAt: '2024-05-10 08:30:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-frontend',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '前端应用命名空间，承载 Web 前端和 H5 页面服务',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-02-01 08:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-15 14:22:18'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-backend',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '后端应用命名空间，承载 API 服务和核心业务逻辑',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-02-01 08:05:00',
    updateBy: 'admin',
    updateAt: '2024-03-20 09:15:30'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-gateway',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '网关服务命名空间，用于统一 API 网关、限流和鉴权',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-02-05 09:00:00',
    updateBy: 'devops',
    updateAt: '2024-04-12 16:45:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-auth',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '认证授权命名空间，负责用户登录、Token 管理和权限校验',
    status: 'Active',
    type: 1,
    createBy: 'devops',
    createAt: '2024-02-08 10:30:00',
    updateBy: 'devops',
    updateAt: '2024-05-01 09:00:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-notification',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '消息通知命名空间，处理站内信、邮件和推送通知',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-02-12 08:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-25 14:10:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-payment',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '支付服务命名空间，处理交易、退款和对账流程',
    status: 'Active',
    type: 1,
    createBy: 'devops',
    createAt: '2024-02-15 11:00:00',
    updateBy: 'devops',
    updateAt: '2024-05-20 10:30:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-order',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '订单服务命名空间，管理订单的创建、流转和履约',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-02-18 09:30:00',
    updateBy: 'admin',
    updateAt: '2024-04-28 17:00:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-user',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '用户服务命名空间，管理用户资料、会员和账户信息',
    status: 'Active',
    type: 1,
    createBy: 'devops',
    createAt: '2024-02-20 08:15:00',
    updateBy: 'devops',
    updateAt: '2024-05-05 13:40:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-analytics',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '数据分析命名空间，用于用户行为采集和业务报表',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-03-01 10:00:00',
    updateBy: 'admin',
    updateAt: '2024-05-15 11:20:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'monitoring',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '监控服务命名空间，包含 Prometheus、Grafana 和 AlertManager 等组件',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-02-10 14:20:00',
    updateBy: 'admin',
    updateAt: '2024-02-10 14:20:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'logging',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '日志服务命名空间，用于集中采集、存储和检索应用日志',
    status: 'Terminating',
    statusMsg: '部分 Pod 仍在运行，等待资源清理中',
    type: 1,
    createBy: 'admin',
    createAt: '2024-02-15 09:00:00',
    updateBy: 'admin',
    updateAt: '2024-04-01 16:30:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'data-pipeline',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '数据管道命名空间，用于 ETL 任务和数据同步调度',
    status: 'Active',
    type: 1,
    createBy: 'developer',
    createAt: '2024-03-05 08:00:00',
    updateBy: 'developer',
    updateAt: '2024-06-01 09:30:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'ml-training',
    clusterId: generateId(),
    clusterName: 'prod-cluster',
    description: '机器学习训练命名空间，用于模型训练、调参和实验管理',
    status: 'Active',
    type: 1,
    createBy: 'developer',
    createAt: '2024-03-10 14:00:00',
    updateBy: 'developer',
    updateAt: '2024-06-10 16:45:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'staging-app',
    clusterId: generateId(),
    clusterName: 'staging-cluster',
    description: '预发布环境命名空间，用于生产上线前的集成验证',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-02-15 10:00:00',
    updateBy: 'admin',
    updateAt: '2024-02-15 10:00:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'qa-automation',
    clusterId: generateId(),
    clusterName: 'staging-cluster',
    description: '自动化测试命名空间，运行回归测试和端到端测试用例',
    status: 'Active',
    type: 1,
    createBy: 'developer',
    createAt: '2024-03-15 09:00:00',
    updateBy: 'developer',
    updateAt: '2024-04-20 11:00:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'dev-test',
    clusterId: generateId(),
    clusterName: 'dev-cluster',
    description: '开发测试命名空间，用于日常开发和单元测试',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-03-01 09:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-01 09:00:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'dev-sandbox',
    clusterId: generateId(),
    clusterName: 'dev-cluster',
    description: '开发沙箱命名空间，用于个人探索和原型验证',
    status: 'Terminating',
    statusMsg: '命名空间中存在未清理的 Finalizer 和残留资源',
    type: 1,
    createBy: 'developer',
    createAt: '2024-04-01 08:00:00',
    updateBy: 'developer',
    updateAt: '2024-05-20 18:00:00'
  }
]
