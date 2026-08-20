/**
 * Kubernetes 基础常量配置
 * @module config/kubernetes/core
 */

/** 资源名称原始数据（用于派生类型） */
const _resourceNames = [
  { value: 'cpu', label: 'CPU' },
  { value: 'memory', label: '内存' },
  { value: 'storage', label: '存储' },
  { value: 'ephemeral-storage', label: '临时存储' },
  { value: 'pods', label: 'Pod' },
] as const

/** 资源名称，标识 ResourceList 中各类资源的名称 */
export type ResourceName = (typeof _resourceNames)[number]['value']

/** 容器端口协议原始数据（用于派生类型） */
const _protocols = [
  { value: 'TCP', label: 'TCP' },
  { value: 'UDP', label: 'UDP' },
  { value: 'SCTP', label: 'SCTP' },
] as const

/** 容器端口协议 */
export type Protocol = (typeof _protocols)[number]['value']

/** 资源数量单位原始数据（用于派生类型） */
const _quantityUnits = [
  { value: '', label: '无单位，表示整数核或字节或个数' },
  { value: 'm', label: '毫核，1 核 = 1000m，仅用于 CPU' },
  { value: 'Ki', label: '二进制千，1 Ki = 1024 字节/单位' },
  { value: 'Mi', label: '二进制兆，1 Mi = 1024 Ki' },
  { value: 'Gi', label: '二进制吉，1 Gi = 1024 Mi' },
  { value: 'Ti', label: '二进制太，1 Ti = 1024 Gi' },
  { value: 'Pi', label: '二进制拍，1 Pi = 1024 Ti' },
  { value: 'Ei', label: '二进制艾，1 Ei = 1024 Pi' },
  { value: 'K', label: '十进制千，1 K = 1000 字节/单位' },
  { value: 'M', label: '十进制兆，1 M = 1000 K' },
  { value: 'G', label: '十进制吉，1 G = 1000 M' },
  { value: 'T', label: '十进制太，1 T = 1000 G' },
  { value: 'P', label: '十进制拍，1 P = 1000 T' },
  { value: 'E', label: '十进制艾，1 E = 1000 P' },
] as const

/** 资源数量单位 */
export type QuantityUnit = (typeof _quantityUnits)[number]['value']

/** 标签选择器运算符原始数据（用于派生类型） */
const _labelSelectorOperators = [
  { value: 'In', label: '包含' },
  { value: 'NotIn', label: '不包含' },
  { value: 'Exists', label: '存在' },
  { value: 'DoesNotExist', label: '不存在' },
] as const

/** 标签选择器运算符 */
export type LabelSelectorOperator = (typeof _labelSelectorOperators)[number]['value']

/** 污点效果映射 */
const _taintEffects = [
  { value: 'NoSchedule', label: '不可调度' },
  { value: 'PreferNoSchedule', label: '尽量不调度' },
  { value: 'NoExecute', label: '驱逐' },
] as const

/** 污点效果 */
export type TaintEffect = (typeof _taintEffects)[number]['value']

/** HostPath 卷类型原始数据（用于派生类型） */
const _hostPathTypes = [
  { value: '', label: '未指定' },
  { value: 'DirectoryOrCreate', label: '目录或创建' },
  { value: 'Directory', label: '目录' },
  { value: 'FileOrCreate', label: '文件或创建' },
  { value: 'File', label: '文件' },
  { value: 'Socket', label: '套接字' },
  { value: 'CharDevice', label: '字符设备' },
  { value: 'BlockDevice', label: '块设备' },
] as const

/** HostPath 卷类型 */
export type HostPathType = (typeof _hostPathTypes)[number]['value']

/** 持久卷访问模式原始数据（用于派生类型） */
const _persistentVolumeAccessModes = [
  { value: 'ReadWriteOnce', label: '单节点读写' },
  { value: 'ReadOnlyMany', label: '多节点只读' },
  { value: 'ReadWriteMany', label: '多节点读写' },
  { value: 'ReadWriteOncePod', label: '单 Pod 读写' },
] as const

/** 持久卷访问模式 */
export type PersistentVolumeAccessMode = (typeof _persistentVolumeAccessModes)[number]['value']

/** 容器停止时发送的信号原始数据（用于派生类型） */
const _signals = [
  { value: 'SIGABRT', label: '终止进程' },
  { value: 'SIGALRM', label: '定时器超时' },
  { value: 'SIGBUS', label: '总线错误' },
  { value: 'SIGCHLD', label: '子进程状态变更' },
  { value: 'SIGCLD', label: '子进程状态变更' },
  { value: 'SIGCONT', label: '继续执行' },
  { value: 'SIGFPE', label: '浮点异常' },
  { value: 'SIGHUP', label: '终端挂起' },
  { value: 'SIGILL', label: '非法指令' },
  { value: 'SIGINT', label: '中断' },
  { value: 'SIGIO', label: '异步 I/O' },
  { value: 'SIGIOT', label: 'IOT 陷阱' },
  { value: 'SIGKILL', label: '强制终止' },
  { value: 'SIGPIPE', label: '管道断裂' },
  { value: 'SIGPOLL', label: '轮询事件' },
  { value: 'SIGPROF', label: '性能定时' },
  { value: 'SIGPWR', label: '电源故障' },
  { value: 'SIGQUIT', label: '退出转储' },
  { value: 'SIGSEGV', label: '段错误' },
  { value: 'SIGSTKFLT', label: '栈错误' },
  { value: 'SIGSTOP', label: '暂停执行' },
  { value: 'SIGSYS', label: '非法系统调用' },
  { value: 'SIGTERM', label: '终止请求' },
  { value: 'SIGTRAP', label: '断点陷阱' },
  { value: 'SIGTSTP', label: '终端停止' },
  { value: 'SIGTTIN', label: '后台读终端' },
  { value: 'SIGTTOU', label: '后台写终端' },
  { value: 'SIGURG', label: '紧急数据' },
  { value: 'SIGUSR1', label: '用户信号 1' },
  { value: 'SIGUSR2', label: '用户信号 2' },
  { value: 'SIGVTALRM', label: '虚拟定时' },
  { value: 'SIGWINCH', label: '窗口变更' },
  { value: 'SIGXCPU', label: 'CPU 超时' },
  { value: 'SIGXFSZ', label: '文件超限' },
  { value: 'SIGRTMIN', label: '实时信号最小' },
  { value: 'SIGRTMIN+1', label: '实时信号 +1' },
  { value: 'SIGRTMIN+2', label: '实时信号 +2' },
  { value: 'SIGRTMIN+3', label: '实时信号 +3' },
  { value: 'SIGRTMIN+4', label: '实时信号 +4' },
  { value: 'SIGRTMIN+5', label: '实时信号 +5' },
  { value: 'SIGRTMIN+6', label: '实时信号 +6' },
  { value: 'SIGRTMIN+7', label: '实时信号 +7' },
  { value: 'SIGRTMIN+8', label: '实时信号 +8' },
  { value: 'SIGRTMIN+9', label: '实时信号 +9' },
  { value: 'SIGRTMIN+10', label: '实时信号 +10' },
  { value: 'SIGRTMIN+11', label: '实时信号 +11' },
  { value: 'SIGRTMIN+12', label: '实时信号 +12' },
  { value: 'SIGRTMIN+13', label: '实时信号 +13' },
  { value: 'SIGRTMIN+14', label: '实时信号 +14' },
  { value: 'SIGRTMIN+15', label: '实时信号 +15' },
  { value: 'SIGRTMAX-14', label: '实时信号 -14' },
  { value: 'SIGRTMAX-13', label: '实时信号 -13' },
  { value: 'SIGRTMAX-12', label: '实时信号 -12' },
  { value: 'SIGRTMAX-11', label: '实时信号 -11' },
  { value: 'SIGRTMAX-10', label: '实时信号 -10' },
  { value: 'SIGRTMAX-9', label: '实时信号 -9' },
  { value: 'SIGRTMAX-8', label: '实时信号 -8' },
  { value: 'SIGRTMAX-7', label: '实时信号 -7' },
  { value: 'SIGRTMAX-6', label: '实时信号 -6' },
  { value: 'SIGRTMAX-5', label: '实时信号 -5' },
  { value: 'SIGRTMAX-4', label: '实时信号 -4' },
  { value: 'SIGRTMAX-3', label: '实时信号 -3' },
  { value: 'SIGRTMAX-2', label: '实时信号 -2' },
  { value: 'SIGRTMAX-1', label: '实时信号 -1' },
  { value: 'SIGRTMAX', label: '实时信号最大' },
] as const

/** 容器停止时发送的信号 */
export type Signal = (typeof _signals)[number]['value']
