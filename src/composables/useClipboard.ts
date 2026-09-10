import { useClipboard as vueUseClipboard } from '@vueuse/core'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 *
 */
export function useClipboard() {
  const { copy: rawCopy, copied, isSupported } = vueUseClipboard({ legacy: true })

  async function copy(text: string) {
    if (!isSupported) {
      BeeMessage.success('当前环境不支持剪贴板复制功能')
    }
    try {
      await rawCopy(text)
      if (copied) {
        BeeMessage.success(`已复制【${text}】到剪贴板`)
      } else {
        BeeMessage.error('复制失败')
      }
    } catch {
      BeeMessage.error('复制失败')
    }
  }

  return { copy }
}
