import { reactive, ref, type Ref } from 'vue'

import type { JobListVo, JobQueryForm } from '@/types/kubernetes/workload/job'

import type { PageEntity } from '@/types'

import { getJobList } from '@/api/kubernetes/workload/job'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 任务列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function useJobFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<JobQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 任务列表数据 */
  const jobs = ref<JobListVo[]>([])

  /**
   * 请求任务列表数据
   */
  async function fetchJobs() {
    if (!clusterUid.value) {
      jobs.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getJobList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      jobs.value = list as JobListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchJobs]', err)
      BeeMessage.error('加载任务列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    jobs,
    // ==================== Fetch Method ====================
    fetchJobs,
  }
}
