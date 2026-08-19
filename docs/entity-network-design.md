# Network 实体设计

## 文档约定

本系列实体设计文档统一遵循以下类型引用规范，以支撑后续基于文档准确生成代码、避免 AI 幻觉自我扩展：

1. **枚举（string literal 联合类型）**：均使用「枚举定义见」指向 `## Network 常量定义` 章节中的 `###` 定义，不复述取值列表。
2. **类型只被引用 1 次**：直接就地展开其子字段，不抽独立 `###` 定义。
3. **类型被引用 ≥ 2 次**：抽为独立 `###` 定义，引用处使用「定义见」指向该锚点，不重复展开子字段（含内联字段一并抽离）。
4. **跨文件已定义的类型**：允许引用 `entity-kubernetes-design.md`（Kubernetes 通用/原始定义收口文件）、`entity-common-design.md`（全局通用类型收口文件）以及资源 design 文档。本文不重复定义或展开。资源 design 文档之间禁止互相引用（**唯一例外：可引用 `entity-pod-design.md` 的 Pod 类型**）。当前引用示例：`Condition`/`Protocol` 均来自 `entity-kubernetes-design.md`。
5. 类型名、常量名一律使用 `` ` `` 包裹；链接锚点以 VS Code 自动生成为准（英文标题 `### Xxx` → `#xxx`，首字母小写）。

> 简言之：**枚举 → 枚举定义见；复用 ≥2 次 → 定义见；仅用 1 次 → 直接展开；跨文件共用 → 仅引用收口文件。**

## Network 类型定义（/src/types/kubernetes/network.ts）

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

### PathType

HTTPIngressPath 的路径匹配类型，决定 URL 路径的匹配语义。

#### _pathTypes (internal const)
- 'Exact' （label: '精确匹配，区分大小写地匹配 URL 路径'）
- 'Prefix' （label: '前缀匹配，基于 '/' 分割的路径元素逐个匹配；/foo/bar 匹配 /foo/bar 与 /foo/bar/baz，不匹配 /foo/barbaz；多路径匹配时最长优先'）
- 'ImplementationSpecific' （label: '实现相关，匹配语义由 IngressClass 决定'）

#### PathType (derived from _pathTypes)
```ts
export type PathType = (typeof _pathTypes)[number]['value']
```

### PolicyType

NetworkPolicy 的类型，决定策略作用于入站还是出站流量。

#### _policyTypes (internal const)
- 'Ingress' （label: '作用于入站流量'）
- 'Egress' （label: '作用于出站流量'）

#### PolicyType (derived from _policyTypes)
```ts
export type PolicyType = (typeof _policyTypes)[number]['value']
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

### Ingress

Kubernetes Ingress 实体，定义外部入站流量如何路由到集群内 Service 后端。

- spec?: `IngressSpec` （期望状态，定义见 [`IngressSpec`](#ingressspec)）
- status?: `IngressStatus` （当前状态，定义见 [`IngressStatus`](#ingressstatus)）

继承：`ObjectMeta`（name / namespace / labels / annotations / uid 等，定义见 [`ObjectMeta`](entity-kubernetes-design.md#objectmeta)）。

### IngressSpec

Ingress 的规格定义，描述默认后端、TLS 与路由规则。

- ingressClassName?: string （关联的 IngressClass 名称；也可由 kubernetes.io/ingress.class 注解指定，但字段优先）
- defaultBackend?: `IngressBackend` （默认后端，处理未匹配任何规则的请求；rules 未指定时必须设置，定义见 [`IngressBackend`](#ingressbackend)）
- tls?: `IngressTLS[]` （TLS 配置，目前仅支持 443 单端口，定义见 [`IngressTLS`](#ingresstls)）
- rules?: `IngressRule[]` （主机路由规则列表；未指定或无匹配时流量发往默认后端，定义见 [`IngressRule`](#ingressrule)）

### IngressTLS

Ingress 的 TLS 传输层安全配置。

- hosts?: string[] （TLS 证书包含的主机列表，须与 tlsSecret 名称匹配；默认使用负载均衡控制器的通配符主机）
- secretName?: string （用于终止 443 端口 TLS 流量的 Secret 名称；可选以支持仅基于 SNI 的 TLS 路由）

### IngressRule

Ingress 的路由规则，将指定主机下的路径映射到后端 Service。

- host?: string （完全限定域名（RFC 3986），可为精确域名（如 foo.bar.com）或通配符域名（如 *.foo.com）；不区分 IP、不支持端口；为空则路由所有流量）
- http?: `HTTPIngressRuleValue` （HTTP 路由规则值，若未指定默认 http catch-all；定义见 [`HTTPIngressRuleValue`](#httpingressrulevalue)）

### HTTPIngressRuleValue

HTTP 路由规则，包含映射请求到后端的路径列表。

- paths: `HTTPIngressPath[]` （路径集合，映射请求到后端，定义见 [`HTTPIngressPath`](#httpingresspath)）

### HTTPIngressPath

HTTP 路径，将匹配的入站 URL 路径关联到后端。

- path?: string （匹配的 URL 路径，须以 '/' 开头；使用 PathType 'Exact'/'Prefix' 时必填）
- pathType: `PathType` （路径匹配类型，枚举定义见 [`PathType`](#pathtype)）
- backend: `IngressBackend` （后端服务端点，定义见 [`IngressBackend`](#ingressbackend)）

### IngressBackend

Ingress 的后端，描述某 Service 与端口，或对另一资源的引用。

- service?: `IngressServiceBackend` （作为后端的 Service，与 resource 互斥，定义见 [`IngressServiceBackend`](#ingressservicebackend)）
- resource?: `TypedLocalObjectReference` （对命名空间内其他 Kubernetes 资源的引用，与 service 互斥；若指定则 service 不得设置，定义见 [`TypedLocalObjectReference`](entity-kubernetes-design.md#typedlocalobjectreference)）

### IngressServiceBackend

作为 Ingress 后端的 Service 引用，须与 Ingress 同命名空间。

- name: string （Service 名称）
- port?: `ServiceBackendPort` （引用 Service 的端口，名称或端口号二选一，定义见 [`ServiceBackendPort`](#servicebackendport)）

### ServiceBackendPort

Ingress 后端引用的 Service 端口。

- name?: string （端口名称，与 number 互斥）
- number?: number （端口号，与 name 互斥）

### IngressStatus

Ingress 的当前状态。

- loadBalancer?: `IngressLoadBalancerStatus` （负载均衡器当前状态，定义见 [`IngressLoadBalancerStatus`](#ingressloadbalancerstatus)）

### IngressLoadBalancerStatus

Ingress 负载均衡器的状态。

- ingress?: `IngressLoadBalancerIngress[]` （负载均衡器入口点列表，定义见 [`IngressLoadBalancerIngress`](#ingressloadbalanceringress)）

### IngressLoadBalancerIngress

Ingress 负载均衡器的单个入口点状态。

- ip?: string （基于 IP 的入口地址）
- hostname?: string （基于 DNS 的入口主机名）
- ports?: `IngressPortStatus[]` （该负载均衡器暴露的端口信息，定义见 [`IngressPortStatus`](#ingressportstatus)）

### IngressPortStatus

Ingress 负载均衡器入口端口的错误状态。

- port: number （端口号）
- protocol: `Protocol` （协议，'TCP' / 'UDP' / 'SCTP'，枚举定义见 [`Protocol`](entity-kubernetes-design.md#protocol)）
- error?: string （服务端口问题记录，格式为 CamelCase 或 'foo.example.com/CamelCase'，最大长度 316）

### IngressClass

Ingress 类别资源，Ingress 通过 ingressClassName 引用它来决定由哪个控制器服务。

- spec?: `IngressClassSpec` （期望状态，定义见 [`IngressClassSpec`](#ingressclassspec)）

继承：`ObjectMeta`（定义见 [`ObjectMeta`](entity-kubernetes-design.md#objectmeta)）。

### IngressClassSpec

IngressClass 的规格定义。

- controller?: string （处理该类的控制器名称，须为域名前缀路径，最长 250 字符，不可变，如 'acme.io/ingress-controller'）
- parameters?: `IngressClassParametersReference` （控制器附加配置的自定义资源引用，可选，定义见 [`IngressClassParametersReference`](#ingressclassparametersreference)）

### IngressClassParametersReference

IngressClass 参数引用，指向保存控制器附加配置的 API 对象。

- apiGroup?: string （被引用资源的 API 组；不指定时 Kind 须属于 core API 组；第三方类型必填）
- kind: string （被引用资源的类型（Kind））
- name: string （被引用资源的名称）
- scope?: string （作用域，'Cluster'（默认）或 'Namespace'）
- namespace?: string （被引用资源的命名空间；scope 为 'Namespace' 时必填，scope 为 'Cluster' 时须为空）

### NetworkPolicy

Kubernetes NetworkPolicy 实体，描述一组 Pod 允许/禁止的网络流量规则。

- spec?: `NetworkPolicySpec` （期望状态，定义见 [`NetworkPolicySpec`](#networkpolicyspec)）

继承：`ObjectMeta`（定义见 [`ObjectMeta`](entity-kubernetes-design.md#objectmeta)）。

### NetworkPolicySpec

NetworkPolicy 的规格定义。

- podSelector: `LabelSelector` （选择应用该策略的 Pod；空选择器匹配策略命名空间内所有 Pod，定义见 [`LabelSelector`](entity-kubernetes-design.md#labelselector)）
- ingress?: `NetworkPolicyIngressRule[]` （入站规则列表；为空时该策略不允许任何入站流量（默认隔离），定义见 [`NetworkPolicyIngressRule`](#networkpolicyingressrule)）
- egress?: `NetworkPolicyEgressRule[]` （出站规则列表；为空时限制所有出站流量，定义见 [`NetworkPolicyEgressRule`](#networkpolicyegressrule)）
- policyTypes?: `PolicyType[]` （策略类型列表，如 ['Ingress'] / ['Egress'] / ['Ingress','Egress']；未指定时根据 ingress/egress 规则自动推断，枚举定义见 [`PolicyType`](#policytype)）

### NetworkPolicyIngressRule

NetworkPolicy 的入站规则，允许匹配 ports 与 from 的流量进入所选 Pod。

- ports?: `NetworkPolicyPort[]` （允许的端口列表，逻辑 OR；为空则匹配所有端口，定义见 [`NetworkPolicyPort`](#networkpolicyport)）
- from?: `NetworkPolicyPeer[]` （允许的流量来源，逻辑 OR；为空则匹配所有来源，定义见 [`NetworkPolicyPeer`](#networkpolicypeer)）

### NetworkPolicyEgressRule

NetworkPolicy 的出站规则，允许匹配 ports 与 to 的流量离开所选 Pod。

- ports?: `NetworkPolicyPort[]` （允许的目标端口列表，逻辑 OR；为空则匹配所有端口，定义见 [`NetworkPolicyPort`](#networkpolicyport)）
- to?: `NetworkPolicyPeer[]` （允许的流量目标，逻辑 OR；为空则匹配所有目标，定义见 [`NetworkPolicyPeer`](#networkpolicypeer)）

### NetworkPolicyPort

NetworkPolicy 允许的端口，按协议与端口范围匹配流量。

- protocol?: `Protocol` （协议，'TCP' / 'UDP' / 'SCTP'，默认 'TCP'，枚举定义见 [`Protocol`](entity-kubernetes-design.md#protocol)）
- port?: number | string （端口，可为数字或命名端口；不提供则匹配所有端口）
- endPort?: number （端口范围上限（含）；仅当 port 为数字时可用，且须 ≥ port）

### IPBlock

IPBlock 描述允许/排除的 CIDR 网段。

- cidr: string （IPBlock CIDR 网段，如 '192.168.1.0/24' 或 '2001:db8::/64'）
- except?: string[] （不应包含的 CIDR 列表；若在 cidr 范围内则会被拒绝）

### NetworkPolicyPeer

NetworkPolicy 的对端，描述允许流量的来源或目标；仅允许 podSelector / namespaceSelector / ipBlock 的特定组合。

- podSelector?: `LabelSelector` （选择 Pod；与 namespaceSelector 同时设置时选择指定命名空间内匹配的 Pod，定义见 [`LabelSelector`](entity-kubernetes-design.md#labelselector)）
- namespaceSelector?: `LabelSelector` （基于集群范围标签选择命名空间；与 podSelector 同时设置时选择匹配命名空间内匹配的 Pod，定义见 [`LabelSelector`](entity-kubernetes-design.md#labelselector)）
- ipBlock?: `IPBlock` （基于 IPBlock 的策略；设置后其他字段不可同时设置，定义见 [`IPBlock`](#ipblock)）
