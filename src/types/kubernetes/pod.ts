/**
 * Pod 资源相关类型定义
 * @module types/kubernetes/pod
 */
import type { PageForm } from '@/types/common'
import type { Namespaced } from './types'

/**
 * Pod 状态枚举
 * @remarks
 * - Running: 运行中（所有容器已创建且至少一个容器正在运行）
 * - Pending: 等待中（Pod 已被集群接受，但容器尚未完全启动）
 * - Succeeded: 已成功（所有容器已正常终止，不再重启）
 * - Failed: 已失败（所有容器已终止，至少一个容器以失败退出）
 * - Unknown: 未知状态（无法获取 Pod 状态）
 */
export type PodStatus = 'Running' | 'Pending' | 'Succeeded' | 'Failed' | 'Unknown'

/**
 * Pod 查询表单
 * @extends PageForm 分页参数
 */
export interface PodQueryForm extends PageForm {
  /** Pod 名称 */
  name?: string
  /** Pod 状态 */
  status?: PodStatus
}

/**
 * Pod 列表响应数据
 * @extends Namespaced 继承命名空间类型（含 clusterUid, clusterName, namespace 等）
 */
export interface PodListVo extends Namespaced {
  /** 资源 UID */
  uid: string
  /** Pod 名称 */
  name: string
  /** Pod IP */
  ip: string
  /** 状态 */
  status: PodStatus
  /** 状态描述信息 */
  statusMsg: string
  /** 重启次数 */
  restarts: number
  /** 所属节点 IP */
  nodeIp: string
  /** 所属节点名称 */
  nodeName: string
  /** 就绪容器数量 */
  readyContainerCount: number
  /** 容器总数 */
  containerCount: number
  /** CPU 使用率 */
  cpuUsage: string
  /** 内存使用率 */
  memoryUsage: string
}
