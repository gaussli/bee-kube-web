/**
 * Secret 资源相关类型定义
 * @module types/kubernetes/config/secret/types
 */
import type { SecretType } from '@/config/kubernetes/config/secret'

/**
 * Secret 实体
 */
export interface Secret {
  /** 是否不可变；为 true 时 data/stringData 不可更新，仅元数据可改 */
  immutable?: boolean
  /** Secret 类型，为空时默认 'Opaque' */
  type?: SecretType
  /** 敏感数据，key 须由字母数字、'-'、'_'、'.' 组成；value 为任意（可能非字符串）数据的 base64 编码，整体序列化后总字节数须小于 MAX_SECRET_SIZE */
  data?: Record<string, string>
  /** 字符串形式的非二进制数据，仅作为写输入字段，写时合并覆盖到 data；读取 API 时永不输出 */
  stringData?: Record<string, string>
}
