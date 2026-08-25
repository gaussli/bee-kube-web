/**
 * Kubernetes Ingress 模拟数据
 * @module mock/kubernetes/network/ingressData
 */
import type { EventListVo } from '@/types/kubernetes/event'
import type { IngressDetailVo, IngressListVo, IngressYamlVo } from '@/types/kubernetes/network/ingress'

import { generateId } from '@/mock/utils'

/**
 * 模拟 Ingress 列表数据
 */
export const mockIngresses: IngressListVo[] = [
  {
    id: generateId(),
    uid: generateId(),
    name: 'api-ingress',
    namespace: 'default',
    clusterUid: 'cluster-1',
    description: 'API 网关外部访问入口',
    ingressClassName: 'nginx',
    defaultBackendService: 'api-service',
    ruleCount: 2,
    tlsCount: 1,
    deletable: true,
    createAt: '2024-03-10T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T10:00:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'web-ingress',
    namespace: 'default',
    clusterUid: 'cluster-1',
    description: '前端应用 Web 访问入口',
    ingressClassName: 'nginx',
    defaultBackendService: 'frontend-service',
    ruleCount: 3,
    tlsCount: 2,
    deletable: true,
    createAt: '2024-03-15T09:30:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T09:30:00Z',
    updateBy: 'admin',
  },
  {
    id: generateId(),
    uid: generateId(),
    name: 'prometheus-ingress',
    namespace: 'monitoring',
    clusterUid: 'cluster-1',
    description: 'Prometheus 监控面板访问入口',
    ingressClassName: 'nginx',
    defaultBackendService: 'prometheus',
    ruleCount: 1,
    tlsCount: 1,
    deletable: true,
    createAt: '2024-03-20T14:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-20T14:00:00Z',
    updateBy: 'admin',
  },
]

/**
 * 模拟 Ingress 详情数据
 */
export const mockIngressDetail: IngressDetailVo = {
  id: mockIngresses[0].id,
  uid: mockIngresses[0].uid,
  name: mockIngresses[0].name,
  namespace: mockIngresses[0].namespace,
  clusterUid: mockIngresses[0].clusterUid,
  description: mockIngresses[0].description,
  deletable: mockIngresses[0].deletable,
  createAt: mockIngresses[0].createAt,
  createBy: mockIngresses[0].createBy,
  updateAt: mockIngresses[0].updateAt,
  updateBy: mockIngresses[0].updateBy,
  labels: { 'app.kubernetes.io/name': 'api-ingress' },
  annotations: { 'nginx.ingress.kubernetes.io/rewrite-target': '/' },
  spec: {
    ingressClassName: 'nginx',
    rules: [
      {
        host: 'api.example.com',
        http: {
          paths: [
            { path: '/', pathType: 'Prefix', backend: { service: { name: 'api-service', port: { number: 8080 } } } },
          ],
        },
      },
    ],
    tls: [{ hosts: ['api.example.com'], secretName: 'api-tls-secret' }],
  },
  statusObj: {
    loadBalancer: {
      ingress: [{ ip: '203.0.113.10', hostname: 'api.example.com' }],
    },
  },
}

/**
 * 模拟 Ingress YAML 数据
 */
export const mockIngressYaml: IngressYamlVo = {
  yaml: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  namespace: default
  uid: ${mockIngressDetail.uid}
  creationTimestamp: "2024-03-10T10:00:00Z"
  labels:
    app.kubernetes.io/name: api-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 8080
  tls:
    - hosts:
        - api.example.com
      secretName: api-tls-secret
status:
  loadBalancer:
    ingress:
      - ip: 203.0.113.10
`,
}

/**
 * 模拟 Ingress 事件列表数据
 */
export const mockIngressEvents: EventListVo[] = [
  {
    name: 'event-ingress-created',
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
    reportingController: 'Ingress',
    reportingInstance: 'ingress-nginx',
    action: 'Created',
    reason: 'Created',
    regarding: {
      apiVersion: 'networking.k8s.io/v1',
      kind: 'Ingress',
      name: 'api-ingress',
      namespace: 'default',
      uid: mockIngressDetail.uid,
    },
    note: 'Ingress api-ingress created',
    type: 'Normal',
  },
  {
    name: 'event-ingress-provisioned',
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
    reportingController: 'Ingress',
    reportingInstance: 'ingress-nginx',
    action: 'Provisioning',
    reason: 'ProvisioningSucceeded',
    regarding: {
      apiVersion: 'networking.k8s.io/v1',
      kind: 'Ingress',
      name: 'api-ingress',
      namespace: 'default',
      uid: mockIngressDetail.uid,
    },
    note: 'Load balancer provisioned successfully',
    type: 'Normal',
  },
]
