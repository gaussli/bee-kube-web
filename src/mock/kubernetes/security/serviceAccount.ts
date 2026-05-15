/**
 * @fileOverview ServiceAccount Mock 数据
 * @module mock/kubernetes/security/serviceAccount
 */
import { getServiceAccountPage, getServiceAccountDetail } from '@/api/kubernetes/security/serviceAccount'
import { generateId } from '@/mock/utils'
import type { ServiceAccountResp, ServiceAccountQueryReq } from '@/types/kubernetes/serviceAccount'

/**
 * ServiceAccount Mock 数据
 */
const mockServiceAccount: ServiceAccountResp[] = [
  {
    id: generateId(),
    name: 'default',
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    secrets: [{ name: 'default-token-abc123', namespace: 'default' }],
    imagePullSecrets: [],
    automountServiceAccountToken: true,
    labels: { 'kubernetes.io/cluster-service': 'true' },
    annotations: {},
    deletable: false,
    createAt: '2024-01-15T08:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-15T08:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'kube-dns',
    namespace: 'kube-system',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    secrets: [{ name: 'kube-dns-token-xyz789', namespace: 'kube-system' }],
    imagePullSecrets: [],
    automountServiceAccountToken: false,
    labels: { 'k8s-app': 'kube-dns', 'kubernetes.io/cluster-service': 'true' },
    annotations: { 'kubernetes.io/description': 'DNS service account' },
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
    secrets: [{ name: `${generateId()}-token`, namespace: 'default' }],
    imagePullSecrets: [{ name: generateImagePullSecretName() }],
    automountServiceAccountToken: true,
    labels: { 'app.kubernetes.io/name': 'sample-app' },
    annotations: {},
    deletable: true,
    createAt: '2024-03-10T10:30:00Z',
    createBy: 'admin',
    updateAt: '2024-03-10T10:30:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'default',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    secrets: [{ name: `${generateId()}-token`, namespace: 'default' }],
    imagePullSecrets: [],
    automountServiceAccountToken: true,
    labels: { 'app.kubernetes.io/component': 'backend' },
    annotations: { description: 'Backend service account' },
    deletable: true,
    createAt: '2024-03-15T14:20:00Z',
    createBy: 'admin',
    updateAt: '2024-03-15T14:20:00Z',
    updateBy: 'admin'
  },
  {
    id: generateId(),
    name: generateId(),
    namespace: 'kube-system',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    secrets: [{ name: `${generateId()}-token`, namespace: 'kube-system' }],
    imagePullSecrets: [{ name: generateImagePullSecretName() }, { name: generateImagePullSecretName() }],
    automountServiceAccountToken: false,
    labels: { 'k8s-app': 'monitoring' },
    annotations: {},
    deletable: true,
    createAt: '2024-03-20T09:00:00Z',
    createBy: 'admin',
    updateAt: '2024-03-20T09:00:00Z',
    updateBy: 'admin'
  }
]

export default [
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceId/serviceaccounts',
    handler: (pathParams: Record<string, string>, params: ServiceAccountQueryReq) => getServiceAccountPage(pathParams.clusterId, params)
  },
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/namespaces/:namespaceName/serviceaccounts/:name',
    handler: (pathParams: Record<string, string>) => getServiceAccountDetail(pathParams.clusterId, pathParams.namespaceName, pathParams.name)
  }
]
