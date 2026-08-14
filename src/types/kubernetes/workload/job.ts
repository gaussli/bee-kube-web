/**
 * Job 资源相关类型定义
 * @module types/kubernetes/workload/job
 *
 * @remarks
 * 类型分区及对象简述（按文档功能描述出现顺序排列）：
 *   1. 查看 Job 列表
 *      - JobQueryForm：Job 查询条件请求对象
 *      - JobListVo：Job 列表项响应对象
 *   2. 查看 Job 详情
 *      - JobDetailVo：Job 详情响应对象
 *   3. 查看 Job YAML
 *      - JobYamlVo：Job YAML 响应对象
 *   4. 查看 Job 关联 Pod 列表
 *      - JobPodQueryForm：Job 关联 Pod 查询条件请求对象
 *      - JobPodListVo：Job 关联 Pod 列表项响应对象
 *   5. 查看 Job 监控数据
 *      - JobMonitorVo：Job 监控响应对象
 *   6. 创建
 *      - JobCreateForm：Job 创建请求对象
 *   7. 更新
 *      - JobUpdateForm：Job 更新请求对象
 */
import type { AuditEntity, DeletableEntity, PageForm, UidEntity } from '@/types/common'

import type { PodStatus } from '@/config/kubernetes/pod'
import type { JobStatus } from '@/config/kubernetes/workload/job'

import type { Clustered, Namespaced, ObjectMeta } from '../types'

import type { JobSpec, JobStatusObj } from './types'

/**
 * Job 查询条件请求对象
 * @extends UidEntity 继承 UID 类型
 * @extends PageForm 继承分页请求
 */
export interface JobQueryForm extends UidEntity, PageForm {
  /** Job 名称 */
  name: string
  /** 命名空间名称 */
  namespace: string
  /** Job 状态 */
  status: JobStatus
}

/**
 * Job 列表项响应对象
 * @extends UidEntity 继承 UID 类型
 * @extends Clustered 继承集群类型
 * @extends Namespaced 继承命名空间类型
 * @extends AuditEntity 继承审计实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface JobListVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** Job 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 状态 */
  status: JobStatus
  /** 状态信息 */
  statusMsg?: string
  /** 运行中的 Pod 数 */
  active: number
  /** 已成功完成的 Pod 数 */
  succeeded: number
  /** 已失败的 Pod 数 */
  failed: number
  /** 需要成功完成的 Pod 数 */
  completions: number
  /** 并行运行的 Pod 数 */
  parallelism: number
}

/**
 * Job 详情响应对象
 * @extends UidEntity 继承 UID 类型
 * @extends Clustered 继承集群类型
 * @extends Namespaced 继承命名空间类型
 * @extends AuditEntity 继承审计实体类型
 * @extends DeletableEntity 继承可删除类型
 */
export interface JobDetailVo extends UidEntity, Clustered, Namespaced, AuditEntity, DeletableEntity {
  /** 描述信息 */
  description?: string
  /** 状态标签 */
  status: JobStatus
  /** 状态信息 */
  statusMsg?: string
  /** Job 的资源元数据 */
  metadata: ObjectMeta
  /** Job 的规格定义 */
  spec: JobSpec
  /** Job 的观测状态 */
  statusObj: JobStatusObj
}

/**
 * Job YAML 响应对象
 */
export interface JobYamlVo {
  /** Job 的完整 YAML 文本 */
  yaml: string
}

/**
 * Job 关联 Pod 查询条件请求对象
 * @extends UidEntity 继承 UID 类型
 * @extends PageForm 继承分页请求
 */
export interface JobPodQueryForm extends UidEntity, PageForm {
  /** Pod 名称 */
  name: string
  /** Pod 状态 */
  status: PodStatus
}

/**
 * Job 关联 Pod 列表项响应对象
 * @extends UidEntity 继承 UID 类型
 * @extends AuditEntity 继承审计实体类型
 */
export interface JobPodListVo extends UidEntity, AuditEntity {
  /** Pod 名称 */
  name: string
  /** Pod IP */
  ip: string
  /** Pod 状态 */
  status: PodStatus
  /** Pod 状态信息 */
  statusMsg: string
  /** Pod 重启次数 */
  restarts: number
  /** Pod 所属节点 IP */
  nodeIp: string
  /** Pod 所属节点名称 */
  nodeName: string
  /** Pod 就绪容器数量 */
  readyContainerCount: number
  /** Pod 容器总数 */
  containerCount: number
}

/** Job 监控响应对象 */
export interface JobMonitorVo {}

/** Job 创建请求对象 */
export interface JobCreateForm {
  /** Job 描述 */
  description?: string
  /** Job 的资源元数据 */
  metadata: ObjectMeta
  /** Job 的规格定义 */
  spec: JobSpec
}

/** Job 更新请求对象 */
export interface JobUpdateForm {
  /** Job 描述 */
  description?: string
  /** Job 的资源元数据 */
  metadata: ObjectMeta
  /** Job 的规格定义 */
  spec: JobSpec
}
