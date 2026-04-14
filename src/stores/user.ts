import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UserInfo, LoginParams } from '@/types'
import { storage } from '@/utils'
import { loginApi } from '@/mock/modules/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>(storage.get('token', '') || '')
  const userInfo = ref<UserInfo | null>(null)

  // 私有方法：设置 Token
  function setToken(newToken: string) {
    token.value = newToken
    storage.set('token', newToken)
  }

  // 私有方法：设置用户信息
  function setUserInfo(info: UserInfo) {
    userInfo.value = info
  }

  // 登录
  async function login(loginData: LoginParams) {
    try {
      const res = await loginApi(loginData)
      if (res.code === 200 && res.data) {
        setToken(res.data.token)
        setUserInfo(res.data.userInfo)
      } else {
        ElMessage.error(res.message)
        throw new Error(res.message)
      }
    } catch (error: any) {
      // 网络异常或业务错误统一处理
      if (!error.message) {
        ElMessage.error('网络异常，请稍后重试')
      }
      throw error
    }
  }

  // 退出登录
  function logout() {
    token.value = ''
    userInfo.value = null
    storage.remove('token')
  }

  // 检查是否已登录
  const isLoggedIn = () => !!token.value

  return {
    token,
    userInfo,
    login,
    logout,
    isLoggedIn
  }
})
