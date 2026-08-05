/**
 * Kubernetes ConfigMap 管理 Mock API
 * @module mock/kubernetes/config/configmap
 */
import type { PageVo } from '@/types/common'
import type {
  ConfigMapAnnotationsReq,
  ConfigMapDataReq,
  ConfigMapDetailResp,
  ConfigMapLabelsReq,
  ConfigMapListResp,
  ConfigMapQueryReq,
  ConfigMapReq,
  ConfigMapYamlReq,
} from '@/types/kubernetes/config/configmap'

import { generateId } from '@/mock/utils'

/**
 * ConfigMap 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/configmaps - 获取 ConfigMap 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name - 获取 ConfigMap 详情
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/yaml - 查看 YAML
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps - 创建 ConfigMap
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name - 更新 ConfigMap
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/data - 更新数据
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name - 删除 ConfigMap
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/batch - 批量删除
 * - GET /kubernetes/clusters/:clusterId/configmaps/export - 导出 CSV
 * - POST /kubernetes/clusters/:clusterId/configmaps/import - 导入 ConfigMap
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/configmaps',
    handler: ({ pathParams, params }: { pathParams: Record<string, string>; params: Partial<ConfigMapQueryReq> }): PageVo<ConfigMapListResp> =>
      getConfigMapList(pathParams.clusterId, params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): ConfigMapDetailResp =>
      getConfigMapDetail(pathParams.clusterId, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/yaml',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): string =>
      getConfigMapYaml(pathParams.clusterId, pathParams.namespace, pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: ConfigMapReq }): void =>
      createConfigMap(pathParams.clusterId, pathParams.namespace, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<ConfigMapReq> }): void =>
      updateConfigMap(pathParams.clusterId, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/data',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: ConfigMapDataReq }): void =>
      manageConfigMapData(pathParams.clusterId, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/labels',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: ConfigMapLabelsReq }): void =>
      manageConfigMapLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name/annotations',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: ConfigMapAnnotationsReq }): void =>
      manageConfigMapAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): void =>
      deleteConfigMap(pathParams.clusterId, pathParams.namespace, pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/configmaps/batch',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: string[] }): void =>
      deleteConfigMaps(pathParams.clusterId, pathParams.namespace, data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/configmaps/export',
    handler: ({ pathParams, params }: { pathParams: Record<string, string>; params: Partial<ConfigMapQueryReq> }): void =>
      exportConfigMap(pathParams.clusterId, params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/configmaps/import',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: ConfigMapYamlReq }): void =>
      importConfigMap(pathParams.clusterId, data),
  },
]

/**
 * 获取 ConfigMap 分页列表
 * @param _clusterId - 集群ID
 * @param params - 查询参数（含 namespace 筛选）
 * @returns 分页数据
 */
function getConfigMapList(_clusterId: string, params: Partial<ConfigMapQueryReq>): PageVo<ConfigMapListResp> {
  const { id, name, namespace, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockConfigMaps]

  if (namespace) {
    filtered = filtered.filter(c => c.namespace === namespace)
  }

  if (id || name) {
    let searchFiltered: ConfigMapListResp[] = []
    if (id) {
      searchFiltered = [...searchFiltered, ...filtered.filter(n => n.id === id)]
    }
    if (name) {
      searchFiltered = [...searchFiltered, ...filtered.filter(n => n.name.toLowerCase().includes(name.toLowerCase()))]
    }
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
 * 获取 ConfigMap 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @returns ConfigMap 详情
 */
function getConfigMapDetail(clusterId: string, namespace: string, name: string): ConfigMapDetailResp {
  const cm = mockConfigMaps.find(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (!cm) return null as any
  return {
    ...cm,
    clusterName: 'prod-cluster',
    data: {},
    labels: {},
    annotations: {},
    dataKeysCount: cm.dataKeysCount || 0,
  }
}

/**
 * 查看 ConfigMap YAML
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @returns ConfigMap YAML 配置
 */
function getConfigMapYaml(clusterId: string, namespace: string, name: string): string {
  const cm = mockConfigMaps.find(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (!cm) {
    console.error('[Get ConfigMap Yaml] can not find configmap:', clusterId, namespace, name)
    return ''
  }

  return `apiVersion: v1
kind: ConfigMap
metadata:
  name: ${cm.name}
  namespace: ${cm.namespace}
  creationTimestamp: "${cm.createAt}"
  uid: "${cm.uid}"
data:
  key1: value1
  key2: value2`
}

/**
 * 创建 ConfigMap
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建数据
 */
function createConfigMap(clusterId: string, namespace: string, data: ConfigMapReq): void {
  console.log('[Mock] createConfigMap', { clusterId, namespace, data })
}

/**
 * 更新 ConfigMap
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 更新数据
 */
function updateConfigMap(clusterId: string, namespace: string, name: string, data: Partial<ConfigMapReq>): void {
  console.log('[Mock] updateConfigMap', { clusterId, namespace, name, data })
}

/**
 * 更新 ConfigMap 数据
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 数据参数
 */
function manageConfigMapData(clusterId: string, namespace: string, name: string, data: ConfigMapDataReq): void {
  console.log('[Mock] manageConfigMapData', { clusterId, namespace, name, data })
}

/**
 * 更新 ConfigMap 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 标签数据
 */
function manageConfigMapLabels(clusterId: string, namespace: string, name: string, data: ConfigMapLabelsReq): void {
  console.log('[Mock] manageConfigMapLabels', { clusterId, namespace, name, data })
}

/**
 * 更新 ConfigMap 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 * @param data - 注解数据
 */
function manageConfigMapAnnotations(
  clusterId: string,
  namespace: string,
  name: string,
  data: ConfigMapAnnotationsReq,
): void {
  console.log('[Mock] manageConfigMapAnnotations', { clusterId, namespace, name, data })
}

/**
 * 删除 ConfigMap
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - ConfigMap 名称
 */
function deleteConfigMap(clusterId: string, namespace: string, name: string): void {
  console.log('[Mock] deleteConfigMap', { clusterId, namespace, name })
}

/**
 * 批量删除 ConfigMap
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - ConfigMap 名称数组
 */
function deleteConfigMaps(clusterId: string, namespace: string, names: string[]): void {
  console.log('[Mock] deleteConfigMaps', { clusterId, namespace, names })
}

/**
 * 导出 ConfigMap CSV
 * @param clusterId - 集群ID
 * @param params - 查询参数
 */
function exportConfigMap(clusterId: string, params: Partial<ConfigMapQueryReq>): void {
  console.log('[Mock] exportConfigMap', { clusterId, params })
}

/**
 * 导入 ConfigMap
 * @param clusterId - 集群ID
 * @param data - YAML 配置
 */
function importConfigMap(clusterId: string, data: ConfigMapYamlReq): void {
  console.log('[Mock] importConfigMap', { clusterId, data })
}

/**
 * 模拟 ConfigMap 数据
 * @remarks 列表接口直接使用 ListResp 数据，详情接口在此基础上扩展 DetailResp 字段
 */
const mockConfigMaps: ConfigMapListResp[] = [
  // ==================== default 命名空间 - 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'nginx-config',
    namespace: 'default',
    clusterId: generateId(),
    description: 'Nginx 反向代理配置文件，包含 upstream 和 server 规则',
    refs: ['deploy-004'],
    dataKeysCount: 2,
    deletable: false,
    createAt: '2024-01-15 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-10 14:00:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'app-env',
    namespace: 'default',
    clusterId: generateId(),
    description: '应用环境变量，定义数据库连接、日志级别等运行时参数',
    refs: ['deploy-001', 'deploy-002'],
    dataKeysCount: 5,
    deletable: true,
    createAt: '2024-02-01 09:00:00',
    createBy: 'developer',
    updateAt: '2024-03-15 11:00:00',
    updateBy: 'developer',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'tls-certs',
    namespace: 'default',
    clusterId: generateId(),
    description: 'TLS 证书配置，包含服务端证书链和私钥',
    refs: ['deploy-001'],
    dataKeysCount: 3,
    deletable: false,
    createAt: '2024-01-20 08:30:00',
    createBy: 'admin',
    updateAt: '2024-06-15 10:00:00',
    updateBy: 'admin',
  },
  // ==================== kube-system 命名空间 - 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'coredns',
    namespace: 'kube-system',
    clusterId: generateId(),
    description: 'CoreDNS 集群 DNS 服务配置，定义上游转发和域名解析规则',
    refs: ['deploy-coredns'],
    dataKeysCount: 1,
    deletable: false,
    createAt: '2024-01-15 10:00:00',
    createBy: 'system',
    updateAt: '2024-03-20 09:00:00',
    updateBy: 'system',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'kube-proxy',
    namespace: 'kube-system',
    clusterId: generateId(),
    description: 'kube-proxy 代理配置，管理 Service 网络转发与负载均衡模式',
    refs: [],
    dataKeysCount: 2,
    deletable: false,
    createAt: '2024-01-15 10:00:00',
    createBy: 'system',
    updateAt: '2024-01-15 10:00:00',
    updateBy: 'system',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'kubelet-config',
    namespace: 'kube-system',
    clusterId: generateId(),
    description: 'Kubelet 运行时参数，包含 Pod 驱逐阈值、镜像拉取策略等',
    refs: [],
    dataKeysCount: 8,
    deletable: false,
    createAt: '2024-01-15 10:00:00',
    createBy: 'system',
    updateAt: '2024-02-28 16:00:00',
    updateBy: 'admin',
  },
  // ==================== app-backend 命名空间 - 5 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'backend-env',
    namespace: 'app-backend',
    clusterId: generateId(),
    description: '后端应用通用环境变量，含数据库、Redis、消息队列连接信息',
    refs: ['deploy-005', 'deploy-008'],
    dataKeysCount: 12,
    deletable: true,
    createAt: '2024-02-01 09:00:00',
    createBy: 'developer',
    updateAt: '2024-03-15 11:00:00',
    updateBy: 'developer',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'api-gateway-routes',
    namespace: 'app-backend',
    clusterId: generateId(),
    description: 'API 网关路由规则，定义请求路径、限流和熔断策略',
    refs: ['deploy-009'],
    dataKeysCount: 6,
    deletable: true,
    createAt: '2024-03-01 14:00:00',
    createBy: 'developer',
    updateAt: '2024-06-10 09:30:00',
    updateBy: 'developer',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'user-service-config',
    namespace: 'app-backend',
    clusterId: generateId(),
    description: '用户服务业务配置，含登录态有效期、密码策略、验证码规则',
    refs: ['deploy-012'],
    dataKeysCount: 15,
    deletable: true,
    createAt: '2024-02-15 10:00:00',
    createBy: 'developer',
    updateAt: '2024-04-20 16:00:00',
    updateBy: 'developer',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'order-service-config',
    namespace: 'app-backend',
    clusterId: generateId(),
    description: '订单服务配置，定义订单超时时间、库存预占策略和结算规则',
    refs: ['deploy-006'],
    dataKeysCount: 9,
    deletable: true,
    createAt: '2024-02-15 10:05:00',
    createBy: 'developer',
    updateAt: '2024-05-18 14:00:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'payment-channel-config',
    namespace: 'app-backend',
    clusterId: generateId(),
    description: '支付渠道配置，包含支付宝、微信、银联各渠道的 appId 和回调地址',
    refs: ['deploy-014'],
    dataKeysCount: 7,
    deletable: false,
    createAt: '2024-03-01 10:00:00',
    createBy: 'admin',
    updateAt: '2024-06-01 08:00:00',
    updateBy: 'admin',
  },
  // ==================== app-frontend 命名空间 - 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'feature-flags',
    namespace: 'app-frontend',
    clusterId: generateId(),
    description: '前端功能开关配置，控制暗黑模式、Beta 功能和灰度发布',
    refs: ['deploy-004'],
    dataKeysCount: 3,
    deletable: true,
    createAt: '2024-03-01 10:00:00',
    createBy: 'developer',
    updateAt: '2024-03-19 08:00:00',
    updateBy: 'developer',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'nginx-static-rules',
    namespace: 'app-frontend',
    clusterId: generateId(),
    description: '前端静态资源 Nginx 规则，定义缓存策略、CORS 和 Gzip 压缩',
    refs: ['deploy-004'],
    dataKeysCount: 4,
    deletable: true,
    createAt: '2024-02-10 09:00:00',
    createBy: 'developer',
    updateAt: '2024-05-01 11:00:00',
    updateBy: 'developer',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'cdn-config',
    namespace: 'app-frontend',
    clusterId: generateId(),
    description: 'CDN 加速配置，定义域名、回源地址和缓存刷新规则',
    refs: [],
    dataKeysCount: 5,
    deletable: true,
    createAt: '2024-03-15 10:00:00',
    createBy: 'developer',
    updateAt: '2024-06-02 14:00:00',
    updateBy: 'admin',
  },
  // ==================== monitoring 命名空间 - 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'prometheus-config',
    namespace: 'monitoring',
    clusterId: generateId(),
    description: 'Prometheus 监控采集配置，定义采集目标、抓取间隔和告警规则',
    refs: ['deploy-006'],
    dataKeysCount: 2,
    deletable: false,
    createAt: '2024-02-10 14:00:00',
    createBy: 'admin',
    updateAt: '2024-03-12 16:00:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'grafana-dashboards',
    namespace: 'monitoring',
    clusterId: generateId(),
    description: 'Grafana 仪表盘 JSON 配置，包含集群总览、节点监控和应用看板',
    refs: ['deploy-007'],
    dataKeysCount: 4,
    deletable: true,
    createAt: '2024-02-10 14:30:00',
    createBy: 'admin',
    updateAt: '2024-04-01 10:00:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'alertmanager-config',
    namespace: 'monitoring',
    clusterId: generateId(),
    description: 'AlertManager 告警管理配置，定义告警路由、静默规则和通知渠道',
    refs: ['deploy-006'],
    dataKeysCount: 3,
    deletable: false,
    createAt: '2024-02-10 15:00:00',
    createBy: 'admin',
    updateAt: '2024-05-15 09:00:00',
    updateBy: 'admin',
  },
  // ==================== middleware 命名空间 - 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'redis-cluster-config',
    namespace: 'middleware',
    clusterId: generateId(),
    description: 'Redis 集群配置，包含节点列表、主从关系、持久化与内存淘汰策略',
    refs: ['deploy-015'],
    dataKeysCount: 4,
    deletable: false,
    createAt: '2024-02-20 10:00:00',
    createBy: 'admin',
    updateAt: '2024-04-10 11:00:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'mysql-config',
    namespace: 'middleware',
    clusterId: generateId(),
    description: 'MySQL 数据库配置，定义连接池、慢查询阈值和字符集参数',
    refs: ['deploy-016'],
    dataKeysCount: 6,
    deletable: false,
    createAt: '2024-02-20 10:30:00',
    createBy: 'admin',
    updateAt: '2024-05-20 15:00:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'kafka-broker-config',
    namespace: 'middleware',
    clusterId: generateId(),
    description: 'Kafka Broker 配置，定义分区数、副本因子和消息保留策略',
    refs: ['deploy-017'],
    dataKeysCount: 8,
    deletable: false,
    createAt: '2024-03-01 09:00:00',
    createBy: 'admin',
    updateAt: '2024-06-05 10:00:00',
    updateBy: 'admin',
  },
  // ==================== logging 命名空间 - 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'fluentd-config',
    namespace: 'logging',
    clusterId: generateId(),
    description: 'Fluentd 日志采集配置，定义输入源、过滤规则和输出目标',
    refs: ['deploy-018'],
    dataKeysCount: 5,
    deletable: true,
    createAt: '2024-03-10 08:00:00',
    createBy: 'admin',
    updateAt: '2024-06-12 09:00:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'log-retention-policy',
    namespace: 'logging',
    clusterId: generateId(),
    description: '日志保留策略，定义各应用日志级别、保留天数和归档规则',
    refs: [],
    dataKeysCount: 3,
    deletable: true,
    createAt: '2024-03-10 08:30:00',
    createBy: 'admin',
    updateAt: '2024-06-12 10:00:00',
    updateBy: 'admin',
  },
  // ==================== staging 命名空间 - 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'staging-env-override',
    namespace: 'staging',
    clusterId: generateId(),
    description: '预发布环境覆盖配置，将生产配置中的外部依赖指向 staging 环境',
    refs: ['deploy-019', 'deploy-020'],
    dataKeysCount: 8,
    deletable: true,
    createAt: '2024-04-01 10:00:00',
    createBy: 'developer',
    updateAt: '2024-06-08 14:00:00',
    updateBy: 'developer',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'staging-db-connection',
    namespace: 'staging',
    clusterId: generateId(),
    description: '预发布数据库连接信息，连接 staging 环境独立数据库实例',
    refs: ['deploy-019'],
    dataKeysCount: 4,
    deletable: true,
    createAt: '2024-04-01 10:30:00',
    createBy: 'developer',
    updateAt: '2024-05-25 16:00:00',
    updateBy: 'developer',
  },
]
