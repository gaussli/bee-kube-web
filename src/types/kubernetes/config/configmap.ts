/**
 * ConfigMap 资源相关类型定义
 * @module types/kubernetes/config/configmap
 */
import type { BaseEntity, PageForm } from '@/types/common'

/**
 * ConfigMap 列表响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface ConfigMapListResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** ConfigMap 名称 */
  name: string
  /** 所属命名空间 */
  namespace: string
  /** 所属集群 ID */
  clusterId: string
  /** 描述信息 */
  description?: string
  /** 配置项数量 */
  dataKeysCount?: number
  /** 关联工作负载 ID 列表 */
  refs?: string[]
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * ConfigMap 详情响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface ConfigMapDetailResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** ConfigMap 名称 */
  name: string
  /** 所属命名空间 */
  namespace: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName?: string
  /** 描述信息 */
  description?: string
  /** 数据键值对 */
  data?: Record<string, string>
  /** 二进制数据键值对（base64 编码） */
  binaryData?: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
  /** 配置项数量 */
  dataKeysCount?: number
  /** 关联工作负载 ID 列表 */
  refs?: string[]
  /** 是否可删除 */
  deletable?: boolean
}

/**
 * ConfigMap 查询请求参数
 * @extends PageForm 继承分页请求（含 page, pageSize）
 */
export interface ConfigMapQueryReq extends PageForm {
  /** ConfigMap ID（精确匹配） */
  id: string
  /** ConfigMap 名称（模糊匹配） */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 标签选择器 */
  labelSelector: string
}

/**
 * ConfigMap 创建/更新请求参数
 */
export interface ConfigMapReq {
  /** ConfigMap 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** 数据键值对 */
  data?: Record<string, string>
  /** 二进制数据键值对（base64 编码） */
  binaryData?: Record<string, string>
  /** 标签 */
  labels?: Record<string, string>
  /** 注解 */
  annotations?: Record<string, string>
}

/**
 * ConfigMap 数据更新请求
 */
export interface ConfigMapDataReq {
  /** 数据键值对 */
  data: Record<string, string>
  /** 操作（1: 新增/更新；2: 移除；3: 全量替换） */
  operation: number
}

/**
 * ConfigMap 标签更新请求
 */
export interface ConfigMapLabelsReq {
  /** 标签键值对 */
  labels: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}

/**
 * ConfigMap YAML 导入请求
 * @remarks 通过 YAML 格式导入 ConfigMap 配置
 */
export interface ConfigMapYamlReq {
  /** YAML 配置内容 */
  yaml: string
}

/**
 * ConfigMap 注解更新请求
 */
export interface ConfigMapAnnotationsReq {
  /** 注解键值对 */
  annotations: Record<string, string>
  /** 操作（1: 新增；2: 移除：3: 全量替换） */
  operation: number
}
