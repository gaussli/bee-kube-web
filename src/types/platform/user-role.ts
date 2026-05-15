// 用户角色相关类型

// 用户角色分配请求
export interface UserAssignRoleReq {
  userId: string
  roleIds: string[]
}
