/**
 * @fileOverview Kubernetes StatefulSet 管理 Mock API
 * @module mock/kubernetes/workload/statefulset
 */
import { generateId } from '@/mock/utils'
import type { StatefulSetResp, StatefulSetQueryReq, StatefulSetReq, StatefulSetLabelsReq, StatefulSetAnnotationsReq, StatefulSetScaleReq } from '@/types'

/**
 * StatefulSet 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets - 获取 StatefulSet 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name - 获取 StatefulSet 详情
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets - 创建 StatefulSet
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name - 更新 StatefulSet
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/scale - 扩缩容
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name - 删除 StatefulSet
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/batch - 批量删除
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets',
    handler: (pathParams: Record<string, string>, params: Partial<StatefulSetQueryReq>) => getStatefulSetPage(pathParams.clusterId, pathParams.namespace, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name',
    handler: (pathParams: Record<string, string>, params: any, data: any) => getStatefulSetDetail(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets',
    handler: (pathParams: Record<string, string>, params: any, data: Partial<StatefulSetReq>) => createStatefulSet(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name',
    handler: (pathParams: Record<string, string>, params: any, data: Partial<StatefulSetReq>) => updateStatefulSet(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/scale',
    handler: (pathParams: Record<string, string>, params: any, data: StatefulSetScaleReq) => scaleStatefulSet(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/labels',
    handler: (pathParams: Record<string, string>, params: any, data: StatefulSetLabelsReq) => manageStatefulSetLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/annotations',
    handler: (pathParams: Record<string, string>, params: any, data: StatefulSetAnnotationsReq) => manageStatefulSetAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name',
    handler: (pathParams: Record<string, string>, params: any, data: any) => deleteStatefulSet(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/batch',
    handler: (pathParams: Record<string, string>, params: any, data: string[]) => deleteStatefulSets(pathParams.clusterId, pathParams.namespace, data)
  }
]

/**
 * 获取 StatefulSet 分页列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param params - 查询参数
 * @returns 分页数据
 */
function getStatefulSetPage(clusterId: string, namespace: string, params: Partial<StatefulSetQueryReq>) {
  const { name, status, page = 1, pageSize = 10 } = params || {}

  let filtered = mockStatefulSets.filter(s => s.clusterId === clusterId && s.namespace === namespace)

  if (name) {
    filtered = filtered.filter(s => s.name.toLowerCase().includes(name.toLowerCase()))
  }
  if (status) {
    filtered = filtered.filter(s => s.status === status)
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
function getStatefulSetDetail(clusterId: string, namespace: string, name: string) {
  const statefulSet = mockStatefulSets.find(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  return statefulSet || null
}

/**
 * 创建 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param data - 创建参数
 * @returns 创建的 StatefulSet ID
 */
function createStatefulSet(clusterId: string, namespace: string, data: Partial<StatefulSetReq>) {
  const newStatefulSet: StatefulSetResp = {
    id: generateId(),
    name: data.name || '',
    namespace: namespace,
    clusterId: clusterId,
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: data.replicas || 1,
    readyReplicas: data.replicas || 1,
    currentReplicas: data.replicas || 1,
    serviceName: data.serviceName || '',
    updateStrategy: data.updateStrategy || 'RollingUpdate',
    podManagementPolicy: data.podManagementPolicy || 'OrderedReady',
    images: data.containers?.map(c => c.image) || [],
    selector: data.selector,
    labels: data.labels,
    annotations: data.annotations,
    volumeClaimTemplates: data.volumeClaimTemplates,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockStatefulSets.push(newStatefulSet)
  return newStatefulSet.id
}

/**
 * 更新 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @param data - 更新参数
 * @returns 更新后的 StatefulSet ID
 */
function updateStatefulSet(clusterId: string, namespace: string, name: string, data: Partial<StatefulSetReq>) {
  const index = mockStatefulSets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return null

  const updated = {
    ...mockStatefulSets[index],
    ...data,
    images: data.containers?.map(c => c.image) || mockStatefulSets[index].images,
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockStatefulSets[index] = updated
  return updated.id
}

/**
 * 扩缩容 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @param data - 扩缩容参数
 * @returns 操作结果
 */
function scaleStatefulSet(clusterId: string, namespace: string, name: string, data: StatefulSetScaleReq) {
  const index = mockStatefulSets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return false

  mockStatefulSets[index] = {
    ...mockStatefulSets[index],
    replicas: data.replicas,
    readyReplicas: data.replicas,
    currentReplicas: data.replicas,
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  return true
}

/**
 * 更新 StatefulSet 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @param data - 标签数据
 * @returns 操作结果
 */
function manageStatefulSetLabels(clusterId: string, namespace: string, name: string, data: StatefulSetLabelsReq) {
  const index = mockStatefulSets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return false

  const currentLabels = mockStatefulSets[index].labels || {}

  if (data.operation === 1) {
    // 新增
    mockStatefulSets[index].labels = { ...currentLabels, ...data.labels }
  } else if (data.operation === 2) {
    // 移除
    const newLabels = { ...currentLabels }
    Object.keys(data.labels).forEach(key => delete newLabels[key])
    mockStatefulSets[index].labels = newLabels
  } else if (data.operation === 3) {
    // 全量替换
    mockStatefulSets[index].labels = data.labels
  }

  mockStatefulSets[index].updateAt = new Date().toLocaleString()
  mockStatefulSets[index].updateBy = 'admin'
  return true
}

/**
 * 更新 StatefulSet 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @param data - 注解数据
 * @returns 操作结果
 */
function manageStatefulSetAnnotations(clusterId: string, namespace: string, name: string, data: StatefulSetAnnotationsReq) {
  const index = mockStatefulSets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return false

  const currentAnnotations = mockStatefulSets[index].annotations || {}

  if (data.operation === 1) {
    // 新增
    mockStatefulSets[index].annotations = { ...currentAnnotations, ...data.annotations }
  } else if (data.operation === 2) {
    // 移除
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations).forEach(key => delete newAnnotations[key])
    mockStatefulSets[index].annotations = newAnnotations
  } else if (data.operation === 3) {
    // 全量替换
    mockStatefulSets[index].annotations = data.annotations
  }

  mockStatefulSets[index].updateAt = new Date().toLocaleString()
  mockStatefulSets[index].updateBy = 'admin'
  return true
}

/**
 * 删除 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @returns 是否删除成功
 */
function deleteStatefulSet(clusterId: string, namespace: string, name: string) {
  const index = mockStatefulSets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return false

  mockStatefulSets.splice(index, 1)
  return true
}

/**
 * 批量删除 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param names - StatefulSet 名称数组
 * @returns 是否删除成功
 */
function deleteStatefulSets(clusterId: string, namespace: string, names: string[]) {
  names.forEach((name: string) => {
    const index = mockStatefulSets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
    if (index !== -1) {
      mockStatefulSets.splice(index, 1)
    }
  })
  return true
}

/**
 * 模拟 StatefulSet 数据
 */
const mockStatefulSets: StatefulSetResp[] = [
  {
    id: generateId(),
    name: 'mysql-primary',
    namespace: 'data',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 3,
    readyReplicas: 3,
    currentReplicas: 3,
    serviceName: 'mysql-primary-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    images: ['mysql:8.0'],
    selector: { app: 'mysql-primary' },
    labels: {
      app: 'mysql-primary',
      tier: 'database',
      env: 'production'
    },
    annotations: {
      description: 'MySQL 主库集群'
    },
    volumeClaimTemplates: [
      {
        name: 'data-volume',
        storageClassName: 'ssd-storage',
        resources: { requests: { storage: '100Gi' } },
        accessModes: ['ReadWriteOnce']
      }
    ],
    createAt: '2024-01-20 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-15 14:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'mysql-replica',
    namespace: 'data',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 3,
    readyReplicas: 3,
    currentReplicas: 3,
    serviceName: 'mysql-replica-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    images: ['mysql:8.0'],
    selector: { app: 'mysql-replica' },
    labels: {
      app: 'mysql-replica',
      tier: 'database',
      env: 'production'
    },
    annotations: {
      description: 'MySQL 从库集群'
    },
    volumeClaimTemplates: [
      {
        name: 'data-volume',
        storageClassName: 'ssd-storage',
        resources: { requests: { storage: '100Gi' } },
        accessModes: ['ReadWriteOnce']
      }
    ],
    createAt: '2024-01-20 10:05:00',
    createBy: 'admin',
    updateAt: '2024-03-15 14:05:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'mongodb',
    namespace: 'data',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 3,
    readyReplicas: 3,
    currentReplicas: 3,
    serviceName: 'mongodb-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    images: ['mongo:7.0'],
    selector: { app: 'mongodb' },
    labels: {
      app: 'mongodb',
      tier: 'database',
      env: 'production'
    },
    annotations: {
      description: 'MongoDB 副本集'
    },
    volumeClaimTemplates: [
      {
        name: 'data-volume',
        storageClassName: 'ssd-storage',
        resources: { requests: { storage: '50Gi' } },
        accessModes: ['ReadWriteOnce']
      }
    ],
    createAt: '2024-02-01 09:00:00',
    createBy: 'admin',
    updateAt: '2024-03-10 11:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'redis-cluster',
    namespace: 'data',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 6,
    readyReplicas: 6,
    currentReplicas: 6,
    serviceName: 'redis-cluster-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    images: ['redis:7.2-cluster'],
    selector: { app: 'redis-cluster' },
    labels: {
      app: 'redis-cluster',
      tier: 'cache',
      env: 'production'
    },
    annotations: {
      description: 'Redis Cluster 集群'
    },
    volumeClaimTemplates: [
      {
        name: 'data-volume',
        storageClassName: 'ssd-storage',
        resources: { requests: { storage: '20Gi' } },
        accessModes: ['ReadWriteOnce']
      }
    ],
    createAt: '2024-02-05 14:00:00',
    createBy: 'admin',
    updateAt: '2024-03-12 10:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'zookeeper',
    namespace: 'middleware',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 3,
    readyReplicas: 3,
    currentReplicas: 3,
    serviceName: 'zookeeper-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    images: ['zookeeper:3.9'],
    selector: { app: 'zookeeper' },
    labels: {
      app: 'zookeeper',
      tier: 'middleware',
      env: 'production'
    },
    annotations: {
      description: 'Zookeeper 集群'
    },
    volumeClaimTemplates: [
      {
        name: 'data-volume',
        storageClassName: 'standard-storage',
        resources: { requests: { storage: '10Gi' } },
        accessModes: ['ReadWriteOnce']
      }
    ],
    createAt: '2024-02-10 08:00:00',
    createBy: 'admin',
    updateAt: '2024-03-08 09:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'kafka',
    namespace: 'middleware',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 3,
    readyReplicas: 3,
    currentReplicas: 3,
    serviceName: 'kafka-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    images: ['confluentinc/cp-kafka:7.6.0'],
    selector: { app: 'kafka' },
    labels: {
      app: 'kafka',
      tier: 'middleware',
      env: 'production'
    },
    annotations: {
      description: 'Kafka 消息队列集群'
    },
    volumeClaimTemplates: [
      {
        name: 'data-volume',
        storageClassName: 'ssd-storage',
        resources: { requests: { storage: '200Gi' } },
        accessModes: ['ReadWriteOnce']
      }
    ],
    createAt: '2024-02-15 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-15 12:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'minio',
    namespace: 'storage',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 4,
    readyReplicas: 4,
    currentReplicas: 4,
    serviceName: 'minio-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'Parallel',
    images: ['minio/minio:RELEASE.2024-01-16T16-07-38Z'],
    selector: { app: 'minio' },
    labels: {
      app: 'minio',
      tier: 'storage',
      env: 'production'
    },
    annotations: {
      description: 'MinIO 对象存储集群'
    },
    volumeClaimTemplates: [
      {
        name: 'data-volume',
        storageClassName: 'ssd-storage',
        resources: { requests: { storage: '500Gi' } },
        accessModes: ['ReadWriteOnce']
      }
    ],
    createAt: '2024-02-20 11:00:00',
    createBy: 'admin',
    updateAt: '2024-03-18 15:00:00',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: 'elasticsearch',
    namespace: 'logging',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Degraded',
    replicas: 3,
    readyReplicas: 2,
    currentReplicas: 2,
    serviceName: 'elasticsearch-headless',
    updateStrategy: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    images: ['elasticsearch:8.12.0'],
    selector: { app: 'elasticsearch' },
    labels: {
      app: 'elasticsearch',
      tier: 'logging',
      env: 'production'
    },
    annotations: {
      description: 'Elasticsearch 日志存储集群'
    },
    volumeClaimTemplates: [
      {
        name: 'data-volume',
        storageClassName: 'ssd-storage',
        resources: { requests: { storage: '300Gi' } },
        accessModes: ['ReadWriteOnce']
      }
    ],
    createAt: '2024-03-01 09:00:00',
    createBy: 'admin',
    updateAt: '2024-03-19 16:00:00',
    updateBy: 'admin'
  }
]
