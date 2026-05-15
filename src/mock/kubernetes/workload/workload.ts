/**
 * @fileOverview Kubernetes 工作负载 Mock 数据汇总
 * @module mock/kubernetes/workload/workload
 */
import { generateId } from '@/mock/utils'
import type { DeploymentResp, StatefulSetResp, DaemonSetResp, JobResp, CronJobResp } from '@/types'

// ==================== Deployment 数据 ====================
const mockDeployments: DeploymentResp[] = [
  {
    id: generateId(),
    name: 'nginx-deployment',
    namespace: 'app-frontend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Running',
    replicas: 3,
    readyReplicas: 3,
    availableReplicas: 3,
    strategy: 'RollingUpdate',
    images: ['nginx:1.21-alpine'],
    labels: { app: 'nginx' },
    annotations: {},
    createAt: '2024-02-15 10:30:00',
    updateAt: '2024-03-20 14:22:18',
    deletable: true
  },
  {
    id: generateId(),
    name: 'api-gateway',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Running',
    replicas: 2,
    readyReplicas: 2,
    availableReplicas: 2,
    strategy: 'RollingUpdate',
    images: ['registry.example.com/gateway:v2.1.0', 'envoyproxy/envoy:v1.28.0'],
    labels: { app: 'api-gateway' },
    annotations: {},
    createAt: '2024-02-20 09:00:00',
    updateAt: '2024-03-18 16:45:30',
    deletable: true
  },
  {
    id: generateId(),
    name: 'user-service',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Running',
    replicas: 3,
    readyReplicas: 2,
    availableReplicas: 2,
    strategy: 'RollingUpdate',
    images: ['registry.example.com/user-service:v1.5.2'],
    labels: { app: 'user-service' },
    annotations: {},
    createAt: '2024-02-25 11:00:00',
    updateAt: '2024-03-15 11:30:45',
    deletable: true
  },
  {
    id: generateId(),
    name: 'frontend-app',
    namespace: 'staging-app',
    clusterId: 'cls-002-staging',
    clusterName: 'staging-cluster',
    status: 'Running',
    replicas: 1,
    readyReplicas: 1,
    availableReplicas: 1,
    strategy: 'Recreate',
    images: ['node:18-alpine', 'nginx:1.25-alpine'],
    labels: { app: 'frontend' },
    annotations: {},
    createAt: '2024-03-01 08:00:00',
    updateAt: '2024-03-22 10:15:30',
    deletable: true
  },
  {
    id: generateId(),
    name: 'payment-service',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Running',
    replicas: 4,
    readyReplicas: 4,
    availableReplicas: 4,
    strategy: 'RollingUpdate',
    images: ['registry.example.com/payment:v3.0.1'],
    labels: { app: 'payment', env: 'production' },
    annotations: {},
    createAt: '2024-03-05 14:00:00',
    updateAt: '2024-03-25 09:30:00',
    deletable: true
  },
  {
    id: generateId(),
    name: 'order-service',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Warning',
    replicas: 3,
    readyReplicas: 1,
    availableReplicas: 2,
    strategy: 'RollingUpdate',
    images: ['registry.example.com/order:v2.8.5'],
    labels: { app: 'order' },
    annotations: {},
    createAt: '2024-03-08 10:00:00',
    updateAt: '2024-03-26 11:20:00',
    deletable: true
  },
  {
    id: generateId(),
    name: 'notification-worker',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Running',
    replicas: 2,
    readyReplicas: 2,
    availableReplicas: 2,
    strategy: 'RollingUpdate',
    images: ['redis:7.2-alpine', 'registry.example.com/notification:v1.2.0'],
    labels: { app: 'notification', type: 'worker' },
    annotations: {},
    createAt: '2024-03-10 16:30:00',
    updateAt: '2024-03-24 08:45:00',
    deletable: true
  },
  {
    id: generateId(),
    name: 'coredns',
    namespace: 'kube-system',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Running',
    replicas: 2,
    readyReplicas: 2,
    availableReplicas: 2,
    strategy: 'RollingUpdate',
    images: ['registry.k8s.io/coredns/coredns:v1.11.1'],
    labels: { app: 'coredns' },
    annotations: {},
    createAt: '2024-01-10 08:00:00',
    updateAt: '2024-02-15 10:00:00',
    deletable: false
  },
  {
    id: generateId(),
    name: 'metrics-server',
    namespace: 'kube-system',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    status: 'Running',
    replicas: 1,
    readyReplicas: 1,
    availableReplicas: 1,
    strategy: 'RollingUpdate',
    images: ['registry.k8s.io/metrics-server/metrics-server:v0.7.0'],
    labels: { app: 'metrics-server' },
    annotations: {},
    createAt: '2024-01-15 09:00:00',
    updateAt: '2024-03-01 14:00:00',
    deletable: false
  },
  {
    id: generateId(),
    name: 'dev-test-app',
    namespace: 'dev-test',
    clusterId: 'cls-003-dev',
    clusterName: 'dev-cluster',
    status: 'Stopped',
    replicas: 0,
    readyReplicas: 0,
    availableReplicas: 0,
    strategy: 'RollingUpdate',
    images: ['node:16-alpine'],
    labels: { app: 'test' },
    annotations: {},
    createAt: '2024-03-15 11:00:00',
    updateAt: '2024-03-20 16:00:00',
    deletable: true
  }
]

// ==================== StatefulSet 数据 ====================
const mockStatefulSets: StatefulSetResp[] = [
  {
    id: generateId(),
    name: 'mysql-primary',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    replicas: 1,
    readyReplicas: 1,
    serviceName: 'mysql',
    selector: { app: 'mysql' },
    labels: { app: 'mysql' },
    createAt: '2024-02-10 14:00:00'
  },
  {
    id: generateId(),
    name: 'redis-cluster',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    replicas: 3,
    readyReplicas: 3,
    serviceName: 'redis',
    selector: { app: 'redis' },
    labels: { app: 'redis' },
    createAt: '2024-02-12 10:00:00'
  },
  {
    id: generateId(),
    name: 'kafka-broker',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    replicas: 3,
    readyReplicas: 2,
    serviceName: 'kafka',
    selector: { app: 'kafka' },
    labels: { app: 'kafka' },
    createAt: '2024-02-15 16:00:00'
  }
]

// ==================== DaemonSet 数据 ====================
const mockDaemonSets: DaemonSetResp[] = [
  {
    id: generateId(),
    name: 'fluentd-agent',
    namespace: 'kube-system',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    desiredNumberScheduled: 3,
    numberReady: 3,
    numberAvailable: 3,
    selector: { app: 'fluentd' },
    labels: { app: 'fluentd' },
    createAt: '2024-01-20 09:00:00'
  },
  {
    id: generateId(),
    name: 'node-exporter',
    namespace: 'monitoring',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    desiredNumberScheduled: 3,
    numberReady: 3,
    numberAvailable: 3,
    selector: { app: 'node-exporter' },
    labels: { app: 'node-exporter' },
    createAt: '2024-02-10 10:00:00'
  },
  {
    id: generateId(),
    name: 'calico-node',
    namespace: 'kube-system',
    clusterId: 'cls-002-staging',
    clusterName: 'staging-cluster',
    desiredNumberScheduled: 2,
    numberReady: 1,
    numberAvailable: 1,
    selector: { app: 'calico' },
    labels: { app: 'calico' },
    createAt: '2024-02-15 08:00:00'
  }
]

// ==================== Job 数据 ====================
const mockJobs: JobResp[] = [
  {
    id: generateId(),
    name: 'data-migration-20240320',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    parallelism: 1,
    completions: 1,
    active: 0,
    succeeded: 1,
    failed: 0,
    startTime: '2024-03-20 02:00:00',
    completionTime: '2024-03-20 02:15:30',
    labels: { job: 'data-migration' },
    createAt: '2024-03-20 02:00:00'
  },
  {
    id: generateId(),
    name: 'backup-daily',
    namespace: 'kube-system',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    parallelism: 1,
    completions: 1,
    active: 0,
    succeeded: 1,
    failed: 0,
    startTime: '2024-03-21 01:00:00',
    completionTime: '2024-03-21 01:30:00',
    labels: { job: 'backup' },
    createAt: '2024-03-21 01:00:00'
  },
  {
    id: generateId(),
    name: 'batch-processing',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    parallelism: 4,
    completions: 10,
    active: 2,
    succeeded: 6,
    failed: 2,
    startTime: '2024-03-21 10:00:00',
    labels: { job: 'batch' },
    createAt: '2024-03-21 10:00:00'
  }
]

// ==================== CronJob 数据 ====================
const mockCronJobs: CronJobResp[] = [
  {
    id: generateId(),
    name: 'db-backup',
    namespace: 'kube-system',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    schedule: '0 2 * * *',
    suspend: false,
    active: 0,
    lastScheduleTime: '2024-03-21 02:00:00',
    labels: { cronjob: 'backup' },
    createAt: '2024-02-01 10:00:00'
  },
  {
    id: generateId(),
    name: 'log-cleanup',
    namespace: 'kube-system',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    schedule: '0 3 * * 0',
    suspend: false,
    active: 0,
    lastScheduleTime: '2024-03-17 03:00:00',
    labels: { cronjob: 'cleanup' },
    createAt: '2024-02-05 14:00:00'
  },
  {
    id: generateId(),
    name: 'report-generator',
    namespace: 'app-backend',
    clusterId: 'cls-001-prod',
    clusterName: 'prod-cluster',
    schedule: '0 9 * * 1-5',
    suspend: true,
    active: 0,
    labels: { cronjob: 'report' },
    createAt: '2024-02-10 09:00:00'
  }
]

// ==================== Deployment CRUD ====================
function getDeploymentPage(params: any) {
  const { id, name, namespace, clusterId, page = 1, pageSize = 10 } = params || {}
  let filtered = [...mockDeployments]
  if (id) filtered = filtered.filter(d => d.id.includes(id))
  if (name) filtered = filtered.filter(d => d.name.toLowerCase().includes(name.toLowerCase()))
  if (namespace) filtered = filtered.filter(d => d.namespace === namespace)
  if (clusterId) filtered = filtered.filter(d => d.clusterId === clusterId)
  const total = filtered.length
  const start = (page - 1) * pageSize
  return { list: filtered.slice(start, start + pageSize), total }
}

function getDeploymentDetail(clusterId: string, namespace: string, name: string) {
  return mockDeployments.find(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name) || null
}

function createDeployment(data: any) {
  const newDeploy: DeploymentResp = {
    id: generateId(),
    name: data.name || '',
    namespace: data.namespace || '',
    clusterId: data.clusterId || '',
    status: 'Running',
    replicas: data.replicas || 1,
    readyReplicas: 0,
    availableReplicas: 0,
    strategy: data.strategy || 'RollingUpdate',
    images: data.images || [],
    labels: data.labels || {},
    annotations: data.annotations || {},
    createAt: new Date().toLocaleString(),
    updateAt: new Date().toLocaleString(),
    deletable: true
  }
  mockDeployments.push(newDeploy)
  return newDeploy
}

function updateDeployment(clusterId: string, namespace: string, name: string, data: any) {
  const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) return null
  mockDeployments[index] = { ...mockDeployments[index], ...data, updateAt: new Date().toLocaleString() }
  return mockDeployments[index]
}

function deleteDeployment(clusterId: string, namespace: string, name: string) {
  const index = mockDeployments.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) return false
  mockDeployments.splice(index, 1)
  return true
}

function batchDeleteDeployment(data: any) {
  const { clusterId, namespace, names } = data
  names.forEach((name: string) => deleteDeployment(clusterId, namespace, name))
  return true
}

// ==================== StatefulSet CRUD ====================
function getStatefulSetPage(params: any) {
  const { id, name, namespace, clusterId, page = 1, pageSize = 10 } = params || {}
  let filtered = [...mockStatefulSets]
  if (id) filtered = filtered.filter(s => s.id.includes(id))
  if (name) filtered = filtered.filter(s => s.name.toLowerCase().includes(name.toLowerCase()))
  if (namespace) filtered = filtered.filter(s => s.namespace === namespace)
  if (clusterId) filtered = filtered.filter(s => s.clusterId === clusterId)
  const total = filtered.length
  const start = (page - 1) * pageSize
  return { list: filtered.slice(start, start + pageSize), total }
}

function getStatefulSetDetail(clusterId: string, namespace: string, name: string) {
  return mockStatefulSets.find(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name) || null
}

function createStatefulSet(data: any) {
  const newSts: StatefulSetResp = {
    id: generateId(),
    name: data.name || '',
    namespace: data.namespace || '',
    clusterId: data.clusterId || '',
    replicas: data.replicas || 1,
    readyReplicas: 0,
    serviceName: data.serviceName || '',
    selector: data.selector || {},
    labels: data.labels || {},
    createAt: new Date().toLocaleString()
  }
  mockStatefulSets.push(newSts)
  return newSts
}

function updateStatefulSet(clusterId: string, namespace: string, name: string, data: any) {
  const index = mockStatefulSets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return null
  mockStatefulSets[index] = { ...mockStatefulSets[index], ...data }
  return mockStatefulSets[index]
}

function deleteStatefulSet(clusterId: string, namespace: string, name: string) {
  const index = mockStatefulSets.findIndex(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (index === -1) return false
  mockStatefulSets.splice(index, 1)
  return true
}

function batchDeleteStatefulSet(data: any) {
  const { clusterId, namespace, names } = data
  names.forEach((name: string) => deleteStatefulSet(clusterId, namespace, name))
  return true
}

// ==================== DaemonSet CRUD ====================
function getDaemonSetPage(params: any) {
  const { id, name, namespace, clusterId, page = 1, pageSize = 10 } = params || {}
  let filtered = [...mockDaemonSets]
  if (id) filtered = filtered.filter(d => d.id.includes(id))
  if (name) filtered = filtered.filter(d => d.name.toLowerCase().includes(name.toLowerCase()))
  if (namespace) filtered = filtered.filter(d => d.namespace === namespace)
  if (clusterId) filtered = filtered.filter(d => d.clusterId === clusterId)
  const total = filtered.length
  const start = (page - 1) * pageSize
  return { list: filtered.slice(start, start + pageSize), total }
}

function getDaemonSetDetail(clusterId: string, namespace: string, name: string) {
  return mockDaemonSets.find(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name) || null
}

function createDaemonSet(data: any) {
  const newDs: DaemonSetResp = {
    id: generateId(),
    name: data.name || '',
    namespace: data.namespace || '',
    clusterId: data.clusterId || '',
    desiredNumberScheduled: 0,
    numberReady: 0,
    numberAvailable: 0,
    selector: data.selector || {},
    labels: data.labels || {},
    createAt: new Date().toLocaleString()
  }
  mockDaemonSets.push(newDs)
  return newDs
}

function updateDaemonSet(clusterId: string, namespace: string, name: string, data: any) {
  const index = mockDaemonSets.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) return null
  mockDaemonSets[index] = { ...mockDaemonSets[index], ...data }
  return mockDaemonSets[index]
}

function deleteDaemonSet(clusterId: string, namespace: string, name: string) {
  const index = mockDaemonSets.findIndex(d => d.clusterId === clusterId && d.namespace === namespace && d.name === name)
  if (index === -1) return false
  mockDaemonSets.splice(index, 1)
  return true
}

function batchDeleteDaemonSet(data: any) {
  const { clusterId, namespace, names } = data
  names.forEach((name: string) => deleteDaemonSet(clusterId, namespace, name))
  return true
}

// ==================== Job CRUD ====================
function getJobPage(params: any) {
  const { id, name, namespace, clusterId, page = 1, pageSize = 10 } = params || {}
  let filtered = [...mockJobs]
  if (id) filtered = filtered.filter(j => j.id.includes(id))
  if (name) filtered = filtered.filter(j => j.name.toLowerCase().includes(name.toLowerCase()))
  if (namespace) filtered = filtered.filter(j => j.namespace === namespace)
  if (clusterId) filtered = filtered.filter(j => j.clusterId === clusterId)
  const total = filtered.length
  const start = (page - 1) * pageSize
  return { list: filtered.slice(start, start + pageSize), total }
}

function getJobDetail(clusterId: string, namespace: string, name: string) {
  return mockJobs.find(j => j.clusterId === clusterId && j.namespace === namespace && j.name === name) || null
}

function createJob(data: any) {
  const newJob: JobResp = {
    id: generateId(),
    name: data.name || '',
    namespace: data.namespace || '',
    clusterId: data.clusterId || '',
    parallelism: data.parallelism || 1,
    completions: data.completions || 1,
    active: 0,
    succeeded: 0,
    failed: 0,
    startTime: new Date().toLocaleString(),
    labels: data.labels || {},
    createAt: new Date().toLocaleString()
  }
  mockJobs.push(newJob)
  return newJob
}

function updateJob(clusterId: string, namespace: string, name: string, data: any) {
  const index = mockJobs.findIndex(j => j.clusterId === clusterId && j.namespace === namespace && j.name === name)
  if (index === -1) return null
  mockJobs[index] = { ...mockJobs[index], ...data }
  return mockJobs[index]
}

function deleteJob(clusterId: string, namespace: string, name: string) {
  const index = mockJobs.findIndex(j => j.clusterId === clusterId && j.namespace === namespace && j.name === name)
  if (index === -1) return false
  mockJobs.splice(index, 1)
  return true
}

function batchDeleteJob(data: any) {
  const { clusterId, namespace, names } = data
  names.forEach((name: string) => deleteJob(clusterId, namespace, name))
  return true
}

// ==================== CronJob CRUD ====================
function getCronJobPage(params: any) {
  const { id, name, namespace, clusterId, page = 1, pageSize = 10 } = params || {}
  let filtered = [...mockCronJobs]
  if (id) filtered = filtered.filter(c => c.id.includes(id))
  if (name) filtered = filtered.filter(c => c.name.toLowerCase().includes(name.toLowerCase()))
  if (namespace) filtered = filtered.filter(c => c.namespace === namespace)
  if (clusterId) filtered = filtered.filter(c => c.clusterId === clusterId)
  const total = filtered.length
  const start = (page - 1) * pageSize
  return { list: filtered.slice(start, start + pageSize), total }
}

function getCronJobDetail(clusterId: string, namespace: string, name: string) {
  return mockCronJobs.find(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name) || null
}

function createCronJob(data: any) {
  const newCj: CronJobResp = {
    id: generateId(),
    name: data.name || '',
    namespace: data.namespace || '',
    clusterId: data.clusterId || '',
    schedule: data.schedule || '0 0 * * *',
    suspend: data.suspend || false,
    active: 0,
    labels: data.labels || {},
    createAt: new Date().toLocaleString()
  }
  mockCronJobs.push(newCj)
  return newCj
}

function updateCronJob(clusterId: string, namespace: string, name: string, data: any) {
  const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return null
  mockCronJobs[index] = { ...mockCronJobs[index], ...data }
  return mockCronJobs[index]
}

function deleteCronJob(clusterId: string, namespace: string, name: string) {
  const index = mockCronJobs.findIndex(c => c.clusterId === clusterId && c.namespace === namespace && c.name === name)
  if (index === -1) return false
  mockCronJobs.splice(index, 1)
  return true
}

function batchDeleteCronJob(data: any) {
  const { clusterId, namespace, names } = data
  names.forEach((name: string) => deleteCronJob(clusterId, namespace, name))
  return true
}

export default [
  // Deployment
  { method: 'get', url: '/kubernetes/workload/deployment/page', handler: (params: any) => getDeploymentPage(params) },
  { method: 'get', url: '/kubernetes/workload/deployment/:clusterId/:namespace/:name', handler: ({ clusterId, namespace, name }: any) => getDeploymentDetail(clusterId, namespace, name) },
  { method: 'post', url: '/kubernetes/workload/deployment', handler: (data: any) => createDeployment(data) },
  { method: 'put', url: '/kubernetes/workload/deployment/:clusterId/:namespace/:name', handler: ({ clusterId, namespace, name, ...data }: any) => updateDeployment(clusterId, namespace, name, data) },
  { method: 'delete', url: '/kubernetes/workload/deployment/:clusterId/:namespace/:name', handler: ({ clusterId, namespace, name }: any) => deleteDeployment(clusterId, namespace, name) },
  { method: 'delete', url: '/kubernetes/workload/deployment/batch', handler: (data: any) => batchDeleteDeployment(data) },
  // StatefulSet
  { method: 'get', url: '/kubernetes/workload/statefulset/page', handler: (params: any) => getStatefulSetPage(params) },
  { method: 'get', url: '/kubernetes/workload/statefulset/:clusterId/:namespace/:name', handler: ({ clusterId, namespace, name }: any) => getStatefulSetDetail(clusterId, namespace, name) },
  { method: 'post', url: '/kubernetes/workload/statefulset', handler: (data: any) => createStatefulSet(data) },
  {
    method: 'put',
    url: '/kubernetes/workload/statefulset/:clusterId/:namespace/:name',
    handler: ({ clusterId, namespace, name, ...data }: any) => updateStatefulSet(clusterId, namespace, name, data)
  },
  { method: 'delete', url: '/kubernetes/workload/statefulset/:clusterId/:namespace/:name', handler: ({ clusterId, namespace, name }: any) => deleteStatefulSet(clusterId, namespace, name) },
  { method: 'delete', url: '/kubernetes/workload/statefulset/batch', handler: (data: any) => batchDeleteStatefulSet(data) },
  // DaemonSet
  { method: 'get', url: '/kubernetes/workload/daemonset/page', handler: (params: any) => getDaemonSetPage(params) },
  { method: 'get', url: '/kubernetes/workload/daemonset/:clusterId/:namespace/:name', handler: ({ clusterId, namespace, name }: any) => getDaemonSetDetail(clusterId, namespace, name) },
  { method: 'post', url: '/kubernetes/workload/daemonset', handler: (data: any) => createDaemonSet(data) },
  { method: 'put', url: '/kubernetes/workload/daemonset/:clusterId/:namespace/:name', handler: ({ clusterId, namespace, name, ...data }: any) => updateDaemonSet(clusterId, namespace, name, data) },
  { method: 'delete', url: '/kubernetes/workload/daemonset/:clusterId/:namespace/:name', handler: ({ clusterId, namespace, name }: any) => deleteDaemonSet(clusterId, namespace, name) },
  { method: 'delete', url: '/kubernetes/workload/daemonset/batch', handler: (data: any) => batchDeleteDaemonSet(data) },
  // Job
  { method: 'get', url: '/kubernetes/workload/job/page', handler: (params: any) => getJobPage(params) },
  { method: 'get', url: '/kubernetes/workload/job/:clusterId/:namespace/:name', handler: ({ clusterId, namespace, name }: any) => getJobDetail(clusterId, namespace, name) },
  { method: 'post', url: '/kubernetes/workload/job', handler: (data: any) => createJob(data) },
  { method: 'put', url: '/kubernetes/workload/job/:clusterId/:namespace/:name', handler: ({ clusterId, namespace, name, ...data }: any) => updateJob(clusterId, namespace, name, data) },
  { method: 'delete', url: '/kubernetes/workload/job/:clusterId/:namespace/:name', handler: ({ clusterId, namespace, name }: any) => deleteJob(clusterId, namespace, name) },
  { method: 'delete', url: '/kubernetes/workload/job/batch', handler: (data: any) => batchDeleteJob(data) },
  // CronJob
  { method: 'get', url: '/kubernetes/workload/cronjob/page', handler: (params: any) => getCronJobPage(params) },
  { method: 'get', url: '/kubernetes/workload/cronjob/:clusterId/:namespace/:name', handler: ({ clusterId, namespace, name }: any) => getCronJobDetail(clusterId, namespace, name) },
  { method: 'post', url: '/kubernetes/workload/cronjob', handler: (data: any) => createCronJob(data) },
  { method: 'put', url: '/kubernetes/workload/cronjob/:clusterId/:namespace/:name', handler: ({ clusterId, namespace, name, ...data }: any) => updateCronJob(clusterId, namespace, name, data) },
  { method: 'delete', url: '/kubernetes/workload/cronjob/:clusterId/:namespace/:name', handler: ({ clusterId, namespace, name }: any) => deleteCronJob(clusterId, namespace, name) },
  { method: 'delete', url: '/kubernetes/workload/cronjob/batch', handler: (data: any) => batchDeleteCronJob(data) }
]
