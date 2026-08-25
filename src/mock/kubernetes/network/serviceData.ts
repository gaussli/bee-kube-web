/**
 * Kubernetes Service 模拟数据
 * @module mock/kubernetes/network/serviceData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type { ServiceDetailVo, ServiceListVo, ServiceYamlVo } from '@/types/kubernetes/network/service'

import { generateId } from '@/mock/utils'

/**
 * 模拟 Service 列表数据
 * @remarks 包含系统组件、应用服务等多种类型的 Service，覆盖 ClusterIP、NodePort、LoadBalancer、ExternalName 等类型
 */
export const mockServices: ServiceListVo[] = [
  {
    id: generateId(),
    uid: generateId(),
    name: 'kubernetes',
    namespace: 'default',
    clusterUid: 'cluster-1',
    description: 'Kubernetes API Server 集群内部访问入口',
    type: 'ClusterIP',
    clusterIp: '10.96.0.1',
    externalName: '',
    headless: false,
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'kube-dns',
    namespace: 'kube-system',
    clusterUid: 'cluster-1',
    description: 'CoreDNS 集群 DNS 解析服务入口',
    type: 'ClusterIP',
    clusterIp: '10.96.0.10',
    externalName: '',
    headless: false,
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'frontend-service',
    namespace: 'default',
    clusterUid: 'cluster-1',
    description: '前端应用负载均衡服务',
    type: 'ClusterIP',
    clusterIp: '10.96.0.100',
    externalName: '',
    headless: false,
    deletable: true,
    createAt: '2024-03-10T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T09:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'backend-service',
    namespace: 'default',
    clusterUid: 'cluster-1',
    description: '后端应用 NodePort 对外暴露服务',
    type: 'NodePort',
    clusterIp: '10.96.0.101',
    externalName: '',
    headless: false,
    deletable: true,
    createAt: '2024-03-15T10:30:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T10:30:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'api-service',
    namespace: 'default',
    clusterUid: 'cluster-1',
    description: 'API 网关 LoadBalancer 外部负载均衡服务',
    type: 'LoadBalancer',
    clusterIp: '10.96.0.102',
    externalName: '',
    headless: false,
    deletable: true,
    createAt: '2024-03-20T14:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-20T14:00:00Z',
    updateBy: 'admin',
  },
]

/**
 * 模拟 Service 详情数据
 */
export const mockServiceDetail: ServiceDetailVo = {
  id: mockServices[4].id,
  uid: mockServices[4].uid,
  name: mockServices[4].name,
  namespace: mockServices[4].namespace,
  clusterUid: mockServices[4].clusterUid,
  description: mockServices[4].description,
  deletable: mockServices[4].deletable,
  createAt: mockServices[4].createAt,
  createBy: mockServices[4].createBy,
  updateAt: mockServices[4].updateAt,
  updateBy: mockServices[4].updateBy,
  labels: { 'app.kubernetes.io/name': 'api-service', 'app.kubernetes.io/component': 'api' },
  annotations: { 'service.beta.kubernetes.io/aws-load-balancer-type': 'nlb' },
  spec: {
    type: 'LoadBalancer',
    clusterIP: '10.96.0.102',
    clusterIPs: ['10.96.0.102'],
    ipFamilies: ['IPv4'],
    ipFamilyPolicy: 'SingleStack',
    ports: [
      { name: 'http', protocol: 'TCP', port: 80, targetPort: 8080 },
      { name: 'https', protocol: 'TCP', port: 443, targetPort: 8443 },
    ],
    selector: { app: 'api' },
    sessionAffinity: 'None',
    externalTrafficPolicy: 'Cluster',
    internalTrafficPolicy: 'Cluster',
    allocateLoadBalancerNodePorts: true,
  },
  statusObj: {
    loadBalancer: {
      ingress: [{ ip: '203.0.113.10' }],
    },
  },
}

/**
 * 模拟 Service YAML 数据
 */
export const mockServiceYaml: ServiceYamlVo = {
  yaml: `apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: default
  uid: ${mockServiceDetail.uid}
  creationTimestamp: "2024-03-20T14:00:00Z"
  labels:
    app.kubernetes.io/name: api-service
    app.kubernetes.io/component: api
spec:
  type: LoadBalancer
  clusterIP: 10.96.0.102
  ipFamilies:
    - IPv4
  ipFamilyPolicy: SingleStack
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
    app: api
status:
  loadBalancer:
    ingress:
      - ip: 203.0.113.10
`,
}

/**
 * 模拟 Service 事件列表数据
 */
export const mockServiceEvents: EventListVo[] = [
  {
    name: 'event-service-created',
    namespace: 'default',
    uid: generateId(),
    labels: {},
    annotations: {},
    resourceVersion: '0',
    generation: 0,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    eventTime: '2026-08-13T10:00:00Z',
    reportingController: 'Service',
    reportingInstance: 'service-controller',
    action: 'Created',
    reason: 'Created',
    regarding: {
      apiVersion: 'v1',
      kind: 'Service',
      name: 'api-service',
      namespace: 'default',
      uid: mockServiceDetail.uid,
    },
    note: 'Service api-service created',
    type: 'Normal',
  },
  {
    name: 'event-service-provisioned',
    namespace: 'default',
    uid: generateId(),
    labels: {},
    annotations: {},
    resourceVersion: '0',
    generation: 0,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    eventTime: '2026-08-13T11:00:00Z',
    reportingController: 'Service',
    reportingInstance: 'service-controller',
    action: 'Provisioning',
    reason: 'ProvisioningSucceeded',
    regarding: {
      apiVersion: 'v1',
      kind: 'Service',
      name: 'api-service',
      namespace: 'default',
      uid: mockServiceDetail.uid,
    },
    note: 'Load balancer provisioned successfully',
    type: 'Normal',
  },
]
