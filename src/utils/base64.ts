/**
 * Base64 编解码工具
 * @module utils/base64
 * @remarks 用于 Secret 等以 Base64 存储文本的资源：先按 UTF-8 取字节再编解码，
 * 避免 `btoa` / `atob` 直接处理多字节字符时抛错或乱码
 */

/**
 * 将文本编码为 Base64
 * @param text - 待编码文本
 * @returns Base64 字符串
 * @example
 * ```ts
 * encodeBase64('你好')  // '5L2g5aW9'
 * ```
 */
export function encodeBase64(text: string): string {
  let binary = ''
  for (const byte of new TextEncoder().encode(text)) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

/**
 * 将 Base64 解码为文本
 * @description 以严格 UTF-8 方式解码：字节序列不是合法 UTF-8（例如二进制内容）时返回 `undefined`，
 * 便于调用方保留原始 Base64，避免被替换字符破坏原始数据
 * @param base64 - Base64 字符串
 * @returns 解码后的文本；非法 Base64 或内容非 UTF-8 时返回 undefined
 * @example
 * ```ts
 * decodeBase64('5L2g5aW9')  // '你好'
 * decodeBase64('xxxx')      // undefined
 * ```
 */
export function decodeBase64(base64: string): string | undefined {
  try {
    const binary = atob(base64)
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return undefined
  }
}
