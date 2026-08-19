# Kubernetes 通用与原始类型定义

## Kubernetes 常量定义（`/src/config/kubernetes/core.ts`）

### ResourceName

标识资源列表（Record<`ResourceName`, `Quantity`>）中各类资源的名称（string literal 类型），命名须符合小写字母、数字及 `-`/`_`/`.` 组合、长度 ≤ 63、首尾非特殊字符的约定。

#### _resourceNames (internal const)
- 'cpu' （label: 'CPU'）
- 'memory' （label: '内存'）
- 'storage' （label: '存储'）
- 'ephemeral-storage' （label: '临时存储'）

#### ResourceName (derived from _resourceNames)
```ts
export type ResourceName = (typeof _resourceNames)[number]['value']
```

### Signal

容器停止时发送的信号（string literal 类型，+enum）。

#### _signals (internal const)
- 'SIGABRT' （label: '终止进程'）
- 'SIGALRM' （label: '定时器超时'）
- 'SIGBUS' （label: '总线错误'）
- 'SIGCHLD' （label: '子进程状态变更'）
- 'SIGCLD' （label: '子进程状态变更'）
- 'SIGCONT' （label: '继续执行'）
- 'SIGFPE' （label: '浮点异常'）
- 'SIGHUP' （label: '终端挂起'）
- 'SIGILL' （label: '非法指令'）
- 'SIGINT' （label: '中断'）
- 'SIGIO' （label: '异步 I/O'）
- 'SIGIOT' （label: 'IOT 陷阱'）
- 'SIGKILL' （label: '强制终止'）
- 'SIGPIPE' （label: '管道断裂'）
- 'SIGPOLL' （label: '轮询事件'）
- 'SIGPROF' （label: '性能定时'）
- 'SIGPWR' （label: '电源故障'）
- 'SIGQUIT' （label: '退出转储'）
- 'SIGSEGV' （label: '段错误'）
- 'SIGSTKFLT' （label: '栈错误'）
- 'SIGSTOP' （label: '暂停执行'）
- 'SIGSYS' （label: '非法系统调用'）
- 'SIGTERM' （label: '终止请求'）
- 'SIGTRAP' （label: '断点陷阱'）
- 'SIGTSTP' （label: '终端停止'）
- 'SIGTTIN' （label: '后台读终端'）
- 'SIGTTOU' （label: '后台写终端'）
- 'SIGURG' （label: '紧急数据'）
- 'SIGUSR1' （label: '用户信号 1'）
- 'SIGUSR2' （label: '用户信号 2'）
- 'SIGVTALRM' （label: '虚拟定时'）
- 'SIGWINCH' （label: '窗口变更'）
- 'SIGXCPU' （label: 'CPU 超时'）
- 'SIGXFSZ' （label: '文件超限'）
- 'SIGRTMIN' （label: '实时信号最小'）
- 'SIGRTMIN+1' （label: '实时信号 +1'）
- 'SIGRTMIN+2' （label: '实时信号 +2'）
- 'SIGRTMIN+3' （label: '实时信号 +3'）
- 'SIGRTMIN+4' （label: '实时信号 +4'）
- 'SIGRTMIN+5' （label: '实时信号 +5'）
- 'SIGRTMIN+6' （label: '实时信号 +6'）
- 'SIGRTMIN+7' （label: '实时信号 +7'）
- 'SIGRTMIN+8' （label: '实时信号 +8'）
- 'SIGRTMIN+9' （label: '实时信号 +9'）
- 'SIGRTMIN+10' （label: '实时信号 +10'）
- 'SIGRTMIN+11' （label: '实时信号 +11'）
- 'SIGRTMIN+12' （label: '实时信号 +12'）
- 'SIGRTMIN+13' （label: '实时信号 +13'）
- 'SIGRTMIN+14' （label: '实时信号 +14'）
- 'SIGRTMIN+15' （label: '实时信号 +15'）
- 'SIGRTMAX-14' （label: '实时信号 -14'）
- 'SIGRTMAX-13' （label: '实时信号 -13'）
- 'SIGRTMAX-12' （label: '实时信号 -12'）
- 'SIGRTMAX-11' （label: '实时信号 -11'）
- 'SIGRTMAX-10' （label: '实时信号 -10'）
- 'SIGRTMAX-9' （label: '实时信号 -9'）
- 'SIGRTMAX-8' （label: '实时信号 -8'）
- 'SIGRTMAX-7' （label: '实时信号 -7'）
- 'SIGRTMAX-6' （label: '实时信号 -6'）
- 'SIGRTMAX-5' （label: '实时信号 -5'）
- 'SIGRTMAX-4' （label: '实时信号 -4'）
- 'SIGRTMAX-3' （label: '实时信号 -3'）
- 'SIGRTMAX-2' （label: '实时信号 -2'）
- 'SIGRTMAX-1' （label: '实时信号 -1'）
- 'SIGRTMAX' （label: '实时信号最大'）

#### Signal (derived from _signals)
```ts
export type Signal = (typeof _signals)[number]['value']
```

### PersistentVolumeAccessMode

持久卷访问模式（string literal 类型，+enum），描述卷可被挂载的读写方式与节点/ Pod 范围约束。

#### _persistentVolumeAccessModes (internal const)
- 'ReadWriteOnce' （label: '单节点读写'）
- 'ReadOnlyMany' （label: '多节点只读'）
- 'ReadWriteMany' （label: '多节点读写'）
- 'ReadWriteOncePod' （label: '单 Pod 读写'）

#### PersistentVolumeAccessMode (derived from _persistentVolumeAccessModes)
```ts
export type PersistentVolumeAccessMode = (typeof _persistentVolumeAccessModes)[number]['value']
```

### QuantityUnit

资源数量单位（string literal 类型，+enum），标识数值的计量单位。

#### _quantityUnits (internal const)
- '' （label: '无单位，表示整数核或字节'）
- 'm' （label: '毫核，1 核 = 1000m，仅用于 CPU'）
- 'Ki' （label: '二进制千，1 Ki = 1024 字节/单位'）
- 'Mi' （label: '二进制兆，1 Mi = 1024 Ki'）
- 'Gi' （label: '二进制吉，1 Gi = 1024 Mi'）
- 'Ti' （label: '二进制太，1 Ti = 1024 Gi'）
- 'Pi' （label: '二进制拍，1 Pi = 1024 Ti'）
- 'Ei' （label: '二进制艾，1 Ei = 1024 Pi'）
- 'K' （label: '十进制千，1 K = 1000 字节/单位'）
- 'M' （label: '十进制兆，1 M = 1000 K'）
- 'G' （label: '十进制吉，1 G = 1000 M'）
- 'T' （label: '十进制太，1 T = 1000 G'）
- 'P' （label: '十进制拍，1 P = 1000 T'）
- 'E' （label: '十进制艾，1 E = 1000 P'）

#### QuantityUnit (derived from _quantityUnits)
```ts
export type QuantityUnit = (typeof _quantityUnits)[number]['value']
```

### LabelSelectorOperator

标签选择器运算符（string literal 类型，+enum），用于标签表达式的匹配运算。

#### _labelSelectorOperators (internal const)
- 'In' （label: '包含'）
- 'NotIn' （label: '不包含'）
- 'Exists' （label: '存在'）
- 'DoesNotExist' （label: '不存在'）

#### LabelSelectorOperator (derived from _labelSelectorOperators)
```ts
export type LabelSelectorOperator = (typeof _labelSelectorOperators)[number]['value']
```

### Protocol

容器端口协议（string literal 类型，+enum），支持 TCP、UDP 及 SCTP。

#### _protocols (internal const)
- 'TCP' （label: 'TCP'）
- 'UDP' （label: 'UDP'）
- 'SCTP' （label: 'SCTP'）

#### Protocol (derived from _protocols)
```ts
export type Protocol = (typeof _protocols)[number]['value']
```

### HostPathType
HostPath 卷的类型（string literal 类型，+enum），定义宿主机路径在挂载时的存在性与类型校验要求。
#### _hostPathTypes (internal const)
- '' （label: '未指定'）
- 'DirectoryOrCreate' （label: '目录或创建'）
- 'Directory' （label: '目录'）
- 'FileOrCreate' （label: '文件或创建'）
- 'File' （label: '文件'）
- 'Socket' （label: '套接字'）
- 'CharDevice' （label: '字符设备'）
- 'BlockDevice' （label: '块设备'）
#### HostPathType (derived from _hostPathTypes)
```ts
export type HostPathType = (typeof _hostPathTypes)[number]['value']
```

## Kubernetes 通用类型定义 （`/src/types/kubernetes/common.ts`）

### MetadataLabelForm
用于配置资源元数据标签的增删改请求结构。
- labels: Record<string, string> （标签键值对）
- operation: number （操作类型：1 新增；2 移除；3 全量替换（传入的键值对将完全覆盖现有数据））

### MetadataAnnotationForm
用于配置资源元数据注解的增删改请求结构。
- annotations: Record<string, string> （注解键值对）
- operation: number （操作类型：1 新增；2 移除；3 全量替换（传入的键值对将完全覆盖现有数据））

## Kubernetes 原始类型定义 （`/src/types/kubernetes/types.ts`）

### KindMeta
标识资源类型与 API 版本的元数据结构。
- kind: string （资源类型，REST 资源名称，驼峰命名，不可更新）
- apiVersion: string （资源版本，对象表示形式的版本化 schema）

### ObjectMeta
继承 [`Metadata`](#metadata)，描述 Kubernetes 资源的标准元数据，包含名称、命名空间、属主等系统字段。
- name: string （资源名称，命名空间内唯一，创建后不可更新）
- namespace: string （命名空间，名称在该空间内唯一，未指定时等效于 default）
- uid: string （资源唯一标识，由服务端生成且不可变更）
- resourceVersion: string （资源内部版本号，用于乐观并发与变更检测）
- generation: number （期望状态的代次序号，由系统填充，只读）
- deletionTimestamp: string （删除时间戳，发起优雅删除后由系统设置，只读）
- ownerReferences: string[] （属主引用列表，用于垃圾回收与归属关系）
- finalizers: string[] （终结器列表，阻止资源被删除直至处理完成）

### Metadata
资源通用的基础元数据，承载标签与注解。
- labels: Record<string, string> （标签，用于组织与筛选资源）
- annotations: Record<string, string> （注解，用于存储非查询类元数据）

### Clustered
标记资源所属集群的归属信息。
- clusterUid: string （所属集群的 UID）
- cluster: string （所属集群的名称）

### Namespaced
标记资源所属命名空间的归属信息。
- namespaceUid: string （所属命名空间的 UID）
- namespace: string （所属命名空间的名称）

### Quantity
表示带单位的资源数量（如 CPU 核数、内存字节），由数值与单位组成。
- value: number （资源数值，例如 0.5）
- unit: `QuantityUnit` （资源单位，枚举定义见 [`QuantityUnit`](#quantityunit)）

### LabelSelector
通过标签匹配一组资源对象，支持精确标签与表达式两种匹配方式（逻辑与关系）。
- matchLabels: Record<string, string> （键值对，资源须同时具备所有标签且值相等才匹配）
- matchExpressions: `LabelSelectorRequirement[]` （标签表达式匹配列表，与 matchLabels 取逻辑与）
  - key: string （标签键）
  - operator: `LabelSelectorOperator` （标签表达式运算符，In/NotIn 需配合 values，枚举定义见 [`LabelSelectorOperator`](#labelselectoroperator)）
  - values: string[] （匹配值列表，operator 为 Exists / DoesNotExist 时忽略）

### Condition
描述资源某条件的通用状态结构，T 为具体资源的条件类型枚举（泛型，T 为条件类型枚举）。
- type: T （条件类型，由具体资源决定）
- status: string （条件状态，取值 True / False / Unknown）
- lastProbeTime?: string （最近探测时间（ISO 时间））
- lastTransitionTime?: string （最近一次状态转移时间（ISO 时间））
- reason?: string （状态转移原因（机器可读短字符串））
- message?: string （状态转移的可读说明）

### TypedLocalObjectReference
同命名空间内类型化对象引用，指向数据源或后端等目标对象。
- apiGroup?: string （被引用对象所属 API 组；不指定时 Kind 须属于 core API 组；第三方类型必填）
- kind: string （被引用对象的类型（Kind））
- name: string （被引用对象的名称）

### ObjectReference

集群对象的引用，描述事件或关联所指向的资源对象（如 Pod、Deployment）。

- kind?: string （被引用对象的类型（Kind），如 Pod、Deployment、StatefulSet）
- namespace?: string （被引用对象所属命名空间）
- name?: string （被引用对象的名称）
- uid?: string （被引用对象的 UID）
- apiVersion?: string （被引用对象的 API 版本，如 v1、apps/v1）
- resourceVersion?: string （被引用对象的具体资源版本，通常不参与实际匹配）
- fieldPath?: string （指向对象内某个子字段的 JSON/Go 字段访问语句，如 spec.containers[2]）

### HostPathVolumeSource
宿主机路径存储来源，将宿主机上已存在的路径挂载为卷。
- path: string （宿主机上的目录或文件路径，若为软链接则跟随至真实路径）
- type: `HostPathType` （HostPath 类型，默认为空即不检查；枚举定义见 [`HostPathType`](#hostpathtype)）

### NFSVolumeSource
NFS 网络存储来源，挂载 NFS 服务器导出的路径。
- server: string （NFS 服务器地址或主机名）
- path: string （NFS 服务器导出的路径）
- readOnly?: boolean （是否只读挂载，默认 false）
