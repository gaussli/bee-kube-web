/**
 * Kubernetes DaemonSet 管理 Mock API
 * @module mock/kubernetes/workload/daemonset
 */
import type { PageResp } from '@/types/common'
import type { DaemonSetQueryReq, DaemonSetReq, DaemonSetResp, DaemonSetLabelsReq, DaemonSetAnnotationsReq, DaemonSetYamlReq } from '@/types/kubernetes/workload/daemonset'
import { generateId } from '@/mock/utils'

/**
 * DaemonSet 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets - 获取 DaemonSet 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name - 获取 DaemonSet 详情
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name/yaml - 查看 YAML
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets - 创建 DaemonSet
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name - 更新 DaemonSet
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name/restart - 重启
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name/rollback - 回滚
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name - 删除 DaemonSet
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/batch - 批量删除
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/export - 导出 CSV
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/import - 导入 DaemonSet
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets',
    handler: (pathParams: Record<string, string>, params: Partial<DaemonSetQueryReq>): PageResp<DaemonSetResp> => getDaemonSetPage(pathParams.clusterId, pathParams.namespace, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name',
    handler: (pathParams: Record<string, string>): DaemonSetResp => getDaemonSetDetail(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name/yaml',
    handler: (pathParams: Record<string, string>): string => getDaemonSetYaml(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets',
    handler: (pathParams: Record<string, string>, data: Partial<DaemonSetReq>): void => createDaemonSet(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name',
    handler: (pathParams: Record<string, string>, data: Partial<DaemonSetReq>): void => updateDaemonSet(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name/restart',
    handler: (pathParams: Record<string, string>): void => restartDaemonSet(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name/rollback',
    handler: (pathParams: Record<string, string>): void => rollbackDaemonSet(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name/labels',
    handler: (pathParams: Record<string, string>, data: Partial<DaemonSetLabelsReq>): void => manageDaemonSetLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name/annotations',
    handler: (pathParams: Record<string, string>, data: Partial<DaemonSetAnnotationsReq>): void => manageDaemonSetAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name',
    handler: (pathParams: Record<string, string>): void => deleteDaemonSet(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/batch',
    handler: (pathParams: Record<string, string>, data: string[]): void => deleteDaemonSets(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/export',
    handler: (pathParams: Record<string, string>, params: Partial<DaemonSetQueryReq>): void => exportDaemonSet(pathParams.clusterId, pathParams.namespace, params)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/import',
    handler: (pathParams: Record<string, string>, data: Partial<DaemonSetYamlReq>): void => importDaemonSet(pathParams.clusterId, pathParams.namespace, data)
  }
]

/**
 * 获取 DaemonSet 分页列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param params - 查询参数
 * @returns 分页数据
 */
function getDaemonSetPage(clusterId: string, namespace: string, params: Partial<DaemonSetQueryReq>): PageResp<DaemonSetResp> {
  const { name, status, page = 1, pageSize = 10 } = params || {}

  let filtered = mockDaemonSets.filter(d => d.clusterId === clusterId && d.namespace === namespace)

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
 * 获取 DaemonSet 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - DaemonSet 名称
 * @returns DaemonSet 详情
 */
function getDaemonSetDetail(clusterId: string, namespace: string, name: string): DaemonSetResp {
  const daemonSet = mockDaemonSets.find(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (!daemonSet) {
    console.error('[Get DaemonSet Detail] can not find daemonset:', clusterId, namespace, name)
  }
  return daemonSet!
}

/**
 * 查看 DaemonSet YAML
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - DaemonSet 名称
 * @returns DaemonSet YAML 配置
 */
function getDaemonSetYaml(clusterId: string, namespace: string, name: string): string {
  const daemonSet = mockDaemonSets.find(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (!daemonSet) {
    console.error('[Get DaemonSet Yaml] can not find daemonset:', clusterId, namespace, name)
    return ''
  }

  const labels = Object.entries(daemonSet.labels || {})
    .map(([key, value]) => `      ${key}: "${value}"`)
    .join('\n')

  const annotations = Object.entries(daemonSet.annotations || {})
    .map(([key, value]) => `      ${key}: "${value}"`)
    .join('\n')

  const containers = daemonSet.images.map((image, index) => {
    return `      - name: ${daemonSet.name}-container-${index}
        image: ${image}
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"`
  }).join('\n')

  const yaml = `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: ${daemonSet.name}
  namespace: ${daemonSet.namespace}
  labels:
${labels}
  annotations:
${annotations}
  creationTimestamp: "${daemonSet.createAt}"
  resourceVersion: "${generateId()}"
  uid: "${generateId()}"
spec:
  selector:
    matchLabels:
      ${Object.entries(daemonSet.selector || {})[0] ? `${Object.entries(daemonSet.selector || {})[0][0]}: "${Object.entries(daemonSet.selector || {})[0][1]}"` : ''}
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 0
      maxUnavailable: 1
  template:
    metadata:
      creationTimestamp: "${daemonSet.createAt}"
      labels:
${labels}
    spec:
      containers:
${containers}
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      tolerations:
      - key: "node.kubernetes.io/not-ready"
        operator: "Exists"
        effect: "NoSchedule"
      - key: "node.kubernetes.io/unreachable"
        operator: "Exists"
        effect: "NoSchedule"
status:
  observedGeneration: 1
  currentNumberScheduled: ${daemonSet.currentReplicas}
  numberMisscheduled: 0
  desiredNumberScheduled: ${daemonSet.replicas}
  numberReady: ${daemonSet.readyReplicas}
  updatedNumberScheduled: ${daemonSet.replicas}
  numberAvailable: ${daemonSet.availableReplicas}`

  return yaml
}

/**
 * 创建 DaemonSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param data - 创建参数
 */
function createDaemonSet(clusterId: string, namespace: string, data: Partial<DaemonSetReq>): void {
  const created: DaemonSetResp = {
    id: generateId(),
    name: data.name || '',
    namespace: namespace,
    clusterId: clusterId,
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 1,
    readyReplicas: 1,
    currentReplicas: 1,
    availableReplicas: 1,
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
  mockDaemonSets.push(created)
}

/**
 * 更新 DaemonSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - DaemonSet 名称
 * @param data - 更新参数
 */
function updateDaemonSet(clusterId: string, namespace: string, name: string, data: Partial<DaemonSetReq>): void {
  const index = mockDaemonSets.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) {
    console.error('[Update DaemonSet] can not find daemonset:', clusterId, namespace, name)
    return
  }

  const updated = {
    ...mockDaemonSets[index],
    ...data,
    images: data.containers?.map(c => c.image) || mockDaemonSets[index].images,
    updateBy: 'admin',
    updateAt: new Date().toLocaleString()
  }
  mockDaemonSets[index] = updated
}

/**
 * 重启 DaemonSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - DaemonSet 名称
 */
function restartDaemonSet(clusterId: string, namespace: string, name: string): void {
  const index = mockDaemonSets.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) {
    console.error('[Restart DaemonSet] can not find daemonset:', clusterId, namespace, name)
    return
  }
  console.log('[Restart DaemonSet] restart:', clusterId, namespace, name)
  mockDaemonSets[index].updateAt = new Date().toLocaleString()
  mockDaemonSets[index].updateBy = 'admin'
}

/**
 * 回滚 DaemonSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - DaemonSet 名称
 */
function rollbackDaemonSet(clusterId: string, namespace: string, name: string): void {
  const index = mockDaemonSets.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) {
    console.error('[Rollback DaemonSet] can not find daemonset:', clusterId, namespace, name)
    return
  }
  console.log('[Rollback DaemonSet] rollback:', clusterId, namespace, name)
  mockDaemonSets[index].updateAt = new Date().toLocaleString()
  mockDaemonSets[index].updateBy = 'admin'
}

/**
 * 更新 DaemonSet 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - DaemonSet 名称
 * @param data - 标签数据
 */
function manageDaemonSetLabels(clusterId: string, namespace: string, name: string, data: Partial<DaemonSetLabelsReq>): void {
  const index = mockDaemonSets.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) {
    console.error('[Manage DaemonSet Labels] can not find daemonset:', clusterId, namespace, name)
    return
  }

  const currentLabels = mockDaemonSets[index].labels || {}

  if (data.operation === 1) {
    mockDaemonSets[index].labels = { ...currentLabels, ...data.labels }
  } else if (data.operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(data.labels).forEach(key => delete newLabels[key])
    mockDaemonSets[index].labels = newLabels
  } else if (data.operation === 3) {
    mockDaemonSets[index].labels = data.labels
  }

  mockDaemonSets[index].updateBy = 'admin'
  mockDaemonSets[index].updateAt = new Date().toLocaleString()
}

/**
 * 更新 DaemonSet 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - DaemonSet 名称
 * @param data - 注解数据
 */
function manageDaemonSetAnnotations(clusterId: string, namespace: string, name: string, data: Partial<DaemonSetAnnotationsReq>): void {
  const index = mockDaemonSets.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) {
    console.error('[Manage DaemonSet Annotations] can not find daemonset:', clusterId, namespace, name)
    return
  }

  const currentAnnotations = mockDaemonSets[index].annotations || {}

  if (data.operation === 1) {
    mockDaemonSets[index].annotations = { ...currentAnnotations, ...data.annotations }
  } else if (data.operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations).forEach(key => delete newAnnotations[key])
    mockDaemonSets[index].annotations = newAnnotations
  } else if (data.operation === 3) {
    mockDaemonSets[index].annotations = data.annotations
  }

  mockDaemonSets[index].updateBy = 'admin'
  mockDaemonSets[index].updateAt = new Date().toLocaleString()
}

/**
 * 删除 DaemonSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - DaemonSet 名称
 */
function deleteDaemonSet(clusterId: string, namespace: string, name: string): void {
  const index = mockDaemonSets.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) {
    console.error('[Delete DaemonSet] can not find daemonset:', clusterId, namespace, name)
    return
  }

  mockDaemonSets.splice(index, 1)
}

/**
 * 批量删除 DaemonSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param names - DaemonSet 名称数组
 */
function deleteDaemonSets(clusterId: string, namespace: string, names: string[]): void {
  names.forEach(name => {
    const index = mockDaemonSets.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
    if (index === -1) {
      console.error('[Delete DaemonSets] can not find daemonset:', clusterId, namespace, name)
    } else {
      mockDaemonSets.splice(index, 1)
    }
  })
}

/**
 * 导出 DaemonSet CSV
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param params - 查询参数
 */
function exportDaemonSet(clusterId: string, namespace: string, params: Partial<DaemonSetQueryReq>): void {
  const { name, status } = params || {}

  let daemonSets = mockDaemonSets.filter(d => d.clusterId === clusterId && d.namespace === namespace)

  if (name) {
    daemonSets = daemonSets.filter(d => d.name.toLowerCase().includes(name.toLowerCase()))
  }
  if (status) {
    daemonSets = daemonSets.filter(d => d.status === status)
  }

  const headers = ['名称', '命名空间', '集群名称', '状态', '期望副本数', '就绪副本数', '当前副本数', '可用副本数', '镜像', '标签', '创建时间', '创建人', '更新时间', '更新人']
  const rows = daemonSets.map(d => [
    d.name,
    d.namespace,
    d.clusterName,
    d.status,
    d.replicas,
    d.readyReplicas,
    d.currentReplicas,
    d.availableReplicas,
    d.images.join(';'),
    Object.entries(d.labels || {}).map(([k, v]) => `${k}=${v}`).join(';'),
    d.createAt,
    d.createBy,
    d.updateAt,
    d.updateBy
  ])

  const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n')
  console.log('[Export DaemonSet CSV]', csvContent)
}

/**
 * 导入 DaemonSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param data - YAML 配置
 */
function importDaemonSet(clusterId: string, namespace: string, data: Partial<DaemonSetYamlReq>): void {
  console.log('[Import DaemonSet]', clusterId, namespace, data.yaml)
}

/**
 * 模拟 DaemonSet 数据
 */
const mockDaemonSets: DaemonSetResp[] = [
  {
    id: generateId(),
    name: 'kube-proxy',
    namespace: 'kube-system',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 3,
    readyReplicas: 3,
    currentReplicas: 3,
    availableReplicas: 3,
    images: ['registry.k8s.io/kube-proxy:v1.28.3'],
    selector: { 'k8s-app': 'kube-proxy' },
    labels: { 'k8s-app': 'kube-proxy', 'kubernetes.io/os': 'linux' },
    annotations: {},
    deletable: false,
    createBy: 'system',
    createAt: '2024-01-15 10:00:00',
    updateBy: 'system',
    updateAt: '2024-03-15 14:00:00'
  },
  {
    id: generateId(),
    name: 'flannel',
    namespace: 'kube-system',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 3,
    readyReplicas: 3,
    currentReplicas: 3,
    availableReplicas: 3,
    images: ['rancher/mirrored-flannelcni-flannel:v0.21.0'],
    selector: { app: 'flannel' },
    labels: { app: 'flannel', tier: 'network' },
    annotations: {},
    deletable: false,
    createBy: 'system',
    createAt: '2024-01-15 10:05:00',
    updateBy: 'system',
    updateAt: '2024-03-10 11:00:00'
  },
  {
    id: generateId(),
    name: 'node-exporter',
    namespace: 'monitoring',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 3,
    readyReplicas: 3,
    currentReplicas: 3,
    availableReplicas: 3,
    images: ['prom/node-exporter:v1.7.0'],
    selector: { app: 'node-exporter' },
    labels: { app: 'node-exporter', tier: 'monitoring' },
    annotations: {},
    deletable: true,
    createBy: 'admin',
    createAt: '2024-02-01 09:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-05 10:00:00'
  },
  {
    id: generateId(),
    name: 'nvidia-device-plugin',
    namespace: 'gpu',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 2,
    readyReplicas: 2,
    currentReplicas: 2,
    availableReplicas: 2,
    images: ['nvcr.io/nvidia/k8s-device-plugin:v0.14.5'],
    selector: { app: 'nvidia-device-plugin' },
    labels: { app: 'nvidia-device-plugin', tier: 'gpu' },
    annotations: {},
    deletable: true,
    createBy: 'admin',
    createAt: '2024-02-15 14:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-12 16:00:00'
  },
  {
    id: generateId(),
    name: 'local-volume-provisioner',
    namespace: 'storage',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Degraded',
    replicas: 3,
    readyReplicas: 2,
    currentReplicas: 2,
    availableReplicas: 2,
    images: ['quay.io/external_storage/local-volume-provisioner:v2.5.0'],
    selector: { app: 'local-volume-provisioner' },
    labels: { app: 'local-volume-provisioner', tier: 'storage' },
    annotations: {},
    deletable: true,
    createBy: 'admin',
    createAt: '2024-03-01 10:00:00',
    updateBy: 'admin',
    updateAt: '2024-03-19 08:00:00'
  }
]
