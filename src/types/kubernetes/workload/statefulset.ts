/**
 * StatefulSet 资源相关类型定义
 * @module types/kubernetes/workload/statefulset
 */
import type { BaseEntity, PageReq } from '@/types/common'

/**
 * StatefulSet 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface StatefulSetResp extends BaseEntity {
  /** StatefulSet 名称 */
  name: string
  /** 所属命名空间 */
  namespace: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName: string
  /** 状态 */
  status: string
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 当前副本数 */
  currentReplicas: number
  /** 关联的服务名 */
  serviceName: string
  /** 更新策略 */
  updateStrategy: 'RollingUpdate' | 'OnDelete'
  /** Pod 管理策略 */
  podManagementPolicy: 'OrderedReady' | 'Parallel'
  /** 使用的镜像列表 */
  images: string[]
  /** 标签选择器 */
  selector: Record<string, string>
  /** 标签 */
  labels: Record<string, string>
  /** 注解 */
  annotations: Record<string, string>
  /** 存储模板 */
  volumeClaimTemplates?: VolumeClaimTemplate[]
  /** 是否可删除 */
  deletable: boolean
}

/**
 * StatefulSet 查询请求参数
 * @extends PageReq 继承分页请求（含 page, pageSize）
 */
export interface StatefulSetQueryReq extends PageReq {
  /** StatefulSet 名称（模糊匹配） */
  name?: string
  /** 命名空间名称 */
  namespace?: string
  /** 集群 ID */
  clusterId: string
  /** 状态 */
  status?: string
  /** 标签选择器 */
  labelSelector?: string
}

/**
 * StatefulSet 创建/更新请求参数
 */
export interface StatefulSetReq {
  /** StatefulSet 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 副本数 */
  replicas: number
  /** 关联的服务名 */
  serviceName: string
  /** 更新策略 */
  updateStrategy: 'RollingUpdate' | 'OnDelete'
  /** Pod 管理策略 */
  podManagementPolicy: 'OrderedReady' | 'Parallel'
  /** 标签选择器 */
  selector: Record<string, string>
  /** 容器配置列表 */
  containers: StatefulSetContainer[]
  /** 存储模板 */
  volumeClaimTemplates?: VolumeClaimTemplate[]
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * StatefulSet 标签更新请求
 */
export interface StatefulSetLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * StatefulSet 注解更新请求
 */
export interface StatefulSetAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * StatefulSet 扩缩容请求
 */
export interface StatefulSetScaleReq {
  /** 期望副本数 */
  replicas: number
}

/**
 * StatefulSet YAML 导入请求
 */
export interface StatefulSetYamlReq {
  /** YAML 配置内容 */
  yaml: string
}

/**
 * StatefulSet 副本状态
 */
export interface StatefulSetReplicaStatus {
  /** 期望副本数 */
  replicas: number
  /** 就绪副本数 */
  readyReplicas: number
  /** 当前副本数 */
  currentReplicas: number
  /** 更新副本数 */
  updatedReplicas: number
}

/**
 * StatefulSet 容器配置
 */
export interface StatefulSetContainer {
  /** 容器名称 */
  name: string
  /** 镜像 */
  image: string
  /** 镜像拉取策略 */
  imagePullPolicy?: string
  /** 资源请求 */
  resources?: {
    requests?: {
      cpu?: string
      memory?: string
    }
    limits?: {
      cpu?: string
      memory?: string
    }
  }
  /** 端口配置 */
  ports?: Array<{
    name: string
    containerPort: number
    protocol: string
  }>
  /** 环境变量 */
  env?: Array<{
    name: string
    value?: string
    valueFrom?: {
      fieldRef?: {
        fieldPath: string
      }
      secretRef?: {
        name: string
        key: string
      }
      configMapRef?: {
        name: string
        key: string
      }
    }
  }>
  /** 健康检查 */
  livenessProbe?: object
  /** 就绪探针 */
  readinessProbe?: object
}

/**
 * VolumeClaimTemplate 持久化存储模板
 */
export interface VolumeClaimTemplate {
  /** 名称 */
  name: string
  /** 存储类名 */
  storageClassName?: string
  /** 请求存储大小 */
  resources?: {
    requests?: {
      storage: string
    }
  }
  /** 访问模式 */
  accessModes?: string[]
}
