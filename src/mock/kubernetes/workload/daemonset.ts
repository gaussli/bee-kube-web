/**
 * Kubernetes DaemonSet 管理 Mock API
 * @module mock/kubernetes/workload/daemonset
 */
import type { PageVo } from '@/types/common'
import type {
  DaemonSetAnnotationsReq,
  DaemonSetDetailResp,
  DaemonSetLabelsReq,
  DaemonSetListResp,
  DaemonSetQueryReq,
  DaemonSetReq,
  DaemonSetYamlReq,
} from '@/types/kubernetes/workload/daemonset'

import { generateId } from '@/mock/utils'

/**
 * DaemonSet 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterUid/daemonsets - 获取 DaemonSet 分页列表
 * - GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name - 获取 DaemonSet 详情
 * - GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/yaml - 查看 YAML
 * - POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets - 创建 DaemonSet
 * - PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name - 更新 DaemonSet
 * - POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/restart - 重启
 * - POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name - 删除 DaemonSet
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/batch - 批量删除
 * - GET /kubernetes/clusters/:clusterUid/daemonsets/export - 导出 CSV
 * - POST /kubernetes/clusters/:clusterUid/daemonsets/import - 导入 DaemonSet
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/daemonsets',
    handler: ({
      pathParams,
      params,
    }: {
      pathParams: Record<string, string>
      params: Partial<DaemonSetQueryReq>
    }): PageVo<DaemonSetListResp> => getDaemonSetList(pathParams.clusterUid, params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): DaemonSetDetailResp =>
      getDaemonSetDetail(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/yaml',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): string =>
      getDaemonSetYaml(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: DaemonSetReq }): void =>
      createDaemonSet(pathParams.clusterUid, pathParams.namespace, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: Partial<DaemonSetReq> }): void =>
      updateDaemonSet(pathParams.clusterUid, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/restart',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): void =>
      restartDaemonSet(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/labels',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: DaemonSetLabelsReq }): void =>
      manageDaemonSetLabels(pathParams.clusterUid, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/annotations',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: DaemonSetAnnotationsReq }): void =>
      manageDaemonSetAnnotations(pathParams.clusterUid, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): void =>
      deleteDaemonSet(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/batch',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: string[] }): void =>
      deleteDaemonSets(pathParams.clusterUid, pathParams.namespace, data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/daemonsets/export',
    handler: ({
      pathParams,
      params,
    }: {
      pathParams: Record<string, string>
      params: Partial<DaemonSetQueryReq>
    }): void => exportDaemonSet(pathParams.clusterUid, params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/daemonsets/import',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: DaemonSetYamlReq }): void =>
      importDaemonSet(pathParams.clusterUid, data),
  },
]

/**
 * 获取 DaemonSet 分页列表
 * @param _clusterId - 集群 UID
 * @param params - 查询参数
 * @returns 分页数据
 */
function getDaemonSetList(_clusterId: string, params: Partial<DaemonSetQueryReq>): PageVo<DaemonSetListResp> {
  const { id, name, namespace, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockDaemonSets]

  if (status) {
    filtered = filtered.filter(d => d.status === status)
  }
  if (namespace) {
    filtered = filtered.filter(d => d.namespace === namespace)
  }

  if (id || name) {
    let searchFiltered: DaemonSetListResp[] = []
    if (id) {
      searchFiltered = [...searchFiltered, ...filtered.filter(d => d.id === id)]
    }
    if (name) {
      searchFiltered = [...searchFiltered, ...filtered.filter(d => d.name.toLowerCase().includes(name.toLowerCase()))]
    }
    const seenIds = new Set<string>()
    filtered = searchFiltered.filter(d => {
      if (seenIds.has(d.id)) return false
      seenIds.add(d.id)
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
 * 获取 DaemonSet 详情
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - DaemonSet 名称
 * @returns DaemonSet 详情
 */
function getDaemonSetDetail(clusterUid: string, namespace: string, name: string): DaemonSetDetailResp {
  const ds = mockDaemonSets.find(d => d.clusterUid === clusterUid && d.namespace === namespace && d.name === name)
  if (!ds) {
    console.error('[Get DaemonSet Detail] can not find daemonset:', clusterUid, namespace, name)
  }
  return {
    ...ds!,
    selector: { app: ds!.name },
    labels: { app: ds!.name },
    annotations: { description: ds!.description || '' },
    containers: [
      {
        name: ds!.name,
        image: `${ds!.name}:latest`,
      },
    ],
  }
}

/**
 * 查看 DaemonSet YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - DaemonSet 名称
 * @returns DaemonSet YAML 配置
 */
function getDaemonSetYaml(clusterUid: string, namespace: string, name: string): string {
  const ds = mockDaemonSets.find(d => d.clusterUid === clusterUid && d.namespace === namespace && d.name === name)
  if (!ds) {
    console.error('[Get DaemonSet Yaml] can not find daemonset:', clusterUid, namespace, name)
    return ''
  }

  const yaml = `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: ${ds.name}
  namespace: ${ds.namespace}
  creationTimestamp: "${ds.createAt}"
spec:
  selector:
    matchLabels:
      app: ${ds.name}
  updateStrategy:
    type: ${ds.updateStrategy}
  template:
    metadata:
      labels:
        app: ${ds.name}
    spec:
      containers:
      - name: ${ds.name}
        image: ${ds.name}:latest
status:
  desiredNumberScheduled: ${ds.desiredNumberScheduled}
  numberReady: ${ds.numberReady}`

  return yaml
}

/**
 * 创建 DaemonSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param data - 创建参数
 */
function createDaemonSet(clusterUid: string, namespace: string, data: DaemonSetReq): void {
  console.log('[Mock] createDaemonSet', { clusterUid, namespace, data })
}

/**
 * 更新 DaemonSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - DaemonSet 名称
 * @param data - 更新参数
 */
function updateDaemonSet(clusterUid: string, namespace: string, name: string, data: Partial<DaemonSetReq>): void {
  console.log('[Mock] updateDaemonSet', { clusterUid, namespace, name, data })
}

/**
 * 重启 DaemonSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - DaemonSet 名称
 */
function restartDaemonSet(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] restartDaemonSet', { clusterUid, namespace, name })
}

/**
 * 更新 DaemonSet 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - DaemonSet 名称
 * @param data - 标签数据
 */
function manageDaemonSetLabels(clusterUid: string, namespace: string, name: string, data: DaemonSetLabelsReq): void {
  console.log('[Mock] manageDaemonSetLabels', { clusterUid, namespace, name, data })
}

/**
 * 更新 DaemonSet 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - DaemonSet 名称
 * @param data - 注解数据
 */
function manageDaemonSetAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: DaemonSetAnnotationsReq,
): void {
  console.log('[Mock] manageDaemonSetAnnotations', { clusterUid, namespace, name, data })
}

/**
 * 删除 DaemonSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - DaemonSet 名称
 */
function deleteDaemonSet(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteDaemonSet', { clusterUid, namespace, name })
}

/**
 * 批量删除 DaemonSet
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param names - DaemonSet 名称数组
 */
function deleteDaemonSets(clusterUid: string, namespace: string, names: string[]): void {
  console.log('[Mock] deleteDaemonSets', { clusterUid, namespace, names })
}

/**
 * 导出 DaemonSet CSV
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 */
function exportDaemonSet(clusterUid: string, params: Partial<DaemonSetQueryReq>): void {
  console.log('[Mock] exportDaemonSet', { clusterUid, params })
}

/**
 * 导入 DaemonSet
 * @param clusterUid - 集群 UID
 * @param data - YAML 配置
 */
function importDaemonSet(clusterUid: string, data: DaemonSetYamlReq): void {
  console.log('[Mock] importDaemonSet', { clusterUid, data })
}

/**
 * 模拟 DaemonSet 数据
 * @remarks 包含日志采集、监控代理、存储插件等各类节点级守护 Pod
 */
const mockDaemonSets: DaemonSetListResp[] = [
  // ==================== Running（运行中）- 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'fluentd-logging',
    namespace: 'kube-system',
    clusterUid: generateId(),
    description: 'Fluentd 日志采集 DaemonSet，在每个节点运行并采集容器日志发送到日志平台',
    status: 'Running',
    desiredNumberScheduled: 8,
    numberReady: 8,
    updateStrategy: 'RollingUpdate',
    createAt: '2024-01-15 10:30:00',
    createBy: 'admin',
    updateAt: '2024-03-20 14:00:00',
    updateBy: 'admin',
    deletable: false,
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'node-exporter',
    namespace: 'monitoring',
    clusterUid: generateId(),
    description: 'Prometheus Node Exporter，采集节点级别的 CPU、内存、磁盘等硬件指标',
    status: 'Running',
    desiredNumberScheduled: 8,
    numberReady: 8,
    updateStrategy: 'RollingUpdate',
    createAt: '2024-01-20 09:00:00',
    createBy: 'admin',
    updateAt: '2024-03-19 16:30:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'kube-proxy',
    namespace: 'kube-system',
    clusterUid: generateId(),
    description: 'Kubernetes 网络代理组件，维护节点上的网络规则和 Service 流量转发',
    status: 'Running',
    desiredNumberScheduled: 8,
    numberReady: 8,
    updateStrategy: 'RollingUpdate',
    createAt: '2024-01-15 10:35:00',
    createBy: 'system',
    updateAt: '2024-03-18 10:00:00',
    updateBy: 'system',
    deletable: false,
  },
  // ==================== Available（部分就绪）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'filebeat',
    namespace: 'logging',
    clusterUid: generateId(),
    description: 'Filebeat 日志采集器，将应用日志文件实时发送到 ElasticSearch',
    status: 'Available',
    statusMessage: '1 个节点上的 Pod 未就绪，正在等待节点资源',
    desiredNumberScheduled: 8,
    numberReady: 7,
    updateStrategy: 'RollingUpdate',
    createAt: '2024-02-10 10:00:00',
    createBy: 'developer',
    updateAt: '2024-03-20 11:00:00',
    updateBy: 'developer',
    deletable: true,
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'csi-driver',
    namespace: 'storage',
    clusterUid: generateId(),
    description: 'CSI 存储驱动插件，为每个节点提供持久化存储卷的挂载和管理能力',
    status: 'Available',
    statusMessage: '新增节点上 Pod 初始化中，存储卷尚未挂载完成',
    desiredNumberScheduled: 10,
    numberReady: 9,
    updateStrategy: 'OnDelete',
    createAt: '2024-02-15 08:00:00',
    createBy: 'admin',
    updateAt: '2024-03-19 12:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  // ==================== Updating（更新中）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'datadog-agent',
    namespace: 'monitoring',
    clusterUid: generateId(),
    description: 'Datadog Agent，提供应用性能监控(APM)和基础设施监控能力',
    status: 'Updating',
    statusMessage: '滚动更新中，按节点逐个替换旧版本 Pod',
    desiredNumberScheduled: 8,
    numberReady: 5,
    updateStrategy: 'RollingUpdate',
    createAt: '2024-02-20 14:00:00',
    createBy: 'developer',
    updateAt: '2024-03-20 16:00:00',
    updateBy: 'developer',
    deletable: true,
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'calico-node',
    namespace: 'kube-system',
    clusterUid: generateId(),
    description: 'Calico 网络插件节点组件，管理 Pod 网络策略和路由',
    status: 'Updating',
    statusMessage: '版本升级进行中，网络策略迁移中',
    desiredNumberScheduled: 8,
    numberReady: 6,
    updateStrategy: 'RollingUpdate',
    createAt: '2024-01-10 08:00:00',
    createBy: 'admin',
    updateAt: '2024-03-20 15:30:00',
    updateBy: 'admin',
    deletable: false,
  },
  // ==================== Creating（创建中）- 1 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'gpu-device-plugin',
    namespace: 'kube-system',
    clusterUid: generateId(),
    description: 'NVIDIA GPU 设备插件，使 Kubernetes 能够发现和调度 GPU 资源',
    status: 'Creating',
    statusMessage: 'Pod 正在节点上创建，等待镜像拉取完成',
    desiredNumberScheduled: 4,
    numberReady: 1,
    updateStrategy: 'OnDelete',
    createAt: '2024-03-19 15:00:00',
    createBy: 'admin',
    updateAt: '2024-03-19 15:00:00',
    updateBy: 'admin',
    deletable: false,
  },
  // ==================== Failed（失败异常）- 1 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'network-monitor',
    namespace: 'monitoring',
    clusterUid: generateId(),
    description: '网络监控探针，检测节点间网络延迟和连通性',
    status: 'Failed',
    statusMessage: '部分节点 Pod 启动失败，CrashLoopBackOff',
    desiredNumberScheduled: 8,
    numberReady: 3,
    updateStrategy: 'RollingUpdate',
    createAt: '2024-02-25 10:00:00',
    createBy: 'admin',
    updateAt: '2024-03-18 09:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  // ==================== Unknown（未知）- 1 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'auditbeat',
    namespace: 'logging',
    clusterUid: generateId(),
    description: 'Auditbeat 审计日志采集器，记录系统级别审计事件',
    status: 'Unknown',
    statusMessage: 'API Server 连接异常，无法获取 DaemonSet 状态',
    desiredNumberScheduled: 8,
    numberReady: 0,
    updateStrategy: 'RollingUpdate',
    createAt: '2024-03-01 08:00:00',
    createBy: 'admin',
    updateAt: '2024-03-20 17:00:00',
    updateBy: 'admin',
    deletable: true,
  },
]
