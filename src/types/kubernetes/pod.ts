/**
 * Pod 资源相关类型定义
 * @module types/kubernetes/pod
 */
import type { BaseEntity } from '../common'

export type PodStatus = 'Running' | 'Pending' | 'Failed'

/**
 * Pod 响应数据
 * @extends BaseEntity 继承基础实体（含 id, createAt, createBy, updateAt, updateBy）
 */
export interface PodResp extends BaseEntity {
  /** 资源 UID */
  uid: string
  /** Pod 名称 */
  name: string
  /** 所属集群 ID */
  clusterId: string
  /** 所属集群名称 */
  clusterName: string
  /** 所属节点名称 */
  nodeName: string
  /** 所属节点 IP */
  nodeIp: string
  /** 所属命名空间 */
  namespace: string
  status: PodStatus
  /** Pod IP */
  ip: string
  restarts: number
  ready: number
  containerCount: number
  /** 启动时间 */
  startTime: string
}
