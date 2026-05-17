/**
 * @fileOverview Ingress Mock 数据
 * @module mock/kubernetes/network/ingress
 */
import type { IngressResp, IngressQueryReq } from '@/types/kubernetes/ingress'
import { getIngressPage, getIngressDetail } from '@/api/kubernetes/network/ingress'
import { generateId } from '@/mock/utils'

/**
 * Ingress Mock 数据
 */
const mockIngresses: IngressResp[] = [
  {
    id: generateId(),
    name: generateId(),
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    ingressClassName: 'nginx',
    rules: [
      {
        host: 'api.example.com',
        paths: [{ path: '/', pathType: 'Prefix', serviceName: 'api-service', servicePort: 8080 }]
      }
    ],
    tls: [{ hosts: ['api.example.com'], secretName: 'api-tls-secret' }],
    loadBalancer: [
      {
        ip: '203.0.113.10',
        hostname: 'api.example.com',
        ports: [
          { port: 80, protocol: 'TCP', name: 'http' },
          { port: 443, protocol: 'TCP', name: 'https' }
        ]
      }
    ],
    labels: { 'app.kubernetes.io/name': 'api-ingress' },
    annotations: {
      'nginx.ingress.kubernetes.io/rewrite-target': '/',
      'nginx.ingress.kubernetes.io/ssl-redirect': 'true'
    },
    deletable: true,
    createAt: '2024-03-10T10:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T10:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    ingressClassName: 'nginx',
    rules: [
      {
        host: 'www.example.com',
        paths: [{ path: '/', pathType: 'Prefix', serviceName: 'frontend-service', servicePort: 80 }]
      },
      {
        host: 'app.example.com',
        paths: [{ path: '/', pathType: 'Prefix', serviceName: 'frontend-service', servicePort: 80 }]
      }
    ],
    tls: [{ hosts: ['www.example.com', 'app.example.com'], secretName: 'web-tls-secret' }],
    loadBalancer: [
      {
        ip: '203.0.113.11',
        ports: [
          { port: 80, protocol: 'TCP', name: 'http' },
          { port: 443, protocol: 'TCP', name: 'https' }
        ]
      }
    ],
    labels: { 'app.kubernetes.io/name': 'frontend-ingress' },
    annotations: {
      'nginx.ingress.kubernetes.io/proxy-body-size': '50m',
      'nginx.ingress.kubernetes.io/proxy-connect-timeout': '30'
    },
    deletable: true,
    createAt: '2024-03-15T09:30:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T09:30:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'monitoring',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    ingressClassName: 'nginx',
    rules: [
      {
        host: 'prometheus.example.com',
        paths: [{ path: '/', pathType: 'Prefix', serviceName: 'prometheus', servicePort: 9090 }]
      }
    ],
    tls: [{ hosts: ['prometheus.example.com'], secretName: 'monitoring-tls-secret' }],
    loadBalancer: [
      {
        ip: '203.0.113.12',
        ports: [{ port: 443, protocol: 'TCP', name: 'https' }]
      }
    ],
    labels: { 'app.kubernetes.io/name': 'prometheus-ingress', 'app.kubernetes.io/component': 'monitoring' },
    annotations: {
      'nginx.ingress.kubernetes.io/auth-type': 'basic',
      'nginx.ingress.kubernetes.io/auth-secret': 'basic-auth',
      'nginx.ingress.kubernetes.io/auth-realm': 'Prometheus Monitoring'
    },
    deletable: true,
    createAt: '2024-03-20T14:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-20T14:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    ingressClassName: 'traefik',
    rules: [
      {
        paths: [
          { path: '/api', pathType: 'Prefix', serviceName: 'backend-api', servicePort: 8080 },
          { path: '/admin', pathType: 'Prefix', serviceName: 'backend-admin', servicePort: 8081 }
        ]
      }
    ],
    labels: { 'app.kubernetes.io/name': 'backend-ingress' },
    annotations: {
      'traefik.ingress.kubernetes.io/router.entrypoints': 'web,websecure'
    },
    deletable: true,
    createAt: '2024-03-25T11:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-25T11:00:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'monitoring',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    ingressClassName: 'nginx',
    rules: [
      {
        host: 'grafana.example.com',
        paths: [{ path: '/', pathType: 'Prefix', serviceName: 'grafana', servicePort: 3000 }]
      }
    ],
    tls: [{ hosts: ['grafana.example.com'] }],
    loadBalancer: [
      {
        hostname: 'grafana.example.com',
        ports: [{ port: 443, protocol: 'TCP', name: 'https' }]
      }
    ],
    labels: { 'app.kubernetes.io/name': 'grafana-ingress', 'app.kubernetes.io/component': 'monitoring' },
    annotations: {
      'nginx.ingress.kubernetes.io/proxy-buffer-size': '16k'
    },
    deletable: true,
    createAt: '2024-03-28T08:30:00Z',
    createBy: 'admin',
    updateAt: '2024-03-28T08:30:00Z',
    updateBy: 'admin'
  }
]

export default [
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceId/ingresses',
    handler: (_pathParams: Record<string, string>, _params: IngressQueryReq) => getIngressPage(_pathParams.clusterId, _params)
  },
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/ingresses/:name',
    handler: (_pathParams: Record<string, string>) => getIngressDetail(_pathParams.clusterId, pathParams.namespaceName, pathParams.name)
  }
]
