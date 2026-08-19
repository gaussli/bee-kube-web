# Entity Node 设计文档

Node 是 Kubernetes 集群中的工作节点（worker node），承载 Pod 的运行。本文档描述 Node 及其关联实体（NodeSpec / NodeStatus / NodeCondition / Taint 等）与枚举的设计。

> 关联类型 `ObjectMeta`、`TypeMeta` 定义见 [`entity-kubernetes-design.md`](entity-kubernetes-design.md)。
> 关联通用类型 `Condition` 定义见 [`entity-kubernetes-design.md#condition`](entity-kubernetes-design.md#condition)。
> 关联通用类型 `ResourceName`、`Quantity` 定义见 [`entity-kubernetes-design.md`](entity-kubernetes-design.md)。

## 文档约定

- 标题（`###` 章节）使用纯英文，中文说明置于标题下方的「定义说明」行，避免中文锚点乱码。
- 类型名、常量名一律使用 `` ` `` 包裹，以区分普通文本。
- 类型引用规律：枚举 → 「枚举定义见」；类型仅引用 1 次 → 就地展开；引用 ≥ 2 次 → 抽独立 `###` + 「定义见」；根类型（Spec / StatusObj）保留。
- 多资源共用枚举/类型统一收口到 `entity-kubernetes-design.md`；资源设计文档之间禁止互相引用，本文档不引用其他资源文档。

## Node 常量定义（/src/config/kubernetes/node.ts）

### NodePhase

Node 的生命周期阶段。

#### _nodePhases (internal const)
- 'Pending' （label: '待配置'）
- 'Running' （label: '运行中'）
- 'Terminated' （label: '已终止'）

#### NodePhase (derived from _nodePhases)
```ts
export type NodePhase = (typeof _nodePhases)[number]['value']
```

### TaintEffect

Taint 对非容忍 Pod 的作用效果。

#### _taintEffects (internal const)
- 'NoSchedule' （label: '不调度'）
- 'PreferNoSchedule' （label: '尽量不调度'）
- 'NoExecute' （label: '驱逐'）

#### TaintEffect (derived from _taintEffects)
```ts
export type TaintEffect = (typeof _taintEffects)[number]['value']
```

### NodeConditionType

Node 条件类型，描述节点当前观测到的各类状态。

#### _nodeConditionTypes (internal const)
- 'Ready' （label: '就绪'）
- 'MemoryPressure' （label: '内存压力'）
- 'DiskPressure' （label: '磁盘压力'）
- 'PIDPressure' （label: 'PID 压力'）
- 'NetworkUnavailable' （label: '网络不可用'）

#### NodeConditionType (derived from _nodeConditionTypes)
```ts
export type NodeConditionType = (typeof _nodeConditionTypes)[number]['value']
```

### NodeAddressType

Node 地址类型。

#### _nodeAddressTypes (internal const)
- 'Hostname' （label: '主机名'）
- 'InternalIP' （label: '内网 IP'）
- 'ExternalIP' （label: '外网 IP'）
- 'InternalDNS' （label: '内网 DNS'）
- 'ExternalDNS' （label: '外网 DNS'）

#### NodeAddressType (derived from _nodeAddressTypes)
```ts
export type NodeAddressType = (typeof _nodeAddressTypes)[number]['value']
```

## Node 原始类型定义（/src/types/kubernetes/node/types.ts）

### NodeSpec

Node 的行为规格定义。

- podCIDR?: string （分配给节点的 Pod IP 段）
- podCIDRs?: string[] （分配给节点的 Pod IP 段列表，第 0 项须与 `podCIDR` 一致，IPv4 与 IPv6 各最多 1 个）
- providerID?: string （云厂商分配的节点 ID，格式为 `<ProviderName>://<ProviderSpecificNodeID>`）
- unschedulable?: boolean （是否禁止新 Pod 调度到该节点，默认为 false（可调度））
- taints?: `Taint[]` （节点污点列表；污点作用效果枚举定义见 [`TaintEffect`](#tainteffect)）
- configSource?: `NodeConfigSource` （Deprecated：动态 Kubelet 配置来源，该特性已移除；配置来源定义见 [`NodeConfigSource`](#nodeconfigsource)）
- externalID?: string （Deprecated：部分 kubelet 不再设置该字段，1.13 后移除，请勿依赖）

### NodeStatusObj

Node 的当前状态信息（对应源码 `NodeStatus`）。

- capacity?: Record<`ResourceName`, `Quantity`> （节点总资源量，类型定义见 [`ResourceName`](entity-kubernetes-design.md#resourcename)、[`Quantity`](entity-kubernetes-design.md#quantity)）
- allocatable?: Record<`ResourceName`, `Quantity`> （节点可调度资源量，默认等于 `capacity`；类型定义见 [`ResourceName`](entity-kubernetes-design.md#resourcename)、[`Quantity`](entity-kubernetes-design.md#quantity)）
- phase?: `NodePhase` （节点最近观测到的生命周期阶段，已废弃且不再填充；枚举定义见 [`NodePhase`](#nodephase)）
- conditions?: `Condition<NodeConditionType>[]` （节点当前观测到的条件列表，条件类型枚举定义见 [`NodeConditionType`](#nodeconditiontype)；条件结构定义见 [`Condition`](entity-kubernetes-design.md#condition)）
- addresses?: `NodeAddress[]` （节点可达地址列表；地址类型枚举定义见 [`NodeAddressType`](#nodeaddresstype)）
- daemonEndpoints?: `NodeDaemonEndpoints` （节点上守护进程暴露的端点；结构定义见 [`NodeDaemonEndpoints`](#nodedaemonendpoints)）
- nodeInfo?: `NodeSystemInfo` （节点唯一标识信息；结构定义见 [`NodeSystemInfo`](#nodesysteminfo)）
- images?: `ContainerImage[]` （节点上的容器镜像列表；结构定义见 [`ContainerImage`](#containerimage)）
- volumesInUse?: string[] （节点上正在使用（已挂载）的卷名称列表，类型为 `UniqueVolumeName`）
- volumesAttached?: `AttachedVolume[]` （已挂载到节点的卷列表；结构定义见 [`AttachedVolume`](#attachedvolume)）
- config?: `NodeConfigStatus` （动态 Kubelet 配置分配状态；结构定义见 [`NodeConfigStatus`](#nodeconfigstatus)）
- runtimeHandlers?: `NodeRuntimeHandler[]` （可用的运行时处理器列表；结构定义见 [`NodeRuntimeHandler`](#noderuntimehandler)）
- features?: `NodeFeatures` （CRI 实现所支持的特性集合，+featureGate=SupplementalGroupsPolicy；结构定义见 [`NodeFeatures`](#nodefeatures)）
- declaredFeatures?: string[] （节点声明的与 feature gate 相关的特性列表，+featureGate=NodeDeclaredFeatures）

### Node

Node 根实体，描述集群中的一个工作节点。

- metadata: `ObjectMeta` （标准对象元数据，定义见 [`entity-kubernetes-design.md`](entity-kubernetes-design.md)）
- spec?: `NodeSpec` （节点行为规格，定义见 [`NodeSpec`](#nodespec)）
- status?: `NodeStatusObj` （节点当前状态，定义见 [`NodeStatusObj`](#nodestatusobj)）

### Taint

节点上的污点，对不容忍该污点的 Pod 施加 `effect` 指定的作用。

- key: string （污点键，必填）
- value?: string （与污点键对应的值）
- effect: `TaintEffect` （污点对 Pod 的作用效果，必填；枚举定义见 [`TaintEffect`](#tainteffect)）
- timeAdded?: string （污点被添加的时间（ISO 时间））

### NodeAddress

节点地址信息。

- type: `NodeAddressType` （地址类型，枚举定义见 [`NodeAddressType`](#nodeaddresstype)）
- address: string （节点地址）

### NodeDaemonEndpoints

节点上守护进程暴露的端点列表。

- kubeletEndpoint?: `DaemonEndpoint` （Kubelet 监听端点；结构定义见 [`DaemonEndpoint`](#daemonendpoint)）

### DaemonEndpoint

单个守护进程端点信息。

- Port: number （端点端口号）

### NodeSystemInfo

用于唯一标识节点的 ID / UUID 集合。

- machineID: string （节点 machine-id，集群内唯一机器标识首选字段）
- systemUUID: string （节点 SystemUUID，Red Hat 主机专用）
- bootID: string （节点 Boot ID）
- kernelVersion: string （节点内核版本（uname -r））
- osImage: string （节点操作系统镜像（/etc/os-release））
- containerRuntimeVersion: string （节点容器运行时版本（如 containerd://1.4.2））
- kubeletVersion: string （节点 Kubelet 版本）
- kubeProxyVersion: string （Deprecated：节点 KubeProxy 版本）
- operatingSystem: string （节点操作系统）
- architecture: string （节点架构）
- swap?: `NodeSwapStatus` （节点交换内存信息，+optional；结构定义见 [`NodeSwapStatus`](#nodeswapstatus)）

### NodeSwapStatus

节点交换内存信息。

- capacity?: number （交换内存总量（字节））

### ContainerImage

容器镜像描述。

- names?: string[] （镜像的已知名称列表）
- sizeBytes?: number （镜像大小（字节））

### AttachedVolume

已挂载到节点的卷描述。

- name: string （已挂载卷名称，类型为 `UniqueVolumeName`）
- devicePath: string （卷可用的设备路径）

### NodeRuntimeHandler

运行时处理器信息集合。

- name?: string （运行时处理器名称，默认为空表示默认运行时处理器）
- features?: `NodeRuntimeHandlerFeatures` （支持的特性，+optional；结构定义见 [`NodeRuntimeHandlerFeatures`](#noderuntimehandlerfeatures)）

### NodeRuntimeHandlerFeatures

运行时处理器实现的特性集合。

- recursiveReadOnlyMounts?: boolean （是否支持递归只读挂载）
- userNamespaces?: boolean （是否支持用户命名空间（含卷））

### NodeFeatures

CRI 实现所支持的特性集合（仅依赖 CRI 实现，独立于运行时处理器）。

- supplementalGroupsPolicy?: boolean （运行时是否支持 SupplementalGroupsPolicy 与 ContainerUser，+featureGate=SupplementalGroupsPolicy）

### NodeConfigStatus

Node.Spec.ConfigSource 所分配配置的状态。

- assigned?: `NodeConfigSource` （节点将尝试使用的已检查点配置；结构定义见 [`NodeConfigSource`](#nodeconfigsource)）
- active?: `NodeConfigSource` （节点正在使用的已检查点配置）
- lastKnownGood?: `NodeConfigSource` （出错时回退的已知良好配置）
- error?: string （同步 Spec.ConfigSource 到 Active 配置过程中出现的可读错误描述）

### NodeConfigSource

节点配置来源（Deprecated：自 1.22 起废弃，动态 Kubelet 配置特性已移除）。

- configMap?: `ConfigMapNodeConfigSource` （指向节点 ConfigMap 的引用；结构定义见 [`ConfigMapNodeConfigSource`](#configmapnodeconfigsource)）

### ConfigMapNodeConfigSource

引用 ConfigMap 作为节点配置来源的详细信息（Deprecated：自 1.22 起废弃）。

- namespace: string （被引用 ConfigMap 的 metadata.namespace，必填）
- name: string （被引用 ConfigMap 的 metadata.name，必填）
- uid?: string （被引用 ConfigMap 的 metadata.UID；在 Node.Spec 中禁用，Node.Status 中必填）
- resourceVersion?: string （被引用 ConfigMap 的 metadata.ResourceVersion；在 Node.Spec 中禁用，Node.Status 中必填）
- kubeletConfigKey: string （被引用 ConfigMap 中对应 KubeletConfiguration 结构的键名，必填）
