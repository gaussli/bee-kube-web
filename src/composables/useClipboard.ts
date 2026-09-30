import { useClipboard as vueUseClipboard } from '@vueuse/core'

import { BeeMessage } from '@/components/base/BeeMessage'

/**
 *
 */
export function useClipboard() {
  const { copy: rawCopy, copied, isSupported } = vueUseClipboard({ legacy: true })

  /**
   * 复制文本到剪贴板
   * @param text - 待复制的文本
   * @param silent - 静默模式：成功时不弹出包含复制内容的提示（长文本如 YAML 使用，由调用方自行提示）
   */
  async function copy(text: string, silent = false) {
    if (!isSupported) {
      BeeMessage.success('当前环境不支持剪贴板复制功能')
    }
    try {
      await rawCopy(text)
      if (copied) {
        if (!silent) BeeMessage.success(`已复制【${text}】到剪贴板`)
      } else {
        BeeMessage.error('复制失败')
      }
    } catch {
      BeeMessage.error('复制失败')
    }
  }

  return { copy }
}
