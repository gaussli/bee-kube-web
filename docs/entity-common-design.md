# 全局通用类型定义

## 全局通用类型定义 （`/src/types/common.ts`）

### ApiResult

通用 API 响应结构（泛型，T 为响应数据类型）。

- code: number （状态码）
- message: string （响应消息）
- data: T （响应数据）
- requestId: string （请求唯一标识）

### PageForm

分页请求参数。

- page: number （页码）
- pageSize: number （每页条数）

### PageVo

分页响应结构（泛型，T 为列表数据类型）。

- list: T[] （数据列表）
- total: number （总条数）
- page: number （当前页码）
- pageSize: number （每页条数）

### IdEntity

ID 实体，包含唯一标识。

- id: string （唯一标识）

### UidEntity

UID 实体，Kubernetes 资源中包含 uid 字段的实体。

- uid: string （资源 UID）

### AuditEntity

审计实体，包含创建与更新信息。

- createAt?: string （创建时间）
- createBy?: string （创建人）
- updateAt?: string （更新时间）
- updateBy?: string （更新人）

### DeletableEntity

可删除实体，包含删除判断标识。

- deletable: boolean （是否可删除）
