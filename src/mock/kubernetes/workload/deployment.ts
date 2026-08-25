/**
 * Deployment 管理 Mock
 * @module mock/kubernetes/workload/deployment
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type { PodListVo, PodQueryForm } from '@/types/kubernetes/pod'
import type {
  DeploymentCreateForm,
  DeploymentDetailVo,
  DeploymentHistoryRevisionListVo,
  DeploymentHistoryRevisionQueryForm,
  DeploymentListVo,
  DeploymentMonitorVo,
  DeploymentNetworkVo,
  DeploymentQueryForm,
  DeploymentRollbackForm,
  DeploymentScaleForm,
  DeploymentUpdateForm,
  DeploymentYamlVo,
} from '@/types/kubernetes/workload/deployment'

import {
  mockDeploymentDetail,
  mockDeploymentEvents,
  mockDeploymentHistoryRevisions,
  mockDeploymentIngresses,
  mockDeploymentPods,
  mockDeploymentServices,
  mockDeploymentYaml,
  mockDeployments,
} from './deploymentData'

/**
 * 查看 Deployment 列表
 * @param clusterUid 集群 UID
 * @param query Deployment 查询条件请求对象（名称、命名空间、状态、UID）
 * @returns Deployment 分页列表
 */
function getDeploymentListMock(clusterUid: string, query: Partial<DeploymentQueryForm>): PageVo<DeploymentListVo> {
  console.log('[Mock] getDeploymentList', clusterUid, query)
  const filtered = mockDeployments.filter((d: DeploymentListVo) => {
    if (query.namespace && d.namespace !== query.namespace) return false
    if (query.status && d.status !== query.status) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(d => d.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(d => d.name.includes(query.name as string)) : []
  const matched = query.uid || query.name ? Array.from(new Set([...filteredUid, ...filteredName])) : filtered
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  return {
    list: matched.slice((page - 1) * pageSize, page * pageSize),
    total: matched.length,
    page,
    pageSize,
  }
}

/**
 * 查看 Deployment 详情
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @returns Deployment 详情响应对象
 */
function getDeploymentDetailMock(clusterUid: string, namespace: string, name: string): DeploymentDetailVo {
  console.log('[Mock] getDeploymentDetail', clusterUid, namespace, name)
  return mockDeploymentDetail
}

/**
 * 查看 Deployment YAML
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @returns Deployment YAML 响应对象（完整 YAML 文本）
 */
function getDeploymentYamlMock(clusterUid: string, namespace: string, name: string): DeploymentYamlVo {
  console.log('[Mock] getDeploymentYaml', clusterUid, namespace, name)
  return mockDeploymentYaml
}

/**
 * 查看 Deployment 关联 Pod 列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param query Deployment 关联 Pod 查询条件请求对象（Pod 名称、Pod 状态、UID）
 * @returns Deployment 关联 Pod 分页列表
 */
function getDeploymentPodListMock(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<PodQueryForm>,
): PageVo<PodListVo> {
  console.log('[Mock] getDeploymentPodList', clusterUid, namespace, name, query)
  const filtered = mockDeploymentPods.filter((p: PodListVo) => {
    if (query.status && p.status !== query.status) return false
    if (query.namespace && p.namespace !== query.namespace) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(p => p.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(p => p.name.includes(query.name as string)) : []
  const filterIp = query.ip ? filtered.filter(p => p.ip.includes(query.ip as string)) : []
  const matched =
    query.uid || query.name ? Array.from(new Set([...filteredUid, ...filteredName, ...filterIp])) : filtered
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  return {
    list: matched.slice((page - 1) * pageSize, page * pageSize),
    total: matched.length,
    page,
    pageSize,
  }
}

/**
 * 查看 Deployment 历史版本列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param query Deployment 历史版本查询条件请求对象（版本名称、变更原因）
 * @returns Deployment 历史版本分页列表
 */
function getDeploymentHistoryRevisionListMock(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<DeploymentHistoryRevisionQueryForm>,
): PageVo<DeploymentHistoryRevisionListVo> {
  console.log('[Mock] getDeploymentHistoryRevisionList', clusterUid, namespace, name, query)
  const filtered = mockDeploymentHistoryRevisions.filter((r: DeploymentHistoryRevisionListVo) => {
    if (query.revision && r.revision !== query.revision) return false
    if (query.changeCause && !r.changeCause.includes(query.changeCause)) return false
    return true
  })
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  return {
    list: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    page,
    pageSize,
  }
}

/**
 * 查看 Deployment 关联网络资源
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @returns Deployment 关联网络资源响应对象（关联的 Service 与 Ingress 列表）
 */
function getDeploymentNetworkMock(clusterUid: string, namespace: string, name: string): DeploymentNetworkVo {
  console.log('[Mock] getDeploymentNetwork', clusterUid, namespace, name)
  return {
    services: mockDeploymentServices,
    ingresses: mockDeploymentIngresses,
  }
}

/**
 * 查看 Deployment 事件列表
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param query 事件查询条件请求对象（事件类型、事件原因、事件描述、事件关联对象）
 * @returns Deployment 关联事件分页列表
 */
function getDeploymentEventListMock(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getDeploymentEventList', clusterUid, namespace, name, query)
  const filtered = mockDeploymentEvents.filter((e: EventListVo) => {
    if (query.type && e.type !== query.type) return false
    return true
  })
  const filteredReason = query.reason ? filtered.filter(p => p.reason?.includes(query.reason as string)) : []
  const filteredNote = query.note ? filtered.filter(p => p.note?.includes(query.note as string)) : []
  const matched = query.reason || query.note ? Array.from(new Set([...filteredReason, ...filteredNote])) : filtered
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  return {
    list: matched.slice((page - 1) * pageSize, page * pageSize),
    total: matched.length,
    page,
    pageSize,
  }
}

/**
 * 查看 Deployment 监控数据
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @returns Deployment 监控响应对象
 */
function getDeploymentMonitorMock(clusterUid: string, namespace: string, name: string): DeploymentMonitorVo {
  console.log('[Mock] getDeploymentMonitor', clusterUid, namespace, name)
  return {}
}

/**
 * 创建 Deployment
 * @param clusterUid 集群 UID
 * @param data Deployment 创建请求对象（description / metadata / spec）
 * @returns void
 */
function createDeploymentMock(clusterUid: string, data: Partial<DeploymentCreateForm>): void {
  console.log('[Mock] createDeployment', clusterUid, data)
}

/**
 * YAML 创建 Deployment
 * @param clusterUid 集群 UID
 * @param yaml Deployment YAML 字符串
 * @returns void
 */
function createDeploymentYamlMock(clusterUid: string, yaml: string): void {
  console.log('[Mock] createDeploymentYaml', clusterUid, yaml)
}

/**
 * 更新 Deployment
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param data Deployment 更新请求对象（description / metadata / spec）
 * @returns void
 */
function updateDeploymentMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<DeploymentUpdateForm>,
): void {
  console.log('[Mock] updateDeployment', clusterUid, namespace, name, data)
}

/**
 * YAML 更新 Deployment
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param yaml Deployment YAML 字符串
 * @returns void
 */
function updateDeploymentYamlMock(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateDeploymentYaml', clusterUid, namespace, name, yaml)
}

/**
 * 管理 Deployment 标签
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param data 管理标签请求对象（labels 键值对、operation 操作类型）
 * @returns void
 */
function manageDeploymentLabelMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataLabelForm,
): void {
  console.log('[Mock] manageDeploymentLabel', clusterUid, namespace, name, data)
}

/**
 * 管理 Deployment 注解
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param data 管理注解请求对象（annotations 键值对、operation 操作类型）
 * @returns void
 */
function manageDeploymentAnnotationMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageDeploymentAnnotation', clusterUid, namespace, name, data)
}

/**
 * 删除 Deployment
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @returns void
 */
function deleteDeploymentMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteDeployment', clusterUid, namespace, name)
}

/**
 * 批量删除 Deployment
 * @param clusterUid 集群 UID
 * @param uids Deployment UID 列表
 * @returns void
 */
function deleteDeploymentsMock(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteDeployments', clusterUid, uids)
}

/**
 * 导入 Deployment
 * @param clusterUid 集群 UID
 * @param formData 上传的文件
 * @returns void
 */
function importDeploymentMock(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importDeployment', clusterUid)
}

/**
 * 导出 Deployment
 * @param clusterUid 集群 UID
 * @param query Deployment 查询条件请求对象（名称、命名空间、状态、UID）
 * @returns void
 */
function exportDeploymentMock(clusterUid: string, query: Partial<DeploymentQueryForm>): void {
  console.log('[Mock] exportDeployment', clusterUid, query)
}

/**
 * 扩缩容 Deployment
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param data Deployment 扩缩容请求对象（期望副本数）
 * @returns void
 */
function scaleDeploymentMock(clusterUid: string, namespace: string, name: string, data: DeploymentScaleForm): void {
  console.log('[Mock] scaleDeployment', clusterUid, namespace, name, data)
}

/**
 * 重启 Deployment
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @returns void
 */
function restartDeploymentMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] restartDeployment', clusterUid, namespace, name)
}

/**
 * 回滚 Deployment
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @param data Deployment 回滚请求对象（目标历史版本号）
 * @returns void
 */
function rollbackDeploymentMock(
  clusterUid: string,
  namespace: string,
  name: string,
  data: DeploymentRollbackForm,
): void {
  console.log('[Mock] rollbackDeployment', clusterUid, namespace, name, data)
}

/**
 * 暂停 Deployment 更新
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @returns void
 */
function pauseDeploymentMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] pauseDeployment', clusterUid, namespace, name)
}

/**
 * 恢复 Deployment 更新
 * @param clusterUid 集群 UID
 * @param namespace 命名空间名称
 * @param name Deployment 名称
 * @returns void
 */
function resumeDeploymentMock(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] resumeDeployment', clusterUid, namespace, name)
}

export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/deployments',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<DeploymentQueryForm> }) =>
      getDeploymentListMock(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getDeploymentDetailMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getDeploymentYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/pods',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PodQueryForm> }) =>
      getDeploymentPodListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/history',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<DeploymentHistoryRevisionQueryForm> }) =>
      getDeploymentHistoryRevisionListMock(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.params,
      ),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/network',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getDeploymentNetworkMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getDeploymentEventListMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/monitor',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getDeploymentMonitorMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/deployments',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<DeploymentCreateForm> }) =>
      createDeploymentMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/deployments/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createDeploymentYamlMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<DeploymentUpdateForm> }) =>
      updateDeploymentMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateDeploymentYamlMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageDeploymentLabelMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageDeploymentAnnotationMock(
        ctx.pathParams.clusterUid,
        ctx.pathParams.namespace,
        ctx.pathParams.name,
        ctx.data,
      ),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteDeploymentMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/deployments/batch',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteDeploymentsMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/deployments/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importDeploymentMock(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/deployments/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<DeploymentQueryForm> }) =>
      exportDeploymentMock(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/scale',
    handler: (ctx: { pathParams: Record<string, string>; data: DeploymentScaleForm }) =>
      scaleDeploymentMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/restart',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      restartDeploymentMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/rollback',
    handler: (ctx: { pathParams: Record<string, string>; data: DeploymentRollbackForm }) =>
      rollbackDeploymentMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/pause',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      pauseDeploymentMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/resume',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      resumeDeploymentMock(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
]
