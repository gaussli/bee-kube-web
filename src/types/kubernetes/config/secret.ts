/**
 * Secret 资源相关类型定义
 * @module types/kubernetes/config/secret
 */
import type { BaseEntity, PageForm } from '@/types/common'

/**
 * Secret 类型枚举
 * @remarks 对应 Kubernetes Secret.type 字段，不同类型用于不同的认证和配置场景
 */
export type SecretType =
  /** 通用密钥，存储用户自定义的键值对数据 */
  | 'Opaque'
  /** 服务账号 Token，由控制器自动挂载到 Pod，包含 API Server 访问凭证 */
  | 'kubernetes.io/service-account-token'
  /** Docker 守护进程认证信息（旧格式），用于访问私有镜像仓库 */
  | 'kubernetes.io/dockercfg'
  /** Docker 认证信息（JSON 格式），用于 containerd/CRI-O 等运行时拉取私有镜像 */
  | 'kubernetes.io/dockerconfigjson'
  /** 基础认证凭据，用于 HTTP Basic Auth */
  | 'kubernetes.io/basic-auth'
  /** SSH 认证凭据，用于 GitOps 等场景的 SSH 密钥管理 */
  | 'kubernetes.io/ssh-auth'
  /** TLS 证书，存储 TLS/SSL 证书和私钥，常用于 Ingress/IngressRoute 的安全配置 */
  | 'kubernetes.io/tls'
  /** Bootstrap Token，用于节点引导加入集群时的认证 */
  | 'kubernetes.io/boot-straph-token'

/**
 * Secret 列表响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface SecretListResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** Secret 名称 */
  name: string
  /** 所属命名空间 */
  namespace: string
  /** 所属集群 ID */
  clusterUid: string
  /** 描述信息 */
  description?: string
  /** Secret 类型 */
  type: SecretType
  /** 数据项数量 */
  dataKeysCount?: number
  /** 关联工作负载 ID 列表 */
  refs?: string[]
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * Secret 详情响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface SecretDetailResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** Secret 名称 */
  name: string
  /** 所属命名空间 */
  namespace: string
  /** 所属集群 ID */
  clusterUid: string
  /** 所属集群名称 */
  clusterName?: string
  /** 描述信息 */
  description?: string
  /** Secret 类型 */
  type: SecretType
  /** 数据键值对（base64 编码） */
  data?: Record<string, string>
  /** 字符串数据（未编码） */
  stringData?: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 数据项数量 */
  dataKeysCount?: number
  /** 关联工作负载 ID 列表 */
  refs?: string[]
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * Secret 查询请求参数
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface SecretQueryReq extends PageForm {
  /** Secret ID（精确匹配） */
  id: string
  /** Secret 名称（模糊匹配） */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** Secret 类型 */
  type: SecretType
  /** 标签选择器 */
  labelSelector: string
}

/**
 * Secret 创建/更新请求参数
 */
export interface SecretReq {
  /** Secret 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** Secret 类型 */
  type: SecretType
  /** 数据键值对（base64 编码） */
  data?: Record<string, string>
  /** 字符串数据（未编码） */
  stringData?: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * Secret 数据更新请求
 */
export interface SecretDataReq {
  /** 数据键值对 */
  data: Record<string, string>
  /** 操作（1: 新增/更新；2: 移除；3: 全量替换） */
  operation: number
}

/**
 * Secret 标签更新请求
 */
export interface SecretLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * Secret YAML 导入请求
 * @remarks 通过 YAML 格式导入 Secret 配置
 */
export interface SecretYamlReq {
  /** YAML 配置内容 */
  yaml: string
}

/**
 * Secret 注解更新请求
 */
export interface SecretAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}
