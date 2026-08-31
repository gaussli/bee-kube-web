/**
 * Pod 原始类型定义
 * @module types/kubernetes/pod/types
 */
import type { Condition, Quantity } from '@/types/kubernetes/types'

import type { DNSPolicy, PodConditionType, PodPhase, PodQOSClass, RestartPolicy } from '@/config/kubernetes/pod'

import type { Affinity } from './affinity/types'
import type { Container } from './container/types'
import type { Toleration } from './toleration/types'
import type { Volume } from './volume/types'

/**
 * Pod 规格信息
 */
export interface PodSpec {
  /** Pod 内容器可挂载的存储卷列表 */
  volumes?: Volume[]
  /** 初始化容器列表，按序执行于主容器之前 */
  initContainers?: Container[]
  /** 主容器列表，Pod 中至少有一个容器 */
  containers: Container[]
  /** 各命名空间级资源级别的 PVC 申请列表 */
  ephemeralContainers?: Container[]
  /** 所有容器的重启策略，默认 Always */
  restartPolicy?: RestartPolicy
  /** 优雅终止宽限秒数，默认 30 */
  terminationGracePeriodSeconds?: number
  /** Pod 在节点上存活的最长秒数，超时则标记失败 */
  activeDeadlineSeconds?: number
  /** DNS 策略，默认 ClusterFirst */
  dnsPolicy?: DNSPolicy
  /** 节点标签选择器，须匹配节点标签才可调度 */
  nodeSelector?: Record<string, string>
  /** 运行该 Pod 所使用的 ServiceAccount 名称 */
  serviceAccountName?: string
  /** Pod 被调度到的节点名称，为空时由调度器决定 */
  nodeName?: string
  /** 是否使用宿主机网络命名空间，默认 false */
  hostNetwork?: boolean
  /** 是否使用宿主机 PID 命名空间，默认 false */
  hostPID?: boolean
  /** Pod 级安全上下文与容器通用设置 */
  securityContext?: PodSecurityContext
  /** 拉取镜像所用的 Secret 名称列表 */
  imagePullSecrets?: string[]
  /** Pod 主机名 */
  hostname?: string
  /** Pod 子域名 */
  subdomain?: string
  /** Pod 调度亲和性规则 */
  affinity?: Affinity
  /** Pod 的污点容忍列表 */
  tolerations?: Toleration[]
  /** 优先级类名，如 system-node-critical / system-cluster-critical */
  priorityClassName?: string
  /** 优先级数值，值越大优先级越高 */
  priority?: number
}

/**
 * Pod 级安全上下文
 */
export interface PodSecurityContext {
  /** 容器进程入口点的运行 UID，未指定时默认使用镜像元数据中指定的用户 */
  runAsUser?: number
  /** 容器进程入口点的运行 GID，未设置时使用运行时默认值 */
  runAsGroup?: number
  /** 是否必须以非 root 用户运行，为 true 时 Kubelet 会校验镜像运行时 UID 不为 0，否则启动失败 */
  runAsNonRoot?: boolean
}

/**
 * 引用 Pod 字段
 */
export interface ObjectFieldSelector {
  /** 字段路径对应的 schema 版本，默认 "v1" */
  apiVersion?: string
  /** 要选择的字段路径 */
  fieldPath: string
}

/**
 * 引用容器资源及其输出格式
 */
export interface ResourceFieldSelector {
  /** 容器名称，环境变量场景下可选 */
  containerName?: string
  /** 要选择的资源，如 limits.cpu、requests.memory */
  resource: string
  /** 暴露资源的输出格式除数，默认 "1" */
  divisor?: Quantity
}

/**
 * Pod 当前状态信息
 */
export interface PodStatusObj {
  /** 该状态对应的 metadata.generation，需启用 PodObservedGenerationTracking 特性门控 */
  observedGeneration?: number
  /** Pod 生命周期阶段 */
  phase?: PodPhase
  /** Pod 当前状态的最新观测条件列表 */
  conditions?: Condition<PodConditionType>[]
  /** 说明 Pod 处于当前状态原因的可读消息 */
  message?: string
  /** 说明 Pod 处于当前状态原因的简短 CamelCase 消息，如 'Evicted' */
  reason?: string
  /** 抢占其他 Pod 后指定的提名节点名称，仅在抢占场景下设置 */
  nominatedNodeName?: string
  /** Pod 被分配的宿主机 IP，Pod 尚未启动时为空 */
  hostIP?: string
  /** 分配给宿主机的 IP 地址列表，第一项必须与 hostIP 一致；Pod 尚未启动时为空 */
  hostIPs?: HostIP[]
  /** 分配给 Pod 的 IP 地址，集群内至少可达；尚未分配时为空 */
  podIP?: string
  /** 分配给 Pod 的 IP 地址列表，第 0 项必须与 podIP 一致；尚未分配时为空 */
  podIPs?: PodIP[]
  /** Kubelet 确认该对象的时间（RFC 3339） */
  startTime?: string
  /** Pod 中初始化容器的运行状态列表 */
  initContainerStatuses?: ContainerStatus[]
  /** Pod 中主容器的运行状态列表 */
  containerStatuses?: ContainerStatus[]
  /** Pod 的 QoS 等级 */
  qosClass?: PodQOSClass
  /** Pod 中临时容器的运行状态列表 */
  ephemeralContainerStatuses?: ContainerStatus[]
  /** 容器资源扩容的目标状态，默认空表示无待处理扩容 */
  resize?: string
  /** Pod 及其容器分配的总资源请求量 */
  allocatedResources?: Record<string, Quantity>
}

/**
 * 宿主机的 IP 地址
 */
export interface HostIP {
  /** 宿主机的 IP 地址 */
  ip: string
}

/**
 * Pod 分配的 IP 地址
 */
export interface PodIP {
  /** Pod 分配的 IP 地址 */
  ip: string
}

/**
 * 容器运行状态
 */
export interface ContainerStatus {
  /** 容器名称，Pod 内所有容器类型中唯一，不可更新 */
  name: string
  /** 容器当前状态详情 */
  state?: ContainerState
  /** 容器上次终止状态，用于调试崩溃与重启；容器仍在运行且重启次数为 0 时不填充 */
  lastState?: ContainerState
  /** 容器当前是否通过就绪探针，就绪探针持续执行会改变该值；未指定就绪探针时容器完全启动后默认为 true */
  ready: boolean
  /** 容器重启次数，永不小于 0 */
  restartCount: number
  /** 容器正在运行的镜像名称，可能因运行时解析而与 PodSpec 中的镜像不一致 */
  image: string
  /** 容器镜像的 ID，可能因运行时解析而与 PodSpec 中的镜像不一致 */
  imageID: string
  /** 容器 ID，格式为 '<type>://<container_id>' */
  containerID?: string
  /** 容器是否已完成 postStart 生命周期钩子并通过启动探针；初始化 false，启动探针成功后为 true */
  started?: boolean
}

/**
 * 容器当前状态
 * 仅可指定其中一个状态，均未指定时默认为 ContainerStateWaiting
 */
export interface ContainerState {
  /** 容器等待状态详情 */
  waiting?: ContainerStateWaiting
  /** 容器运行状态详情 */
  running?: ContainerStateRunning
  /** 容器终止状态详情 */
  terminated?: ContainerStateTerminated
}

/**
 * 容器等待状态详情
 */
export interface ContainerStateWaiting {
  /** 容器尚未运行的简要原因 */
  reason?: string
  /** 容器尚未运行原因的详细说明 */
  message?: string
}

/**
 * 容器运行状态详情
 */
export interface ContainerStateRunning {
  /** 容器最后一次（重新）启动的时间 */
  startedAt?: string
}

/**
 * 容器终止状态详情
 */
export interface ContainerStateTerminated {
  /** 容器最后一次终止时的退出码 */
  exitCode: number
  /** 容器终止时收到的信号 */
  signal?: number
  /** 容器终止的简要原因 */
  reason?: string
  /** 容器终止原因的详细说明 */
  message?: string
  /** 容器上次执行开始的时间 */
  startedAt?: string
  /** 容器最后终止的时间 */
  finishedAt?: string
  /** 容器 ID，格式为 '<type>://<container_id>' */
  containerID?: string
}
