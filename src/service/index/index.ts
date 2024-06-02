import { http } from '@/utils/http'

export const getUserIp = () => {
  return http.get<string>('/user/get-ip')
}
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
  return http.get<IBannerItem[]>('/banner')
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
  return http.get<IWallpaperItem[]>('/wallpaper/randomWall', { count })
}

export interface IClassifyItem {
  createTime: string
  id: number
  name: string
  picurl: string
  updateTime: string
}

export const apiGetClassify = () => {
  return http.get<IClassifyItem[]>('/classify')
}

export const apiUserInfo = () => {
  return http.get<any>('https://tea.qingnian8.com/api/bizhi/userInfo')
}

enum Type {
  Download = 'download',
  Score = 'score',
}
interface IScoreDownloadParams {
  score: number | null
  type: Type
  wallpaperId: string
}
export const apiGetSetupScore = (params: IScoreDownloadParams) => {
  return http.post<any[]>('/score', params)
}
export const apiWriteDownload = () => {
  return http.get<any[]>('https://tea.qingnian8.com/api/bizhi/downloadWall')
}
export const apiDetailWall = ({ id }) => {
  return http.get<any[]>('/wallpaper/find' + id)
}

export const apiGetClassList = (params) => {
  return http.get<any[]>('/wallpaper/classify', params)
}

export const apiGetHistoryList = (params) => {
  return http.get<any[]>('https://tea.qingnian8.com/api/bizhi/userWallList', params)
}
