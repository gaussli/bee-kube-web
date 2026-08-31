import type { CurrentUserResp, LoginReq, LoginResp } from '@/types/index'

import { request } from '@/utils'

// 用户登录
/**
 *
 * @param data
 */
export function login(data: LoginReq) {
  return request.post<LoginResp>('/auth/login', data)
}

// 用户退出
/**
 *
 */
export function logout() {
  return request.post('/auth/logout')
}

// 获取当前用户信息
/**
 *
 */
export function getCurrentUser() {
  return request.get<CurrentUserResp>('/auth/current')
}
