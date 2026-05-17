/**
 * @fileOverview CustomResourceDefinition 资源相关 API
 * @module api/kubernetes/customResourceDefinition
 */
import type { PageResp } from '@/types/common'
import type {
  CustomResourceDefinitionResp,
  CustomResourceDefinitionQueryReq,
  CustomResourceDefinitionLabelsReq,
  CustomResourceDefinitionAnnotationsReq
} from '@/types/kubernetes/customResourceDefinition'
import request from '@/utils/request'

/**
 * 获取 CustomResourceDefinition 分页列表
 * @param clusterId - 集群 ID
 * @param params - 查询参数
 * @returns CustomResourceDefinition 分页列表
 */
export function getCustomResourceDefinitionPage(clusterId: string, params: CustomResourceDefinitionQueryReq) {
  return request.get<PageResp<CustomResourceDefinitionResp>>(`/kubernetes/clusters/${clusterId}/customresourcedefinitions`, {
    params
  })
}

/**
 * 获取 CustomResourceDefinition 详情
 * @param clusterId - 集群 ID
 * @param name - CustomResourceDefinition 名称
 * @returns CustomResourceDefinition 详情
 */
export function getCustomResourceDefinitionDetail(clusterId: string, name: string) {
  return request.get<CustomResourceDefinitionResp>(`/kubernetes/clusters/${clusterId}/customresourcedefinitions/${name}`)
}

/**
 * 更新 CustomResourceDefinition 标签
 * @param clusterId - 集群 ID
 * @param name - CustomResourceDefinition 名称
 * @param data - 标签更新参数
 */
export function manageCustomResourceDefinitionLabels(clusterId: string, name: string, data: CustomResourceDefinitionLabelsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/customresourcedefinitions/${name}/labels`, data)
}

/**
 * 更新 CustomResourceDefinition 注解
 * @param clusterId - 集群 ID
 * @param name - CustomResourceDefinition 名称
 * @param data - 注解更新参数
 */
export function manageCustomResourceDefinitionAnnotations(clusterId: string, name: string, data: CustomResourceDefinitionAnnotationsReq) {
  return request.post(`/kubernetes/clusters/${clusterId}/customresourcedefinitions/${name}/annotations`, data)
}

/**
 * 删除 CustomResourceDefinition
 * @param clusterId - 集群 ID
 * @param name - CustomResourceDefinition 名称
 */
export function deleteCustomResourceDefinition(clusterId: string, name: string) {
  return request.delete(`/kubernetes/clusters/${clusterId}/customresourcedefinitions/${name}`)
}

/**
 * 批量删除 CustomResourceDefinition
 * @param clusterId - 集群 ID
 * @param data - 待删除的 CustomResourceDefinition 名称列表
 */
export function deleteCustomResourceDefinitions(clusterId: string, data: { names: string[] }) {
  return request.delete(`/kubernetes/clusters/${clusterId}/customresourcedefinitions`, {
    data
  })
}
