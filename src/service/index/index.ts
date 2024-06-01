import { http } from '@/utils/http'
export interface IBannerItem {
  appid: null | string
  createTime: string
  id: number
  picurl: string
  sort: number
  target: string
  updateTime: string
  url: string
}

/** GET 请求 */
export const getBannerList = () => {
  // return http.get<IBannerItem[]>('/banner')
  return http.get<IBannerItem[]>('https://tea.qingnian8.com/api/bizhi/homeBanner')
}

export interface IWallpaperItem {
  classifyId: number | null
  createTime: string
  description: string
  id: number
  name: string
  updateTime: string
  url: string
}

export const apiGetDayRandom = (count: number) => {
  // return http.get<IWallpaperItem[]>('/wallpaper/randomWall', { count })
  return http.get<IWallpaperItem[]>('https://tea.qingnian8.com/api/bizhi/randomWall', { count })
}

export interface IClassifyItem {
  createTime: string
  id: number
  name: string
  picurl: string
  updateTime: string
}

export const apiGetClassify = () => {
  return http.get<IClassifyItem[]>('https://tea.qingnian8.com/api/bizhi/classify')
}

export const apiUserInfo = () => {
  return http.get<any>('https://tea.qingnian8.com/api/bizhi/userInfo')
}

export const apiGetSetupScore = () => {
  return http.get<any[]>('https://tea.qingnian8.com/api/bizhi/setupScore')
}
export const apiWriteDownload = () => {
  return http.get<any[]>('https://tea.qingnian8.com/api/bizhi/downloadWall')
}
export const apiDetailWall = () => {
  return http.get<any[]>('https://tea.qingnian8.com/api/bizhi/detailWall')
}
