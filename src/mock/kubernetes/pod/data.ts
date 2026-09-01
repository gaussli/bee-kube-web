import type { EventListVo } from '@/types/kubernetes/event'
import type { PodDetailVo, PodListVo, PodMonitorVo } from '@/types/kubernetes/pod'
import type { Container } from '@/types/kubernetes/pod/container/types'
import type { ContainerStatus, HostIP, PodIP, PodSpec, PodStatusObj } from '@/types/kubernetes/pod/types'
import type { Volume } from '@/types/kubernetes/pod/volume/types'
import type { Condition } from '@/types/kubernetes/types'

import type { PodConditionType, PodQOSClass } from '@/config/kubernetes/pod'

import { generateId } from '@/mock/utils'

export const mockPodList: PodListVo[] = [
  // ==================== Running (10个) ====================
  {
    uid: generateId(),
    name: 'nginx-7d8f9c6b5d-abc12',
    description: 'Nginx 前端服务 Pod',
    status: 'Running',
    statusMsg: 'Pod 运行正常，所有容器就绪',
    ip: '10.244.1.5',
    restarts: 0,
    nodeIp: '10.0.2.10',
    nodeName: 'worker-01',
    readyContainerCount: 1,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 256, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 1, unit: '' },
        memory: { value: 512, unit: 'Mi' },
      },
      usage: {
        cpu: { value: 0.3, unit: '' },
        memory: { value: 180, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'default',
    createAt: '2025-06-01 08:00:00',
    createBy: 'admin',
    updateAt: '2025-08-20 10:30:00',
    updateBy: 'sre-team',
  },
  {
    uid: generateId(),
    name: 'api-7d8f9c6b5f-def34',
    description: 'API 网关 Pod',
    status: 'Running',
    statusMsg: '运行中，健康检查通过',
    ip: '10.244.2.8',
    restarts: 1,
    nodeIp: '10.0.2.11',
    nodeName: 'worker-02',
    readyContainerCount: 2,
    containerCount: 2,
    resource: {
      request: {
        cpu: { value: 1, unit: '' },
        memory: { value: 1, unit: 'Gi' },
      },
      limit: {
        cpu: { value: 2, unit: '' },
        memory: { value: 2, unit: 'Gi' },
      },
      usage: {
        cpu: { value: 0.8, unit: '' },
        memory: { value: 600, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    namespaceUid: generateId(),
    namespace: 'api',
    createAt: '2025-05-15 09:00:00',
    createBy: 'devops',
    updateAt: '2025-08-18 14:20:00',
    updateBy: 'devops',
  },
  {
    uid: generateId(),
    name: 'mysql-0',
    description: 'MySQL StatefulSet Pod',
    status: 'Running',
    statusMsg: '数据库运行正常',
    ip: '10.244.3.12',
    restarts: 0,
    nodeIp: '10.0.2.12',
    nodeName: 'worker-03',
    readyContainerCount: 1,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 2, unit: '' },
        memory: { value: 4, unit: 'Gi' },
      },
      limit: {
        cpu: { value: 4, unit: '' },
        memory: { value: 8, unit: 'Gi' },
      },
      usage: {
        cpu: { value: 1.5, unit: '' },
        memory: { value: 2.5, unit: 'Gi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'database',
    createAt: '2025-04-10 07:30:00',
    createBy: 'dba',
    updateAt: '2025-08-15 16:45:00',
    updateBy: 'dba',
  },
  {
    uid: generateId(),
    name: 'prometheus-7d8f9c6b5j-mno90',
    description: 'Prometheus 监控 Pod',
    status: 'Running',
    statusMsg: '运行中，指标采集正常',
    ip: '10.244.4.20',
    restarts: 2,
    nodeIp: '10.0.2.14',
    nodeName: 'worker-04',
    readyContainerCount: 1,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 1, unit: '' },
        memory: { value: 2, unit: 'Gi' },
      },
      limit: {
        cpu: { value: 2, unit: '' },
        memory: { value: 4, unit: 'Gi' },
      },
      usage: {
        cpu: { value: 1.2, unit: '' },
        memory: { value: 1.8, unit: 'Gi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'monitoring',
    createAt: '2025-02-28 08:00:00',
    createBy: 'devops',
    updateAt: '2025-08-19 10:40:00',
    updateBy: 'devops',
  },
  {
    uid: generateId(),
    name: 'grafana-7d8f9c6b5k-pqr12',
    description: 'Grafana 面板 Pod',
    status: 'Running',
    statusMsg: '运行正常',
    ip: '10.244.4.21',
    restarts: 0,
    nodeIp: '10.0.2.15',
    nodeName: 'worker-05',
    readyContainerCount: 1,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 512, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 1, unit: '' },
        memory: { value: 1, unit: 'Gi' },
      },
      usage: {
        cpu: { value: 0.2, unit: '' },
        memory: { value: 256, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    namespaceUid: generateId(),
    namespace: 'monitoring',
    createAt: '2025-04-15 07:00:00',
    createBy: 'devops',
    updateAt: '2025-08-20 16:30:00',
    updateBy: 'devops',
  },
  {
    uid: generateId(),
    name: 'fluentbit-7d8f9c6b5l-stu34',
    description: '日志采集 FluentBit Pod',
    status: 'Running',
    statusMsg: '运行中，日志转发正常',
    ip: '10.244.5.6',
    restarts: 0,
    nodeIp: '10.0.3.10',
    nodeName: 'worker-06',
    readyContainerCount: 1,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.2, unit: '' },
        memory: { value: 128, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 256, unit: 'Mi' },
      },
      usage: {
        cpu: { value: 0.1, unit: '' },
        memory: { value: 80, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'logging',
    createAt: '2025-06-20 08:30:00',
    createBy: 'sre',
    updateAt: '2025-08-19 09:10:00',
    updateBy: 'sre',
  },
  {
    uid: generateId(),
    name: 'redis-7d8f9c6b5m-vwx56',
    description: 'Redis 缓存 Pod',
    status: 'Running',
    statusMsg: '运行正常，缓存命中率高',
    ip: '10.244.6.9',
    restarts: 0,
    nodeIp: '10.0.3.11',
    nodeName: 'worker-07',
    readyContainerCount: 1,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 1, unit: 'Gi' },
      },
      limit: {
        cpu: { value: 1, unit: '' },
        memory: { value: 2, unit: 'Gi' },
      },
      usage: {
        cpu: { value: 0.3, unit: '' },
        memory: { value: 600, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-guangzhou',
    namespaceUid: generateId(),
    namespace: 'cache',
    createAt: '2025-03-22 06:00:00',
    createBy: 'developer',
    updateAt: '2025-08-22 11:00:00',
    updateBy: 'developer',
  },
  {
    uid: generateId(),
    name: 'kafka-0',
    description: 'Kafka Broker 0',
    status: 'Running',
    statusMsg: 'Kafka 运行正常，分区 Leader 均衡',
    ip: '10.244.7.14',
    restarts: 1,
    nodeIp: '10.0.3.12',
    nodeName: 'worker-08',
    readyContainerCount: 1,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 2, unit: '' },
        memory: { value: 4, unit: 'Gi' },
      },
      limit: {
        cpu: { value: 4, unit: '' },
        memory: { value: 8, unit: 'Gi' },
      },
      usage: {
        cpu: { value: 1.8, unit: '' },
        memory: { value: 3.2, unit: 'Gi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'messaging',
    createAt: '2025-07-05 06:00:00',
    createBy: 'data-team',
    updateAt: '2025-08-22 15:00:00',
    updateBy: 'data-team',
  },
  {
    uid: generateId(),
    name: 'zookeeper-0',
    description: 'Zookeeper 节点 0',
    status: 'Running',
    statusMsg: 'Zookeeper 正常',
    ip: '10.244.7.15',
    restarts: 0,
    nodeIp: '10.0.3.13',
    nodeName: 'worker-09',
    readyContainerCount: 1,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 512, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 1, unit: '' },
        memory: { value: 1, unit: 'Gi' },
      },
      usage: {
        cpu: { value: 0.3, unit: '' },
        memory: { value: 280, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    namespaceUid: generateId(),
    namespace: 'zookeeper',
    createAt: '2025-04-20 06:30:00',
    createBy: 'data-team',
    updateAt: '2025-08-16 08:40:00',
    updateBy: 'data-team',
  },
  {
    uid: generateId(),
    name: 'nginx-ingress-7d8f9c6b5r-yz78',
    description: 'Nginx Ingress Controller Pod',
    status: 'Running',
    statusMsg: 'Ingress 流量转发正常',
    ip: '10.244.8.22',
    restarts: 0,
    nodeIp: '10.0.3.14',
    nodeName: 'worker-10',
    readyContainerCount: 1,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 256, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 1, unit: '' },
        memory: { value: 512, unit: 'Mi' },
      },
      usage: {
        cpu: { value: 0.4, unit: '' },
        memory: { value: 200, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'ingress',
    createAt: '2025-02-14 09:00:00',
    createBy: 'net-team',
    updateAt: '2025-08-17 15:10:00',
    updateBy: 'net-team',
  },

  // ==================== Pending (5个) ====================
  {
    uid: generateId(),
    name: 'pending-job-xyz',
    description: '等待调度的 Job Pod',
    status: 'Pending',
    statusMsg: '等待调度，节点资源不足',
    ip: '',
    restarts: 0,
    nodeIp: '',
    nodeName: '',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 4, unit: '' },
        memory: { value: 8, unit: 'Gi' },
      },
      limit: {
        cpu: { value: 4, unit: '' },
        memory: { value: 8, unit: 'Gi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'batch',
    createAt: '2025-08-28 08:00:00',
    createBy: 'system',
    updateAt: '2025-08-28 08:00:00',
    updateBy: 'system',
  },
  {
    uid: generateId(),
    name: 'pending-pod-abc',
    description: 'Pending Pod 示例',
    status: 'Pending',
    statusMsg: '镜像拉取中',
    ip: '',
    restarts: 0,
    nodeIp: '',
    nodeName: 'worker-11',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 256, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 1, unit: '' },
        memory: { value: 512, unit: 'Mi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'staging-beijing',
    namespaceUid: generateId(),
    namespace: 'default',
    createAt: '2025-08-28 08:15:00',
    createBy: 'developer',
    updateAt: '2025-08-28 08:20:00',
    updateBy: 'developer',
  },
  {
    uid: generateId(),
    name: 'pending-pvc-pod',
    description: '等待 PVC 绑定的 Pod',
    status: 'Pending',
    statusMsg: 'PVC 未就绪',
    ip: '',
    restarts: 0,
    nodeIp: '',
    nodeName: '',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 512, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 1, unit: '' },
        memory: { value: 1, unit: 'Gi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'dev-guangzhou',
    namespaceUid: generateId(),
    namespace: 'storage',
    createAt: '2025-08-28 08:30:00',
    createBy: 'developer',
    updateAt: '2025-08-28 08:30:00',
    updateBy: 'developer',
  },
  {
    uid: generateId(),
    name: 'pending-scheduler',
    description: '调度器无法满足的 Pod',
    status: 'Pending',
    statusMsg: '没有节点满足节点亲和性',
    ip: '',
    restarts: 0,
    nodeIp: '',
    nodeName: '',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 8, unit: '' },
        memory: { value: 16, unit: 'Gi' },
      },
      limit: {
        cpu: { value: 8, unit: '' },
        memory: { value: 16, unit: 'Gi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'bigdata',
    createAt: '2025-08-28 08:40:00',
    createBy: 'data-engineer',
    updateAt: '2025-08-28 08:40:00',
    updateBy: 'data-engineer',
  },
  {
    uid: generateId(),
    name: 'pending-configmap',
    description: '等待 ConfigMap 的 Pod',
    status: 'Pending',
    statusMsg: 'ConfigMap 不存在',
    ip: '',
    restarts: 0,
    nodeIp: '',
    nodeName: '',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.2, unit: '' },
        memory: { value: 64, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 128, unit: 'Mi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'staging-shanghai',
    namespaceUid: generateId(),
    namespace: 'default',
    createAt: '2025-08-28 08:45:00',
    createBy: 'developer',
    updateAt: '2025-08-28 08:45:00',
    updateBy: 'developer',
  },

  // ==================== Succeeded (5个) ====================
  {
    uid: generateId(),
    name: 'pi-job-28374601',
    description: '计算 π 的任务 Pod',
    status: 'Succeeded',
    statusMsg: '任务完成',
    ip: '10.244.9.10',
    restarts: 0,
    nodeIp: '10.0.3.15',
    nodeName: 'worker-12',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 1, unit: '' },
        memory: { value: 512, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 1, unit: '' },
        memory: { value: 512, unit: 'Mi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'batch',
    createAt: '2025-08-28 07:00:00',
    createBy: 'admin',
    updateAt: '2025-08-28 08:00:00',
    updateBy: 'system',
  },
  {
    uid: generateId(),
    name: 'db-migration-28374634',
    description: '数据库迁移 Job',
    status: 'Succeeded',
    statusMsg: '迁移完成',
    ip: '10.244.9.11',
    restarts: 0,
    nodeIp: '10.0.3.16',
    nodeName: 'worker-13',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 2, unit: '' },
        memory: { value: 1, unit: 'Gi' },
      },
      limit: {
        cpu: { value: 2, unit: '' },
        memory: { value: 1, unit: 'Gi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    namespaceUid: generateId(),
    namespace: 'database',
    createAt: '2025-08-28 07:30:00',
    createBy: 'dba',
    updateAt: '2025-08-28 08:10:00',
    updateBy: 'system',
  },
  {
    uid: generateId(),
    name: 'backup-job-28374645',
    description: '备份任务',
    status: 'Succeeded',
    statusMsg: '备份完成',
    ip: '10.244.9.12',
    restarts: 0,
    nodeIp: '10.0.4.10',
    nodeName: 'worker-14',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 512, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 512, unit: 'Mi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'storage',
    createAt: '2025-08-28 06:00:00',
    createBy: 'ops',
    updateAt: '2025-08-28 07:30:00',
    updateBy: 'system',
  },
  {
    uid: generateId(),
    name: 'test-job-abc',
    description: '测试任务',
    status: 'Succeeded',
    statusMsg: '测试通过',
    ip: '10.244.9.13',
    restarts: 0,
    nodeIp: '10.0.4.11',
    nodeName: 'worker-15',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.1, unit: '' },
        memory: { value: 64, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 0.1, unit: '' },
        memory: { value: 64, unit: 'Mi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'staging-beijing',
    namespaceUid: generateId(),
    namespace: 'test',
    createAt: '2025-08-28 07:00:00',
    createBy: 'qa',
    updateAt: '2025-08-28 07:20:00',
    updateBy: 'system',
  },
  {
    uid: generateId(),
    name: 'data-cleanup',
    description: '数据清理任务',
    status: 'Succeeded',
    statusMsg: '清理成功',
    ip: '10.244.9.14',
    restarts: 0,
    nodeIp: '10.0.4.12',
    nodeName: 'worker-16',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 1, unit: '' },
        memory: { value: 1, unit: 'Gi' },
      },
      limit: {
        cpu: { value: 1, unit: '' },
        memory: { value: 1, unit: 'Gi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-guangzhou',
    namespaceUid: generateId(),
    namespace: 'cleanup',
    createAt: '2025-08-28 05:00:00',
    createBy: 'admin',
    updateAt: '2025-08-28 06:00:00',
    updateBy: 'system',
  },

  // ==================== Failed (5个) ====================
  {
    uid: generateId(),
    name: 'failed-job-123',
    description: '失败的任务 Pod',
    status: 'Failed',
    statusMsg: '容器退出码 1',
    ip: '10.244.10.5',
    restarts: 0,
    nodeIp: '10.0.4.13',
    nodeName: 'worker-17',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 256, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 256, unit: 'Mi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'batch',
    createAt: '2025-08-28 07:00:00',
    createBy: 'admin',
    updateAt: '2025-08-28 07:10:00',
    updateBy: 'system',
  },
  {
    uid: generateId(),
    name: 'image-pull-fail',
    description: '镜像拉取失败 Pod',
    status: 'Failed',
    statusMsg: '镜像拉取错误: ErrImagePull',
    ip: '',
    restarts: 0,
    nodeIp: '10.0.4.14',
    nodeName: 'worker-18',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.2, unit: '' },
        memory: { value: 128, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 0.2, unit: '' },
        memory: { value: 128, unit: 'Mi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'staging-beijing',
    namespaceUid: generateId(),
    namespace: 'default',
    createAt: '2025-08-28 08:00:00',
    createBy: 'developer',
    updateAt: '2025-08-28 08:05:00',
    updateBy: 'system',
  },
  {
    uid: generateId(),
    name: 'oom-killed',
    description: '内存溢出被杀死',
    status: 'Failed',
    statusMsg: 'OOMKilled',
    ip: '10.244.10.6',
    restarts: 0,
    nodeIp: '10.0.4.15',
    nodeName: 'worker-19',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 1, unit: '' },
        memory: { value: 2, unit: 'Gi' },
      },
      limit: {
        cpu: { value: 1, unit: '' },
        memory: { value: 2, unit: 'Gi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    namespaceUid: generateId(),
    namespace: 'monitoring',
    createAt: '2025-08-28 08:00:00',
    createBy: 'devops',
    updateAt: '2025-08-28 08:30:00',
    updateBy: 'system',
  },
  {
    uid: generateId(),
    name: 'evicted-pod',
    description: '被驱逐的 Pod',
    status: 'Failed',
    statusMsg: 'Evicted - 节点资源不足',
    ip: '',
    restarts: 0,
    nodeIp: '10.0.4.16',
    nodeName: 'worker-20',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 512, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 512, unit: 'Mi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'default',
    createAt: '2025-08-28 08:00:00',
    createBy: 'admin',
    updateAt: '2025-08-28 08:15:00',
    updateBy: 'system',
  },
  {
    uid: generateId(),
    name: 'container-error',
    description: '容器启动错误',
    status: 'Failed',
    statusMsg: 'ContainerCannotRun',
    ip: '10.244.10.7',
    restarts: 0,
    nodeIp: '10.0.4.17',
    nodeName: 'worker-21',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.1, unit: '' },
        memory: { value: 64, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 0.1, unit: '' },
        memory: { value: 64, unit: 'Mi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'staging-shanghai',
    namespaceUid: generateId(),
    namespace: 'default',
    createAt: '2025-08-28 08:00:00',
    createBy: 'developer',
    updateAt: '2025-08-28 08:10:00',
    updateBy: 'system',
  },

  // ==================== Unknown (5个) ====================
  {
    uid: generateId(),
    name: 'unknown-pod-1',
    description: '状态未知的 Pod',
    status: 'Unknown',
    statusMsg: '节点失联，状态未知',
    ip: '',
    restarts: 0,
    nodeIp: '10.0.5.10',
    nodeName: 'worker-22',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.2, unit: '' },
        memory: { value: 128, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 0.2, unit: '' },
        memory: { value: 128, unit: 'Mi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'default',
    createAt: '2025-08-28 08:00:00',
    createBy: 'admin',
    updateAt: '2025-08-28 08:30:00',
    updateBy: 'system',
  },
  {
    uid: generateId(),
    name: 'unknown-pod-2',
    description: '网络分区导致状态未知',
    status: 'Unknown',
    statusMsg: '节点未响应',
    ip: '',
    restarts: 0,
    nodeIp: '10.0.5.11',
    nodeName: 'worker-23',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 1, unit: '' },
        memory: { value: 1, unit: 'Gi' },
      },
      limit: {
        cpu: { value: 1, unit: '' },
        memory: { value: 1, unit: 'Gi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    namespaceUid: generateId(),
    namespace: 'api',
    createAt: '2025-08-28 08:00:00',
    createBy: 'devops',
    updateAt: '2025-08-28 08:35:00',
    updateBy: 'system',
  },
  {
    uid: generateId(),
    name: 'unknown-pod-3',
    description: '监控数据缺失',
    status: 'Unknown',
    statusMsg: '无法获取 Pod 状态',
    ip: '',
    restarts: 0,
    nodeIp: '10.0.5.12',
    nodeName: 'worker-24',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 256, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 0.5, unit: '' },
        memory: { value: 256, unit: 'Mi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'staging-beijing',
    namespaceUid: generateId(),
    namespace: 'logging',
    createAt: '2025-08-28 08:00:00',
    createBy: 'sre',
    updateAt: '2025-08-28 08:20:00',
    updateBy: 'system',
  },
  {
    uid: generateId(),
    name: 'unknown-pod-4',
    description: 'kubelet 异常',
    status: 'Unknown',
    statusMsg: 'kubelet 未上报状态',
    ip: '',
    restarts: 0,
    nodeIp: '10.0.5.13',
    nodeName: 'worker-25',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 0.1, unit: '' },
        memory: { value: 64, unit: 'Mi' },
      },
      limit: {
        cpu: { value: 0.1, unit: '' },
        memory: { value: 64, unit: 'Mi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-guangzhou',
    namespaceUid: generateId(),
    namespace: 'monitoring',
    createAt: '2025-08-28 08:00:00',
    createBy: 'devops',
    updateAt: '2025-08-28 08:25:00',
    updateBy: 'system',
  },
  {
    uid: generateId(),
    name: 'unknown-pod-5',
    description: '节点宕机',
    status: 'Unknown',
    statusMsg: '节点完全失联',
    ip: '',
    restarts: 0,
    nodeIp: '10.0.5.14',
    nodeName: 'worker-26',
    readyContainerCount: 0,
    containerCount: 1,
    resource: {
      request: {
        cpu: { value: 2, unit: '' },
        memory: { value: 4, unit: 'Gi' },
      },
      limit: {
        cpu: { value: 2, unit: '' },
        memory: { value: 4, unit: 'Gi' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Mi' },
      },
    },
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    namespaceUid: generateId(),
    namespace: 'database',
    createAt: '2025-08-28 08:00:00',
    createBy: 'dba',
    updateAt: '2025-08-28 08:10:00',
    updateBy: 'system',
  },
]

// ==================== Mock Container Definitions ====================

// 1. Mock Main Container
export const mockMainContainer: Container = {
  name: 'nginx',
  image: 'nginx:1.25',
  command: ['/bin/sh', '-c'],
  args: ['nginx -g "daemon off;"'],
  workingDir: '/usr/share/nginx/html',
  ports: [
    {
      name: 'http',
      containerPort: 80,
      protocol: 'TCP',
    },
  ],
  envFrom: [
    {
      prefix: 'NGINX_',
      configMapRef: {
        configMapName: 'nginx-config',
        optional: false,
      },
    },
  ],
  env: [
    {
      name: 'POD_NAME',
      valueFrom: {
        fieldRef: {
          fieldPath: 'metadata.name',
        },
      },
    },
    {
      name: 'POD_NAMESPACE',
      valueFrom: {
        fieldRef: {
          fieldPath: 'metadata.namespace',
        },
      },
    },
    {
      name: 'CPU_LIMIT',
      valueFrom: {
        resourceFieldRef: {
          containerName: 'nginx',
          resource: 'limits.cpu',
          divisor: { value: 1, unit: '' },
        },
      },
    },
  ],
  resources: {
    request: {
      cpu: { value: 0.5, unit: '' },
      memory: { value: 256, unit: 'Mi' },
    },
    limit: {
      cpu: { value: 1, unit: '' },
      memory: { value: 512, unit: 'Mi' },
    },
  },
  volumeMounts: [
    {
      name: 'config-volume',
      mountPath: '/etc/nginx/conf.d',
      readOnly: true,
    },
    {
      name: 'html-volume',
      mountPath: '/usr/share/nginx/html',
      subPath: 'html',
    },
  ],
  volumeDevices: [],
  livenessProbe: {
    httpGet: {
      path: '/healthz',
      port: 80,
      scheme: 'HTTP',
    },
    initialDelaySeconds: 30,
    timeoutSeconds: 3,
    periodSeconds: 10,
    successThreshold: 1,
    failureThreshold: 3,
  },
  readinessProbe: {
    httpGet: {
      path: '/ready',
      port: 80,
      scheme: 'HTTP',
    },
    initialDelaySeconds: 5,
    timeoutSeconds: 2,
    periodSeconds: 5,
    successThreshold: 1,
    failureThreshold: 3,
  },
  startupProbe: {
    httpGet: {
      path: '/startup',
      port: 80,
      scheme: 'HTTP',
    },
    initialDelaySeconds: 0,
    timeoutSeconds: 5,
    periodSeconds: 10,
    successThreshold: 1,
    failureThreshold: 30,
  },
  lifecycle: {
    postStart: {
      exec: {
        command: ['/bin/sh', '-c', 'echo "Started"'],
      },
    },
    preStop: {
      exec: {
        command: ['/bin/sh', '-c', 'sleep 5'],
      },
    },
    stopSignal: 'SIGTERM',
  },
  terminationMessagePath: '/dev/termination-log',
  terminationMessagePolicy: 'File',
  imagePullPolicy: 'IfNotPresent',
  securityContext: {
    privileged: false,
    runAsUser: 1001,
    runAsNonRoot: true,
  },
  stdin: false,
  stdinOnce: false,
  tty: false,
}

// 2. Mock Init Container
export const mockInitContainer: Container = {
  name: 'init-db',
  image: 'busybox:1.36',
  command: ['sh', '-c'],
  args: ['echo "Initializing database" && sleep 5'],
  resources: {
    request: {
      cpu: { value: 0.1, unit: '' },
      memory: { value: 64, unit: 'Mi' },
    },
    limit: {
      cpu: { value: 0.2, unit: '' },
      memory: { value: 128, unit: 'Mi' },
    },
  },
  volumeMounts: [
    {
      name: 'init-script',
      mountPath: '/scripts',
      readOnly: true,
    },
  ],
  imagePullPolicy: 'IfNotPresent',
  securityContext: {
    runAsUser: 0,
  },
}

// 3. Mock Ephemeral Container (for debugging)
export const mockEphemeralContainer: Container = {
  name: 'debug-tools',
  image: 'alpine:3.19',
  command: ['sh'],
  args: ['-c', 'sleep 3600'],
  resources: {
    request: {
      cpu: { value: 0.1, unit: '' },
      memory: { value: 32, unit: 'Mi' },
    },
    limit: {
      cpu: { value: 0.2, unit: '' },
      memory: { value: 64, unit: 'Mi' },
    },
  },
  imagePullPolicy: 'Always',
  securityContext: {
    privileged: true,
  },
}

// ==================== Mock Volume Sources ====================

// 1. HostPath
export const mockHostPathVolume: Volume = {
  name: 'hostpath-volume',
  volumeSource: {
    hostPath: {
      path: '/data/logs',
      type: 'DirectoryOrCreate',
    },
  },
}

// 2. EmptyDir
export const mockEmptyDirVolume: Volume = {
  name: 'emptydir-volume',
  volumeSource: {
    emptyDir: {
      medium: 'Memory',
      sizeLimit: { value: 512, unit: 'Mi' },
    },
  },
}

// 3. ConfigMap
export const mockConfigMapVolume: Volume = {
  name: 'config-volume',
  volumeSource: {
    configMap: {
      configMapName: 'nginx-config',
      items: [
        {
          key: 'default.conf',
          path: 'default.conf',
          mode: 0o644,
        },
      ],
      defaultMode: 0o644,
      optional: false,
    },
  },
}

// 4. Secret
export const mockSecretVolume: Volume = {
  name: 'secret-volume',
  volumeSource: {
    secret: {
      secretName: 'db-secret',
      items: [
        {
          key: 'username',
          path: 'username',
          mode: 0o600,
        },
      ],
      defaultMode: 0o600,
      optional: false,
    },
  },
}

// 5. PVC
export const mockPVCVolume: Volume = {
  name: 'pvc-volume',
  volumeSource: {
    persistentVolumeClaim: {
      claimName: 'data-pvc',
      readOnly: false,
    },
  },
}

// Combine all volumes
export const mockVolumes: Volume[] = [
  mockHostPathVolume,
  mockEmptyDirVolume,
  mockConfigMapVolume,
  mockSecretVolume,
  mockPVCVolume,
]

// ==================== Pod StatusObj ====================

// Container statuses
export const mockContainerStatuses: ContainerStatus[] = [
  {
    name: 'nginx',
    state: {
      running: {
        startedAt: '2026-08-28 08:15:00',
      },
    },
    lastState: {
      terminated: {
        exitCode: 0,
        reason: 'Completed',
        startedAt: '2026-08-28 07:00:00',
        finishedAt: '2026-08-28 08:00:00',
        containerID: 'containerd://abc123',
      },
    },
    ready: true,
    restartCount: 0,
    image: 'nginx:1.25',
    imageID: 'docker.io/library/nginx@sha256:...',
    containerID: 'containerd://nginx123',
    started: true,
  },
]

export const mockInitContainerStatuses: ContainerStatus[] = [
  {
    name: 'init-db',
    state: {
      terminated: {
        exitCode: 0,
        reason: 'Completed',
        startedAt: '2026-08-28 08:00:00',
        finishedAt: '2026-08-28 08:05:00',
        containerID: 'containerd://init456',
      },
    },
    lastState: {},
    ready: false,
    restartCount: 0,
    image: 'busybox:1.36',
    imageID: 'docker.io/library/busybox@sha256:...',
    containerID: 'containerd://init456',
    started: false,
  },
]

export const mockEphemeralContainerStatuses: ContainerStatus[] = [
  {
    name: 'debug-tools',
    state: {
      running: {
        startedAt: '2026-08-28 08:20:00',
      },
    },
    lastState: {},
    ready: false,
    restartCount: 0,
    image: 'alpine:3.19',
    imageID: 'docker.io/library/alpine@sha256:...',
    containerID: 'containerd://ephemeral789',
    started: true,
  },
]

// Pod Conditions
export const mockPodConditions: Condition<PodConditionType>[] = [
  {
    type: 'PodScheduled',
    status: 'True',
    lastProbeTime: '2026-08-28 08:00:00',
    lastTransitionTime: '2026-08-28 08:00:00',
    reason: 'SuccessfullyAssigned',
    message: 'Pod scheduled to worker-01',
  },
  {
    type: 'Initialized',
    status: 'True',
    lastProbeTime: '2026-08-28 08:05:00',
    lastTransitionTime: '2026-08-28 08:05:00',
    reason: 'InitContainersCompleted',
    message: 'Init containers completed',
  },
  {
    type: 'ContainersReady',
    status: 'True',
    lastProbeTime: '2026-08-28 08:15:00',
    lastTransitionTime: '2026-08-28 08:15:00',
    reason: 'ContainersReady',
    message: 'All containers are ready',
  },
  {
    type: 'Ready',
    status: 'True',
    lastProbeTime: '2026-08-28 08:15:00',
    lastTransitionTime: '2026-08-28 08:15:00',
    reason: 'PodReady',
    message: 'Pod is ready',
  },
]

// Host IPs and Pod IPs
export const mockHostIPs: HostIP[] = [{ ip: '10.0.2.10' }]
export const mockPodIPs: PodIP[] = [{ ip: '10.244.1.5' }]

// QoS class
export const mockQoSClass: PodQOSClass = 'Burstable'

// ==================== PodSpec ====================

export const mockPodSpec: PodSpec = {
  volumes: mockVolumes,
  initContainers: [mockInitContainer],
  containers: [mockMainContainer],
  ephemeralContainers: [mockEphemeralContainer],
  restartPolicy: 'Always',
  terminationGracePeriodSeconds: 30,
  activeDeadlineSeconds: 0,
  dnsPolicy: 'ClusterFirst',
  nodeSelector: {
    'kubernetes.io/os': 'linux',
    'node-type': 'application',
  },
  serviceAccountName: 'default',
  nodeName: 'worker-01',
  hostNetwork: false,
  hostPID: false,
  securityContext: {
    runAsUser: 1000,
    runAsGroup: 3000,
    runAsNonRoot: true,
  },
  imagePullSecrets: ['regcred'],
  hostname: 'nginx-pod',
  subdomain: 'nginx-svc',
  affinity: {
    nodeAffinity: {
      required: [
        {
          matchExpressions: [
            {
              key: 'kubernetes.io/os',
              operator: 'In',
              values: ['linux'],
            },
          ],
        },
      ],
      preferred: [
        {
          weight: 100,
          matchExpressions: [
            {
              key: 'node-type',
              operator: 'In',
              values: ['ssd'],
            },
          ],
        },
      ],
    },
    podAffinity: {
      required: [
        {
          labelSelector: {
            matchLabels: {
              app: 'cache',
            },
          },
          topologyKey: 'kubernetes.io/hostname',
        },
      ],
    },
    podAntiAffinity: {
      preferred: [
        {
          weight: 80,
          labelSelector: {
            matchLabels: {
              app: 'nginx',
            },
          },
          topologyKey: 'kubernetes.io/hostname',
        },
      ],
    },
  },
  tolerations: [
    {
      key: 'node-role.kubernetes.io/master',
      operator: 'Exists',
      effect: 'NoSchedule',
    },
  ],
  priorityClassName: 'high-priority',
  priority: 100,
}

// ==================== PodStatusObj ====================

export const mockPodStatusObj: PodStatusObj = {
  observedGeneration: 2,
  phase: 'Running',
  conditions: mockPodConditions,
  message: 'Pod is running',
  reason: 'Running',
  nominatedNodeName: '',
  hostIP: '10.0.2.10',
  hostIPs: mockHostIPs,
  podIP: '10.244.1.5',
  podIPs: mockPodIPs,
  startTime: '2026-08-28 08:00:00',
  initContainerStatuses: mockInitContainerStatuses,
  containerStatuses: mockContainerStatuses,
  qosClass: mockQoSClass,
  ephemeralContainerStatuses: mockEphemeralContainerStatuses,
  resize: '',
  allocatedResources: {
    cpu: { value: 1.5, unit: '' },
    memory: { value: 768, unit: 'Mi' },
  },
}

// ==================== PodDetailVo ====================

export const mockPodDetail: PodDetailVo = {
  uid: generateId(),
  name: 'nginx-7d8f9c6b5d-abc12',
  namespace: 'default',
  clusterUid: generateId(),
  cluster: 'prod-beijing',
  namespaceUid: generateId(),
  description: 'Nginx web server pod',
  resourceVersion: '1234567890',
  generation: 2,
  deletionTimestamp: '',
  ownerReferences: ['deployment.apps/nginx-deployment-7d8f9c6b5d'],
  finalizers: [],
  labels: {
    app: 'nginx',
    env: 'prod',
    version: 'v1.25',
  },
  annotations: {
    'kubernetes.io/description': 'Nginx pod for frontend',
  },
  status: 'Running',
  statusMsg: 'Pod running normally',
  spec: mockPodSpec,
  statusObj: mockPodStatusObj,
  createAt: '2026-08-28 08:00:00',
  createBy: 'admin',
  updateAt: '2026-08-28 08:15:00',
  updateBy: 'kubelet',
}

export const mockPodYaml: string = `
apiVersion: v1
kind: Pod
metadata:
  name: nginx-7d8f9c6b5d-abc12
  namespace: default
  uid: 12345678-1234-1234-1234-123456789abc
  resourceVersion: "1234567890"
  generation: 2
  ownerReferences:
  - apiVersion: apps/v1
    kind: Deployment
    name: nginx-deployment-7d8f9c6b5d
    uid: 87654321-4321-4321-4321-cba987654321
  finalizers: []
  labels:
    app: nginx
    env: prod
    version: v1.25
  annotations:
    kubernetes.io/description: "Nginx pod for frontend"
    platform.io/cluster: "prod-beijing"
    platform.io/cluster-uid: "12345678-1234-1234-1234-123456789abd"
    platform.io/namespace-uid: "12345678-1234-1234-1234-123456789abe"
    platform.io/description: "Nginx web server pod"
spec:
  volumes:
  - name: hostpath-volume
    hostPath:
      path: /data/logs
      type: DirectoryOrCreate
  - name: emptydir-volume
    emptyDir:
      medium: Memory
      sizeLimit: 512Mi
  - name: config-volume
    configMap:
      name: nginx-config
      items:
      - key: default.conf
        path: default.conf
        mode: 0644
      defaultMode: 0644
      optional: false
  - name: secret-volume
    secret:
      secretName: db-secret
      items:
      - key: username
        path: username
        mode: 0600
      defaultMode: 0600
      optional: false
  - name: pvc-volume
    persistentVolumeClaim:
      claimName: data-pvc
      readOnly: false
  initContainers:
  - name: init-db
    image: busybox:1.36
    command:
    - sh
    - -c
    args:
    - echo "Initializing database" && sleep 5
    resources:
      requests:
        cpu: 100m
        memory: 64Mi
      limits:
        cpu: 200m
        memory: 128Mi
    volumeMounts:
    - name: init-script
      mountPath: /scripts
      readOnly: true
    imagePullPolicy: IfNotPresent
    securityContext:
      runAsUser: 0
  containers:
  - name: nginx
    image: nginx:1.25
    command:
    - /bin/sh
    - -c
    args:
    - nginx -g "daemon off;"
    workingDir: /usr/share/nginx/html
    ports:
    - name: http
      containerPort: 80
      protocol: TCP
    envFrom:
    - prefix: NGINX_
      configMapRef:
        name: nginx-config
        optional: false
    env:
    - name: POD_NAME
      valueFrom:
        fieldRef:
          fieldPath: metadata.name
    - name: POD_NAMESPACE
      valueFrom:
        fieldRef:
          fieldPath: metadata.namespace
    - name: CPU_LIMIT
      valueFrom:
        resourceFieldRef:
          containerName: nginx
          resource: limits.cpu
          divisor: "1"
    resources:
      requests:
        cpu: 500m
        memory: 256Mi
      limits:
        cpu: "1"
        memory: 512Mi
    volumeMounts:
    - name: config-volume
      mountPath: /etc/nginx/conf.d
      readOnly: true
    - name: html-volume
      mountPath: /usr/share/nginx/html
      subPath: html
    livenessProbe:
      httpGet:
        path: /healthz
        port: 80
        scheme: HTTP
      initialDelaySeconds: 30
      timeoutSeconds: 3
      periodSeconds: 10
      successThreshold: 1
      failureThreshold: 3
    readinessProbe:
      httpGet:
        path: /ready
        port: 80
        scheme: HTTP
      initialDelaySeconds: 5
      timeoutSeconds: 2
      periodSeconds: 5
      successThreshold: 1
      failureThreshold: 3
    startupProbe:
      httpGet:
        path: /startup
        port: 80
        scheme: HTTP
      initialDelaySeconds: 0
      timeoutSeconds: 5
      periodSeconds: 10
      successThreshold: 1
      failureThreshold: 30
    lifecycle:
      postStart:
        exec:
          command:
          - /bin/sh
          - -c
          - echo "Started"
      preStop:
        exec:
          command:
          - /bin/sh
          - -c
          - sleep 5
      stopSignal: SIGTERM
    terminationMessagePath: /dev/termination-log
    terminationMessagePolicy: File
    imagePullPolicy: IfNotPresent
    securityContext:
      privileged: false
      runAsUser: 1001
      runAsNonRoot: true
    stdin: false
    stdinOnce: false
    tty: false
  ephemeralContainers:
  - name: debug-tools
    image: alpine:3.19
    command:
    - sh
    args:
    - -c
    - sleep 3600
    resources:
      requests:
        cpu: 100m
        memory: 32Mi
      limits:
        cpu: 200m
        memory: 64Mi
    imagePullPolicy: Always
    securityContext:
      privileged: true
  restartPolicy: Always
  terminationGracePeriodSeconds: 30
  activeDeadlineSeconds: 0
  dnsPolicy: ClusterFirst
  nodeSelector:
    kubernetes.io/os: linux
    node-type: application
  serviceAccountName: default
  nodeName: worker-01
  hostNetwork: false
  hostPID: false
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    runAsNonRoot: true
  imagePullSecrets:
  - name: regcred
  hostname: nginx-pod
  subdomain: nginx-svc
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: kubernetes.io/os
            operator: In
            values:
            - linux
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        preference:
          matchExpressions:
          - key: node-type
            operator: In
            values:
            - ssd
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app: cache
        topologyKey: kubernetes.io/hostname
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 80
        podAffinityTerm:
          labelSelector:
            matchLabels:
              app: nginx
          topologyKey: kubernetes.io/hostname
  tolerations:
  - key: node-role.kubernetes.io/master
    operator: Exists
    effect: NoSchedule
  priorityClassName: high-priority
  priority: 100
status:
  observedGeneration: 2
  phase: Running
  conditions:
  - type: PodScheduled
    status: "True"
    lastProbeTime: "2026-08-28T08:00:00Z"
    lastTransitionTime: "2026-08-28T08:00:00Z"
    reason: SuccessfullyAssigned
    message: Pod scheduled to worker-01
  - type: Initialized
    status: "True"
    lastProbeTime: "2026-08-28T08:05:00Z"
    lastTransitionTime: "2026-08-28T08:05:00Z"
    reason: InitContainersCompleted
    message: Init containers completed
  - type: ContainersReady
    status: "True"
    lastProbeTime: "2026-08-28T08:15:00Z"
    lastTransitionTime: "2026-08-28T08:15:00Z"
    reason: ContainersReady
    message: All containers are ready
  - type: Ready
    status: "True"
    lastProbeTime: "2026-08-28T08:15:00Z"
    lastTransitionTime: "2026-08-28T08:15:00Z"
    reason: PodReady
    message: Pod is ready
  message: Pod is running
  reason: Running
  nominatedNodeName: ""
  hostIP: 10.0.2.10
  hostIPs:
  - ip: 10.0.2.10
  podIP: 10.244.1.5
  podIPs:
  - ip: 10.244.1.5
  startTime: "2026-08-28T08:00:00Z"
  initContainerStatuses:
  - name: init-db
    state:
      terminated:
        exitCode: 0
        reason: Completed
        startedAt: "2026-08-28T08:00:00Z"
        finishedAt: "2026-08-28T08:05:00Z"
        containerID: containerd://init456
    lastState: {}
    ready: false
    restartCount: 0
    image: busybox:1.36
    imageID: docker.io/library/busybox@sha256:...
    containerID: containerd://init456
    started: false
  containerStatuses:
  - name: nginx
    state:
      running:
        startedAt: "2026-08-28T08:15:00Z"
    lastState:
      terminated:
        exitCode: 0
        reason: Completed
        startedAt: "2026-08-28T07:00:00Z"
        finishedAt: "2026-08-28T08:00:00Z"
        containerID: containerd://abc123
    ready: true
    restartCount: 0
    image: nginx:1.25
    imageID: docker.io/library/nginx@sha256:...
    containerID: containerd://nginx123
    started: true
  ephemeralContainerStatuses:
  - name: debug-tools
    state:
      running:
        startedAt: "2026-08-28T08:20:00Z"
    lastState: {}
    ready: false
    restartCount: 0
    image: alpine:3.19
    imageID: docker.io/library/alpine@sha256:...
    containerID: containerd://ephemeral789
    started: true
  qosClass: Burstable
  resize: ""
  allocatedResources:
    cpu: "1500m"
    memory: 768Mi
`

export const mockPodEventList: EventListVo[] = [
  {
    name: 'pod-event-001',
    namespace: 'default',
    uid: generateId(),
    resourceVersion: '40001',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/nginx-deployment-7d8f9c6b5d'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 08:00:00',
    series: { count: 1, lastObservedTime: '2026-08-28 08:00:00' },
    reportingController: 'kube-scheduler',
    reportingInstance: 'scheduler-abc',
    action: 'Scheduled',
    reason: 'SuccessfullyAssigned',
    regarding: {
      kind: 'Pod',
      namespace: 'default',
      name: 'nginx-7d8f9c6b5d-abc12',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: {
      kind: 'Node',
      namespace: '',
      name: 'worker-01',
      uid: generateId(),
    },
    note: 'Pod nginx-7d8f9c6b5d-abc12 assigned to node worker-01',
    type: 'Normal',
  },
  {
    name: 'pod-event-002',
    namespace: 'default',
    uid: generateId(),
    resourceVersion: '40002',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/nginx-deployment-7d8f9c6b5d'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 08:05:00',
    series: { count: 1, lastObservedTime: '2026-08-28 08:05:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-01',
    action: 'Pulled',
    reason: 'ContainerImagePullSuccess',
    regarding: {
      kind: 'Pod',
      namespace: 'default',
      name: 'nginx-7d8f9c6b5d-abc12',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Successfully pulled image "nginx:1.25"',
    type: 'Normal',
  },
  {
    name: 'pod-event-003',
    namespace: 'default',
    uid: generateId(),
    resourceVersion: '40003',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/nginx-deployment-7d8f9c6b5d'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 08:10:00',
    series: { count: 1, lastObservedTime: '2026-08-28 08:10:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-01',
    action: 'Created',
    reason: 'ContainerCreated',
    regarding: {
      kind: 'Pod',
      namespace: 'default',
      name: 'nginx-7d8f9c6b5d-abc12',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Container nginx created successfully',
    type: 'Normal',
  },
  {
    name: 'pod-event-004',
    namespace: 'default',
    uid: generateId(),
    resourceVersion: '40004',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/nginx-deployment-7d8f9c6b5d'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 08:15:00',
    series: { count: 1, lastObservedTime: '2026-08-28 08:15:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-01',
    action: 'Started',
    reason: 'ContainerStarted',
    regarding: {
      kind: 'Pod',
      namespace: 'default',
      name: 'nginx-7d8f9c6b5d-abc12',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Container nginx started',
    type: 'Normal',
  },
  {
    name: 'pod-event-005',
    namespace: 'production',
    uid: generateId(),
    resourceVersion: '40005',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/api-deployment-7d8f9c6b5f'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 08:20:00',
    series: { count: 1, lastObservedTime: '2026-08-28 08:20:00' },
    reportingController: 'kube-scheduler',
    reportingInstance: 'scheduler-def',
    action: 'Scheduled',
    reason: 'FailedScheduling',
    regarding: {
      kind: 'Pod',
      namespace: 'production',
      name: 'api-7d8f9c6b5f-def34',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: {
      kind: 'Node',
      namespace: '',
      name: 'worker-05',
      uid: generateId(),
    },
    note: 'Pod api-7d8f9c6b5f-def34 failed to schedule due to insufficient CPU',
    type: 'Warning',
  },
  {
    name: 'pod-event-006',
    namespace: 'production',
    uid: generateId(),
    resourceVersion: '40006',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/api-deployment-7d8f9c6b5f'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 08:25:00',
    series: { count: 2, lastObservedTime: '2026-08-28 08:25:00' },
    reportingController: 'kube-scheduler',
    reportingInstance: 'scheduler-def',
    action: 'Scheduled',
    reason: 'SuccessfullyAssigned',
    regarding: {
      kind: 'Pod',
      namespace: 'production',
      name: 'api-7d8f9c6b5f-def34',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: {
      kind: 'Node',
      namespace: '',
      name: 'worker-06',
      uid: generateId(),
    },
    note: 'Pod api-7d8f9c6b5f-def34 assigned to node worker-06',
    type: 'Normal',
  },
  {
    name: 'pod-event-007',
    namespace: 'staging',
    uid: generateId(),
    resourceVersion: '40007',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/worker-deployment-7d8f9c6b5h'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 08:30:00',
    series: { count: 1, lastObservedTime: '2026-08-28 08:30:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-07',
    action: 'FailedPull',
    reason: 'ImagePullBackOff',
    regarding: {
      kind: 'Pod',
      namespace: 'staging',
      name: 'worker-7d8f9c6b5h-ghi56',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Failed to pull image "myregistry/worker:v2": image not found',
    type: 'Warning',
  },
  {
    name: 'pod-event-008',
    namespace: 'staging',
    uid: generateId(),
    resourceVersion: '40008',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/worker-deployment-7d8f9c6b5h'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 08:35:00',
    series: { count: 3, lastObservedTime: '2026-08-28 08:35:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-07',
    action: 'FailedPull',
    reason: 'ErrImagePull',
    regarding: {
      kind: 'Pod',
      namespace: 'staging',
      name: 'worker-7d8f9c6b5h-ghi56',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Error pulling image: image not found',
    type: 'Warning',
  },
  {
    name: 'pod-event-009',
    namespace: 'test',
    uid: generateId(),
    resourceVersion: '40009',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/app-deployment-7d8f9c6b5i'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 08:40:00',
    series: { count: 1, lastObservedTime: '2026-08-28 08:40:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-08',
    action: 'FailedStart',
    reason: 'CrashLoopBackOff',
    regarding: {
      kind: 'Pod',
      namespace: 'test',
      name: 'app-7d8f9c6b5i-jkl78',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Pod app-7d8f9c6b5i-jkl78 crashed, restart loop detected',
    type: 'Warning',
  },
  {
    name: 'pod-event-010',
    namespace: 'monitoring',
    uid: generateId(),
    resourceVersion: '40010',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/prometheus-deployment-7d8f9c6b5j'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 08:45:00',
    series: { count: 1, lastObservedTime: '2026-08-28 08:45:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-02',
    action: 'Killing',
    reason: 'OutOfMemory',
    regarding: {
      kind: 'Pod',
      namespace: 'monitoring',
      name: 'prometheus-7d8f9c6b5j-mno90',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Pod prometheus-7d8f9c6b5j-mno90 killed due to OOM (memory limit exceeded)',
    type: 'Warning',
  },
  {
    name: 'pod-event-011',
    namespace: 'logging',
    uid: generateId(),
    resourceVersion: '40011',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/fluentbit-deployment-7d8f9c6b5l'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 08:50:00',
    series: { count: 1, lastObservedTime: '2026-08-28 08:50:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-03',
    action: 'FailedMount',
    reason: 'ConfigMapNotFound',
    regarding: {
      kind: 'Pod',
      namespace: 'logging',
      name: 'fluentbit-7d8f9c6b5l-pqr12',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: {
      kind: 'ConfigMap',
      namespace: 'logging',
      name: 'fluentbit-config',
      uid: generateId(),
    },
    note: 'Failed to mount ConfigMap "fluentbit-config": configmap not found',
    type: 'Warning',
  },
  {
    name: 'pod-event-012',
    namespace: 'default',
    uid: generateId(),
    resourceVersion: '40012',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/redis-deployment-7d8f9c6b5m'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 08:55:00',
    series: { count: 1, lastObservedTime: '2026-08-28 08:55:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-04',
    action: 'FailedMount',
    reason: 'PersistentVolumeClaimNotFound',
    regarding: {
      kind: 'Pod',
      namespace: 'default',
      name: 'redis-7d8f9c6b5m-stu34',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: {
      kind: 'PersistentVolumeClaim',
      namespace: 'default',
      name: 'redis-data',
      uid: generateId(),
    },
    note: 'Failed to mount volume: PVC redis-data not found',
    type: 'Warning',
  },
  {
    name: 'pod-event-013',
    namespace: 'gitops',
    uid: generateId(),
    resourceVersion: '40013',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/argocd-deployment-7d8f9c6b5n'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 09:00:00',
    series: { count: 1, lastObservedTime: '2026-08-28 09:00:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-06',
    action: 'Deleted',
    reason: 'PodDeleted',
    regarding: {
      kind: 'Pod',
      namespace: 'gitops',
      name: 'argocd-7d8f9c6b5n-vwx56',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Pod argocd-7d8f9c6b5n-vwx56 deleted during rollout',
    type: 'Normal',
  },
  {
    name: 'pod-event-014',
    namespace: 'database',
    uid: generateId(),
    resourceVersion: '40014',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/postgres-deployment-7d8f9c6b5o'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 09:05:00',
    series: { count: 1, lastObservedTime: '2026-08-28 09:05:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-09',
    action: 'Started',
    reason: 'ContainerStarted',
    regarding: {
      kind: 'Pod',
      namespace: 'database',
      name: 'postgres-7d8f9c6b5o-yz78',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Container postgres started',
    type: 'Normal',
  },
  {
    name: 'pod-event-015',
    namespace: 'cache',
    uid: generateId(),
    resourceVersion: '40015',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/memcached-deployment-7d8f9c6b5p'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 09:10:00',
    series: { count: 1, lastObservedTime: '2026-08-28 09:10:00' },
    reportingController: 'kube-scheduler',
    reportingInstance: 'scheduler-ghi',
    action: 'FailedScheduling',
    reason: 'NodeSelectorMismatch',
    regarding: {
      kind: 'Pod',
      namespace: 'cache',
      name: 'memcached-7d8f9c6b5p-ab12',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: {
      kind: 'Node',
      namespace: '',
      name: 'worker-10',
      uid: generateId(),
    },
    note: 'Pod memcached-7d8f9c6b5p-ab12 failed due to node selector mismatch (disktype=ssd)',
    type: 'Warning',
  },
  {
    name: 'pod-event-016',
    namespace: 'security',
    uid: generateId(),
    resourceVersion: '40016',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/falco-deployment-7d8f9c6b5q'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 09:15:00',
    series: { count: 1, lastObservedTime: '2026-08-28 09:15:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-11',
    action: 'FailedMount',
    reason: 'SecretNotFound',
    regarding: {
      kind: 'Pod',
      namespace: 'security',
      name: 'falco-7d8f9c6b5q-cd34',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: {
      kind: 'Secret',
      namespace: 'security',
      name: 'falco-secret',
      uid: generateId(),
    },
    note: 'Failed to mount Secret "falco-secret": secret not found',
    type: 'Warning',
  },
  {
    name: 'pod-event-017',
    namespace: 'ingress',
    uid: generateId(),
    resourceVersion: '40017',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/nginx-ingress-deployment-7d8f9c6b5r'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 09:20:00',
    series: { count: 1, lastObservedTime: '2026-08-28 09:20:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-12',
    action: 'FailedStart',
    reason: 'ContainerCannotRun',
    regarding: {
      kind: 'Pod',
      namespace: 'ingress',
      name: 'nginx-ingress-7d8f9c6b5r-ef56',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Container failed to start: error opening port 80',
    type: 'Warning',
  },
  {
    name: 'pod-event-018',
    namespace: 'cert-manager',
    uid: generateId(),
    resourceVersion: '40018',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/cert-manager-deployment-7d8f9c6b5s'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 09:25:00',
    series: { count: 1, lastObservedTime: '2026-08-28 09:25:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-13',
    action: 'SuccessfulMount',
    reason: 'VolumeMounted',
    regarding: {
      kind: 'Pod',
      namespace: 'cert-manager',
      name: 'cert-manager-7d8f9c6b5s-gh78',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: {
      kind: 'ConfigMap',
      namespace: 'cert-manager',
      name: 'cert-manager-config',
      uid: generateId(),
    },
    note: 'Volume config mounted successfully',
    type: 'Normal',
  },
  {
    name: 'pod-event-019',
    namespace: 'default',
    uid: generateId(),
    resourceVersion: '40019',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/nginx-deployment-7d8f9c6b5d'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 09:30:00',
    series: { count: 1, lastObservedTime: '2026-08-28 09:30:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-01',
    action: 'Evicted',
    reason: 'Evicted',
    regarding: {
      kind: 'Pod',
      namespace: 'default',
      name: 'nginx-7d8f9c6b5d-abc12',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Pod nginx-7d8f9c6b5d-abc12 evicted due to node memory pressure',
    type: 'Warning',
  },
  {
    name: 'pod-event-020',
    namespace: 'default',
    uid: generateId(),
    resourceVersion: '40020',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/nginx-deployment-7d8f9c6b5d'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 09:35:00',
    series: { count: 1, lastObservedTime: '2026-08-28 09:35:00' },
    reportingController: 'kube-scheduler',
    reportingInstance: 'scheduler-abc',
    action: 'Scheduled',
    reason: 'SuccessfullyAssigned',
    regarding: {
      kind: 'Pod',
      namespace: 'default',
      name: 'nginx-7d8f9c6b5d-abc12',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: {
      kind: 'Node',
      namespace: '',
      name: 'worker-02',
      uid: generateId(),
    },
    note: 'Pod nginx-7d8f9c6b5d-abc12 rescheduled to node worker-02',
    type: 'Normal',
  },
  {
    name: 'pod-event-021',
    namespace: 'production',
    uid: generateId(),
    resourceVersion: '40021',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/api-deployment-7d8f9c6b5f'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 09:40:00',
    series: { count: 1, lastObservedTime: '2026-08-28 09:40:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-06',
    action: 'FailedHealthCheck',
    reason: 'Unhealthy',
    regarding: {
      kind: 'Pod',
      namespace: 'production',
      name: 'api-7d8f9c6b5f-def34',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Readiness probe failed: HTTP 503',
    type: 'Warning',
  },
  {
    name: 'pod-event-022',
    namespace: 'production',
    uid: generateId(),
    resourceVersion: '40022',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/api-deployment-7d8f9c6b5f'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 09:45:00',
    series: { count: 1, lastObservedTime: '2026-08-28 09:45:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-06',
    action: 'Healthy',
    reason: 'HealthCheckPassed',
    regarding: {
      kind: 'Pod',
      namespace: 'production',
      name: 'api-7d8f9c6b5f-def34',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Readiness probe succeeded',
    type: 'Normal',
  },
  {
    name: 'pod-event-023',
    namespace: 'staging',
    uid: generateId(),
    resourceVersion: '40023',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/worker-deployment-7d8f9c6b5h'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 09:50:00',
    series: { count: 1, lastObservedTime: '2026-08-28 09:50:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-07',
    action: 'Pulled',
    reason: 'ImagePullSuccess',
    regarding: {
      kind: 'Pod',
      namespace: 'staging',
      name: 'worker-7d8f9c6b5h-ghi56',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Successfully pulled image "myregistry/worker:v2"',
    type: 'Normal',
  },
  {
    name: 'pod-event-024',
    namespace: 'staging',
    uid: generateId(),
    resourceVersion: '40024',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/worker-deployment-7d8f9c6b5h'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 09:55:00',
    series: { count: 1, lastObservedTime: '2026-08-28 09:55:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-07',
    action: 'Started',
    reason: 'ContainerStarted',
    regarding: {
      kind: 'Pod',
      namespace: 'staging',
      name: 'worker-7d8f9c6b5h-ghi56',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Container worker started',
    type: 'Normal',
  },
  {
    name: 'pod-event-025',
    namespace: 'test',
    uid: generateId(),
    resourceVersion: '40025',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/app-deployment-7d8f9c6b5i'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 10:00:00',
    series: { count: 1, lastObservedTime: '2026-08-28 10:00:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-08',
    action: 'Deleted',
    reason: 'PodDeleted',
    regarding: {
      kind: 'Pod',
      namespace: 'test',
      name: 'app-7d8f9c6b5i-jkl78',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Pod app-7d8f9c6b5i-jkl78 deleted after successful completion',
    type: 'Normal',
  },
  {
    name: 'pod-event-026',
    namespace: 'monitoring',
    uid: generateId(),
    resourceVersion: '40026',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/prometheus-deployment-7d8f9c6b5j'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 10:05:00',
    series: { count: 1, lastObservedTime: '2026-08-28 10:05:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-02',
    action: 'Started',
    reason: 'ContainerStarted',
    regarding: {
      kind: 'Pod',
      namespace: 'monitoring',
      name: 'prometheus-7d8f9c6b5j-mno90',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Container prometheus started after OOM restart',
    type: 'Normal',
  },
  {
    name: 'pod-event-027',
    namespace: 'logging',
    uid: generateId(),
    resourceVersion: '40027',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/fluentbit-deployment-7d8f9c6b5l'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 10:10:00',
    series: { count: 1, lastObservedTime: '2026-08-28 10:10:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-03',
    action: 'Created',
    reason: 'PodCreated',
    regarding: {
      kind: 'Pod',
      namespace: 'logging',
      name: 'fluentbit-7d8f9c6b5l-pqr12',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Pod fluentbit-7d8f9c6b5l-pqr12 created',
    type: 'Normal',
  },
  {
    name: 'pod-event-028',
    namespace: 'default',
    uid: generateId(),
    resourceVersion: '40028',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/redis-deployment-7d8f9c6b5m'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 10:15:00',
    series: { count: 1, lastObservedTime: '2026-08-28 10:15:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-04',
    action: 'FailedMount',
    reason: 'VolumeMountFailed',
    regarding: {
      kind: 'Pod',
      namespace: 'default',
      name: 'redis-7d8f9c6b5m-stu34',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: {
      kind: 'PersistentVolumeClaim',
      namespace: 'default',
      name: 'redis-data',
      uid: generateId(),
    },
    note: 'Failed to mount volume: PVC redis-data bound to PV but mount failed',
    type: 'Warning',
  },
  {
    name: 'pod-event-029',
    namespace: 'default',
    uid: generateId(),
    resourceVersion: '40029',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/redis-deployment-7d8f9c6b5m'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 10:20:00',
    series: { count: 1, lastObservedTime: '2026-08-28 10:20:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-04',
    action: 'SuccessfulMount',
    reason: 'VolumeMounted',
    regarding: {
      kind: 'Pod',
      namespace: 'default',
      name: 'redis-7d8f9c6b5m-stu34',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: {
      kind: 'PersistentVolumeClaim',
      namespace: 'default',
      name: 'redis-data',
      uid: generateId(),
    },
    note: 'Volume redis-data mounted successfully',
    type: 'Normal',
  },
  {
    name: 'pod-event-030',
    namespace: 'default',
    uid: generateId(),
    resourceVersion: '40030',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: ['deployment.apps/redis-deployment-7d8f9c6b5m'],
    finalizers: [],
    labels: { 'event-type': 'pod' },
    annotations: {},
    eventTime: '2026-08-28 10:25:00',
    series: { count: 1, lastObservedTime: '2026-08-28 10:25:00' },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-04',
    action: 'Started',
    reason: 'ContainerStarted',
    regarding: {
      kind: 'Pod',
      namespace: 'default',
      name: 'redis-7d8f9c6b5m-stu34',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Container redis started successfully',
    type: 'Normal',
  },
]

export const mockPodMonitor: PodMonitorVo = {}
