/* eslint-disable @typescript-eslint/no-namespace */
// 分页请求参数
export interface ReqPage {
  pageNum: number
  pageSize: number
}

// 分页响应参数
export interface ResPage<T> {
  list: T[]
  pageNum: number
  pageSize: number
  total: number
  totalPage: number
}

export namespace User {
  export interface IUserInfo {
    username: string
    nickName: string
    email: string
    token?: string
  }
}

export namespace Wallpaper {
  export interface ReqWallpaperParams extends ReqPage {
    name: number
    classifyId: number
    keyword: string
    description: string
  }
}
// 壁纸查询
export interface ReqWallpaperParams extends ReqPage {
  name: number
  classifyId: number
  keyword: string
  description: string
}
