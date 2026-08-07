/**
 * Pod Mock API
 * @module mock/kubernetes/pod
 */
import type { PageVo } from '@/types/common'
import type { PodListVo, PodQueryForm } from '@/types/kubernetes/pod'
import { mockPods } from './podData'

/**
 * Pod 路由配置
 * @remarks
 * - GET /kubernetes/clusters/:clusterUid/pods - 获取 Pod 分页列表
 */
export default [
  {
    method: 'get',
    url: '/kubernetes/clusters/:clusterUid/pods',
    handler: (pathParams: Record<string, string>, params: Partial<PodQueryForm>): PageVo<PodListVo> =>
      getPodList(pathParams.clusterUid, params),
  },
]

/**
 * 获取 Pod 分页列表
 * @param _clusterUid - 集群 UID（Mock 中仅作参数保留，不参与过滤）
 * @param params - 查询参数
 * @returns 分页数据
 */
function getPodList(_clusterUid: string, params: Partial<PodQueryForm>): PageVo<PodListVo> {
  const { name, status, page = 1, pageSize = 10 } = params || {}

  let filtered = [...mockPods]
  if (name) {
    filtered = filtered.filter(p => p.name.includes(name))
  }
  if (status) {
    filtered = filtered.filter(p => p.status === status)
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filtered.slice(start, end)
  return { list, total, page, pageSize }
}
