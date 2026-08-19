# Pod 实体设计

## 文档约定

本系列实体设计文档统一遵循以下类型引用规范，以支撑后续基于文档准确生成代码、避免 AI 幻觉自我扩展：

1. **枚举（string literal 联合类型）**：均使用「枚举定义见」指向 `## Pod 常量定义` 章节中的 `###` 定义，不复述取值列表。
2. **类型只被引用 1 次**：直接就地展开其子字段，不抽独立 `###` 定义。
3. **类型被引用 ≥ 2 次**：抽为独立 `###` 定义，引用处使用「定义见」指向该锚点，不重复展开子字段（含内联字段一并抽离）。
4. **跨文件已定义的类型**：允许引用 `entity-kubernetes-design.md`（Kubernetes 通用/原始定义收口文件）与 `entity-common-design.md`（全局通用类型收口文件）。本文不重复定义或展开。多资源共用的枚举放入 `entity-kubernetes-design.md` 的常量定义章节，多资源共用的类型放入其类型定义章节。资源 design 文档之间禁止互相引用（**唯一例外：本文（pod）仅可被 `entity-workload-design.md` 引用**，如 `PodSpec`）。当前引用示例：`ResourceName`/`Signal`/`Quantity`/`LabelSelector`/`Protocol` 均来自 `entity-kubernetes-design.md`。
5. 类型名、常量名一律使用 `` ` `` 包裹；链接锚点以 VS Code 自动生成为准（英文标题 `### Xxx` → `#xxx`，首字母小写）。

> 简言之：**枚举 → 枚举定义见；复用 ≥2 次 → 定义见；仅用 1 次 → 直接展开；跨文件共用 → 仅引用 entity-kubernetes-design.md。**

## Pod 类型定义（/src/types/kubernetes/pod.ts）

## Pod 常量定义（`/src/config/kubernetes/pod.ts`）

### PodStatus

Pod 的总体运行状态，反映其生命周期阶段（如运行中、等待中、成功、失败等）。

#### _podStatuses (internal const)
- 'Running' （label: '运行中', labelEn: 'Running', color: COLOR_SUCCESS）
- 'Pending' （label: '等待中', labelEn: 'Pending', color: COLOR_WARNING）
- 'Succeeded' （label: '已完成', labelEn: 'Succeeded', color: COLOR_SUCCESS）
- 'Failed' （label: '已失败', labelEn: 'Failed', color: COLOR_DANGER）
- 'Unknown' （label: '未知', labelEn: 'Unknown', color: COLOR_GRAY_70）

#### PodStatus (derived from _podStatuses)
```ts
export type PodStatus = (typeof _podStatuses)[number]['value']
```

#### POD_STATUS_OPTIONS
- { value: undefined, label: '全部状态', labelEn: 'ALL', color: COLOR_SUCCESS }
- ..._podStatuses

### StorageMedium

EmptyDir 卷的存储介质类型，决定临时数据存放于磁盘还是内存（含大页内存）。

#### _storageMediums (internal const)
- '' （label: '默认介质'）
- 'Memory' （label: '内存'）
- 'HugePages' （label: '大页内存'）
- 'HugePages-' （label: '大页内存前缀'）

#### StorageMedium (derived from _storageMediums)
```ts
export type StorageMedium = (typeof _storageMediums)[number]['value']
```

### NodeExpressionOperator

节点亲和性/反亲和性中节点选择器表达式的匹配运算符（如等于、存在、大于等）。

#### _nodeExpressionOperators (internal const)
- 'In' （label: '包含于'）
- 'NotIn' （label: '不包含于'）
- 'Exists' （label: '存在'）
- 'DoesNotExist' （label: '不存在'）
- 'Gt' （label: '大于'）
- 'Lt' （label: '小于'）

#### NodeExpressionOperator (derived from _nodeExpressionOperators)
```ts
export type NodeExpressionOperator = (typeof _nodeExpressionOperators)[number]['value']
```

### TolerationOperator

污点容忍（Toleration）中匹配污点 value 的运算符（如存在、等于等）。

#### _tolerationOperators (internal const)
- 'Exists' （label: '存在'）
- 'Equal' （label: '等于'）
- 'Lt' （label: '小于'）
- 'Gt' （label: '大于'）

#### TolerationOperator (derived from _tolerationOperators)
```ts
export type TolerationOperator = (typeof _tolerationOperators)[number]['value']
```

### TaintEffect

污点（Taint）对节点的作用效果，决定对不能容忍该污点的 Pod 的调度/驱逐行为。

#### _taintEffects (internal const)
- 'NoSchedule' （label: '不可调度'）
- 'PreferNoSchedule' （label: '尽量不可调度'）
- 'NoExecute' （label: '驱逐'）

#### TaintEffect (derived from _taintEffects)
```ts
export type TaintEffect = (typeof _taintEffects)[number]['value']
```

### RecursiveReadOnlyMode

只读挂载的递归模式，控制挂载卷及其子挂载点是否以只读方式传播。

#### _recursiveReadOnlyModes (internal const)
- 'Disabled' （label: '禁用'）
- 'IfPossible' （label: '可能时启用'）
- 'Enabled' （label: '启用'）

#### RecursiveReadOnlyMode (derived from _recursiveReadOnlyModes)
```ts
export type RecursiveReadOnlyMode = (typeof _recursiveReadOnlyModes)[number]['value']
```

### MountPropagationMode

挂载传播模式，决定卷挂载在宿主机与容器之间的挂载事件传播方式。

#### _mountPropagationModes (internal const)
- 'None' （label: '不传播'）
- 'HostToContainer' （label: '宿主机到容器'）
- 'Bidirectional' （label: '双向'）

#### MountPropagationMode (derived from _mountPropagationModes)
```ts
export type MountPropagationMode = (typeof _mountPropagationModes)[number]['value']
```

### URIScheme

探针（Probe）等健康检查请求使用的连接协议（HTTP 或 HTTPS）。

#### _uriSchemes (internal const)
- 'HTTP' （label: 'HTTP'）
- 'HTTPS' （label: 'HTTPS'）

#### URIScheme (derived from _uriSchemes)
```ts
export type URIScheme = (typeof _uriSchemes)[number]['value']
```

### TerminationMessagePolicy

容器终止消息的填充方式，决定如何从文件或日志中获取退出信息。

#### _terminationMessagePolicies (internal const)
- 'File' （label: '文件'）
- 'FallbackToLogsOnError' （label: '错误回退日志'）

#### TerminationMessagePolicy (derived from _terminationMessagePolicies)
```ts
export type TerminationMessagePolicy = (typeof _terminationMessagePolicies)[number]['value']
```

### PullPolicy

镜像拉取策略，控制 kubelet 在启动容器前是否及如何拉取镜像。

#### _pullPolicies (internal const)
- 'Always' （label: '总是拉取'）
- 'Never' （label: '从不拉取'）
- 'IfNotPresent' （label: '不存在时拉取'）

#### PullPolicy (derived from _pullPolicies)
```ts
export type PullPolicy = (typeof _pullPolicies)[number]['value']
```

### RestartPolicy

容器或 Pod 的重启策略，决定 Pod 内容器退出后 kubelet 是否及如何重启。

#### _restartPolicies (internal const)
- 'Always' （label: '总是重启'）
- 'OnFailure' （label: '失败时重启'）
- 'Never' （label: '从不重启'）

#### RestartPolicy (derived from _restartPolicies)
```ts
export type RestartPolicy = (typeof _restartPolicies)[number]['value']
```

### DNSPolicy

Pod 的 DNS 策略，决定 Pod 内如何解析域名及使用哪个 DNS 配置。

#### _dnsPolicies (internal const)
- 'ClusterFirstWithHostNet' （label: '集群优先(宿主网络)'）
- 'ClusterFirst' （label: '集群优先'）
- 'Default' （label: '默认'）
- 'None' （label: '无'）

#### DNSPolicy (derived from _dnsPolicies)
```ts
export type DNSPolicy = (typeof _dnsPolicies)[number]['value']
```

## Pod 原始类型定义（`/src/types/kubernetes/pod/types.ts`）

### PodSpec

Pod 规格信息，描述 Pod 的卷、容器、调度、安全与终止等整体运行配置。
- volumes: `Volume[]` （Pod 内容器可挂载的存储卷列表）
  - name: string （存储卷名称，须为 DNS_LABEL 且在 Pod 内唯一）
  - volumeSource: `VolumeSource` （存储卷来源，定义挂载的位置与类型）
    - hostPath: `HostPathVolumeSource` （挂载宿主机上已存在的文件或目录，定义见 [`HostPathVolumeSource`](entity-kubernetes-design.md#hostpathvolumesource)）
    - emptyDir: `EmptyDirVolumeSource` （与 Pod 生命周期一致的临时目录）
      - medium: `StorageMedium` （存储介质类型，默认为空即使用节点默认介质；枚举定义见 [`StorageMedium`](#storagemedium)）
      - sizeLimit: `Quantity` （该 EmptyDir 卷所需的本地存储总量上限，默认未定义；内存介质下取该值与 Pod 内容器内存限制之和的较小值；定义见 [`Quantity`](entity-kubernetes-design.md#quantity)）
    - gitRepo: `GitRepoVolumeSource` （从 git 仓库克隆内容填充的存储卷，不支持所有权管理，支持 SELinux relabeling）
      - repository: string （git 仓库地址）
      - revision: string （指定提交哈希）
      - directory: string （目标目录名，不能包含或起始于 '..'；'.' 表示卷目录即 git 仓库本身）
    - secret: `SecretVolumeSource` （从 Pod 所在命名空间中的 Secret 填充的存储卷）
      - secretName: string （Pod 所在命名空间中引用的 Secret 名称）
      - items: `KeyToPath[]` （将 Secret 中的键映射到指定路径，未列出键不出现；定义见 [`KeyToPath`](#keytopath)）
      - defaultMode: number （创建文件的默认权限位，八进制 0000–0777 或十进制 0–511，默认 0644）
      - optional: boolean （Secret 或其键是否必须存在，为 true 时允许不存在）
    - nfs: `NFSVolumeSource` （挂载 NFS 服务器导出的目录；定义见 [`NFSVolumeSource`](entity-kubernetes-design.md#nfsvolumesource)）
    - configMap: `ConfigMapVolumeSource` （从 Pod 所在命名空间中的 ConfigMap 填充的存储卷）
      - configMapName: string （ConfigMap 名称）
      - items: `KeyToPath[]` （将 ConfigMap 中的键映射到指定路径，未列出键不出现；定义见 [`KeyToPath`](#keytopath)）
      - defaultMode: number （创建文件的默认权限位，八进制 0000–0777 或十进制 0–511，默认 0644）
      - optional: boolean （ConfigMap 或其键是否必须存在，为 true 时允许不存在）
    - persistentVolumeClaim: `PersistentVolumeClaimVolumeSource` （引用同命名空间下的 PVC）
      - claimName: string （PersistentVolumeClaim 名称）
      - readOnly: boolean （是否以只读方式挂载，为 true 时强制 VolumeMounts 中的 ReadOnly 设置，默认 false）
    - rbd: `RBDVolumeSource` （挂载 Rados Block Device（RBD）块存储卷）
      - cephMonitors: string[] （Ceph 监控节点集合）
      - rbdImage: string （rados 镜像名）
      - fsType: string （挂载的文件系统类型，未指定时推断为 "ext4"）
      - rbdPool: string （rados 池名，默认 "rbd"）
      - radosUser: string （rados 用户名，默认 "admin"）
      - keyring: string （RBDUser 的 keyring 路径，默认 /etc/ceph/keyring）
      - secretRef: `LocalObjectReference` （认证 Secret 引用，提供时覆盖 keyring；定义见 [`LocalObjectReference`](#localobjectreference)）
      - readOnly: boolean （是否只读挂载，默认 false）
    - cephFS: `CephFSVolumeSource` （挂载 CephFS 共享文件系统卷）
      - monitors: string[] （Ceph 监控节点集合）
      - path: string （挂载根路径，默认 "/"）
      - user: string （rados 用户名，默认 "admin"）
      - secretFile: string （User 的 keyring 文件路径，默认 /etc/ceph/user.secret）
      - secretRef: `LocalObjectReference` （认证 Secret 引用，默认空；定义见 [`LocalObjectReference`](#localobjectreference)）
      - readOnly: boolean （是否只读挂载，默认 false）
    - downwardAPI: `DownwardAPIVolumeSource` （通过文件将 Pod 元数据（字段或容器资源）暴露给容器）
      - items: `DownwardAPIVolumeFile[]` （文件条目列表）
        - path: string （相对文件路径，不能为绝对路径或包含 '..'）
        - fieldRef: `ObjectFieldSelector` （引用 Pod 字段，仅支持 annotations、labels、name、namespace、uid）
          - apiVersion: string （字段路径对应的 schema 版本，默认 "v1"）
          - fieldPath: string （要选择的字段路径）
        - resourceFieldRef: `ResourceFieldSelector` （引用容器资源，仅支持 limits.cpu、limits.memory、requests.cpu、requests.memory）
          - containerName: string （容器名称）
          - resource: string （要选择的资源）
          - divisor: `Quantity` （输出格式除数，默认 "1"；定义见 [`Quantity`](entity-kubernetes-design.md#quantity)）
        - mode: number （文件权限位，未指定时使用 defaultMode）
      - defaultMode: number （创建文件的默认权限位，默认 0644）
    - csi: `CSIVolumeSource` （由外部 CSI 驱动处理的临时存储）
      - driver: string （处理该卷的 CSI 驱动名称，需与集群中注册的名称一致）
      - readOnly: boolean （是否以只读方式挂载，默认 false（读写））
      - fsType: string （挂载的文件系统类型，如 "ext4"、"xfs"、"ntfs"，未指定时由 CSI 驱动决定默认文件系统）
      - volumeAttributes: Record<string, string> （传递给 CSI 驱动的特定属性，具体取值参考对应驱动文档）
      - nodePublishSecretName: string （引用包含敏感信息的 Secret 名称，用于完成 CSI NodePublishVolume 调用；可为空表示无需 Secret）
- initContainers: `Container[]` （初始化容器列表，按序执行于主容器之前；定义见 [`Container`](#container)）
- containers: `Container[]` （主容器列表，Pod 中至少有一个容器；定义见 [`Container`](#container)）
- restartPolicy: `RestartPolicy` （所有容器的重启策略，默认 Always；定义见 [`RestartPolicy`](#restartpolicy)）
- terminationGracePeriodSeconds: number （优雅终止宽限秒数，默认 30）
- activeDeadlineSeconds: number （Pod 在节点上存活的最长秒数，超时则标记失败）
- dnsPolicy: `DNSPolicy` （DNS 策略，默认 ClusterFirst；枚举定义见 [`DNSPolicy`](#dnspolicy)）
- nodeSelector: Record<string, string> （节点标签选择器，须匹配节点标签才可调度）
- serviceAccountName: string （运行该 Pod 所使用的 ServiceAccount 名称）
- automountServiceAccountToken: boolean （是否自动将 ServiceAccount 的 API 凭证挂载到容器，未设置时默认自动挂载，取决于 ServiceAccount 的 automountServiceAccountToken 配置）
- nodeName: string （Pod 被调度到的节点名称，为空时由调度器决定）
- hostNetwork: boolean （是否使用宿主机网络命名空间，默认 false）
- hostPID: boolean （是否使用宿主机 PID 命名空间，默认 false）
- hostIPC: boolean （是否使用宿主机 IPC 命名空间，默认 false）
- securityContext: `PodSecurityContext` （Pod 级安全上下文，优先级低于 Container 中的 securityContext 配置）
  - runAsUser: number （容器进程入口点的运行 UID，未指定时默认使用镜像元数据中指定的用户）
  - runAsGroup: number （容器进程入口点的运行 GID，未设置时使用运行时默认值）
  - runAsNonRoot: boolean （是否必须以非 root 用户运行，为 true 时 Kubelet 会校验镜像运行时 UID 不为 0，否则启动失败）
- imagePullSecrets: string[] （拉取镜像所用的 Secret 名称列表）
- hostname: string （Pod 主机名）
- subdomain: string （Pod 子域名）
- affinity: `Affinity` （Pod 调度亲和性规则）
  - nodeAffinity: `NodeAffinity` （节点亲和性）
    - required: `NodeAffinityTerm[]` （必须满足的硬性调度条件，不满足则 Pod 无法调度）
      - matchExpressions: `NodeExpression[]` （节点标签匹配表达式列表；定义见 [`NodeExpression`](#nodeexpression)）
    - preferred: `WeightedNodeAffinityTerm[]` （优先满足的软性调度条件，尽量满足，非强制）
      - weight: number （权重，1~100，值越大优先级越高）
      - matchExpressions: `NodeExpression[]` （节点标签匹配表达式列表，定义见 [`NodeExpression`](#nodeexpression)）
  - podAffinity: `PodAffinity` （Pod 亲和性）
    - required: `PodAffinityTerm[]` （必须满足的硬性亲和要求；定义见 [`PodAffinityTerm`](#podaffinityterm)）
    - preferred: `WeightedPodAffinityTerm[]` （优先满足的软性亲和要求；定义见 [`WeightedPodAffinityTerm`](#weightedpodaffinityterm)）
  - podAntiAffinity: `PodAntiAffinity` （Pod 反亲和性）
    - required: `PodAffinityTerm[]` （必须满足的硬性反亲和要求；定义见 [`PodAffinityTerm`](#podaffinityterm)）
    - preferred: `WeightedPodAffinityTerm[]` （优先满足的软性反亲和要求；定义见 [`WeightedPodAffinityTerm`](#weightedpodaffinityterm)）
- tolerations: `Toleration[]` （Pod 的污点容忍列表）
  - key: string （容忍所匹配的污点键，为空表示匹配所有污点键；此时 operator 必须为 'Exists'，表示匹配所有键与值）
  - operator: `TolerationOperator` （键与值的关系运算符，默认 'Equal'；枚举定义见 [`TolerationOperator`](#tolerationoperator)）
  - value: string （容忍所匹配的污点值；operator 为 'Exists' 时应为空，否则为普通字符串）
  - effect: `TaintEffect` （匹配的污点效果，为空表示匹配所有污点效果；枚举定义见 [`TaintEffect`](#tainteffect)）
  - tolerationSeconds: number （容忍时长（秒），仅对 effect 为 'NoExecute' 的污点生效；未设置表示永久容忍（不驱逐），0 或负数按 0 处理（立即驱逐））
- priorityClassName: string （优先级类名，如 system-node-critical / system-cluster-critical）
- priority: number （优先级数值，值越大优先级越高）
- resources: `ResourceRequirements` （Pod 级计算资源请求与限制，作用于 Pod 内所有容器，支持容器间资源共享；仅支持 cpu、memory、hugepages-* 资源名，不支持 ResourceClaims；alpha 字段，需启用 PodLevelResources featureGate）
  - request: Record<`ResourceName`, `Quantity`> （Pod 内所有容器所需的最小计算资源总量；定义见 [`ResourceName`](entity-kubernetes-design.md#resourcename) / [`Quantity`](entity-kubernetes-design.md#quantity)）
  - limit: Record<`ResourceName`, `Quantity`> （Pod 内所有容器允许使用的最大计算资源总量；定义见 [`ResourceName`](entity-kubernetes-design.md#resourcename) / [`Quantity`](entity-kubernetes-design.md#quantity)）
- hostnameOverride: string （显式覆盖 Pod 在容器内感知的 hostname，不影响其 DNS 记录；非空时优先级高于 hostname/subdomain，且此时 setHostnameAsFQDN 须为 nil 或 false、hostNetwork 须为 false；须为合法 DNS 子域名（RFC 1123）且不超过 64 字符；需启用 HostnameOverride featureGate）

### LocalObjectReference

同命名空间内的对象引用，仅通过名称定位目标对象（如认证 Secret）。
- name: string （被引用对象的名称）

### KeyToPath

将 Secret 或 ConfigMap 中的键映射到存储卷内指定相对路径的条目。
- key: string （要映射的键名）
- path: string （映射到的相对文件路径，不能为绝对路径或以 .. 开头）
- mode: number （该文件的权限位，未指定时沿用 defaultMode，取值范围 0–511）

### Container

Pod 中的单个容器定义，包含镜像、命令、端口、环境变量、探针等完整配置。
- name: string （容器名称，Pod 内必须唯一（DNS_LABEL 格式），不可更新）
- image: string （容器镜像名称，未指定时由上层工作负载控制器默认或覆盖）
- command: string[] （容器入口命令，不在 shell 中执行；未指定时使用镜像的 ENTRYPOINT）
- args: string[] （入口命令的参数，未指定时使用镜像的 CMD）
- workingDir: string （容器工作目录，未指定时使用容器运行时默认（可能由镜像配置））
- ports: `ContainerPort[]` （容器暴露的端口列表，未声明不代表端口不可访问）
  - name: string （端口名称，须为 IANA_SVC_NAME 且在 Pod 内唯一，可被 Service 引用）
  - hostPort: number （映射到宿主机的端口号，0 < x < 65536，多数容器不需要此字段）
  - containerPort: number （Pod IP 上暴露的端口号，0 < x < 65536，必填）
  - protocol: `Protocol` （端口协议，默认 'TCP'；枚举定义见 [`Protocol`](entity-kubernetes-design.md#protocol)）
  - hostIP: string （外部端口绑定的宿主机 IP）
- envFrom: `EnvFromSource[]` （填充容器环境变量的来源列表，多个来源键冲突时后者优先）
  - prefix: string （附加到每个环境变量名前的前缀，可为任意可打印 ASCII 字符，但不能为 '='）
  - configMapRef: `ConfigMapEnvSource` （从 ConfigMap 批量注入环境变量的来源）
    - configMapName: string （引用的 ConfigMap 名称）
    - optional: boolean （该 ConfigMap 是否必须存在，为 true 时允许不存在）
  - secretRef: `SecretEnvSource` （从 Secret 批量注入环境变量的来源）
    - secretName: string （引用的 Secret 名称）
    - optional: boolean （该 Secret 是否必须存在，为 true 时允许不存在）
- env: `EnvVar[]` （容器环境变量列表，可直接赋值或从字段、资源、ConfigMap、Secret 等来源获取，同名 Env 变量优先于 envFrom）
  - name: string （环境变量名称，可为任意可打印 ASCII 字符，但不能为 '='）
  - value: string （变量值，支持 $(VAR_NAME) 引用展开；与 valueFrom 互斥，默认空字符串）
  - valueFrom: `EnvVarSource` （变量值的来源，从 Pod 字段、容器资源、ConfigMap 或 Secret 获取，value 非空时不可使用）
    - fieldRef: `ObjectFieldSelector` （引用 Pod 字段）
      - apiVersion: string （字段路径对应的 schema 版本，默认 "v1"）
      - fieldPath: string （要选择的字段路径）
    - resourceFieldRef: `ResourceFieldSelector` （引用容器计算资源及其输出格式）
      - containerName: string （容器名称，环境变量场景下可选）
      - resource: string （要选择的资源，如 limits.cpu、requests.memory）
      - divisor: `Quantity` （暴露资源的输出格式除数，默认 "1"；定义见 [`Quantity`](entity-kubernetes-design.md#quantity)）
    - configMapKeyRef: `ConfigMapKeySelector` （引用 ConfigMap 中的某个键）
      - configMapName: string （引用的 ConfigMap 名称）
      - key: string （要选择的键）
      - optional: boolean （该 ConfigMap 或其键是否必须存在，为 true 时允许不存在）
    - secretKeyRef: `SecretKeySelector` （引用 Secret 中的某个键）
      - secretName: string （引用的 Secret 名称）
      - key: string （要选择的键）
      - optional: boolean （该 Secret 或其键是否必须存在，为 true 时允许不存在）
- resources: `ResourceRequirements` （容器所需的计算资源）
  - request: Record<`ResourceName`, `Quantity`> （容器所需的最小计算资源量；未指定时默认等于 limit（若显式设置），否则由实现定义；request 不得超过 limit；定义见 [`ResourceName`](entity-kubernetes-design.md#resourcename) / [`Quantity`](entity-kubernetes-design.md#quantity)）
  - limit: Record<`ResourceName`, `Quantity`> （容器允许使用的最大计算资源量；超过将被限制（如 CPU 限流或内存 OOM 终止）；定义见 [`ResourceName`](entity-kubernetes-design.md#resourcename) / [`Quantity`](entity-kubernetes-design.md#quantity)）
- restartPolicy: `RestartPolicy` （容器级重启策略，覆盖 Pod 级重启策略；取值为 'Always' 的初始化容器表现为 sidecar 行为；枚举定义见 [`RestartPolicy`](#restartpolicy)）
- volumeMounts: `VolumeMount[]` （容器内的存储卷挂载点列表）
  - name: string （必须匹配某个 Volume 的 Name，标识要挂载的卷）
  - readOnly: boolean （为 true 时以只读方式挂载，否则读写；默认 false）
  - recursiveReadOnly: `RecursiveReadOnlyMode` （只读挂载是否递归应用；readOnly 为 false 时无意义且不可设置；未设置等价于 Disabled；设为 IfPossible/Enabled 时 mountPropagation 必须为 None；枚举定义见 [`RecursiveReadOnlyMode`](#recursivereadonlymode)）
  - mountPath: string （容器内挂载路径，卷将挂载到该位置）
  - subPath: string （卷内从哪个子路径挂载，默认空字符串表示卷根目录）
  - mountPropagation: `MountPropagationMode` （挂载如何从宿主机传播到容器及反向；未设置时默认为 None；设为 IfPossible/Enabled 的 recursiveReadOnly 时必须为 None；枚举定义见 [`MountPropagationMode`](#mountpropagationmode)）
  - subPathExpr: string （与 subPath 类似，但支持用容器环境变量 $(VAR_NAME) 展开；与 subPath 互斥；默认空字符串）
- volumeDevices: `VolumeDevice[]` （容器使用的块设备列表）
  - name: string （必须匹配 Pod 中某个 persistentVolumeClaim 的名称，标识要映射的块设备卷）
  - devicePath: string （块设备在容器内的映射路径，如 '/dev/block'）
- livenessProbe: `Probe` （存活探针，探测失败则重启容器；定义见 [`Probe`](#probe)）
- readinessProbe: `Probe` （就绪探针，探测失败则将容器从服务端点移除；定义见 [`Probe`](#probe)）
- startupProbe: `Probe` （启动探针，成功前不执行其他探针；失败则重启容器；定义见 [`Probe`](#probe)）
- lifecycle: `Lifecycle` （容器生命周期事件触发的动作）作。
  - postStart: `LifecycleHandler` （容器创建后立即调用；若钩子失败，容器按重启策略终止并重启；其他容器管理操作会阻塞直到钩子完成；定义见 [`LifecycleHandler`](#lifecyclehandler)）
  - preStop: `LifecycleHandler` （容器因 API 请求或管理事件（如存活/启动探针失败、抢占、资源争用等）即将终止前立即调用；容器崩溃或退出时不调用；Pod 终止宽限倒计时在 PreStop 执行前已开始；无论钩子结果如何，容器最终会在宽限期内终止；其他管理操作阻塞直到钩子完成或宽限期到达；定义见 [`LifecycleHandler`](#lifecyclehandler)）
  - stopSignal: `Signal` （容器停止时发送的信号，未指定时使用容器运行时默认值；仅当 Pod 的 .spec.os.name 非空时可设置；如 'SIGTERM'、'SIGKILL' 等；定义见 [`Signal`](entity-kubernetes-design.md#signal)）
- terminationMessagePath: string （容器终止消息写入文件路径，默认 /dev/termination-log，超过 4096 字节将被节点截断）
- terminationMessagePolicy: `TerminationMessagePolicy` （终止消息填充方式，默认 'File'；枚举定义见 [`TerminationMessagePolicy`](#terminationmessagepolicy)）
- imagePullPolicy: `PullPolicy` （镜像拉取策略，可选 'Always' / 'Never' / 'IfNotPresent'，默认随标签决定；枚举定义见 [`PullPolicy`](#pullpolicy)）
- securityContext: `SecurityContext` （容器级安全上下文，优先级高于 `PodSecurityContext` 中同名字段）
  - privileged: boolean （是否以特权模式运行容器；特权容器内进程等效于宿主机 root；默认 false；windows 时不可设置）
  - runAsUser: number （容器进程入口点的 UID；未指定时默认使用镜像元数据中的用户；容器级优先于 PodSecurityContext；windows 时不可设置）
  - runAsGroup: number （容器进程入口点的 GID；未设置时使用运行时默认值；容器级优先于 PodSecurityContext；windows 时不可设置）
  - runAsNonRoot: boolean （容器是否必须以非 root 用户运行；为 true 时 kubelet 运行时会校验镜像不以 UID 0 运行，否则启动失败；容器级优先于 PodSecurityContext）
- stdin: boolean （是否分配 stdin 缓冲区，默认 false）
- stdinOnce: boolean （stdin 被单次 attach 后是否关闭，默认 false）
- tty: boolean （是否分配 TTY，需 stdin 为 true，默认 false）

### Probe

容器健康检查探针，通过命令、HTTP、TCP 或 gRPC 判断容器健康状态。
- exec: `ExecAction` （在容器内执行命令，退出码为 0 视为健康，非 0 视为不健康；定义见 [`ExecAction`](#execaction)）
- httpGet: `HTTPGetAction` （对容器发起 HTTP GET 请求探测；定义见 [`HTTPGetAction`](#httpgetaction)）
- tcpSocket: `TCPSocketAction` （对容器端口发起 TCP 连接探测）
  - port: number | string （容器上访问的端口号或名称，名称须为 IANA_SVC_NAME，端口范围 1-65535）
  - host: string （要连接的主机名，默认 Pod IP）
- grpc: `GRPCAction` （对 gRPC 服务发起健康检查）
  - port: number （gRPC 服务端口号，范围 1-65535）
  - service: string （放入 gRPC HealthCheckRequest 的服务名，未指定时使用 gRPC 默认行为）
- initialDelaySeconds: number （容器启动后多久（秒）开始首次探针；默认 0）
- timeoutSeconds: number （探针超时秒数，默认 1，最小值为 1）
- periodSeconds: number （探针执行周期（秒），默认 10，最小值为 1）
- successThreshold: number （失败后经多少次连续成功才视为成功，默认 1；存活和启动探针必须为 1，最小值为 1）
- failureThreshold: number （成功后经多少次连续失败才视为失败，默认 3，最小值为 1）
- terminationGracePeriodSeconds: number （探针失败后 Pod 优雅终止宽限秒数；为 nil 时沿用 Pod 的 terminationGracePeriodSeconds，否则覆盖；需启用 ProbeTerminationGracePeriod featureGate；最小值为 1）

### LifecycleHandler

容器生命周期钩子的处理器，支持执行命令、HTTP 请求或休眠。
- exec: `ExecAction` （在容器内执行命令，定义见 [`ExecAction`](#execaction)）
- httpGet: `HTTPGetAction` （对容器发起 HTTP GET 请求，定义见 [`HTTPGetAction`](#httpgetaction)）
- sleep: number （容器应休眠的时长，单位：秒）

### ExecAction

在容器内执行命令的动作，退出码为 0 视为成功。
- command: string[] （容器内执行的命令行，工作目录为容器根目录 '/'；直接 exec 而非 shell，不支持 '|' 等 shell 语法）

### HTTPGetAction

对容器发起 HTTP GET 请求的动作。
- path: string （HTTP 服务器上访问的路径）
- port: number | string （容器上访问的端口号或名称，名称须为 IANA_SVC_NAME，端口范围 1-65535）
- host: string （要连接的主机名，默认 Pod IP；通常改用 httpHeaders 中的 Host 设置）
- scheme: `URIScheme` （连接协议，默认 'HTTP'；枚举定义见 [`URIScheme`](#urischeme)）
- httpHeaders: `HTTPHeader[]` （请求中设置的自定义请求头）
  - name: string （请求头字段名，输出时会规范化，大小写变体视为同一头）
  - value: string （请求头字段值）

### NodeExpression

节点亲和性的单条标签匹配表达式，由键、运算符与匹配值组成。
- key: string （节点标签键）
- operator: `NodeExpressionOperator` （匹配运算符；枚举定义见 [`NodeExpressionOperator`](#nodeexpressionoperator)）
- values: string[] （匹配值列表，operator 为 Exists / DoesNotExist 时不生效）

### PodAffinityTerm

Pod 亲和性/反亲和性的一条匹配条件，通过标签选择目标 Pod 及拓扑域。
- labelSelector: `LabelSelector` （通过标签选择目标 Pod 集合；定义见 [`LabelSelector`](entity-kubernetes-design.md#labelselector)）
- namespaces: string[] （目标 Pod 所在命名空间列表，不填或空数组表示当前命名空间）
- namespaceSelector: `LabelSelector` （通过命名空间标签选择目标命名空间；定义见 [`LabelSelector`](entity-kubernetes-design.md#labelselector)）
- topologyKey: string （拓扑域键，如 kubernetes.io/hostname 表示节点级别，failure-domain.beta.kubernetes.io/zone 表示可用区级别）
- matchLabelKeys: string[] （需匹配的标签键列表）
- mismatchLabelKeys: string[] （需排除匹配的标签键列表）

### WeightedPodAffinityTerm

带权重的 Pod 亲和性软性匹配条件，继承 PodAffinityTerm 的字段。
- weight: number （权重，1~100）
- labelSelector: `LabelSelector` （通过标签选择目标 Pod 集合，继承 PodAffinityTerm；定义见 [`LabelSelector`](entity-kubernetes-design.md#labelselector)）
- namespaces: string[] （目标 Pod 所在命名空间列表，继承 PodAffinityTerm）
- namespaceSelector: `LabelSelector` （通过命名空间标签选择目标命名空间，继承 PodAffinityTerm；定义见 [`LabelSelector`](entity-kubernetes-design.md#labelselector)）
- topologyKey: string （拓扑域键，继承 PodAffinityTerm）
- matchLabelKeys: string[] （需匹配的标签键列表，继承 PodAffinityTerm）
- mismatchLabelKeys: string[] （需排除匹配的标签键列表，继承 PodAffinityTerm）
