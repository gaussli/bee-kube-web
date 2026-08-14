/**
 * Pod 原始类型定义
 * @module types/kubernetes/pod/types
 */
import type { Quantity } from '../types'
import type { LabelSelector } from '../workload/types'

/**
 * 键到路径映射
 */
export interface KeyToPath {
  /** 要映射的键名 */
  key: string
  /** 映射到的相对文件路径，不能为绝对路径或以 .. 开头 */
  path: string
  /** 该文件的权限位，未指定时沿用 defaultMode，取值范围 0–511 */
  mode: number
}

/**
 * HostPath 类型
 *
 * - '' 未指定类型，向后兼容留空
 * - 'DirectoryOrCreate' 路径不存在时按需创建空目录，权限 0755
 * - 'Directory' 路径必须为已存在的目录
 * - 'FileOrCreate' 路径不存在时按需创建空文件，权限 0644
 * - 'File' 路径必须为已存在的文件
 * - 'Socket' 路径必须为已存在的 UNIX 套接字
 * - 'CharDevice' 路径必须为已存在的字符设备
 * - 'BlockDevice' 路径必须为已存在的块设备
 */
export type HostPathType =
  | ''
  | 'DirectoryOrCreate'
  | 'Directory'
  | 'FileOrCreate'
  | 'File'
  | 'Socket'
  | 'CharDevice'
  | 'BlockDevice'

/**
 * 挂载宿主机上已存在的文件或目录
 */
export interface HostPathVolumeSource {
  /** 宿主机上的目录或文件路径，若为软链接则跟随至真实路径 */
  path: string
  /** HostPath 类型，默认为空，可选值见 HostPathType */
  type: HostPathType
}

/**
 * 存储介质类型
 *
 * - '' 使用节点默认介质
 * - 'Memory' 使用内存，如 Linux 上的 tmpfs
 * - 'HugePages' 使用大页内存
 * - 'HugePages-' 大页内存前缀，完整表示为 HugePages-<size>
 */
export type StorageMedium = '' | 'Memory' | 'HugePages' | 'HugePages-'

/**
 * 与 Pod 生命周期一致的临时目录
 */
export interface EmptyDirVolumeSource {
  /** 存储介质类型，默认为空即使用节点默认介质 */
  medium?: StorageMedium
  /** 该 EmptyDir 卷所需的本地存储总量上限，默认未定义；内存介质下取该值与 Pod 内容器内存限制之和的较小值 */
  sizeLimit?: Quantity
}

/**
 * 从 Secret 填充的存储卷
 */
export interface SecretVolumeSource {
  /** Pod 所在命名空间中引用的 Secret 名称 */
  secretName: string
  /** 将 Secret 中的键映射到指定路径，未列出键不出现 */
  items?: KeyToPath[]
  /** 创建文件的默认权限位，八进制 0000–0777 或十进制 0–511，默认 0644 */
  defaultMode?: number
  /** Secret 或其键是否必须存在，为 true 时允许不存在 */
  optional?: boolean
}

/**
 * 从 ConfigMap 填充的存储卷
 */
export interface ConfigMapVolumeSource {
  /** Pod 所在命名空间中引用的 ConfigMap 名称 */
  configMapName: string
  /** 将 ConfigMap 中的键映射到指定路径，未列出键不出现 */
  items?: KeyToPath[]
  /** 创建文件的默认权限位，八进制 0000–0777 或十进制 0–511，默认 0644 */
  defaultMode?: number
  /** ConfigMap 或其键是否必须存在，为 true 时允许不存在 */
  optional?: boolean
}

/**
 * 引用同命名空间下的 PVC
 */
export interface PersistentVolumeClaimVolumeSource {
  /** Pod 所在命名空间中引用的 PersistentVolumeClaim 名称 */
  claimName: string
  /** 是否以只读方式挂载，为 true 时强制 VolumeMounts 中的 ReadOnly 设置，默认 false */
  readOnly: boolean
}

/**
 * 由外部 CSI 驱动处理的临时存储
 */
export interface CSIVolumeSource {
  /** 处理该卷的 CSI 驱动名称，需与集群中注册的名称一致 */
  driver: string
  /** 是否以只读方式挂载，默认 false（读写） */
  readOnly?: boolean
  /** 挂载的文件系统类型，如 "ext4"、"xfs"、"ntfs"，未指定时由 CSI 驱动决定默认文件系统 */
  fsType?: string
  /** 传递给 CSI 驱动的特定属性，具体取值参考对应驱动文档 */
  volumeAttributes: Record<string, string>
  /** 引用包含敏感信息的 Secret 名称，用于完成 CSI NodePublishVolume 调用；可为空表示无需 Secret */
  nodePublishSecretName?: string
}

/**
 * 存储卷来源
 */
export interface VolumeSource {
  /** 挂载宿主机上已存在的文件或目录 */
  hostPath?: HostPathVolumeSource
  /** 与 Pod 生命周期一致的临时目录 */
  emptyDir?: EmptyDirVolumeSource
  /** 从 Secret 填充的存储卷 */
  secret?: SecretVolumeSource
  /** 从 ConfigMap 填充的存储卷 */
  configMap?: ConfigMapVolumeSource
  /** 引用同命名空间下的 PVC */
  persistentVolumeClaim?: PersistentVolumeClaimVolumeSource
  /** 由外部 CSI 驱动处理的临时存储 */
  csi?: CSIVolumeSource
}

/**
 * 存储卷
 */
export interface Volume {
  /** 存储卷名称，须为 DNS_LABEL 且在 Pod 内唯一 */
  name: string
  /** 存储卷来源，定义挂载的位置与类型 */
  volumeSource: VolumeSource
}

/**
 * Pod 级安全上下文
 */
export interface PodSecurityContext {
  /** 容器进程入口点的运行 UID，未指定时默认使用镜像元数据中指定的用户 */
  runAsUser: number
  /** 容器进程入口点的运行 GID，未设置时使用运行时默认值 */
  runAsGroup: number
  /** 是否必须以非 root 用户运行，为 true 时 Kubelet 会校验镜像运行时 UID 不为 0，否则启动失败 */
  runAsNonRoot: boolean
}

/**
 * 节点标签匹配运算符
 *
 * - 'In' 值在给定列表中
 * - 'NotIn' 值不在给定列表中
 * - 'Exists' 标签存在，无需 values
 * - 'DoesNotExist' 标签不存在，无需 values
 * - 'Gt' 大于，仅对数字值有效
 * - 'Lt' 小于，仅对数字值有效
 */
export type NodeExpressionOperator = 'In' | 'NotIn' | 'Exists' | 'DoesNotExist' | 'Gt' | 'Lt'

/**
 * 节点选择器表达式
 */
export interface NodeExpression {
  /** 节点标签键 */
  key: string
  /** 匹配运算符 */
  operator: NodeExpressionOperator
  /** 匹配值列表，operator 为 Exists / DoesNotExist 时不生效 */
  values: string[]
}

/**
 * 节点亲和性匹配条件
 */
export interface NodeAffinityTerm {
  /** 节点标签匹配表达式列表 */
  matchExpressions: NodeExpression[]
}

/**
 * 带权重的节点亲和性匹配条件
 * @extends NodeAffinityTerm 继承节点标签匹配表达式列表
 */
export interface WeightedNodeAffinityTerm extends NodeAffinityTerm {
  /** 权重，1~100，值越大优先级越高 */
  weight: number
}

/**
 * 节点亲和性
 */
export interface NodeAffinity {
  /** 必须满足的硬性调度条件，不满足则 Pod 无法调度 */
  required: NodeAffinityTerm[]
  /** 优先满足的软性调度条件，尽量满足，非强制 */
  preferred: WeightedNodeAffinityTerm[]
}

/**
 * Pod 亲和性/反亲和性调度条件
 */
export interface PodAffinityTerm {
  /** 通过标签选择目标 Pod 集合 */
  labelSelector: LabelSelector
  /** 目标 Pod 所在命名空间列表，不填或空数组表示当前命名空间 */
  namespaces: string[]
  /** 通过命名空间标签选择目标命名空间 */
  namespaceSelector: LabelSelector
  /** 拓扑域键，如 kubernetes.io/hostname 表示节点级别，failure-domain.beta.kubernetes.io/zone 表示可用区级别 */
  topologyKey: string
  /** 需匹配的标签键列表 */
  matchLabelKeys: string[]
  /** 需排除匹配的标签键列表 */
  mismatchLabelKeys: string[]
}

/**
 * 带权重的 Pod 亲和性调度条件
 * @extends PodAffinityTerm 继承 Pod 亲和性/反亲和性调度条件
 */
export interface WeightedPodAffinityTerm extends PodAffinityTerm {
  /** 权重，1~100 */
  weight: number
}

/**
 * Pod 亲和性
 */
export interface PodAffinity {
  /** 必须满足的硬性亲和要求 */
  required: PodAffinityTerm[]
  /** 优先满足的软性亲和要求 */
  preferred: WeightedPodAffinityTerm[]
}

/**
 * Pod 反亲和性
 */
export interface PodAntiAffinity {
  /** 必须满足的硬性反亲和要求 */
  required: PodAffinityTerm[]
  /** 优先满足的软性反亲和要求 */
  preferred: WeightedPodAffinityTerm[]
}

/**
 * 亲和性配置
 */
export interface Affinity {
  /** 节点亲和性 */
  nodeAffinity: NodeAffinity
  /** Pod 亲和性 */
  podAffinity: PodAffinity
  /** Pod 反亲和性 */
  podAntiAffinity: PodAntiAffinity
}

/**
 * 污点容忍运算符
 *
 * - 'Exists' 等价于通配值，可容忍某类别下的所有污点
 * - 'Equal' 值与污点值相等才匹配
 * - 'Lt' 小于，执行数值比较，需开启 TaintTolerationComparisonOperators 特性门控
 * - 'Gt' 大于，执行数值比较，需开启 TaintTolerationComparisonOperators 特性门控
 */
export type TolerationOperator = 'Exists' | 'Equal' | 'Lt' | 'Gt'

/**
 * 污点效果
 *
 * - 'NoSchedule' 不允许新 Pod 调度到该节点，除非能容忍该污点
 * - 'PreferNoSchedule' 调度器尽量不将新 Pod 调度到该节点，而非完全禁止
 * - 'NoExecute' 驱逐所有无法容忍该污点的已运行 Pod
 */
export type TaintEffect = 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute'

/**
 * 污点容忍
 */
export interface Toleration {
  /** 容忍所匹配的污点键，为空表示匹配所有污点键；此时 operator 必须为 'Exists'，表示匹配所有键与值 */
  key: string
  /** 键与值的关系运算符，默认 'Equal' */
  operator: TolerationOperator
  /** 容忍所匹配的污点值；operator 为 'Exists' 时应为空，否则为普通字符串 */
  value: string
  /** 匹配的污点效果，为空表示匹配所有污点效果；指定时可选 'NoSchedule' / 'PreferNoSchedule' / 'NoExecute' */
  effect: TaintEffect
  /** 容忍时长（秒），仅对 effect 为 'NoExecute' 的污点生效；未设置表示永久容忍（不驱逐），0 或负数按 0 处理（立即驱逐） */
  tolerationSeconds: number
}

/**
 * 引用的 ConfigMap 来源
 */
export interface ConfigMapEnvSource {
  /** 引用的 ConfigMap 名称 */
  configMapName: string
  /** 该 ConfigMap 是否必须存在，为 true 时允许不存在 */
  optional: boolean
}

/**
 * 引用的 Secret 来源
 */
export interface SecretEnvSource {
  /** 引用的 Secret 名称 */
  secretName: string
  /** 该 Secret 是否必须存在，为 true 时允许不存在 */
  optional: boolean
}

/**
 * 环境变量来源
 */
export interface EnvFromSource {
  /** 附加到每个环境变量名前的前缀，可为任意可打印 ASCII 字符，但不能为 '=' */
  prefix: string
  /** 引用的 ConfigMap 来源 */
  configMapRef: ConfigMapEnvSource
  /** 引用的 Secret 来源 */
  secretRef: SecretEnvSource
}

/**
 * 引用 Pod 字段
 */
export interface ObjectFieldSelector {
  /** 字段路径对应的 schema 版本，默认 "v1" */
  apiVersion: string
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
  divisor: Quantity
}

/**
 * 引用 ConfigMap 中的某个键
 */
export interface ConfigMapKeySelector {
  /** 引用的 ConfigMap 名称 */
  configMapName: string
  /** 要选择的键 */
  key: string
  /** 该 ConfigMap 或其键是否必须存在，为 true 时允许不存在 */
  optional: boolean
}

/**
 * 引用 Secret 中的某个键
 */
export interface SecretKeySelector {
  /** 引用的 Secret 名称 */
  secretName: string
  /** 要选择的键 */
  key: string
  /** 该 Secret 或其键是否必须存在，为 true 时允许不存在 */
  optional: boolean
}

/**
 * 变量值的来源
 */
export interface EnvVarSource {
  /** 引用 Pod 字段，如 metadata.name、metadata.namespace、status.podIP 等 */
  fieldRef?: ObjectFieldSelector
  /** 引用容器资源（cpu、memory 等）及其输出格式 */
  resourceFieldRef?: ResourceFieldSelector
  /** 引用 ConfigMap 中的某个键 */
  configMapKeyRef?: ConfigMapKeySelector
  /** 引用 Secret 中的某个键 */
  secretKeyRef?: SecretKeySelector
}

/**
 * 环境变量
 */
export interface EnvVar {
  /** 环境变量名称，可为任意可打印 ASCII 字符，但不能为 '=' */
  name: string
  /** 变量值，支持 $(VAR_NAME) 引用展开；与 valueFrom 互斥，默认空字符串 */
  value: string
  /** 变量值的来源，value 非空时不可使用 */
  valueFrom?: EnvVarSource
}

/**
 * 计算资源需求
 */
export interface ResourceRequirements {
  /** 容器所需的最小计算资源量；未指定时默认等于 limit（若显式设置），否则由实现定义；request 不得超过 limit */
  request: Record<string, string>
  /** 容器允许使用的最大计算资源量；超过将被限制（如 CPU 限流或内存 OOM 终止） */
  limit: Record<string, string>
}

/**
 * 只读挂载递归模式
 *
 * - 'Disabled' 禁用递归只读模式
 * - 'IfPossible' 若容器运行时支持，则启用递归只读
 * - 'Enabled' 启用递归只读，若不支持则启动 Pod 失败并报错
 */
export type RecursiveReadOnlyMode = 'Disabled' | 'IfPossible' | 'Enabled'

/**
 * 挂载传播模式
 *
 * - 'None' 容器卷不接收宿主机或其他容器的挂载，容器内挂载也不传播到宿主机或其他容器；对应 Linux "private"
 * - 'HostToContainer' 容器卷接收宿主机或其他容器的新挂载，但容器内挂载不传播出去；对应 Linux "rslave"，递归应用于卷内所有挂载
 * - 'Bidirectional' 容器卷接收宿主机或其他容器的新挂载，且自身挂载也传播到宿主机或其他容器；对应 Linux "rshared"，递归应用于卷内所有挂载
 */
export type MountPropagationMode = 'None' | 'HostToContainer' | 'Bidirectional'

/**
 * 容器内卷挂载
 */
export interface VolumeMount {
  /** 必须匹配某个 Volume 的 Name，标识要挂载的卷 */
  name: string
  /** 为 true 时以只读方式挂载，否则读写；默认 false */
  readOnly: boolean
  /** 只读挂载是否递归应用；readOnly 为 false 时无意义且不可设置；未设置等价于 Disabled；设为 IfPossible/Enabled 时 mountPropagation 必须为 None */
  recursiveReadOnly?: RecursiveReadOnlyMode
  /** 容器内挂载路径，卷将挂载到该位置 */
  mountPath: string
  /** 卷内从哪个子路径挂载，默认空字符串表示卷根目录 */
  subPath: string
  /** 挂载如何从宿主机传播到容器及反向；未设置时默认为 None；设为 IfPossible/Enabled 的 recursiveReadOnly 时必须为 None */
  mountPropagation?: MountPropagationMode
  /** 与 subPath 类似，但支持用容器环境变量 $(VAR_NAME) 展开；与 subPath 互斥；默认空字符串 */
  subPathExpr: string
}

/**
 * 容器内裸块设备映射
 */
export interface VolumeDevice {
  /** 必须匹配 Pod 中某个 persistentVolumeClaim 的名称，标识要映射的块设备卷 */
  name: string
  /** 块设备在容器内的映射路径，如 '/dev/block' */
  devicePath: string
}

/**
 * 在容器内执行命令
 */
export interface ExecAction {
  /** 容器内执行的命令行，工作目录为容器根目录 '/'；直接 exec 而非 shell，不支持 '|' 等 shell 语法 */
  command: string[]
}

/**
 * 请求头
 */
export interface HTTPHeader {
  /** 请求头字段名，输出时会规范化，大小写变体视为同一头 */
  name: string
  /** 请求头字段值 */
  value: string
}

/**
 * 连接协议
 *
 * - 'HTTP' 使用 http:// 协议
 * - 'HTTPS' 使用 https:// 协议
 */
export type URIScheme = 'HTTP' | 'HTTPS'

/**
 * 对容器发起 HTTP GET 请求探测
 */
export interface HTTPGetAction {
  /** HTTP 服务器上访问的路径 */
  path: string
  /** 容器上访问的端口号或名称，名称须为 IANA_SVC_NAME，端口范围 1-65535 */
  port: number | string
  /** 要连接的主机名，默认 Pod IP；通常改用 httpHeaders 中的 Host 设置 */
  host: string
  /** 连接协议，默认 'HTTP' */
  scheme?: URIScheme
  /** 请求中设置的自定义请求头，HTTP 允许重复头 */
  httpHeaders: HTTPHeader[]
}

/**
 * 对容器端口发起 TCP 连接探测
 */
export interface TCPSocketAction {
  /** 容器上访问的端口号或名称，名称须为 IANA_SVC_NAME，端口范围 1-65535 */
  port: number | string
  /** 要连接的主机名，默认 Pod IP */
  host: string
}

/**
 * 对 gRPC 服务发起健康检查
 */
export interface GRPCAction {
  /** gRPC 服务端口号，范围 1-65535 */
  port: number
  /** 放入 gRPC HealthCheckRequest 的服务名，未指定时使用 gRPC 默认行为 */
  service?: string
}

/**
 * 容器健康检查探针
 */
export interface Probe {
  /** 在容器内执行命令，退出码为 0 视为健康，非 0 视为不健康 */
  exec?: ExecAction
  /** 对容器发起 HTTP GET 请求探测 */
  httpGet?: HTTPGetAction
  /** 对容器端口发起 TCP 连接探测 */
  tcpSocket?: TCPSocketAction
  /** 对 gRPC 服务发起健康检查 */
  grpc?: GRPCAction
  /** 容器启动后多久（秒）开始首次探针；默认 0 */
  initialDelaySeconds?: number
  /** 探针超时秒数，默认 1，最小值为 1 */
  timeoutSeconds?: number
  /** 探针执行周期（秒），默认 10，最小值为 1 */
  periodSeconds?: number
  /** 失败后经多少次连续成功才视为成功，默认 1；存活和启动探针必须为 1，最小值为 1 */
  successThreshold?: number
  /** 成功后经多少次连续失败才视为失败，默认 3，最小值为 1 */
  failureThreshold?: number
  /** 探针失败后 Pod 优雅终止宽限秒数；为 nil 时沿用 Pod 的 terminationGracePeriodSeconds，否则覆盖；需启用 ProbeTerminationGracePeriod featureGate；最小值为 1 */
  terminationGracePeriodSeconds?: number
}

/**
 * 生命周期钩子处理器
 */
export interface LifecycleHandler {
  /** 在容器内执行命令，详见 Probe 中 exec 说明 */
  exec?: ExecAction
  /** 对容器发起 HTTP GET 请求，详见 Probe 中 httpGet 说明 */
  httpGet?: HTTPGetAction
  /** 容器应休眠的时长，单位：秒 */
  sleep?: number
}

/**
 * 容器生命周期事件触发的动作
 */
export interface Lifecycle {
  /** 容器创建后立即调用；若钩子失败，容器按重启策略终止并重启；其他容器管理操作会阻塞直到钩子完成 */
  postStart: LifecycleHandler
  /** 容器因 API 请求或管理事件即将终止前立即调用；容器崩溃或退出时不调用；无论钩子结果如何，容器最终会在宽限期内终止 */
  preStop: LifecycleHandler
  /** 容器停止时发送的信号，未指定时使用容器运行时默认值；仅当 Pod 的 .spec.os.name 非空时可设置；如 'SIGTERM'、'SIGKILL' 等 */
  stopSignal?: string
}

/**
 * 容器安全上下文
 */
export interface SecurityContext {
  /** 是否以特权模式运行容器；特权容器内进程等效于宿主机 root；默认 false；windows 时不可设置 */
  privileged: boolean
  /** 容器进程入口点的 UID；未指定时默认使用镜像元数据中的用户；容器级优先于 PodSecurityContext；windows 时不可设置 */
  runAsUser: number
  /** 容器进程入口点的 GID；未设置时使用运行时默认值；容器级优先于 PodSecurityContext；windows 时不可设置 */
  runAsGroup: number
  /** 容器是否必须以非 root 用户运行；为 true 时 kubelet 运行时会校验镜像不以 UID 0 运行，否则启动失败；容器级优先于 PodSecurityContext */
  runAsNonRoot: boolean
}

/**
 * 端口协议
 *
 * - 'TCP' TCP 协议
 * - 'UDP' UDP 协议
 * - 'SCTP' SCTP 协议
 */
export type Protocol = 'TCP' | 'UDP' | 'SCTP'

/**
 * 容器暴露端口
 */
export interface ContainerPort {
  /** 端口名称，须为 IANA_SVC_NAME 且在 Pod 内唯一，可被 Service 引用 */
  name: string
  /** 映射到宿主机的端口号，0 < x < 65536，多数容器不需要此字段 */
  hostPort: number
  /** Pod IP 上暴露的端口号，0 < x < 65536，必填 */
  containerPort: number
  /** 端口协议，默认 'TCP' */
  protocol?: Protocol
  /** 外部端口绑定的宿主机 IP */
  hostIP: string
}

/**
 * 终止消息填充方式
 *
 * - 'File' 默认行为，容器退出时将 terminationMessagePath 文件内容作为终止消息
 * - 'FallbackToLogsOnError' 容器异常退出且 terminationMessagePath 无内容时，使用容器日志最近内容作为终止消息
 */
export type TerminationMessagePolicy = 'File' | 'FallbackToLogsOnError'

/**
 * 镜像拉取策略
 *
 * - 'Always' kubelet 总是尝试拉取最新镜像；拉取失败则容器启动失败
 * - 'Never' kubelet 从不拉取镜像，仅使用本地镜像；镜像不存在则容器启动失败
 * - 'IfNotPresent' kubelet 仅在本地不存在镜像时才拉取；镜像不存在且拉取失败则容器启动失败
 */
export type PullPolicy = 'Always' | 'Never' | 'IfNotPresent'

/**
 * 容器
 */
export interface Container {
  /** 容器名称，Pod 内必须唯一（DNS_LABEL 格式），不可更新 */
  name: string
  /** 容器镜像名称，未指定时由上层工作负载控制器默认或覆盖 */
  image: string
  /** 容器入口命令，不在 shell 中执行；未指定时使用镜像的 ENTRYPOINT */
  command?: string[]
  /** 入口命令的参数，未指定时使用镜像的 CMD */
  args?: string[]
  /** 容器工作目录，未指定时使用容器运行时默认（可能由镜像配置） */
  workingDir?: string
  /** 容器暴露的端口列表，未声明不代表端口不可访问 */
  ports?: ContainerPort[]
  /** 填充容器环境变量的来源列表，多个来源键冲突时后者优先 */
  envFrom?: EnvFromSource[]
  /** 容器环境变量列表，同名 Env 变量优先于 envFrom */
  env?: EnvVar[]
  /** 容器所需的计算资源 */
  resources?: ResourceRequirements
  /** 容器级重启策略，覆盖 Pod 级重启策略；取值为 'Always' 的初始化容器表现为 sidecar 行为 */
  restartPolicy?: RestartPolicy
  /** 挂载到容器文件系统的 Pod 卷 */
  volumeMounts?: VolumeMount[]
  /** 容器使用的块设备列表 */
  volumeDevices?: VolumeDevice[]
  /** 存活探针，探测失败则重启容器 */
  livenessProbe?: Probe
  /** 就绪探针，探测失败则将容器从服务端点移除 */
  readinessProbe?: Probe
  /** 启动探针，成功前不执行其他探针；失败则重启容器 */
  startupProbe?: Probe
  /** 容器生命周期事件触发的动作 */
  lifecycle?: Lifecycle
  /** 容器终止消息写入文件路径，默认 /dev/termination-log，超过 4096 字节将被节点截断 */
  terminationMessagePath?: string
  /** 终止消息填充方式，默认 'File' */
  terminationMessagePolicy?: TerminationMessagePolicy
  /** 镜像拉取策略，可选 'Always' / 'Never' / 'IfNotPresent'，默认随标签决定 */
  imagePullPolicy?: PullPolicy
  /** 容器级安全上下文，覆盖 PodSecurityContext 中同名字段 */
  securityContext?: SecurityContext
  /** 是否分配 stdin 缓冲区，默认 false */
  stdin?: boolean
  /** stdin 被单次 attach 后是否关闭，默认 false */
  stdinOnce?: boolean
  /** 是否分配 TTY，需 stdin 为 true，默认 false */
  tty?: boolean
}

/**
 * 容器重启策略
 *
 * - 'Always' 容器终止时总是重启
 * - 'OnFailure' 仅在容器非正常终止时重启
 * - 'Never' 容器终止后从不重启
 *
 * 注：容器级 restartPolicy 与 Pod 级 RestartPolicy 枚举值相同，二者统一使用本定义，容器级优先于 Pod 级生效
 */
export type RestartPolicy = 'Always' | 'OnFailure' | 'Never'

/**
 * DNS 策略
 *
 * - 'ClusterFirstWithHostNet' 优先使用集群 DNS，不可用时回退到 kubelet 默认 DNS 设置
 * - 'ClusterFirst' 优先使用集群 DNS，hostNetwork 为 true 时除外，不可用时回退到默认设置
 * - 'Default' 使用 kubelet 确定的默认 DNS 设置
 * - 'None' 不使用任何 DNS 设置，由 DNSConfig 自行定义 nameservers、search paths 等参数
 */
export type DNSPolicy = 'ClusterFirstWithHostNet' | 'ClusterFirst' | 'Default' | 'None'

/**
 * Pod 规格信息
 */
export interface PodSpec {
  /** Pod 内容器可挂载的存储卷列表 */
  volumes: Volume[]
  /** 初始化容器列表，按序执行于主容器之前 */
  initContainers: Container[]
  /** 主容器列表，Pod 中至少有一个容器 */
  containers: Container[]
  /** 所有容器的重启策略，默认 Always */
  restartPolicy: RestartPolicy
  /** 优雅终止宽限秒数，默认 30 */
  terminationGracePeriodSeconds: number
  /** Pod 在节点上存活的最长秒数，超时则标记失败 */
  activeDeadlineSeconds?: number
  /** DNS 策略，默认 ClusterFirst */
  dnsPolicy: DNSPolicy
  /** 节点标签选择器，须匹配节点标签才可调度 */
  nodeSelector: Record<string, string>
  /** 运行该 Pod 所使用的 ServiceAccount 名称 */
  serviceAccountName: string
  /** Pod 被调度到的节点名称，为空时由调度器决定 */
  nodeName?: string
  /** 是否使用宿主机网络命名空间，默认 false */
  hostNetwork: boolean
  /** 是否使用宿主机 PID 命名空间，默认 false */
  hostPID: boolean
  /** Pod 级安全上下文与容器通用设置 */
  securityContext?: PodSecurityContext
  /** 拉取镜像所用的 Secret 名称列表 */
  imagePullSecrets: string[]
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
