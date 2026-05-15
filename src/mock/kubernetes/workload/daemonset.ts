/**
 * @fileOverview Kubernetes DaemonSet 管理 Mock API
 * @module mock/kubernetes/workload/daemonset
 */
import { generateId } from '@/mock/utils'
import type { DaemonSetResp, DaemonSetQueryReq, DaemonSetReq, DaemonSetLabelsReq, DaemonSetAnnotationsReq } from '@/types'

/**
 * DaemonSet 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets - 获取 DaemonSet 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name - 获取 DaemonSet 详情
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets - 创建 DaemonSet
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name - 更新 DaemonSet
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name - 删除 DaemonSet
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/batch - 批量删除
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets',
    handler: (pathParams: Record<string, string>, params: Partial<DaemonSetQueryReq>) => getDaemonSetPage(pathParams.clusterId, pathParams.namespace, params)
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name',
    handler: (pathParams: Record<string, string>, params: any, data: any) => getDaemonSetDetail(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets',
    handler: (pathParams: Record<string, string>, params: any, data: Partial<DaemonSetReq>) => createDaemonSet(pathParams.clusterId, pathParams.namespace, data)
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name',
    handler: (pathParams: Record<string, string>, params: any, data: Partial<DaemonSetReq>) => updateDaemonSet(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name/labels',
    handler: (pathParams: Record<string, string>, params: any, data: DaemonSetLabelsReq) => manageDaemonSetLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name/annotations',
    handler: (pathParams: Record<string, string>, params: any, data: DaemonSetAnnotationsReq) => manageDaemonSetAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/:name',
    handler: (pathParams: Record<string, string>, params: any, data: any) => deleteDaemonSet(pathParams.clusterId, pathParams.namespace, pathParams.name)
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/daemonsets/batch',
    handler: (pathParams: Record<string, string>, params: any, data: string[]) => deleteDaemonSets(pathParams.clusterId, pathParams.namespace, data)
  }
]

function getDaemonSetPage(clusterId: string, namespace: string, params: Partial<DaemonSetQueryReq>) {
  const { name, status, page = 1, pageSize = 10 } = params || {}
  let filtered = mockDaemonSets.filter(d => d.clusterId === clusterId && d.namespace === namespace)
  if (name) filtered = filtered.filter(d => d.name.toLowerCase().includes(name.toLowerCase()))
  if (status) filtered = filtered.filter(d => d.status === status)
  return { list: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, page, pageSize }
}

function getDaemonSetDetail(clusterId: string, namespace: string, name: string) {
  return mockDaemonSets.find(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name) || null
}

function createDaemonSet(clusterId: string, namespace: string, data: Partial<DaemonSetReq>) {
  const newDs: DaemonSetResp = {
    id: generateId(),
    name: data.name || '',
    namespace,
    clusterId,
    clusterName: 'prod-cluster',
    status: 'Available',
    replicas: 1,
    readyReplicas: 1,
    currentReplicas: 1,
    availableReplicas: 1,
    images: data.containers?.map(c => c.image) || [],
    selector: data.selector,
    labels: data.labels,
    annotations: data.annotations,
    createAt: new Date().toLocaleString(),
    createBy: 'admin',
    updateAt: new Date().toLocaleString(),
    updateBy: 'admin'
  }
  mockDaemonSets.push(newDs)
  return newDs.id
}

function updateDaemonSet(clusterId: string, namespace: string, name: string, data: Partial<DaemonSetReq>) {
  const index = mockDaemonSets.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) return null
  const updated = { ...mockDaemonSets[index], ...data, images: data.containers?.map(c => c.image) || mockDaemonSets[index].images, updateAt: new Date().toLocaleString(), updateBy: 'admin' }
  mockDaemonSets[index] = updated
  return updated.id
}

function manageDaemonSetLabels(clusterId: string, namespace: string, name: string, data: DaemonSetLabelsReq) {
  const index = mockDaemonSets.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) return false
  const currentLabels = mockDaemonSets[index].labels || {}
  if (data.operation === 1) mockDaemonSets[index].labels = { ...currentLabels, ...data.labels }
  else if (data.operation === 2) {
    const newLabels = { ...currentLabels }
    Object.keys(data.labels).forEach(key => delete newLabels[key])
    mockDaemonSets[index].labels = newLabels
  } else if (data.operation === 3) mockDaemonSets[index].labels = data.labels
  mockDaemonSets[index].updateAt = new Date().toLocaleString()
  return true
}

function manageDaemonSetAnnotations(clusterId: string, namespace: string, name: string, data: DaemonSetAnnotationsReq) {
  const index = mockDaemonSets.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) return false
  const currentAnnotations = mockDaemonSets[index].annotations || {}
  if (data.operation === 1) mockDaemonSets[index].annotations = { ...currentAnnotations, ...data.annotations }
  else if (data.operation === 2) {
    const newAnnotations = { ...currentAnnotations }
    Object.keys(data.annotations).forEach(key => delete newAnnotations[key])
    mockDaemonSets[index].annotations = newAnnotations
  } else if (data.operation === 3) mockDaemonSets[index].annotations = data.annotations
  mockDaemonSets[index].updateAt = new Date().toLocaleString()
  return true
}

function deleteDaemonSet(clusterId: string, namespace: string, name: string) {
  const index = mockDaemonSets.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) return false
  mockDaemonSets.splice(index, 1)
  return true
}

function deleteDaemonSets(clusterId: string, namespace: string, names: string[]) {
  names.forEach(name => {
    const index = mockDaemonSets.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
    if (index !== -1) mockDaemonSets.splice(index, 1)
  })
  return true
}

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
    createAt: '2024-01-15 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-15 14:00:00',
    updateBy: 'admin'
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
    createAt: '2024-01-15 10:05:00',
    createBy: 'admin',
    updateAt: '2024-03-10 11:00:00',
    updateBy: 'admin'
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
    createAt: '2024-02-01 09:00:00',
    createBy: 'admin',
    updateAt: '2024-03-05 10:00:00',
    updateBy: 'admin'
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
    createAt: '2024-02-15 14:00:00',
    createBy: 'admin',
    updateAt: '2024-03-12 16:00:00',
    updateBy: 'admin'
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
    createAt: '2024-03-01 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-19 08:00:00',
    updateBy: 'admin'
  }
]
