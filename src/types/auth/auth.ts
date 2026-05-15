/**
 * @fileOverview 认证相关类型
 */

/**
 * 登录请求参数
 */
export interface LoginReq {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
}

/**
 * 登录响应
 */
export interface LoginResp {
  /** 用户ID */
  id: string
  /** 用户名 */
  username: string
  /** 认证令牌 */
  token: string
}

/**
 * 当前用户信息响应
 */
export interface CurrentUserResp {
  /** 当前用户信息 */
  user: CurrentUser
  /** 菜单树 */
  menus: CurrentMenu[]
  /** 权限标识列表 */
  permissions: string[]
}

/**
 * 当前用户信息
 */
export interface CurrentUser {
  /** 用户ID */
  id: string
  /** 用户名 */
  username: string
  /** 昵称 */
  nickname: string
  /** 邮箱 */
  email?: string
  /** 手机号 */
  mobile?: string
  /** 性别：0未知 1男 2女 */
  gender?: number
  /** 头像ID */
  avatarId?: string
}

/**
 * 当前用户菜单树
 */
export interface CurrentMenu {
  /** 菜单ID */
  id: string
  /** 菜单编码 */
  code: string
  /** 菜单名称 */
  name: string
  /** 图标 */
  icon?: string
  /** 类型：0目录 1菜单 2页面 3按钮 */
  type: number
  /** 子菜单 */
  children?: CurrentMenu[]
}
