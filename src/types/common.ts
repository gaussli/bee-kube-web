// 通用类型定义

// 通用响应结构
export interface ApiResult<T = any> {
  code: number;
  message: string;
  data: T;
  requestId: string;
}

// 分页参数
export interface PageReq {
  page: number;
  pageSize: number;
}

// 分页响应
export interface PageResp<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 基础实体
export interface BaseEntity {
  id: string;
  createAt?: string;
  createBy?: string;
  updateAt?: string;
  updateBy?: string;
}
