import { ElMessage } from 'element-plus'

export function useClipboard() {
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      ElMessage.success('已复制到剪贴板')
    } catch {
      ElMessage.error('复制失败')
    }
  }

  return { copy }
}
