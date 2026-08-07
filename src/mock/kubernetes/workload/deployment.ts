/**
 * Kubernetes Deployment 管理 Mock API
 * @module mock/kubernetes/workload/deployment
 */
import type { PageVo } from '@/types/common'
import type {
  DeploymentAnnotationForm,
  DeploymentCreateForm,
  DeploymentDetailVo,
  DeploymentHistoryRevisionListVo,
  DeploymentLabelForm,
  DeploymentListVo,
  DeploymentMonitorVo,
  DeploymentNetworkVo,
  DeploymentPodListVo,
  DeploymentPodQueryForm,
  DeploymentQueryForm,
  DeploymentScaleForm,
  DeploymentScheduleVo,
  DeploymentStorageListVo,
  DeploymentUpdateForm,
  DeploymentImportForm,
} from '@/types/kubernetes/workload/deployment'

import { generateId } from '@/mock/utils'

import {
  mockDeploymentAdvanced,
  mockDeploymentBasic,
  mockDeploymentConditions,
  mockDeploymentMetadata,
  mockDeploymentReplicas,
  mockDeploymentResource,
  mockDeployments,
  mockDeploymentStrategy,
} from './deploymentData'

/**
 * Deployment 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterUid/deployments - 获取 Deployment 分页列表
 * - GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name - 获取 Deployment 详情
 * - GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/pods - 获取 Pod 列表
 * - GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/schedule - 获取调度策略
 * - GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/history - 获取历史版本列表
 * - GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/network - 获取网络资源
 * - GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/storages - 获取存储列表
 * - GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/monitor - 获取监控数据
 * - GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/yaml - 查看 YAML
 * - POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments - 创建 Deployment
 * - PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name - 更新 Deployment
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name - 删除 Deployment
 * - DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/batch - 批量删除
 * - GET /kubernetes/clusters/:clusterUid/deployments/export - 导出
 * - POST /kubernetes/clusters/:clusterUid/deployments/import - 导入
 * - POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/annotations - 更新注解
 * - POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/scale - 扩缩容
 * - POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/restart - 重启
 * - POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/rollback - 回滚
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/deployments',
    handler: ({
      pathParams,
      params,
    }: {
      pathParams: Record<string, string>
      params: Partial<DeploymentQueryForm>
    }): PageVo<DeploymentListVo> => getDeploymentList(pathParams.clusterUid, params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): DeploymentDetailVo =>
      getDeploymentDetail(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/pods',
    handler: ({
      pathParams,
      params,
    }: {
      pathParams: Record<string, string>
      params: Partial<DeploymentPodQueryForm>
    }): PageVo<DeploymentPodListVo> =>
      getDeploymentPodList(pathParams.clusterUid, pathParams.namespace, pathParams.name, params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/schedule',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): DeploymentScheduleVo =>
      getDeploymentSchedule(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/history',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): DeploymentHistoryRevisionListVo[] =>
      getDeploymentHistoryRevisionList(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/network',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): DeploymentNetworkVo =>
      getDeploymentNetwork(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/storages',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): DeploymentStorageListVo[] =>
      getDeploymentStorageList(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/monitor',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): DeploymentMonitorVo =>
      getDeploymentMonitor(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/yaml',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): string =>
      getDeploymentYaml(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: DeploymentCreateForm }): void =>
      createDeployment(pathParams.clusterUid, pathParams.namespace, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name',
    handler: ({
      pathParams,
      data,
    }: {
      pathParams: Record<string, string>
      data: Partial<DeploymentUpdateForm>
    }): void => updateDeployment(pathParams.clusterUid, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): void =>
      deleteDeployment(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/batch',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: string[] }): void =>
      deleteDeployments(pathParams.clusterUid, pathParams.namespace, data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/deployments/export',
    handler: ({
      pathParams,
      params,
    }: {
      pathParams: Record<string, string>
      params: Partial<DeploymentQueryForm>
    }): void => exportDeployment(pathParams.clusterUid, params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/deployments/import',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: DeploymentImportForm }): void =>
      importDeployment(pathParams.clusterUid, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/labels',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: DeploymentLabelForm }): void =>
      manageDeploymentLabels(pathParams.clusterUid, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/annotations',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: DeploymentAnnotationForm }): void =>
      manageDeploymentAnnotations(pathParams.clusterUid, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/scale',
    handler: ({ pathParams, data }: { pathParams: Record<string, string>; data: DeploymentScaleForm }): void =>
      scaleDeployment(pathParams.clusterUid, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/restart',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): void =>
      restartDeployment(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/rollback',
    handler: ({ pathParams }: { pathParams: Record<string, string> }): void =>
      rollbackDeployment(pathParams.clusterUid, pathParams.namespace, pathParams.name),
  },
]

/**
 * 获取 Deployment 分页列表
 * @param _clusterId - 集群 UID
 * @param params - 查询参数
 * @returns 分页数据
 */
function getDeploymentList(_clusterId: string, params: Partial<DeploymentQueryForm>): PageVo<DeploymentListVo> {
  const { uid, name, namespace, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockDeployments]

  if (status) {
    filtered = filtered.filter(d => d.status === status)
  }
  if (namespace) {
    filtered = filtered.filter(d => d.namespace === namespace)
  }

  if (uid || name) {
    let searchFiltered: DeploymentListVo[] = []
    if (uid) {
      searchFiltered = [...searchFiltered, ...filtered.filter(n => n.uid === uid)]
    }
    if (name) {
      searchFiltered = [...searchFiltered, ...filtered.filter(n => n.name.toLowerCase().includes(name.toLowerCase()))]
    }
    // searchFiltered 基于 uid 去重
    const seenUids = new Set<string>()
    filtered = searchFiltered.filter(n => {
      if (seenUids.has(n.uid)) return false
      seenUids.add(n.uid)
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
 * 获取 Deployment 详情
 * @param _clusterId - 集群 UID
 * @param _namespace - 命名空间
 * @param _name - Deployment 名称
 * @returns Deployment 详情
 */
function getDeploymentDetail(_clusterId: string, _namespace: string, _name: string): DeploymentDetailVo {
  return {
    basic: mockDeploymentBasic,
    replicas: mockDeploymentReplicas,
    metadata: mockDeploymentMetadata,
    resource: mockDeploymentResource,
    conditions: mockDeploymentConditions,
    strategy: mockDeploymentStrategy,
    advanced: mockDeploymentAdvanced,
  }
}

/**
 * 获取 Deployment Pod 列表
 * @param _clusterId - 集群 UID
 * @param _namespace - 命名空间
 * @param _name - Deployment 名称
 * @returns Pod 列表
 */
/**
 * 获取 Deployment Pod 分页列表
 * @param _clusterId - 集群 UID
 * @param _namespace - 命名空间
 * @param _name - Deployment 名称
 * @param params - 查询参数（含分页、名称筛选、状态筛选）
 * @returns 分页后的 Pod 列表
 */
function getDeploymentPodList(
  _clusterId: string,
  _namespace: string,
  _name: string,
  params: Partial<DeploymentPodQueryForm>,
): PageVo<DeploymentPodListVo> {
  const { name, status, page = 1, pageSize = 10 } = params || {}
  const allPods = generateMockPods()

  let filtered = [...allPods]
  if (name) {
    const keyword = name.toLowerCase()
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(keyword) ||
        p.uid.toLowerCase().includes(keyword) ||
        p.ip.toLowerCase().includes(keyword),
    )
  }
  if (status) {
    filtered = filtered.filter(p => p.status === status)
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)

  return { list, total, page, pageSize }
}

/**
 * 生成模拟 Pod 数据
 * @returns Pod 列表
 */
function generateMockPods(): DeploymentPodListVo[] {
  const deploy = mockDeployments[0]
  const nodeName = `${deploy.clusterName || 'cluster'}-node`
  const nodeIp = '10.0.1.'
  return [
    {
      id: generateId(),
      uid: generateId(),
      name: `${deploy.name}-6d4f8c9b7-xk2lm`,
      ip: '10.244.1.',
      status: 'Running',
      statusMsg: 'All containers are running normally',
      restarts: 0,
      nodeIp: `${nodeIp}101`,
      nodeName: `${nodeName}-001`,
      readyContainerCount: 2,
      containerCount: 2,
      cpuUsage: '15%',
      memoryUsage: '32%',
      clusterUid: deploy.clusterUid,
      clusterUid: deploy.clusterUid,
      clusterName: deploy.clusterName,
      namespace: deploy.namespace,
      namespaceId: deploy.namespaceId,
      namespaceUid: deploy.namespaceUid,
      createAt: deploy.createAt,
      createBy: deploy.createBy,
      updateAt: deploy.updateAt,
      updateBy: deploy.updateBy,
    },
    {
      id: generateId(),
      uid: generateId(),
      name: `${deploy.name}-6d4f8c9b7-pq9rs`,
      ip: '10.244.2.',
      status: 'Running',
      statusMsg: 'All containers are running normally',
      restarts: 2,
      nodeIp: `${nodeIp}102`,
      nodeName: `${nodeName}-002`,
      readyContainerCount: 2,
      containerCount: 2,
      cpuUsage: '22%',
      memoryUsage: '45%',
      clusterUid: deploy.clusterUid,
      clusterUid: deploy.clusterUid,
      clusterName: deploy.clusterName,
      namespace: deploy.namespace,
      namespaceId: deploy.namespaceId,
      namespaceUid: deploy.namespaceUid,
      createAt: deploy.createAt,
      createBy: deploy.createBy,
      updateAt: deploy.updateAt,
      updateBy: deploy.updateBy,
    },
    {
      id: generateId(),
      uid: generateId(),
      name: `${deploy.name}-6d4f8c9b7-zt7wv`,
      ip: '10.244.3.',
      status: 'Pending',
      statusMsg: 'ContainerCreating: pulling image',
      restarts: 0,
      nodeIp: `${nodeIp}101`,
      nodeName: `${nodeName}-001`,
      readyContainerCount: 0,
      containerCount: 2,
      cpuUsage: '0%',
      memoryUsage: '0%',
      clusterUid: deploy.clusterUid,
      clusterUid: deploy.clusterUid,
      clusterName: deploy.clusterName,
      namespace: deploy.namespace,
      namespaceId: deploy.namespaceId,
      namespaceUid: deploy.namespaceUid,
      createAt: new Date().toLocaleString(),
      createBy: deploy.createBy,
      updateAt: new Date().toLocaleString(),
      updateBy: deploy.updateBy,
    },
    {
      id: generateId(),
      uid: generateId(),
      name: `${deploy.name}-6d4f8c9b7-ab4cd`,
      ip: '10.244.1.',
      status: 'Running',
      statusMsg: 'Minor performance degradation detected',
      restarts: 1,
      nodeIp: `${nodeIp}103`,
      nodeName: `${nodeName}-003`,
      readyContainerCount: 2,
      containerCount: 2,
      cpuUsage: '78%',
      memoryUsage: '91%',
      clusterUid: deploy.clusterUid,
      clusterUid: deploy.clusterUid,
      clusterName: deploy.clusterName,
      namespace: deploy.namespace,
      namespaceId: deploy.namespaceId,
      namespaceUid: deploy.namespaceUid,
      createAt: deploy.createAt,
      createBy: deploy.createBy,
      updateAt: deploy.updateAt,
      updateBy: deploy.updateBy,
    },
    {
      id: generateId(),
      uid: generateId(),
      name: `${deploy.name}-6d4f8c9b7-ef5gh`,
      ip: '10.244.2.',
      status: 'Failed',
      statusMsg: 'CrashLoopBackOff: container exited with code 1',
      restarts: 15,
      nodeIp: `${nodeIp}102`,
      nodeName: `${nodeName}-002`,
      readyContainerCount: 0,
      containerCount: 2,
      cpuUsage: '5%',
      memoryUsage: '8%',
      clusterUid: deploy.clusterUid,
      clusterUid: deploy.clusterUid,
      clusterName: deploy.clusterName,
      namespace: deploy.namespace,
      namespaceId: deploy.namespaceId,
      namespaceUid: deploy.namespaceUid,
      createAt: deploy.createAt,
      createBy: deploy.createBy,
      updateAt: deploy.updateAt,
      updateBy: deploy.updateBy,
    },
  ]
}

/**
 * 获取 Deployment 调度策略
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @returns Deployment 调度策略
 */
function getDeploymentSchedule(clusterUid: string, namespace: string, name: string): DeploymentScheduleVo {
  const deployment = mockDeployments.find(
    d => d.clusterUid === clusterUid && d.namespace === namespace && d.name === name,
  )
  if (!deployment) {
    console.error('[Get Deployment Schedule] can not find deployment:', clusterUid, namespace, name)
  }
  return {
    nodeSelector: { 'kubernetes.io/os': 'linux' },
    affinity: {
      nodeAffinity: {
        required: [
          {
            matchExpressions: [{ key: 'kubernetes.io/os', operator: 'In', values: ['linux'] }],
          },
        ],
        preferred: [
          {
            weight: 80,
            matchExpressions: [{ key: 'node-type', operator: 'In', values: ['ssd', 'high-memory'] }],
          },
        ],
      },
      podAffinity: {
        required: [],
        preferred: [
          {
            weight: 50,
            labelSelector: { matchLabels: { app: deployment!.name }, matchExpressions: [] },
            namespaces: [],
            namespaceSelector: { matchLabels: {}, matchExpressions: [] },
            topologyKey: 'kubernetes.io/hostname',
            matchLabelKeys: [],
            mismatchLabelKeys: [],
          },
        ],
      },
      podAntiAffinity: {
        required: [
          {
            labelSelector: { matchLabels: { app: deployment!.name }, matchExpressions: [] },
            namespaces: [],
            namespaceSelector: { matchLabels: {}, matchExpressions: [] },
            topologyKey: 'kubernetes.io/hostname',
            matchLabelKeys: [],
            mismatchLabelKeys: [],
          },
        ],
        preferred: [],
      },
    },
    tolerations: [
      {
        key: 'node.kubernetes.io/not-ready',
        operator: 'Exists',
        value: '',
        effect: 'NoExecute',
        tolerationSeconds: 300,
      },
      {
        key: 'node.kubernetes.io/unreachable',
        operator: 'Exists',
        value: '',
        effect: 'NoExecute',
        tolerationSeconds: 300,
      },
    ],
  }
}

/**
 * 获取 Deployment 历史版本列表
 * @param _clusterId - 集群 UID
 * @param _namespace - 命名空间
 * @param _name - Deployment 名称
 * @returns 历史版本列表
 */
function getDeploymentHistoryRevisionList(
  _clusterId: string,
  _namespace: string,
  _name: string,
): DeploymentHistoryRevisionListVo[] {
  return [
    {
      revision: 5,
      changeCause: 'kubectl set image deployment=' + _name + '=' + _name + ':v2.1.0',
      createAt: '2024-07-01 14:30:00',
      active: true,
    },
    { revision: 4, changeCause: 'kubectl edit deployment/' + _name, createAt: '2024-06-28 09:15:00', active: false },
    {
      revision: 3,
      changeCause: 'kubectl set resources deployment/' + _name + ' --limits=cpu=500m,memory=512Mi',
      createAt: '2024-06-25 16:45:00',
      active: false,
    },
    {
      revision: 2,
      changeCause: 'kubectl apply -f ' + _name + '.yaml --record',
      createAt: '2024-06-20 11:00:00',
      active: false,
    },
    {
      revision: 1,
      changeCause: 'kubectl create deployment ' + _name + ' --image=' + _name + ':v1.0.0',
      createAt: '2024-06-15 08:30:00',
      active: false,
    },
  ]
}

/**
 * 获取 Deployment 网络资源
 * @param _clusterId - 集群 UID
 * @param _namespace - 命名空间
 * @param _name - Deployment 名称
 * @returns 网络资源
 */
function getDeploymentNetwork(_clusterId: string, _namespace: string, _name: string): DeploymentNetworkVo {
  const deploy = mockDeployments[0]
  return {
    services: [
      {
        id: generateId(),
        uid: generateId(),
        name: deploy.name + '-svc',
        description: deploy.description || '',
        type: 'ClusterIP',
        clusterIp: '10.96.100.' + Math.floor(Math.random() * 255),
        ports: [{ name: 'http', protocol: 'TCP', port: 80, targetPort: 8080 }],
        selector: { app: deploy.name },
        externalName: '',
        headless: false,
        clusterUid: deploy.clusterUid,
        clusterUid: deploy.clusterUid,
        clusterName: deploy.clusterName,
        namespace: deploy.namespace,
        namespaceId: deploy.namespaceId,
        namespaceUid: deploy.namespaceUid,
        createAt: deploy.createAt,
        createBy: deploy.createBy,
        updateAt: deploy.updateAt,
        updateBy: deploy.updateBy,
      },
      {
        id: generateId(),
        uid: generateId(),
        name: deploy.name + '-nodeport',
        description: 'NodePort exposure for external access',
        type: 'NodePort',
        clusterIp: '10.96.200.' + Math.floor(Math.random() * 255),
        ports: [{ name: 'http', protocol: 'TCP', port: 80, targetPort: 8080, nodePort: 30080 }],
        selector: { app: deploy.name },
        externalName: '',
        headless: false,
        clusterUid: deploy.clusterUid,
        clusterUid: deploy.clusterUid,
        clusterName: deploy.clusterName,
        namespace: deploy.namespace,
        namespaceId: deploy.namespaceId,
        namespaceUid: deploy.namespaceUid,
        createAt: deploy.createAt,
        createBy: deploy.createBy,
        updateAt: deploy.updateAt,
        updateBy: deploy.updateBy,
      },
      {
        id: generateId(),
        uid: generateId(),
        name: deploy.name + '-lb',
        description: 'LoadBalancer for production traffic',
        type: 'LoadBalancer',
        clusterIp: '10.96.50.' + Math.floor(Math.random() * 255),
        ports: [{ name: 'https', protocol: 'TCP', port: 443, targetPort: 8443, nodePort: 30443 }],
        selector: { app: deploy.name },
        externalName: '',
        headless: false,
        clusterUid: deploy.clusterUid,
        clusterUid: deploy.clusterUid,
        clusterName: deploy.clusterName,
        namespace: deploy.namespace,
        namespaceId: deploy.namespaceId,
        namespaceUid: deploy.namespaceUid,
        createAt: deploy.createAt,
        createBy: deploy.createBy,
        updateAt: deploy.updateAt,
        updateBy: deploy.updateBy,
      },
    ],
    ingresses: [
      {
        id: generateId(),
        uid: generateId(),
        name: deploy.name + '-ingress',
        description: 'Ingress rule for ' + deploy.name,
        ingressClassName: 'nginx',
        rules: [
          {
            host: deploy.name + '.example.com',
            paths: [{ path: '/', pathType: 'Prefix', serviceName: deploy.name + '-svc', servicePort: 80 }],
          },
        ],
        clusterUid: deploy.clusterUid,
        clusterUid: deploy.clusterUid,
        clusterName: deploy.clusterName,
        namespace: deploy.namespace,
        namespaceId: deploy.namespaceId,
        namespaceUid: deploy.namespaceUid,
        createAt: deploy.createAt,
        createBy: deploy.createBy,
        updateAt: deploy.updateAt,
        updateBy: deploy.updateBy,
      },
      {
        id: generateId(),
        uid: generateId(),
        name: deploy.name + '-api-ingress',
        description: 'API ingress with TLS termination',
        ingressClassName: 'nginx',
        rules: [
          {
            host: 'api.example.com',
            paths: [{ path: '/v1', pathType: 'Prefix', serviceName: deploy.name + '-svc', servicePort: 8080 }],
          },
        ],
        tls: [{ hosts: ['api.example.com'], secretName: 'api-tls-cert' }],
        clusterUid: deploy.clusterUid,
        clusterUid: deploy.clusterUid,
        clusterName: deploy.clusterName,
        namespace: deploy.namespace,
        namespaceId: deploy.namespaceId,
        namespaceUid: deploy.namespaceUid,
        createAt: deploy.createAt,
        createBy: deploy.createBy,
        updateAt: deploy.updateAt,
        updateBy: deploy.updateBy,
      },
    ],
  }
}

/**
 * 获取 Deployment 存储列表
 * @param _clusterId - 集群 UID
 * @param _namespace - 命名空间
 * @param _name - Deployment 名称
 * @returns 存储列表
 */
function getDeploymentStorageList(_clusterId: string, _namespace: string, _name: string): DeploymentStorageListVo[] {
  return [
    {
      name: 'app-config',
      type: 'ConfigMap',
      extraFields: { configMapName: 'app-config-v3', defaultMode: '420' },
      containerMounts: [
        { containerId: generateId(), container: 'main-container', mountPath: '/etc/config', subPath: '' },
      ],
    },
    {
      name: 'app-secret',
      type: 'Secret',
      extraFields: { secretName: 'app-secret', defaultMode: '400', optional: 'false' },
      containerMounts: [
        { containerId: generateId(), container: 'main-container', mountPath: '/etc/secret', subPath: '' },
        {
          containerId: generateId(),
          container: 'sidecar-container',
          mountPath: '/etc/shared-secret',
          subPath: 'db-password',
        },
      ],
    },
    {
      name: 'app-data',
      type: 'PersistentVolumeClaim',
      extraFields: { claimName: 'app-data-pvc', readOnly: 'false', storageClassName: 'ssd' },
      containerMounts: [{ containerId: generateId(), container: 'main-container', mountPath: '/data', subPath: '' }],
    },
    {
      name: 'app-logs',
      type: 'EmptyDir',
      extraFields: { medium: '', sizeLimit: '1Gi' },
      containerMounts: [
        { containerId: generateId(), container: 'main-container', mountPath: '/var/log/app', subPath: '' },
        { containerId: generateId(), container: 'fluentd-sidecar', mountPath: '/var/log/app', subPath: '' },
      ],
    },
    {
      name: 'host-timezone',
      type: 'HostPath',
      extraFields: { path: '/etc/localtime', type: 'File' },
      containerMounts: [
        { containerId: generateId(), container: 'main-container', mountPath: '/etc/localtime', subPath: '' },
      ],
    },
  ]
}

/**
 * 获取 Deployment 监控数据
 * @param _clusterId - 集群 UID
 * @param _namespace - 命名空间
 * @param _name - Deployment 名称
 * @returns 监控数据
 */
function getDeploymentMonitor(_clusterId: string, _namespace: string, _name: string): DeploymentMonitorVo {
  return {}
}

/**
 * 查看 Deployment YAML
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @returns Deployment YAML 配置
 */
function getDeploymentYaml(clusterUid: string, namespace: string, name: string): string {
  const deployment = mockDeployments.find(
    d => d.clusterUid === clusterUid && d.namespace === namespace && d.name === name,
  )
  if (!deployment) {
    console.error('[Get Deployment Yaml] can not find deployment:', clusterUid, namespace, name)
    return ''
  }

  const mockLabels: Record<string, string> = { app: deployment.name }
  const labels = Object.entries(mockLabels)
    .map(([key, value]) => `      ${key}: "${value}"`)
    .join('\n')

  const mockAnnotations: Record<string, string> = { description: deployment.description || '' }
  const annotations = Object.entries(mockAnnotations)
    .map(([key, value]) => `      ${key}: "${value}"`)
    .join('\n')

  const images = [`${deployment.name}:latest`]
  const containers = images
    .map((image, index) => {
      return `      - name: ${deployment.name}-container-${index}
        image: ${image}
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"
        livenessProbe:
          httpGet:
            path: /
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5`
    })
    .join('\n')

  const yaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${deployment.name}
  namespace: ${deployment.namespace}
  labels:
${labels}
  annotations:
${annotations}
  creationTimestamp: "${deployment.createAt}"
  resourceVersion: "${generateId()}"
  uid: "${generateId()}"
  managedFields:
    - manager: kubectl-client-side-apply
      operation: Update
      apiVersion: apps/v1
      time: "${deployment.updateAt}"
      fieldsType: FieldsV1
      fieldsV1:
        f:metadata:
          f:annotations:
            f:deployment.kubernetes.io/revision: {}
        f:spec:
          f:progressDeadlineSeconds: {}
          f:replicas: {}
          f:revisionHistoryLimit: {}
          f:selector: {}
          f:strategy:
            f:type: {}
          f:template:
            f:metadata:
              f:creationTimestamp: {}
            f:spec:
              f:containers: {}
            f:dnsPolicy: {}
            f:restartPolicy: {}
            f:schedulerName: {}
            f:terminationGracePeriodSeconds: {}
spec:
  replicas: ${deployment.replicas}
  selector:
    matchLabels:
      app: "${deployment.name}"
  strategy:
    type: ${deployment.strategyType}
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
  revisionHistoryLimit: 10
  progressDeadlineSeconds: 600
  template:
    metadata:
      creationTimestamp: "${deployment.createAt}"
      labels:
${labels}
    spec:
      containers:
${containers}
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      schedulerName: default-scheduler
      terminationGracePeriodSeconds: 30
status:
  observedGeneration: 1
  replicas: ${deployment.replicas}
  updatedReplicas: ${deployment.replicas}
  readyReplicas: ${deployment.readyReplicas}
  availableReplicas: ${deployment.readyReplicas}
  conditions:
    - type: Available
      status: "True"
      lastUpdateTime: "${deployment.updateAt}"
      lastTransitionTime: "${deployment.updateAt}"
      reason: MinimumReplicasAvailable
      message: Deployment has minimum availability.
    - type: Progressing
      status: "True"
      lastUpdateTime: "${deployment.updateAt}"
      lastTransitionTime: "${deployment.createAt}"
      reason: NewReplicaSetAvailable
      message: ReplicaSet "${deployment.name}" has successfully progressed.`

  return yaml
}

/**
 * 创建 Deployment
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param data - 创建参数
 */
function createDeployment(clusterUid: string, namespace: string, data: DeploymentCreateForm): void {
  console.log('[Mock] createDeployment', { clusterUid, namespace, data })
}

/**
 * 更新 Deployment
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param data - 更新参数
 */
function updateDeployment(
  clusterUid: string,
  namespace: string,
  name: string,
  data: Partial<DeploymentUpdateForm>,
): void {
  console.log('[Mock] updateDeployment', { clusterUid, namespace, name, data })
}

/**
 * 更新 Deployment 标签
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param data - 标签数据
 */
function manageDeploymentLabels(clusterUid: string, namespace: string, name: string, data: DeploymentLabelForm): void {
  console.log('[Mock] manageDeploymentLabels', { clusterUid, namespace, name, data })
}

/**
 * 更新 Deployment 注解
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param data - 注解数据
 */
function manageDeploymentAnnotations(
  clusterUid: string,
  namespace: string,
  name: string,
  data: DeploymentAnnotationForm,
): void {
  console.log('[Mock] manageDeploymentAnnotations', { clusterUid, namespace, name, data })
}

/**
 * 删除 Deployment
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 */
function deleteDeployment(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] deleteDeployment', { clusterUid, namespace, name })
}

/**
 * 批量删除 Deployment
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param names - Deployment 名称数组
 */
function deleteDeployments(clusterUid: string, namespace: string, names: string[]): void {
  console.log('[Mock] deleteDeployments', { clusterUid, namespace, names })
}

/**
 * 导出 Deployment CSV
 * @param clusterUid - 集群 UID
 * @param params - 查询参数
 */
function exportDeployment(clusterUid: string, params: Partial<DeploymentQueryForm>): void {
  console.log('[Mock] exportDeployment', { clusterUid, params })
}

/**
 * 导入 Deployment
 * @param clusterUid - 集群 UID
 * @param data - YAML 配置
 */
function importDeployment(clusterUid: string, data: DeploymentImportForm): void {
  console.log('[Mock] importDeployment', { clusterUid, data })
}

/**
 * 扩缩容 Deployment
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 * @param data - 扩缩容参数
 */
function scaleDeployment(clusterUid: string, namespace: string, name: string, data: DeploymentScaleForm): void {
  console.log('[Mock] scaleDeployment', { clusterUid, namespace, name, data })
}

/**
 * 重启 Deployment
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 */
function restartDeployment(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] restartDeployment', { clusterUid, namespace, name })
}

/**
 * 回滚 Deployment
 * @param clusterUid - 集群 UID
 * @param namespace - 命名空间
 * @param name - Deployment 名称
 */
function rollbackDeployment(clusterUid: string, namespace: string, name: string): void {
  console.log('[Mock] rollbackDeployment', { clusterUid, namespace, name })
}
