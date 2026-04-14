import { request } from '@/utils/request'
import type { LoginParams, LoginResponse, UserInfo } from '@/types'

// 用户登录
export function login(data: LoginParams) {
  return request.post<LoginResponse>('/auth/login', data)
}

// 用户退出
export function logout() {
  return request.post('/auth/logout')
}

// 获取用户信息
export function getUserInfo() {
  return request.get<UserInfo>('/user/info')
}

// 更新用户信息
export function updateUserInfo(data: Partial<UserInfo>) {
  return request.put('/user/info', data)
}
