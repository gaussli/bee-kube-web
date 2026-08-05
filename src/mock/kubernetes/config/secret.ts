/**
 * Kubernetes Secret 管理 Mock API
 * @module mock/kubernetes/config/secret
 */
import type { PageVo } from '@/types/common'
import type {
  SecretAnnotationsReq,
  SecretDataReq,
  SecretDetailResp,
  SecretLabelsReq,
  SecretListResp,
  SecretQueryReq,
  SecretReq,
  SecretYamlReq,
} from '@/types/kubernetes/config/secret'

import { generateId } from '@/mock/utils'

/**
 * Secret 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterUid/secrets - 获取 Secret 分页列表
 * - GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name - 获取 Secret 详情
 * - GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/yaml - 查看 YAML
 * - POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets - 创建 Secret
 * - PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name - 更新 Secret
 * - PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/data - 更新数据
 * - PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name - 删除 Secret
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/batch - 批量删除
 * - GET /kubernetes/clusters/:clusterUid/secrets/export - 导出 CSV
 * - POST /kubernetes/clusters/:clusterUid/secrets/import - 导入 Secret
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/secrets',
    handler: ({
      pathParams,
      params,
    }: {
      pathParams: Record<string, string>
      params: Partial<SecretQueryReq>
    }): PageVo<SecretListResp> => getSecretList(pathParams.clusterUid, params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): SecretDetailResp =>
      getSecretDetail(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/yaml',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): string =>
      getSecretYaml(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: SecretReq }): void =>
      createSecret(pathParams.clusterUid, pathParams.namespace, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<SecretReq> }): void =>
      updateSecret(pathParams.clusterUid, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/data',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: SecretDataReq }): void =>
      manageSecretData(pathParams.clusterUid, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/labels',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: SecretLabelsReq }): void =>
      manageSecretLabels(pathParams.clusterUid, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/annotations',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: SecretAnnotationsReq }): void =>
      manageSecretAnnotations(pathParams.clusterUid, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): void =>
      deleteSecret(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/batch',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: string[] }): void =>
      deleteSecrets(pathParams.clusterUid, pathParams.namespace, data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/secrets/export',
    handler: ({ pathParams, params }: { pathParams: Record<string, string>; params: Partial<SecretQueryReq> }): void =>
      exportSecret(pathParams.clusterUid, params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/secrets/import',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: SecretYamlReq }): void =>
      importSecret(pathParams.clusterUid, data),
  },
]

/**
 * 获取 Secret 分页列表
 * @param _clusterId - 集群 UID
 * @param params - 查询参数（含 namespace 筛选）
 * @returns 分页数据
 */
function getSecretList(_clusterId: string, params: Partial<SecretQueryReq>): PageVo<SecretListResp> {
  const { id, name, namespace, type, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockSecrets]

  if (namespace) {
    filtered = filtered.filter(s => s.namespace === namespace)
  }

  if (type) {
    filtered = filtered.filter(s => s.type === type)
  }

  if (id || name) {
    let searchFiltered: SecretListResp[] = []
    if (id) {
      searchFiltered = [...searchFiltered, ...filtered.filter(s => s.id === id)]
    }
    if (name) {
      searchFiltered = [...searchFiltered, ...filtered.filter(s => s.name.toLowerCase().includes(name.toLowerCase()))]
    }
    // searchFiltered 基于 id 去重
    const seenIds = new Set<string>()
    filtered = searchFiltered.filter(s => {
      if (seenIds.has(s.id)) return false
      seenIds.add(s.id)
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
 * 获取 Secret 详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @returns Secret 详情
 */
function getSecretDetail(clusterUid: string, namespace: string, name: string): SecretDetailResp {
  const s = mockSecrets.find(sec => sec.clusterUid === clusterUid && sec.namespace === namespace && sec.name === name)
  if (!s) return null as any
  return {
    ...s,
    clusterName: 'prod-cluster',
    data: {},
    stringData: {},
    labels: {},
    annotations: {},
    dataKeysCount: s.dataKeysCount || 0,
  }
}

/**
 * 查看 Secret YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @returns Secret YAML 配置
 */
function getSecretYaml(clusterUid: string, namespace: string, name: string): string {
  const s = mockSecrets.find(sec => sec.clusterUid === clusterUid && sec.namespace === namespace && sec.name === name)
  if (!s) {
    console.error('[Get Secret Yaml] can not find secret:', clusterUid, namespace, name)
    return ''
  }

  return `apiVersion: v1
kind: Secret
metadata:
  name: ${s.name}
  namespace: ${s.namespace}
  creationTimestamp: "${s.createAt}"
  uid: "${s.uid}"
type: ${s.type}
data:
  key1: dmFsdWUx
  key2: dmFsdWUy`
}

/**
 * 创建 Secret
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param data - 创建数据
 */
function createSecret(clusterUid: string, namespace: string, data: SecretReq): void {
  console.log('[Mock] createSecret', { clusterUid, namespace, data })
}

/**
 * 更新 Secret
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 更新数据
 */
function updateSecret(clusterUid: string, namespace: string, name: string, data: Partial<SecretReq>): void {
  console.log('[Mock] updateSecret', { clusterUid, namespace, name, data })
}

/**
 * 更新 Secret 数据
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 数据参数
 */
function manageSecretData(clusterUid: string, namespace: string, name: string, data: SecretDataReq): void {
  console.log('[Mock] manageSecretData', { clusterUid, namespace, name, data })
}

/**
 * 更新 Secret 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 标签数据
 */
function manageSecretLabels(clusterUid: string, namespace: string, name: string, data: SecretLabelsReq): void {
  console.log('[Mock] manageSecretLabels', { clusterUid, namespace, name, data })
}

/**
 * 更新 Secret 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 注解数据
 */
function manageSecretAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: SecretAnnotationsReq,
): void {
  console.log('[Mock] manageSecretAnnotations', { clusterUid, namespace, name, data })
}

/**
 * 删除 Secret
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 */
function deleteSecret(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteSecret', { clusterUid, namespace, name })
}

/**
 * 批量删除 Secret
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param names - Secret 名称数组
 */
function deleteSecrets(clusterUid: string, namespace: string, names: string[]): void {
  console.log('[Mock] deleteSecrets', { clusterUid, namespace, names })
}

/**
 * 导出 Secret CSV
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 */
function exportSecret(clusterUid: string, params: Partial<SecretQueryReq>): void {
  console.log('[Mock] exportSecret', { clusterUid, params })
}

/**
 * 导入 Secret
 * @param clusterUid - 集群 UID
 * @param data - YAML 配置
 */
function importSecret(clusterUid: string, data: SecretYamlReq): void {
  console.log('[Mock] importSecret', { clusterUid, data })
}

/**
 * 模拟 Secret 数据
 * @remarks 列表接口直接使用 ListResp 数据，详情接口在此基础上扩展 DetailResp 字段
 */
const mockSecrets: SecretListResp[] = [
  // ==================== default 命名空间 - 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'mysql-credentials',
    namespace: 'default',
    clusterUid: generateId(),
    description: 'MySQL 数据库连接凭据',
    type: 'Opaque',
    refs: ['deploy-001', 'sts-001'],
    dataKeysCount: 2,
    deletable: false,
    createAt: '2024-01-15 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-15 14:00:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'dockerhub-secret',
    namespace: 'default',
    clusterUid: generateId(),
    description: 'Docker Hub 私有仓库拉取认证',
    type: 'kubernetes.io/dockerconfigjson',
    refs: ['deploy-001', 'deploy-002'],
    dataKeysCount: 1,
    deletable: true,
    createAt: '2024-02-01 09:00:00',
    createBy: 'admin',
    updateAt: '2024-03-10 11:00:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'redis-auth',
    namespace: 'default',
    clusterUid: generateId(),
    description: 'Redis 集群认证密码',
    type: 'Opaque',
    refs: ['deploy-005', 'deploy-008'],
    dataKeysCount: 1,
    deletable: false,
    createAt: '2024-02-01 09:30:00',
    createBy: 'admin',
    updateAt: '2024-03-10 11:00:00',
    updateBy: 'admin',
  },
  // ==================== kube-system 命名空间 - 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'default-token-abc12',
    namespace: 'kube-system',
    clusterUid: generateId(),
    description: 'default ServiceAccount 自动生成的访问 Token',
    type: 'kubernetes.io/service-account-token',
    refs: [],
    dataKeysCount: 3,
    deletable: false,
    createAt: '2024-01-15 10:00:00',
    createBy: 'system',
    updateAt: '2024-01-15 10:00:00',
    updateBy: 'system',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'bootstrap-token-xyz89',
    namespace: 'kube-system',
    clusterUid: generateId(),
    description: '新节点加入集群的 Bootstrap 引导令牌',
    type: 'kubernetes.io/boot-straph-token',
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
    name: 'coredns-token-def34',
    namespace: 'kube-system',
    clusterUid: generateId(),
    description: 'CoreDNS ServiceAccount 访问 Token',
    type: 'kubernetes.io/service-account-token',
    refs: ['deploy-coredns'],
    dataKeysCount: 3,
    deletable: false,
    createAt: '2024-01-15 10:00:00',
    createBy: 'system',
    updateAt: '2024-03-20 09:00:00',
    updateBy: 'system',
  },
  // ==================== app-backend 命名空间 - 5 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'api-keys',
    namespace: 'app-backend',
    clusterUid: generateId(),
    description: '后端服务 API 密钥集合',
    type: 'Opaque',
    refs: ['deploy-005'],
    dataKeysCount: 3,
    deletable: true,
    createAt: '2024-02-15 10:00:00',
    createBy: 'developer',
    updateAt: '2024-04-20 16:00:00',
    updateBy: 'developer',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'db-connection',
    namespace: 'app-backend',
    clusterUid: generateId(),
    description: '数据库连接字符串及凭据',
    type: 'Opaque',
    refs: ['deploy-005', 'deploy-008', 'deploy-012'],
    dataKeysCount: 5,
    deletable: false,
    createAt: '2024-02-01 09:00:00',
    createBy: 'developer',
    updateAt: '2024-03-15 11:00:00',
    updateBy: 'developer',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'payment-gateway-cert',
    namespace: 'app-backend',
    clusterUid: generateId(),
    description: '支付网关 HTTPS TLS 证书',
    type: 'kubernetes.io/tls',
    refs: ['deploy-014'],
    dataKeysCount: 2,
    deletable: false,
    createAt: '2024-03-01 10:00:00',
    createBy: 'admin',
    updateAt: '2024-06-01 08:00:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'message-queue-auth',
    namespace: 'app-backend',
    clusterUid: generateId(),
    description: '消息队列 SASL 认证信息',
    type: 'kubernetes.io/basic-auth',
    refs: ['deploy-005', 'deploy-015'],
    dataKeysCount: 2,
    deletable: true,
    createAt: '2024-02-15 10:05:00',
    createBy: 'developer',
    updateAt: '2024-05-18 14:00:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 's3-storage-auth',
    namespace: 'app-backend',
    clusterUid: generateId(),
    description: 'S3 对象存储 AccessKey 凭据',
    type: 'Opaque',
    refs: ['deploy-005'],
    dataKeysCount: 2,
    deletable: true,
    createAt: '2024-03-15 10:00:00',
    createBy: 'developer',
    updateAt: '2024-06-02 14:00:00',
    updateBy: 'admin',
  },
  // ==================== app-frontend 命名空间 - 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'frontend-tls',
    namespace: 'app-frontend',
    clusterUid: generateId(),
    description: '前端应用 HTTPS TLS 证书',
    type: 'kubernetes.io/tls',
    refs: ['deploy-004'],
    dataKeysCount: 2,
    deletable: false,
    createAt: '2024-03-01 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-19 08:00:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'oauth-credentials',
    namespace: 'app-frontend',
    clusterUid: generateId(),
    description: 'OAuth2.0 客户端 ID 与密钥',
    type: 'Opaque',
    refs: ['deploy-004'],
    dataKeysCount: 2,
    deletable: true,
    createAt: '2024-02-10 09:00:00',
    createBy: 'developer',
    updateAt: '2024-05-01 11:00:00',
    updateBy: 'developer',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'cdn-auth-token',
    namespace: 'app-frontend',
    clusterUid: generateId(),
    description: 'CDN 加速服务认证 Token',
    type: 'Opaque',
    refs: [],
    dataKeysCount: 1,
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
    name: 'grafana-admin',
    namespace: 'monitoring',
    clusterUid: generateId(),
    description: 'Grafana 管理员账号密码',
    type: 'kubernetes.io/basic-auth',
    refs: ['deploy-007'],
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
    name: 'prometheus-tls',
    namespace: 'monitoring',
    clusterUid: generateId(),
    description: 'Prometheus Web UI TLS 证书',
    type: 'kubernetes.io/tls',
    refs: ['deploy-006'],
    dataKeysCount: 2,
    deletable: false,
    createAt: '2024-02-10 14:30:00',
    createBy: 'admin',
    updateAt: '2024-04-01 10:00:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'alertmanager-webhook',
    namespace: 'monitoring',
    clusterUid: generateId(),
    description: 'Alertmanager 告警通知 Webhook 地址及密钥',
    type: 'Opaque',
    refs: ['deploy-006'],
    dataKeysCount: 3,
    deletable: true,
    createAt: '2024-02-10 15:00:00',
    createBy: 'admin',
    updateAt: '2024-05-15 09:00:00',
    updateBy: 'admin',
  },
  // ==================== middleware 命名空间 - 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'redis-cluster-auth',
    namespace: 'middleware',
    clusterUid: generateId(),
    description: 'Redis 集群 ACL 认证密码',
    type: 'Opaque',
    refs: ['deploy-015'],
    dataKeysCount: 1,
    deletable: false,
    createAt: '2024-02-20 10:00:00',
    createBy: 'admin',
    updateAt: '2024-04-10 11:00:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'mysql-root-cred',
    namespace: 'middleware',
    clusterUid: generateId(),
    description: 'MySQL root 账号密码',
    type: 'Opaque',
    refs: ['deploy-016'],
    dataKeysCount: 3,
    deletable: false,
    createAt: '2024-02-20 10:30:00',
    createBy: 'admin',
    updateAt: '2024-05-20 15:00:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'kafka-sasl-auth',
    namespace: 'middleware',
    clusterUid: generateId(),
    description: 'Kafka SASL/PLAIN 认证凭据',
    type: 'kubernetes.io/basic-auth',
    refs: ['deploy-017'],
    dataKeysCount: 2,
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
    name: 'elasticsearch-auth',
    namespace: 'logging',
    clusterUid: generateId(),
    description: 'Elasticsearch 集群 Basic Auth 认证',
    type: 'kubernetes.io/basic-auth',
    refs: ['deploy-018'],
    dataKeysCount: 2,
    deletable: true,
    createAt: '2024-03-10 08:00:00',
    createBy: 'admin',
    updateAt: '2024-06-12 09:00:00',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'fluentd-token',
    namespace: 'logging',
    clusterUid: generateId(),
    description: 'Fluentd 日志采集输出端认证 Token',
    type: 'Opaque',
    refs: ['deploy-018'],
    dataKeysCount: 1,
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
    name: 'staging-tls',
    namespace: 'staging',
    clusterUid: generateId(),
    description: '预发布环境泛域名 TLS 证书',
    type: 'kubernetes.io/tls',
    refs: ['deploy-019', 'deploy-020'],
    dataKeysCount: 2,
    deletable: true,
    createAt: '2024-04-01 10:00:00',
    createBy: 'developer',
    updateAt: '2024-06-08 14:00:00',
    updateBy: 'developer',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'staging-db-cred',
    namespace: 'staging',
    clusterUid: generateId(),
    description: '预发布环境数据库连接凭据',
    type: 'Opaque',
    refs: ['deploy-019'],
    dataKeysCount: 4,
    deletable: true,
    createAt: '2024-04-01 10:30:00',
    createBy: 'developer',
    updateAt: '2024-05-25 16:00:00',
    updateBy: 'developer',
  },
]
