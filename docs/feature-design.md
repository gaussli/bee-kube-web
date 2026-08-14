# 基础实体定义

## 全局通用类型定义 （`/src/types/common.ts`）

### ApiResult - 通用 API 响应结构
- code: number （状态码）
- message: string （响应消息）
- data: T （响应数据）
- requestId: string （请求唯一标识）

### PageForm - 分页请求参数
- page: number （页码）
- pageSize: number （每页条数）

### PageVo - 分页响应结构
- list: T[] （数据列表）
- total: number （总条数）
- page: number （当前页码）
- pageSize: number （每页条数）

### IdEntity - ID 实体
- id: string （唯一标识）

### UidEntity - UID 实体
- uid: string （资源 UID）

### AuditEntity - 审计实体
- createAt?: string （创建时间）
- createBy?: string （创建人）
- updateAt?: string （更新时间）
- updateBy?: string （更新人）

### DeletableEntity - 可删除实体
- deletable: boolean （是否可删除）

## Kubernetes 通用类型定义 （`/src/types/kubernetes/common.ts`）

### MetadataLabelForm - 元数据标签配置请求
- labels: Record<string, string> （标签键值对）
- operation: number （操作类型：1 新增；2 移除；3 全量替换（传入的键值对将完全覆盖现有数据））

### MetadataAnnotationForm - 元数据注解配置请求
- annotations: Record<string, string> （注解键值对）
- operation: number （操作类型：1 新增；2 移除；3 全量替换（传入的键值对将完全覆盖现有数据））

## Kubernetes 原始类型定义 （`/src/types/kubernetes/types.ts`）

### KindMeta - 资源类型元数据
- kind: string （资源类型，REST 资源名称，驼峰命名，不可更新）
- apiVersion: string （资源版本，对象表示形式的版本化 schema）

### ObjectMeta - 资源元数据（继承 Metadata）
- name: string （资源名称，命名空间内唯一，创建后不可更新）
- namespace: string （命名空间，名称在该空间内唯一，未指定时等效于 default）
- uid: string （资源唯一标识，由服务端生成且不可变更）
- resourceVersion: string （资源内部版本号，用于乐观并发与变更检测）
- generation: number （期望状态的代次序号，由系统填充，只读）
- deletionTimestamp: string （删除时间戳，发起优雅删除后由系统设置，只读）
- ownerReferences: string[] （属主引用列表，用于垃圾回收与归属关系）
- finalizers: string[] （终结器列表，阻止资源被删除直至处理完成）

### Metadata 基础原数据
- labels: Record<string, string> （标签，用于组织与筛选资源）
- annotations: Record<string, string> （注解，用于存储非查询类元数据）

### Clustered - 集群归属信息
- clusterUid: string （所属集群的 UID）
- cluster: string （所属集群的名称）

### Namespaced - 命名空间归属信息
- namespaceUid: string （所属命名空间的 UID）
- namespace: string （所属命名空间的名称）

### Quantity - 资源数量
- value: number （资源数值，例如 0.5）
- unit: QuantityUnit （资源单位，可选值如下）
  - '' （无单位，表示整数核或字节）
  - 'm' （毫核，1 核 = 1000m，仅用于 CPU）
  - 'Ki' （二进制千，1 Ki = 1024 字节/单位）
  - 'Mi' （二进制兆，1 Mi = 1024 Ki）
  - 'Gi' （二进制吉，1 Gi = 1024 Mi）
  - 'Ti' （二进制太，1 Ti = 1024 Gi）
  - 'Pi' （二进制拍，1 Pi = 1024 Ti）
  - 'Ei' （二进制艾，1 Ei = 1024 Pi）
  - 'K' （十进制千，1 K = 1000 字节/单位）
  - 'M' （十进制兆，1 M = 1000 K）
  - 'G' （十进制吉，1 G = 1000 M）
  - 'T' （十进制太，1 T = 1000 G）
  - 'P' （十进制拍，1 P = 1000 T）
  - 'E' （十进制艾，1 E = 1000 P）

## Event 原始类型定义（`/src/types/kubernetes/event/types.ts`）

### Event - 事件，继承 ObjectMeta
- eventTime: string （事件首次被观测到的时间，microTime 精度，必填）
- series: EventSeries （事件系列聚合信息，同一系列事件的聚合；单条事件为 nil，可选）
- reportingController: string （上报该事件的控制器名称，例如 kubernetes.io/kubelet，必填）
- reportingInstance: string （控制器实例 ID，例如 kubelet-xyzf，必填）
- action: string （针对关联对象所采取/失败的动作，机器可读，必填，最长 128 字符）
- reason: string （事件原因，人类可读，必填，最长 128 字符）
- regarding: EventInvolvedObject （事件关联对象，即事件所描述的资源对象，可选）
- related: EventInvolvedObject （可选的二级关联对象，用于更复杂的动作，可选）
- note: string （事件描述，人类可读的状态说明，可选，最大 1kB）
- type: EventType （事件类型，取值 Normal / Warning，必填）

### EventType - 事件类型
- 'Normal' （正常事件，资源生命周期中的常规状态变更）
- 'Warning' （警告事件，资源出现异常或失败需关注）

### EventInvolvedObject - 事件关联对象
- apiVersion: string （关联对象的 API 版本）
- kind: string （关联对象的类型，如 Pod / Deployment / StatefulSet）
- name: string （关联对象的名称）
- namespace: string （关联对象所属命名空间）
- uid: string （关联对象的 UID）

### EventSeries - 事件系列
- count: number （该系列事件已发生的次数）
- lastObservedTime: string （该系列事件最近一次被观测到的时间）
- state: string （系列状态，取值 EventSeriesStateWindingDown 表示系列即将停止）

## Event 类型定义（`/src/types/kubernetes/event/index.ts`）

### EventQueryForm - 事件查询条件请求对象
- type: EventType （事件类型）
- reason: string （事件原因）
- note: string （事件描述）
- regarding: EventInvolvedObject （事件关联对象）

### EventListVo - 事件列表项响应对象，继承 Event

## Pod 原始类型定义（`/src/types/kubernetes/pod/types.ts`）

### Volume - 存储卷
- name: string （存储卷名称，须为 DNS_LABEL 且在 Pod 内唯一）
- volumeSource: VolumeSource （存储卷来源，定义挂载的位置与类型）

### VolumeSource - 存储卷来源
- hostPath: HostPathVolumeSource （挂载宿主机上已存在的文件或目录）
  - path: string （宿主机上的目录或文件路径，若为软链接则跟随至真实路径）
  - type: HostPathType （HostPath 类型，默认为空，可选值如下）
    - '' （未指定类型，向后兼容留空）
    - 'DirectoryOrCreate' （路径不存在时按需创建空目录，权限 0755）
    - 'Directory' （路径必须为已存在的目录）
    - 'FileOrCreate' （路径不存在时按需创建空文件，权限 0644）
    - 'File' （路径必须为已存在的文件）
    - 'Socket' （路径必须为已存在的 UNIX 套接字）
    - 'CharDevice' （路径必须为已存在的字符设备）
    - 'BlockDevice' （路径必须为已存在的块设备）
- emptyDir: EmptyDirVolumeSource （与 Pod 生命周期一致的临时目录）
  - medium: StorageMedium （存储介质类型，默认为空即使用节点默认介质，可选值如下）
    - '' （使用节点默认介质）
    - 'Memory' （使用内存，如 Linux 上的 tmpfs）
    - 'HugePages' （使用大页内存）
    - 'HugePages-' （大页内存前缀，完整表示为 HugePages-<size>）
  - sizeLimit: Quantity （该 EmptyDir 卷所需的本地存储总量上限，默认未定义；内存介质下取该值与 Pod 内容器内存限制之和的较小值）
- secret: SecretVolumeSource （从 Secret 填充的存储卷）
  - secretName: string （Pod 所在命名空间中引用的 Secret 名称）
  - items: KeyToPath[] （将 Secret 中的键映射到指定路径，未列出键不出现）
    - key: string （要映射的键名）
    - path: string （映射到的相对文件路径，不能为绝对路径或以 .. 开头）
    - mode: number （该文件的权限位，未指定时沿用 defaultMode，取值范围 0–511）
  - defaultMode: number （创建文件的默认权限位，八进制 0000–0777 或十进制 0–511，默认 0644）
  - optional: boolean （Secret 或其键是否必须存在，为 true 时允许不存在）
- configMap: ConfigMapVolumeSource （从 ConfigMap 填充的存储卷）
  - configMapName: string （Pod 所在命名空间中引用的 ConfigMap 名称）
  - items: KeyToPath[] （将 ConfigMap 中的键映射到指定路径，未列出键不出现）
    - key: string （要映射的键名）
    - path: string （映射到的相对文件路径，不能为绝对路径或以 .. 开头）
    - mode: number （该文件的权限位，未指定时沿用 defaultMode，取值范围 0–511）
  - defaultMode: number （创建文件的默认权限位，八进制 0000–0777 或十进制 0–511，默认 0644）
  - optional: boolean （ConfigMap 或其键是否必须存在，为 true 时允许不存在）
- persistentVolumeClaim: PersistentVolumeClaimVolumeSource （引用同命名空间下的 PVC）
  - claimName: string （Pod 所在命名空间中引用的 PersistentVolumeClaim 名称）
  - readOnly: boolean （是否以只读方式挂载，为 true 时强制 VolumeMounts 中的 ReadOnly 设置，默认 false）
- csi: CSIVolumeSource （由外部 CSI 驱动处理的临时存储）
  - driver: string （处理该卷的 CSI 驱动名称，需与集群中注册的名称一致）
  - readOnly: boolean （是否以只读方式挂载，默认 false（读写））
  - fsType: string （挂载的文件系统类型，如 "ext4"、"xfs"、"ntfs"，未指定时由 CSI 驱动决定默认文件系统）
  - volumeAttributes: Record<string, string> （传递给 CSI 驱动的特定属性，具体取值参考对应驱动文档）
  - nodePublishSecretName: string （引用包含敏感信息的 Secret 名称，用于完成 CSI NodePublishVolume 调用；可为空表示无需 Secret）

### PodSecurityContext - Pod 级安全上下文
- runAsUser: number （容器进程入口点的运行 UID，未指定时默认使用镜像元数据中指定的用户）
- runAsGroup: number （容器进程入口点的运行 GID，未设置时使用运行时默认值）
- runAsNonRoot: boolean （是否必须以非 root 用户运行，为 true 时 Kubelet 会校验镜像运行时 UID 不为 0，否则启动失败）

### NodeExpression - 节点选择器表达式
- key: string （节点标签键）
- operator: NodeExpressionOperator （匹配运算符）
  - 'In' （值在给定列表中）
  - 'NotIn' （值不在给定列表中）
  - 'Exists' （标签存在，无需 values）
  - 'DoesNotExist' （标签不存在，无需 values）
  - 'Gt' （大于，仅对数字值有效）
  - 'Lt' （小于，仅对数字值有效）
- values: string[] （匹配值列表，operator 为 Exists / DoesNotExist 时不生效）

### NodeAffinityTerm - 节点亲和性匹配条件
- matchExpressions: NodeExpression[] （节点标签匹配表达式列表）

### WeightedNodeAffinityTerm - 带权重的节点亲和性匹配条件
- weight: number （权重，1~100，值越大优先级越高）
- matchExpressions: NodeExpression[] （节点标签匹配表达式列表，继承 NodeAffinityTerm）

### NodeAffinity - 节点亲和性
- required: NodeAffinityTerm[] （必须满足的硬性调度条件，不满足则 Pod 无法调度）
- preferred: WeightedNodeAffinityTerm[] （优先满足的软性调度条件，尽量满足，非强制）

### PodAffinityTerm - Pod 亲和性/反亲和性调度条件
- labelSelector: LabelSelector （通过标签选择目标 Pod 集合）
- namespaces: string[] （目标 Pod 所在命名空间列表，不填或空数组表示当前命名空间）
- namespaceSelector: LabelSelector （通过命名空间标签选择目标命名空间）
- topologyKey: string （拓扑域键，如 kubernetes.io/hostname 表示节点级别，failure-domain.beta.kubernetes.io/zone 表示可用区级别）
- matchLabelKeys: string[] （需匹配的标签键列表）
- mismatchLabelKeys: string[] （需排除匹配的标签键列表）

### WeightedPodAffinityTerm - 带权重的 Pod 亲和性调度条件
- weight: number （权重，1~100）
- labelSelector: LabelSelector （通过标签选择目标 Pod 集合，继承 PodAffinityTerm）
- namespaces: string[] （目标 Pod 所在命名空间列表，继承 PodAffinityTerm）
- namespaceSelector: LabelSelector （通过命名空间标签选择目标命名空间，继承 PodAffinityTerm）
- topologyKey: string （拓扑域键，继承 PodAffinityTerm）
- matchLabelKeys: string[] （需匹配的标签键列表，继承 PodAffinityTerm）
- mismatchLabelKeys: string[] （需排除匹配的标签键列表，继承 PodAffinityTerm）

### PodAffinity - Pod 亲和性
- required: PodAffinityTerm[] （必须满足的硬性亲和要求）
- preferred: WeightedPodAffinityTerm[] （优先满足的软性亲和要求）

### PodAntiAffinity - Pod 反亲和性
- required: PodAffinityTerm[] （必须满足的硬性反亲和要求）
- preferred: WeightedPodAffinityTerm[] （优先满足的软性反亲和要求）

### Affinity - 亲和性配置
- affinity: Affinity （Pod 调度亲和性配置，控制 Pod 与节点/其他 Pod 的调度倾向）
  - nodeAffinity: NodeAffinity （节点亲和性，详见 ## NodeAffinity）
  - podAffinity: PodAffinity （Pod 亲和性，详见 ## PodAffinity）
  - podAntiAffinity: PodAntiAffinity （Pod 反亲和性，详见 ## PodAntiAffinity）

### Toleration - 污点容忍
- key: string （容忍所匹配的污点键，为空表示匹配所有污点键；此时 operator 必须为 'Exists'，表示匹配所有键与值）
- operator: TolerationOperator （键与值的关系运算符，默认 'Equal'）
  - 'Exists' （等价于通配值，可容忍某类别下的所有污点）
  - 'Equal' （值与污点值相等才匹配）
  - 'Lt' （小于，执行数值比较，需开启 TaintTolerationComparisonOperators 特性门控）
  - 'Gt' （大于，执行数值比较，需开启 TaintTolerationComparisonOperators 特性门控）
- value: string （容忍所匹配的污点值；operator 为 'Exists' 时应为空，否则为普通字符串）
- effect: TaintEffect （匹配的污点效果，为空表示匹配所有污点效果；指定时可选 'NoSchedule' / 'PreferNoSchedule' / 'NoExecute'）
  - 'NoSchedule' （不允许新 Pod 调度到该节点，除非能容忍该污点）
  - 'PreferNoSchedule' （调度器尽量不将新 Pod 调度到该节点，而非完全禁止）
  - 'NoExecute' （驱逐所有无法容忍该污点的已运行 Pod）
- tolerationSeconds: number （容忍时长（秒），仅对 effect 为 'NoExecute' 的污点生效；未设置表示永久容忍（不驱逐），0 或负数按 0 处理（立即驱逐））

### EnvFromSource - 环境变量来源
- prefix: string （附加到每个环境变量名前的前缀，可为任意可打印 ASCII 字符，但不能为 '='）
- configMapRef: ConfigMapEnvSource （引用的 ConfigMap 来源）
  - configMapName: string （引用的 ConfigMap 名称）
  - optional: boolean （该 ConfigMap 是否必须存在，为 true 时允许不存在）
- secretRef: SecretEnvSource （引用的 Secret 来源）
  - secretName: string （引用的 Secret 名称）
  - optional: boolean （该 Secret 是否必须存在，为 true 时允许不存在）

### EnvVar - 环境变量
- name: string （环境变量名称，可为任意可打印 ASCII 字符，但不能为 '='）
- value: string （变量值，支持 $(VAR_NAME) 引用展开；与 valueFrom 互斥，默认空字符串）
- valueFrom: EnvVarSource （变量值的来源，value 非空时不可使用）
  - fieldRef: ObjectFieldSelector （引用 Pod 字段，如 metadata.name、metadata.namespace、status.podIP 等）
    - apiVersion: string （字段路径对应的 schema 版本，默认 "v1"）
    - fieldPath: string （要选择的字段路径）
  - resourceFieldRef: ResourceFieldSelector （引用容器资源（cpu、memory 等）及其输出格式）
    - containerName: string （容器名称，环境变量场景下可选）
    - resource: string （要选择的资源，如 limits.cpu、requests.memory）
    - divisor: Quantity （暴露资源的输出格式除数，默认 "1"）
  - configMapKeyRef: ConfigMapKeySelector （引用 ConfigMap 中的某个键）
    - configMapName: string （引用的 ConfigMap 名称）
    - key: string （要选择的键）
    - optional: boolean （该 ConfigMap 或其键是否必须存在，为 true 时允许不存在）
  - secretKeyRef: SecretKeySelector （引用 Secret 中的某个键）
    - secretName: string （引用的 Secret 名称）
    - key: string （要选择的键）
    - optional: boolean （该 Secret 或其键是否必须存在，为 true 时允许不存在）

### ResourceRequirements - 计算资源需求
- request: Record<string, string> （容器所需的最小计算资源量；未指定时默认等于 limit（若显式设置），否则由实现定义；request 不得超过 limit）
  - cpu: Quantity （CPU 资源，单位为核心数，支持毫核，如 '500m' 表示 0.5 核）
  - memory: Quantity （内存资源，单位为字节，如 '500Gi' 表示 500GiB）
  - storage: Quantity （存储资源，单位为字节，如 '5Gi' 表示 5GiB）
  - ephemeral-storage: Quantity （本地临时存储资源，单位为字节，如 '500Gi' 表示 500GiB）
- limit: Record<string, string> （容器允许使用的最大计算资源量；超过将被限制（如 CPU 限流或内存 OOM 终止））
  - cpu: Quantity （CPU 资源上限，单位为核心数，支持毫核，如 '500m' 表示 0.5 核）
  - memory: Quantity （内存资源上限，单位为字节，如 '500Gi' 表示 500GiB）
  - storage: Quantity （存储资源上限，单位为字节，如 '5Gi' 表示 5GiB）
  - ephemeral-storage: Quantity （本地临时存储资源上限，单位为字节，如 '500Gi' 表示 500GiB）

### VolumeMount - 容器内卷挂载
- name: string （必须匹配某个 Volume 的 Name，标识要挂载的卷）
- readOnly: boolean （为 true 时以只读方式挂载，否则读写；默认 false）
- recursiveReadOnly: RecursiveReadOnlyMode （只读挂载是否递归应用；readOnly 为 false 时无意义且不可设置；未设置等价于 Disabled；设为 IfPossible/Enabled 时 mountPropagation 必须为 None）
  - 'Disabled' （禁用递归只读模式）
  - 'IfPossible' （若容器运行时支持，则启用递归只读）
  - 'Enabled' （启用递归只读，若不支持则启动 Pod 失败并报错）
- mountPath: string （容器内挂载路径，卷将挂载到该位置）
- subPath: string （卷内从哪个子路径挂载，默认空字符串表示卷根目录）
- mountPropagation: MountPropagationMode （挂载如何从宿主机传播到容器及反向；未设置时默认为 None；设为 IfPossible/Enabled 的 recursiveReadOnly 时必须为 None）
  - 'None' （容器卷不接收宿主机或其他容器的挂载，容器内挂载也不传播到宿主机或其他容器；对应 Linux "private"）
  - 'HostToContainer' （容器卷接收宿主机或其他容器的新挂载，但容器内挂载不传播出去；对应 Linux "rslave"，递归应用于卷内所有挂载）
  - 'Bidirectional' （容器卷接收宿主机或其他容器的新挂载，且自身挂载也传播到宿主机或其他容器；对应 Linux "rshared"，递归应用于卷内所有挂载）
- subPathExpr: string （与 subPath 类似，但支持用容器环境变量 $(VAR_NAME) 展开；与 subPath 互斥；默认空字符串）

### VolumeDevice - 容器内裸块设备映射
- name: string （必须匹配 Pod 中某个 persistentVolumeClaim 的名称，标识要映射的块设备卷）
- devicePath: string （块设备在容器内的映射路径，如 '/dev/block'）

### Probe - 容器健康检查探针
- exec: ExecAction （在容器内执行命令，退出码为 0 视为健康，非 0 视为不健康）
  - command: string[] （容器内执行的命令行，工作目录为容器根目录 '/'；直接 exec 而非 shell，不支持 '|' 等 shell 语法）
- httpGet: HTTPGetAction （对容器发起 HTTP GET 请求探测）
  - path: string （HTTP 服务器上访问的路径）
  - port: number | string （容器上访问的端口号或名称，名称须为 IANA_SVC_NAME，端口范围 1-65535）
  - host: string （要连接的主机名，默认 Pod IP；通常改用 httpHeaders 中的 Host 设置）
  - scheme: URIScheme （连接协议，默认 'HTTP'）
    - 'HTTP' （使用 http:// 协议）
    - 'HTTPS' （使用 https:// 协议）
  - httpHeaders: HTTPHeader[] （请求中设置的自定义请求头，HTTP 允许重复头）
    - name: string （请求头字段名，输出时会规范化，大小写变体视为同一头）
    - value: string （请求头字段值）
- tcpSocket: TCPSocketAction （对容器端口发起 TCP 连接探测）
  - port: number | string （容器上访问的端口号或名称，名称须为 IANA_SVC_NAME，端口范围 1-65535）
  - host: string （要连接的主机名，默认 Pod IP）
- grpc: GRPCAction （对 gRPC 服务发起健康检查）
  - port: number （gRPC 服务端口号，范围 1-65535）
  - service: string （放入 gRPC HealthCheckRequest 的服务名，未指定时使用 gRPC 默认行为）
- initialDelaySeconds: number （容器启动后多久（秒）开始首次探针；默认 0）
- timeoutSeconds: number （探针超时秒数，默认 1，最小值为 1）
- periodSeconds: number （探针执行周期（秒），默认 10，最小值为 1）
- successThreshold: number （失败后经多少次连续成功才视为成功，默认 1；存活和启动探针必须为 1，最小值为 1）
- failureThreshold: number （成功后经多少次连续失败才视为失败，默认 3，最小值为 1）
- terminationGracePeriodSeconds: number （探针失败后 Pod 优雅终止宽限秒数；为 nil 时沿用 Pod 的 terminationGracePeriodSeconds，否则覆盖；需启用 ProbeTerminationGracePeriod featureGate；最小值为 1）

### Lifecycle - 容器生命周期钩子
- postStart: LifecycleHandler （容器创建后立即调用；若钩子失败，容器按重启策略终止并重启；其他容器管理操作会阻塞直到钩子完成）
  - exec: ExecAction （在容器内执行命令，详见 ### Probe 中 exec 说明）
  - httpGet: HTTPGetAction （对容器发起 HTTP GET 请求，详见 ### Probe 中 httpGet 说明）
  - sleep: number （容器应休眠的时长，单位：秒）
- preStop: LifecycleHandler （容器因 API 请求或管理事件（如存活/启动探针失败、抢占、资源争用等）即将终止前立即调用；容器崩溃或退出时不调用；Pod 终止宽限倒计时在 PreStop 执行前已开始；无论钩子结果如何，容器最终会在宽限期内终止；其他管理操作阻塞直到钩子完成或宽限期到达）
  - exec: ExecAction （在容器内执行命令，详见 ### Probe 中 exec 说明）
  - httpGet: HTTPGetAction （对容器发起 HTTP GET 请求，详见 ### Probe 中 httpGet 说明）
  - sleep: number （容器应休眠的时长，单位：秒）
- stopSignal: Signal （容器停止时发送的信号，未指定时使用容器运行时默认值；仅当 Pod 的 .spec.os.name 非空时可设置；如 'SIGTERM'、'SIGKILL' 等）

### SecurityContext - 容器安全上下文
- privileged: boolean （是否以特权模式运行容器；特权容器内进程等效于宿主机 root；默认 false；windows 时不可设置）
- runAsUser: number （容器进程入口点的 UID；未指定时默认使用镜像元数据中的用户；容器级优先于 PodSecurityContext；windows 时不可设置）
- runAsGroup: number （容器进程入口点的 GID；未设置时使用运行时默认值；容器级优先于 PodSecurityContext；windows 时不可设置）
- runAsNonRoot: boolean （容器是否必须以非 root 用户运行；为 true 时 kubelet 运行时会校验镜像不以 UID 0 运行，否则启动失败；容器级优先于 PodSecurityContext）

### Container - 容器
- name: string （容器名称，Pod 内必须唯一（DNS_LABEL 格式），不可更新）
- image: string （容器镜像名称，未指定时由上层工作负载控制器默认或覆盖）
- command: string[] （容器入口命令，不在 shell 中执行；未指定时使用镜像的 ENTRYPOINT）
- args: string[] （入口命令的参数，未指定时使用镜像的 CMD）
- workingDir: string （容器工作目录，未指定时使用容器运行时默认（可能由镜像配置））
- ports: ContainerPort[] （容器暴露的端口列表，未声明不代表端口不可访问）
  - name: string （端口名称，须为 IANA_SVC_NAME 且在 Pod 内唯一，可被 Service 引用）
  - hostPort: number （映射到宿主机的端口号，0 < x < 65536，多数容器不需要此字段）
  - containerPort: number （Pod IP 上暴露的端口号，0 < x < 65536，必填）
  - protocol: Protocol （端口协议，默认 'TCP'）
    - 'TCP' （TCP 协议）
    - 'UDP' （UDP 协议）
    - 'SCTP' （SCTP 协议）
  - hostIP: string （外部端口绑定的宿主机 IP）
- envFrom: EnvFromSource[] （填充容器环境变量的来源列表，多个来源键冲突时后者优先，详见 ### EnvFromSource）
- env: EnvVar[] （容器环境变量列表，同名 Env 变量优先于 envFrom，详见 ### EnvVar）
- resources: ResourceRequirements （容器所需的计算资源）
- restartPolicy: RestartPolicy （容器级重启策略，覆盖 Pod 级重启策略；取值为 'Always' 的初始化容器表现为 sidecar 行为；枚举定义详见 ### PodSpec - Pod 规格信息 中的 RestartPolicy）
- volumeMounts: VolumeMount[] （挂载到容器文件系统的 Pod 卷）
- volumeDevices: VolumeDevice[] （容器使用的块设备列表）
- livenessProbe: Probe （存活探针，探测失败则重启容器）
- readinessProbe: Probe （就绪探针，探测失败则将容器从服务端点移除）
- startupProbe: Probe （启动探针，成功前不执行其他探针；失败则重启容器）
- lifecycle: Lifecycle （容器生命周期事件触发的动作）
- terminationMessagePath: string （容器终止消息写入文件路径，默认 /dev/termination-log，超过 4096 字节将被节点截断）
- terminationMessagePolicy: TerminationMessagePolicy （终止消息填充方式，默认 'File'）
  - 'File' （默认行为，容器退出时将 terminationMessagePath 文件内容作为终止消息）
  - 'FallbackToLogsOnError' （容器异常退出且 terminationMessagePath 无内容时，使用容器日志最近内容作为终止消息）
- imagePullPolicy: PullPolicy （镜像拉取策略，可选 'Always' / 'Never' / 'IfNotPresent'，默认随标签决定）
  - 'Always' （kubelet 总是尝试拉取最新镜像；拉取失败则容器启动失败）
  - 'Never' （kubelet 从不拉取镜像，仅使用本地镜像；镜像不存在则容器启动失败）
  - 'IfNotPresent' （kubelet 仅在本地不存在镜像时才拉取；镜像不存在且拉取失败则容器启动失败）
- securityContext: SecurityContext （容器级安全上下文，覆盖 PodSecurityContext 中同名字段）
- stdin: boolean （是否分配 stdin 缓冲区，默认 false）
- stdinOnce: boolean （stdin 被单次 attach 后是否关闭，默认 false）
- tty: boolean （是否分配 TTY，需 stdin 为 true，默认 false）

### PodSpec - Pod 规格信息
- volumes: Volume[] （Pod 内容器可挂载的存储卷列表）
- initContainers: Container[] （初始化容器列表，按序执行于主容器之前）
- containers: Container[] （主容器列表，Pod 中至少有一个容器）
- restartPolicy: RestartPolicy （所有容器的重启策略，默认 Always）
  - 'Always' （容器终止时总是重启）
  - 'OnFailure' （仅在容器非正常终止时重启）
  - 'Never' （容器终止后从不重启）
  - 注：容器级 restartPolicy 与 Pod 级 RestartPolicy 枚举值相同，二者统一使用本定义，容器级优先于 Pod 级生效
- terminationGracePeriodSeconds: number （优雅终止宽限秒数，默认 30）
- activeDeadlineSeconds: number （Pod 在节点上存活的最长秒数，超时则标记失败）
- dnsPolicy: DNSPolicy （DNS 策略，默认 ClusterFirst）
  - 'ClusterFirstWithHostNet' （优先使用集群 DNS，不可用时回退到 kubelet 默认 DNS 设置）
  - 'ClusterFirst' （优先使用集群 DNS，hostNetwork 为 true 时除外，不可用时回退到默认设置）
  - 'Default' （使用 kubelet 确定的默认 DNS 设置）
  - 'None' （不使用任何 DNS 设置，由 DNSConfig 自行定义 nameservers、search paths 等参数）
- nodeSelector: Record<string, string> （节点标签选择器，须匹配节点标签才可调度）
- serviceAccountName: string （运行该 Pod 所使用的 ServiceAccount 名称）
- nodeName: string （Pod 被调度到的节点名称，为空时由调度器决定）
- hostNetwork: boolean （是否使用宿主机网络命名空间，默认 false）
- hostPID: boolean （是否使用宿主机 PID 命名空间，默认 false）
- securityContext: PodSecurityContext （Pod 级安全上下文与容器通用设置）
- imagePullSecrets: string[] （拉取镜像所用的 Secret 名称列表）
- hostname: string （Pod 主机名）
- subdomain: string （Pod 子域名）
- affinity: Affinity （Pod 调度亲和性规则）
- tolerations: Toleration[] （Pod 的污点容忍列表）
- priorityClassName: string （优先级类名，如 system-node-critical / system-cluster-critical）
- priority: number （优先级数值，值越大优先级越高）

## Workload 原始类型定义 （`/src/types/kubernetes/workload/types.ts`）

### HistoryRevision - 历史版本
- revision: number （修订版本号）
- changeCause: string （变更原因）
- createAt: string （创建时间）
- active: boolean （是否为当前活跃版本）

### LabelExpression - 标签表达式
- key: string （标签键）
- operator: LabelExpressionOperator （匹配运算符，单独使用 `export type LabelExpressionOperator` 定义）
  - 'In' （标签值在 values 列表中）
  - 'NotIn' （标签值不在 values 列表中）
  - 'Exists' （标签键存在，忽略 values）
  - 'DoesNotExist' （标签键不存在，忽略 values）
- values: string[] （匹配值列表，operator 为 Exists / DoesNotExist 时不生效）

### LabelSelector - 标签选择器
- matchLabels: Record<string, string> （基于等值匹配的标签，AND 关系）
- matchExpressions: LabelExpression[] （基于表达式的匹配条件，与 matchLabels 为 AND 关系）

### DeploymentUpdateStrategy - Deployment 更新策略
- type: DeploymentUpdateStrategyType （策略类型，来自 `/src/config/kubernetes/workload/deployment.ts`）
- rollingUpdate: Record<string, string> （滚动更新属性）
  - maxUnavailable?: string （最大不可用副本数）
  - maxSurge?: string （最大超出副本数）

### DeploymentSpec - Deployment 规格信息
- replicas: number （期望副本数，默认为 1）
- selector: LabelSelector （Pod 标签选择器，须匹配 Pod 模板的标签）
- strategy: DeploymentUpdateStrategy （用于替换旧 Pod 的更新策略）
- minReadySeconds: number （新 Pod 就绪后被视为可用的最小秒数，默认为 0）
- revisionHistoryLimit: number （保留的旧 ReplicaSet 数量，用于回滚，默认为 10）
- paused: boolean （是否暂停部署）
- progressDeadlineSeconds: number （部署进度超时时间，超过则视为失败，默认为 600）
- template: PodTemplateSpec （将要创建的 Pod 模板，其标签须匹配上方 selector 的标签选择器）
  - metadata: Metadata （Pod 模板的元数据，包括 labels 与 annotations；其 labels 必须与 selector 匹配，否则会被控制器拒绝）
  - spec: PodSpec （Pod 的规格定义，描述容器的实际运行期望）

### DeploymentCondition - Deployment 状态条件
- type: DeploymentConditionType （条件类型，取值如下）
  - 'Available' （Deployment 可用，即至少 minReadySeconds 内维持了所需的最小可用副本数）
  - 'Progressing' （Deployment 正在推进；新建或接管 ReplicaSet、新 Pod 扩容或旧 Pod 缩容均视为推进；暂停的 Deployment 或未设置 progressDeadlineSeconds 时不估算进度）
  - 'ReplicaFailure' （Deployment 的某个 Pod 创建或删除失败时添加）
- status: string （条件状态，取值为 'True' / 'False' / 'Unknown' 之一）
- lastUpdateTime: string （该条件最后一次更新的时间）
- lastTransitionTime: string （条件状态上一次发生切换的时间）
- reason: string （条件最后一次切换的原因）
- message: string （描述切换细节的可读消息）

### DeploymentStatusObj - Deployment 状态信息
- observedGeneration: number （Deployment 控制器已观测到的 generation 代次）
- replicas: number （匹配选择器且未终止的 Pod 总数）
- updatedReplicas: number （匹配选择器、且已应用期望模板 spec 的 Pod 总数）
- readyReplicas: number （匹配选择器、且处于 Ready 状态的 Pod 总数）
- availableReplicas: number （匹配选择器、且至少就绪 minReadySeconds 的可用 Pod 总数）
- unavailableReplicas: number （不可用 Pod 总数，即尚未达到 100% 可用容量所需的 Pod；包括运行中但尚未就绪、或尚未创建的 Pod）
- terminatingReplicas: number （匹配选择器且正在终止的 Pod 总数；此类 Pod 具有非空的 deletionTimestamp 且尚未进入 Failed/Succeeded 阶段；需启用 DeploymentReplicaSetTerminatingReplicas featureGate，默认开启）
- conditions: DeploymentCondition[] （Deployment 当前状态的最新观测条件列表）
- collisionCount: number （Deployment 的哈希冲突计数；控制器在为新 ReplicaSet 生成名称时用作冲突避免机制）

### StatefulSetVolumeClaimTemplate - 持久卷声明模板
- name: string （模板名称，作为 Pod 内 volumeMount 的引用标识）
- storageClass?: string （存储类名称，为空时使用集群默认 StorageClass）
- accessModes: string[] （PVC 访问模式，如 ReadWriteOnce / ReadWriteMany）
- capacity: Quantity （存储容量，如 10Gi）
- mode?: number （挂载目录的文件权限位，如 0644）

### StatefulSetUpdateStrategy - StatefulSet 更新策略
- type: StatefulSetUpdateStrategyType （策略类型，来自 `/src/config/kubernetes/workload/statefulset.ts`）
- rollingUpdate: Record<string, string> （滚动更新属性）
  - partition?: string （滚动更新分区序号，序号 >= partition 的 Pod 才被更新，常用于金丝雀发布）

### StatefulSetSpec - StatefulSet 规格信息
- replicas: number （期望副本数，默认为 1）
- serviceName: string （关联的无头 Service 名称，StatefulSet 为每个 Pod 生成稳定的网络标识 `<pod>-<sts>.<service>.<ns>.svc`）
- selector: LabelSelector （Pod 标签选择器，须匹配 Pod 模板的标签）
- podManagementPolicy: PodManagementPolicyType （Pod 管理策略，来自 `/src/config/kubernetes/workload/statefulset.ts`）
- updateStrategy: StatefulSetUpdateStrategy （用于替换旧 Pod 的更新策略）
- minReadySeconds: number （新 Pod 就绪后被视为可用的最小秒数，默认为 0）
- revisionHistoryLimit: number （保留的旧 ControllerRevision 数量，用于回滚，默认为 10）
- template: PodTemplateSpec （将要创建的 Pod 模板，其标签须匹配上方 selector 的标签选择器）
  - metadata: Metadata （Pod 模板的元数据，包括 labels 与 annotations；其 labels 必须与 selector 匹配，否则会被控制器拒绝）
  - spec: PodSpec （Pod 的规格定义，描述容器的实际运行期望）
- volumeClaimTemplates: StatefulSetVolumeClaimTemplate[] （持久卷声明模板，StatefulSet 为每个 Pod 按序创建独立的 PVC 实现稳定持久存储）

### StatefulSetCondition - StatefulSet 状态条件
- type: StatefulSetConditionType （条件类型，来自 `/src/config/kubernetes/workload/statefulset.ts`，取值如下）
  - 'Available' （StatefulSet 可用，即至少维持了 minReadySeconds 的最小就绪副本数）
  - 'Progressing' （StatefulSet 正在推进；Pod 扩容、缩容或更新均视为推进）
  - 'ReplicaFailure' （StatefulSet 的某个 Pod 创建或删除失败时添加）
- status: string （条件状态，取值为 'True' / 'False' / 'Unknown' 之一）
- lastUpdateTime: string （该条件最后一次更新的时间）
- lastTransitionTime: string （条件状态上一次发生切换的时间）
- reason: string （条件最后一次切换的原因）
- message: string （描述切换细节的可读消息）

### StatefulSetStatusObj - StatefulSet 状态信息
- observedGeneration: number （StatefulSet 控制器已观测到的 generation 代次）
- replicas: number （匹配选择器且未终止的 Pod 总数）
- readyReplicas: number （匹配选择器、且处于 Ready 状态的 Pod 总数）
- currentReplicas: number （当前版本（currentRevision）下已就绪且匹配模板的 Pod 总数）
- updatedReplicas: number （匹配选择器、且已应用期望模板 spec 的 Pod 总数）
- currentRevision: string （当前正在使用的 ControllerRevision 名称）
- updateRevision: string （更新目标 ControllerRevision 名称）
- collisionCount: number （StatefulSet 的哈希冲突计数；控制器在为新 ControllerRevision 生成名称时用作冲突避免机制）
- conditions: StatefulSetCondition[] （StatefulSet 当前状态的最新观测条件列表）

### DaemonSetUpdateStrategy - DaemonSet 更新策略
- type: DaemonSetUpdateStrategyType （策略类型，来自 `/src/config/kubernetes/workload/daemonset.ts`）
- rollingUpdate: Record<string, string> （滚动更新属性）
  - maxUnavailable?: string （滚动更新期间允许的最大不可用节点 Pod 数或比例，默认 1）
  - maxSurge?: string （滚动更新期间允许超出期望数的最大 Pod 数或比例，需 Kubernetes 1.21+）

### DaemonSetSpec - DaemonSet 规格信息
- selector: LabelSelector （Pod 标签选择器，须匹配 Pod 模板的标签；DaemonSet 不支持独立 selector，其值为只读派生）
- minReadySeconds: number （新 Pod 就绪后被视为可用的最小秒数，默认为 0）
- updateStrategy: DaemonSetUpdateStrategy （用于替换旧 Pod 的更新策略）
- template: PodTemplateSpec （将要创建的 Pod 模板，其标签须匹配上方 selector 的标签选择器）
  - metadata: Metadata （Pod 模板的元数据，包括 labels 与 annotations；其 labels 必须与 selector 匹配，否则会被控制器拒绝）
  - spec: PodSpec （Pod 的规格定义，描述容器的实际运行期望）

### DaemonSetCondition - DaemonSet 状态条件
- type: DaemonSetConditionType （条件类型，来自 `/src/config/kubernetes/workload/daemonset.ts`，取值如下）
  - 'Available' （DaemonSet 可用，即至少 minReadySeconds 内维持了所需的最小可用 Pod 数）
  - 'Progressing' （DaemonSet 正在推进；Pod 扩容、缩容或更新均视为推进）
  - 'ReplicaFailure' （DaemonSet 的某个 Pod 创建或删除失败时添加）
  - 'Misconfigured' （DaemonSet 配置错误，如节点亲和性无法匹配任何节点）
- status: string （条件状态，取值为 'True' / 'False' / 'Unknown' 之一）
- lastUpdateTime: string （该条件最后一次更新的时间）
- lastTransitionTime: string （条件状态上一次发生切换的时间）
- reason: string （条件最后一次切换的原因）
- message: string （描述切换细节的可读消息）

### DaemonSetStatusObj - DaemonSet 状态信息
- observedGeneration: number （DaemonSet 控制器已观测到的 generation 代次）
- desiredNumberScheduled: number （应当在节点上调度的目标 Pod 总数）
- currentNumberScheduled: number （当前已调度（含运行中）的 Pod 总数）
- numberReady: number （处于 Ready 状态的 Pod 总数）
- numberAvailable: number （至少就绪 minReadySeconds 的可用 Pod 总数）
- numberUnavailable: number （不可用 Pod 总数）
- updatedNumberScheduled: number （已应用期望模板 spec 的 Pod 总数）
- collisionCount: number （DaemonSet 的哈希冲突计数；控制器在为新 ControllerRevision 生成名称时用作冲突避免机制）
- conditions: DaemonSetCondition[] （DaemonSet 当前状态的最新观测条件列表）

### JobSpec - Job 规格信息
- parallelism: number （并行运行的最大 Pod 数量，默认为 1；Job 运行时可调整）
- completions: number （需要成功完成的 Pod 数量，默认为 1）
- backoffLimit: number （失败重试次数上限，超过后 Job 标记为 Failed，默认为 6）
- activeDeadlineSeconds: number （Job 在节点上可存活的最长秒数，超时则标记失败并终止所有 Pod）
- ttlSecondsAfterFinished: number （Job 完成后保留的秒数，超时由控制器清理；为空则永久保留；需启用 TTLAfterFinished featureGate）
- suspend: boolean （是否暂停 Job；暂停时控制器不再创建新 Pod，已存在 Pod 不强制删除）
- template: PodTemplateSpec （将要创建的 Pod 模板；其标签作为 Job 的自动选择器，不可与已有 Job 冲突）
  - metadata: Metadata （Pod 模板的元数据，包括 labels 与 annotations）
  - spec: PodSpec （Pod 的规格定义，描述容器的实际运行期望）

### JobCondition - Job 状态条件
- type: JobConditionType （条件类型，来自 `/src/config/kubernetes/workload/job.ts`，取值如下）
  - 'Complete' （Job 已成功完成，即成功 Pod 数达到 completions）
  - 'Failed' （Job 已失败，如重试次数超过 backoffLimit）
  - 'Suspended' （Job 已被暂停）
  - 'FailureTarget' （Job 标记为失败，因用户设置或不可重试错误）
  - 'SuccessCriteriaMet' （Job 已满足成功标准，等价于 Complete）
- status: string （条件状态，取值为 'True' / 'False' / 'Unknown' 之一）
- lastUpdateTime: string （该条件最后一次更新的时间）
- lastTransitionTime: string （条件状态上一次发生切换的时间）
- reason: string （条件最后一次切换的原因）
- message: string （描述切换细节的可读消息）

### JobStatusObj - Job 状态信息
- active: number （当前处于运行状态（非成功/失败）的 Pod 总数）
- succeeded: number （已成功完成的 Pod 总数）
- failed: number （已失败终止的 Pod 总数）
- startTime: string （Job 首次被控制器接管的开始时间）
- completionTime: string （Job 完成（成功或失败）的时间）
- conditions: JobCondition[] （Job 当前状态的最新观测条件列表）

### JobTemplateSpec - Job 模板
- metadata: ObjectMeta （Job 模板的元数据，包括 labels 与 annotations）
- spec: JobSpec （Job 的规格定义，详见 ### JobSpec）

### CronJobSpec - CronJob 规格信息
- schedule: string （Cron 调度表达式，如 '*/5 * * * *' 表示每 5 分钟执行一次）
- concurrencyPolicy: ConcurrencyPolicy （并发策略，来自 `/src/config/kubernetes/workload/cronjob.ts`，取值如下）
  - 'Allow' （允许新 Job 与旧 Job 并发运行）
  - 'Forbid' （若上一轮 Job 未结束则跳过本轮）
  - 'Replace' （若上一轮 Job 未结束则取消旧 Job，启动新 Job）
- startingDeadlineSeconds?: number （调度错过后的最晚启动宽限秒数；超过则不再补执行并标记 MissSchedule）
- suspend: boolean （是否暂停 CronJob；暂停后不再创建新 Job，已运行 Job 不受影响）
- successfulJobsHistoryLimit: number （保留的成功 Job 历史数量上限，默认为 3）
- failedJobsHistoryLimit: number （保留的失败 Job 历史数量上限，默认为 1）
- jobTemplate: JobTemplateSpec （每次触发所创建的 Job 模板）

### CronJobCondition - CronJob 状态条件
- type: CronJobConditionType （条件类型，来自 `/src/config/kubernetes/workload/cronjob.ts`，取值如下）
  - 'Complete' （CronJob 最近一轮 Job 已成功完成）
  - 'Failed' （CronJob 最近一轮 Job 失败）
  - 'Suspended' （CronJob 已被暂停）
- status: string （条件状态，取值为 'True' / 'False' / 'Unknown' 之一）
- lastUpdateTime: string （该条件最后一次更新的时间）
- lastTransitionTime: string （条件状态上一次发生切换的时间）
- reason: string （条件最后一次切换的原因）
- message: string （描述切换细节的可读消息）

### CronJobStatusObj - CronJob 状态信息
- active: number （当前正在运行的 Job 总数）
- lastScheduleTime: string （最近一次成功触发 Job 的时间）
- lastSuccessfulTime: string （最近一次成功完成 Job 的时间）
- conditions: CronJobCondition[] （CronJob 当前状态的最新观测条件列表）

# Deployment 功能

## 查看 Deployment 列表
- 页面路由
  - Name: `kubernetes:workload:deployment`
  - Path: `/kubernetes/clusters/:clusterUid/deployments`
  - Component: `/src/view/kubernetes/workload/deployment/index.vue`
  - Permission: `kubernetes:workload:deployment:view`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/deployments`
  - Function: `PageVo<DeploymentListVo> getDeploymentList(clusterUid: string, params: Partial<DeploymentQueryForm>)`
    - clusterUid: string （集群 UID）
    - `DeploymentQueryForm`（Deployment 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Deployment 名称）
      - namespace: string （命名空间名称）
      - status: DeploymentStatus （状态，来自 `/src/config/kubernetes/workload/deployment.ts` 包）
    - `DeploymentListVo`（Deployment 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （Deployment 名称）
      - description?: string （Deployment 描述）
      - status: DeploymentStatus （状态，来自 `/src/config/kubernetes/workload/deployment.ts` 包）
      - statusMsg?: string （状态信息）
      - replicas: number （期望副本数）
      - readyReplicas: number （就绪副本数）
      - updateStrategyType: DeploymentUpdateStrategyType （更新策略）

## 查看 Deployment 详情
- 页面路由
  - Name: `kubernetes:workload:deployment:detail`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name`
  - Component: `/src/view/kubernetes/workload/deployment/detail/index.vue`
  - Permission: `kubernetes:workload:deployment:view`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name`
  - Function: `DeploymentDetailVo getDeploymentDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentDetailVo`（Deployment 详情响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - description?: string （Deployment 描述）
      - status: DeploymentStatus （状态，来自 `/src/config/kubernetes/workload/deployment.ts` 包）
      - statusMsg?: string （状态信息）
      - metadata: ObjectMeta （Deployment 的资源元数据，详见 ### ObjectMeta）
      - spec: DeploymentSpec （Deployment 的规格定义，详见 ### DeploymentSpec）
      - statusObj: DeploymentStatusObj （Deployment 的观测状态，详见 ### DeploymentStatusObj）

## 查看 Deployment YAML
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/yaml`
  - Function: `DeploymentYamlVo getDeploymentYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentYamlVo`: （Deployment YAML 响应对象）
      - yaml: string（Deployment YAML 文本）

## 查看 Deployment 关联 Pod 列表
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/pods`
  - Function: `PageVo<DeploymentPodListVo> getDeploymentPodList(clusterUid: string, namespace: string, name: string, params: Partial<DeploymentPodQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentPodQueryForm`（Deployment 关联 Pod 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Pod 名称）
      - status: PodStatus （Pod 状态）
    - `DeploymentPodListVo` （Deployment 关联 Pod 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
      - name: string （Pod 名称）
      - ip: string （Pod IP）
      - status: PodStatus （Pod 状态）
      - statusMsg: string （Pod 状态信息）
      - restarts: number （Pod 重启次数）
      - nodeIp: string （Pod 所属节点 IP）
      - nodeName: string （Pod 所属节点名称）
      - readyContainerCount: number （Pod 就绪容器数量）
      - containerCount: number （Pod 容器总数）

## 查看 Deployment 历史版本列表
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/history`
  - Function: `PageVo<DeploymentHistoryRevisionListVo> getDeploymentHistoryRevisionList(clusterUid: string, namespace: string, name: string, params: Partial<DeploymentHistoryRevisionQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentHistoryRevisionQueryForm`（Deployment 历史版本查询条件请求对象） 继承 `PageForm`
      - revision: number （版本名称）
      - changeCause: string （变更原因）
    - `DeploymentHistoryRevisionListVo` （Deployment 历史版本列表项响应对象） 继承 `HistoryRevision`

## 查看 Deployment 关联网络资源
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/network`
  - Function: `DeploymentNetworkVo getDeploymentNetwork(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentNetworkVo` （Deployment 关联网络资源响应对象）
      - services: DeploymentServiceListVo[] （关联的 Service 列表）
      - ingresses: DeploymentIngressListVo[] （关联的 Ingress 列表）
      - `DeploymentServiceListVo` （Deployment 关联 Service 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
        - name: string （Service 名称）
        - description: string （Service 描述）
        - type: ServiceType （Service 类型，来自 `/src/config/kubernetes/network/service.ts`）
        - clusterIp: string （集群内部 IP，ClusterIP / NodePort / LoadBalancer 类型自动分配）
        - externalName: string （外部域名，仅 ExternalName 类型生效）
        - headless: boolean （是否为 Headless Service，clusterIp 为 None）
      - `DeploymentIngressListVo` （Deployment 关联 Ingress 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
        - name: string （Ingress 名称）
        - description: string （Ingress 描述）
        - ingressClassName?: string （Ingress 类名，对应 IngressClassName 资源名称）

## 查看 Deployment 事件列表
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/events`
  - Function: `PageVo<EventListVo> getDeploymentEventList(clusterUid: string, namespace: string, name: string, params: Partial<EventQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `EventQueryForm`（事件查询条件请求对象）
    - `EventListVo`（事件列表项响应对象）

## 查看 Deployment 监控数据
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/monitor`
  - Function: `DeploymentMonitorVo getDeploymentMonitor(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentMonitorVo` （Deployment 监控响应对象）
      - {TODO: DeploymentMonitorVo 对象属性}

## 创建
- 页面路由
  - Name: `kubernetes:workload:deployment:create`
  - Path: `/kubernetes/clusters/:clusterUid/deployments/create`
  - Component: `/src/view/kubernetes/workload/deployment/create/index.vue`
  - Permission: `kubernetes:workload:deployment:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/deployments`
  - Function: `void createDeployment(clusterUid: string, data: Partial<DeploymentCreateForm>)`
    - clusterUid: string （集群 UID）
    - `DeploymentCreateForm` （Deployment 创建请求对象）
      - description?: string （Deployment 描述）
      - metadata: ObjectMeta （Deployment 的资源元数据，详见 ### ObjectMeta）
      - spec: DeploymentSpec （Deployment 的规格定义，详见 ### DeploymentSpec）

## YAML 创建
- 页面路由
  - Name: `kubernetes:workload:deployment:create:yaml`
  - Path: `/kubernetes/clusters/:clusterUid/deployments/create/yaml`
  - Component: `/src/view/kubernetes/workload/deployment/create/yaml.vue`
  - Permission: `kubernetes:workload:deployment:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/deployments/yaml`
  - Function: `void createDeploymentYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （Deployment YAML 字符串）

## 更新
- 页面路由
  - Name: `kubernetes:workload:deployment:edit`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/edit`
  - Component: `/src/view/kubernetes/workload/deployment/edit/index.vue`
  - Permission: `kubernetes:workload:deployment:edit`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name`
  - Function: `void updateDeployment(clusterUid: string, namespace: string, name: string, data: Partial<DeploymentUpdateForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentUpdateForm` （Deployment 更新请求对象）
      - description?: string （Deployment 描述）
      - metadata: ObjectMeta （Deployment 的资源元数据，详见 ### ObjectMeta）
      - spec: DeploymentSpec （Deployment 的规格定义，详见 ### DeploymentSpec）
    

## YAML 更新
- 页面路由
  - Name: `kubernetes:workload:deployment:edit:yaml`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/edit/yaml`
  - Component: `/src/view/kubernetes/workload/deployment/edit/yaml.vue`
  - Permission: `kubernetes:workload:deployment:edit`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/yaml`
  - Function: `void updateDeploymentYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - yaml: string （Deployment YAML 字符串）

## 管理标签
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/labels`
  - Function: `void manageDeploymentLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `MetadataLabelForm`（管理标签请求对象） 来自 `/src/types/kubernetes/common.ts`
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）

## 管理注解
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/annotations`
  - Function: `void manageDeploymentAnnotation(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `MetadataAnnotationForm`（管理注解请求对象） 来自 `/src/types/kubernetes/common.ts`
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）

## 删除
- 页面路由
  - 无
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name`
  - Function: `void deleteDeployment(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
  - Permission: `kubernetes:workload:deployment:delete`

## 批量删除
- 页面路由
  - 无
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/deployments/batch`
  - Function: `void deleteDeployments(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （Deployment UID 列表）
  - Permission: `kubernetes:workload:deployment:delete`

## 导入
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/deployments/import`
  - Function: `void importDeployment(clusterUid: string, formData: FormData, onProgress?: (progressEvent: AxiosProgressEvent) => void)`
    - clusterUid: string （集群 UID）
    - formData: FormData （上传的文件）
    - onProgress?: (progressEvent: AxiosProgressEvent) => void （上传进度回调）
  - Permission: `kubernetes:workload:deployment:import`

## 导出
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/deployments/export`
  - Function: `void exportDeployment(clusterUid: string, params: Partial<DeploymentQueryForm>)`
    - clusterUid: string （集群 UID）
    - `DeploymentQueryForm` 共享【查看 Deployment 详情】章节的实体定义
  - Permission: `kubernetes:workload:deployment:export`

## 扩缩容
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/scale`
  - Function: `void scaleDeployment(clusterUid: string, namespace: string, name: string, data: DeploymentScaleForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentScaleForm` （Deployment 扩缩容请求对象）
      - replicas: number （期望副本数）
  - Permission: `kubernetes:workload:deployment:edit`

## 重启
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/restart`
  - Function: `void restartDeployment(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
  - Permission: `kubernetes:workload:deployment:edit`

## 回滚
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/rollback`
  - Function: `void rollbackDeployment(clusterUid: string, namespace: string, name: string, data: DeploymentRollbackForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
    - `DeploymentRollbackForm` （Deployment 回滚请求对象）
      - revision: number （目标历史版本号）
  - Permission: `kubernetes:workload:deployment:edit`

## 暂停更新
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/pause`
  - Function: `void pauseDeployment(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
  - Permission: `kubernetes:workload:deployment:edit`

## 恢复更新
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/deployments/:name/resume`
  - Function: `void resumeDeployment(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Deployment 名称）
  - Permission: `kubernetes:workload:deployment:edit`

# StatefulSet 功能

## 查看 StatefulSet 列表
- 页面路由
  - Name: `kubernetes:workload:statefulset`
  - Path: `/kubernetes/clusters/:clusterUid/statefulsets`
  - Component: `/src/view/kubernetes/workload/statefulset/index.vue`
  - Permission: `kubernetes:workload:statefulset:view`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/statefulsets`
  - Function: `PageVo<StatefulSetListVo> getStatefulSetList(clusterUid: string, params: Partial<StatefulSetQueryForm>)`
    - clusterUid: string （集群 UID）
    - `StatefulSetQueryForm`（StatefulSet 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （StatefulSet 名称）
      - namespace: string （命名空间名称）
      - status: StatefulSetStatus （状态，来自 `/src/config/kubernetes/workload/statefulset.ts` 包）
    - `StatefulSetListVo`（StatefulSet 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （StatefulSet 名称）
      - description?: string （StatefulSet 描述）
      - status: StatefulSetStatus （状态，来自 `/src/config/kubernetes/workload/statefulset.ts` 包）
      - statusMsg?: string （状态信息）
      - replicas: number （期望副本数）
      - readyReplicas: number （就绪副本数）
      - currentReplicas: number （当前版本就绪副本数）
      - updateStrategyType: StatefulSetUpdateStrategyType （更新策略）

## 查看 StatefulSet 详情
- 页面路由
  - Name: `kubernetes:workload:statefulset:detail`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name`
  - Component: `/src/view/kubernetes/workload/statefulset/detail/index.vue`
  - Permission: `kubernetes:workload:statefulset:view`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name`
  - Function: `StatefulSetDetailVo getStatefulSetDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetDetailVo`（StatefulSet 详情响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - description?: string （StatefulSet 描述）
      - status: StatefulSetStatus （状态，来自 `/src/config/kubernetes/workload/statefulset.ts` 包）
      - statusMsg?: string （状态信息）
      - metadata: ObjectMeta （StatefulSet 的资源元数据，详见 ### ObjectMeta）
      - spec: StatefulSetSpec （StatefulSet 的规格定义，详见 ### StatefulSetSpec）
      - statusObj: StatefulSetStatusObj （StatefulSet 的观测状态，详见 ### StatefulSetStatusObj）

## 查看 StatefulSet YAML
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/yaml`
  - Function: `StatefulSetYamlVo getStatefulSetYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetYamlVo`: （StatefulSet YAML 响应对象）
      - yaml: string（StatefulSet YAML 文本）

## 查看 StatefulSet 关联 Pod 列表
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/pods`
  - Function: `PageVo<StatefulSetPodListVo> getStatefulSetPodList(clusterUid: string, namespace: string, name: string, params: Partial<StatefulSetPodQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetPodQueryForm`（StatefulSet 关联 Pod 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Pod 名称）
      - status: PodStatus （Pod 状态）
    - `StatefulSetPodListVo` （StatefulSet 关联 Pod 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
      - name: string （Pod 名称）
      - ip: string （Pod IP）
      - status: PodStatus （Pod 状态）
      - statusMsg: string （Pod 状态信息）
      - restarts: number （Pod 重启次数）
      - nodeIp: string （Pod 所属节点 IP）
      - nodeName: string （Pod 所属节点名称）
      - readyContainerCount: number （Pod 就绪容器数量）
      - containerCount: number （Pod 容器总数）

## 查看 StatefulSet 历史版本列表
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/history`
  - Function: `PageVo<StatefulSetHistoryRevisionListVo> getStatefulSetHistoryRevisionList(clusterUid: string, namespace: string, name: string, params: Partial<StatefulSetHistoryRevisionQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetHistoryRevisionQueryForm`（StatefulSet 历史版本查询条件请求对象） 继承 `PageForm`
      - revision: number （版本名称）
      - changeCause: string （变更原因）
    - `StatefulSetHistoryRevisionListVo` （StatefulSet 历史版本列表项响应对象）继承 `HistoryRevision`

## 查看 StatefulSet 关联网络资源
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/network`
  - Function: `StatefulSetNetworkVo getStatefulSetNetwork(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetNetworkVo` （StatefulSet 关联网络资源响应对象）
      - services: StatefulSetServiceListVo[] （关联的 Service 列表）
      - ingresses: StatefulSetIngressListVo[] （关联的 Ingress 列表）
      - `StatefulSetServiceListVo` （StatefulSet 关联 Service 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
        - name: string （Service 名称）
        - description: string （Service 描述）
        - type: ServiceType （Service 类型，来自 `/src/config/kubernetes/network/service.ts`）
        - clusterIp: string （集群内部 IP，ClusterIP / NodePort / LoadBalancer 类型自动分配）
        - externalName: string （外部域名，仅 ExternalName 类型生效）
        - headless: boolean （是否为 Headless Service，clusterIp 为 None；StatefulSet 通常依赖无头 Service 提供稳定网络标识）
      - `StatefulSetIngressListVo` （StatefulSet 关联 Ingress 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
        - name: string （Ingress 名称）
        - description: string （Ingress 描述）
        - ingressClassName?: string （Ingress 类名，对应 IngressClassName 资源名称）

## 查看 StatefulSet 事件列表
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/events`
  - Function: `PageVo<EventListVo> getStatefulSetEventList(clusterUid: string, namespace: string, name: string, params: Partial<EventQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `EventQueryForm`（事件查询条件请求对象）
    - `EventListVo`（事件列表项响应对象）

## 查看 StatefulSet 监控数据
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/monitor`
  - Function: `StatefulSetMonitorVo getStatefulSetMonitor(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetMonitorVo` （StatefulSet 监控响应对象）
      - {TODO: StatefulSetMonitorVo 对象属性}

## 创建
- 页面路由
  - Name: `kubernetes:workload:statefulset:create`
  - Path: `/kubernetes/clusters/:clusterUid/statefulsets/create`
  - Component: `/src/view/kubernetes/workload/statefulset/create/index.vue`
  - Permission: `kubernetes:workload:statefulset:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/statefulsets`
  - Function: `void createStatefulSet(clusterUid: string, data: Partial<StatefulSetCreateForm>)`
    - clusterUid: string （集群 UID）
    - `StatefulSetCreateForm` （StatefulSet 创建请求对象）
      - description?: string （StatefulSet 描述）
      - metadata: ObjectMeta （StatefulSet 的资源元数据，详见 ### ObjectMeta）
      - spec: StatefulSetSpec （StatefulSet 的规格定义，详见 ### StatefulSetSpec）

## YAML 创建
- 页面路由
  - Name: `kubernetes:workload:statefulset:create:yaml`
  - Path: `/kubernetes/clusters/:clusterUid/statefulsets/create/yaml`
  - Component: `/src/view/kubernetes/workload/statefulset/create/yaml.vue`
  - Permission: `kubernetes:workload:statefulset:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/statefulsets/yaml`
  - Function: `void createStatefulSetYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （StatefulSet YAML 字符串）

## 更新
- 页面路由
  - Name: `kubernetes:workload:statefulset:edit`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/edit`
  - Component: `/src/view/kubernetes/workload/statefulset/edit/index.vue`
  - Permission: `kubernetes:workload:statefulset:edit`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name`
  - Function: `void updateStatefulSet(clusterUid: string, namespace: string, name: string, data: Partial<StatefulSetUpdateForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetUpdateForm` （StatefulSet 更新请求对象）
      - description?: string （StatefulSet 描述）
      - metadata: ObjectMeta （StatefulSet 的资源元数据，详见 ### ObjectMeta）
      - spec: StatefulSetSpec （StatefulSet 的规格定义，详见 ### StatefulSetSpec）

## YAML 更新
- 页面路由
  - Name: `kubernetes:workload:statefulset:edit:yaml`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/edit/yaml`
  - Component: `/src/view/kubernetes/workload/statefulset/edit/yaml.vue`
  - Permission: `kubernetes:workload:statefulset:edit`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/yaml`
  - Function: `void updateStatefulSetYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - yaml: string （StatefulSet YAML 字符串）

## 管理标签
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/labels`
  - Function: `void manageStatefulSetLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `MetadataLabelForm`（管理标签请求对象） 来自 `/src/types/kubernetes/common.ts`
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）

## 管理注解
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/annotations`
  - Function: `void manageStatefulSetAnnotation(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `MetadataAnnotationForm`（管理注解请求对象） 来自 `/src/types/kubernetes/common.ts`
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）

## 删除
- 页面路由
  - 无
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name`
  - Function: `void deleteStatefulSet(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
  - Permission: `kubernetes:workload:statefulset:delete`

## 批量删除
- 页面路由
  - 无
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/statefulsets/batch`
  - Function: `void deleteStatefulSets(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （StatefulSet UID 列表）
  - Permission: `kubernetes:workload:statefulset:delete`

## 导入
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/statefulsets/import`
  - Function: `void importStatefulSet(clusterUid: string, formData: FormData, onProgress?: (progressEvent: AxiosProgressEvent) => void)`
    - clusterUid: string （集群 UID）
    - formData: FormData （上传的文件）
    - onProgress?: (progressEvent: AxiosProgressEvent) => void （上传进度回调）
  - Permission: `kubernetes:workload:statefulset:import`

## 导出
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/statefulsets/export`
  - Function: `void exportStatefulSet(clusterUid: string, params: Partial<StatefulSetQueryForm>)`
    - clusterUid: string （集群 UID）
    - `StatefulSetQueryForm` 共享【查看 StatefulSet 详情】章节的实体定义
  - Permission: `kubernetes:workload:statefulset:export`

## 扩缩容
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/scale`
  - Function: `void scaleStatefulSet(clusterUid: string, namespace: string, name: string, data: StatefulSetScaleForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetScaleForm` （StatefulSet 扩缩容请求对象）
      - replicas: number （期望副本数）
  - Permission: `kubernetes:workload:statefulset:edit`

## 滚动更新分区
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/partition`
  - Function: `void partitionStatefulSet(clusterUid: string, namespace: string, name: string, data: StatefulSetPartitionForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetPartitionForm` （StatefulSet 滚动更新分区请求对象）
      - partition: number （分区序号，序号大于等于该值的 Pod 才会被滚动更新）
  - Permission: `kubernetes:workload:statefulset:edit`

## 重启
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/restart`
  - Function: `void restartStatefulSet(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
  - Permission: `kubernetes:workload:statefulset:edit`

## 回滚
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/rollback`
  - Function: `void rollbackStatefulSet(clusterUid: string, namespace: string, name: string, data: StatefulSetRollbackForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
    - `StatefulSetRollbackForm` （StatefulSet 回滚请求对象）
      - revision: number （目标历史版本号）
  - Permission: `kubernetes:workload:statefulset:edit`

## 暂停更新
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/pause`
  - Function: `void pauseStatefulSet(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
  - Permission: `kubernetes:workload:statefulset:edit`

## 恢复更新
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/statefulsets/:name/resume`
  - Function: `void resumeStatefulSet(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （StatefulSet 名称）
  - Permission: `kubernetes:workload:statefulset:edit`

# DaemonSet 功能

## 查看 DaemonSet 列表
- 页面路由
  - Name: `kubernetes:workload:daemonset`
  - Path: `/kubernetes/clusters/:clusterUid/daemonsets`
  - Component: `/src/view/kubernetes/workload/daemonset/index.vue`
  - Permission: `kubernetes:workload:daemonset:view`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/daemonsets`
  - Function: `PageVo<DaemonSetListVo> getDaemonSetList(clusterUid: string, params: Partial<DaemonSetQueryForm>)`
    - clusterUid: string （集群 UID）
    - `DaemonSetQueryForm`（DaemonSet 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （DaemonSet 名称）
      - namespace: string （命名空间名称）
      - status: DaemonSetStatus （状态，来自 `/src/config/kubernetes/workload/daemonset.ts` 包）
    - `DaemonSetListVo`（DaemonSet 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （DaemonSet 名称）
      - description?: string （DaemonSet 描述）
      - status: DaemonSetStatus （状态，来自 `/src/config/kubernetes/workload/daemonset.ts` 包）
      - statusMsg?: string （状态信息）
      - desiredNumberScheduled: number （目标调度 Pod 总数）
      - numberReady: number （就绪 Pod 数）
      - updateStrategyType: DaemonSetUpdateStrategyType （更新策略）

## 查看 DaemonSet 详情
- 页面路由
  - Name: `kubernetes:workload:daemonset:detail`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name`
  - Component: `/src/view/kubernetes/workload/daemonset/detail/index.vue`
  - Permission: `kubernetes:workload:daemonset:view`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name`
  - Function: `DaemonSetDetailVo getDaemonSetDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `DaemonSetDetailVo`（DaemonSet 详情响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - description?: string （DaemonSet 描述）
      - status: DaemonSetStatus （状态，来自 `/src/config/kubernetes/workload/daemonset.ts` 包）
      - statusMsg?: string （状态信息）
      - metadata: ObjectMeta （DaemonSet 的资源元数据，详见 ### ObjectMeta）
      - spec: DaemonSetSpec （DaemonSet 的规格定义，详见 ### DaemonSetSpec）
      - statusObj: DaemonSetStatusObj （DaemonSet 的观测状态，详见 ### DaemonSetStatusObj）

## 查看 DaemonSet YAML
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/yaml`
  - Function: `DaemonSetYamlVo getDaemonSetYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `DaemonSetYamlVo`: （DaemonSet YAML 响应对象）
      - yaml: string（DaemonSet YAML 文本）

## 查看 DaemonSet 关联 Pod 列表
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/pods`
  - Function: `PageVo<DaemonSetPodListVo> getDaemonSetPodList(clusterUid: string, namespace: string, name: string, params: Partial<DaemonSetPodQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `DaemonSetPodQueryForm`（DaemonSet 关联 Pod 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Pod 名称）
      - status: PodStatus （Pod 状态）
    - `DaemonSetPodListVo` （DaemonSet 关联 Pod 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
      - name: string （Pod 名称）
      - ip: string （Pod IP）
      - status: PodStatus （Pod 状态）
      - statusMsg: string （Pod 状态信息）
      - restarts: number （Pod 重启次数）
      - nodeIp: string （Pod 所属节点 IP）
      - nodeName: string （Pod 所属节点名称）
      - readyContainerCount: number （Pod 就绪容器数量）
      - containerCount: number （Pod 容器总数）

## 查看 DaemonSet 历史版本列表
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/history`
  - Function: `PageVo<DaemonSetHistoryRevisionListVo> getDaemonSetHistoryRevisionList(clusterUid: string, namespace: string, name: string, params: Partial<DaemonSetHistoryRevisionQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `DaemonSetHistoryRevisionQueryForm`（DaemonSet 历史版本查询条件请求对象） 继承 `PageForm`
      - revision: number （版本名称）
      - changeCause: string （变更原因）
    - `DaemonSetHistoryRevisionListVo` （DaemonSet 历史版本列表项响应对象）继承 `HistoryRevision`

## 查看 DaemonSet 关联网络资源
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/network`
  - Function: `DaemonSetNetworkVo getDaemonSetNetwork(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `DaemonSetNetworkVo` （DaemonSet 关联网络资源响应对象）
      - services: DaemonSetServiceListVo[] （关联的 Service 列表）
      - ingresses: DaemonSetIngressListVo[] （关联的 Ingress 列表）
      - `DaemonSetServiceListVo` （DaemonSet 关联 Service 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
        - name: string （Service 名称）
        - description: string （Service 描述）
        - type: ServiceType （Service 类型，来自 `/src/config/kubernetes/network/service.ts`）
        - clusterIp: string （集群内部 IP，ClusterIP / NodePort / LoadBalancer 类型自动分配）
        - externalName: string （外部域名，仅 ExternalName 类型生效）
        - headless: boolean （是否为 Headless Service，clusterIp 为 None）
      - `DaemonSetIngressListVo` （DaemonSet 关联 Ingress 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
        - name: string （Ingress 名称）
        - description: string （Ingress 描述）
        - ingressClassName?: string （Ingress 类名，对应 IngressClassName 资源名称）

## 查看 DaemonSet 事件列表
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/events`
  - Function: `PageVo<EventListVo> getDaemonSetEventList(clusterUid: string, namespace: string, name: string, params: Partial<EventQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `EventQueryForm`（事件查询条件请求对象）
    - `EventListVo`（事件列表项响应对象）

## 查看 DaemonSet 监控数据
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/monitor`
  - Function: `DaemonSetMonitorVo getDaemonSetMonitor(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `DaemonSetMonitorVo` （DaemonSet 监控响应对象）
      - {TODO: DaemonSetMonitorVo 对象属性}

## 创建
- 页面路由
  - Name: `kubernetes:workload:daemonset:create`
  - Path: `/kubernetes/clusters/:clusterUid/daemonsets/create`
  - Component: `/src/view/kubernetes/workload/daemonset/create/index.vue`
  - Permission: `kubernetes:workload:daemonset:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/daemonsets`
  - Function: `void createDaemonSet(clusterUid: string, data: Partial<DaemonSetCreateForm>)`
    - clusterUid: string （集群 UID）
    - `DaemonSetCreateForm` （DaemonSet 创建请求对象）
      - description?: string （DaemonSet 描述）
      - metadata: ObjectMeta （DaemonSet 的资源元数据，详见 ### ObjectMeta）
      - spec: DaemonSetSpec （DaemonSet 的规格定义，详见 ### DaemonSetSpec）

## YAML 创建
- 页面路由
  - Name: `kubernetes:workload:daemonset:create:yaml`
  - Path: `/kubernetes/clusters/:clusterUid/daemonsets/create/yaml`
  - Component: `/src/view/kubernetes/workload/daemonset/create/yaml.vue`
  - Permission: `kubernetes:workload:daemonset:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/daemonsets/yaml`
  - Function: `void createDaemonSetYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （DaemonSet YAML 字符串）

## 更新
- 页面路由
  - Name: `kubernetes:workload:daemonset:edit`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/edit`
  - Component: `/src/view/kubernetes/workload/daemonset/edit/index.vue`
  - Permission: `kubernetes:workload:daemonset:edit`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name`
  - Function: `void updateDaemonSet(clusterUid: string, namespace: string, name: string, data: Partial<DaemonSetUpdateForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `DaemonSetUpdateForm` （DaemonSet 更新请求对象）
      - description?: string （DaemonSet 描述）
      - metadata: ObjectMeta （DaemonSet 的资源元数据，详见 ### ObjectMeta）
      - spec: DaemonSetSpec （DaemonSet 的规格定义，详见 ### DaemonSetSpec）

## YAML 更新
- 页面路由
  - Name: `kubernetes:workload:daemonset:edit:yaml`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/edit/yaml`
  - Component: `/src/view/kubernetes/workload/daemonset/edit/yaml.vue`
  - Permission: `kubernetes:workload:daemonset:edit`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/yaml`
  - Function: `void updateDaemonSetYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - yaml: string （DaemonSet YAML 字符串）

## 管理标签
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/labels`
  - Function: `void manageDaemonSetLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `MetadataLabelForm`（管理标签请求对象） 来自 `/src/types/kubernetes/common.ts`
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）

## 管理注解
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/annotations`
  - Function: `void manageDaemonSetAnnotation(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `MetadataAnnotationForm`（管理注解请求对象） 来自 `/src/types/kubernetes/common.ts`
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）

## 删除
- 页面路由
  - 无
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name`
  - Function: `void deleteDaemonSet(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
  - Permission: `kubernetes:workload:daemonset:delete`

## 批量删除
- 页面路由
  - 无
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/daemonsets/batch`
  - Function: `void deleteDaemonSets(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （DaemonSet UID 列表）
  - Permission: `kubernetes:workload:daemonset:delete`

## 导入
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/daemonsets/import`
  - Function: `void importDaemonSet(clusterUid: string, formData: FormData, onProgress?: (progressEvent: AxiosProgressEvent) => void)`
    - clusterUid: string （集群 UID）
    - formData: FormData （上传的文件）
    - onProgress?: (progressEvent: AxiosProgressEvent) => void （上传进度回调）
  - Permission: `kubernetes:workload:daemonset:import`

## 导出
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/daemonsets/export`
  - Function: `void exportDaemonSet(clusterUid: string, params: Partial<DaemonSetQueryForm>)`
    - clusterUid: string （集群 UID）
    - `DaemonSetQueryForm` 共享【查看 DaemonSet 详情】章节的实体定义
  - Permission: `kubernetes:workload:daemonset:export`

## 重启
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/restart`
  - Function: `void restartDaemonSet(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
  - Permission: `kubernetes:workload:daemonset:edit`

## 回滚
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/rollback`
  - Function: `void rollbackDaemonSet(clusterUid: string, namespace: string, name: string, data: DaemonSetRollbackForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
    - `DaemonSetRollbackForm` （DaemonSet 回滚请求对象）
      - revision: number （目标历史版本号）
  - Permission: `kubernetes:workload:daemonset:edit`

## 暂停更新
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/pause`
  - Function: `void pauseDaemonSet(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
  - Permission: `kubernetes:workload:daemonset:edit`

## 恢复更新
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/daemonsets/:name/resume`
  - Function: `void resumeDaemonSet(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （DaemonSet 名称）
  - Permission: `kubernetes:workload:daemonset:edit`

# Job 功能

## 查看 Job 列表
- 页面路由
  - Name: `kubernetes:workload:job`
  - Path: `/kubernetes/clusters/:clusterUid/jobs`
  - Component: `/src/view/kubernetes/workload/job/index.vue`
  - Permission: `kubernetes:workload:job:view`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/jobs`
  - Function: `PageVo<JobListVo> getJobList(clusterUid: string, params: Partial<JobQueryForm>)`
    - clusterUid: string （集群 UID）
    - `JobQueryForm`（Job 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Job 名称）
      - namespace: string （命名空间名称）
      - status: JobStatus （状态，来自 `/src/config/kubernetes/workload/job.ts` 包）
    - `JobListVo`（Job 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （Job 名称）
      - description?: string （Job 描述）
      - status: JobStatus （状态，来自 `/src/config/kubernetes/workload/job.ts` 包）
      - statusMsg?: string （状态信息）
      - active: number （运行中的 Pod 数）
      - succeeded: number （已成功完成的 Pod 数）
      - failed: number （已失败的 Pod 数）
      - completions: number （需要成功完成的 Pod 数）
      - parallelism: number （并行运行的 Pod 数）

## 查看 Job 详情
- 页面路由
  - Name: `kubernetes:workload:job:detail`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name`
  - Component: `/src/view/kubernetes/workload/job/detail/index.vue`
  - Permission: `kubernetes:workload:job:view`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name`
  - Function: `JobDetailVo getJobDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - `JobDetailVo`（Job 详情响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - description?: string （Job 描述）
      - status: JobStatus （状态，来自 `/src/config/kubernetes/workload/job.ts` 包）
      - statusMsg?: string （状态信息）
      - metadata: ObjectMeta （Job 的资源元数据，详见 ### ObjectMeta）
      - spec: JobSpec （Job 的规格定义，详见 ### JobSpec）
      - statusObj: JobStatusObj （Job 的观测状态，详见 ### JobStatusObj）

## 查看 Job YAML
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/yaml`
  - Function: `JobYamlVo getJobYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - `JobYamlVo`: （Job YAML 响应对象）
      - yaml: string（Job YAML 文本）

## 查看 Job 关联 Pod 列表
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/pods`
  - Function: `PageVo<JobPodListVo> getJobPodList(clusterUid: string, namespace: string, name: string, params: Partial<JobPodQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - `JobPodQueryForm`（Job 关联 Pod 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Pod 名称）
      - status: PodStatus （Pod 状态）
    - `JobPodListVo` （Job 关联 Pod 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
      - name: string （Pod 名称）
      - ip: string （Pod IP）
      - status: PodStatus （Pod 状态）
      - statusMsg: string （Pod 状态信息）
      - restarts: number （Pod 重启次数）
      - nodeIp: string （Pod 所属节点 IP）
      - nodeName: string （Pod 所属节点名称）
      - readyContainerCount: number （Pod 就绪容器数量）
      - containerCount: number （Pod 容器总数）

## 查看 Job 事件列表
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/events`
  - Function: `PageVo<EventListVo> getJobEventList(clusterUid: string, namespace: string, name: string, params: Partial<EventQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - `EventQueryForm`（事件查询条件请求对象）
    - `EventListVo`（事件列表项响应对象）

## 查看 Job 监控数据
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/monitor`
  - Function: `JobMonitorVo getJobMonitor(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - `JobMonitorVo` （Job 监控响应对象）
      - {TODO: JobMonitorVo 对象属性}

## 创建
- 页面路由
  - Name: `kubernetes:workload:job:create`
  - Path: `/kubernetes/clusters/:clusterUid/jobs/create`
  - Component: `/src/view/kubernetes/workload/job/create/index.vue`
  - Permission: `kubernetes:workload:job:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/jobs`
  - Function: `void createJob(clusterUid: string, data: Partial<JobCreateForm>)`
    - clusterUid: string （集群 UID）
    - `JobCreateForm` （Job 创建请求对象）
      - description?: string （Job 描述）
      - metadata: ObjectMeta （Job 的资源元数据，详见 ### ObjectMeta）
      - spec: JobSpec （Job 的规格定义，详见 ### JobSpec）

## YAML 创建
- 页面路由
  - Name: `kubernetes:workload:job:create:yaml`
  - Path: `/kubernetes/clusters/:clusterUid/jobs/create/yaml`
  - Component: `/src/view/kubernetes/workload/job/create/yaml.vue`
  - Permission: `kubernetes:workload:job:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/jobs/yaml`
  - Function: `void createJobYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （Job YAML 字符串）

## 更新
- 页面路由
  - Name: `kubernetes:workload:job:edit`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/edit`
  - Component: `/src/view/kubernetes/workload/job/edit/index.vue`
  - Permission: `kubernetes:workload:job:edit`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name`
  - Function: `void updateJob(clusterUid: string, namespace: string, name: string, data: Partial<JobUpdateForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - `JobUpdateForm` （Job 更新请求对象）
      - description?: string （Job 描述）
      - metadata: ObjectMeta （Job 的资源元数据，详见 ### ObjectMeta）
      - spec: JobSpec （Job 的规格定义，详见 ### JobSpec）

## YAML 更新
- 页面路由
  - Name: `kubernetes:workload:job:edit:yaml`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/edit/yaml`
  - Component: `/src/view/kubernetes/workload/job/edit/yaml.vue`
  - Permission: `kubernetes:workload:job:edit`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/yaml`
  - Function: `void updateJobYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - yaml: string （Job YAML 字符串）

## 管理标签
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/labels`
  - Function: `void manageJobLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - `MetadataLabelForm`（管理标签请求对象） 来自 `/src/types/kubernetes/common.ts`
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）

## 管理注解
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/annotations`
  - Function: `void manageJobAnnotation(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
    - `MetadataAnnotationForm`（管理注解请求对象） 来自 `/src/types/kubernetes/common.ts`
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）

## 删除
- 页面路由
  - 无
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name`
  - Function: `void deleteJob(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
  - Permission: `kubernetes:workload:job:delete`

## 批量删除
- 页面路由
  - 无
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/jobs/batch`
  - Function: `void deleteJobs(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （Job UID 列表）
  - Permission: `kubernetes:workload:job:delete`

## 导入
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/jobs/import`
  - Function: `void importJob(clusterUid: string, formData: FormData, onProgress?: (progressEvent: AxiosProgressEvent) => void)`
    - clusterUid: string （集群 UID）
    - formData: FormData （上传的文件）
    - onProgress?: (progressEvent: AxiosProgressEvent) => void （上传进度回调）
  - Permission: `kubernetes:workload:job:import`

## 导出
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/jobs/export`
  - Function: `void exportJob(clusterUid: string, params: Partial<JobQueryForm>)`
    - clusterUid: string （集群 UID）
    - `JobQueryForm` 共享【查看 Job 详情】章节的实体定义
  - Permission: `kubernetes:workload:job:export`

## 手动重跑
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/rerun`
  - Function: `void rerunJob(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
  - Permission: `kubernetes:workload:job:edit`

## 暂停更新
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/pause`
  - Function: `void pauseJob(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
  - Permission: `kubernetes:workload:job:edit`

## 恢复更新
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/jobs/:name/resume`
  - Function: `void resumeJob(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Job 名称）
  - Permission: `kubernetes:workload:job:edit`

# CronJob 功能

## 查看 CronJob 列表
- 页面路由
  - Name: `kubernetes:workload:cronjob`
  - Path: `/kubernetes/clusters/:clusterUid/cronjobs`
  - Component: `/src/view/kubernetes/workload/cronjob/index.vue`
  - Permission: `kubernetes:workload:cronjob:view`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/cronjobs`
  - Function: `PageVo<CronJobListVo> getCronJobList(clusterUid: string, params: Partial<CronJobQueryForm>)`
    - clusterUid: string （集群 UID）
    - `CronJobQueryForm`（CronJob 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （CronJob 名称）
      - namespace: string （命名空间名称）
      - status: CronJobStatus （状态，来自 `/src/config/kubernetes/workload/cronjob.ts` 包）
    - `CronJobListVo`（CronJob 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （CronJob 名称）
      - description?: string （CronJob 描述）
      - status: CronJobStatus （状态，来自 `/src/config/kubernetes/workload/cronjob.ts` 包）
      - statusMsg?: string （状态信息）
      - schedule: string （Cron 调度表达式）
      - active: number （当前运行中的 Job 数）
      - lastScheduleTime: string （最近一次触发时间）
      - suspend: boolean （是否已暂停）

## 查看 CronJob 详情
- 页面路由
  - Name: `kubernetes:workload:cronjob:detail`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name`
  - Component: `/src/view/kubernetes/workload/cronjob/detail/index.vue`
  - Permission: `kubernetes:workload:cronjob:view`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name`
  - Function: `CronJobDetailVo getCronJobDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - `CronJobDetailVo`（CronJob 详情响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - description?: string （CronJob 描述）
      - status: CronJobStatus （状态，来自 `/src/config/kubernetes/workload/cronjob.ts` 包）
      - statusMsg?: string （状态信息）
      - metadata: ObjectMeta （CronJob 的资源元数据，详见 ### ObjectMeta）
      - spec: CronJobSpec （CronJob 的规格定义，详见 ### CronJobSpec）
      - statusObj: CronJobStatusObj （CronJob 的观测状态，详见 ### CronJobStatusObj）

## 查看 CronJob YAML
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/yaml`
  - Function: `CronJobYamlVo getCronJobYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - `CronJobYamlVo`: （CronJob YAML 响应对象）
      - yaml: string（CronJob YAML 文本）

## 查看 CronJob 关联 Job 列表
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/jobs`
  - Function: `PageVo<CronJobJobListVo> getCronJobJobList(clusterUid: string, namespace: string, name: string, params: Partial<CronJobJobQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - `CronJobJobQueryForm`（CronJob 关联 Job 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Job 名称）
      - status: JobStatus （Job 状态）
    - `CronJobJobListVo` （CronJob 关联 Job 列表项响应对象） 继承 `UidEntity`, `AuditEntity`
      - name: string （Job 名称）
      - status: JobStatus （Job 状态）
      - statusMsg: string （Job 状态信息）
      - active: number （运行中的 Pod 数）
      - succeeded: number （已成功完成的 Pod 数）
      - failed: number （已失败的 Pod 数）
      - completions: number （需要成功完成的 Pod 数）
      - parallelism: number （并行运行的 Pod 数）

## 查看 CronJob 事件列表
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/events`
  - Function: `PageVo<EventListVo> getCronJobEventList(clusterUid: string, namespace: string, name: string, params: Partial<EventQueryForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - `EventQueryForm`（事件查询条件请求对象）
    - `EventListVo`（事件列表项响应对象）

## 查看 CronJob 监控数据
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/monitor`
  - Function: `CronJobMonitorVo getCronJobMonitor(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - `CronJobMonitorVo` （CronJob 监控响应对象）
      - {TODO: CronJobMonitorVo 对象属性}

## 创建
- 页面路由
  - Name: `kubernetes:workload:cronjob:create`
  - Path: `/kubernetes/clusters/:clusterUid/cronjobs/create`
  - Component: `/src/view/kubernetes/workload/cronjob/create/index.vue`
  - Permission: `kubernetes:workload:cronjob:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/cronjobs`
  - Function: `void createCronJob(clusterUid: string, data: Partial<CronJobCreateForm>)`
    - clusterUid: string （集群 UID）
    - `CronJobCreateForm` （CronJob 创建请求对象）
      - description?: string （CronJob 描述）
      - metadata: ObjectMeta （CronJob 的资源元数据，详见 ### ObjectMeta）
      - spec: CronJobSpec （CronJob 的规格定义，详见 ### CronJobSpec）

## YAML 创建
- 页面路由
  - Name: `kubernetes:workload:cronjob:create:yaml`
  - Path: `/kubernetes/clusters/:clusterUid/cronjobs/create/yaml`
  - Component: `/src/view/kubernetes/workload/cronjob/create/yaml.vue`
  - Permission: `kubernetes:workload:cronjob:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/cronjobs/yaml`
  - Function: `void createCronJobYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （CronJob YAML 字符串）

## 更新
- 页面路由
  - Name: `kubernetes:workload:cronjob:edit`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/edit`
  - Component: `/src/view/kubernetes/workload/cronjob/edit/index.vue`
  - Permission: `kubernetes:workload:cronjob:edit`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name`
  - Function: `void updateCronJob(clusterUid: string, namespace: string, name: string, data: Partial<CronJobUpdateForm>)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - `CronJobUpdateForm` （CronJob 更新请求对象）
      - description?: string （CronJob 描述）
      - metadata: ObjectMeta （CronJob 的资源元数据，详见 ### ObjectMeta）
      - spec: CronJobSpec （CronJob 的规格定义，详见 ### CronJobSpec）

## YAML 更新
- 页面路由
  - Name: `kubernetes:workload:cronjob:edit:yaml`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/edit/yaml`
  - Component: `/src/view/kubernetes/workload/cronjob/edit/yaml.vue`
  - Permission: `kubernetes:workload:cronjob:edit`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/yaml`
  - Function: `void updateCronJobYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - yaml: string （CronJob YAML 字符串）

## 管理标签
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/labels`
  - Function: `void manageCronJobLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - `MetadataLabelForm`（管理标签请求对象） 来自 `/src/types/kubernetes/common.ts`
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）

## 管理注解
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/annotations`
  - Function: `void manageCronJobAnnotation(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
    - `MetadataAnnotationForm`（管理注解请求对象） 来自 `/src/types/kubernetes/common.ts`
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）

## 删除
- 页面路由
  - 无
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name`
  - Function: `void deleteCronJob(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
  - Permission: `kubernetes:workload:cronjob:delete`

## 批量删除
- 页面路由
  - 无
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/cronjobs/batch`
  - Function: `void deleteCronJobs(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （CronJob UID 列表）
  - Permission: `kubernetes:workload:cronjob:delete`

## 导入
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/cronjobs/import`
  - Function: `void importCronJob(clusterUid: string, formData: FormData, onProgress?: (progressEvent: AxiosProgressEvent) => void)`
    - clusterUid: string （集群 UID）
    - formData: FormData （上传的文件）
    - onProgress?: (progressEvent: AxiosProgressEvent) => void （上传进度回调）
  - Permission: `kubernetes:workload:cronjob:import`

## 导出
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/cronjobs/export`
  - Function: `void exportCronJob(clusterUid: string, params: Partial<CronJobQueryForm>)`
    - clusterUid: string （集群 UID）
    - `CronJobQueryForm` 共享【查看 CronJob 详情】章节的实体定义
  - Permission: `kubernetes:workload:cronjob:export`

## 立即触发
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/trigger`
  - Function: `void triggerCronJob(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
  - Permission: `kubernetes:workload:cronjob:edit`

## 暂停更新
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/pause`
  - Function: `void pauseCronJob(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
  - Permission: `kubernetes:workload:cronjob:edit`

## 恢复更新
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/cronjobs/:name/resume`
  - Function: `void resumeCronJob(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （CronJob 名称）
  - Permission: `kubernetes:workload:cronjob:edit`

# ConfigMap 功能

## 查看 ConfigMap 列表
- 页面路由
  - Name: `kubernetes:config:configmap`
  - Path: `/kubernetes/clusters/:clusterUid/configmaps`
  - Component: `/src/view/kubernetes/config/configmap/index.vue`
  - Permission: `kubernetes:config:configmap:view`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/configmaps`
  - Function: `PageVo<ConfigMapListVo> getConfigMapList(clusterUid: string, params: Partial<ConfigMapQueryForm>)`
    - clusterUid: string （集群 UID）
    - `ConfigMapQueryForm`（ConfigMap 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （ConfigMap 名称）
      - namespace: string （命名空间名称）
      - labelSelector: Record<string, string> （标签过滤）
    - `ConfigMapListVo`（ConfigMap 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （ConfigMap 名称）
      - description?: string （ConfigMap 描述）
      - dataCount: number （键值对数量）
      - immutable: boolean （是否不可变）

## 查看 ConfigMap 详情
- 页面路由
  - Name: `kubernetes:config:configmap:detail`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name`
  - Component: `/src/view/kubernetes/config/configmap/detail/index.vue`
  - Permission: `kubernetes:config:configmap:view`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name`
  - Function: `ConfigMapDetailVo getConfigMapDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （ConfigMap 名称）
    - `ConfigMapDetailVo`（ConfigMap 详情响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - description?: string （ConfigMap 描述）
      - metadata: ObjectMeta （ConfigMap 的资源元数据，详见 ### ObjectMeta）
      - immutable?: boolean （是否不可变）
      - data: Record<string, string> （键值对配置数据，明文）
      - binaryData: Record<string, string> （二进制数据，base64 编码）

## 查看 ConfigMap YAML
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/yaml`
  - Function: `ConfigMapYamlVo getConfigMapYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （ConfigMap 名称）
    - `ConfigMapYamlVo`: （ConfigMap YAML 响应对象）
      - yaml: string（ConfigMap YAML 文本）

## 创建 ConfigMap
- 页面路由
  - Name: `kubernetes:config:configmap:create`
  - Path: `/kubernetes/clusters/:clusterUid/configmaps/create`
  - Component: `/src/view/kubernetes/config/configmap/create.vue`
  - Permission: `kubernetes:config:configmap:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/configmaps`
  - Function: `void createConfigMap(clusterUid: string, data: ConfigMapCreateForm)`
    - clusterUid: string （集群 UID）
    - `ConfigMapCreateForm`（ConfigMap 创建请求对象）
      - description?: string （ConfigMap 描述）
      - metadata: ObjectMeta （ConfigMap 的资源元数据，详见 ### ObjectMeta）
      - data: Record<string, string> （键值对配置数据）
      - binaryData?: Record<string, string> （二进制数据，base64）
      - immutable?: boolean （是否不可变）
  - Permission: `kubernetes:config:configmap:create`

## 创建 ConfigMap YAML
- 页面路由
  - Name: `kubernetes:config:configmap:create:yaml`
  - Path: `/kubernetes/clusters/:clusterUid/configmaps/create/yaml`
  - Component: `/src/view/kubernetes/config/configmap/create/yaml.vue`
  - Permission: `kubernetes:config:configmap:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/configmaps/yaml`
  - Function: `void createConfigMapYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （ConfigMap YAML 字符串）
  - Permission: `kubernetes:config:configmap:create`

## 更新 ConfigMap
- 页面路由
  - Name: `kubernetes:config:configmap:edit`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/edit`
  - Component: `/src/view/kubernetes/config/configmap/edit.vue`
  - Permission: `kubernetes:config:configmap:edit`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/configmaps/:name`
  - Function: `void updateConfigMap(clusterUid: string, namespace: string, name: string, data: ConfigMapUpdateForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （ConfigMap 名称）
    - `ConfigMapUpdateForm`（ConfigMap 更新请求对象）
      - description?: string （ConfigMap 描述）
      - metadata: ObjectMeta （ConfigMap 的资源元数据，详见 ### ObjectMeta）
      - data: Record<string, string> （键值对配置数据）
      - binaryData?: Record<string, string> （二进制数据，base64）
      - immutable?: boolean （是否不可变）
  - Permission: `kubernetes:config:configmap:edit`

## 更新 ConfigMap YAML
- 页面路由
  - Name: `kubernetes:config:configmap:edit:yaml`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/edit/yaml`
  - Component: `/src/view/kubernetes/config/configmap/edit/yaml.vue`
  - Permission: `kubernetes:config:configmap:edit`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/yaml`
  - Function: `void updateConfigMapYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （ConfigMap 名称）
    - yaml: string （ConfigMap YAML 字符串）
  - Permission: `kubernetes:config:configmap:edit`

## 管理标签
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/configmaps/:name/labels`
  - Function: `void manageConfigMapLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （ConfigMap 名称）
    - `MetadataLabelForm`（管理标签请求对象） 来自 `/src/types/kubernetes/common.ts`
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）

## 管理注解
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/configmaps/:name/annotations`
  - Function: `void manageConfigMapAnnotation(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （ConfigMap 名称）
    - `MetadataAnnotationForm`（管理注解请求对象） 来自 `/src/types/kubernetes/common.ts`
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）

## 删除 ConfigMap
- 页面路由
  - 无
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name`
  - Function: `void deleteConfigMap(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （ConfigMap 名称）
  - Permission: `kubernetes:config:configmap:delete`

## 批量删除
- 页面路由
  - 无
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/configmaps/batch`
  - Function: `void deleteConfigMaps(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （ConfigMap UID 列表）
  - Permission: `kubernetes:config:configmap:delete`

## 克隆 ConfigMap
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/configmaps/:name/clone`
  - Function: `void cloneConfigMap(clusterUid: string, namespace: string, name: string, data: ConfigMapCloneForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （源 ConfigMap 名称）
    - `ConfigMapCloneForm`（ConfigMap 克隆请求对象）
      - targetNamespace: string （目标命名空间名称，可跨命名空间克隆）
      - targetName: string （目标 ConfigMap 名称）
  - Permission: `kubernetes:config:configmap:create`

# Secret 功能

## 查看 Secret 列表
- 页面路由
  - Name: `kubernetes:config:secret`
  - Path: `/kubernetes/clusters/:clusterUid/secrets`
  - Component: `/src/view/kubernetes/config/secret/index.vue`
  - Permission: `kubernetes:config:secret:view`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/secrets`
  - Function: `PageVo<SecretListVo> getSecretList(clusterUid: string, params: Partial<SecretQueryForm>)`
    - clusterUid: string （集群 UID）
    - `SecretQueryForm`（Secret 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Secret 名称）
      - namespace: string （命名空间名称）
      - type: SecretType （密钥类型，定义来自 `/src/config/kubernetes/config/secret.ts`）
      - labelSelector: Record<string, string> （标签过滤）
    - `SecretListVo`（Secret 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （Secret 名称）
      - description?: string （Secret 描述）
      - type: SecretType （密钥类型，定义来自 `/src/config/kubernetes/config/secret.ts`）
      - dataCount: number （数据条目数）
      - immutable: boolean （是否不可变）

## 查看 Secret 详情

> 安全约束：列表/详情/编辑回显均不直接展示明文 value，仅用户主动点击「显示」时本地 base64 解码预览，不落日志。

- 页面路由
  - Name: `kubernetes:config:secret:detail`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name`
  - Component: `/src/view/kubernetes/config/secret/detail/index.vue`
  - Permission: `kubernetes:config:secret:view`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name`
  - Function: `SecretDetailVo getSecretDetail(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Secret 名称）
    - `SecretDetailVo`（Secret 详情响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - description?: string （Secret 描述）
      - type: SecretType （密钥类型，定义来自 `/src/config/kubernetes/config/secret.ts`）
      - metadata: ObjectMeta （Secret 的资源元数据，详见 ### ObjectMeta）
      - data: Record<string, string> （密文数据，base64 编码，展示时脱敏）
      - stringData?: Record<string, string> （明文数据，写入时自动 base64 编码存储）
      - immutable?: boolean （是否不可变）

## 查看 Secret YAML
- 页面路由
  - 无
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/yaml`
  - Function: `SecretYamlVo getSecretYaml(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Secret 名称）
    - `SecretYamlVo`: （Secret YAML 响应对象）
      - yaml: string（Secret YAML 文本）

## 创建 Secret
- 页面路由
  - Name: `kubernetes:config:secret:create`
  - Path: `/kubernetes/clusters/:clusterUid/secrets/create`
  - Component: `/src/view/kubernetes/config/secret/create.vue`
  - Permission: `kubernetes:config:secret:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/secrets`
  - Function: `void createSecret(clusterUid: string, data: SecretCreateForm)`
    - clusterUid: string （集群 UID）
    - `SecretCreateForm`（Secret 创建请求对象）
      - description?: string （Secret 描述）
      - metadata: ObjectMeta （Secret 的资源元数据，详见 ### ObjectMeta）
      - type: SecretType （密钥类型，定义来自 `/src/config/kubernetes/config/secret.ts`）
      - data: Record<string, string> （密文数据，base64 编码）
      - stringData?: Record<string, string> （明文数据，自动 base64 编码存储）
      - immutable?: boolean （是否不可变）
  - Permission: `kubernetes:config:secret:create`

## 创建 Secret YAML
- 页面路由
  - Name: `kubernetes:config:secret:create:yaml`
  - Path: `/kubernetes/clusters/:clusterUid/secrets/create/yaml`
  - Component: `/src/view/kubernetes/config/secret/create/yaml.vue`
  - Permission: `kubernetes:config:secret:create`
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/secrets/yaml`
  - Function: `void createSecretYaml(clusterUid: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - yaml: string （Secret YAML 字符串）
  - Permission: `kubernetes:config:secret:create`

## 编辑 Secret
- 页面路由
  - Name: `kubernetes:config:secret:edit`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/edit`
  - Component: `/src/view/kubernetes/config/secret/edit.vue`
  - Permission: `kubernetes:config:secret:edit`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/secrets/:name`
  - Function: `void updateSecret(clusterUid: string, namespace: string, name: string, data: SecretUpdateForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Secret 名称）
    - `SecretUpdateForm`（Secret 更新请求对象）
      - description?: string （Secret 描述）
      - metadata: ObjectMeta （Secret 的资源元数据，详见 ### ObjectMeta）
      - type: SecretType （密钥类型，定义来自 `/src/config/kubernetes/config/secret.ts`）
      - data: Record<string, string> （密文数据，base64 编码）
      - stringData?: Record<string, string> （明文数据，自动 base64 编码存储）
      - immutable?: boolean （是否不可变）
  - Permission: `kubernetes:config:secret:edit`

## 编辑 Secret YAML
- 页面路由
  - Name: `kubernetes:config:secret:edit:yaml`
  - Path: `/kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/edit/yaml`
  - Component: `/src/view/kubernetes/config/secret/edit/yaml.vue`
  - Permission: `kubernetes:config:secret:edit`
- API 接口
  - URL: `PUT /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/yaml`
  - Function: `void updateSecretYaml(clusterUid: string, namespace: string, name: string, yaml: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Secret 名称）
    - yaml: string （Secret YAML 字符串）
  - Permission: `kubernetes:config:secret:edit`

## 管理标签
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/secrets/:name/labels`
  - Function: `void manageSecretLabel(clusterUid: string, namespace: string, name: string, data: MetadataLabelForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Secret 名称）
    - `MetadataLabelForm`（管理标签请求对象） 来自 `/src/types/kubernetes/common.ts`
      - labels: Record<string, string> （标签键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）

## 管理注解
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/secrets/:name/annotations`
  - Function: `void manageSecretAnnotation(clusterUid: string, namespace: string, name: string, data: MetadataAnnotationForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Secret 名称）
    - `MetadataAnnotationForm`（管理注解请求对象） 来自 `/src/types/kubernetes/common.ts`
      - annotations: Record<string, string> （注解键值对）
      - operation: number （操作，1: 新增；2: 移除；3: 全量替换）

## 删除 Secret
- 页面路由
  - 无
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name`
  - Function: `void deleteSecret(clusterUid: string, namespace: string, name: string)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （Secret 名称）
  - Permission: `kubernetes:config:secret:delete`

## 批量删除
- 页面路由
  - 无
- API 接口
  - URL: `DELETE /kubernetes/clusters/:clusterUid/secrets/batch`
  - Function: `void deleteSecrets(clusterUid: string, uids: string[])`
    - clusterUid: string （集群 UID）
    - uids: string[] （Secret UID 列表）
  - Permission: `kubernetes:config:secret:delete`

## 克隆 Secret
- 页面路由
  - 无
- API 接口
  - URL: `POST /kubernetes/clusters/:clusterUid/namespaces/:namespace/secrets/:name/clone`
  - Function: `void cloneSecret(clusterUid: string, namespace: string, name: string, data: SecretCloneForm)`
    - clusterUid: string （集群 UID）
    - namespace: string （命名空间名称）
    - name: string （源 Secret 名称）
    - `SecretCloneForm`（Secret 克隆请求对象）
      - targetNamespace: string （目标命名空间名称，可跨命名空间克隆）
      - targetName: string （目标 Secret 名称）
  - Permission: `kubernetes:config:secret:create`
