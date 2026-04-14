import { request } from "@/utils/request";
import type { LoginReq, LoginResp, CurrentUserResp } from "@/types";

// 用户登录
export function login(data: LoginReq) {
  return request.post<LoginResp>("/auth/login", data);
}

// 用户退出
export function logout() {
  return request.post("/auth/logout");
}

// 获取当前用户信息
export function getCurrentUser() {
  return request.get<CurrentUserResp>("/auth/current");
}
