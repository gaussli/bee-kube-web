/**
 * Deployment 管理 Mock
 * @module mock/kubernetes/workload/deployment
 */
import type { PageVo } from '@/types/common'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes/common'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type {
  DeploymentCreateForm,
  DeploymentDetailVo,
  DeploymentHistoryRevisionListVo,
  DeploymentHistoryRevisionQueryForm,
  DeploymentListVo,
  DeploymentMonitorVo,
  DeploymentNetworkVo,
  DeploymentPodListVo,
  DeploymentPodQueryForm,
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
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @returns Deployment 详情响应对象
 */
function getDeploymentDetailMock(_clusterUid: string, _namespace: string, _name: string): DeploymentDetailVo {
  console.log('[Mock] getDeploymentDetail', _clusterUid, _namespace, _name)
  return mockDeploymentDetail
}

/**
 * 查看 Deployment YAML
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @returns Deployment YAML 响应对象（完整 YAML 文本）
 */
function getDeploymentYamlMock(_clusterUid: string, _namespace: string, _name: string): DeploymentYamlVo {
  console.log('[Mock] getDeploymentYaml', _clusterUid, _namespace, _name)
  return mockDeploymentYaml
}

/**
 * 查看 Deployment 关联 Pod 列表
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @param query Deployment 关联 Pod 查询条件请求对象（Pod 名称、Pod 状态、UID）
 * @returns Deployment 关联 Pod 分页列表
 */
function getDeploymentPodListMock(
  _clusterUid: string,
  _namespace: string,
  _name: string,
  query: Partial<DeploymentPodQueryForm>,
): PageVo<DeploymentPodListVo> {
  console.log('[Mock] getDeploymentPodList', _clusterUid, _namespace, _name, query)
  const filtered = mockDeploymentPods.filter((p: DeploymentPodListVo) => {
    if (query.status && p.status !== query.status) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(p => p.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(p => p.name.includes(query.name as string)) : []
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
 * 查看 Deployment 历史版本列表
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @param query Deployment 历史版本查询条件请求对象（版本名称、变更原因）
 * @returns Deployment 历史版本分页列表
 */
function getDeploymentHistoryRevisionListMock(
  _clusterUid: string,
  _namespace: string,
  _name: string,
  query: Partial<DeploymentHistoryRevisionQueryForm>,
): PageVo<DeploymentHistoryRevisionListVo> {
  console.log('[Mock] getDeploymentHistoryRevisionList', _clusterUid, _namespace, _name, query)
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
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @returns Deployment 关联网络资源响应对象（关联的 Service 与 Ingress 列表）
 */
function getDeploymentNetworkMock(_clusterUid: string, _namespace: string, _name: string): DeploymentNetworkVo {
  console.log('[Mock] getDeploymentNetwork', _clusterUid, _namespace, _name)
  return {
    services: mockDeploymentServices,
    ingresses: mockDeploymentIngresses,
  }
}

/**
 * 查看 Deployment 事件列表
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @param query 事件查询条件请求对象（事件类型、事件原因、事件描述、事件关联对象）
 * @returns Deployment 关联事件分页列表
 */
function getDeploymentEventListMock(
  _clusterUid: string,
  _namespace: string,
  _name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getDeploymentEventList', _clusterUid, _namespace, _name, query)
  const page = query.page || 1
  const pageSize = query.pageSize || 10
  return {
    list: mockDeploymentEvents.slice((page - 1) * pageSize, page * pageSize),
    total: mockDeploymentEvents.length,
    page,
    pageSize,
  }
}

/**
 * 查看 Deployment 监控数据
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @returns Deployment 监控响应对象
 */
function getDeploymentMonitorMock(_clusterUid: string, _namespace: string, _name: string): DeploymentMonitorVo {
  console.log('[Mock] getDeploymentMonitor', _clusterUid, _namespace, _name)
  return {}
}

/**
 * 创建 Deployment
 * @param _clusterUid 集群 UID
 * @param data Deployment 创建请求对象（description / metadata / spec）
 * @returns void
 */
function createDeploymentMock(_clusterUid: string, data: Partial<DeploymentCreateForm>): void {
  console.log('[Mock] createDeployment', _clusterUid, data)
}

/**
 * YAML 创建 Deployment
 * @param _clusterUid 集群 UID
 * @param yaml Deployment YAML 字符串
 * @returns void
 */
function createDeploymentYamlMock(_clusterUid: string, yaml: string): void {
  console.log('[Mock] createDeploymentYaml', _clusterUid, yaml)
}

/**
 * 更新 Deployment
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @param data Deployment 更新请求对象（description / metadata / spec）
 * @returns void
 */
function updateDeploymentMock(
  _clusterUid: string,
  _namespace: string,
  _name: string,
  data: Partial<DeploymentUpdateForm>,
): void {
  console.log('[Mock] updateDeployment', _clusterUid, _namespace, _name, data)
}

/**
 * YAML 更新 Deployment
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @param yaml Deployment YAML 字符串
 * @returns void
 */
function updateDeploymentYamlMock(_clusterUid: string, _namespace: string, _name: string, yaml: string): void {
  console.log('[Mock] updateDeploymentYaml', _clusterUid, _namespace, _name, yaml)
}

/**
 * 管理 Deployment 标签
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @param _data 管理标签请求对象（labels 键值对、operation 操作类型）
 * @returns void
 */
function manageDeploymentLabelMock(
  _clusterUid: string,
  _namespace: string,
  _name: string,
  _data: MetadataLabelForm,
): void {
  console.log('[Mock] manageDeploymentLabel', _clusterUid, _namespace, _name, _data)
}

/**
 * 管理 Deployment 注解
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @param _data 管理注解请求对象（annotations 键值对、operation 操作类型）
 * @returns void
 */
function manageDeploymentAnnotationMock(
  _clusterUid: string,
  _namespace: string,
  _name: string,
  _data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageDeploymentAnnotation', _clusterUid, _namespace, _name, _data)
}

/**
 * 删除 Deployment
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @returns void
 */
function deleteDeploymentMock(_clusterUid: string, _namespace: string, _name: string): void {
  console.log('[Mock] deleteDeployment', _clusterUid, _namespace, _name)
}

/**
 * 批量删除 Deployment
 * @param _clusterUid 集群 UID
 * @param uids Deployment UID 列表
 * @returns void
 */
function deleteDeploymentsMock(_clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteDeployments', _clusterUid, uids)
}

/**
 * 导入 Deployment
 * @param _clusterUid 集群 UID
 * @param _formData 上传的文件
 * @returns void
 */
function importDeploymentMock(_clusterUid: string, _formData: FormData): void {
  console.log('[Mock] importDeployment', _clusterUid)
}

/**
 * 导出 Deployment
 * @param _clusterUid 集群 UID
 * @param query Deployment 查询条件请求对象（名称、命名空间、状态、UID）
 * @returns void
 */
function exportDeploymentMock(_clusterUid: string, query: Partial<DeploymentQueryForm>): void {
  console.log('[Mock] exportDeployment', _clusterUid, query)
}

/**
 * 扩缩容 Deployment
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @param data Deployment 扩缩容请求对象（期望副本数）
 * @returns void
 */
function scaleDeploymentMock(_clusterUid: string, _namespace: string, _name: string, data: DeploymentScaleForm): void {
  console.log('[Mock] scaleDeployment', _clusterUid, _namespace, _name, data)
}

/**
 * 重启 Deployment
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @returns void
 */
function restartDeploymentMock(_clusterUid: string, _namespace: string, _name: string): void {
  console.log('[Mock] restartDeployment', _clusterUid, _namespace, _name)
}

/**
 * 回滚 Deployment
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @param data Deployment 回滚请求对象（目标历史版本号）
 * @returns void
 */
function rollbackDeploymentMock(
  _clusterUid: string,
  _namespace: string,
  _name: string,
  data: DeploymentRollbackForm,
): void {
  console.log('[Mock] rollbackDeployment', _clusterUid, _namespace, _name, data)
}

/**
 * 暂停 Deployment 更新
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @returns void
 */
function pauseDeploymentMock(_clusterUid: string, _namespace: string, _name: string): void {
  console.log('[Mock] pauseDeployment', _clusterUid, _namespace, _name)
}

/**
 * 恢复 Deployment 更新
 * @param _clusterUid 集群 UID
 * @param _namespace 命名空间名称
 * @param _name Deployment 名称
 * @returns void
 */
function resumeDeploymentMock(_clusterUid: string, _namespace: string, _name: string): void {
  console.log('[Mock] resumeDeployment', _clusterUid, _namespace, _name)
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
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<DeploymentPodQueryForm> }) =>
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
