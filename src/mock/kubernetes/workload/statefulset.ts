/**
 * Kubernetes StatefulSet 管理 Mock API
 * @module mock/kubernetes/workload/statefulset
 */
import type { PageVo } from '@/types/common'
import type {
  StatefulSetAdvancedVo,
  StatefulSetAnnotationForm,
  StatefulSetBasicVo,
  StatefulSetConditionVo,
  StatefulSetCreateForm,
  StatefulSetDetailVo,
  StatefulSetEventListVo,
  StatefulSetHistoryRevisionListVo,
  StatefulSetMonitorVo,
  StatefulSetNetworkVo,
  StatefulSetPodListVo,
  StatefulSetStorageListVo,
  StatefulSetUpdateForm,
  StatefulSetLabelForm,
  StatefulSetListVo,
  StatefulSetMetadataVo,
  StatefulSetQueryForm,
  StatefulSetReplicasVo,
  StatefulSetResourceVo,
  StatefulSetScaleForm,
  StatefulSetScheduleVo,
  StatefulSetStrategyVo,
  StatefulSetYamlForm,
} from '@/types/kubernetes/workload/statefulset'

import { generateId } from '@/mock/utils'

/**
 * StatefulSet 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterId/statefulsets - 获取 StatefulSet 分页列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name - 获取 StatefulSet 详情
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/pods - 获取 Pod 列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/schedule - 获取调度策略
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/history - 获取历史版本列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/network - 获取网络资源
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/storages - 获取存储列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/monitor - 获取监控数据
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/events - 获取事件列表
 * - GET /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/yaml - 查看 YAML
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets - 创建 StatefulSet
 * - PUT /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name - 更新 StatefulSet
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/labels - 更新标签
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/annotations - 更新注解
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name - 删除 StatefulSet
 * - DELETE /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/batch - 批量删除
 * - GET /kubernetes/clusters/:clusterId/statefulsets/export - 导出 CSV
 * - POST /kubernetes/clusters/:clusterId/statefulsets/import - 导入 StatefulSet
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/scale - 扩缩容
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/restart - 重启
 * - POST /kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/rollback - 回滚
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/statefulsets',
    handler: (pathParams: Record<string, string>, params: Partial<StatefulSetQueryForm>): PageVo<StatefulSetListVo> =>
      getStatefulSetList(pathParams.clusterId, params),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name',
    handler: (pathParams: Record<string, string>): StatefulSetDetailVo =>
      getStatefulSetDetail(pathParams.clusterId, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/pods',
    handler: (pathParams: Record<string, string>): StatefulSetPodListVo[] =>
      getStatefulSetPodList(pathParams.clusterId, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/schedule',
    handler: (pathParams: Record<string, string>): StatefulSetScheduleVo =>
      getStatefulSetSchedule(pathParams.clusterId, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/history',
    handler: (pathParams: Record<string, string>): StatefulSetHistoryRevisionListVo[] =>
      getStatefulSetHistoryRevisionList(pathParams.clusterId, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/network',
    handler: (pathParams: Record<string, string>): StatefulSetNetworkVo =>
      getStatefulSetNetwork(pathParams.clusterId, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/storages',
    handler: (pathParams: Record<string, string>): StatefulSetStorageListVo[] =>
      getStatefulSetStorageList(pathParams.clusterId, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/monitor',
    handler: (pathParams: Record<string, string>): StatefulSetMonitorVo =>
      getStatefulSetMonitor(pathParams.clusterId, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/events',
    handler: (pathParams: Record<string, string>): StatefulSetEventListVo[] =>
      getStatefulSetEventList(pathParams.clusterId, pathParams.namespace, pathParams.name),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/yaml',
    handler: (pathParams: Record<string, string>): string =>
      getStatefulSetYaml(pathParams.clusterId, pathParams.namespace, pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets',
    handler: (pathParams: Record<string, string>, data: StatefulSetCreateForm): void =>
      createStatefulSet(pathParams.clusterId, pathParams.namespace, data),
  },
  {
    method: 'put',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name',
    handler: (pathParams: Record<string, string>, data: Partial<StatefulSetUpdateForm>): void =>
      updateStatefulSet(pathParams.clusterId, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/labels',
    handler: (pathParams: Record<string, string>, data: StatefulSetLabelForm): void =>
      manageStatefulSetLabels(pathParams.clusterId, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/annotations',
    handler: (pathParams: Record<string, string>, data: StatefulSetAnnotationForm): void =>
      manageStatefulSetAnnotations(pathParams.clusterId, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name',
    handler: (pathParams: Record<string, string>): void =>
      deleteStatefulSet(pathParams.clusterId, pathParams.namespace, pathParams.name),
  },
  {
    method: 'delete',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/batch',
    handler: (pathParams: Record<string, string>, data: string[]): void =>
      deleteStatefulSets(pathParams.clusterId, pathParams.namespace, data),
  },
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterId/statefulsets/export',
    handler: (pathParams: Record<string, string>, params: Partial<StatefulSetQueryForm>): void =>
      exportStatefulSet(pathParams.clusterId, params),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/statefulsets/import',
    handler: (pathParams: Record<string, string>, data: StatefulSetYamlForm): void =>
      importStatefulSet(pathParams.clusterId, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/scale',
    handler: (pathParams: Record<string, string>, data: StatefulSetScaleForm): void =>
      scaleStatefulSet(pathParams.clusterId, pathParams.namespace, pathParams.name, data),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/restart',
    handler: (pathParams: Record<string, string>): void =>
      restartStatefulSet(pathParams.clusterId, pathParams.namespace, pathParams.name),
  },
  {
    method: 'post',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespace/statefulsets/:name/rollback',
    handler: (pathParams: Record<string, string>): void =>
      rollbackStatefulSet(pathParams.clusterId, pathParams.namespace, pathParams.name),
  },
]

/**
 * 获取 StatefulSet 分页列表
 * @param _clusterId - 集群ID（mock 中未使用）
 * @param params - 查询参数
 * @returns 分页数据
 */
function getStatefulSetList(_clusterId: string, params: Partial<StatefulSetQueryForm>): PageVo<StatefulSetListVo> {
  const { id, name, namespace, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockStatefulSets]

  if (status) {
    filtered = filtered.filter(s => s.status === status)
  }
  if (namespace) {
    filtered = filtered.filter(s => s.namespace === namespace)
  }

  if (id || name) {
    let searchFiltered: StatefulSetListVo[] = []
    if (id) {
      searchFiltered = [...searchFiltered, ...filtered.filter(s => s.id === id)]
    }
    if (name) {
      searchFiltered = [...searchFiltered, ...filtered.filter(s => s.name.toLowerCase().includes(name.toLowerCase()))]
    }
    // searchFiltered 基于 id 去重
    const seenIds = new Set<string>()
    filtered = searchFiltered.filter(s => {
      if (seenIds.has(s.id)) return false
      seenIds.add(s.id)
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
 * 获取 StatefulSet 详情
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @returns StatefulSet 详情
 */
function getStatefulSetDetail(_clusterId: string, _namespace: string, _name: string): StatefulSetDetailVo {
  return {
    basic: mockStatefulSetBasic,
    replicas: mockStatefulSetReplicas,
    metadata: mockStatefulSetMetadata,
    resource: mockStatefulSetResource,
    conditions: mockStatefulSetConditions,
    strategy: mockStatefulSetStrategy,
    advanced: mockStatefulSetAdvanced,
  }
}

/**
 * 获取 StatefulSet Pod 列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @returns Pod 列表
 */
function getStatefulSetPodList(_clusterId: string, _namespace: string, _name: string): StatefulSetPodListVo[] {
  const sts = mockStatefulSets[0]
  const nodeName = `${sts.clusterName || 'cluster'}-node`
  const nodeIp = '10.0.1.'
  return [
    {
      id: generateId(),
      uid: generateId(),
      name: `${sts.name}-0`,
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
      clusterId: sts.clusterId,
      clusterUid: generateId(),
      clusterName: sts.clusterName,
      namespace: sts.namespace,
      namespaceId: generateId(),
      namespaceUid: generateId(),
      createAt: sts.createAt,
      createBy: sts.createBy,
      updateAt: sts.updateAt,
      updateBy: sts.updateBy,
    },
    {
      id: generateId(),
      uid: generateId(),
      name: `${sts.name}-1`,
      ip: '10.244.2.',
      status: 'Running',
      statusMsg: 'All containers are running normally',
      restarts: 0,
      nodeIp: `${nodeIp}102`,
      nodeName: `${nodeName}-002`,
      readyContainerCount: 2,
      containerCount: 2,
      cpuUsage: '18%',
      memoryUsage: '41%',
      clusterId: sts.clusterId,
      clusterUid: generateId(),
      clusterName: sts.clusterName,
      namespace: sts.namespace,
      namespaceId: generateId(),
      namespaceUid: generateId(),
      createAt: sts.createAt,
      createBy: sts.createBy,
      updateAt: sts.updateAt,
      updateBy: sts.updateBy,
    },
    {
      id: generateId(),
      uid: generateId(),
      name: `${sts.name}-2`,
      ip: '10.244.3.',
      status: 'Running',
      statusMsg: 'All containers are running normally',
      restarts: 1,
      nodeIp: `${nodeIp}103`,
      nodeName: `${nodeName}-003`,
      readyContainerCount: 2,
      containerCount: 2,
      cpuUsage: '22%',
      memoryUsage: '56%',
      clusterId: sts.clusterId,
      clusterUid: generateId(),
      clusterName: sts.clusterName,
      namespace: sts.namespace,
      namespaceId: generateId(),
      namespaceUid: generateId(),
      createAt: sts.createAt,
      createBy: sts.createBy,
      updateAt: sts.updateAt,
      updateBy: sts.updateBy,
    },
  ]
}

/**
 * 获取 StatefulSet 调度策略
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @returns StatefulSet 调度策略
 */
function getStatefulSetSchedule(clusterId: string, namespace: string, name: string): StatefulSetScheduleVo {
  const sts = mockStatefulSets.find(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (!sts) {
    console.error('[Get StatefulSet Schedule] can not find statefulset:', clusterId, namespace, name)
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
            labelSelector: { matchLabels: { app: sts!.name }, matchExpressions: [] },
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
            labelSelector: { matchLabels: { app: sts!.name }, matchExpressions: [] },
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
 * 获取 StatefulSet 历史版本列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @returns 历史版本列表
 */
function getStatefulSetHistoryRevisionList(
  _clusterId: string,
  _namespace: string,
  _name: string,
): StatefulSetHistoryRevisionListVo[] {
  return [
    {
      revision: 3,
      changeCause: `kubectl set image statefulset/${_name}=${_name}:v2.1.0`,
      createAt: '2024-07-01 14:30:00',
      active: true,
    },
    { revision: 2, changeCause: `kubectl edit statefulset/${_name}`, createAt: '2024-06-20 09:15:00', active: false },
    {
      revision: 1,
      changeCause: `kubectl create statefulset ${_name} --image=${_name}:v1.0.0`,
      createAt: '2024-06-15 08:30:00',
      active: false,
    },
  ]
}

/**
 * 获取 StatefulSet 网络资源
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @returns 网络资源
 */
function getStatefulSetNetwork(_clusterId: string, _namespace: string, _name: string): StatefulSetNetworkVo {
  const sts = mockStatefulSets[0]
  return {
    services: [
      {
        id: generateId(),
        uid: generateId(),
        name: sts.serviceName,
        description: `Headless service for ${sts.name}`,
        type: 'ClusterIP',
        clusterIp: 'None',
        ports: [{ name: 'tcp-db', protocol: 'TCP', port: 3306, targetPort: 3306 }],
        selector: { app: sts.name },
        externalName: '',
        headless: true,
        clusterId: sts.clusterId,
        clusterUid: generateId(),
        clusterName: sts.clusterName,
        namespace: sts.namespace,
        namespaceId: generateId(),
        namespaceUid: generateId(),
        createAt: sts.createAt,
        createBy: sts.createBy,
        updateAt: sts.updateAt,
        updateBy: sts.updateBy,
      },
      {
        id: generateId(),
        uid: generateId(),
        name: sts.name + '-readonly',
        description: 'Read-only access service for read replicas',
        type: 'ClusterIP',
        clusterIp: '10.96.100.' + Math.floor(Math.random() * 255),
        ports: [{ name: 'tcp-db', protocol: 'TCP', port: 3307, targetPort: 3306 }],
        selector: { app: sts.name, role: 'replica' },
        externalName: '',
        headless: false,
        clusterId: sts.clusterId,
        clusterUid: generateId(),
        clusterName: sts.clusterName,
        namespace: sts.namespace,
        namespaceId: generateId(),
        namespaceUid: generateId(),
        createAt: sts.createAt,
        createBy: sts.createBy,
        updateAt: sts.updateAt,
        updateBy: sts.updateBy,
      },
    ],
    ingresses: [],
  }
}

/**
 * 获取 StatefulSet 存储列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @returns 存储列表
 */
function getStatefulSetStorageList(_clusterId: string, _namespace: string, _name: string): StatefulSetStorageListVo[] {
  const sts = mockStatefulSets[0]
  return [
    {
      name: `${sts.name}-data`,
      type: 'PersistentVolumeClaim',
      extraFields: { claimName: `${sts.name}-data-${sts.name}-0`, readOnly: 'false', storageClassName: 'ssd' },
      containerMounts: [
        { containerId: generateId(), container: `${sts.name}-container`, mountPath: '/var/lib/mysql', subPath: '' },
      ],
    },
    {
      name: `${sts.name}-config`,
      type: 'ConfigMap',
      extraFields: { configMapName: `${sts.name}-config`, defaultMode: '420' },
      containerMounts: [
        { containerId: generateId(), container: `${sts.name}-container`, mountPath: '/etc/config', subPath: '' },
      ],
    },
    {
      name: `${sts.name}-secret`,
      type: 'Secret',
      extraFields: { secretName: `${sts.name}-secret`, defaultMode: '400', optional: 'false' },
      containerMounts: [
        { containerId: generateId(), container: `${sts.name}-container`, mountPath: '/etc/secret', subPath: '' },
      ],
    },
    {
      name: `${sts.name}-logs`,
      type: 'EmptyDir',
      extraFields: { medium: '', sizeLimit: '1Gi' },
      containerMounts: [
        { containerId: generateId(), container: `${sts.name}-container`, mountPath: '/var/log/app', subPath: '' },
      ],
    },
  ]
}

/**
 * 获取 StatefulSet 监控数据
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @returns 监控数据
 */
function getStatefulSetMonitor(_clusterId: string, _namespace: string, _name: string): StatefulSetMonitorVo {
  return {}
}

/**
 * 获取 StatefulSet 事件列表
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @returns 事件列表
 */
function getStatefulSetEventList(_clusterId: string, _namespace: string, _name: string): StatefulSetEventListVo[] {
  const sts = mockStatefulSets[0]
  return [
    {
      type: 'Normal',
      reason: 'SuccessfulCreate',
      message: `create Pod ${sts.name}-0 in StatefulSet ${sts.name} successful`,
      involvedObject: { kind: 'StatefulSet', name: sts.name, namespace: sts.namespace, uid: sts.uid },
      source: { component: 'statefulset-controller' },
      count: 1,
      firstTimestamp: sts.createAt,
      lastTimestamp: sts.createAt,
    },
    {
      type: 'Normal',
      reason: 'SuccessfulCreate',
      message: `create Pod ${sts.name}-1 in StatefulSet ${sts.name} successful`,
      involvedObject: { kind: 'StatefulSet', name: sts.name, namespace: sts.namespace, uid: sts.uid },
      source: { component: 'statefulset-controller' },
      count: 1,
      firstTimestamp: sts.createAt,
      lastTimestamp: sts.createAt,
    },
    {
      type: 'Normal',
      reason: 'SuccessfulCreate',
      message: `create Pod ${sts.name}-2 in StatefulSet ${sts.name} successful`,
      involvedObject: { kind: 'StatefulSet', name: sts.name, namespace: sts.namespace, uid: sts.uid },
      source: { component: 'statefulset-controller' },
      count: 1,
      firstTimestamp: sts.createAt,
      lastTimestamp: sts.createAt,
    },
    {
      type: 'Normal',
      reason: 'SuccessfulDelete',
      message: `delete Pod ${sts.name}-0 in StatefulSet ${sts.name} successful`,
      involvedObject: { kind: 'Pod', name: `${sts.name}-0`, namespace: sts.namespace },
      source: { component: 'statefulset-controller' },
      count: 1,
      firstTimestamp: sts.updateAt,
      lastTimestamp: sts.updateAt,
    },
    {
      type: 'Warning',
      reason: 'FailedCreate',
      message: `create Pod ${sts.name}-0 in StatefulSet ${sts.name} failed error: Pod "mysql-primary-2" is invalid: spec: Forbidden: pod updates may not change fields other than...`,
      involvedObject: { kind: 'Pod', name: `${sts.name}-0`, namespace: sts.namespace },
      source: { component: 'statefulset-controller' },
      count: 2,
      firstTimestamp: sts.createAt,
      lastTimestamp: sts.updateAt,
    },
  ]
}

/**
 * 查看 StatefulSet YAML
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @returns StatefulSet YAML 配置
 */
function getStatefulSetYaml(clusterId: string, namespace: string, name: string): string {
  const sts = mockStatefulSets.find(s => s.clusterId === clusterId && s.namespace === namespace && s.name === name)
  if (!sts) {
    console.error('[Get StatefulSet Yaml] can not find statefulset:', clusterId, namespace, name)
    return ''
  }

  const mockLabels: Record<string, string> = { app: sts.name }
  const labels = Object.entries(mockLabels)
    .map(([key, value]) => `      ${key}: "${value}"`)
    .join('\n')

  const mockAnnotations: Record<string, string> = { description: sts.description || '' }
  const annotations = Object.entries(mockAnnotations)
    .map(([key, value]) => `      ${key}: "${value}"`)
    .join('\n')

  const images = [`${sts.name}:latest`]
  const containers = images
    .map((image, index) => {
      return `      - name: ${sts.name}-container-${index}
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
          periodSeconds: 5
        volumeMounts:
        - name: ${sts.name}-data
          mountPath: /var/lib/mysql`
    })
    .join('\n')

  const yaml = `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: ${sts.name}
  namespace: ${sts.namespace}
  labels:
${labels}
  annotations:
${annotations}
  creationTimestamp: "${sts.createAt}"
  resourceVersion: "${generateId()}"
  uid: "${generateId()}"
spec:
  serviceName: ${sts.serviceName}
  replicas: ${sts.replicas}
  podManagementPolicy: ${sts.podManagementPolicy}
  updateStrategy:
    type: ${sts.strategyType}
  selector:
    matchLabels:
      app: "${sts.name}"
  revisionHistoryLimit: 10
  template:
    metadata:
      creationTimestamp: "${sts.createAt}"
      labels:
${labels}
    spec:
      containers:
${containers}
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      schedulerName: default-scheduler
      terminationGracePeriodSeconds: 30
  volumeClaimTemplates:
    - metadata:
        name: ${sts.name}-data
      spec:
        accessModes:
        - ReadWriteOnce
        resources:
          requests:
            storage: "10Gi"
        storageClassName: ssd
status:
  observedGeneration: 1
  replicas: ${sts.replicas}
  readyReplicas: ${sts.readyReplicas}
  currentReplicas: ${sts.readyReplicas}
  updatedReplicas: ${sts.readyReplicas}
  currentRevision: ${sts.name}-6d4f8c9b7
  updateRevision: ${sts.name}-6d4f8c9b7
  conditions:
    - type: Available
      status: "True"
      lastUpdateTime: "${sts.updateAt}"
      lastTransitionTime: "${sts.updateAt}"
      reason: MinimumReplicasAvailable
      message: StatefulSet has minimum availability.
    - type: Progressing
      status: "True"
      lastUpdateTime: "${sts.updateAt}"
      lastTransitionTime: "${sts.createAt}"
      reason: NewReplicaSetAvailable
      message: StatefulSet "${sts.name}" has successfully progressed.`

  return yaml
}

/**
 * 创建 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param data - 创建参数
 */
function createStatefulSet(clusterId: string, namespace: string, data: StatefulSetCreateForm): void {
  console.log('[Mock] createStatefulSet', { clusterId, namespace, data })
}

/**
 * 更新 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @param data - 更新参数
 */
function updateStatefulSet(
  clusterId: string,
  namespace: string,
  name: string,
  data: Partial<StatefulSetUpdateForm>,
): void {
  console.log('[Mock] updateStatefulSet', { clusterId, namespace, name, data })
}

/**
 * 更新 StatefulSet 标签
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @param data - 标签数据
 */
function manageStatefulSetLabels(clusterId: string, namespace: string, name: string, data: StatefulSetLabelForm): void {
  console.log('[Mock] manageStatefulSetLabels', { clusterId, namespace, name, data })
}

/**
 * 更新 StatefulSet 注解
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @param data - 注解数据
 */
function manageStatefulSetAnnotations(
  clusterId: string,
  namespace: string,
  name: string,
  data: StatefulSetAnnotationForm,
): void {
  console.log('[Mock] manageStatefulSetAnnotations', { clusterId, namespace, name, data })
}

/**
 * 删除 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 */
function deleteStatefulSet(clusterId: string, namespace: string, name: string): void {
  console.log('[Mock] deleteStatefulSet', { clusterId, namespace, name })
}

/**
 * 批量删除 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param names - StatefulSet 名称数组
 */
function deleteStatefulSets(clusterId: string, namespace: string, names: string[]): void {
  console.log('[Mock] deleteStatefulSets', { clusterId, namespace, names })
}

/**
 * 导出 StatefulSet CSV
 * @param clusterId - 集群ID
 * @param params - 查询参数
 */
function exportStatefulSet(clusterId: string, params: Partial<StatefulSetQueryForm>): void {
  console.log('[Mock] exportStatefulSet', { clusterId, params })
}

/**
 * 导入 StatefulSet
 * @param clusterId - 集群ID
 * @param data - YAML 配置
 */
function importStatefulSet(clusterId: string, data: StatefulSetYamlForm): void {
  console.log('[Mock] importStatefulSet', { clusterId, data })
}

/**
 * 扩缩容 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 * @param data - 扩缩容参数
 */
function scaleStatefulSet(clusterId: string, namespace: string, name: string, data: StatefulSetScaleForm): void {
  console.log('[Mock] scaleStatefulSet', { clusterId, namespace, name, data })
}

/**
 * 重启 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 */
function restartStatefulSet(clusterId: string, namespace: string, name: string): void {
  console.log('[Mock] restartStatefulSet', { clusterId, namespace, name })
}

/**
 * 回滚 StatefulSet
 * @param clusterId - 集群ID
 * @param namespace - 命名空间
 * @param name - StatefulSet 名称
 */
function rollbackStatefulSet(clusterId: string, namespace: string, name: string): void {
  console.log('[Mock] rollbackStatefulSet', { clusterId, namespace, name })
}

/**
 * 模拟 StatefulSet 数据
 * @remarks 20 条数据覆盖全部 10 种状态
 */
const mockStatefulSets: StatefulSetListVo[] = [
  // ==================== Running（运行中）- 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'mysql-primary',
    namespace: 'data',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'MySQL 主库集群，负责核心业务数据的读写操作',
    status: 'Running',
    replicas: 3,
    readyReplicas: 3,
    serviceName: 'mysql-primary-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-01-20 10:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-15 14:00:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'mongodb',
    namespace: 'data',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'MongoDB 副本集，承载文档型业务数据存储',
    status: 'Running',
    replicas: 3,
    readyReplicas: 3,
    serviceName: 'mongodb-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-02-01 09:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-10 11:00:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'kafka',
    namespace: 'middleware',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'Kafka 消息队列集群，处理异步消息和事件流',
    status: 'Running',
    replicas: 3,
    readyReplicas: 3,
    serviceName: 'kafka-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-02-15 10:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-15 12:00:00',
  },
  // ==================== Available（部分就绪）- 3 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'mysql-replica',
    namespace: 'data',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'MySQL 从库集群，提供读写分离的读流量承载',
    status: 'Available',
    replicas: 3,
    readyReplicas: 3,
    serviceName: 'mysql-replica-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-01-20 10:05:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-15 14:05:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'redis-cluster',
    namespace: 'data',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'Redis Cluster 集群，提供分布式缓存服务',
    status: 'Available',
    replicas: 6,
    readyReplicas: 6,
    serviceName: 'redis-cluster-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-02-05 14:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-12 10:00:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'minio',
    namespace: 'storage',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'MinIO 对象存储集群，提供 S3 兼容的文件存储',
    status: 'Available',
    replicas: 4,
    readyReplicas: 4,
    serviceName: 'minio-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'Parallel',
    createBy: 'admin',
    createAt: '2024-02-20 11:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-18 15:00:00',
  },
  // ==================== Stopped（已停止）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'zookeeper',
    namespace: 'middleware',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'Zookeeper 分布式协调服务，已缩容停止',
    status: 'Stopped',
    statusMessage: '副本已缩容至 0，服务已停止',
    replicas: 3,
    readyReplicas: 0,
    serviceName: 'zookeeper-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-02-10 08:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-08 09:00:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'nexus-oss',
    namespace: 'middleware',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'Nexus 私有制品仓库，暂不使用时缩容停止',
    status: 'Stopped',
    statusMessage: '维护窗口期间暂停服务',
    replicas: 1,
    readyReplicas: 0,
    serviceName: 'nexus-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-03-10 10:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-20 09:30:00',
  },
  // ==================== Creating（创建中）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'clickhouse',
    namespace: 'data',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'ClickHouse 分析型数据库，用于实时 OLAP 查询',
    status: 'Creating',
    statusMessage: 'Pod 正在创建中，等待持久卷绑定',
    replicas: 3,
    readyReplicas: 0,
    serviceName: 'clickhouse-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-03-19 16:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-19 16:00:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'postgresql-primary',
    namespace: 'data',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'PostgreSQL 主数据库集群，迁移中新建',
    status: 'Creating',
    statusMessage: '容器镜像拉取中，等待数据库初始化完成',
    replicas: 3,
    readyReplicas: 0,
    serviceName: 'postgresql-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-03-20 14:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-20 14:00:00',
  },
  // ==================== Updating（更新中）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'elasticsearch',
    namespace: 'logging',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'Elasticsearch 日志存储和全文检索集群',
    status: 'Updating',
    statusMessage: '滚动更新进行中，旧版本 Pod 正在被逐步替换',
    replicas: 3,
    readyReplicas: 1,
    serviceName: 'elasticsearch-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-03-01 09:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-19 16:00:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'nacos-cluster',
    namespace: 'middleware',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'Nacos 注册中心和配置管理集群',
    status: 'Updating',
    statusMessage: '正在升级至 2.3.0 版本，数据库迁移进行中',
    replicas: 3,
    readyReplicas: 2,
    serviceName: 'nacos-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-02-28 10:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-20 10:00:00',
  },
  // ==================== Terminating（终止中）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'neo4j',
    namespace: 'data',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'Neo4j 图数据库，用于知识图谱存储',
    status: 'Terminating',
    statusMessage: '正在删除 Pod，等待数据备份完成',
    replicas: 3,
    readyReplicas: 0,
    serviceName: 'neo4j-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-01-15 09:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-20 11:00:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'jaeger',
    namespace: 'monitoring',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'Jaeger 分布式链路追踪后端存储',
    status: 'Terminating',
    statusMessage: 'Finalizer 清理延迟，等待存储卷回收',
    replicas: 2,
    readyReplicas: 0,
    serviceName: 'jaeger-headless',
    strategyType: 'OnDelete',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-02-05 08:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-18 10:00:00',
  },
  // ==================== CreateTimeout（创建超时）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'cassandra',
    namespace: 'data',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'Cassandra 分布式 NoSQL 数据库集群',
    status: 'CreateTimeout',
    statusMessage: '创建超时：节点资源不足，Pod 无法完成调度',
    replicas: 3,
    readyReplicas: 0,
    serviceName: 'cassandra-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-03-20 08:30:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-20 09:00:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'timescaledb',
    namespace: 'data',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'TimescaleDB 时序数据库，用于 IoT 数据存储',
    status: 'CreateTimeout',
    statusMessage: '超过 15 分钟未完成创建，存储类配置不匹配',
    replicas: 2,
    readyReplicas: 0,
    serviceName: 'timescaledb-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'developer',
    createAt: '2024-03-19 10:00:00',
    updateBy: 'developer',
    deletable: true,
    updateAt: '2024-03-19 10:15:00',
  },
  // ==================== UpdateTimeout（更新超时）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'hadoop-datanode',
    namespace: 'data',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'Hadoop DataNode 集群，负责 HDFS 数据存储',
    status: 'UpdateTimeout',
    statusMessage: '滚动更新超时，数据块迁移耗时长于预期',
    replicas: 5,
    readyReplicas: 3,
    serviceName: 'hadoop-datanode-headless',
    strategyType: 'OnDelete',
    podManagementPolicy: 'Parallel',
    createBy: 'admin',
    createAt: '2024-01-10 09:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-20 13:00:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'etcd-cluster',
    namespace: 'middleware',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'Etcd 分布式键值存储，Kubernetes 控制面依赖',
    status: 'UpdateTimeout',
    statusMessage: '更新超时：raft 共识协议导致滚动更新超过预期窗口',
    replicas: 5,
    readyReplicas: 4,
    serviceName: 'etcd-headless',
    strategyType: 'OnDelete',
    podManagementPolicy: 'OrderedReady',
    createBy: 'system',
    createAt: '2024-01-01 00:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-20 15:30:00',
  },
  // ==================== Failed（失败异常）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'rabbitmq',
    namespace: 'middleware',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'RabbitMQ 消息队列集群，处理业务异步任务',
    status: 'Failed',
    statusMessage: 'Pod 启动失败：磁盘空间不足，持久卷写入异常',
    replicas: 3,
    readyReplicas: 0,
    serviceName: 'rabbitmq-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-02-10 14:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-19 08:00:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'influxdb',
    namespace: 'monitoring',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'InfluxDB 时间序列数据库，存储监控指标数据',
    status: 'Failed',
    statusMessage: 'OOMKilled：内存配置不足导致所有 Pod 被杀死',
    replicas: 2,
    readyReplicas: 0,
    serviceName: 'influxdb-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-02-20 10:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-18 06:00:00',
  },
  // ==================== Unknown（未知）- 2 条 ====================
  {
    id: generateId(),
    uid: generateId(),
    name: 'consul',
    namespace: 'middleware',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'Consul 服务发现和配置中心集群',
    status: 'Unknown',
    statusMessage: '无法获取 StatefulSet 状态，集群网络分区可能中断',
    replicas: 3,
    readyReplicas: 0,
    serviceName: 'consul-headless',
    strategyType: 'RollingUpdate',
    podManagementPolicy: 'OrderedReady',
    createBy: 'admin',
    createAt: '2024-01-05 09:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-03-20 16:30:00',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'greenplum',
    namespace: 'data',
    namespaceId: generateId(),
    namespaceUid: generateId(),
    clusterId: generateId(),
    clusterUid: generateId(),
    description: 'Greenplum MPP 数据仓库集群',
    status: 'Unknown',
    statusMessage: 'Master Pod 失联，暂时无法确认集群整体状态',
    replicas: 4,
    readyReplicas: 0,
    serviceName: 'greenplum-headless',
    strategyType: 'OnDelete',
    podManagementPolicy: 'Parallel',
    createBy: 'admin',
    createAt: '2024-04-01 10:00:00',
    updateBy: 'admin',
    deletable: true,
    updateAt: '2024-04-01 10:00:00',
  },
]

/**
 * StatefulSet 详情模拟数据 - 基础信息
 */
const mockStatefulSetBasic: StatefulSetBasicVo = {
  id: generateId(),
  uid: generateId(),
  name: 'mysql-primary',
  description: 'MySQL 主库集群，负责核心业务数据的读写操作',
  status: 'Running',
  statusMsg: '',
  deletation: 'true',
  generation: 1,
  selector: {
    'app': 'mysql-primary',
    'app.kubernetes.io/name': 'mysql-primary',
    'app.kubernetes.io/instance': 'mysql-primary',
    'app.kubernetes.io/component': 'database',
    'app.kubernetes.io/managed-by': 'bee-kube',
  },
  serviceName: 'mysql-primary-headless',
  currentRevision: 'mysql-primary-6d4f8c9b7',
  updateRevision: 'mysql-primary-6d4f8c9b7',
  clusterId: generateId(),
  clusterUid: generateId(),
  clusterName: 'prod-cluster',
  namespace: 'data',
  namespaceId: generateId(),
  namespaceUid: generateId(),
  createAt: '2024-01-20 10:00:00',
  createBy: 'admin',
  updateAt: '2024-03-15 14:00:00',
  updateBy: 'admin',
}

/**
 * StatefulSet 详情模拟数据 - 副本信息
 */
const mockStatefulSetReplicas: StatefulSetReplicasVo = {
  replicas: 3,
  readyReplicas: 3,
  availableReplicas: 3,
  updatedReplicas: 3,
}

/**
 * StatefulSet 详情模拟数据 - 元数据信息
 */
const mockStatefulSetMetadata: StatefulSetMetadataVo = {
  labels: {
    'app': 'mysql-primary',
    'app.kubernetes.io/name': 'mysql-primary',
    'app.kubernetes.io/instance': 'mysql-primary',
    'app.kubernetes.io/component': 'database',
    'app.kubernetes.io/managed-by': 'bee-kube',
  },
  annotations: {
    'description': 'MySQL 主库集群，负责核心业务数据的读写操作',
    'kubernetes.io/change-cause': 'kubectl apply',
    'statefulset.kubernetes.io/revision': '3',
    'meta.helm.sh/release-name': 'mysql-primary',
    'meta.helm.sh/release-namespace': 'data',
  },
}

/**
 * StatefulSet 详情模拟数据 - 资源信息
 */
const mockStatefulSetResource: StatefulSetResourceVo = {
  request: { cpu: 500, memory: 1073741824 },
  limit: { cpu: 2000, memory: 2147483648 },
}

/**
 * StatefulSet 详情模拟数据 - 条件列表
 */
const mockStatefulSetConditions: StatefulSetConditionVo[] = [
  {
    type: 'Available',
    status: 'True',
    reason: 'MinimumReplicasAvailable',
    message: 'StatefulSet has minimum availability.',
    lastTransitionTime: '2024-03-15 14:00:00',
    lastUpdateTime: '2024-03-15 14:00:00',
  },
  {
    type: 'Progressing',
    status: 'True',
    reason: 'NewReplicaSetAvailable',
    message: 'StatefulSet "mysql-primary" has successfully progressed.',
    lastTransitionTime: '2024-01-20 10:00:00',
    lastUpdateTime: '2024-03-15 14:00:00',
  },
  {
    type: 'Available',
    status: 'False',
    reason: 'MinimumReplicasUnavailable',
    message: 'StatefulSet does not have minimum availability.',
    lastTransitionTime: '2024-01-20 10:00:00',
    lastUpdateTime: '2024-01-20 10:00:00',
  },
  {
    type: 'Progressing',
    status: 'False',
    reason: 'NewStatefulSetCreated',
    message: 'StatefulSet "mysql-primary" is progressing.',
    lastTransitionTime: '2024-01-20 10:00:00',
    lastUpdateTime: '2024-01-20 10:00:00',
  },
  {
    type: 'ReplicaFailure',
    status: 'False',
    reason: 'FailedCreate',
    message: 'Replica has been created successfully.',
    lastTransitionTime: '2024-01-20 10:00:00',
    lastUpdateTime: '2024-03-15 14:00:00',
  },
]

/**
 * StatefulSet 详情模拟数据 - 更新策略
 */
const mockStatefulSetStrategy: StatefulSetStrategyVo = {
  type: 'RollingUpdate',
  partition: 0,
  podManagementPolicy: 'OrderedReady',
}

/**
 * StatefulSet 详情模拟数据 - 高级配置
 */
const mockStatefulSetAdvanced: StatefulSetAdvancedVo = {
  restartPolicy: 'Always',
  terminationGracePeriodSeconds: 30,
  hostNetwork: false,
  dnsPolicy: 'ClusterFirst',
  serviceAccountName: 'mysql-database-service-account',
  automountServiceAccountToken: true,
  hostname: 'mysql-primary-0',
  subdomain: 'mysql-primary-headless',
  imagePullSecrets: ['registry-harbor-secret'],
  priorityClass: 'high-priority',
}
