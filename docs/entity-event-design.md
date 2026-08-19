# Event 实体设计

## 文档约定

本系列实体设计文档统一遵循以下类型引用规范，以支撑后续基于文档准确生成代码、避免 AI 幻觉自我扩展：

1. **枚举（string literal 联合类型）**：均使用「枚举定义见」指向 `## Event 常量定义` 章节中的 `###` 定义，不复述取值列表。
2. **类型只被引用 1 次**：直接就地展开其子字段，不抽独立 `###` 定义。
3. **类型被引用 ≥ 2 次**：抽为独立 `###` 定义，引用处使用「定义见」指向该锚点，不重复展开子字段（含内联字段一并抽离）。
4. **跨文件已定义的类型**：允许引用 `entity-kubernetes-design.md`（Kubernetes 通用/原始定义收口文件）与 `entity-common-design.md`（全局通用类型收口文件）。本文不重复定义或展开。资源 design 文档之间禁止互相引用。当前引用示例：`ObjectMeta` 来自 `entity-kubernetes-design.md`；`PageForm` 来自 `entity-common-design.md`。
5. 类型名、常量名一律使用 `` ` `` 包裹；链接锚点以 VS Code 自动生成为准（英文标题 `### Xxx` → `#xxx`，首字母小写）。

> 简言之：**枚举 → 枚举定义见；复用 ≥2 次 → 定义见；仅用 1 次 → 直接展开；跨文件共用 → 仅引用 entity-kubernetes-design.md。**

## Event 常量定义（`/src/config/kubernetes/event.ts）

### EventType

事件类型，标识事件的严重程度分类（string literal 类型，+enum）。

#### _eventTypes (internal const)
- 'Normal' （label: '正常'）
- 'Warning' （label: '警告'）

#### EventType (derived from _eventTypes)
```ts
export type EventType = (typeof _eventTypes)[number]['value']
```

## Event 原始类型定义（`/src/types/kubernetes/event/types.ts`）

### Event

Kubernetes 事件实体（events.k8s.io/v1），记录集群中资源对象的生命周期事件与异常告警。

- eventTime?: string （事件首次被观测到的时间，microTime 精度）
- involvedObject: `ObjectReference` （事件所描述的对象，定义见 [`ObjectReference`](entity-kubernetes-design.md#objectreference)）
- reason?: string （事件原因，人类可读，最长 128 字符）
- message?: string （事件描述，人类可读的状态说明，最大 1kB）
- source?: `EventSource` （事件来源，包含组件与主机信息）
  - component?: string （产生事件的组件，如 kubelet、controller-manager）
  - host?: string （产生事件的主机名）
- firstTimestamp?: string （事件首次被记录的时间）
- lastTimestamp?: string （事件最近一次被记录的时间）
- count?: number （事件已发生的次数）
- type?: `EventType` （事件类型，枚举定义见 [`EventType`](#eventtype)）
- series?: `EventSeries` （事件系列聚合信息，同一系列事件的聚合；单条事件为 nil）
  - count?: number （该系列事件已发生的次数）
  - lastObservedTime?: string （该系列事件最近一次被观测到的时间）
- action?: string （针对关联对象所采取/失败的动作，机器可读，最长 128 字符）
- related?: `ObjectReference` （可选的二级关联对象，用于更复杂的动作，定义见 [`ObjectReference`](entity-kubernetes-design.md#objectreference)）
- reportingController?: string （上报该事件的控制器名称，例如 kubernetes.io/kubelet）
- reportingInstance?: string （控制器实例 ID，例如 kubelet-xyzf）

继承：`ObjectMeta`（name / namespace / labels / annotations / uid 等，定义见 [`ObjectMeta`](entity-kubernetes-design.md#objectmeta)）。

## Event 类型定义（`/src/types/kubernetes/event/index.ts`）

### EventQueryForm

事件查询条件请求对象，继承全局分页请求。

- type: `EventType` （事件类型，枚举定义见 [`EventType`](#eventtype)）
- reason: string （事件原因）
- note: string （事件描述）
- regarding: `ObjectReference` （事件关联对象，按 apiVersion/kind/name/namespace/uid 精确匹配，可选，定义见 [`ObjectReference`](entity-kubernetes-design.md#objectreference)）

继承：`PageForm`（分页请求，含 page、pageSize，定义见 [`PageForm`](entity-common-design.md#pageform)）。

### EventListVo

事件列表项响应对象，继承事件实体。

- 继承 `Event`（定义见 [`Event`](#event)），无额外字段。
