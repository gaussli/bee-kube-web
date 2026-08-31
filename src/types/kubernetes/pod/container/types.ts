/**
 * Pod 容器相关实体类型定义
 * @module types/kubernetes/pod/container/types
 */

import type { ObjectFieldSelector, ResourceFieldSelector } from '@/types/kubernetes/pod/types'
import type { Quantity } from '@/types/kubernetes/types'

import type { Protocol, ResourceName } from '@/config/kubernetes/core'
import type {
  MountPropagationMode,
  PullPolicy,
  RecursiveReadOnlyMode,
  RestartPolicy,
  TerminationMessagePolicy,
  URIScheme,
} from '@/config/kubernetes/pod'

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
 * 容器暴露端口
 */
export interface ContainerPort {
  /** 端口名称，须为 IANA_SVC_NAME 且在 Pod 内唯一，可被 Service 引用 */
  name?: string
  /** 映射到宿主机的端口号，0 < x < 65536，多数容器不需要此字段 */
  hostPort?: number
  /** Pod IP 上暴露的端口号，0 < x < 65536，必填 */
  containerPort: number
  /** 端口协议，默认 'TCP' */
  protocol?: Protocol
  /** 外部端口绑定的宿主机 IP */
  hostIP?: string
}

/**
 * 环境变量来源
 */
export interface EnvFromSource {
  /** 附加到每个环境变量名前的前缀，可为任意可打印 ASCII 字符，但不能为 '=' */
  prefix?: string
  /** 引用的 ConfigMap 来源 */
  configMapRef?: ConfigMapEnvSource
  /** 引用的 Secret 来源 */
  secretRef?: SecretEnvSource
}

/**
 * 引用的 ConfigMap 来源
 */
export interface ConfigMapEnvSource {
  /** 引用的 ConfigMap 名称 */
  configMapName: string
  /** 该 ConfigMap 是否必须存在，为 true 时允许不存在 */
  optional?: boolean
}

/**
 * 引用的 Secret 来源
 */
export interface SecretEnvSource {
  /** 引用的 Secret 名称 */
  secretName: string
  /** 该 Secret 是否必须存在，为 true 时允许不存在 */
  optional?: boolean
}

/**
 * 环境变量
 */
export interface EnvVar {
  /** 环境变量名称，可为任意可打印 ASCII 字符，但不能为 '=' */
  name: string
  /** 变量值，支持 $(VAR_NAME) 引用展开；与 valueFrom 互斥，默认空字符串 */
  value?: string
  /** 变量值的来源，value 非空时不可使用 */
  valueFrom?: EnvVarSource
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
 * 引用 ConfigMap 中的某个键
 */
export interface ConfigMapKeySelector {
  /** 引用的 ConfigMap 名称 */
  configMapName: string
  /** 要选择的键 */
  key: string
  /** 该 ConfigMap 或其键是否必须存在，为 true 时允许不存在 */
  optional?: boolean
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
  optional?: boolean
}

/**
 * 计算资源需求
 */
export interface ResourceRequirements {
  /** 容器所需的最小计算资源量；未指定时默认等于 limit（若显式设置），否则由实现定义；request 不得超过 limit */
  request?: Partial<Record<ResourceName, Quantity>>
  /** 容器允许使用的最大计算资源量；超过将被限制（如 CPU 限流或内存 OOM 终止） */
  limit?: Partial<Record<ResourceName, Quantity>>
}

/**
 * 容器内卷挂载
 */
export interface VolumeMount {
  /** 必须匹配某个 Volume 的 Name，标识要挂载的卷 */
  name: string
  /** 为 true 时以只读方式挂载，否则读写；默认 false */
  readOnly?: boolean
  /** 只读挂载是否递归应用；readOnly 为 false 时无意义且不可设置；未设置等价于 Disabled；设为 IfPossible/Enabled 时 mountPropagation 必须为 None */
  recursiveReadOnly?: RecursiveReadOnlyMode
  /** 容器内挂载路径，卷将挂载到该位置 */
  mountPath: string
  /** 卷内从哪个子路径挂载，默认空字符串表示卷根目录 */
  subPath?: string
  /** 挂载如何从宿主机传播到容器及反向；未设置时默认为 None；设为 IfPossible/Enabled 的 recursiveReadOnly 时必须为 None */
  mountPropagation?: MountPropagationMode
  /** 与 subPath 类似，但支持用容器环境变量 $(VAR_NAME) 展开；与 subPath 互斥；默认空字符串 */
  subPathExpr?: string
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
 * 容器生命周期事件触发的动作
 */
export interface Lifecycle {
  /** 容器创建后立即调用；若钩子失败，容器按重启策略终止并重启；其他容器管理操作会阻塞直到钩子完成 */
  postStart?: LifecycleHandler
  /** 容器因 API 请求或管理事件即将终止前立即调用；容器崩溃或退出时不调用；无论钩子结果如何，容器最终会在宽限期内终止 */
  preStop?: LifecycleHandler
  /** 容器停止时发送的信号，未指定时使用容器运行时默认值；仅当 Pod 的 .spec.os.name 非空时可设置；如 'SIGTERM'、'SIGKILL' 等 */
  stopSignal?: string
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
 * 在容器内执行命令
 */
export interface ExecAction {
  /** 容器内执行的命令行，工作目录为容器根目录 '/'；直接 exec 而非 shell，不支持 '|' 等 shell 语法 */
  command?: string[]
}
/**
 * 对容器发起 HTTP GET 请求探测
 */
export interface HTTPGetAction {
  /** HTTP 服务器上访问的路径 */
  path?: string
  /** 容器上访问的端口号或名称，名称须为 IANA_SVC_NAME，端口范围 1-65535 */
  port: number | string
  /** 要连接的主机名，默认 Pod IP；通常改用 httpHeaders 中的 Host 设置 */
  host?: string
  /** 连接协议，默认 'HTTP' */
  scheme?: URIScheme
  /** 请求中设置的自定义请求头，HTTP 允许重复头 */
  httpHeaders?: HTTPHeader[]
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
 * 对容器端口发起 TCP 连接探测
 */
export interface TCPSocketAction {
  /** 容器上访问的端口号或名称，名称须为 IANA_SVC_NAME，端口范围 1-65535 */
  port: number | string
  /** 要连接的主机名，默认 Pod IP */
  host?: string
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
 * 容器安全上下文
 */
export interface SecurityContext {
  /** 是否以特权模式运行容器；特权容器内进程等效于宿主机 root；默认 false；windows 时不可设置 */
  privileged?: boolean
  /** 容器进程入口点的 UID；未指定时默认使用镜像元数据中的用户；容器级优先于 PodSecurityContext；windows 时不可设置 */
  runAsUser?: number
  /** 容器进程入口点的 GID；未设置时使用运行时默认值；容器级优先于 PodSecurityContext；windows 时不可设置 */
  runAsGroup?: number
  /** 容器是否必须以非 root 用户运行；为 true 时 kubelet 运行时会校验镜像不以 UID 0 运行，否则启动失败；容器级优先于 PodSecurityContext */
  runAsNonRoot?: boolean
}
