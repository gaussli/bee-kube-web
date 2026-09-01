import type { EventListVo } from '@/types/kubernetes/event'
import type { NodeDetailVo, NodeListVo, NodeMonitorVo } from '@/types/kubernetes/node'

import { generateId } from '@/mock/utils'

export const mockNodeList: NodeListVo[] = [
  {
    uid: generateId(),
    name: 'master-01',
    description: 'Kubernetes 控制平面节点，运行 API Server、Scheduler、Controller Manager 等核心组件',
    status: 'Ready',
    statusMsg: '节点健康，所有组件运行正常',
    ip: '10.0.1.10',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 16, unit: '' },
        memory: { value: 64, unit: 'Gi' },
        storage: { value: 500, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 14, unit: '' },
        memory: { value: 56, unit: 'Gi' },
        storage: { value: 480, unit: 'Gi' },
        pods: { value: 100, unit: '' },
      },
      usage: {
        cpu: { value: 4.2, unit: '' },
        memory: { value: 18, unit: 'Gi' },
        storage: { value: 120, unit: 'Gi' },
        pods: { value: 18, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.5',
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    createAt: '2025-01-15 08:00:00',
    createBy: 'admin',
    updateAt: '2025-08-20 10:30:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'master-02',
    description: 'Kubernetes 控制平面节点，高可用集群备用 Master',
    status: 'Ready',
    statusMsg: '节点健康',
    ip: '10.0.1.11',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 16, unit: '' },
        memory: { value: 64, unit: 'Gi' },
        storage: { value: 500, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 14, unit: '' },
        memory: { value: 56, unit: 'Gi' },
        storage: { value: 480, unit: 'Gi' },
        pods: { value: 100, unit: '' },
      },
      usage: {
        cpu: { value: 3.8, unit: '' },
        memory: { value: 16, unit: 'Gi' },
        storage: { value: 105, unit: 'Gi' },
        pods: { value: 15, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.5',
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    createAt: '2025-01-15 08:00:00',
    createBy: 'admin',
    updateAt: '2025-08-20 10:35:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'master-03',
    description: 'Kubernetes 控制平面节点，高可用集群第三个 Master',
    status: 'Ready',
    statusMsg: '节点健康',
    ip: '10.0.1.12',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 16, unit: '' },
        memory: { value: 64, unit: 'Gi' },
        storage: { value: 500, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 14, unit: '' },
        memory: { value: 56, unit: 'Gi' },
        storage: { value: 480, unit: 'Gi' },
        pods: { value: 100, unit: '' },
      },
      usage: {
        cpu: { value: 3.5, unit: '' },
        memory: { value: 14, unit: 'Gi' },
        storage: { value: 98, unit: 'Gi' },
        pods: { value: 12, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.5',
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    createAt: '2025-01-15 08:00:00',
    createBy: 'admin',
    updateAt: '2025-08-20 10:40:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-01',
    description: '生产环境工作节点，运行业务 Pod',
    status: 'Ready',
    statusMsg: '节点运行正常，资源充裕',
    ip: '10.0.2.10',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 32, unit: '' },
        memory: { value: 128, unit: 'Gi' },
        storage: { value: 1000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 30, unit: '' },
        memory: { value: 120, unit: 'Gi' },
        storage: { value: 960, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 18.5, unit: '' },
        memory: { value: 72, unit: 'Gi' },
        storage: { value: 320, unit: 'Gi' },
        pods: { value: 62, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.5',
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    createAt: '2025-01-20 09:00:00',
    createBy: 'admin',
    updateAt: '2025-08-21 14:00:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-02',
    description: '生产环境工作节点，承载高负载业务',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.0.2.11',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 32, unit: '' },
        memory: { value: 128, unit: 'Gi' },
        storage: { value: 1000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 30, unit: '' },
        memory: { value: 120, unit: 'Gi' },
        storage: { value: 960, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 24.8, unit: '' },
        memory: { value: 96, unit: 'Gi' },
        storage: { value: 450, unit: 'Gi' },
        pods: { value: 85, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.5',
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    createAt: '2025-01-20 09:00:00',
    createBy: 'admin',
    updateAt: '2025-08-21 14:05:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-03',
    description: '生产环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.0.2.12',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 32, unit: '' },
        memory: { value: 128, unit: 'Gi' },
        storage: { value: 1000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 30, unit: '' },
        memory: { value: 120, unit: 'Gi' },
        storage: { value: 960, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 12.3, unit: '' },
        memory: { value: 48, unit: 'Gi' },
        storage: { value: 280, unit: 'Gi' },
        pods: { value: 40, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.3',
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    createAt: '2025-02-01 10:00:00',
    createBy: 'admin',
    updateAt: '2025-08-22 09:00:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-04',
    description: '生产环境工作节点，GPU 节点用于 AI 推理',
    status: 'Ready',
    statusMsg: '节点运行正常，GPU 可用',
    ip: '10.0.2.13',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 16, unit: '' },
        memory: { value: 64, unit: 'Gi' },
        storage: { value: 500, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 14, unit: '' },
        memory: { value: 56, unit: 'Gi' },
        storage: { value: 480, unit: 'Gi' },
        pods: { value: 100, unit: '' },
      },
      usage: {
        cpu: { value: 8.6, unit: '' },
        memory: { value: 32, unit: 'Gi' },
        storage: { value: 200, unit: 'Gi' },
        pods: { value: 25, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.3',
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    createAt: '2025-02-01 10:00:00',
    createBy: 'admin',
    updateAt: '2025-08-22 09:05:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-05',
    description: '生产环境工作节点',
    status: 'NotReady',
    statusMsg: '节点失联，kubelet 无响应，可能因网络问题或节点宕机',
    ip: '10.0.2.14',
    unschedulable: true,
    resource: {
      capacity: {
        cpu: { value: 32, unit: '' },
        memory: { value: 128, unit: 'Gi' },
        storage: { value: 1000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 30, unit: '' },
        memory: { value: 120, unit: 'Gi' },
        storage: { value: 960, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Gi' },
        storage: { value: 0, unit: 'Gi' },
        pods: { value: 0, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.5',
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    createAt: '2025-01-20 09:00:00',
    createBy: 'admin',
    updateAt: '2025-08-24 16:00:00',
    updateBy: 'system',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-06',
    description: '生产环境工作节点，用于灾备',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.0.2.15',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 32, unit: '' },
        memory: { value: 128, unit: 'Gi' },
        storage: { value: 1000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 30, unit: '' },
        memory: { value: 120, unit: 'Gi' },
        storage: { value: 960, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 8.1, unit: '' },
        memory: { value: 30, unit: 'Gi' },
        storage: { value: 180, unit: 'Gi' },
        pods: { value: 22, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.5',
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    createAt: '2025-02-10 08:00:00',
    createBy: 'admin',
    updateAt: '2025-08-23 11:00:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-07',
    description: '预发布环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.1.2.10',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 16, unit: '' },
        memory: { value: 64, unit: 'Gi' },
        storage: { value: 500, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 14, unit: '' },
        memory: { value: 56, unit: 'Gi' },
        storage: { value: 480, unit: 'Gi' },
        pods: { value: 100, unit: '' },
      },
      usage: {
        cpu: { value: 5.2, unit: '' },
        memory: { value: 20, unit: 'Gi' },
        storage: { value: 150, unit: 'Gi' },
        pods: { value: 15, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.3',
    clusterUid: generateId(),
    cluster: 'staging-beijing',
    createAt: '2025-03-01 09:00:00',
    createBy: 'devops',
    updateAt: '2025-08-22 14:30:00',
    updateBy: 'devops',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'worker-08',
    description: '预发布环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.1.2.11',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 16, unit: '' },
        memory: { value: 64, unit: 'Gi' },
        storage: { value: 500, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 14, unit: '' },
        memory: { value: 56, unit: 'Gi' },
        storage: { value: 480, unit: 'Gi' },
        pods: { value: 100, unit: '' },
      },
      usage: {
        cpu: { value: 6.8, unit: '' },
        memory: { value: 28, unit: 'Gi' },
        storage: { value: 200, unit: 'Gi' },
        pods: { value: 20, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.3',
    clusterUid: generateId(),
    cluster: 'staging-beijing',
    createAt: '2025-03-01 09:00:00',
    createBy: 'devops',
    updateAt: '2025-08-22 14:35:00',
    updateBy: 'devops',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'worker-09',
    description: '开发环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常，资源充足',
    ip: '10.2.2.10',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 8, unit: '' },
        memory: { value: 32, unit: 'Gi' },
        storage: { value: 200, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 7, unit: '' },
        memory: { value: 28, unit: 'Gi' },
        storage: { value: 190, unit: 'Gi' },
        pods: { value: 100, unit: '' },
      },
      usage: {
        cpu: { value: 2.1, unit: '' },
        memory: { value: 10, unit: 'Gi' },
        storage: { value: 80, unit: 'Gi' },
        pods: { value: 8, unit: '' },
      },
    },
    kubeletVersion: 'v1.29.0',
    clusterUid: generateId(),
    cluster: 'dev-guangzhou',
    createAt: '2025-04-01 08:30:00',
    createBy: 'developer',
    updateAt: '2025-08-23 07:20:00',
    updateBy: 'developer',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'worker-10',
    description: '开发环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.2.2.11',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 8, unit: '' },
        memory: { value: 32, unit: 'Gi' },
        storage: { value: 200, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 7, unit: '' },
        memory: { value: 28, unit: 'Gi' },
        storage: { value: 190, unit: 'Gi' },
        pods: { value: 100, unit: '' },
      },
      usage: {
        cpu: { value: 3.5, unit: '' },
        memory: { value: 16, unit: 'Gi' },
        storage: { value: 120, unit: 'Gi' },
        pods: { value: 12, unit: '' },
      },
    },
    kubeletVersion: 'v1.29.0',
    clusterUid: generateId(),
    cluster: 'dev-guangzhou',
    createAt: '2025-04-01 08:30:00',
    createBy: 'developer',
    updateAt: '2025-08-23 07:25:00',
    updateBy: 'developer',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'worker-11',
    description: '生产环境工作节点，专用于数据库服务',
    status: 'Ready',
    statusMsg: '节点运行正常，数据服务稳定',
    ip: '10.0.3.10',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 16, unit: '' },
        memory: { value: 128, unit: 'Gi' },
        storage: { value: 2000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 14, unit: '' },
        memory: { value: 120, unit: 'Gi' },
        storage: { value: 1900, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 6.2, unit: '' },
        memory: { value: 64, unit: 'Gi' },
        storage: { value: 800, unit: 'Gi' },
        pods: { value: 30, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.5',
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    createAt: '2025-02-20 10:00:00',
    createBy: 'admin',
    updateAt: '2025-08-24 13:00:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-12',
    description: '生产环境工作节点，用于监控和日志收集',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.0.3.11',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 16, unit: '' },
        memory: { value: 64, unit: 'Gi' },
        storage: { value: 1000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 14, unit: '' },
        memory: { value: 56, unit: 'Gi' },
        storage: { value: 960, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 7.8, unit: '' },
        memory: { value: 28, unit: 'Gi' },
        storage: { value: 350, unit: 'Gi' },
        pods: { value: 35, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.5',
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    createAt: '2025-03-10 07:30:00',
    createBy: 'admin',
    updateAt: '2025-08-25 08:00:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-13',
    description: '生产环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.0.3.12',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 32, unit: '' },
        memory: { value: 128, unit: 'Gi' },
        storage: { value: 1000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 30, unit: '' },
        memory: { value: 120, unit: 'Gi' },
        storage: { value: 960, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 15.6, unit: '' },
        memory: { value: 55, unit: 'Gi' },
        storage: { value: 500, unit: 'Gi' },
        pods: { value: 75, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.5',
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    createAt: '2025-01-25 09:00:00',
    createBy: 'admin',
    updateAt: '2025-08-21 14:10:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-14',
    description: '生产环境工作节点，部署边缘服务',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.0.3.13',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 8, unit: '' },
        memory: { value: 32, unit: 'Gi' },
        storage: { value: 500, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 7, unit: '' },
        memory: { value: 28, unit: 'Gi' },
        storage: { value: 480, unit: 'Gi' },
        pods: { value: 100, unit: '' },
      },
      usage: {
        cpu: { value: 4.5, unit: '' },
        memory: { value: 18, unit: 'Gi' },
        storage: { value: 200, unit: 'Gi' },
        pods: { value: 18, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.3',
    clusterUid: generateId(),
    cluster: 'prod-guangzhou',
    createAt: '2025-02-15 06:00:00',
    createBy: 'admin',
    updateAt: '2025-08-22 11:00:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-15',
    description: '生产环境工作节点',
    status: 'Unknown',
    statusMsg: '节点状态未知，监控数据缺失，可能网络分区',
    ip: '10.0.3.14',
    unschedulable: true,
    resource: {
      capacity: {
        cpu: { value: 32, unit: '' },
        memory: { value: 128, unit: 'Gi' },
        storage: { value: 1000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 30, unit: '' },
        memory: { value: 120, unit: 'Gi' },
        storage: { value: 960, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Gi' },
        storage: { value: 0, unit: 'Gi' },
        pods: { value: 0, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.5',
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    createAt: '2025-01-20 09:00:00',
    createBy: 'admin',
    updateAt: '2025-08-25 16:00:00',
    updateBy: 'system',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-16',
    description: '生产环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.0.3.15',
    unschedulable: true,
    resource: {
      capacity: {
        cpu: { value: 32, unit: '' },
        memory: { value: 128, unit: 'Gi' },
        storage: { value: 1000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 30, unit: '' },
        memory: { value: 120, unit: 'Gi' },
        storage: { value: 960, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 0, unit: '' },
        memory: { value: 0, unit: 'Gi' },
        storage: { value: 0, unit: 'Gi' },
        pods: { value: 0, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.5',
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    createAt: '2025-02-01 10:00:00',
    createBy: 'admin',
    updateAt: '2025-08-23 10:00:00',
    updateBy: 'admin',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-17',
    description: '预发布环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.1.2.12',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 16, unit: '' },
        memory: { value: 64, unit: 'Gi' },
        storage: { value: 500, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 14, unit: '' },
        memory: { value: 56, unit: 'Gi' },
        storage: { value: 480, unit: 'Gi' },
        pods: { value: 100, unit: '' },
      },
      usage: {
        cpu: { value: 4.8, unit: '' },
        memory: { value: 18, unit: 'Gi' },
        storage: { value: 130, unit: 'Gi' },
        pods: { value: 14, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.3',
    clusterUid: generateId(),
    cluster: 'staging-beijing',
    createAt: '2025-03-01 09:00:00',
    createBy: 'devops',
    updateAt: '2025-08-22 14:40:00',
    updateBy: 'devops',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'worker-18',
    description: '预发布环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.1.2.13',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 16, unit: '' },
        memory: { value: 64, unit: 'Gi' },
        storage: { value: 500, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 14, unit: '' },
        memory: { value: 56, unit: 'Gi' },
        storage: { value: 480, unit: 'Gi' },
        pods: { value: 100, unit: '' },
      },
      usage: {
        cpu: { value: 7.2, unit: '' },
        memory: { value: 30, unit: 'Gi' },
        storage: { value: 220, unit: 'Gi' },
        pods: { value: 24, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.3',
    clusterUid: generateId(),
    cluster: 'staging-beijing',
    createAt: '2025-03-01 09:00:00',
    createBy: 'devops',
    updateAt: '2025-08-22 14:45:00',
    updateBy: 'devops',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'worker-19',
    description: '开发环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.2.2.12',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 8, unit: '' },
        memory: { value: 32, unit: 'Gi' },
        storage: { value: 200, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 7, unit: '' },
        memory: { value: 28, unit: 'Gi' },
        storage: { value: 190, unit: 'Gi' },
        pods: { value: 100, unit: '' },
      },
      usage: {
        cpu: { value: 2.8, unit: '' },
        memory: { value: 12, unit: 'Gi' },
        storage: { value: 100, unit: 'Gi' },
        pods: { value: 10, unit: '' },
      },
    },
    kubeletVersion: 'v1.29.0',
    clusterUid: generateId(),
    cluster: 'dev-guangzhou',
    createAt: '2025-04-01 08:30:00',
    createBy: 'developer',
    updateAt: '2025-08-23 07:30:00',
    updateBy: 'developer',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'worker-20',
    description: '开发环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.2.2.13',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 8, unit: '' },
        memory: { value: 32, unit: 'Gi' },
        storage: { value: 200, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 7, unit: '' },
        memory: { value: 28, unit: 'Gi' },
        storage: { value: 190, unit: 'Gi' },
        pods: { value: 100, unit: '' },
      },
      usage: {
        cpu: { value: 1.5, unit: '' },
        memory: { value: 8, unit: 'Gi' },
        storage: { value: 60, unit: 'Gi' },
        pods: { value: 6, unit: '' },
      },
    },
    kubeletVersion: 'v1.29.0',
    clusterUid: generateId(),
    cluster: 'dev-guangzhou',
    createAt: '2025-04-01 08:30:00',
    createBy: 'developer',
    updateAt: '2025-08-23 07:35:00',
    updateBy: 'developer',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'worker-21',
    description: '生产环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.0.4.10',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 64, unit: '' },
        memory: { value: 256, unit: 'Gi' },
        storage: { value: 2000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 60, unit: '' },
        memory: { value: 240, unit: 'Gi' },
        storage: { value: 1900, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 32.5, unit: '' },
        memory: { value: 128, unit: 'Gi' },
        storage: { value: 600, unit: 'Gi' },
        pods: { value: 90, unit: '' },
      },
    },
    kubeletVersion: 'v1.29.0',
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    createAt: '2025-06-01 08:00:00',
    createBy: 'admin',
    updateAt: '2025-08-26 10:00:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-22',
    description: '生产环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.0.4.11',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 64, unit: '' },
        memory: { value: 256, unit: 'Gi' },
        storage: { value: 2000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 60, unit: '' },
        memory: { value: 240, unit: 'Gi' },
        storage: { value: 1900, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 28.9, unit: '' },
        memory: { value: 115, unit: 'Gi' },
        storage: { value: 550, unit: 'Gi' },
        pods: { value: 80, unit: '' },
      },
    },
    kubeletVersion: 'v1.29.0',
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    createAt: '2025-06-15 09:00:00',
    createBy: 'admin',
    updateAt: '2025-08-26 14:00:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-23',
    description: '生产环境工作节点',
    status: 'NotReady',
    statusMsg: '节点磁盘空间不足，kubelet 无法正常运行',
    ip: '10.0.4.12',
    unschedulable: true,
    resource: {
      capacity: {
        cpu: { value: 32, unit: '' },
        memory: { value: 128, unit: 'Gi' },
        storage: { value: 1000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 30, unit: '' },
        memory: { value: 120, unit: 'Gi' },
        storage: { value: 960, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 20.8, unit: '' },
        memory: { value: 80, unit: 'Gi' },
        storage: { value: 920, unit: 'Gi' },
        pods: { value: 60, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.5',
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    createAt: '2025-02-01 10:00:00',
    createBy: 'admin',
    updateAt: '2025-08-27 08:00:00',
    updateBy: 'system',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-24',
    description: '预发布环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.1.3.10',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 16, unit: '' },
        memory: { value: 64, unit: 'Gi' },
        storage: { value: 500, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 14, unit: '' },
        memory: { value: 56, unit: 'Gi' },
        storage: { value: 480, unit: 'Gi' },
        pods: { value: 100, unit: '' },
      },
      usage: {
        cpu: { value: 3.2, unit: '' },
        memory: { value: 12, unit: 'Gi' },
        storage: { value: 100, unit: 'Gi' },
        pods: { value: 10, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.3',
    clusterUid: generateId(),
    cluster: 'staging-shanghai',
    createAt: '2025-03-15 08:00:00',
    createBy: 'devops',
    updateAt: '2025-08-24 09:00:00',
    updateBy: 'devops',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'worker-25',
    description: '预发布环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.1.3.11',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 16, unit: '' },
        memory: { value: 64, unit: 'Gi' },
        storage: { value: 500, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 14, unit: '' },
        memory: { value: 56, unit: 'Gi' },
        storage: { value: 480, unit: 'Gi' },
        pods: { value: 100, unit: '' },
      },
      usage: {
        cpu: { value: 5.6, unit: '' },
        memory: { value: 22, unit: 'Gi' },
        storage: { value: 160, unit: 'Gi' },
        pods: { value: 16, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.3',
    clusterUid: generateId(),
    cluster: 'staging-shanghai',
    createAt: '2025-03-15 08:00:00',
    createBy: 'devops',
    updateAt: '2025-08-24 09:05:00',
    updateBy: 'devops',
    deletable: true,
  },
  {
    uid: generateId(),
    name: 'worker-26',
    description: '生产环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.0.5.10',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 32, unit: '' },
        memory: { value: 128, unit: 'Gi' },
        storage: { value: 1000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 30, unit: '' },
        memory: { value: 120, unit: 'Gi' },
        storage: { value: 960, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 22.3, unit: '' },
        memory: { value: 88, unit: 'Gi' },
        storage: { value: 420, unit: 'Gi' },
        pods: { value: 70, unit: '' },
      },
    },
    kubeletVersion: 'v1.29.0',
    clusterUid: generateId(),
    cluster: 'prod-guangzhou',
    createAt: '2025-07-01 06:00:00',
    createBy: 'admin',
    updateAt: '2025-08-27 09:00:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-27',
    description: '生产环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.0.5.11',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 32, unit: '' },
        memory: { value: 128, unit: 'Gi' },
        storage: { value: 1000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 30, unit: '' },
        memory: { value: 120, unit: 'Gi' },
        storage: { value: 960, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 18.7, unit: '' },
        memory: { value: 72, unit: 'Gi' },
        storage: { value: 380, unit: 'Gi' },
        pods: { value: 55, unit: '' },
      },
    },
    kubeletVersion: 'v1.29.0',
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    createAt: '2025-07-15 07:30:00',
    createBy: 'admin',
    updateAt: '2025-08-27 10:00:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-28',
    description: '生产环境工作节点，GPU 节点',
    status: 'Ready',
    statusMsg: '节点运行正常，GPU 资源可用',
    ip: '10.0.5.12',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 16, unit: '' },
        memory: { value: 64, unit: 'Gi' },
        storage: { value: 500, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 14, unit: '' },
        memory: { value: 56, unit: 'Gi' },
        storage: { value: 480, unit: 'Gi' },
        pods: { value: 100, unit: '' },
      },
      usage: {
        cpu: { value: 9.2, unit: '' },
        memory: { value: 36, unit: 'Gi' },
        storage: { value: 220, unit: 'Gi' },
        pods: { value: 28, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.5',
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    createAt: '2025-04-10 09:00:00',
    createBy: 'admin',
    updateAt: '2025-08-26 16:00:00',
    updateBy: 'sre-team',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-29',
    description: '生产环境工作节点',
    status: 'NotReady',
    statusMsg: '节点内存不足，OOM 导致 kubelet 崩溃',
    ip: '10.0.5.13',
    unschedulable: true,
    resource: {
      capacity: {
        cpu: { value: 32, unit: '' },
        memory: { value: 128, unit: 'Gi' },
        storage: { value: 1000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 30, unit: '' },
        memory: { value: 120, unit: 'Gi' },
        storage: { value: 960, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 28.5, unit: '' },
        memory: { value: 118, unit: 'Gi' },
        storage: { value: 500, unit: 'Gi' },
        pods: { value: 95, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.5',
    clusterUid: generateId(),
    cluster: 'prod-shanghai',
    createAt: '2025-02-20 08:00:00',
    createBy: 'admin',
    updateAt: '2025-08-27 12:00:00',
    updateBy: 'system',
    deletable: false,
  },
  {
    uid: generateId(),
    name: 'worker-30',
    description: '生产环境工作节点',
    status: 'Ready',
    statusMsg: '节点运行正常',
    ip: '10.0.5.14',
    unschedulable: false,
    resource: {
      capacity: {
        cpu: { value: 32, unit: '' },
        memory: { value: 128, unit: 'Gi' },
        storage: { value: 1000, unit: 'Gi' },
        pods: { value: 110, unit: '' },
      },
      allocation: {
        cpu: { value: 30, unit: '' },
        memory: { value: 120, unit: 'Gi' },
        storage: { value: 960, unit: 'Gi' },
        pods: { value: 105, unit: '' },
      },
      usage: {
        cpu: { value: 14.6, unit: '' },
        memory: { value: 56, unit: 'Gi' },
        storage: { value: 300, unit: 'Gi' },
        pods: { value: 45, unit: '' },
      },
    },
    kubeletVersion: 'v1.28.5',
    clusterUid: generateId(),
    cluster: 'prod-beijing',
    createAt: '2025-03-01 10:00:00',
    createBy: 'admin',
    updateAt: '2025-08-27 11:00:00',
    updateBy: 'sre-team',
    deletable: false,
  },
]

export const mockNodeDetail: NodeDetailVo = {
  uid: generateId(),
  name: 'master-01',
  clusterUid: generateId(),
  cluster: 'prod-beijing',
  description: 'Kubernetes 控制平面节点，运行 API Server、Scheduler、Controller Manager 等核心组件，是集群的管理枢纽',
  resourceVersion: '1234567890',
  generation: 2,
  deletionTimestamp: '',
  ownerReferences: [],
  finalizers: [],
  labels: {
    'node-role.kubernetes.io/control-plane': '',
    'node-role.kubernetes.io/master': '',
    'kubernetes.io/os': 'linux',
    'kubernetes.io/arch': 'amd64',
    'topology.kubernetes.io/zone': 'cn-north-1a',
    'node-type': 'high-memory',
  },
  annotations: {
    'kubernetes.io/description': 'Master 节点，负责集群管控',
    'monitoring.io/scrape': 'true',
  },
  status: 'Ready',
  statusMsg: '节点健康，所有组件运行正常',
  spec: {
    podCIDR: '10.244.0.0/24',
    podCIDRs: ['10.244.0.0/24', '2001:db8:1::/64'],
    providerID: 'aws:///cn-north-1a/i-1234567890abcdef0',
    unschedulable: false,
    taints: [
      {
        key: 'node-role.kubernetes.io/control-plane',
        value: 'true',
        effect: 'NoSchedule',
        timeAdded: '2025-01-15 08:00:00',
      },
      {
        key: 'node-role.kubernetes.io/master',
        value: '',
        effect: 'NoSchedule',
        timeAdded: '2025-01-15 08:00:00',
      },
    ],
    configSource: {
      configMap: {
        namespace: 'kube-system',
        name: 'kubelet-config-1.28',
        uid: generateId(),
        resourceVersion: '123456',
        kubeletConfigKey: 'kubelet',
      },
    },
    externalID: 'i-1234567890abcdef0',
  },
  statusObj: {
    capacity: {
      cpu: { value: 16, unit: '' },
      memory: { value: 64, unit: 'Gi' },
      storage: { value: 500, unit: 'Gi' },
      pods: { value: 110, unit: '' },
    },
    allocatable: {
      cpu: { value: 14, unit: '' },
      memory: { value: 56, unit: 'Gi' },
      storage: { value: 480, unit: 'Gi' },
      pods: { value: 100, unit: '' },
    },
    conditions: [
      {
        type: 'Ready',
        status: 'True',
        lastProbeTime: '2026-08-28 08:00:00',
        lastTransitionTime: '2025-01-15 08:05:00',
        reason: 'KubeletReady',
        message: 'kubelet is posting ready status',
      },
      {
        type: 'MemoryPressure',
        status: 'False',
        lastProbeTime: '2026-08-28 08:00:00',
        lastTransitionTime: '2025-01-15 08:00:00',
        reason: 'KubeletHasSufficientMemory',
        message: 'kubelet has sufficient memory available',
      },
      {
        type: 'DiskPressure',
        status: 'False',
        lastProbeTime: '2026-08-28 08:00:00',
        lastTransitionTime: '2025-01-15 08:00:00',
        reason: 'KubeletHasNoDiskPressure',
        message: 'kubelet has no disk pressure',
      },
      {
        type: 'PIDPressure',
        status: 'False',
        lastProbeTime: '2026-08-28 08:00:00',
        lastTransitionTime: '2025-01-15 08:00:00',
        reason: 'KubeletHasSufficientPID',
        message: 'kubelet has sufficient PID available',
      },
      {
        type: 'NetworkUnavailable',
        status: 'False',
        lastProbeTime: '2026-08-28 08:00:00',
        lastTransitionTime: '2025-01-15 08:00:00',
        reason: 'CalicoIsUp',
        message: 'Calico networking is up',
      },
    ],
    addresses: [
      { type: 'Hostname', address: 'master-01' },
      { type: 'InternalIP', address: '10.0.1.10' },
      { type: 'ExternalIP', address: '203.0.113.10' },
      { type: 'InternalDNS', address: 'master-01.internal.cluster.local' },
    ],
    daemonEndpoints: {
      kubeletEndpoint: { Port: 10250 },
    },
    nodeInfo: {
      machineID: 'a1b2c3d4e5f6g7h8i9j0',
      systemUUID: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
      bootID: 'boot-1234567890',
      kernelVersion: '5.15.0-91-generic',
      osImage: 'Ubuntu 22.04.3 LTS',
      containerRuntimeVersion: 'containerd://1.7.6',
      kubeletVersion: 'v1.28.5',
      kubeProxyVersion: 'v1.28.5',
      operatingSystem: 'linux',
      architecture: 'amd64',
      swap: { capacity: 0 },
    },
    images: [
      {
        names: ['k8s.gcr.io/kube-apiserver:v1.28.5', 'kube-apiserver:v1.28.5'],
        sizeBytes: 126000000,
      },
      {
        names: ['k8s.gcr.io/kube-controller-manager:v1.28.5'],
        sizeBytes: 112000000,
      },
      {
        names: ['k8s.gcr.io/kube-scheduler:v1.28.5'],
        sizeBytes: 108000000,
      },
      {
        names: ['k8s.gcr.io/etcd:3.5.9-0'],
        sizeBytes: 95000000,
      },
      {
        names: ['k8s.gcr.io/coredns:v1.10.1'],
        sizeBytes: 45000000,
      },
      {
        names: ['calico/node:v3.26.1'],
        sizeBytes: 120000000,
      },
      {
        names: ['nginx:1.25'],
        sizeBytes: 180000000,
      },
      {
        names: ['prom/prometheus:v2.45.0'],
        sizeBytes: 220000000,
      },
    ],
    volumesInUse: ['kubernetes.io/aws-ebs/pvc-12345678-1234-1234-1234-123456789abc'],
    volumesAttached: [
      {
        name: 'kubernetes.io/aws-ebs/pvc-12345678-1234-1234-1234-123456789abc',
        devicePath: '/dev/xvda',
      },
    ],
    config: {
      assigned: {
        configMap: {
          namespace: 'kube-system',
          name: 'kubelet-config-1.28',
          uid: generateId(),
          resourceVersion: '123456',
          kubeletConfigKey: 'kubelet',
        },
      },
      active: {
        configMap: {
          namespace: 'kube-system',
          name: 'kubelet-config-1.28',
          uid: generateId(),
          resourceVersion: '123456',
          kubeletConfigKey: 'kubelet',
        },
      },
      lastKnownGood: {
        configMap: {
          namespace: 'kube-system',
          name: 'kubelet-config-1.27',
          uid: generateId(),
          resourceVersion: '123455',
          kubeletConfigKey: 'kubelet',
        },
      },
      error: '',
    },
    runtimeHandlers: [
      {
        name: 'runc',
        features: {
          recursiveReadOnlyMounts: true,
          userNamespaces: true,
        },
      },
      {
        name: 'containerd',
        features: {
          recursiveReadOnlyMounts: true,
          userNamespaces: false,
        },
      },
    ],
    features: {
      supplementalGroupsPolicy: true,
    },
    declaredFeatures: ['SupplementalGroupsPolicy', 'NodeDeclaredFeatures'],
  },
  createAt: '2025-01-15 08:00:00',
  createBy: 'admin',
  updateAt: '2025-08-20 10:30:00',
  updateBy: 'sre-team',
  deletable: false,
}

export const mockNodeYaml: string = `
apiVersion: v1
kind: Node
metadata:
  name: master-01
  uid: 12345678-1234-1234-1234-123456789abc
  resourceVersion: "1234567890"
  generation: 2
  labels:
    node-role.kubernetes.io/control-plane: ""
    node-role.kubernetes.io/master: ""
    kubernetes.io/os: linux
    kubernetes.io/arch: amd64
    topology.kubernetes.io/zone: cn-north-1a
    node-type: high-memory
  annotations:
    kubernetes.io/description: "Master 节点，负责集群管控"
    monitoring.io/scrape: "true"
    platform.io/cluster: "prod-beijing"
    platform.io/cluster-uid: "12345678-1234-1234-1234-123456789abd"
    platform.io/description: "Kubernetes 控制平面节点，运行 API Server、Scheduler、Controller Manager 等核心组件，是集群的管理枢纽"
spec:
  podCIDR: 10.244.0.0/24
  podCIDRs:
  - 10.244.0.0/24
  - 2001:db8:1::/64
  providerID: aws:///cn-north-1a/i-1234567890abcdef0
  unschedulable: false
  taints:
  - key: node-role.kubernetes.io/control-plane
    value: "true"
    effect: NoSchedule
    timeAdded: "2025-01-15T08:00:00Z"
  - key: node-role.kubernetes.io/master
    value: ""
    effect: NoSchedule
    timeAdded: "2025-01-15T08:00:00Z"
  configSource:
    configMap:
      namespace: kube-system
      name: kubelet-config-1.28
      uid: 12345678-1234-1234-1234-123456789abe
      resourceVersion: "123456"
      kubeletConfigKey: kubelet
  externalID: i-1234567890abcdef0
status:
  capacity:
    cpu: "16"
    memory: 64Gi
    storage: 500Gi
    ephemeral-storage: 200Gi
    pods: "110"
  allocatable:
    cpu: "14"
    memory: 56Gi
    storage: 480Gi
    ephemeral-storage: 190Gi
    pods: "100"
  phase: Active
  conditions:
  - type: Ready
    status: "True"
    lastProbeTime: "2026-08-28T08:00:00Z"
    lastTransitionTime: "2025-01-15T08:05:00Z"
    reason: KubeletReady
    message: kubelet is posting ready status
  - type: MemoryPressure
    status: "False"
    lastProbeTime: "2026-08-28T08:00:00Z"
    lastTransitionTime: "2025-01-15T08:00:00Z"
    reason: KubeletHasSufficientMemory
    message: kubelet has sufficient memory available
  - type: DiskPressure
    status: "False"
    lastProbeTime: "2026-08-28T08:00:00Z"
    lastTransitionTime: "2025-01-15T08:00:00Z"
    reason: KubeletHasNoDiskPressure
    message: kubelet has no disk pressure
  - type: PIDPressure
    status: "False"
    lastProbeTime: "2026-08-28T08:00:00Z"
    lastTransitionTime: "2025-01-15T08:00:00Z"
    reason: KubeletHasSufficientPID
    message: kubelet has sufficient PID available
  - type: NetworkUnavailable
    status: "False"
    lastProbeTime: "2026-08-28T08:00:00Z"
    lastTransitionTime: "2025-01-15T08:00:00Z"
    reason: CalicoIsUp
    message: Calico networking is up
  addresses:
  - type: Hostname
    address: master-01
  - type: InternalIP
    address: 10.0.1.10
  - type: ExternalIP
    address: 203.0.113.10
  - type: InternalDNS
    address: master-01.internal.cluster.local
  daemonEndpoints:
    kubeletEndpoint:
      Port: 10250
  nodeInfo:
    machineID: a1b2c3d4e5f6g7h8i9j0
    systemUUID: a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6
    bootID: boot-1234567890
    kernelVersion: 5.15.0-91-generic
    osImage: Ubuntu 22.04.3 LTS
    containerRuntimeVersion: containerd://1.7.6
    kubeletVersion: v1.28.5
    kubeProxyVersion: v1.28.5
    operatingSystem: linux
    architecture: amd64
    swap:
      capacity: 0
  images:
  - names:
    - k8s.gcr.io/kube-apiserver:v1.28.5
    - kube-apiserver:v1.28.5
    sizeBytes: 126000000
  - names:
    - k8s.gcr.io/kube-controller-manager:v1.28.5
    sizeBytes: 112000000
  - names:
    - k8s.gcr.io/kube-scheduler:v1.28.5
    sizeBytes: 108000000
  - names:
    - k8s.gcr.io/etcd:3.5.9-0
    sizeBytes: 95000000
  - names:
    - k8s.gcr.io/coredns:v1.10.1
    sizeBytes: 45000000
  - names:
    - calico/node:v3.26.1
    sizeBytes: 120000000
  - names:
    - nginx:1.25
    sizeBytes: 180000000
  - names:
    - prom/prometheus:v2.45.0
    sizeBytes: 220000000
  volumesInUse:
  - kubernetes.io/aws-ebs/pvc-12345678-1234-1234-1234-123456789abc
  volumesAttached:
  - name: kubernetes.io/aws-ebs/pvc-12345678-1234-1234-1234-123456789abc
    devicePath: /dev/xvda
  config:
    assigned:
      configMap:
        namespace: kube-system
        name: kubelet-config-1.28
        uid: 12345678-1234-1234-1234-123456789abe
        resourceVersion: "123456"
        kubeletConfigKey: kubelet
    active:
      configMap:
        namespace: kube-system
        name: kubelet-config-1.28
        uid: 12345678-1234-1234-1234-123456789abe
        resourceVersion: "123456"
        kubeletConfigKey: kubelet
    lastKnownGood:
      configMap:
        namespace: kube-system
        name: kubelet-config-1.27
        uid: 12345678-1234-1234-1234-123456789abf
        resourceVersion: "123455"
        kubeletConfigKey: kubelet
    error: ""
  runtimeHandlers:
  - name: runc
    features:
      recursiveReadOnlyMounts: true
      userNamespaces: true
  - name: containerd
    features:
      recursiveReadOnlyMounts: true
      userNamespaces: false
  features:
    supplementalGroupsPolicy: true
  declaredFeatures:
  - SupplementalGroupsPolicy
  - NodeDeclaredFeatures
`

export const mockNodeEventList: EventListVo[] = [
  {
    name: 'node-event-001',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30001',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 08:00:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 08:00:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-abc',
    action: 'Created',
    reason: 'NodeCreated',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'master-01',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node master-01 created successfully',
    type: 'Normal',
  },
  {
    name: 'node-event-002',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30002',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 08:05:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 08:05:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-def',
    action: 'Updated',
    reason: 'NodeUpdated',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'master-01',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node master-01 updated: labels added (node-type=control-plane)',
    type: 'Normal',
  },
  {
    name: 'node-event-003',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30003',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 08:10:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 08:10:00',
    },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-master-01',
    action: 'Ready',
    reason: 'KubeletReady',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'master-01',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node master-01 became ready',
    type: 'Normal',
  },
  {
    name: 'node-event-004',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30004',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 08:15:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 08:15:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-ghi',
    action: 'NotReady',
    reason: 'NodeNotReady',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-05',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node worker-05 is not ready (kubelet stopped posting ready status)',
    type: 'Warning',
  },
  {
    name: 'node-event-005',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30005',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 08:20:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 08:20:00',
    },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-05',
    action: 'NodeNotReady',
    reason: 'NodeStatusUnknown',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-05',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node worker-05 status unknown (network partition)',
    type: 'Warning',
  },
  {
    name: 'node-event-006',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30006',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 08:25:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 08:25:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-jkl',
    action: 'Cordon',
    reason: 'NodeCordoned',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-16',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node worker-16 marked as unschedulable (cordoned) for maintenance',
    type: 'Normal',
  },
  {
    name: 'node-event-007',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30007',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 08:30:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 08:30:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-mno',
    action: 'Uncordon',
    reason: 'NodeUncordoned',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-16',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node worker-16 restored to schedulable',
    type: 'Normal',
  },
  {
    name: 'node-event-008',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30008',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 08:35:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 08:35:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-pqr',
    action: 'TaintAdded',
    reason: 'NodeTaintAdded',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-16',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Taint "node.kubernetes.io/unschedulable:NoSchedule" added to node worker-16',
    type: 'Normal',
  },
  {
    name: 'node-event-009',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30009',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 08:40:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 08:40:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-stu',
    action: 'TaintRemoved',
    reason: 'NodeTaintRemoved',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-16',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Taint "node.kubernetes.io/unschedulable:NoSchedule" removed from node worker-16',
    type: 'Normal',
  },
  {
    name: 'node-event-010',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30010',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 08:45:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 08:45:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-vwx',
    action: 'MemoryPressure',
    reason: 'NodeMemoryPressure',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-02',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node worker-02 has memory pressure (available memory below threshold)',
    type: 'Warning',
  },
  {
    name: 'node-event-011',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30011',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 08:50:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 08:50:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-yza',
    action: 'DiskPressure',
    reason: 'NodeDiskPressure',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-23',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node worker-23 has disk pressure (available disk space below 10%)',
    type: 'Warning',
  },
  {
    name: 'node-event-012',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30012',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 08:55:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 08:55:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-bcd',
    action: 'PIDPressure',
    reason: 'NodePIDPressure',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-02',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node worker-02 has PID pressure (too many processes)',
    type: 'Warning',
  },
  {
    name: 'node-event-013',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30013',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 09:00:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 09:00:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-efg',
    action: 'Deleted',
    reason: 'NodeDeleted',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-15',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node worker-15 deleted from cluster',
    type: 'Normal',
  },
  {
    name: 'node-event-014',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30014',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 09:05:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 09:05:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-hij',
    action: 'Added',
    reason: 'NodeAdded',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-31',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'New node worker-31 added to cluster',
    type: 'Normal',
  },
  {
    name: 'node-event-015',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30015',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 09:10:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 09:10:00',
    },
    reportingController: 'kubelet',
    reportingInstance: 'kubelet-worker-31',
    action: 'NodeReady',
    reason: 'KubeletReady',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-31',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node worker-31 became ready',
    type: 'Normal',
  },
  {
    name: 'node-event-016',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30016',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 09:15:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 09:15:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-klm',
    action: 'NodeSchedulable',
    reason: 'NodeSchedulable',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-31',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node worker-31 is schedulable',
    type: 'Normal',
  },
  {
    name: 'node-event-017',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30017',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 09:20:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 09:20:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-nop',
    action: 'VersionUpdated',
    reason: 'NodeKubeletVersionUpdated',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'master-01',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Kubelet version updated to v1.28.6 on master-01',
    type: 'Normal',
  },
  {
    name: 'node-event-018',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30018',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 09:25:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 09:25:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-qrs',
    action: 'ConfigUpdated',
    reason: 'NodeConfigUpdated',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-01',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node config updated (kubelet configuration refreshed)',
    type: 'Normal',
  },
  {
    name: 'node-event-019',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30019',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 09:30:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 09:30:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-tuv',
    action: 'Rebooted',
    reason: 'NodeRebooted',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-03',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node worker-03 rebooted (kernel update applied)',
    type: 'Normal',
  },
  {
    name: 'node-event-020',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30020',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 09:35:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 09:35:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-wxy',
    action: 'ProviderIDUpdated',
    reason: 'NodeProviderIDUpdated',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-22',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node providerID updated to aws:///cn-north-1b/i-1234567890abcdef1',
    type: 'Normal',
  },
  {
    name: 'node-event-021',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30021',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 09:40:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 09:40:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-zab',
    action: 'NodeIPUpdated',
    reason: 'NodeIPUpdated',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-04',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node internal IP updated from 10.0.2.13 to 10.0.2.14',
    type: 'Normal',
  },
  {
    name: 'node-event-022',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30022',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 09:45:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 09:45:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-cde',
    action: 'NodeOutOfDisk',
    reason: 'NodeOutOfDisk',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-29',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node worker-29 is out of disk space (eviction threshold exceeded)',
    type: 'Warning',
  },
  {
    name: 'node-event-023',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30023',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 09:50:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 09:50:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-fgh',
    action: 'NodeMemoryExceeded',
    reason: 'NodeMemoryExceeded',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-13',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node worker-13 memory usage exceeded 90%',
    type: 'Warning',
  },
  {
    name: 'node-event-024',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30024',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 09:55:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 09:55:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-ijk',
    action: 'NodeNetworkUnavailable',
    reason: 'NodeNetworkUnavailable',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-07',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node worker-07 network is unavailable (CNI not ready)',
    type: 'Warning',
  },
  {
    name: 'node-event-025',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30025',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 10:00:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 10:00:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-lmn',
    action: 'NodeContainerRuntimeError',
    reason: 'ContainerRuntimeError',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-06',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Container runtime error on worker-06: containerd failed to start',
    type: 'Warning',
  },
  {
    name: 'node-event-026',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30026',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 10:05:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 10:05:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-opq',
    action: 'NodeKubeletRestarted',
    reason: 'KubeletRestarted',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-08',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Kubelet restarted on worker-08 (configuration update)',
    type: 'Normal',
  },
  {
    name: 'node-event-027',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30027',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 10:10:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 10:10:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-rst',
    action: 'NodeCertRotated',
    reason: 'NodeCertificateRotated',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-09',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Node certificate rotated successfully on worker-09',
    type: 'Normal',
  },
  {
    name: 'node-event-028',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30028',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 10:15:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 10:15:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-uvw',
    action: 'NodeSystemOOM',
    reason: 'SystemOOM',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-17',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'System OOM occurred on worker-17, kernel killed processes',
    type: 'Warning',
  },
  {
    name: 'node-event-029',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30029',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 10:20:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 10:20:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-xyz',
    action: 'NodeDiskSpaceRecovered',
    reason: 'DiskSpaceRecovered',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-23',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Disk space recovered on worker-23 (disk pressure resolved)',
    type: 'Normal',
  },
  {
    name: 'node-event-030',
    namespace: '',
    uid: generateId(),
    resourceVersion: '30030',
    generation: 1,
    deletionTimestamp: '',
    ownerReferences: [],
    finalizers: [],
    labels: {
      'event-type': 'node',
    },
    annotations: {},
    eventTime: '2026-08-28 10:25:00',
    series: {
      count: 1,
      lastObservedTime: '2026-08-28 10:25:00',
    },
    reportingController: 'node-controller',
    reportingInstance: 'node-controller-abc',
    action: 'NodeKubeletVersionMismatch',
    reason: 'KubeletVersionMismatch',
    regarding: {
      kind: 'Node',
      namespace: '',
      name: 'worker-18',
      uid: generateId(),
      apiVersion: 'v1',
    },
    related: undefined,
    note: 'Kubelet version mismatch on worker-18 (expected v1.28.5, got v1.28.4)',
    type: 'Warning',
  },
]

export const mockNodeMonitor: NodeMonitorVo = {}
