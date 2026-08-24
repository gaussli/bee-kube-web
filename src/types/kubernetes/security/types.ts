/**
 * Security 资源公共实体类型定义
 * @module types/kubernetes/security/types
 */

/**
 * PolicyRule 策略规则
 * @description 描述一条授权规则，但不包含规则作用于谁或作用于哪个命名空间的信息
 */
export interface PolicyRule {
  /** 适用于本规则所有资源的动词列表；'*' 表示全部动词 */
  verbs: string[]
  /** 资源所属的 API 组列表；'' 表示核心 API 组，'*' 表示全部 API 组 */
  apiGroups?: string[]
  /** 本规则适用的资源列表；'*' 表示全部资源 */
  resources?: string[]
  /** 规则适用的资源名称白名单（可选）；为空表示适用于全部 */
  resourceNames?: string[]
  /** 非资源型 URL 集合（可选）；仅适用于 ClusterRoleBinding 引用的 ClusterRole */
  nonResourceURLs?: string[]
}

/**
 * Subject 绑定主体
 * @description 角色绑定作用的对象引用，可为直接 API 对象引用或 User/Group 等非对象值
 */
export interface Subject {
  /** 引用对象种类；本 API 组取值为 "User"、"Group"、"ServiceAccount" */
  kind: string
  /** 被引用主体的 API 组；ServiceAccount 默认 ""，User/Group 默认 "rbac.authorization.k8s.io" */
  apiGroup?: string
  /** 被引用对象的名称 */
  name: string
  /** 被引用对象的命名空间；User/Group 等非命名空间对象若设置此值，授权器应报错 */
  namespace?: string
}

/**
 * RoleRef 角色引用
 * @description 指向被引用的角色（ClusterRole 或 Role）
 */
export interface RoleRef {
  /** 被引用资源的 API 组 */
  apiGroup: string
  /** 被引用资源的类型（ClusterRole 或 Role） */
  kind: string
  /** 被引用资源的名称 */
  name: string
}
