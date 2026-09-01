/**
 * Kubernetes Service 模拟数据
 * @module mock/kubernetes/network/serviceData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type { ServiceDetailVo, ServiceListVo } from '@/types/kubernetes/network/service'

import { generateId } from '@/mock/utils'

export const mockServiceList: ServiceListVo[] = [
  // ==================== ClusterIP (10个) ====================
  {
    uid: generateId(),
    name: 'frontend-svc',
    description: '前端应用集群内服务，供后端调用',
    type: 'ClusterIP',
    clusterIp: '10.96.0.1',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'frontend',
    createAt: '2025-06-01 08:00:00',
    createBy: 'admin',
    updateAt: '2025-08-20 10:30:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'api-gateway-svc',
    description: 'API 网关内部服务',
    type: 'ClusterIP',
    clusterIp: '10.96.0.2',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    namespaceUid: generateId(),
    namespace: 'api',
    createAt: '2025-05-15 09:00:00',
    createBy: 'devops',
    updateAt: '2025-08-18 14:20:00',
    updateBy: 'devops',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'mysql-headless',
    description: 'MySQL StatefulSet 无头服务，用于 Pod 发现',
    type: 'ClusterIP',
    clusterIp: 'None',
    externalName: '',
    headless: true,
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'database',
    createAt: '2025-04-10 07:30:00',
    createBy: 'dba',
    updateAt: '2025-08-15 16:45:00',
    updateBy: 'dba',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'redis-svc',
    description: 'Redis 缓存服务内部访问',
    type: 'ClusterIP',
    clusterIp: '10.96.0.3',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-guangzhou',
    namespaceUid: generateId(),
    namespace: 'cache',
    createAt: '2025-03-22 06:00:00',
    createBy: 'developer',
    updateAt: '2025-08-22 11:00:00',
    updateBy: 'developer',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'kafka-headless',
    description: 'Kafka 集群无头服务，用于 Broker 发现',
    type: 'ClusterIP',
    clusterIp: 'None',
    externalName: '',
    headless: true,
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'messaging',
    createAt: '2025-06-20 08:30:00',
    createBy: 'data-team',
    updateAt: '2025-08-19 09:10:00',
    updateBy: 'data-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'auth-svc',
    description: '认证服务内部调用',
    type: 'ClusterIP',
    clusterIp: '10.96.0.4',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    namespaceUid: generateId(),
    namespace: 'auth',
    createAt: '2025-05-25 10:00:00',
    createBy: 'security',
    updateAt: '2025-08-21 13:50:00',
    updateBy: 'security',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'mongodb-headless',
    description: 'MongoDB 副本集无头服务',
    type: 'ClusterIP',
    clusterIp: 'None',
    externalName: '',
    headless: true,
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'database',
    createAt: '2025-07-01 08:00:00',
    createBy: 'dba',
    updateAt: '2025-08-23 07:20:00',
    updateBy: 'dba',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'rabbitmq-svc',
    description: 'RabbitMQ 消息队列内部服务',
    type: 'ClusterIP',
    clusterIp: '10.96.0.5',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-guangzhou',
    namespaceUid: generateId(),
    namespace: 'messaging',
    createAt: '2025-02-14 09:00:00',
    createBy: 'data-team',
    updateAt: '2025-08-17 15:10:00',
    updateBy: 'data-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'elasticsearch-headless',
    description: 'Elasticsearch 集群无头服务',
    type: 'ClusterIP',
    clusterIp: 'None',
    externalName: '',
    headless: true,
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'logging',
    createAt: '2025-04-20 06:30:00',
    createBy: 'search-team',
    updateAt: '2025-08-16 08:40:00',
    updateBy: 'search-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'internal-svc',
    description: '内部工具服务',
    type: 'ClusterIP',
    clusterIp: '10.96.0.6',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'staging-beijing',
    namespaceUid: generateId(),
    namespace: 'default',
    createAt: '2025-07-15 08:00:00',
    createBy: 'developer',
    updateAt: '2025-08-22 09:00:00',
    updateBy: 'developer',
    deletable: true,
  },

  // ==================== NodePort (7个) ====================
  {
    uid: generateId(),
    name: 'web-nodeport',
    description: 'Web 服务通过 NodePort 对外暴露',
    type: 'NodePort',
    clusterIp: '10.96.0.10',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'default',
    createAt: '2025-06-10 07:00:00',
    createBy: 'ops',
    updateAt: '2025-08-25 14:30:00',
    updateBy: 'ops',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'dashboard-nodeport',
    description: 'Kubernetes Dashboard 通过 NodePort 访问',
    type: 'NodePort',
    clusterIp: '10.96.0.11',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    namespaceUid: generateId(),
    namespace: 'kube-system',
    createAt: '2025-07-20 09:30:00',
    createBy: 'admin',
    updateAt: '2025-08-24 12:00:00',
    updateBy: 'admin',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'grafana-nodeport',
    description: 'Grafana 监控面板通过 NodePort 暴露',
    type: 'NodePort',
    clusterIp: '10.96.0.12',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'monitoring',
    createAt: '2025-04-15 07:00:00',
    createBy: 'devops',
    updateAt: '2025-08-20 16:30:00',
    updateBy: 'devops',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'jenkins-nodeport',
    description: 'Jenkins 服务通过 NodePort 暴露',
    type: 'NodePort',
    clusterIp: '10.96.0.13',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-guangzhou',
    namespaceUid: generateId(),
    namespace: 'ci-cd',
    createAt: '2025-03-20 06:00:00',
    createBy: 'devops',
    updateAt: '2025-08-22 08:50:00',
    updateBy: 'devops',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'elasticsearch-nodeport',
    description: 'Elasticsearch 对外通过 NodePort 提供查询',
    type: 'NodePort',
    clusterIp: '10.96.0.14',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    namespaceUid: generateId(),
    namespace: 'logging',
    createAt: '2025-06-25 09:00:00',
    createBy: 'search-team',
    updateAt: '2025-08-23 11:30:00',
    updateBy: 'search-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'mysql-nodeport',
    description: 'MySQL 临时暴露用于开发调试',
    type: 'NodePort',
    clusterIp: '10.96.0.15',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'staging-beijing',
    namespaceUid: generateId(),
    namespace: 'database',
    createAt: '2025-07-05 06:00:00',
    createBy: 'dba',
    updateAt: '2025-08-22 15:00:00',
    updateBy: 'dba',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'redis-nodeport',
    description: 'Redis 通过 NodePort 供外部应用访问',
    type: 'NodePort',
    clusterIp: '10.96.0.16',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'cache',
    createAt: '2025-02-28 08:00:00',
    createBy: 'developer',
    updateAt: '2025-08-19 10:40:00',
    updateBy: 'developer',
    deletable: false,
  },

  // ==================== LoadBalancer (7个) ====================
  {
    uid: generateId(),
    name: 'web-lb',
    description: 'Web 服务通过云负载均衡器对外提供',
    type: 'LoadBalancer',
    clusterIp: '10.96.0.20',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'default',
    createAt: '2025-05-10 07:00:00',
    createBy: 'admin',
    updateAt: '2025-08-24 09:20:00',
    updateBy: 'admin',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'api-lb',
    description: 'API 网关通过 LoadBalancer 对外暴露',
    type: 'LoadBalancer',
    clusterIp: '10.96.0.21',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    namespaceUid: generateId(),
    namespace: 'api',
    createAt: '2025-08-01 08:00:00',
    createBy: 'devops',
    updateAt: '2025-08-26 14:00:00',
    updateBy: 'devops',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'grafana-lb',
    description: 'Grafana 面板通过 LoadBalancer 公开',
    type: 'LoadBalancer',
    clusterIp: '10.96.0.22',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'monitoring',
    createAt: '2025-04-15 07:00:00',
    createBy: 'devops',
    updateAt: '2025-08-20 16:30:00',
    updateBy: 'devops',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'minio-lb',
    description: 'MinIO 对象存储通过 LoadBalancer 提供',
    type: 'LoadBalancer',
    clusterIp: '10.96.0.23',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-guangzhou',
    namespaceUid: generateId(),
    namespace: 'storage',
    createAt: '2025-03-30 10:30:00',
    createBy: 'ops',
    updateAt: '2025-08-21 13:00:00',
    updateBy: 'ops',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'ingress-lb',
    description: 'Ingress Controller 负载均衡器',
    type: 'LoadBalancer',
    clusterIp: '10.96.0.24',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'ingress',
    createAt: '2025-06-15 09:30:00',
    createBy: 'net-team',
    updateAt: '2025-08-21 11:20:00',
    updateBy: 'net-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'argocd-lb',
    description: 'ArgoCD 通过 LoadBalancer 对外提供 UI',
    type: 'LoadBalancer',
    clusterIp: '10.96.0.25',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    namespaceUid: generateId(),
    namespace: 'gitops',
    createAt: '2025-07-30 09:00:00',
    createBy: 'gitops-team',
    updateAt: '2025-08-26 16:00:00',
    updateBy: 'gitops-team',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'kafka-lb',
    description: 'Kafka 对外通过 LoadBalancer 暴露',
    type: 'LoadBalancer',
    clusterIp: '10.96.0.26',
    externalName: '',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'messaging',
    createAt: '2025-05-20 07:30:00',
    createBy: 'data-team',
    updateAt: '2025-08-25 12:10:00',
    updateBy: 'data-team',
    deletable: false,
  },

  // ==================== ExternalName (6个) ====================
  {
    uid: generateId(),
    name: 'external-db',
    description: '外部托管数据库服务引用',
    type: 'ExternalName',
    clusterIp: '',
    externalName: 'database.example.com',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'database',
    createAt: '2025-05-10 07:30:00',
    createBy: 'dba',
    updateAt: '2025-08-24 09:20:00',
    updateBy: 'dba',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'external-payment',
    description: '第三方支付网关服务引用',
    type: 'ExternalName',
    clusterIp: '',
    externalName: 'payment-api.thirdparty.com',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    namespaceUid: generateId(),
    namespace: 'payment',
    createAt: '2025-06-10 07:00:00',
    createBy: 'dev',
    updateAt: '2025-08-25 14:30:00',
    updateBy: 'dev',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'external-analytics',
    description: '外部分析服务引用',
    type: 'ExternalName',
    clusterIp: '',
    externalName: 'analytics-service.saas.com',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-guangzhou',
    namespaceUid: generateId(),
    namespace: 'monitoring',
    createAt: '2025-04-20 06:30:00',
    createBy: 'devops',
    updateAt: '2025-08-16 08:40:00',
    updateBy: 'devops',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'external-cdn',
    description: '外部 CDN 服务引用',
    type: 'ExternalName',
    clusterIp: '',
    externalName: 'cdn.cloudflare.com',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'static',
    createAt: '2025-07-15 08:00:00',
    createBy: 'ops',
    updateAt: '2025-08-22 09:00:00',
    updateBy: 'ops',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'external-email',
    description: '外部邮件发送服务',
    type: 'ExternalName',
    clusterIp: '',
    externalName: 'smtp.mailservice.com',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    namespaceUid: generateId(),
    namespace: 'notification',
    createAt: '2025-06-05 10:30:00',
    createBy: 'dev',
    updateAt: '2025-08-25 08:00:00',
    updateBy: 'dev',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'external-storage',
    description: '外部对象存储服务引用',
    type: 'ExternalName',
    clusterIp: '',
    externalName: 's3.amazonaws.com',
    headless: false,
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'storage',
    createAt: '2025-07-25 08:00:00',
    createBy: 'ops',
    updateAt: '2025-08-26 11:30:00',
    updateBy: 'ops',
    deletable: true,
  },
]

export const mockServiceClusterIPDetail: ServiceDetailVo = {
  uid: generateId(),
  name: 'frontend-svc',
  namespace: 'frontend',
  clusterUid: generateId(),
  cluster: 'prod-beijing',
  namespaceUid: generateId(),
  description: '前端应用集群内部服务，供后端 API 调用',
  resourceVersion: '1234567890',
  generation: 1,
  deletionTimestamp: '',
  ownerReferences: ['deployment.apps/frontend-7d8f9c6b5d'],
  finalizers: ['kubernetes'],
  labels: {
    app: 'frontend',
    env: 'prod',
    team: 'platform',
  },
  annotations: {
    'kubernetes.io/description': '由前端团队维护',
  },
  spec: {
    ports: [
      {
        name: 'http',
        protocol: 'TCP',
        port: 80,
        targetPort: 8080,
      },
      {
        name: 'metrics',
        protocol: 'TCP',
        port: 9090,
        targetPort: 9090,
      },
    ],
    selector: {
      app: 'frontend',
      tier: 'web',
    },
    clusterIP: '10.96.0.1',
    clusterIPs: ['10.96.0.1'],
    type: 'ClusterIP',
    sessionAffinity: 'None',
    internalTrafficPolicy: 'Cluster',
    ipFamilies: ['IPv4'],
    ipFamilyPolicy: 'SingleStack',
    publishNotReadyAddresses: false,
  },
  statusObj: {},
  createAt: '2025-06-01 08:00:00',
  createBy: 'admin',
  updateAt: '2025-08-20 10:30:00',
  updateBy: 'sre-team',
  deletable: false,
}

export const mockServiceNodePortDetail: ServiceDetailVo = {
  uid: generateId(),
  name: 'web-nodeport',
  namespace: 'default',
  clusterUid: generateId(),
  cluster: 'prod-beijing',
  namespaceUid: generateId(),
  description: 'Web 服务通过 NodePort 对外暴露，供外部测试访问',
  resourceVersion: '1234567891',
  generation: 1,
  deletionTimestamp: '',
  ownerReferences: [],
  finalizers: [],
  labels: {
    app: 'web',
    env: 'prod',
  },
  annotations: {
    'kubernetes.io/description': '临时对外暴露',
  },
  spec: {
    ports: [
      {
        name: 'http',
        protocol: 'TCP',
        port: 80,
        targetPort: 8080,
        nodePort: 30080,
      },
    ],
    selector: {
      app: 'web',
    },
    clusterIP: '10.96.0.10',
    clusterIPs: ['10.96.0.10'],
    type: 'NodePort',
    sessionAffinity: 'None',
    externalTrafficPolicy: 'Cluster',
    internalTrafficPolicy: 'Cluster',
    ipFamilies: ['IPv4'],
    ipFamilyPolicy: 'SingleStack',
    healthCheckNodePort: 0,
    allocateLoadBalancerNodePorts: true,
  },
  statusObj: {},
  createAt: '2025-06-10 07:00:00',
  createBy: 'ops',
  updateAt: '2025-08-25 14:30:00',
  updateBy: 'ops',
  deletable: false,
}

export const mockServiceLoadBalancerDetail: ServiceDetailVo = {
  uid: generateId(),
  name: 'web-lb',
  namespace: 'default',
  clusterUid: generateId(),
  cluster: 'prod-beijing',
  namespaceUid: generateId(),
  description: 'Web 服务通过云负载均衡器对外提供，支持外部 HTTPS 访问',
  resourceVersion: '1234567892',
  generation: 2,
  deletionTimestamp: '',
  ownerReferences: [],
  finalizers: [],
  labels: {
    app: 'web',
    env: 'prod',
    type: 'public',
  },
  annotations: {
    'service.beta.kubernetes.io/aws-load-balancer-type': 'nlb',
    'service.beta.kubernetes.io/aws-load-balancer-ssl-cert': 'arn:aws:acm:...',
  },
  spec: {
    ports: [
      {
        name: 'http',
        protocol: 'TCP',
        port: 80,
        targetPort: 8080,
      },
      {
        name: 'https',
        protocol: 'TCP',
        port: 443,
        targetPort: 8443,
      },
    ],
    selector: {
      app: 'web',
    },
    clusterIP: '10.96.0.20',
    clusterIPs: ['10.96.0.20'],
    type: 'LoadBalancer',
    sessionAffinity: 'ClientIP',
    sessionAffinityConfig: {
      clientIP: {
        timeoutSeconds: 10800,
      },
    },
    externalTrafficPolicy: 'Cluster',
    internalTrafficPolicy: 'Cluster',
    loadBalancerIP: '203.0.113.100',
    loadBalancerSourceRanges: ['203.0.113.0/24', '10.0.0.0/8'],
    healthCheckNodePort: 31000,
    allocateLoadBalancerNodePorts: true,
    ipFamilies: ['IPv4'],
    ipFamilyPolicy: 'SingleStack',
  },
  statusObj: {
    loadBalancer: {
      ingress: [
        {
          ip: '203.0.113.100',
          hostname: 'lb-web-1234567890.elb.amazonaws.com',
          ipMode: 'VIP',
          ports: [
            { port: 80, protocol: 'TCP' },
            { port: 443, protocol: 'TCP' },
          ],
        },
      ],
    },
    conditions: [
      {
        type: 'LoadBalancerPortsError',
        status: 'False',
        lastProbeTime: '2026-08-28 10:00:00',
        lastTransitionTime: '2026-08-28 09:00:00',
        reason: 'PortsAllocated',
        message: 'LoadBalancer ports allocated successfully',
      },
    ],
  },
  createAt: '2025-05-10 07:00:00',
  createBy: 'admin',
  updateAt: '2025-08-24 09:20:00',
  updateBy: 'admin',
  deletable: false,
}

export const mockServiceExternalNameDetail: ServiceDetailVo = {
  uid: generateId(),
  name: 'external-db',
  namespace: 'database',
  clusterUid: generateId(),
  cluster: 'prod-beijing',
  namespaceUid: generateId(),
  description: '外部托管数据库服务引用，通过 ExternalName 实现服务发现',
  resourceVersion: '1234567893',
  generation: 1,
  deletionTimestamp: '',
  ownerReferences: [],
  finalizers: [],
  labels: {
    app: 'database',
    env: 'prod',
    type: 'external',
  },
  annotations: {
    'kubernetes.io/description': '指向生产环境 RDS 实例',
  },
  spec: {
    type: 'ExternalName',
    externalName: 'database.example.com',
    clusterIP: '',
    clusterIPs: [],
    ports: [
      {
        name: 'mysql',
        protocol: 'TCP',
        port: 3306,
        targetPort: 3306,
      },
    ],
    selector: {},
    sessionAffinity: 'None',
    ipFamilies: ['IPv4'],
    ipFamilyPolicy: 'SingleStack',
    publishNotReadyAddresses: false,
  },
  statusObj: {},
  createAt: '2025-05-10 07:30:00',
  createBy: 'dba',
  updateAt: '2025-08-24 09:20:00',
  updateBy: 'dba',
  deletable: false,
}

export const mockServiceDetail: ServiceDetailVo = mockServiceClusterIPDetail

export const mockServiceClusterIPYamls: string = `
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
  namespace: frontend
  labels:
    app: frontend
    env: prod
    team: platform
  annotations:
    kubernetes.io/description: "由前端团队维护"
    platform.io/cluster: "prod-beijing"
    platform.io/cluster-uid: "12345678-1234-1234-1234-123456789abd"
    platform.io/namespace-uid: "12345678-1234-1234-1234-123456789abe"
    platform.io/description: "前端应用集群内部服务，供后端 API 调用"
spec:
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 8080
  - name: metrics
    protocol: TCP
    port: 9090
    targetPort: 9090
  selector:
    app: frontend
    tier: web
  clusterIP: 10.96.0.1
  clusterIPs:
  - 10.96.0.1
  type: ClusterIP
  sessionAffinity: None
  internalTrafficPolicy: Cluster
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  publishNotReadyAddresses: false
`

export const mockServiceNodePortYamls: string = `
apiVersion: v1
kind: Service
metadata:
  name: web-nodeport
  namespace: default
  labels:
    app: web
    env: prod
  annotations:
    kubernetes.io/description: "临时对外暴露"
    platform.io/cluster: "prod-beijing"
    platform.io/cluster-uid: "12345678-1234-1234-1234-123456789abd"
    platform.io/namespace-uid: "12345678-1234-1234-1234-123456789abe"
    platform.io/description: "Web 服务通过 NodePort 对外暴露，供外部测试访问"
spec:
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 8080
    nodePort: 30080
  selector:
    app: web
  clusterIP: 10.96.0.10
  clusterIPs:
  - 10.96.0.10
  type: NodePort
  sessionAffinity: None
  externalTrafficPolicy: Cluster
  internalTrafficPolicy: Cluster
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  healthCheckNodePort: 0
  allocateLoadBalancerNodePorts: true
`

export const mockServiceLoadBalancerYamls: string = `
apiVersion: v1
kind: Service
metadata:
  name: web-lb
  namespace: default
  labels:
    app: web
    env: prod
    type: public
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "arn:aws:acm:..."
    platform.io/cluster: "prod-beijing"
    platform.io/cluster-uid: "12345678-1234-1234-1234-123456789abd"
    platform.io/namespace-uid: "12345678-1234-1234-1234-123456789abe"
    platform.io/description: "Web 服务通过云负载均衡器对外提供，支持外部 HTTPS 访问"
spec:
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 8080
  - name: https
    protocol: TCP
    port: 443
    targetPort: 8443
  selector:
    app: web
  clusterIP: 10.96.0.20
  clusterIPs:
  - 10.96.0.20
  type: LoadBalancer
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800
  externalTrafficPolicy: Cluster
  internalTrafficPolicy: Cluster
  loadBalancerIP: 203.0.113.100
  loadBalancerSourceRanges:
  - 203.0.113.0/24
  - 10.0.0.0/8
  healthCheckNodePort: 31000
  allocateLoadBalancerNodePorts: true
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
status:
  loadBalancer:
    ingress:
    - ip: 203.0.113.100
      hostname: lb-web-1234567890.elb.amazonaws.com
      ipMode: VIP
      ports:
      - port: 80
        protocol: TCP
      - port: 443
        protocol: TCP
  conditions:
  - type: LoadBalancerPortsError
    status: "False"
    lastProbeTime: "2026-08-28T10:00:00Z"
    lastTransitionTime: "2026-08-28T09:00:00Z"
    reason: PortsAllocated
    message: LoadBalancer ports allocated successfully
`

export const mockServiceExternalNameYamls: string = `
apiVersion: v1
kind: Service
metadata:
  name: external-db
  namespace: database
  labels:
    app: database
    env: prod
    type: external
  annotations:
    kubernetes.io/description: "指向生产环境 RDS 实例"
    platform.io/cluster: "prod-beijing"
    platform.io/cluster-uid: "12345678-1234-1234-1234-123456789abd"
    platform.io/namespace-uid: "12345678-1234-1234-1234-123456789abe"
    platform.io/description: "外部托管数据库服务引用，通过 ExternalName 实现服务发现"
spec:
  type: ExternalName
  externalName: database.example.com
  clusterIP: ""
  clusterIPs: []
  ports:
  - name: mysql
    protocol: TCP
    port: 3306
    targetPort: 3306
  selector: {}
  sessionAffinity: None
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  publishNotReadyAddresses: false
`

export const mockServiceYaml: string = mockServiceClusterIPYamls

export const mockServiceEventList: EventListVo[] = [
  {
    name: 'svc-event-001',
    namespace: 'default',
    uid: generateId(),
    resourceVersion: '5001',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 08:00:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 08:00:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-abc',
    action: 'Created',
    reason: 'ServiceCreated',
    regarding: {
      kind: 'Service',
      namespace: 'default',
      name: 'frontend-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service frontend-svc created with type ClusterIP, port 80 -> targetPort 8080',
    type: 'Normal',
  },
  {
    name: 'svc-event-002',
    namespace: 'production',
    uid: generateId(),
    resourceVersion: '5002',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 07:45:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 07:45:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-def',
    action: 'Updated',
    reason: 'ServiceUpdated',
    regarding: {
      kind: 'Service',
      namespace: 'production',
      name: 'api-gateway-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service api-gateway-svc updated: port changed from 8080 to 8081',
    type: 'Normal',
  },
  {
    name: 'svc-event-003',
    namespace: 'default',
    uid: generateId(),
    resourceVersion: '5003',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 07:30:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 07:30:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-ghi',
    action: 'EndpointsUpdated',
    reason: 'EndpointsChanged',
    regarding: {
      kind: 'Service',
      namespace: 'default',
      name: 'nginx-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: {
      kind: 'Endpoints',
      namespace: 'default',
      name: 'nginx-svc',
      uid: generateId(),
    },
    note: 'Service nginx-svc endpoints updated: added new pod IP 10.0.1.5:80, removed 10.0.1.3:80',
    type: 'Normal',
  },
  {
    name: 'svc-event-004',
    namespace: 'staging',
    uid: generateId(),
    resourceVersion: '5004',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 07:15:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 07:15:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-jkl',
    action: 'Deleted',
    reason: 'ServiceDeleted',
    regarding: {
      kind: 'Service',
      namespace: 'staging',
      name: 'temporary-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service temporary-svc deleted during environment cleanup',
    type: 'Normal',
  },
  {
    name: 'svc-event-005',
    namespace: 'database',
    uid: generateId(),
    resourceVersion: '5005',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 07:00:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 07:00:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-mno',
    action: 'Created',
    reason: 'ServiceCreated',
    regarding: {
      kind: 'Service',
      namespace: 'database',
      name: 'mysql-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service mysql-svc created with type ClusterIP, port 3306 -> targetPort 3306',
    type: 'Normal',
  },
  {
    name: 'svc-event-006',
    namespace: 'default',
    uid: generateId(),
    resourceVersion: '5006',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 06:45:00',
    series: {
      count: 2,
      lastObservedTime: '2026-08-27 06:45:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-pqr',
    action: 'FailedSync',
    reason: 'NoEndpointsFound',
    regarding: {
      kind: 'Service',
      namespace: 'default',
      name: 'app-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service app-svc sync failed: no matching pods found for selector "app=my-app"',
    type: 'Warning',
  },
  {
    name: 'svc-event-007',
    namespace: 'api',
    uid: generateId(),
    resourceVersion: '5007',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 06:30:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 06:30:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-stu',
    action: 'Created',
    reason: 'ServiceCreated',
    regarding: {
      kind: 'Service',
      namespace: 'api',
      name: 'gateway-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service gateway-svc created with type NodePort, external port 30080 -> internal 8080',
    type: 'Normal',
  },
  {
    name: 'svc-event-008',
    namespace: 'frontend',
    uid: generateId(),
    resourceVersion: '5008',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 06:15:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 06:15:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-vwx',
    action: 'Updated',
    reason: 'ServiceUpdated',
    regarding: {
      kind: 'Service',
      namespace: 'frontend',
      name: 'frontend-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service frontend-svc updated: changed from type ClusterIP to LoadBalancer',
    type: 'Normal',
  },
  {
    name: 'svc-event-009',
    namespace: 'cache',
    uid: generateId(),
    resourceVersion: '5009',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 06:00:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 06:00:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-yza',
    action: 'Created',
    reason: 'ServiceCreated',
    regarding: {
      kind: 'Service',
      namespace: 'cache',
      name: 'redis-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service redis-svc created with type ClusterIP, port 6379 -> targetPort 6379',
    type: 'Normal',
  },
  {
    name: 'svc-event-010',
    namespace: 'production',
    uid: generateId(),
    resourceVersion: '5010',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 05:45:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 05:45:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-bcd',
    action: 'LoadBalancerIPAssigned',
    reason: 'LoadBalancerIP',
    regarding: {
      kind: 'Service',
      namespace: 'production',
      name: 'web-lb',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'LoadBalancer IP 203.0.113.10 assigned to Service web-lb',
    type: 'Normal',
  },
  {
    name: 'svc-event-011',
    namespace: 'ingress',
    uid: generateId(),
    resourceVersion: '5011',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 05:30:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 05:30:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-efg',
    action: 'Created',
    reason: 'ServiceCreated',
    regarding: {
      kind: 'Service',
      namespace: 'ingress',
      name: 'ingress-controller-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service ingress-controller-svc created with type LoadBalancer, port 80, 443',
    type: 'Normal',
  },
  {
    name: 'svc-event-012',
    namespace: 'default',
    uid: generateId(),
    resourceVersion: '5012',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 05:15:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 05:15:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-hij',
    action: 'FailedSync',
    reason: 'InvalidPort',
    regarding: {
      kind: 'Service',
      namespace: 'default',
      name: 'invalid-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service invalid-svc sync failed: port 99999 is out of range (1-65535)',
    type: 'Warning',
  },
  {
    name: 'svc-event-013',
    namespace: 'storage',
    uid: generateId(),
    resourceVersion: '5013',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 05:00:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 05:00:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-klm',
    action: 'Updated',
    reason: 'ServiceUpdated',
    regarding: {
      kind: 'Service',
      namespace: 'storage',
      name: 'storage-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service storage-svc updated: added new port 9000 for backup service',
    type: 'Normal',
  },
  {
    name: 'svc-event-014',
    namespace: 'security',
    uid: generateId(),
    resourceVersion: '5014',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 04:45:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 04:45:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-nop',
    action: 'Created',
    reason: 'ServiceCreated',
    regarding: {
      kind: 'Service',
      namespace: 'security',
      name: 'oauth-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service oauth-svc created with type ClusterIP, port 4180 -> targetPort 4180',
    type: 'Normal',
  },
  {
    name: 'svc-event-015',
    namespace: 'logging',
    uid: generateId(),
    resourceVersion: '5015',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 04:30:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 04:30:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-qrs',
    action: 'EndpointsUpdated',
    reason: 'EndpointsChanged',
    regarding: {
      kind: 'Service',
      namespace: 'logging',
      name: 'elasticsearch-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: {
      kind: 'Endpoints',
      namespace: 'logging',
      name: 'elasticsearch-svc',
      uid: generateId(),
    },
    note: 'Service elasticsearch-svc endpoints updated: added 2 new Elasticsearch nodes',
    type: 'Normal',
  },
  {
    name: 'svc-event-016',
    namespace: 'mesh',
    uid: generateId(),
    resourceVersion: '5016',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 04:15:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 04:15:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-tuv',
    action: 'Updated',
    reason: 'ServiceUpdated',
    regarding: {
      kind: 'Service',
      namespace: 'mesh',
      name: 'istio-telemetry-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service istio-telemetry-svc updated: selector labels changed from app=istio-telemetry to app=telemetry',
    type: 'Normal',
  },
  {
    name: 'svc-event-017',
    namespace: 'dev',
    uid: generateId(),
    resourceVersion: '5017',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 04:00:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 04:00:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-wxy',
    action: 'Deleted',
    reason: 'ServiceDeleted',
    regarding: {
      kind: 'Service',
      namespace: 'dev',
      name: 'test-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service test-svc deleted during development namespace cleanup',
    type: 'Normal',
  },
  {
    name: 'svc-event-018',
    namespace: 'gitops',
    uid: generateId(),
    resourceVersion: '5018',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 03:45:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 03:45:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-zab',
    action: 'Created',
    reason: 'ServiceCreated',
    regarding: {
      kind: 'Service',
      namespace: 'gitops',
      name: 'argocd-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service argocd-svc created with type ClusterIP, port 80 -> targetPort 8080',
    type: 'Normal',
  },
  {
    name: 'svc-event-019',
    namespace: 'frontend',
    uid: generateId(),
    resourceVersion: '5019',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 03:30:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 03:30:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-cde',
    action: 'FailedSync',
    reason: 'MissingSelector',
    regarding: {
      kind: 'Service',
      namespace: 'frontend',
      name: 'empty-selector-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service empty-selector-svc sync failed: selector is empty, cannot match any pods',
    type: 'Warning',
  },
  {
    name: 'svc-event-020',
    namespace: 'cert-manager',
    uid: generateId(),
    resourceVersion: '5020',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 03:15:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 03:15:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-fgh',
    action: 'Created',
    reason: 'ServiceCreated',
    regarding: {
      kind: 'Service',
      namespace: 'cert-manager',
      name: 'webhook-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service webhook-svc created with type ClusterIP, port 10250 -> targetPort 10250',
    type: 'Normal',
  },
  {
    name: 'svc-event-021',
    namespace: 'autoscale',
    uid: generateId(),
    resourceVersion: '5021',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 03:00:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 03:00:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-ijk',
    action: 'Updated',
    reason: 'ServiceUpdated',
    regarding: {
      kind: 'Service',
      namespace: 'autoscale',
      name: 'hpa-metrics-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service hpa-metrics-svc updated: port changed from 8082 to 8083 for custom metrics',
    type: 'Normal',
  },
  {
    name: 'svc-event-022',
    namespace: 'tenant',
    uid: generateId(),
    resourceVersion: '5022',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 02:45:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 02:45:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-lmn',
    action: 'Created',
    reason: 'ServiceCreated',
    regarding: {
      kind: 'Service',
      namespace: 'tenant',
      name: 'tenant-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service tenant-svc created with type ClusterIP, port 8080 -> targetPort 8080',
    type: 'Normal',
  },
  {
    name: 'svc-event-023',
    namespace: 'default',
    uid: generateId(),
    resourceVersion: '5023',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 02:30:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 02:30:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-opq',
    action: 'FailedSync',
    reason: 'SessionAffinityConflict',
    regarding: {
      kind: 'Service',
      namespace: 'default',
      name: 'session-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service session-svc sync failed: sessionAffinity ClientIP cannot be used with externalTrafficPolicy Local',
    type: 'Warning',
  },
  {
    name: 'svc-event-024',
    namespace: 'monitoring',
    uid: generateId(),
    resourceVersion: '5024',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 02:15:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 02:15:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-rst',
    action: 'Created',
    reason: 'ServiceCreated',
    regarding: {
      kind: 'Service',
      namespace: 'monitoring',
      name: 'prometheus-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service prometheus-svc created with type ClusterIP, port 9090 -> targetPort 9090',
    type: 'Normal',
  },
  {
    name: 'svc-event-025',
    namespace: 'cache',
    uid: generateId(),
    resourceVersion: '5025',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 02:00:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 02:00:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-uvw',
    action: 'Updated',
    reason: 'ServiceUpdated',
    regarding: {
      kind: 'Service',
      namespace: 'cache',
      name: 'redis-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service redis-svc updated: added annotation "redis.io/version" = "6.2"',
    type: 'Normal',
  },
  {
    name: 'svc-event-026',
    namespace: 'auth',
    uid: generateId(),
    resourceVersion: '5026',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 01:45:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 01:45:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-xyz',
    action: 'Created',
    reason: 'ServiceCreated',
    regarding: {
      kind: 'Service',
      namespace: 'auth',
      name: 'auth-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service auth-svc created with type ClusterIP, port 8080 -> targetPort 8080',
    type: 'Normal',
  },
  {
    name: 'svc-event-027',
    namespace: 'storage',
    uid: generateId(),
    resourceVersion: '5027',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 01:30:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 01:30:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-abc',
    action: 'Deleted',
    reason: 'ServiceDeleted',
    regarding: {
      kind: 'Service',
      namespace: 'storage',
      name: 'nfs-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service nfs-svc deleted due to migration to persistent volumes',
    type: 'Normal',
  },
  {
    name: 'svc-event-028',
    namespace: 'messaging',
    uid: generateId(),
    resourceVersion: '5028',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 01:15:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 01:15:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-def',
    action: 'Created',
    reason: 'ServiceCreated',
    regarding: {
      kind: 'Service',
      namespace: 'messaging',
      name: 'kafka-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service kafka-svc created with type ClusterIP, ports 9092, 9094',
    type: 'Normal',
  },
  {
    name: 'svc-event-029',
    namespace: 'search',
    uid: generateId(),
    resourceVersion: '5029',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 01:00:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 01:00:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-ghi',
    action: 'Updated',
    reason: 'ServiceUpdated',
    regarding: {
      kind: 'Service',
      namespace: 'search',
      name: 'es-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service es-svc updated: changed targetPort from 9200 to 9201',
    type: 'Normal',
  },
  {
    name: 'svc-event-030',
    namespace: 'database',
    uid: generateId(),
    resourceVersion: '5030',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'service',
    },
    annotations: {},
    eventTime: '2026-08-27 00:45:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-27 00:45:00',
    },
    reportingController: 'service-controller',
    reportingInstance: 'svc-controller-jkl',
    action: 'FailedSync',
    reason: 'TypeNotSupported',
    regarding: {
      kind: 'Service',
      namespace: 'database',
      name: 'postgres-svc',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Service postgres-svc sync failed: Service type "InvalidType" not supported',
    type: 'Warning',
  },
]
