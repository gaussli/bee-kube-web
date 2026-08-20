/**
 * ConfigMap 资源相关类型定义
 * @module types/kubernetes/config/configmap/types
 */

/**
 * ConfigMap 实体
 */
export interface ConfigMap {
  /** 是否不可变；为 true 时 data/binaryData 不可更新，仅元数据可改 */
  immutable?: boolean
  /** 配置数据，key 须由字母数字、'-'、'_'、'.' 组成，与 binaryData 的 key 不可重叠 */
  data?: Record<string, string>
  /** 二进制数据，key 规则同 data，value 可为非 UTF-8 字节序列；需 apiserver/kubelet 1.10+ */
  binaryData?: Record<string, string>
}
