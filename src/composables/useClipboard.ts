import { BeeMessage } from '@/components/BeeMessage'

/**
 *
 */
export function useClipboard() {
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      BeeMessage.success(`已复制【${text}】到剪贴板`)
    } catch {
      BeeMessage.error('复制失败')
    }
  }

  return { copy }
}
