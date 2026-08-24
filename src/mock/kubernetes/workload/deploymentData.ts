/**
 * Kubernetes Deployment 模拟数据
 * @module mock/kubernetes/workload/deploymentData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type { PodListVo } from '@/types/kubernetes/pod'
import type {
  DeploymentDetailVo,
  DeploymentHistoryRevisionListVo,
  DeploymentIngressListVo,
  DeploymentListVo,
  DeploymentServiceListVo,
  DeploymentYamlVo,
} from '@/types/kubernetes/workload/deployment'

import { generateId } from '@/mock/utils'

/**
 * 模拟 Deployment 列表数据
 * @remarks 包含系统组件、应用服务、监控组件等多种类型的 Deployment，覆盖 Running、Available、Stopped、Creating、Updating、Terminating、CreateTimeout、UpdateTimeout、Failed、Unknown 等状态
 */
export const mockDeployments: DeploymentListVo[] = [
  // ==================== Running（运行中）- 3 条 ====================
  {
    uid: generateId(),
    name: 'nginx-ingress-controller',
    namespace: 'kube-system',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'system-cluster',
    description:
      'Kubernetes Ingress 控制器，管理集群七层流量入口和路由规则。Kubernetes Ingress 控制器，管理集群七层流量入口和路由规则。Kubernetes Ingress 控制器，管理集群七层流量入口和路由规则',
    status: 'Running',
    replicas: 3,
    readyReplicas: 3,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-01-15 10:30:25',
    createBy: 'admin',
    updateAt: '2024-03-20 14:22:18',
    updateBy: 'admin',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'coredns',
    namespace: 'kube-system',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'system-cluster',
    description: 'Kubernetes 集群 DNS 服务，负责集群内部域名解析',
    status: 'Running',
    replicas: 2,
    readyReplicas: 2,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-01-15 10:30:30',
    createBy: 'system',
    updateAt: '2024-03-19 16:45:30',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'metrics-server',
    namespace: 'kube-system',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'system-cluster',
    description: 'Kubernetes 资源指标采集服务，为 HPA 和 kubectl top 提供 CPU/内存数据',
    status: 'Running',
    replicas: 1,
    readyReplicas: 1,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-01-20 11:00:00',
    createBy: 'admin',
    updateAt: '2024-03-18 14:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  // ==================== Available（部分就绪）- 3 条 ====================
  {
    uid: generateId(),
    name: 'frontend-app',
    namespace: 'app-frontend',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'prod-cluster',
    description: '前端应用服务，承载 Web 前端页面和 H5 渲染',
    status: 'Available',
    replicas: 5,
    readyReplicas: 5,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-02-01 08:00:00',
    createBy: 'developer',
    updateAt: '2024-03-20 10:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'backend-api',
    namespace: 'app-backend',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'prod-cluster',
    description: '后端 API 服务，提供核心业务逻辑和数据接口',
    status: 'Available',
    replicas: 10,
    readyReplicas: 10,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-02-01 08:05:00',
    createBy: 'developer',
    updateAt: '2024-03-20 11:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'order-service',
    namespace: 'app-backend',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'prod-cluster',
    description: '订单服务，管理订单的创建、流转和履约',
    status: 'Available',
    replicas: 6,
    readyReplicas: 6,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-02-15 10:05:00',
    createBy: 'developer',
    updateAt: '2024-03-18 14:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  // ==================== Stopped（已停止）- 2 条 ====================
  {
    uid: generateId(),
    name: 'staging-frontend',
    namespace: 'staging-app',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'staging-cluster',
    description: '预发布前端应用，用于生产上线前的集成验证',
    status: 'Stopped',
    statusMsg: '副本已缩容至 0，服务已停止',
    replicas: 2,
    readyReplicas: 0,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-02-15 10:20:00',
    createBy: 'developer',
    updateAt: '2024-03-19 15:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'dev-app',
    namespace: 'dev-test',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'dev-cluster',
    description: '开发环境应用，用于日常开发和单元测试',
    status: 'Stopped',
    statusMsg: '开发环境已暂停，副本缩容为 0',
    replicas: 1,
    readyReplicas: 0,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-03-01 09:00:00',
    createBy: 'developer',
    updateAt: '2024-03-20 16:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  // ==================== Creating（创建中）- 2 条 ====================
  {
    uid: generateId(),
    name: 'api-gateway',
    namespace: 'app-backend',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'prod-cluster',
    description: 'API 网关服务，统一管理和路由所有后端接口请求',
    status: 'Creating',
    statusMsg: 'Pod 正在创建中，等待容器就绪',
    replicas: 3,
    readyReplicas: 1,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-03-19 14:00:00',
    createBy: 'developer',
    updateAt: '2024-03-19 14:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'search-service',
    namespace: 'app-backend',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'prod-cluster',
    description: '全文检索服务，基于 Elasticsearch 提供高性能搜索能力',
    status: 'Creating',
    statusMsg: '容器镜像正在拉取，Pod 初始化中',
    replicas: 2,
    readyReplicas: 0,
    updateStrategyType: 'Recreate',
    createAt: '2024-03-20 09:30:00',
    createBy: 'developer',
    updateAt: '2024-03-20 09:30:00',
    updateBy: 'admin',
    deletable: true,
  },
  // ==================== Updating（更新中）- 2 条 ====================
  {
    uid: generateId(),
    name: 'user-service',
    namespace: 'app-backend',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'prod-cluster',
    description: '用户服务，管理用户资料、会员和账户信息',
    status: 'Updating',
    statusMsg: '滚动更新进行中，旧版本 Pod 正在被逐步替换',
    replicas: 8,
    readyReplicas: 5,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-02-15 10:00:00',
    createBy: 'developer',
    updateAt: '2024-03-19 16:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'notification-service',
    namespace: 'app-backend',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'prod-cluster',
    description: '消息推送服务，处理短信、邮件和站内信的批量发送',
    status: 'Updating',
    statusMsg: '更新中，新版本 Pod 健康检查尚未通过',
    replicas: 4,
    readyReplicas: 2,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-02-20 09:00:00',
    createBy: 'developer',
    updateAt: '2024-03-20 15:30:00',
    updateBy: 'admin',
    deletable: true,
  },
  // ==================== Terminating（终止中）- 2 条 ====================
  {
    uid: generateId(),
    name: 'prometheus',
    namespace: 'monitoring',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'monitoring-cluster',
    description: 'Prometheus 监控系统，采集和存储集群与应用指标数据',
    status: 'Terminating',
    statusMsg: '正在删除 Pod，等待资源回收',
    replicas: 2,
    readyReplicas: 0,
    updateStrategyType: 'Recreate',
    createAt: '2024-02-10 14:20:00',
    createBy: 'admin',
    updateAt: '2024-03-15 09:30:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'grafana',
    namespace: 'monitoring',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'monitoring-cluster',
    description: 'Grafana 可视化平台，提供监控面板和告警图表展示',
    status: 'Terminating',
    statusMsg: 'Finalizer 未清理，删除流程阻塞中',
    replicas: 1,
    readyReplicas: 0,
    updateStrategyType: 'Recreate',
    createAt: '2024-02-10 14:25:00',
    createBy: 'admin',
    updateAt: '2024-03-15 09:35:00',
    updateBy: 'admin',
    deletable: true,
  },
  // ==================== CreateTimeout（创建超时）- 2 条 ====================
  {
    uid: generateId(),
    name: 'config-center',
    namespace: 'staging-app',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'staging-cluster',
    description: '配置中心服务，统一管理各应用的运行时配置',
    status: 'CreateTimeout',
    statusMsg: '创建超时：节点资源不足，Pod 无法调度',
    replicas: 2,
    readyReplicas: 0,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-03-20 08:00:00',
    createBy: 'developer',
    updateAt: '2024-03-20 10:30:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'data-sync',
    namespace: 'staging-app',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'staging-cluster',
    description: '数据同步服务，负责跨环境数据定时同步和校验',
    status: 'CreateTimeout',
    statusMsg: '超过 10 分钟未完成创建，镜像仓库连接超时',
    replicas: 3,
    readyReplicas: 0,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-03-19 17:00:00',
    createBy: 'developer',
    updateAt: '2024-03-19 17:12:00',
    updateBy: 'admin',
    deletable: true,
  },
  // ==================== UpdateTimeout（更新超时）- 2 条 ====================
  {
    uid: generateId(),
    name: 'payment-service',
    namespace: 'app-backend',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'prod-cluster',
    description: '支付服务，处理交易、退款和对账流程',
    status: 'UpdateTimeout',
    statusMsg: '滚动更新超时，新版本 Pod 健康检查持续失败',
    replicas: 4,
    readyReplicas: 1,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-02-15 10:10:00',
    createBy: 'developer',
    updateAt: '2024-03-20 08:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'redis-cache',
    namespace: 'app-backend',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'prod-cluster',
    description: 'Redis 缓存服务，提供高性能内存数据缓存',
    status: 'UpdateTimeout',
    statusMsg: '更新超时：持久化数据迁移耗时超过预期',
    replicas: 3,
    readyReplicas: 2,
    updateStrategyType: 'Recreate',
    createAt: '2024-02-15 10:15:00',
    createBy: 'developer',
    updateAt: '2024-03-17 11:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  // ==================== Failed（失败异常）- 2 条 ====================
  {
    uid: generateId(),
    name: 'log-collector',
    namespace: 'monitoring',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'monitoring-cluster',
    description: '日志采集服务，统一收集和转发各应用日志到日志平台',
    status: 'Failed',
    statusMsg: '所有 Pod 启动失败，CrashLoopBackOff',
    replicas: 2,
    readyReplicas: 0,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-02-28 08:00:00',
    createBy: 'admin',
    updateAt: '2024-03-20 16:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'staging-backend',
    namespace: 'staging-app',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'staging-cluster',
    description: '预发布后端应用，用于接口联调和回归测试',
    status: 'Failed',
    statusMsg: '部署失败：OOMKilled，内存不足导致 Pod 被杀死',
    replicas: 2,
    readyReplicas: 0,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-02-15 10:25:00',
    createBy: 'developer',
    updateAt: '2024-03-19 15:05:00',
    updateBy: 'admin',
    deletable: true,
  },
  // ==================== Unknown（未知）- 2 条 ====================
  {
    uid: generateId(),
    name: 'report-service',
    namespace: 'app-backend',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'prod-cluster',
    description: '报表服务，定时生成和导出业务数据报表',
    status: 'Unknown',
    statusMsg: '无法获取 Deployment 状态，API Server 连接异常',
    replicas: 3,
    readyReplicas: 0,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-01-20 10:00:00',
    createBy: 'developer',
    updateAt: '2024-03-20 17:00:00',
    updateBy: 'admin',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'sentinel-dashboard',
    namespace: 'monitoring',
    namespaceUid: generateId(),
    clusterUid: generateId(),
    cluster: 'monitoring-cluster',
    description: 'Sentinel 流量控制面板，提供限流、熔断规则管理',
    status: 'Unknown',
    statusMsg: '状态信息丢失，可能与 Etcd 连接中断有关',
    replicas: 1,
    readyReplicas: 0,
    updateStrategyType: 'RollingUpdate',
    createAt: '2024-03-01 14:00:00',
    createBy: 'admin',
    updateAt: '2024-03-20 10:00:00',
    updateBy: 'admin',
    deletable: true,
  },
]

/**
 * Deployment 详情模拟数据
 * @remarks 嵌套组合结构，对应 DeploymentDetailVo
 */
export const mockDeploymentDetail: DeploymentDetailVo = {
  uid: generateId(),
  clusterUid: generateId(),
  cluster: 'system-cluster',
  namespaceUid: generateId(),
  namespace: 'kube-system',
  description:
    'Kubernetes Ingress 控制器，管理集群七层流量入口和路由规则。Kubernetes Ingress 控制器，管理集群七层流量入口和路由规则，Kubernetes Ingress 控制器，管理集群七层流量入口和路由规则。Kubernetes Ingress 控制器，管理集群七层流量入口和路由规则',
  status: 'Running',
  statusMsg: '',
  labels: {
    'app': 'nginx-ingress-controller',
    'app.kubernetes.io/name': 'nginx-ingress-controller',
    'app.kubernetes.io/instance': 'nginx-ingress-controller',
    'app.kubernetes.io/component': 'kube-system',
    'app.kubernetes.io/managed-by': 'bee-kube',
  },
  annotations: {
    'description': 'Kubernetes Ingress 控制器，管理集群七层流量入口和路由规则',
    'kubernetes.io/change-cause': 'kubectl apply',
    'deployment.kubernetes.io/revision': '3',
    'meta.helm.sh/release-name': 'nginx-ingress-controller',
    'meta.helm.sh/release-namespace': 'kube-system',
  },
  name: 'nginx-ingress-controller',
  resourceVersion: '123456',
  generation: 1,
  deletionTimestamp: '',
  ownerReferences: [],
  finalizers: [],
  spec: {
    replicas: 3,
    selector: {
      matchLabels: {
        app: 'nginx-ingress-controller',
      },
      matchExpressions: [],
    },
    strategy: {
      type: 'RollingUpdate',
      rollingUpdate: {
        maxUnavailable: '25%',
        maxSurge: '25%',
      },
    },
    minReadySeconds: 0,
    revisionHistoryLimit: 10,
    paused: false,
    progressDeadlineSeconds: 600,
    template: {
      metadata: {
        labels: {
          app: 'nginx-ingress-controller',
        },
        annotations: {
          description: 'Kubernetes Ingress 控制器，管理集群七层流量入口和路由规则',
        },
      },
      spec: {
        volumes: [],
        initContainers: [],
        containers: [
          {
            name: 'nginx-ingress-controller',
            image: 'registry.k8s.io/ingress-nginx/controller:v1.9.0',
            ports: [
              {
                name: 'http',
                hostPort: 0,
                containerPort: 80,
                hostIP: '',
              },
              {
                name: 'https',
                hostPort: 0,
                containerPort: 443,
                hostIP: '',
              },
            ],
            resources: {
              request: {
                cpu: { value: 200, unit: 'm' },
                memory: { value: 256, unit: 'Mi' },
              },
              limit: {
                cpu: { value: 1000, unit: 'm' },
                memory: { value: 512, unit: 'Mi' },
              },
            },
            volumeMounts: [],
            imagePullPolicy: 'IfNotPresent',
          },
        ],
        restartPolicy: 'Always',
        terminationGracePeriodSeconds: 30,
        dnsPolicy: 'ClusterFirst',
        nodeSelector: {},
        serviceAccountName: 'nginx-ingress-service-account',
        hostNetwork: false,
        hostPID: false,
        imagePullSecrets: ['registry-harbor-secret', 'dockerhub-registry-secret'],
      },
    },
  },
  statusObj: {
    observedGeneration: 1,
    replicas: 3,
    updatedReplicas: 3,
    readyReplicas: 2,
    availableReplicas: 2,
    unavailableReplicas: 1,
    terminatingReplicas: 0,
    conditions: [
      {
        type: 'Available',
        status: 'True',
        reason: 'MinimumReplicasAvailable',
        message: 'Deployment has minimum availability.',
        lastTransitionTime: '2024-03-20 14:22:18',
      },
      {
        type: 'Progressing',
        status: 'True',
        reason: 'NewReplicaSetAvailable',
        message: 'ReplicaSet "nginx-ingress-controller" has successfully progressed.',
        lastTransitionTime: '2024-01-15 10:30:25',
      },
    ],
    collisionCount: 0,
  },
  createAt: '2024-01-15 10:30:25',
  createBy: 'admin',
  updateAt: '2024-03-20 14:22:18',
  updateBy: 'admin',
  deletable: false,
}

/**
 * Deployment YAML 模拟数据
 * @remarks 对应 DeploymentYamlVo，返回 nginx-ingress-controller 的完整 YAML 文本
 */
export const mockDeploymentYaml: DeploymentYamlVo = {
  yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-ingress-controller
  namespace: kube-system
  labels:
    app.kubernetes.io/name: nginx-ingress-controller
    app.kubernetes.io/managed-by: bee-kube
  annotations:
    kubernetes.io/change-cause: kubectl apply
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx-ingress-controller
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
  template:
    metadata:
      labels:
        app: nginx-ingress-controller
    spec:
      containers:
        - name: nginx-ingress-controller
          image: registry.k8s.io/ingress-nginx/controller:v1.9.0
          ports:
            - containerPort: 80
            - containerPort: 443
          resources:
            requests:
              cpu: 200m
              memory: 256Mi
            limits:
              cpu: 1000m
              memory: 512Mi
`,
}

/** Deployment 关联 Pod 列表 mock 数据 */
export const mockDeploymentPods: PodListVo[] = [
  {
    uid: generateId(),
    clusterUid: 'cluster-1',
    cluster: 'cluster-1',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'nginx-ingress-controller-7d9f8c6b4-2xq9k',
    ip: '10.244.1.23',
    status: 'Running',
    statusMsg: '',
    restarts: 0,
    nodeIp: '192.168.1.11',
    nodeName: 'node-1',
    readyContainerCount: 1,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 200, unit: 'm' },
        memory: { value: 256, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 1000, unit: 'm' },
        memory: { value: 512, unit: 'Mi' },
      },
      usage: {
        'cpu': { value: 150, unit: 'm' },
        'memory': { value: 200, unit: 'Mi' },
        'storage': { value: 0, unit: 'Mi' },
        'ephemeral-storage': { value: 0, unit: 'Mi' },
        'pods': { value: 1, unit: '' },
      },
    },
  },
  {
    uid: generateId(),
    clusterUid: 'cluster-1',
    cluster: 'cluster-1',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'nginx-ingress-controller-7d9f8c6b4-8m4pz',
    ip: '10.244.1.24',
    status: 'Running',
    statusMsg: '',
    restarts: 1,
    nodeIp: '192.168.1.12',
    nodeName: 'node-2',
    readyContainerCount: 1,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 200, unit: 'm' },
        memory: { value: 256, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 1000, unit: 'm' },
        memory: { value: 512, unit: 'Mi' },
      },
      usage: {
        'cpu': { value: 180, unit: 'm' },
        'memory': { value: 240, unit: 'Mi' },
        'storage': { value: 0, unit: 'Mi' },
        'ephemeral-storage': { value: 0, unit: 'Mi' },
        'pods': { value: 1, unit: '' },
      },
    },
  },
  {
    uid: generateId(),
    clusterUid: 'cluster-1',
    cluster: 'cluster-1',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'nginx-ingress-controller-7d9f8c6b4-v5r7t',
    ip: '10.244.2.31',
    status: 'Pending',
    statusMsg: 'ContainersNotReady: containers with unready status: [nginx-ingress-controller]',
    restarts: 0,
    nodeIp: '192.168.1.13',
    nodeName: 'node-3',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 200, unit: 'm' },
        memory: { value: 256, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 1000, unit: 'm' },
        memory: { value: 512, unit: 'Mi' },
      },
      usage: {
        'cpu': { value: 0, unit: 'm' },
        'memory': { value: 0, unit: 'Mi' },
        'storage': { value: 0, unit: 'Mi' },
        'ephemeral-storage': { value: 0, unit: 'Mi' },
        'pods': { value: 1, unit: '' },
      },
    },
  },
  {
    uid: generateId(),
    clusterUid: 'cluster-1',
    cluster: 'cluster-1',
    namespaceUid: 'ns-default',
    namespace: 'default',
    name: 'nginx-ingress-controller-7d9f8c6b4-k9w2n',
    ip: '10.244.2.32',
    status: 'Failed',
    statusMsg: 'Error: ImagePullBackOff: Back-off pulling image "registry.k8s.io/ingress-nginx/controller:v1.9.0"',
    restarts: 5,
    nodeIp: '192.168.1.13',
    nodeName: 'node-3',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 200, unit: 'm' },
        memory: { value: 256, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 1000, unit: 'm' },
        memory: { value: 512, unit: 'Mi' },
      },
      usage: {
        'cpu': { value: 0, unit: 'm' },
        'memory': { value: 0, unit: 'Mi' },
        'storage': { value: 0, unit: 'Mi' },
        'ephemeral-storage': { value: 0, unit: 'Mi' },
        'pods': { value: 1, unit: '' },
      },
    },
  },
]

/**
 * Deployment 历史版本（滚动更新修订记录）模拟数据
 * @remarks 对应 DeploymentHistoryRevisionListVo，覆盖当前活跃版本与历史回滚版本
 */
export const mockDeploymentHistoryRevisions: DeploymentHistoryRevisionListVo[] = [
  {
    revision: 3,
    changeCause: 'kubectl apply -f deployment.yaml',
    createAt: '2024-03-20 14:22:18',
    active: true,
  },
  {
    revision: 2,
    changeCause:
      'kubectl set image deployment/nginx-ingress-controller nginx-ingress-controller=registry.k8s.io/ingress-nginx/controller:v1.8.0',
    createAt: '2024-02-10 09:15:42',
    active: false,
  },
  {
    revision: 1,
    changeCause: 'kubectl create -f deployment.yaml',
    createAt: '2024-01-15 10:30:25',
    active: false,
  },
]

/**
 * Deployment 关联 Service 模拟数据
 * @remarks 对应 DeploymentServiceListVo，覆盖 ClusterIP / NodePort / LoadBalancer / ExternalName / Headless 类型
 */
export const mockDeploymentServices: DeploymentServiceListVo[] = [
  {
    uid: generateId(),
    name: 'nginx-ingress-controller',
    description: 'Nginx Ingress Controller 集群内访问入口',
    type: 'ClusterIP',
    clusterIp: '10.96.12.34',
    externalName: '',
    headless: false,
    deletable: true,
    createAt: '2024-01-15 10:30:25',
    createBy: 'admin',
  },
  {
    uid: generateId(),
    name: 'payment-service-nodeport',
    description: '支付服务节点端口暴露，供外部调试访问',
    type: 'NodePort',
    clusterIp: '10.96.45.67',
    externalName: '',
    headless: false,
    deletable: true,
    createAt: '2024-02-15 10:10:00',
    createBy: 'developer',
  },
  {
    uid: generateId(),
    name: 'public-gateway-lb',
    description: '公网网关负载均衡入口，由云厂商分配外部 IP',
    type: 'LoadBalancer',
    clusterIp: '10.96.78.90',
    externalName: '',
    headless: false,
    deletable: true,
    createAt: '2024-03-01 14:00:00',
    createBy: 'admin',
  },
  {
    uid: generateId(),
    name: 'external-api',
    description: '外部 API 映射，通过 DNS CNAME 转发至集群外域名',
    type: 'ExternalName',
    clusterIp: '',
    externalName: 'api.external-vendor.com',
    headless: false,
    deletable: true,
    createAt: '2024-03-10 09:20:00',
    createBy: 'developer',
  },
  {
    uid: generateId(),
    name: 'redis-headless',
    description: 'Redis 无头服务，供 StatefulSet 通过 Pod 域名直连',
    type: 'ClusterIP',
    clusterIp: 'None',
    externalName: '',
    headless: true,
    deletable: true,
    createAt: '2024-02-15 10:15:00',
    createBy: 'developer',
  },
]

/**
 * Deployment 关联 Ingress 模拟数据
 * @remarks 对应 DeploymentIngressListVo
 */
export const mockDeploymentIngresses: DeploymentIngressListVo[] = [
  {
    uid: generateId(),
    name: 'nginx-ingress',
    description: 'Nginx Ingress 路由规则，将外部流量转发至后端服务',
    ingressClassName: 'nginx',
    defaultBackendService: 'nginx-ingress-controller',
    ruleCount: 3,
    tlsCount: 1,
    deletable: true,
    createAt: '2024-01-15 10:35:00',
    createBy: 'admin',
  },
  {
    uid: generateId(),
    name: 'api-gateway-ingress',
    description: 'API 网关 Ingress，统一接管 /api 前缀路由',
    ingressClassName: 'alb',
    defaultBackendService: 'api-gateway-service',
    ruleCount: 5,
    tlsCount: 2,
    deletable: true,
    createAt: '2024-03-01 14:10:00',
    createBy: 'developer',
  },
]

/**
 * Deployment 关联事件模拟数据
 * @remarks 对应 EventListVo，覆盖 Normal（扩容）与 Warning（就绪探针失败）两类事件
 */
export const mockDeploymentEvents: EventListVo[] = [
  {
    name: 'event-deploy-scaling',
    namespace: 'kube-system',
    uid: generateId(),
    labels: {},
    annotations: {},
    resourceVersion: '0',
    generation: 0,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    eventTime: '2026-08-13T10:00:00Z',
    reportingController: 'apps/Deployment',
    reportingInstance: 'deployment-controller',
    action: 'Scale',
    reason: 'ScalingReplicaSet',
    regarding: {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      name: 'nginx-ingress-controller',
      namespace: 'kube-system',
      uid: generateId(),
    },
    note: 'Scaled up replica set nginx-ingress-controller-756 to 3',
    type: 'Normal',
  },
  {
    name: 'event-pod-unhealthy',
    namespace: 'kube-system',
    uid: generateId(),
    labels: {},
    annotations: {},
    resourceVersion: '0',
    generation: 0,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    eventTime: '2026-08-13T10:05:00Z',
    reportingController: 'kubernetes.io/kubelet',
    reportingInstance: 'kubelet',
    action: 'Unhealthy',
    reason: 'Unhealthy',
    series: { count: 5, lastObservedTime: '2026-08-13T10:05:00Z' },
    regarding: {
      apiVersion: 'v1',
      kind: 'Pod',
      name: 'nginx-ingress-controller-756-abcde',
      namespace: 'kube-system',
      uid: generateId(),
    },
    note: 'Readiness probe failed for container in nginx-ingress-controller',
    type: 'Warning',
  },
]
