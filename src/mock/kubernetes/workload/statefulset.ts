/**
 * Kubernetes StatefulSet 管理 Mock API
 * @module mock/kubernetes/workload/statefulset
 */
import type { PageResp } from '@/types/common'
import type {
  StatefulSetQueryReq,
  StatefulSetReq,
  StatefulSetListResp,
  StatefulSetDetailResp,
  StatefulSetLabelsReq,
  StatefulSetAnnotationsReq,
  StatefulSetScaleReq,
  StatefulSetYamlReq
} from '@/types/kubernetes/workload/statefulset'
import { generateId } from '@/mock/utils'

/**
 * StatefulSet 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/statefulsets - 获取 StatefulSet 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name - 获取 StatefulSet 详情
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/yaml - 查看 YAML
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets - 创建 StatefulSet
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name - 更新 StatefulSet
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name - 删除 StatefulSet
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/batch - 批量删除
 * - GET /kubernetes/clusters/:clusterId/statefulsets/export - 导出 CSV
 * - POST /kubernetes/clusters/:clusterId/statefulsets/import - 导入 StatefulSet
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/scale - 扩缩容
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/restart - 重启
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/rollback - 回滚
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/statefulsets',
    handler: (pathParams: Record<string, string>, params: Partial<StatefulSetQueryReq>): PageResp<StatefulSetListResp> => getStatefulSetPage(pathParams.clusterId, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name',
    handler: (pathParams: Record<string, string>): StatefulSetDetailResp => getStatefulSetDetail(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/yaml',
    handler: (pathParams: Record<string, string>): string => getStatefulSetYaml(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets',
    handler: (pathParams: Record<string, string>, data: StatefulSetReq): void => createStatefulSet(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name',
    handler: (pathParams: Record<string, string>, data: Partial<StatefulSetReq>): void => updateStatefulSet(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/labels',
    handler: (pathParams: Record<string, string>, data: StatefulSetLabelsReq): void => manageStatefulSetLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/annotations',
    handler: (pathParams: Record<string, string>, data: StatefulSetAnnotationsReq): void => manageStatefulSetAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name',
    handler: (pathParams: Record<string, string>): void => deleteStatefulSet(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/batch',
    handler: (pathParams: Record<string, string>, data: string[]): void => deleteStatefulSets(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/statefulsets/export',
    handler: (pathParams: Record<string, string>, params: Partial<StatefulSetQueryReq>): void => exportStatefulSet(pathParams.clusterId, params)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/statefulsets/import',
    handler: (pathParams: Record<string, string>, data: StatefulSetYamlReq): void => importStatefulSet(pathParams.clusterId, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/scale',
    handler: (pathParams: Record<string, string>, data: StatefulSetScaleReq): void => scaleStatefulSet(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/restart',
    handler: (pathParams: Record<string, string>): void => restartStatefulSet(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/rollback',
    handler: (pathParams: Record<string, string>): void => rollbackStatefulSet(pathParams.clusterId, pathParams.namespace, pathParams.name)
  }
]

/**
 * 获取 StatefulSet 分页列表
 * @param _clusterId - 集群ID（mock 中未使用）
 * @param params - 查询参数
 * @returns 分页数据
 */
function getStatefulSetPage(_clusterId: string, params: Partial<StatefulSetQueryReq>): PageResp<StatefulSetListResp> {
  const { id, name, namespace, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockStatefulSets]

  if (status) {
    filtered = filtered.filter(s => s.status === status)
  }
  if (namespace) {
    filtered = filtered.filter(s => s.namespace === namespace)
  }

  if (id || name) {
    let searchFiltered: StatefulSetListResp[] = []
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
 * 获取 StatefulSet 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @returns StatefulSet 详情
 */
function getStatefulSetDetail(clusterId: string, namespace: string, name: string): StatefulSetDetailResp {
  const statefulSet = mockStatefulSets.find(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (!statefulSet) {
    console.error('[Get StatefulSet Detail] can not find statefulset:', clusterId, namespace, name)
  }
  return {
    ...statefulSet!,
    selector: { app: statefulSet!.name },
    labels: { app: statefulSet!.name },
    annotations: { description: statefulSet!.description || '' },
    containers: [
      {
        name: statefulSet!.name,
        image: `${statefulSet!.name}:latest`
      }
    ],
    volumeClaimTemplates: [
      {
        name: 'data',
        storageClassName: 'standard',
        accessModes: ['ReadWriteOnce'],
        resources: {
          requests: {
            storage: '10Gi'
          }
        }
      }
    ]
  }
}

/**
 * 查看 StatefulSet YAML
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @returns StatefulSet YAML 配置
 */
function getStatefulSetYaml(clusterId: string, namespace: string, name: string): string {
  const statefulSet = mockStatefulSets.find(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (!statefulSet) {
    console.error('[Get StatefulSet Yaml] can not find statefulset:', clusterId, namespace, name)
    return ''
  }

  const yaml = `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: ${statefulSet.name}
  namespace: ${statefulSet.namespace}
  creationTimestamp: "${statefulSet.createAt}"
  resourceVersion: "${generateId()}"
  uid: "${statefulSet.uid}"
spec:
  serviceName: ${statefulSet.serviceName}
  replicas: ${statefulSet.replicas}
  podManagementPolicy: ${statefulSet.podManagementPolicy}
  updateStrategy:
    type: ${statefulSet.updateStrategy}
  selector:
    matchLabels:
      app: "${statefulSet.name}"
  template:
    metadata:
      labels:
        app: "${statefulSet.name}"
    spec:
      containers:
      - name: ${statefulSet.name}
        image: ${statefulSet.name}:latest
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
status:
  observedGeneration: 1
  replicas: ${statefulSet.replicas}
  readyReplicas: ${statefulSet.readyReplicas}`

  return yaml
}

/**
 * 创建 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param data - 创建参数
 */
function createStatefulSet(clusterId: string, namespace: string, data: StatefulSetReq): void {
  console.log('[Mock] createStatefulSet', { clusterId, namespace, data })
}

/**
 * 更新 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @param data - 更新参数
 */
function updateStatefulSet(clusterId: string, namespace: string, name: string, data: Partial<StatefulSetReq>): void {
  console.log('[Mock] updateStatefulSet', { clusterId, namespace, name, data })
}

/**
 * 扩缩容 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @param data - 扩缩容参数
 */
function scaleStatefulSet(clusterId: string, namespace: string, name: string, data: StatefulSetScaleReq): void {
  console.log('[Mock] scaleStatefulSet', { clusterId, namespace, name, data })
}

/**
 * 重启 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 */
function restartStatefulSet(clusterId: string, namespace: string, name: string): void {
  console.log('[Mock] restartStatefulSet', { clusterId, namespace, name })
}

/**
 * 回滚 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 */
function rollbackStatefulSet(clusterId: string, namespace: string, name: string): void {
  console.log('[Mock] rollbackStatefulSet', { clusterId, namespace, name })
}

/**
 * 更新 StatefulSet 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @param data - 标签数据
 */
function manageStatefulSetLabels(clusterId: string, namespace: string, name: string, data: StatefulSetLabelsReq): void {
  console.log('[Mock] manageStatefulSetLabels', { clusterId, namespace, name, data })
}

/**
 * 更新 StatefulSet 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @param data - 注解数据
 */
function manageStatefulSetAnnotations(clusterId: string, namespace: string, name: string, data: StatefulSetAnnotationsReq): void {
  console.log('[Mock] manageStatefulSetAnnotations', { clusterId, namespace, name, data })
}

/**
 * 删除 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 */
function deleteStatefulSet(clusterId: string, namespace: string, name: string): void {
  console.log('[Mock] deleteStatefulSet', { clusterId, namespace, name })
}

/**
 * 批量删除 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param names - StatefulSet 名称数组
 */
function deleteStatefulSets(clusterId: string, namespace: string, names: string[]): void {
  console.log('[Mock] deleteStatefulSets', { clusterId, namespace, names })
}

/**
 * 导出 StatefulSet CSV
 * @param clusterId - 集群ID
 * @param params - 查询参数
 */
function exportStatefulSet(clusterId: string, params: Partial<StatefulSetQueryReq>): void {
  console.log('[Mock] exportStatefulSet', { clusterId, params })
}

/**
 * 导入 StatefulSet
 * @param clusterId - 集群ID
 * @param data - YAML 配置
 */
function importStatefulSet(clusterId: string, data: StatefulSetYamlReq): void {
  console.log('[Mock] importStatefulSet', { clusterId, data })
}

/**
 * 模拟 StatefulSet 数据
 * @remarks 20 条数据覆盖全部 10 种状态
 */
const mockStatefulSets: StatefulSetListResp[] = [
  // ==================== Running（运行中）- 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'mysql-primary',
    namespace: 'data',
    clusterId: generateId(),
    description: 'MySQL 主库集群，负责核心业务数据的读写操作',
    status: 'Running',
    replicas: 3,
    readyReplicas: 3,
    serviceName: 'mysql-primary-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-01-20 10:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-15 14:00:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'mongodb',
    namespace: 'data',
    clusterId: generateId(),
    description: 'MongoDB 副本集，承载文档型业务数据存储',
    status: 'Running',
    replicas: 3,
    readyReplicas: 3,
    serviceName: 'mongodb-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-02-01 09:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-10 11:00:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'kafka',
    namespace: 'middleware',
    clusterId: generateId(),
    description: 'Kafka 消息队列集群，处理异步消息和事件流',
    status: 'Running',
    replicas: 3,
    readyReplicas: 3,
    serviceName: 'kafka-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-02-15 10:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-15 12:00:00'
  },
  // ==================== Available（部分就绪）- 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'mysql-replica',
    namespace: 'data',
    clusterId: generateId(),
    description: 'MySQL 从库集群，提供读写分离的读流量承载',
    status: 'Available',
    replicas: 3,
    readyReplicas: 3,
    serviceName: 'mysql-replica-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-01-20 10:05:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-15 14:05:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'redis-cluster',
    namespace: 'data',
    clusterId: generateId(),
    description: 'Redis Cluster 集群，提供分布式缓存服务',
    status: 'Available',
    replicas: 6,
    readyReplicas: 6,
    serviceName: 'redis-cluster-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-02-05 14:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-12 10:00:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'minio',
    namespace: 'storage',
    clusterId: generateId(),
    description: 'MinIO 对象存储集群，提供 S3 兼容的文件存储',
    status: 'Available',
    replicas: 4,
    readyReplicas: 4,
    serviceName: 'minio-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'Parallel',
    createBy: 'admin',
    createAt: '2024-02-20 11:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-18 15:00:00'
  },
  // ==================== Stopped（已停止）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'zookeeper',
    namespace: 'middleware',
    clusterId: generateId(),
    description: 'Zookeeper 分布式协调服务，已缩容停止',
    status: 'Stopped',
    statusMessage: '副本已缩容至 0，服务已停止',
    replicas: 3,
    readyReplicas: 0,
    serviceName: 'zookeeper-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-02-10 08:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-08 09:00:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'nexus-oss',
    namespace: 'middleware',
    clusterId: generateId(),
    description: 'Nexus 私有制品仓库，暂不使用时缩容停止',
    status: 'Stopped',
    statusMessage: '维护窗口期间暂停服务',
    replicas: 1,
    readyReplicas: 0,
    serviceName: 'nexus-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-03-10 10:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-20 09:30:00'
  },
  // ==================== Creating（创建中）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'clickhouse',
    namespace: 'data',
    clusterId: generateId(),
    description: 'ClickHouse 分析型数据库，用于实时 OLAP 查询',
    status: 'Creating',
    statusMessage: 'Pod 正在创建中，等待持久卷绑定',
    replicas: 3,
    readyReplicas: 0,
    serviceName: 'clickhouse-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-03-19 16:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-19 16:00:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'postgresql-primary',
    namespace: 'data',
    clusterId: generateId(),
    description: 'PostgreSQL 主数据库集群，迁移中新建',
    status: 'Creating',
    statusMessage: '容器镜像拉取中，等待数据库初始化完成',
    replicas: 3,
    readyReplicas: 0,
    serviceName: 'postgresql-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-03-20 14:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-20 14:00:00'
  },
  // ==================== Updating（更新中）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'elasticsearch',
    namespace: 'logging',
    clusterId: generateId(),
    description: 'Elasticsearch 日志存储和全文检索集群',
    status: 'Updating',
    statusMessage: '滚动更新进行中，旧版本 Pod 正在被逐步替换',
    replicas: 3,
    readyReplicas: 1,
    serviceName: 'elasticsearch-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-03-01 09:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-19 16:00:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'nacos-cluster',
    namespace: 'middleware',
    clusterId: generateId(),
    description: 'Nacos 注册中心和配置管理集群',
    status: 'Updating',
    statusMessage: '正在升级至 2.3.0 版本，数据库迁移进行中',
    replicas: 3,
    readyReplicas: 2,
    serviceName: 'nacos-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-02-28 10:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-20 10:00:00'
  },
  // ==================== Terminating（终止中）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'neo4j',
    namespace: 'data',
    clusterId: generateId(),
    description: 'Neo4j 图数据库，用于知识图谱存储',
    status: 'Terminating',
    statusMessage: '正在删除 Pod，等待数据备份完成',
    replicas: 3,
    readyReplicas: 0,
    serviceName: 'neo4j-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-01-15 09:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-20 11:00:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'jaeger',
    namespace: 'monitoring',
    clusterId: generateId(),
    description: 'Jaeger 分布式链路追踪后端存储',
    status: 'Terminating',
    statusMessage: 'Finalizer 清理延迟，等待存储卷回收',
    replicas: 2,
    readyReplicas: 0,
    serviceName: 'jaeger-headless',
    updateStrategy: 'OnDelete',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-02-05 08:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-18 10:00:00'
  },
  // ==================== CreateTimeout（创建超时）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'cassandra',
    namespace: 'data',
    clusterId: generateId(),
    description: 'Cassandra 分布式 NoSQL 数据库集群',
    status: 'CreateTimeout',
    statusMessage: '创建超时：节点资源不足，Pod 无法完成调度',
    replicas: 3,
    readyReplicas: 0,
    serviceName: 'cassandra-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-03-20 08:30:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-20 09:00:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'timescaledb',
    namespace: 'data',
    clusterId: generateId(),
    description: 'TimescaleDB 时序数据库，用于 IoT 数据存储',
    status: 'CreateTimeout',
    statusMessage: '超过 15 分钟未完成创建，存储类配置不匹配',
    replicas: 2,
    readyReplicas: 0,
    serviceName: 'timescaledb-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'developer',
    createAt: '2024-03-19 10:00:00',
    updateBy: 'developer',
    deletable: true,
    updateAt: '2024-03-19 10:15:00'
  },
  // ==================== UpdateTimeout（更新超时）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'hadoop-datanode',
    namespace: 'data',
    clusterId: generateId(),
    description: 'Hadoop DataNode 集群，负责 HDFS 数据存储',
    status: 'UpdateTimeout',
    statusMessage: '滚动更新超时，数据块迁移耗时长于预期',
    replicas: 5,
    readyReplicas: 3,
    serviceName: 'hadoop-datanode-headless',
    updateStrategy: 'OnDelete',
    podManagementPolicy: 'Parallel',
    createBy: 'admin',
    createAt: '2024-01-10 09:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-20 13:00:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'etcd-cluster',
    namespace: 'middleware',
    clusterId: generateId(),
    description: 'Etcd 分布式键值存储，Kubernetes 控制面依赖',
    status: 'UpdateTimeout',
    statusMessage: '更新超时：raft 共识协议导致滚动更新超过预期窗口',
    replicas: 5,
    readyReplicas: 4,
    serviceName: 'etcd-headless',
    updateStrategy: 'OnDelete',
    podManagementPolicy: 'OrderedReady',
    createBy: 'system',
    createAt: '2024-01-01 00:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-20 15:30:00'
  },
  // ==================== Failed（失败异常）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'rabbitmq',
    namespace: 'middleware',
    clusterId: generateId(),
    description: 'RabbitMQ 消息队列集群，处理业务异步任务',
    status: 'Failed',
    statusMessage: 'Pod 启动失败：磁盘空间不足，持久卷写入异常',
    replicas: 3,
    readyReplicas: 0,
    serviceName: 'rabbitmq-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-02-10 14:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-19 08:00:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'influxdb',
    namespace: 'monitoring',
    clusterId: generateId(),
    description: 'InfluxDB 时间序列数据库，存储监控指标数据',
    status: 'Failed',
    statusMessage: 'OOMKilled：内存配置不足导致所有 Pod 被杀死',
    replicas: 2,
    readyReplicas: 0,
    serviceName: 'influxdb-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-02-20 10:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-18 06:00:00'
  },
  // ==================== Unknown（未知）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'consul',
    namespace: 'middleware',
    clusterId: generateId(),
    description: 'Consul 服务发现和配置中心集群',
    status: 'Unknown',
    statusMessage: '无法获取 StatefulSet 状态，集群网络分区可能中断',
    replicas: 3,
    readyReplicas: 0,
    serviceName: 'consul-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-01-05 09:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-20 16:30:00'
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'greenplum',
    namespace: 'data',
    clusterId: generateId(),
    description: 'Greenplum MPP 数据仓库集群',
    status: 'Unknown',
    statusMessage: 'Master Pod 失联，暂时无法确认集群整体状态',
    replicas: 4,
    readyReplicas: 0,
    serviceName: 'greenplum-headless',
    updateStrategy: 'OnDelete',
    podManagementPolicy: 'Parallel',
    createBy: 'admin',
    createAt: '2024-04-01 10:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-04-01 10:00:00'
  }
]
