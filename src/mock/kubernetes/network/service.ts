/**
 * @fileOverview Service Mock 数据
 * @module mock/kubernetes/network/service
 */
import { getServicePage, getServiceDetail } from '@/api/kubernetes/network/service'
import { generateId } from '@/mock/utils'
import type { ServiceResp, ServiceQueryReq } from '@/types/kubernetes/service'

/**
 * Service Mock 数据
 */
const mockServices: ServiceResp[] = [
  {
    id: generateId(),
    name: 'kubernetes',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    type: 'ClusterIP',
    clusterIp: '10.96.0.1',
    ports: [{ name: 'https', protocol: 'TCP', port: 443, targetPort: 443 }],
    selector: { component: 'apiserver' },
    labels: { 'kubernetes.io/cluster-service': 'true', 'kubernetes.io/name': 'kubernetes' },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'kube-dns',
    namespace: 'kube-system',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    type: 'ClusterIP',
    clusterIp: '10.96.0.10',
    ports: [
      { name: 'dns', protocol: 'UDP', port: 53, targetPort: 53 },
      { name: 'dns-tcp', protocol: 'TCP', port: 53, targetPort: 53 }
    ],
    selector: { 'k8s-app': 'kube-dns' },
    labels: { 'k8s-app': 'kube-dns', 'kubernetes.io/cluster-service': 'true' },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    type: 'ClusterIP',
    clusterIp: '10.96.0.100',
    ports: [{ name: 'http', protocol: 'TCP', port: 80, targetPort: 8080 }],
    selector: { app: 'frontend' },
    labels: { 'app.kubernetes.io/name': 'frontend', 'app.kubernetes.io/component': 'web' },
    deletable: true,
    createAt: '2024-03-10T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T09:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    type: 'NodePort',
    clusterIp: '10.96.0.101',
    ports: [{ name: 'http', protocol: 'TCP', port: 8080, targetPort: 8080, nodePort: 30080 }],
    selector: { app: 'backend' },
    labels: { 'app.kubernetes.io/name': 'backend', 'app.kubernetes.io/component': 'api' },
    deletable: true,
    createAt: '2024-03-15T10:30:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T10:30:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    type: 'LoadBalancer',
    clusterIp: '10.96.0.102',
    ports: [
      { name: 'http', protocol: 'TCP', port: 80, targetPort: 8080 },
      { name: 'https', protocol: 'TCP', port: 443, targetPort: 8443 }
    ],
    selector: { app: 'api' },
    loadBalancer: {
      ip: '203.0.113.10',
      ingress: [{ ip: '203.0.113.10' }]
    },
    labels: { 'app.kubernetes.io/name': 'api-service', 'app.kubernetes.io/component': 'api' },
    annotations: { 'service.beta.kubernetes.io/aws-load-balancer-type': 'nlb' },
    deletable: true,
    createAt: '2024-03-20T14:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-20T14:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'monitoring',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    type: 'ClusterIP',
    clusterIp: '10.96.0.200',
    ports: [
      { name: 'http', protocol: 'TCP', port: 9090, targetPort: 9090 },
      { name: 'metrics', protocol: 'TCP', port: 9091, targetPort: 9091 }
    ],
    selector: { app: 'prometheus' },
    labels: { 'app.kubernetes.io/name': 'prometheus', 'app.kubernetes.io/component': 'monitoring' },
    deletable: true,
    createAt: '2024-03-25T08:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-25T08:00:00Z',
    updateBy: 'admin'
  }
]

export default [
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceId/services',
    handler: (pathParams: Record<string, string>, params: ServiceQueryReq) => getServicePage(pathParams.clusterId, params)
  },
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/services/:name',
    handler: (pathParams: Record<string, string>) => getServiceDetail(pathParams.clusterId, pathParams.namespaceName, pathParams.name)
  }
]
