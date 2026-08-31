import type { PageVo } from '@/types/index'
import type { MetadataAnnotationForm, MetadataLabelForm } from '@/types/kubernetes'
import type { EventListVo, EventQueryForm } from '@/types/kubernetes/event'
import type { PodListVo, PodQueryForm } from '@/types/kubernetes/pod'
import type {
  DeploymentCreateForm,
  DeploymentDetailVo,
  DeploymentExportQueryForm,
  DeploymentHistoryRevisionListVo,
  DeploymentHistoryRevisionQueryForm,
  DeploymentListVo,
  DeploymentMonitorQueryForm,
  DeploymentMonitorVo,
  DeploymentNetworkVo,
  DeploymentQueryForm,
  DeploymentRollbackForm,
  DeploymentScaleForm,
  DeploymentUpdateForm,
  DeploymentYamlVo,
} from '@/types/kubernetes/workload/deployment'

import { handleEventList } from '@/mock/utils'

import {
  mockDeploymentDetail,
  mockDeploymentEventList,
  mockDeploymentHistoryRevisionList,
  mockDeploymentList,
  mockDeploymentMonitor,
  mockDeploymentNetwork,
  mockDeploymentPodList,
  mockDeploymentYaml,
} from './data'

/**
 * 无状态应用路由配置
 * @remarks
 * - GET    /kubernetes/clusters/:clusterUid/deployments                                         - 获取无状态应用列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name             - 获取无状态应用详情
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/yaml        - 获取无状态应用 YAML
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/pods        - 获取关联 Pod 列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/history     - 获取历史版本列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/network     - 获取关联网络资源
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/events      - 获取事件列表
 * - GET    /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/monitor     - 获取监控数据
 * - POST   /kubernetes/clusters/:clusterUid/deployments                                         - 创建无状态应用
 * - POST   /kubernetes/clusters/:clusterUid/deployments/yaml                                    - 创建无状态应用（YAML）
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name             - 更新无状态应用
 * - PUT    /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/yaml        - 更新无状态应用（YAML）
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/labels      - 配置标签
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/annotations - 配置注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name             - 删除无状态应用
 * - DELETE /kubernetes/clusters/:clusterUid/deployments                                         - 批量删除无状态应用
 * - POST   /kubernetes/clusters/:clusterUid/deployments/import                                  - 导入无状态应用
 * - GET    /kubernetes/clusters/:clusterUid/deployments/export                                  - 导出无状态应用
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/scale       - 扩缩容无状态应用
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/restart     - 重启无状态应用
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/rollback    - 回滚无状态应用
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/pause       - 暂停更新
 * - POST   /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/resume      - 恢复更新
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/deployments',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<DeploymentQueryForm> }) =>
      getDeploymentList(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getDeploymentDetail(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      getDeploymentYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/pods',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<PodQueryForm> }) =>
      getDeploymentPodList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/history',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<DeploymentHistoryRevisionQueryForm> }) =>
      getDeploymentHistoryRevisionList(
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
      getDeploymentNetwork(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/events',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<EventQueryForm> }) =>
      getDeploymentEventList(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/monitor',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<DeploymentMonitorQueryForm> }) =>
      getDeploymentMonitor(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/deployments',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<DeploymentCreateForm> }) =>
      createDeployment(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/deployments/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      createDeploymentYaml(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name',
    handler: (ctx: { pathParams: Record<string, string>; data: Partial<DeploymentUpdateForm> }) =>
      updateDeployment(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/yaml',
    handler: (ctx: { pathParams: Record<string, string>; data: string }) =>
      updateDeploymentYaml(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/labels',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataLabelForm }) =>
      manageDeploymentLabels(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/annotations',
    handler: (ctx: { pathParams: Record<string, string>; data: MetadataAnnotationForm }) =>
      manageDeploymentAnnotations(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      deleteDeployment(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/deployments',
    handler: (ctx: { pathParams: Record<string, string>; data: string[] }) =>
      deleteDeployments(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/deployments/import',
    handler: (ctx: { pathParams: Record<string, string>; data: FormData }) =>
      importDeployment(ctx.pathParams.clusterUid, ctx.data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/deployments/export',
    handler: (ctx: { pathParams: Record<string, string>; params: Partial<DeploymentExportQueryForm> }) =>
      exportDeployment(ctx.pathParams.clusterUid, ctx.params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/scale',
    handler: (ctx: { pathParams: Record<string, string>; data: DeploymentScaleForm }) =>
      scaleDeployment(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/restart',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      restartDeployment(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/rollback',
    handler: (ctx: { pathParams: Record<string, string>; data: DeploymentRollbackForm }) =>
      rollbackDeployment(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name, ctx.data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/pause',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      pauseDeployment(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/resume',
    handler: (ctx: { pathParams: Record<string, string> }) =>
      resumeDeployment(ctx.pathParams.clusterUid, ctx.pathParams.namespace, ctx.pathParams.name),
  },
]

/**
 * 获取无状态应用（Deployment）列表
 * @param clusterUid - 集群 UID
 * @param query - 查询条件
 * @returns 分页后的无状态应用列表
 */
function getDeploymentList(clusterUid: string, query: Partial<DeploymentQueryForm>): PageVo<DeploymentListVo> {
  console.log('[Mock] getDeploymentList', clusterUid, query)
  const filtered = mockDeploymentList.filter((d: DeploymentListVo) => {
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
 * 获取无状态应用（Deployment）详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @returns 无状态应用详情
 */
function getDeploymentDetail(clusterUid: string, namespace: string, name: string): DeploymentDetailVo {
  console.log('[Mock] getDeploymentDetail', clusterUid, namespace, name)
  return mockDeploymentDetail
}

/**
 * 获取无状态应用（Deployment）YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @returns 无状态应用 YAML
 */
function getDeploymentYaml(clusterUid: string, namespace: string, name: string): DeploymentYamlVo {
  console.log('[Mock] getDeploymentYaml', clusterUid, namespace, name)
  return { yaml: mockDeploymentYaml }
}

/**
 * 获取无状态应用（Deployment）关联 Pod 列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param query - 关联 Pod 查询条件
 * @returns 分页后的容器组（Pod）列表
 */
function getDeploymentPodList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<PodQueryForm>,
): PageVo<PodListVo> {
  console.log('[Mock] getDeploymentPodList', clusterUid, namespace, name, query)
  const filtered = mockDeploymentPodList.filter((d: PodListVo) => {
    if (query.namespace && d.namespace !== query.namespace) return false
    if (query.status && d.status !== query.status) return false
    return true
  })
  const filteredUid = query.uid ? filtered.filter(d => d.uid === query.uid) : []
  const filteredName = query.name ? filtered.filter(d => d.name.includes(query.name as string)) : []
  const filteredIp = query.ip ? filtered.filter(d => d.ip.includes(query.ip as string)) : []
  const matched =
    query.uid || query.name || query.ip
      ? Array.from(new Set([...filteredUid, ...filteredName, ...filteredIp]))
      : filtered
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
 * 获取无状态应用（Deployment）历史版本列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param query - 历史版本查询条件
 * @returns 分页后的历史版本（History）列表
 */
function getDeploymentHistoryRevisionList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<DeploymentHistoryRevisionQueryForm>,
): PageVo<DeploymentHistoryRevisionListVo> {
  console.log('[Mock] getDeploymentHistoryRevisionList', clusterUid, namespace, name, query)
  const filtered = mockDeploymentHistoryRevisionList.filter((d: DeploymentHistoryRevisionListVo) => {
    if (query.revision && d.revision !== query.revision) return false
    return true
  })
  const filteredChangeCause = query.changeCause ? filtered.filter(d => d.changeCause === query.changeCause) : []
  const matched = query.changeCause ? Array.from(new Set([...filteredChangeCause])) : filtered
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
 * 获取无状态应用（Deployment）关联网络资源
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @returns 关联网络资源数据
 */
function getDeploymentNetwork(clusterUid: string, namespace: string, name: string): DeploymentNetworkVo {
  console.log('[Mock] getDeploymentNetwork', clusterUid, namespace, name)
  return mockDeploymentNetwork
}

/**
 * 获取无状态应用（Deployment）事件（Event）列表
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param query - 事件查询条件
 * @returns 分页后的事件列表
 */
function getDeploymentEventList(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<EventQueryForm>,
): PageVo<EventListVo> {
  console.log('[Mock] getDeploymentEventList', clusterUid, namespace, name)
  return handleEventList(query, mockDeploymentEventList)
}

/**
 * 获取无状态应用（Deployment）监控数据
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param query - 监控查询条件
 * @returns 无状态应用监控数据
 */
function getDeploymentMonitor(
  clusterUid: string,
  namespace: string,
  name: string,
  query: Partial<DeploymentMonitorQueryForm>,
): DeploymentMonitorVo {
  console.log('[Mock] getDeploymentMonitor', clusterUid, namespace, name, query)
  return mockDeploymentMonitor
}

/**
 * 创建无状态应用（Deployment）
 * @param clusterUid - 集群 UID
 * @param data - 创建请求对象
 */
function createDeployment(clusterUid: string, data: Partial<DeploymentCreateForm>): void {
  console.log('[Mock] createDeployment', clusterUid, data)
}

/**
 * 创建无状态应用（Deployment）（YAML）
 * @param clusterUid - 集群 UID
 * @param yaml - 创建 YAML 文本
 */
function createDeploymentYaml(clusterUid: string, yaml: string): void {
  console.log('[Mock] createDeploymentYaml', clusterUid, yaml)
}

/**
 * 更新无状态应用（Deployment）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param data - 更新请求对象
 */
function updateDeployment(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<DeploymentUpdateForm>,
): void {
  console.log('[Mock] updateDeployment', clusterUid, namespace, name, data)
}

/**
 * 更新无状态应用（Deployment）（YAML）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param yaml - 更新 YAML 文本
 */
function updateDeploymentYaml(clusterUid: string, namespace: string, name: string, yaml: string): void {
  console.log('[Mock] updateDeploymentYaml', clusterUid, namespace, name, yaml)
}

/**
 * 配置无状态应用（Deployment）标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param data - 标签配置请求对象
 */
function manageDeploymentLabels(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm): void {
  console.log('[Mock] manageDeploymentLabels', clusterUid, namespace, name, data)
}

/**
 * 配置无状态应用（Deployment）注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param data - 注解配置请求对象
 */
function manageDeploymentAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: MetadataAnnotationForm,
): void {
  console.log('[Mock] manageDeploymentAnnotations', clusterUid, namespace, name, data)
}

/**
 * 删除无状态应用（Deployment）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 */
function deleteDeployment(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteDeployment', clusterUid, namespace, name)
}

/**
 * 批量删除无状态应用（Deployment）
 * @param clusterUid - 集群 UID
 * @param uids - 无状态应用 UID 数组
 */
function deleteDeployments(clusterUid: string, uids: string[]): void {
  console.log('[Mock] deleteDeployments', clusterUid, uids)
}

/**
 * 导入无状态应用（Deployment）
 * @param clusterUid - 集群 UID
 * @param formData - 文件数据
 */
function importDeployment(clusterUid: string, formData: FormData): void {
  void formData
  console.log('[Mock] importDeployment', clusterUid)
}

/**
 * 导出无状态应用（Deployment）
 * @param clusterUid - 集群 UID
 * @param query - 导出查询条件
 */
function exportDeployment(clusterUid: string, query: Partial<DeploymentExportQueryForm>): void {
  console.log('[Mock] exportDeployment', clusterUid, query)
}

/**
 * 扩缩容无状态应用（Deployment）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param data - 扩缩容请求对象
 */
function scaleDeployment(clusterUid: string, namespace: string, name: string, data: DeploymentScaleForm): void {
  console.log('[Mock] scaleDeployment', clusterUid, namespace, name, data)
}

/**
 * 重启无状态应用（Deployment）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 */
function restartDeployment(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] restartDeployment', clusterUid, namespace, name)
}

/**
 * 回滚无状态应用（Deployment）
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 * @param data - 回滚请求对象
 */
function rollbackDeployment(clusterUid: string, namespace: string, name: string, data: DeploymentRollbackForm): void {
  console.log('[Mock] rollbackDeployment', clusterUid, namespace, name, data)
}

/**
 * 暂停无状态应用（Deployment）更新
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 */
function pauseDeployment(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] pauseDeployment', clusterUid, namespace, name)
}

/**
 * 恢复无状态应用（Deployment）更新
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间名称
 * @param name - 无状态应用名称
 */
function resumeDeployment(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] resumeDeployment', clusterUid, namespace, name)
}
