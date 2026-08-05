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
  NamespaceImportReq,
} from '@/types/kubernetes/namespace'

import { generateId } from '@/mock/utils'

/**
 * 命名空间路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterUid/namespaces - 获取命名空间分页列表
 * - GET /kubernetes/clusters/:clusterUid/namespaces/:name - 获取命名空间详情
 * - GET /kubernetes/clusters/:clusterUid/namespaces/:name/yaml - 查看 YAML
 * - POST /kubernetes/clusters/:clusterUid/namespaces - 创建命名空间
 * - PUT /kubernetes/clusters/:clusterUid/namespaces/:name - 更新命名空间
 * - POST /kubernetes/clusters/:clusterUid/namespaces/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterUid/namespaces/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:name - 删除命名空间
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/batch - 批量删除命名空间
 * - POST /kubernetes/clusters/:clusterUid/namespaces/export - 导出命名空间
 * - POST /kubernetes/clusters/:clusterUid/namespaces/import - 导入命名空间
 * - POST /kubernetes/clusters/:clusterUid/namespaces/:name/quota - 创建配额
 * - PUT /kubernetes/clusters/:clusterUid/namespaces/:name/quota - 更新配额
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:name/quota - 删除配额
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces',
    handler: ({
      pathParams,
      params,
    }: {
      pathParams: Record<string, string>
      params: Partial<NamespaceQueryReq>
    }): PageVo<NamespaceListResp> | NamespaceSimpleListResp[] => getNamespacePage(pathParams.clusterUid, params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): NamespaceDetailResp =>
      getNamespaceDetail(pathParams.clusterUid, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name/yaml',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): string =>
      getNamespaceYaml(pathParams.clusterUid, pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<NamespaceReq> }): void =>
      createNamespace(pathParams.clusterUid, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<NamespaceReq> }): void =>
      updateNamespace(pathParams.clusterUid, pathParams.name, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name/labels',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<NamespaceLabelsReq> }): void =>
      manageNamespaceLabels(pathParams.clusterUid, pathParams.name, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name/annotations',
    handler: ({
      pathParams,
      data,
    }: {
      pathParams: Record<string, string>
      data: Partial<NamespaceAnnotationsReq>
    }): void => manageNamespaceAnnotations(pathParams.clusterUid, pathParams.name, data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): void =>
      deleteNamespace(pathParams.clusterUid, pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/batch',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: string[] }): void =>
      deleteNamespaces(pathParams.clusterUid, data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/export',
    handler: ({
      pathParams,
      params,
    }: {
      pathParams: Record<string, string>
      params: Partial<NamespaceQueryReq>
    }): void => exportNamespaces(pathParams.clusterUid, params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/import',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<NamespaceImportReq> }): void =>
      importNamespaces(pathParams.clusterUid, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name/quota',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<NamespaceQuotaReq> }): void =>
      createNamespaceQuota(pathParams.clusterUid, pathParams.name, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name/quota',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<NamespaceQuotaReq> }): void =>
      updateNamespaceQuota(pathParams.clusterUid, pathParams.name, data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:name/quota',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): void =>
      deleteNamespaceQuota(pathParams.clusterUid, pathParams.name),
  },
]

/**
 * 获取命名空间分页列表
 * @param _clusterId - 集群 UID
 * @param params - 查询参数
 * @returns 分页数据（normal）或简化列表（simple）
 */
function getNamespacePage(
  _clusterId: string,
  params: Partial<NamespaceQueryReq>,
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
      name: ns.name,
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
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @returns 命名空间详情
 */
function getNamespaceDetail(clusterUid: string, name: string): NamespaceDetailResp {
  const ns = mockNamespaces.find(n => n.clusterUid === clusterUid && n.name === name)
  if (!ns) {
    console.error('[Get Namespace Detail] can not find namespace:', clusterUid, name)
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
      countPods: 50,
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
        minMemory: 128,
      },
    },
  }
}

/**
 * 查看命名空间 YAML
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @returns 命名空间 YAML 配置
 */
function getNamespaceYaml(clusterUid: string, name: string): string {
  const ns = mockNamespaces.find(n => n.clusterUid === clusterUid && n.name === name)
  if (!ns) {
    console.error('[Get Namespace Yaml] can not find namespace:', clusterUid, name)
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
 * @param clusterUid - 集群 UID
 * @param data - 创建参数
 */
function createNamespace(clusterUid: string, data: Partial<NamespaceReq>): void {
  console.log('[Create Namespace]', clusterUid, data)
}

/**
 * 更新命名空间
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param data - 更新参数
 */
function updateNamespace(clusterUid: string, name: string, data: Partial<NamespaceReq>): void {
  console.log('[Update Namespace]', clusterUid, name, data)
}

/**
 * 更新命名空间标签
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param data - 标签数据
 */
function manageNamespaceLabels(clusterUid: string, name: string, data: Partial<NamespaceLabelsReq>): void {
  console.log('[Manage Namespace Labels]', clusterUid, name, data)
}

/**
 * 更新命名空间注解
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param data - 注解数据
 */
function manageNamespaceAnnotations(clusterUid: string, name: string, data: Partial<NamespaceAnnotationsReq>): void {
  console.log('[Manage Namespace Annotations]', clusterUid, name, data)
}

/**
 * 删除命名空间
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 */
function deleteNamespace(clusterUid: string, name: string): void {
  console.log('[Delete Namespace]', clusterUid, name)
}

/**
 * 批量删除命名空间
 * @param clusterUid - 集群 UID
 * @param names - 命名空间名称数组
 */
function deleteNamespaces(clusterUid: string, names: string[]): void {
  console.log('[Delete Namespaces]', clusterUid, names)
}

/**
 * 导出命名空间 CSV
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 */
function exportNamespaces(clusterUid: string, params: Partial<NamespaceQueryReq>): void {
  console.log('[Export Namespaces]', clusterUid, params)
}

/**
 * 导入命名空间
 * @param clusterUid - 集群 UID
 * @param data - 导入配置
 */
function importNamespaces(clusterUid: string, data: Partial<NamespaceImportReq>): void {
  console.log('[Import Namespaces]', clusterUid, data)
}

/**
 * 创建命名空间配额
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param data - 配额配置
 */
function createNamespaceQuota(clusterUid: string, name: string, data: Partial<NamespaceQuotaReq>): void {
  console.log('[Create Namespace Quota]', clusterUid, name, data)
}

/**
 * 更新命名空间配额
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 * @param data - 配额配置
 */
function updateNamespaceQuota(clusterUid: string, name: string, data: Partial<NamespaceQuotaReq>): void {
  console.log('[Update Namespace Quota]', clusterUid, name, data)
}

/**
 * 删除命名空间配额
 * @param clusterUid - 集群 UID
 * @param name - 命名空间名称
 */
function deleteNamespaceQuota(clusterUid: string, name: string): void {
  console.log('[Delete Namespace Quota]', clusterUid, name)
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
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: 'Kubernetes 默认命名空间，未指定命名空间的资源默认归属于此。该命名空间由系统自动创建，通常用于存放集群级别的默认资源和服务',
    status: 'Active',
    type: 0,
    createBy: 'system',
    createAt: '2024-01-15 10:30:25',
    updateBy: 'system',
    updateAt: '2024-01-15 10:30:25',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'kube-system',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: 'Kubernetes 系统组件命名空间，包含 kube-dns、kube-proxy 等核心服务',
    status: 'Active',
    type: 0,
    createBy: 'system',
    createAt: '2024-01-15 10:30:30',
    updateBy: 'system',
    updateAt: '2024-01-15 10:30:30',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'kube-public',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: '集群公共资源命名空间，对所有用户（含未认证用户）可读',
    status: 'Active',
    type: 0,
    createBy: 'system',
    createAt: '2024-01-15 10:30:35',
    updateBy: 'system',
    updateAt: '2024-01-15 10:30:35',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'kube-node-lease',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: '节点心跳租约命名空间，存储各节点的 Lease 对象用于健康检测',
    status: 'Active',
    type: 0,
    createBy: 'system',
    createAt: '2024-01-15 10:30:40',
    updateBy: 'system',
    updateAt: '2024-01-15 10:30:40',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'istio-system',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: 'Istio 服务网格系统命名空间，包含 istiod、ingress-gateway 等控制面组件',
    status: 'Active',
    type: 0,
    createBy: 'system',
    createAt: '2024-01-20 09:00:00',
    updateBy: 'system',
    updateAt: '2024-03-10 11:20:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'cert-manager',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: '证书管理命名空间，用于自动颁发和续期 TLS 证书',
    status: 'Active',
    type: 0,
    createBy: 'system',
    createAt: '2024-02-01 10:00:00',
    updateBy: 'system',
    updateAt: '2024-02-01 10:00:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'ingress-nginx',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: 'Nginx Ingress 控制器命名空间，管理集群七层流量入口和路由规则',
    status: 'Active',
    type: 0,
    createBy: 'system',
    createAt: '2024-01-18 14:00:00',
    updateBy: 'system',
    updateAt: '2024-05-10 08:30:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-frontend',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: '前端应用命名空间，承载 Web 前端和 H5 页面服务',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-02-01 08:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-15 14:22:18',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-backend',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: '后端应用命名空间，承载 API 服务和核心业务逻辑',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-02-01 08:05:00',
    updateBy: 'admin',
    updateAt: '2024-03-20 09:15:30',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-gateway',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: '网关服务命名空间，用于统一 API 网关、限流和鉴权',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-02-05 09:00:00',
    updateBy: 'devops',
    updateAt: '2024-04-12 16:45:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-auth',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: '认证授权命名空间，负责用户登录、Token 管理和权限校验',
    status: 'Active',
    type: 1,
    createBy: 'devops',
    createAt: '2024-02-08 10:30:00',
    updateBy: 'devops',
    updateAt: '2024-05-01 09:00:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-notification',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: '消息通知命名空间，处理站内信、邮件和推送通知',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-02-12 08:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-25 14:10:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-payment',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: '支付服务命名空间，处理交易、退款和对账流程',
    status: 'Active',
    type: 1,
    createBy: 'devops',
    createAt: '2024-02-15 11:00:00',
    updateBy: 'devops',
    updateAt: '2024-05-20 10:30:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-order',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: '订单服务命名空间，管理订单的创建、流转和履约',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-02-18 09:30:00',
    updateBy: 'admin',
    updateAt: '2024-04-28 17:00:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-user',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: '用户服务命名空间，管理用户资料、会员和账户信息',
    status: 'Active',
    type: 1,
    createBy: 'devops',
    createAt: '2024-02-20 08:15:00',
    updateBy: 'devops',
    updateAt: '2024-05-05 13:40:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-analytics',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: '数据分析命名空间，用于用户行为采集和业务报表',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-03-01 10:00:00',
    updateBy: 'admin',
    updateAt: '2024-05-15 11:20:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'monitoring',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: '监控服务命名空间，包含 Prometheus、Grafana 和 AlertManager 等组件',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-02-10 14:20:00',
    updateBy: 'admin',
    updateAt: '2024-02-10 14:20:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'logging',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: '日志服务命名空间，用于集中采集、存储和检索应用日志',
    status: 'Terminating',
    statusMsg: '部分 Pod 仍在运行，等待资源清理中',
    type: 1,
    createBy: 'admin',
    createAt: '2024-02-15 09:00:00',
    updateBy: 'admin',
    updateAt: '2024-04-01 16:30:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'data-pipeline',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: '数据管道命名空间，用于 ETL 任务和数据同步调度',
    status: 'Active',
    type: 1,
    createBy: 'developer',
    createAt: '2024-03-05 08:00:00',
    updateBy: 'developer',
    updateAt: '2024-06-01 09:30:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'ml-training',
    clusterUid: generateId(),
    clusterName: 'prod-cluster',
    description: '机器学习训练命名空间，用于模型训练、调参和实验管理',
    status: 'Active',
    type: 1,
    createBy: 'developer',
    createAt: '2024-03-10 14:00:00',
    updateBy: 'developer',
    updateAt: '2024-06-10 16:45:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'staging-app',
    clusterUid: generateId(),
    clusterName: 'staging-cluster',
    description: '预发布环境命名空间，用于生产上线前的集成验证',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-02-15 10:00:00',
    updateBy: 'admin',
    updateAt: '2024-02-15 10:00:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'qa-automation',
    clusterUid: generateId(),
    clusterName: 'staging-cluster',
    description: '自动化测试命名空间，运行回归测试和端到端测试用例',
    status: 'Active',
    type: 1,
    createBy: 'developer',
    createAt: '2024-03-15 09:00:00',
    updateBy: 'developer',
    updateAt: '2024-04-20 11:00:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'dev-test',
    clusterUid: generateId(),
    clusterName: 'dev-cluster',
    description: '开发测试命名空间，用于日常开发和单元测试',
    status: 'Active',
    type: 1,
    createBy: 'admin',
    createAt: '2024-03-01 09:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-01 09:00:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'dev-sandbox',
    clusterUid: generateId(),
    clusterName: 'dev-cluster',
    description: '开发沙箱命名空间，用于个人探索和原型验证',
    status: 'Terminating',
    statusMsg: '命名空间中存在未清理的 Finalizer 和残留资源',
    type: 1,
    createBy: 'developer',
    createAt: '2024-04-01 08:00:00',
    updateBy: 'developer',
    updateAt: '2024-05-20 18:00:00',
  },
]
