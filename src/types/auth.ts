// 认证相关类型

// 登录请求参数
export interface LoginReq {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResp {
  id: string;
  username: string;
  token: string;
}

// 当前用户信息响应
export interface CurrentUserResp {
  user: CurrentUser;
  menus: CurrentMenu[];
  permissions: string[];
}

// 当前用户信息
export interface CurrentUser {
  id: string;
  username: string;
  nickname: string;
  email?: string;
  mobile?: string;
  gender?: number;
  avatarId?: string;
}

// 当前用户菜单树
export interface CurrentMenu {
  id: string;
  code: string;
  name: string;
  parentId?: string;
  frontPath?: string;
  frontComponent?: string;
  frontIcon?: string;
  permission?: string;
  type: number;
  children?: CurrentMenu[];
}
