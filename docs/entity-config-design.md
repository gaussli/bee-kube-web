# Config 实体设计

## 文档约定

本系列实体设计文档统一遵循以下类型引用规范，以支撑后续基于文档准确生成代码、避免 AI 幻觉自我扩展：

1. **枚举（string literal 联合类型）**：均使用「枚举定义见」指向 `## Config 常量定义` 章节中的 `###` 定义，不复述取值列表。
2. **类型只被引用 1 次**：直接就地展开其子字段，不抽独立 `###` 定义。
3. **类型被引用 ≥ 2 次**：抽为独立 `###` 定义，引用处使用「定义见」指向该锚点，不重复展开子字段（含内联字段一并抽离）。
4. **跨文件已定义的类型**：允许引用 `entity-kubernetes-design.md`（Kubernetes 通用/原始定义收口文件）、`entity-common-design.md`（全局通用类型收口文件）以及资源 design 文档。本文不重复定义或展开。资源 design 文档之间禁止互相引用（**唯一例外：可引用 `entity-pod-design.md` 的 Pod 类型**）。当前引用示例：`ObjectMeta` 来自 `entity-kubernetes-design.md`。
5. 类型名、常量名一律使用 `` ` `` 包裹；链接锚点以 VS Code 自动生成为准（英文标题 `### Xxx` → `#xxx`，首字母小写）。

> 简言之：**枚举 → 枚举定义见；复用 ≥2 次 → 定义见；仅用 1 次 → 直接展开；跨文件共用 → 仅引用收口文件。**

## Config 常量定义（`/src/config/kubernetes/config.ts`）

### SecretType

Secret 的类型（string literal 类型，+enum），决定 Secret 数据的语义与使用方式。

#### _secretTypes (internal const)
- 'Opaque' （label: '不透明，默认类型，存放任意用户数据'）
- 'kubernetes.io/service-account-token' （label: '服务账户令牌，需配合 kubernetes.io/service-account.name 与 kubernetes.io/service-account.uid 注解及 data[token]'）
- 'kubernetes.io/dockercfg' （label: 'Docker 配置，data 含 .dockercfg'）
- 'kubernetes.io/dockerconfigjson' （label: 'Docker 配置 JSON，data 含 .dockerconfigjson'）
- 'kubernetes.io/basic-auth' （label: '基础认证，data 含 username / password'）
- 'kubernetes.io/ssh-auth' （label: 'SSH 认证，data 含 ssh-privatekey'）
- 'kubernetes.io/tls' （label: 'TLS 证书，data 含 tls.crt / tls.key'）
- 'bootstrap.kubernetes.io/token' （label: '引导令牌，用于 kubeadm 引导流程签名已知 ConfigMap'）

#### SecretType (derived from _secretTypes)
```ts
export type SecretType = (typeof _secretTypes)[number]['value']
```

### MAX_SECRET_SIZE

Secret 数据大小上限（数值常量），`data` 字段值的总字节数不得超过该值。

- `1048576` （label: '字节数上限（1 * 1024 * 1024）'）

## Config 原始类型定义 （`/src/types/kubernetes/config/types.ts`）

### ConfigMap

Kubernetes ConfigMap 实体，存储非敏感的配置数据供 Pod 消费。

- immutable?: boolean （是否不可变；为 true 时 data/binaryData 不可更新，仅元数据可改）
- data?: Record<string, string> （配置数据，key 须由字母数字、'-'、'_'、'.' 组成，与 binaryData 的 key 不可重叠）
- binaryData?: Record<string, string> （二进制数据，key 规则同 data，value 可为非 UTF-8 字节序列；需 apiserver/kubelet 1.10+）

继承：`ObjectMeta`（name / namespace / labels / annotations / uid 等，定义见 [`ObjectMeta`](entity-kubernetes-design.md#objectmeta)）。

### Secret

Kubernetes Secret 实体，存储敏感数据（如口令、令牌、证书）。

- immutable?: boolean （是否不可变；为 true 时 data/stringData 不可更新，仅元数据可改）
- data?: Record<string, string> （敏感数据，key 须由字母数字、'-'、'_'、'.' 组成；value 为任意（可能非字符串）数据的 base64 编码，整体序列化后总字节数须小于 [`MAX_SECRET_SIZE`](#max_secret_size)）
- stringData?: Record<string, string> （字符串形式的非二进制数据，仅作为写输入字段，写时合并覆盖到 data；读取 API 时**永不输出**）
- type?: `SecretType` （Secret 类型，为空时默认 'Opaque'，枚举定义见 [`SecretType`](#secrettype)）

继承：`ObjectMeta`（name / namespace / labels / annotations / uid 等，定义见 [`ObjectMeta`](entity-kubernetes-design.md#objectmeta)）。
