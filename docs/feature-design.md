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

## Kubernetes 通用类型定义 （`/src/types/kubernetes/comomn.ts`）

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

### DeploymentStrategy - Deployment 更新策略
- type: DeploymentUpdateStrategyType （策略类型，来自 `/src/config/kubernetes/workload/deployment.ts`）
- rollingUpdate: Record<string, string> （滚动更新属性）
  - maxUnavailable?: string （最大不可用副本数）
  - maxSurge?: string （最大超出副本数）

### DeploymentSpec - Deployment 规格信息
- replicas: number （期望副本数，默认为 1）
- selector: LabelSelector （Pod 标签选择器，须匹配 Pod 模板的标签）
- strategy: DeploymentStrategy （用于替换旧 Pod 的更新策略）
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

### DeploymentStatus - Deployment 状态信息
- observedGeneration: number （Deployment 控制器已观测到的 generation 代次）
- replicas: number （匹配选择器且未终止的 Pod 总数）
- updatedReplicas: number （匹配选择器、且已应用期望模板 spec 的 Pod 总数）
- readyReplicas: number （匹配选择器、且处于 Ready 状态的 Pod 总数）
- availableReplicas: number （匹配选择器、且至少就绪 minReadySeconds 的可用 Pod 总数）
- unavailableReplicas: number （不可用 Pod 总数，即尚未达到 100% 可用容量所需的 Pod；包括运行中但尚未就绪、或尚未创建的 Pod）
- terminatingReplicas: number （匹配选择器且正在终止的 Pod 总数；此类 Pod 具有非空的 deletionTimestamp 且尚未进入 Failed/Succeeded 阶段；需启用 DeploymentReplicaSetTerminatingReplicas featureGate，默认开启）
- conditions: DeploymentCondition[] （Deployment 当前状态的最新观测条件列表）
- collisionCount: number （Deployment 的哈希冲突计数；控制器在为新 ReplicaSet 生成名称时用作冲突避免机制）

### HistoryRevision - 历史版本
- revision: number （修订版本号）
- changeCause: string （变更原因）
- createAt: string （创建时间）
- active: boolean （是否为当前活跃版本）

# Deployment 功能

## 查看 Deployment 列表
- 功能权限：`kubernetes:workload:deployment:view`
- 页面路由
  - Name: `kubernetes:workload:deployment`
  - Path: `/kubernetes/clusters/:clusterUid/deployments`
  - Component: `/src/view/kubernetes/workload/deployment/index.vue`
- API 接口
  - URL: `GET /kubernetes/clusters/:clusterUid/deployments`
  - Function: `PageVo<DeploymentListVo> getDeploymentList(clusterUid: string, params: Partial<DeploymentQueryForm>)`
    - clusterUid: string （集群 UID）
    - `DeploymentQueryForm`（Deployment 查询条件请求对象） 继承 `UidEntity`, `PageForm`
      - name: string （Deployment 名称）
      - namespace: string （命名空间名称）
      - status: DeploymentStatusLabel （状态，来自 `/src/config/kubernetes/workload/deployment.ts` 包）
    - `DeploymentListVo`（Deployment 列表项响应对象） 继承 `UidEntity`, `Clustered`, `Namespaced`, `AuditEntity`, `DeletableEntity`
      - name: string （Deployment 名称）
      - description?: string （描述）
      - status: DeploymentStatusLabel （状态，来自 `/src/config/kubernetes/workload/deployment.ts` 包）
      - statusMessage?: string （状态信息）
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
      - status: DeploymentStatusLabel （状态，来自 `/src/config/kubernetes/workload/deployment.ts` 包）
      - statusMessage?: string （状态信息）
      - metadata: ObjectMeta （Deployment 的资源元数据，详见 ### ObjectMeta）
      - spec: DeploymentSpec （Deployment 的规格定义，详见 ### DeploymentSpec）
      - status: DeploymentStatus （Deployment 的观测状态，详见 ### DeploymentStatus）

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
    - `DeploymentHistoryRevisionListVo` （Deployment 历史版本列表项响应对象）继承 `HistoryRevision`

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
      - services: ServiceListVo[] （关联的 Service 列表，`ServiceListVo` 定义在 `/src/types/kubernetes/network/service.ts`）
      - ingresses: IngressListVo[] （关联的 Ingress 列表，`IngressListVo` 定义在 `/src/types/kubernetes/network/ingress.ts`）

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
