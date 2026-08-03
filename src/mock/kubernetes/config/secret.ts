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
  SecretYamlReq
} from '@/types/kubernetes/config/secret'
import { generateId } from '@/mock/utils'

/**
 * Secret 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/secrets - 获取 Secret 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name - 获取 Secret 详情
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/yaml - 查看 YAML
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets - 创建 Secret
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name - 更新 Secret
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/data - 更新数据
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/labels - 更新标签
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name - 删除 Secret
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/batch - 批量删除
 * - GET /kubernetes/clusters/:clusterId/secrets/export - 导出 CSV
 * - POST /kubernetes/clusters/:clusterId/secrets/import - 导入 Secret
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/secrets',
    handler: (pathParams: Record<string, string>, params: Partial<SecretQueryReq>): PageVo<SecretListResp> =>
      getSecretList(pathParams.clusterId, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name',
    handler: (pathParams: Record<string, string>): SecretDetailResp =>
      getSecretDetail(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/yaml',
    handler: (pathParams: Record<string, string>): string =>
      getSecretYaml(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets',
    handler: (pathParams: Record<string, string>, data: SecretReq): void =>
      createSecret(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name',
    handler: (pathParams: Record<string, string>, data: Partial<SecretReq>): void =>
      updateSecret(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/data',
    handler: (pathParams: Record<string, string>, data: SecretDataReq): void =>
      manageSecretData(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/labels',
    handler: (pathParams: Record<string, string>, data: SecretLabelsReq): void =>
      manageSecretLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name/annotations',
    handler: (pathParams: Record<string, string>, data: SecretAnnotationsReq): void =>
      manageSecretAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/:name',
    handler: (pathParams: Record<string, string>): void =>
      deleteSecret(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/secrets/batch',
    handler: (pathParams: Record<string, string>, data: string[]): void =>
      deleteSecrets(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/secrets/export',
    handler: (pathParams: Record<string, string>, params: Partial<SecretQueryReq>): void =>
      exportSecret(pathParams.clusterId, params)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/secrets/import',
    handler: (pathParams: Record<string, string>, data: SecretYamlReq): void => importSecret(pathParams.clusterId, data)
  }
]

/**
 * 获取 Secret 分页列表
 * @param clusterId - 集群ID
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
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @returns Secret 详情
 */
function getSecretDetail(clusterId: string, namespace: string, name: string): SecretDetailResp {
  const s = mockSecrets.find(sec => sec.clusterId === clusterId && sec.namespace === namespace && sec.name === name)
  if (!s) return null as any
  return {
    ...s,
    clusterName: 'prod-cluster',
    data: {},
    stringData: {},
    labels: {},
    annotations: {},
    dataKeysCount: s.dataKeysCount || 0
  }
}

/**
 * 查看 Secret YAML
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @returns Secret YAML 配置
 */
function getSecretYaml(clusterId: string, namespace: string, name: string): string {
  const s = mockSecrets.find(sec => sec.clusterId === clusterId && sec.namespace === namespace && sec.name === name)
  if (!s) {
    console.error('[Get Secret Yaml] can not find secret:', clusterId, namespace, name)
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
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param data - 创建数据
 */
function createSecret(clusterId: string, namespace: string, data: SecretReq): void {
  console.log('[Mock] createSecret', { clusterId, namespace, data })
}

/**
 * 更新 Secret
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 更新数据
 */
function updateSecret(clusterId: string, namespace: string, name: string, data: Partial<SecretReq>): void {
  console.log('[Mock] updateSecret', { clusterId, namespace, name, data })
}

/**
 * 更新 Secret 数据
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 数据参数
 */
function manageSecretData(clusterId: string, namespace: string, name: string, data: SecretDataReq): void {
  console.log('[Mock] manageSecretData', { clusterId, namespace, name, data })
}

/**
 * 更新 Secret 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 标签数据
 */
function manageSecretLabels(clusterId: string, namespace: string, name: string, data: SecretLabelsReq): void {
  console.log('[Mock] manageSecretLabels', { clusterId, namespace, name, data })
}

/**
 * 更新 Secret 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 * @param data - 注解数据
 */
function manageSecretAnnotations(clusterId: string, namespace: string, name: string, data: SecretAnnotationsReq): void {
  console.log('[Mock] manageSecretAnnotations', { clusterId, namespace, name, data })
}

/**
 * 删除 Secret
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param name - Secret 名称
 */
function deleteSecret(clusterId: string, namespace: string, name: string): void {
  console.log('[Mock] deleteSecret', { clusterId, namespace, name })
}

/**
 * 批量删除 Secret
 * @param clusterId - 集群ID
 * @param namespace - 命名空间名称
 * @param names - Secret 名称数组
 */
function deleteSecrets(clusterId: string, namespace: string, names: string[]): void {
  console.log('[Mock] deleteSecrets', { clusterId, namespace, names })
}

/**
 * 导出 Secret CSV
 * @param clusterId - 集群ID
 * @param params - 查询参数
 */
function exportSecret(clusterId: string, params: Partial<SecretQueryReq>): void {
  console.log('[Mock] exportSecret', { clusterId, params })
}

/**
 * 导入 Secret
 * @param clusterId - 集群ID
 * @param data - YAML 配置
 */
function importSecret(clusterId: string, data: SecretYamlReq): void {
  console.log('[Mock] importSecret', { clusterId, data })
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
    clusterId: generateId(),
    description: 'MySQL 数据库连接凭据',
    type: 'Opaque',
    refs: ['deploy-001', 'sts-001'],
    dataKeysCount: 2,
    deletable: false,
    createAt: '2024-01-15 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-15 14:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'dockerhub-secret',
    namespace: 'default',
    clusterId: generateId(),
    description: 'Docker Hub 私有仓库拉取认证',
    type: 'kubernetes.io/dockerconfigjson',
    refs: ['deploy-001', 'deploy-002'],
    dataKeysCount: 1,
    deletable: true,
    createAt: '2024-02-01 09:00:00',
    createBy: 'admin',
    updateAt: '2024-03-10 11:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'redis-auth',
    namespace: 'default',
    clusterId: generateId(),
    description: 'Redis 集群认证密码',
    type: 'Opaque',
    refs: ['deploy-005', 'deploy-008'],
    dataKeysCount: 1,
    deletable: false,
    createAt: '2024-02-01 09:30:00',
    createBy: 'admin',
    updateAt: '2024-03-10 11:00:00',
    updateBy: 'admin'
  },
  // ==================== kube-system 命名空间 - 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'default-token-abc12',
    namespace: 'kube-system',
    clusterId: generateId(),
    description: 'default ServiceAccount 自动生成的访问 Token',
    type: 'kubernetes.io/service-account-token',
    refs: [],
    dataKeysCount: 3,
    deletable: false,
    createAt: '2024-01-15 10:00:00',
    createBy: 'system',
    updateAt: '2024-01-15 10:00:00',
    updateBy: 'system'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'bootstrap-token-xyz89',
    namespace: 'kube-system',
    clusterId: generateId(),
    description: '新节点加入集群的 Bootstrap 引导令牌',
    type: 'kubernetes.io/boot-straph-token',
    refs: [],
    dataKeysCount: 2,
    deletable: false,
    createAt: '2024-01-15 10:00:00',
    createBy: 'system',
    updateAt: '2024-01-15 10:00:00',
    updateBy: 'system'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'coredns-token-def34',
    namespace: 'kube-system',
    clusterId: generateId(),
    description: 'CoreDNS ServiceAccount 访问 Token',
    type: 'kubernetes.io/service-account-token',
    refs: ['deploy-coredns'],
    dataKeysCount: 3,
    deletable: false,
    createAt: '2024-01-15 10:00:00',
    createBy: 'system',
    updateAt: '2024-03-20 09:00:00',
    updateBy: 'system'
  },
  // ==================== app-backend 命名空间 - 5 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'api-keys',
    namespace: 'app-backend',
    clusterId: generateId(),
    description: '后端服务 API 密钥集合',
    type: 'Opaque',
    refs: ['deploy-005'],
    dataKeysCount: 3,
    deletable: true,
    createAt: '2024-02-15 10:00:00',
    createBy: 'developer',
    updateAt: '2024-04-20 16:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'db-connection',
    namespace: 'app-backend',
    clusterId: generateId(),
    description: '数据库连接字符串及凭据',
    type: 'Opaque',
    refs: ['deploy-005', 'deploy-008', 'deploy-012'],
    dataKeysCount: 5,
    deletable: false,
    createAt: '2024-02-01 09:00:00',
    createBy: 'developer',
    updateAt: '2024-03-15 11:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'payment-gateway-cert',
    namespace: 'app-backend',
    clusterId: generateId(),
    description: '支付网关 HTTPS TLS 证书',
    type: 'kubernetes.io/tls',
    refs: ['deploy-014'],
    dataKeysCount: 2,
    deletable: false,
    createAt: '2024-03-01 10:00:00',
    createBy: 'admin',
    updateAt: '2024-06-01 08:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'message-queue-auth',
    namespace: 'app-backend',
    clusterId: generateId(),
    description: '消息队列 SASL 认证信息',
    type: 'kubernetes.io/basic-auth',
    refs: ['deploy-005', 'deploy-015'],
    dataKeysCount: 2,
    deletable: true,
    createAt: '2024-02-15 10:05:00',
    createBy: 'developer',
    updateAt: '2024-05-18 14:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 's3-storage-auth',
    namespace: 'app-backend',
    clusterId: generateId(),
    description: 'S3 对象存储 AccessKey 凭据',
    type: 'Opaque',
    refs: ['deploy-005'],
    dataKeysCount: 2,
    deletable: true,
    createAt: '2024-03-15 10:00:00',
    createBy: 'developer',
    updateAt: '2024-06-02 14:00:00',
    updateBy: 'admin'
  },
  // ==================== app-frontend 命名空间 - 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'frontend-tls',
    namespace: 'app-frontend',
    clusterId: generateId(),
    description: '前端应用 HTTPS TLS 证书',
    type: 'kubernetes.io/tls',
    refs: ['deploy-004'],
    dataKeysCount: 2,
    deletable: false,
    createAt: '2024-03-01 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-19 08:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'oauth-credentials',
    namespace: 'app-frontend',
    clusterId: generateId(),
    description: 'OAuth2.0 客户端 ID 与密钥',
    type: 'Opaque',
    refs: ['deploy-004'],
    dataKeysCount: 2,
    deletable: true,
    createAt: '2024-02-10 09:00:00',
    createBy: 'developer',
    updateAt: '2024-05-01 11:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'cdn-auth-token',
    namespace: 'app-frontend',
    clusterId: generateId(),
    description: 'CDN 加速服务认证 Token',
    type: 'Opaque',
    refs: [],
    dataKeysCount: 1,
    deletable: true,
    createAt: '2024-03-15 10:00:00',
    createBy: 'developer',
    updateAt: '2024-06-02 14:00:00',
    updateBy: 'admin'
  },
  // ==================== monitoring 命名空间 - 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'grafana-admin',
    namespace: 'monitoring',
    clusterId: generateId(),
    description: 'Grafana 管理员账号密码',
    type: 'kubernetes.io/basic-auth',
    refs: ['deploy-007'],
    dataKeysCount: 2,
    deletable: false,
    createAt: '2024-02-10 14:00:00',
    createBy: 'admin',
    updateAt: '2024-03-12 16:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'prometheus-tls',
    namespace: 'monitoring',
    clusterId: generateId(),
    description: 'Prometheus Web UI TLS 证书',
    type: 'kubernetes.io/tls',
    refs: ['deploy-006'],
    dataKeysCount: 2,
    deletable: false,
    createAt: '2024-02-10 14:30:00',
    createBy: 'admin',
    updateAt: '2024-04-01 10:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'alertmanager-webhook',
    namespace: 'monitoring',
    clusterId: generateId(),
    description: 'Alertmanager 告警通知 Webhook 地址及密钥',
    type: 'Opaque',
    refs: ['deploy-006'],
    dataKeysCount: 3,
    deletable: true,
    createAt: '2024-02-10 15:00:00',
    createBy: 'admin',
    updateAt: '2024-05-15 09:00:00',
    updateBy: 'admin'
  },
  // ==================== middleware 命名空间 - 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'redis-cluster-auth',
    namespace: 'middleware',
    clusterId: generateId(),
    description: 'Redis 集群 ACL 认证密码',
    type: 'Opaque',
    refs: ['deploy-015'],
    dataKeysCount: 1,
    deletable: false,
    createAt: '2024-02-20 10:00:00',
    createBy: 'admin',
    updateAt: '2024-04-10 11:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'mysql-root-cred',
    namespace: 'middleware',
    clusterId: generateId(),
    description: 'MySQL root 账号密码',
    type: 'Opaque',
    refs: ['deploy-016'],
    dataKeysCount: 3,
    deletable: false,
    createAt: '2024-02-20 10:30:00',
    createBy: 'admin',
    updateAt: '2024-05-20 15:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'kafka-sasl-auth',
    namespace: 'middleware',
    clusterId: generateId(),
    description: 'Kafka SASL/PLAIN 认证凭据',
    type: 'kubernetes.io/basic-auth',
    refs: ['deploy-017'],
    dataKeysCount: 2,
    deletable: false,
    createAt: '2024-03-01 09:00:00',
    createBy: 'admin',
    updateAt: '2024-06-05 10:00:00',
    updateBy: 'admin'
  },
  // ==================== logging 命名空间 - 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'elasticsearch-auth',
    namespace: 'logging',
    clusterId: generateId(),
    description: 'Elasticsearch 集群 Basic Auth 认证',
    type: 'kubernetes.io/basic-auth',
    refs: ['deploy-018'],
    dataKeysCount: 2,
    deletable: true,
    createAt: '2024-03-10 08:00:00',
    createBy: 'admin',
    updateAt: '2024-06-12 09:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'fluentd-token',
    namespace: 'logging',
    clusterId: generateId(),
    description: 'Fluentd 日志采集输出端认证 Token',
    type: 'Opaque',
    refs: ['deploy-018'],
    dataKeysCount: 1,
    deletable: true,
    createAt: '2024-03-10 08:30:00',
    createBy: 'admin',
    updateAt: '2024-06-12 10:00:00',
    updateBy: 'admin'
  },
  // ==================== staging 命名空间 - 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'staging-tls',
    namespace: 'staging',
    clusterId: generateId(),
    description: '预发布环境泛域名 TLS 证书',
    type: 'kubernetes.io/tls',
    refs: ['deploy-019', 'deploy-020'],
    dataKeysCount: 2,
    deletable: true,
    createAt: '2024-04-01 10:00:00',
    createBy: 'developer',
    updateAt: '2024-06-08 14:00:00',
    updateBy: 'developer'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'staging-db-cred',
    namespace: 'staging',
    clusterId: generateId(),
    description: '预发布环境数据库连接凭据',
    type: 'Opaque',
    refs: ['deploy-019'],
    dataKeysCount: 4,
    deletable: true,
    createAt: '2024-04-01 10:30:00',
    createBy: 'developer',
    updateAt: '2024-05-25 16:00:00',
    updateBy: 'developer'
  }
]
