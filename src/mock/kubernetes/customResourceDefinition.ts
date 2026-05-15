/**
 * @fileOverview CustomResourceDefinition Mock 数据
 * @module mock/kubernetes/customResourceDefinition
 */
import { getCustomResourceDefinitionPage, getCustomResourceDefinitionDetail } from '@/api/kubernetes/customResourceDefinition'
import { generateId } from '@/mock/utils'
import type { CustomResourceDefinitionResp, CustomResourceDefinitionQueryReq } from '@/types/kubernetes/customResourceDefinition'

/**
 * CustomResourceDefinition Mock 数据
 */
const mockCustomResourceDefinitions: CustomResourceDefinitionResp[] = [
  {
    id: generateId(),
    name: 'alertmanagers.monitoring.coreos.com',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    group: 'monitoring.coreos.com',
    versions: [{ name: 'v1', served: true, storage: true }],
    scope: 'Namespaced',
    resource: {
      name: 'alertmanagers',
      kind: 'Alertmanager',
      namespaced: true,
      versions: ['v1']
    },
    creationTimestamp: '2024-01-15T10:00:00Z',
    labels: { 'k8s-app': 'alertmanager' },
    deletable: false,
    createAt: '2024-01-15T10:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-15T10:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'prometheuses.monitoring.coreos.com',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    group: 'monitoring.coreos.com',
    versions: [{ name: 'v1', served: true, storage: true }],
    scope: 'Namespaced',
    resource: {
      name: 'prometheuses',
      kind: 'Prometheus',
      namespaced: true,
      versions: ['v1']
    },
    creationTimestamp: '2024-01-15T10:00:00Z',
    labels: { 'k8s-app': 'prometheus' },
    deletable: false,
    createAt: '2024-01-15T10:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-15T10:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'servicemonitors.monitoring.coreos.com',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    group: 'monitoring.coreos.com',
    versions: [{ name: 'v1', served: true, storage: true }],
    scope: 'Namespaced',
    resource: {
      name: 'servicemonitors',
      kind: 'ServiceMonitor',
      namespaced: true,
      versions: ['v1']
    },
    creationTimestamp: '2024-01-15T10:00:00Z',
    labels: { 'k8s-app': 'servicemonitor' },
    deletable: false,
    createAt: '2024-01-15T10:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-15T10:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'ingresses.networking.k8s.io',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    group: 'networking.k8s.io',
    versions: [{ name: 'v1', served: true, storage: true }],
    scope: 'Namespaced',
    resource: {
      name: 'ingresses',
      kind: 'Ingress',
      namespaced: true,
      versions: ['v1'],
      shortNames: ['ing']
    },
    creationTimestamp: '2024-01-01T00:00:00Z',
    labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' },
    deletable: false,
    createAt: '2024-01-01T00:00:00Z',
    createBy: 'system',
    updateAt: '2024-01-01T00:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'certificates.cert-manager.io',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    group: 'cert-manager.io',
    versions: [
      { name: 'v1', served: true, storage: true },
      { name: 'v1alpha2', served: true, storage: false },
      { name: 'v1alpha3', served: true, storage: false }
    ],
    scope: 'Namespaced',
    resource: {
      name: 'certificates',
      kind: 'Certificate',
      namespaced: true,
      versions: ['v1', 'v1alpha2', 'v1alpha3'],
      shortNames: ['cert', 'certs']
    },
    creationTimestamp: '2024-02-10T14:00:00Z',
    labels: { app: 'cert-manager' },
    deletable: false,
    createAt: '2024-02-10T14:00:00Z',
    createBy: 'system',
    updateAt: '2024-02-10T14:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'volumesnapshotclasses.snapshot.storage.k8s.io',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    group: 'snapshot.storage.k8s.io',
    versions: [{ name: 'v1', served: true, storage: true }],
    scope: 'Cluster',
    resource: {
      name: 'volumesnapshotclasses',
      kind: 'VolumeSnapshotClass',
      namespaced: false,
      versions: ['v1']
    },
    creationTimestamp: '2024-02-20T09:00:00Z',
    labels: { app: 'csi-snapshot' },
    deletable: false,
    createAt: '2024-02-20T09:00:00Z',
    createBy: 'system',
    updateAt: '2024-02-20T09:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'clusterissuers.cert-manager.io',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    group: 'cert-manager.io',
    versions: [{ name: 'v1', served: true, storage: true }],
    scope: 'Cluster',
    resource: {
      name: 'clusterissuers',
      kind: 'ClusterIssuer',
      namespaced: false,
      versions: ['v1']
    },
    creationTimestamp: '2024-02-10T14:00:00Z',
    labels: { app: 'cert-manager' },
    deletable: false,
    createAt: '2024-02-10T14:00:00Z',
    createBy: 'system',
    updateAt: '2024-02-10T14:00:00Z',
    updateBy: 'system'
  },
  {
    id: generateId(),
    name: 'argoproj.io.applicationsets',
    clusterId: 'cluster-1',
    clusterName: 'prod-cluster',
    group: 'argoproj.io',
    versions: [{ name: 'v1alpha1', served: true, storage: true }],
    scope: 'Namespaced',
    resource: {
      name: 'applicationsets',
      kind: 'ApplicationSet',
      namespaced: true,
      versions: ['v1alpha1']
    },
    creationTimestamp: '2024-03-05T11:00:00Z',
    labels: { app: 'argocd-applicationset' },
    deletable: false,
    createAt: '2024-03-05T11:00:00Z',
    createBy: 'system',
    updateAt: '2024-03-05T11:00:00Z',
    updateBy: 'system'
  }
]

export default [
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/customresourcedefinitions',
    handler: (pathParams: Record<string, string>, params: CustomResourceDefinitionQueryReq) => getCustomResourceDefinitionPage(pathParams.clusterId, params)
  },
  {
    method: 'GET',
    url: '/kubernetes/clusters/:clusterId/customresourcedefinitions/:name',
    handler: (pathParams: Record<string, string>) => getCustomResourceDefinitionDetail(pathParams.clusterId, pathParams.name)
  }
]
