# Network 实体设计

## 文档约定

本系列实体设计文档统一遵循以下类型引用规范，以支撑后续基于文档准确生成代码、避免 AI 幻觉自我扩展：

1. **枚举（string literal 联合类型）**：均使用「枚举定义见」指向 `## Network 常量定义` 章节中的 `###` 定义，不复述取值列表。
2. **类型只被引用 1 次**：直接就地展开其子字段，不抽独立 `###` 定义。
3. **类型被引用 ≥ 2 次**：抽为独立 `###` 定义，引用处使用「定义见」指向该锚点，不重复展开子字段（含内联字段一并抽离）。
4. **跨文件已定义的类型**：允许引用 `entity-kubernetes-design.md`（Kubernetes 通用/原始定义收口文件）、`entity-common-design.md`（全局通用类型收口文件）以及资源 design 文档。本文不重复定义或展开。资源 design 文档之间禁止互相引用（**唯一例外：可引用 `entity-pod-design.md` 的 Pod 类型**）。当前引用示例：`Condition`/`Protocol` 均来自 `entity-kubernetes-design.md`。
5. 类型名、常量名一律使用 `` ` `` 包裹；链接锚点以 VS Code 自动生成为准（英文标题 `### Xxx` → `#xxx`，首字母小写）。

> 简言之：**枚举 → 枚举定义见；复用 ≥2 次 → 定义见；仅用 1 次 → 直接展开；跨文件共用 → 仅引用收口文件。**

## Network 常量定义（`/src/config/kubernetes/network.ts`）

### ServiceType

Service 的暴露方式，决定外部与集群内部如何访问该服务。

#### _serviceTypes (internal const)
- 'ClusterIP' （label: '集群内访问'）
- 'NodePort' （label: '集群外访问'）
- 'LoadBalancer' （label: '负载均衡'）
- 'ExternalName' （label: '外部域名'）

#### ServiceType (derived from _serviceTypes)
```ts
export type ServiceType = (typeof _serviceTypes)[number]['value']
```

### ServiceAffinity

Service 的会话亲和性类型，决定请求是否定向到同一后端 Pod。

#### _serviceAffinities (internal const)
- 'ClientIP' （label: '基于客户端 IP'）
- 'None' （label: '无会话亲和性'）

#### ServiceAffinity (derived from _serviceAffinities)
```ts
export type ServiceAffinity = (typeof _serviceAffinities)[number]['value']
```

### ServiceExternalTrafficPolicy

Service 外部流量策略，决定外部流量如何路由到后端端点。

#### _serviceExternalTrafficPolicies (internal const)
- 'Cluster' （label: '流量路由到所有端点'）
- 'Local' （label: '仅路由到接收流量的同节点端点，保留客户端源 IP；无本地端点则丢弃'）

#### ServiceExternalTrafficPolicy (derived from _serviceExternalTrafficPolicies)
```ts
export type ServiceExternalTrafficPolicy = (typeof _serviceExternalTrafficPolicies)[number]['value']
```

### ServiceInternalTrafficPolicy

Service 内部流量策略，决定集群内部流量如何路由到后端端点。

#### _serviceInternalTrafficPolicies (internal const)
- 'Cluster' （label: '流量路由到所有端点'）
- 'Local' （label: '仅路由到同节点端点，无本地端点则丢弃'）

#### ServiceInternalTrafficPolicy (derived from _serviceInternalTrafficPolicies)
```ts
export type ServiceInternalTrafficPolicy = (typeof _serviceInternalTrafficPolicies)[number]['value']
```

### LoadBalancerIPMode

负载均衡器入口的 IP 模式，决定流量的送达方式。

#### _loadBalancerIPModes (internal const)
- 'VIP' （label: '流量以负载均衡器 IP 和端口为目的地送达节点'）
- 'Proxy' （label: '流量以节点 IP+端口或 Pod IP+端口为目的地送达节点或 Pod'）

#### LoadBalancerIPMode (derived from _loadBalancerIPModes)
```ts
export type LoadBalancerIPMode = (typeof _loadBalancerIPModes)[number]['value']
```

### ServiceConditionType

Service 的状态条件类型。

#### _serviceConditionTypes (internal const)
- 'LoadBalancerPortsError' （label: '负载均衡器端口分配出错（condition）'）
- 'LoadBalancerMixedProtocolNotSupported' （label: '负载均衡器协议混合不兼容（reason）'）

#### ServiceConditionType (derived from _serviceConditionTypes)
```ts
export type ServiceConditionType = (typeof _serviceConditionTypes)[number]['value']
```

### IPFamily

Service 的 IP 家族类型，决定分配 IPv4 还是 IPv6 地址。

#### _ipFamilies (internal const)
- 'IPv4' （label: 'IPv4'）
- 'IPv6' （label: 'IPv6'）
- '' （label: 'unknown，未指定'）

#### IPFamily (derived from _ipFamilies)
```ts
export type IPFamily = (typeof _ipFamilies)[number]['value']
```

### IPFamilyPolicy

Service 的 IP 家族分配策略，决定分配单栈还是双栈地址。

#### _ipFamilyPolicies (internal const)
- 'SingleStack' （label: '单栈，仅分配首个 IP 家族地址'）
- 'PreferDualStack' （label: '优先双栈，集群不支持时回退单栈'）
- 'RequireDualStack' （label: '强制双栈，集群不支持则创建失败'）

#### IPFamilyPolicy (derived from _ipFamilyPolicies)
```ts
export type IPFamilyPolicy = (typeof _ipFamilyPolicies)[number]['value']
```

### TrafficDistribution

Service 的流量分布偏好，决定流量在节点间的分布策略。

#### _trafficDistributions (internal const)
- 'PreferSameZone' （label: '优先路由到同可用区节点，推荐值'）
- 'PreferSameNode' （label: '优先路由到同节点'）
- 'PreferClose' （label: '优先路由到网络就近节点'）；已废弃（Deprecated），使用 PreferSameZone 替代

#### TrafficDistribution (derived from _trafficDistributions)
```ts
export type TrafficDistribution = (typeof _trafficDistributions)[number]['value']
```

## Network 原始类型定义 （`/src/types/kubernetes/network/types.ts`）

### ServiceSpec

Service 的规格定义，描述端口的暴露方式、流量策略与后端选择。

- ports?: `ServicePort[]` （端口列表，定义见 [`ServicePort`](#serviceport)）
- selector?: Record<string, string> （标签选择器，匹配目标 Pod；ExternalName 忽略）
- clusterIP?: string （集群内部 IP；'None' 为 Headless；ExternalName 须空）
- clusterIPs?: string[] （dual-stack 集群内部 IP 列表；单栈时与 clusterIP 一致）
- type?: `ServiceType` （暴露方式，为空时默认 'ClusterIP'，枚举定义见 [`ServiceType`](#servicetype)）
- externalIPs?: string[] （节点额外接受的外部 IP，非 K8s 管理）
- loadBalancerIP?: string （负载均衡器外部 IP，已废弃（Deprecated））
- loadBalancerSourceRanges?: string[] （允许访问的客户端源 IP 白名单（CIDR），仅云负载均衡器生效）
- sessionAffinity?: `ServiceAffinity` （会话亲和性，为空时默认 'None'，枚举定义见 [`ServiceAffinity`](#serviceaffinity)）
- externalName?: string （ExternalName 外部别名，须小写 RFC-1123 主机名）
- externalTrafficPolicy?: `ServiceExternalTrafficPolicy` （外部流量策略，默认 'Cluster'，枚举定义见 [`ServiceExternalTrafficPolicy`](#serviceexternaltrafficpolicy)）
- healthCheckNodePort?: number （LoadBalancer + Local 时的健康检查节点端口）
- publishNotReadyAddresses?: boolean （未就绪 Pod 也发布为端点）
- sessionAffinityConfig?: 会话亲和性配置
  - clientIP?: 基于客户端 IP 的会话亲和性配置
    - timeoutSeconds?: number （会话保持时长（秒），须 0 < 值 ≤ 86400；默认 10800（3 小时））
- ipFamilies?: `IPFamily[]` （分配的 IP 家族列表，如 ['IPv4'] / ['IPv6']；需与 ipFamilyPolicy 及集群能力匹配，枚举定义见 [`IPFamily`](#ipfamily)）
- ipFamilyPolicy?: `IPFamilyPolicy` （IP 家族分配策略，枚举定义见 [`IPFamilyPolicy`](#ipfamilypolicy)）
- allocateLoadBalancerNodePorts?: boolean （LoadBalancer 是否自动分配 NodePort，默认 true；为 false 时需手动配置）
- loadBalancerClass?: string （负载均衡器类别，仅 LoadBalancer 可设且不可改）
- internalTrafficPolicy?: `ServiceInternalTrafficPolicy` （内部流量策略，默认 'Cluster'，枚举定义见 [`ServiceInternalTrafficPolicy`](#serviceinternaltrafficpolicy)）
- trafficDistribution?: `TrafficDistribution` （流量分布偏好，未设置时由实现采用默认路由策略，枚举定义见 [`TrafficDistribution`](#trafficdistribution)）

### ServicePort

Service 的端口定义，映射 Service 暴露端口与后端 Pod 端口。

- name?: string （端口名称，须唯一且为 DNS_LABEL；单端口时可选）
- protocol?: `Protocol` （网络协议，默认 'TCP'，枚举定义见 [`Protocol`](entity-kubernetes-design.md#protocol)）
- appProtocol?: string （应用层协议提示；IANA 标准名或 'kubernetes.io/' 前缀或自定义前缀）
- port: number （Service 暴露的端口）
- targetPort?: number | string （目标 Pod 端口；未指定则等同 port；clusterIP=None 时忽略）
- nodePort?: number （NodePort/LoadBalancer 在各节点暴露的端口；通常由系统分配）

### ServiceStatusObj

Service 的观测状态（对应源码 `ServiceStatus`）。

- loadBalancer?: `LoadBalancerStatus` （负载均衡器当前状态，存在时返回，定义见 [`LoadBalancerStatus`](#loadbalancerstatus)）
- conditions?: `Condition<ServiceConditionType>[]` （Service 当前状态条件列表，条件类型枚举定义见 [`ServiceConditionType`](#serviceconditiontype)，条件结构定义见 [`Condition`](entity-kubernetes-design.md#condition)）

### LoadBalancerStatus

负载均衡器的当前状态。

- ingress?: `LoadBalancerIngress[]` （外部负载均衡器对外暴露的入口地址列表，定义见 [`LoadBalancerIngress`](#loadbalanceringress)）

### LoadBalancerIngress

负载均衡器的入口地址。

- ip?: string （负载均衡器 IP 地址）
- hostname?: string （负载均衡器主机名）
- ipMode?: `LoadBalancerIPMode` （IP 模式，仅当 ip 字段存在时可设置；枚举定义见 [`LoadBalancerIPMode`](#loadbalanceripmode)）
- ports?: `PortStatus[]` （端口状态列表，定义见 [`PortStatus`](#portstatus)）

### PortStatus

负载均衡器入口的端口状态。

- port: number （端口号）
- protocol?: `Protocol` （协议，'TCP' / 'UDP' / 'SCTP'，默认 'TCP'，枚举定义见 [`Protocol`](entity-kubernetes-design.md#protocol)）
- error?: string （端口分配错误信息，格式为 CamelCase 或 'domain.example.com/CamelCase' 风格）
