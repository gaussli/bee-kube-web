import { reactive, ref, type Ref } from 'vue'

import type { CronJobListVo, CronJobQueryForm } from '@/types/kubernetes/workload/cronjob'

import type { PageEntity } from '@/types'

import { getCronJobList } from '@/api/kubernetes/workload/cronjob'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 * 定时任务列表数据组合式函数
 * @param clusterUid
 * @param tableLoading
 */
export function useCronJobFetch(clusterUid: Ref<string>, tableLoading: Ref<boolean>) {
  /** 查询条件 */
  const queryForm = reactive<Partial<CronJobQueryForm>>({})
  /** 分页数据 */
  const pageData = reactive<PageEntity>({ page: 1, pageSize: 10, total: 0 })
  /** 定时任务列表数据 */
  const cronJobs = ref<CronJobListVo[]>([])

  /**
   * 请求定时任务列表数据
   */
  async function fetchCronJobs() {
    if (!clusterUid.value) {
      cronJobs.value = []
      return
    }
    tableLoading.value = true
    try {
      const { list, total } = await getCronJobList(clusterUid.value, {
        ...queryForm,
        page: pageData.page,
        pageSize: pageData.pageSize,
      })
      cronJobs.value = list as CronJobListVo[]
      pageData.total = total
    } catch (err) {
      console.error('[fetchCronJobs]', err)
      BeeMessage.error('加载定时任务列表失败')
    } finally {
      tableLoading.value = false
    }
  }

  return {
    // ==================== Reactive State ====================
    queryForm,
    pageData,
    cronJobs,
    // ==================== Fetch Method ====================
    fetchCronJobs,
  }
}
