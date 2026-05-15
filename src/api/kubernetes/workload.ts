import request from '@/utils/request'
import type {
  DeploymentQueryReq,
  DeploymentPageResp,
  DeploymentResp,
  StatefulSetQueryReq,
  StatefulSetPageResp,
  StatefulSetResp,
  DaemonSetQueryReq,
  DaemonSetPageResp,
  DaemonSetResp,
  JobQueryReq,
  JobPageResp,
  JobResp,
  CronJobQueryReq,
  CronJobPageResp,
  CronJobResp
} from '@/types'

// ==================== Deployment ====================
export function getDeploymentPage(params: DeploymentQueryReq) {
  return request.get<DeploymentPageResp>('/kubernetes/workload/deployment/page', { params })
}

export function getDeploymentDetail(clusterId: string, namespace: string, name: string) {
  return request.get<DeploymentResp>(`/kubernetes/workload/deployment/${clusterId}/${namespace}/${name}`)
}

export function createDeployment(data: Partial<DeploymentResp>) {
  return request.post<DeploymentResp>('/kubernetes/workload/deployment', data)
}

export function updateDeployment(clusterId: string, namespace: string, name: string, data: Partial<DeploymentResp>) {
  return request.put<DeploymentResp>(`/kubernetes/workload/deployment/${clusterId}/${namespace}/${name}`, data)
}

export function deleteDeployment(clusterId: string, namespace: string, name: string) {
  return request.delete(`/kubernetes/workload/deployment/${clusterId}/${namespace}/${name}`)
}

export function batchDeleteDeployment(clusterId: string, namespace: string, names: string[]) {
  return request.delete('/kubernetes/workload/deployment/batch', { data: { clusterId, namespace, names } })
}

// ==================== StatefulSet ====================
export function getStatefulSetPage(params: StatefulSetQueryReq) {
  return request.get<StatefulSetPageResp>('/kubernetes/workload/statefulset/page', { params })
}

export function getStatefulSetDetail(clusterId: string, namespace: string, name: string) {
  return request.get<StatefulSetResp>(`/kubernetes/workload/statefulset/${clusterId}/${namespace}/${name}`)
}

export function createStatefulSet(data: Partial<StatefulSetResp>) {
  return request.post<StatefulSetResp>('/kubernetes/workload/statefulset', data)
}

export function updateStatefulSet(clusterId: string, namespace: string, name: string, data: Partial<StatefulSetResp>) {
  return request.put<StatefulSetResp>(`/kubernetes/workload/statefulset/${clusterId}/${namespace}/${name}`, data)
}

export function deleteStatefulSet(clusterId: string, namespace: string, name: string) {
  return request.delete(`/kubernetes/workload/statefulset/${clusterId}/${namespace}/${name}`)
}

export function batchDeleteStatefulSet(clusterId: string, namespace: string, names: string[]) {
  return request.delete('/kubernetes/workload/statefulset/batch', { data: { clusterId, namespace, names } })
}

// ==================== DaemonSet ====================
export function getDaemonSetPage(params: DaemonSetQueryReq) {
  return request.get<DaemonSetPageResp>('/kubernetes/workload/daemonset/page', { params })
}

export function getDaemonSetDetail(clusterId: string, namespace: string, name: string) {
  return request.get<DaemonSetResp>(`/kubernetes/workload/daemonset/${clusterId}/${namespace}/${name}`)
}

export function createDaemonSet(data: Partial<DaemonSetResp>) {
  return request.post<DaemonSetResp>('/kubernetes/workload/daemonset', data)
}

export function updateDaemonSet(clusterId: string, namespace: string, name: string, data: Partial<DaemonSetResp>) {
  return request.put<DaemonSetResp>(`/kubernetes/workload/daemonset/${clusterId}/${namespace}/${name}`, data)
}

export function deleteDaemonSet(clusterId: string, namespace: string, name: string) {
  return request.delete(`/kubernetes/workload/daemonset/${clusterId}/${namespace}/${name}`)
}

export function batchDeleteDaemonSet(clusterId: string, namespace: string, names: string[]) {
  return request.delete('/kubernetes/workload/daemonset/batch', { data: { clusterId, namespace, names } })
}

// ==================== Job ====================
export function getJobPage(params: JobQueryReq) {
  return request.get<JobPageResp>('/kubernetes/workload/job/page', { params })
}

export function getJobDetail(clusterId: string, namespace: string, name: string) {
  return request.get<JobResp>(`/kubernetes/workload/job/${clusterId}/${namespace}/${name}`)
}

export function createJob(data: Partial<JobResp>) {
  return request.post<JobResp>('/kubernetes/workload/job', data)
}

export function updateJob(clusterId: string, namespace: string, name: string, data: Partial<JobResp>) {
  return request.put<JobResp>(`/kubernetes/workload/job/${clusterId}/${namespace}/${name}`, data)
}

export function deleteJob(clusterId: string, namespace: string, name: string) {
  return request.delete(`/kubernetes/workload/job/${clusterId}/${namespace}/${name}`)
}

export function batchDeleteJob(clusterId: string, namespace: string, names: string[]) {
  return request.delete('/kubernetes/workload/job/batch', { data: { clusterId, namespace, names } })
}

// ==================== CronJob ====================
export function getCronJobPage(params: CronJobQueryReq) {
  return request.get<CronJobPageResp>('/kubernetes/workload/cronjob/page', { params })
}

export function getCronJobDetail(clusterId: string, namespace: string, name: string) {
  return request.get<CronJobResp>(`/kubernetes/workload/cronjob/${clusterId}/${namespace}/${name}`)
}

export function createCronJob(data: Partial<CronJobResp>) {
  return request.post<CronJobResp>('/kubernetes/workload/cronjob', data)
}

export function updateCronJob(clusterId: string, namespace: string, name: string, data: Partial<CronJobResp>) {
  return request.put<CronJobResp>(`/kubernetes/workload/cronjob/${clusterId}/${namespace}/${name}`, data)
}

export function deleteCronJob(clusterId: string, namespace: string, name: string) {
  return request.delete(`/kubernetes/workload/cronjob/${clusterId}/${namespace}/${name}`)
}

export function batchDeleteCronJob(clusterId: string, namespace: string, names: string[]) {
  return request.delete('/kubernetes/workload/cronjob/batch', { data: { clusterId, namespace, names } })
}
