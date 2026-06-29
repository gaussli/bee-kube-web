/**
 * Kubernetes StatefulSet 管理 Mock API
 * @module mock/kubernetes/workload/statefulset
 */
import type { PageResp } from '@/types/common'
import type {
  StatefulSetQueryReq,
  StatefulSetReq,
  StatefulSetResp,
  StatefulSetLabelsReq,
  StatefulSetAnnotationsReq,
  StatefulSetScaleReq,
  StatefulSetYamlReq
} from '@/types/kubernetes/workload/statefulset'
import { generateId } from '@/mock/utils'

/**
 * StatefulSet 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets - 获取 StatefulSet 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name - 获取 StatefulSet 详情
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/yaml - 查看 YAML
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets - 创建 StatefulSet
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name - 更新 StatefulSet
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/scale - 扩缩容
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/restart - 重启
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/rollback - 回滚
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name - 删除 StatefulSet
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/batch - 批量删除
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/export - 导出 CSV
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/import - 导入 StatefulSet
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets',
    handler: (pathParams: Record<string, string>, params: Partial<StatefulSetQueryReq>): PageResp<StatefulSetResp> => getStatefulSetPage(pathParams.clusterId, pathParams.namespace, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name',
    handler: (pathParams: Record<string, string>): StatefulSetResp => getStatefulSetDetail(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/yaml',
    handler: (pathParams: Record<string, string>): string => getStatefulSetYaml(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets',
    handler: (pathParams: Record<string, string>, data: Partial<StatefulSetReq>): void => createStatefulSet(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name',
    handler: (pathParams: Record<string, string>, data: Partial<StatefulSetReq>): void => updateStatefulSet(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/scale',
    handler: (pathParams: Record<string, string>, data: Partial<StatefulSetScaleReq>): void => scaleStatefulSet(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
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
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/labels',
    handler: (pathParams: Record<string, string>, data: Partial<StatefulSetLabelsReq>): void => manageStatefulSetLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/annotations',
    handler: (pathParams: Record<string, string>, data: Partial<StatefulSetAnnotationsReq>): void => manageStatefulSetAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
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
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/export',
    handler: (pathParams: Record<string, string>, params: Partial<StatefulSetQueryReq>): void => exportStatefulSet(pathParams.clusterId, pathParams.namespace, params)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/import',
    handler: (pathParams: Record<string, string>, data: Partial<StatefulSetYamlReq>): void => importStatefulSet(pathParams.clusterId, pathParams.namespace, data)
  }
]

/**
 * 获取 StatefulSet 分页列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param params - 查询参数
 * @returns 分页数据
 */
function getStatefulSetPage(clusterId: string, namespace: string, params: Partial<StatefulSetQueryReq>): PageResp<StatefulSetResp> {
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
function getStatefulSetDetail(clusterId: string, namespace: string, name: string): StatefulSetResp {
  const statefulSet = mockStatefulSets.find(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (!statefulSet) {
    console.error('[Get StatefulSet Detail] can not find statefulset:', clusterId, namespace, name)
  }
  return statefulSet!
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

  const labels = Object.entries(statefulSet.labels || {})
    .map(([key, value]) => `      ${key}: "${value}"`)
    .join('\n')

  const annotations = Object.entries(statefulSet.annotations || {})
    .map(([key, value]) => `      ${key}: "${value}"`)
    .join('\n')

  const containers = statefulSet.images
    .map((image, index) => {
      return `      - name: ${statefulSet.name}-container-${index}
        image: ${image}
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"`
    })
    .join('\n')

  const volumeClaimTemplates = (statefulSet.volumeClaimTemplates || [])
    .map(vct => {
      return `  - metadata:
      name: ${vct.name}
    spec:
      accessModes: [${(vct.accessModes || ['ReadWriteOnce']).map(m => `"${m}"`).join(', ')}]
      storageClassName: ${vct.storageClassName || ''}
      resources:
        requests:
          storage: ${vct.resources?.requests?.storage || '10Gi'}`
    })
    .join('\n')

  const yaml = `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: ${statefulSet.name}
  namespace: ${statefulSet.namespace}
  labels:
${labels}
  annotations:
${annotations}
  creationTimestamp: "${statefulSet.createAt}"
  resourceVersion: "${generateId()}"
  uid: "${generateId()}"
spec:
  serviceName: ${statefulSet.serviceName}
  replicas: ${statefulSet.replicas}
  selector:
    matchLabels:
      ${Object.entries(statefulSet.selector || {})[0] ? `${Object.entries(statefulSet.selector || {})[0][0]}: "${Object.entries(statefulSet.selector || {})[0][1]}"` : ''}
  podManagementPolicy: ${statefulSet.podManagementPolicy || 'OrderedReady'}
  updateStrategy:
    type: ${statefulSet.updateStrategy || 'RollingUpdate'}
  template:
    metadata:
      creationTimestamp: "${statefulSet.createAt}"
      labels:
${labels}
    spec:
      containers:
${containers}
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
  volumeClaimTemplates:
${volumeClaimTemplates}
status:
  observedGeneration: 1
  replicas: ${statefulSet.replicas}
  readyReplicas: ${statefulSet.readyReplicas}
  currentReplicas: ${statefulSet.currentReplicas}`

  return yaml
}

/**
 * 创建 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param data - 创建参数
 */
function createStatefulSet(clusterId: string, namespace: string, data: Partial<StatefulSetReq>): void {
  const created: StatefulSetResp = {
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
    selector: data.selector || {},
    labels: data.labels || {},
    annotations: data.annotations || {},
    volumeClaimTemplates: data.volumeClaimTemplates,
    deletable: true,
    createBy: 'admin',
    createAt: new Date().toLocaleString(),
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
  mockStatefulSets.push(created)
}

/**
 * 更新 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @param data - 更新参数
 */
function updateStatefulSet(clusterId: string, namespace: string, name: string, data: Partial<StatefulSetReq>): void {
  const index = mockStatefulSets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) {
    console.error('[Update StatefulSet] can not find statefulset:', clusterId, namespace, name)
    return
  }

  const updated = {
    ...mockStatefulSets[index],
    ...data,
    images: data.containers?.map(c => c.image) || mockStatefulSets[index].images,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
  mockStatefulSets[index] = updated
}

/**
 * 扩缩容 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @param data - 扩缩容参数
 */
function scaleStatefulSet(clusterId: string, namespace: string, name: string, data: Partial<StatefulSetScaleReq>): void {
  const index = mockStatefulSets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) {
    console.error('[Scale StatefulSet] can not find statefulset:', clusterId, namespace, name)
    return
  }

  mockStatefulSets[index] = {
    ...mockStatefulSets[index],
    replicas: data.replicas ?? mockStatefulSets[index].replicas,
    readyReplicas: data.replicas ?? mockStatefulSets[index].replicas,
    currentReplicas: data.replicas ?? mockStatefulSets[index].replicas,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
}

/**
 * 重启 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 */
function restartStatefulSet(clusterId: string, namespace: string, name: string): void {
  const index = mockStatefulSets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) {
    console.error('[Restart StatefulSet] can not find statefulset:', clusterId, namespace, name)
    return
  }
  console.log('[Restart StatefulSet] restart:', clusterId, namespace, name)
  mockStatefulSets[index].updateAt = new Date().toLocaleString()
  mockStatefulSets[index].updateBy = 'admin'
}

/**
 * 回滚 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 */
function rollbackStatefulSet(clusterId: string, namespace: string, name: string): void {
  const index = mockStatefulSets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) {
    console.error('[Rollback StatefulSet] can not find statefulset:', clusterId, namespace, name)
    return
  }
  console.log('[Rollback StatefulSet] rollback:', clusterId, namespace, name)
  mockStatefulSets[index].updateAt = new Date().toLocaleString()
  mockStatefulSets[index].updateBy = 'admin'
}

/**
 * 更新 StatefulSet 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @param data - 标签数据
 */
function manageStatefulSetLabels(clusterId: string, namespace: string, name: string, data: Partial<StatefulSetLabelsReq>): void {
  const index = mockStatefulSets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) {
    console.error('[Manage StatefulSet Labels] can not find statefulset:', clusterId, namespace, name)
    return
  }

  const currentLabels = mockStatefulSets[index].labels || {}

  if (data.operation === 1) {
    mockStatefulSets[index].labels = { ...currentLabels, ...data.labels }
  } else if (data.operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(data.labels).forEach(key => delete newLabels[key])
    mockStatefulSets[index].labels = newLabels
  } else if (data.operation === 3) {
    mockStatefulSets[index].labels = data.labels
  }

  mockStatefulSets[index].updateBy = 'admin'
  mockStatefulSets[index].updateAt = new Date().toLocaleString()
}

/**
 * 更新 StatefulSet 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @param data - 注解数据
 */
function manageStatefulSetAnnotations(clusterId: string, namespace: string, name: string, data: Partial<StatefulSetAnnotationsReq>): void {
  const index = mockStatefulSets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) {
    console.error('[Manage StatefulSet Annotations] can not find statefulset:', clusterId, namespace, name)
    return
  }

  const currentAnnotations = mockStatefulSets[index].annotations || {}

  if (data.operation === 1) {
    mockStatefulSets[index].annotations = { ...currentAnnotations, ...data.annotations }
  } else if (data.operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations).forEach(key => delete newAnnotations[key])
    mockStatefulSets[index].annotations = newAnnotations
  } else if (data.operation === 3) {
    mockStatefulSets[index].annotations = data.annotations
  }

  mockStatefulSets[index].updateBy = 'admin'
  mockStatefulSets[index].updateAt = new Date().toLocaleString()
}

/**
 * 删除 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 */
function deleteStatefulSet(clusterId: string, namespace: string, name: string): void {
  const index = mockStatefulSets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) {
    console.error('[Delete StatefulSet] can not find statefulset:', clusterId, namespace, name)
    return
  }

  mockStatefulSets.splice(index, 1)
}

/**
 * 批量删除 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param names - StatefulSet 名称数组
 */
function deleteStatefulSets(clusterId: string, namespace: string, names: string[]): void {
  names.forEach(name => {
    const index = mockStatefulSets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
    if (index === -1) {
      console.error('[Delete StatefulSets] can not find statefulset:', clusterId, namespace, name)
    } else {
      mockStatefulSets.splice(index, 1)
    }
  })
}

/**
 * 导出 StatefulSet CSV
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param params - 查询参数
 */
function exportStatefulSet(clusterId: string, namespace: string, params: Partial<StatefulSetQueryReq>): void {
  const { name, status } = params || {}

  let statefulSets = mockStatefulSets.filter(s => s.clusterId === clusterId && s.namespace === namespace)

  if (name) {
    statefulSets = statefulSets.filter(s => s.name.toLowerCase().includes(name.toLowerCase()))
  }
  if (status) {
    statefulSets = statefulSets.filter(s => s.status === status)
  }

  const headers = ['名称', '命名空间', '集群名称', '状态', '期望副本数', '就绪副本数', '当前副本数', '服务名', '更新策略', 'Pod管理策略', '镜像', '标签', '创建时间', '创建人', '更新时间', '更新人']
  const rows = statefulSets.map(s => [
    s.name,
    s.namespace,
    s.clusterName,
    s.status,
    s.replicas,
    s.readyReplicas,
    s.currentReplicas,
    s.serviceName,
    s.updateStrategy,
    s.podManagementPolicy,
    s.images.join(';'),
    Object.entries(s.labels || {})
      .map(([k, v]) => `${k}=${v}`)
      .join(';'),
    s.createAt,
    s.createBy,
    s.updateAt,
    s.updateBy
  ])

  const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n')
  console.log('[Export StatefulSet CSV]', csvContent)
}

/**
 * 导入 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param data - YAML 配置
 */
function importStatefulSet(clusterId: string, namespace: string, data: Partial<StatefulSetYamlReq>): void {
  console.log('[Import StatefulSet]', clusterId, namespace, data.yaml)
}

/**
 * 模拟 StatefulSet 数据
 */
const mockStatefulSets: StatefulSetResp[] = [
  {
    id: generateId(),
    name: 'mysql-primary',
    namespace: 'data',
    clusterId: generateId(),
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
    labels: { app: 'mysql-primary', tier: 'database', env: 'production' },
    annotations: { description: 'MySQL 主库集群' },
    volumeClaimTemplates: [
      {
        name: 'data-volume',
        storageClassName: 'ssd-storage',
        resources: { requests: { storage: '100Gi' } },
        accessModes: ['ReadWriteOnce']
      }
    ],
    deletable: true,
    createBy: 'admin',
    createAt: '2024-01-20 10:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-15 14:00:00'
  },
  {
    id: generateId(),
    name: 'mysql-replica',
    namespace: 'data',
    clusterId: generateId(),
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
    labels: { app: 'mysql-replica', tier: 'database', env: 'production' },
    annotations: { description: 'MySQL 从库集群' },
    volumeClaimTemplates: [
      {
        name: 'data-volume',
        storageClassName: 'ssd-storage',
        resources: { requests: { storage: '100Gi' } },
        accessModes: ['ReadWriteOnce']
      }
    ],
    deletable: true,
    createBy: 'admin',
    createAt: '2024-01-20 10:05:00',
    updateBy: 'admin',
    updateAt: '2024-03-15 14:05:00'
  },
  {
    id: generateId(),
    name: 'mongodb',
    namespace: 'data',
    clusterId: generateId(),
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
    labels: { app: 'mongodb', tier: 'database', env: 'production' },
    annotations: { description: 'MongoDB 副本集' },
    volumeClaimTemplates: [
      {
        name: 'data-volume',
        storageClassName: 'ssd-storage',
        resources: { requests: { storage: '50Gi' } },
        accessModes: ['ReadWriteOnce']
      }
    ],
    deletable: true,
    createBy: 'admin',
    createAt: '2024-02-01 09:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-10 11:00:00'
  },
  {
    id: generateId(),
    name: 'redis-cluster',
    namespace: 'data',
    clusterId: generateId(),
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
    labels: { app: 'redis-cluster', tier: 'cache', env: 'production' },
    annotations: { description: 'Redis Cluster 集群' },
    volumeClaimTemplates: [
      {
        name: 'data-volume',
        storageClassName: 'ssd-storage',
        resources: { requests: { storage: '20Gi' } },
        accessModes: ['ReadWriteOnce']
      }
    ],
    deletable: true,
    createBy: 'admin',
    createAt: '2024-02-05 14:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-12 10:00:00'
  },
  {
    id: generateId(),
    name: 'zookeeper',
    namespace: 'middleware',
    clusterId: generateId(),
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
    labels: { app: 'zookeeper', tier: 'middleware', env: 'production' },
    annotations: { description: 'Zookeeper 集群' },
    volumeClaimTemplates: [
      {
        name: 'data-volume',
        storageClassName: 'standard-storage',
        resources: { requests: { storage: '10Gi' } },
        accessModes: ['ReadWriteOnce']
      }
    ],
    deletable: true,
    createBy: 'admin',
    createAt: '2024-02-10 08:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-08 09:00:00'
  },
  {
    id: generateId(),
    name: 'kafka',
    namespace: 'middleware',
    clusterId: generateId(),
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
    labels: { app: 'kafka', tier: 'middleware', env: 'production' },
    annotations: { description: 'Kafka 消息队列集群' },
    volumeClaimTemplates: [
      {
        name: 'data-volume',
        storageClassName: 'ssd-storage',
        resources: { requests: { storage: '200Gi' } },
        accessModes: ['ReadWriteOnce']
      }
    ],
    deletable: true,
    createBy: 'admin',
    createAt: '2024-02-15 10:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-15 12:00:00'
  },
  {
    id: generateId(),
    name: 'minio',
    namespace: 'storage',
    clusterId: generateId(),
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
    labels: { app: 'minio', tier: 'storage', env: 'production' },
    annotations: { description: 'MinIO 对象存储集群' },
    volumeClaimTemplates: [
      {
        name: 'data-volume',
        storageClassName: 'ssd-storage',
        resources: { requests: { storage: '500Gi' } },
        accessModes: ['ReadWriteOnce']
      }
    ],
    deletable: true,
    createBy: 'admin',
    createAt: '2024-02-20 11:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-18 15:00:00'
  },
  {
    id: generateId(),
    name: 'elasticsearch',
    namespace: 'logging',
    clusterId: generateId(),
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
    labels: { app: 'elasticsearch', tier: 'logging', env: 'production' },
    annotations: { description: 'Elasticsearch 日志存储集群' },
    volumeClaimTemplates: [
      {
        name: 'data-volume',
        storageClassName: 'ssd-storage',
        resources: { requests: { storage: '300Gi' } },
        accessModes: ['ReadWriteOnce']
      }
    ],
    deletable: true,
    createBy: 'admin',
    createAt: '2024-03-01 09:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-19 16:00:00'
  }
]
