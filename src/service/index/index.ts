import { http } from '@/utils/http'

export const getUserIp = () => {
  return http.get<string>('/user/get-ip')
}

interface IUserInfo {
  username: string
  nickName: string
  email: string
  token?: string
}
export const apiGetUserInfo = () => {
  return http.get<IUserInfo>('/user/getUserInfo')
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

// 轮播图
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

// 随机n张壁纸
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

// 获取分类列表
export const apiGetClassify = () => {
  return http.get<IClassifyItem[]>('/classify')
}

export const apiUserInfo = () => {
  return http.get<any>('/user/getUserInfo')
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
// 评分和下载
export const apiGetSetupScore = (params: IScoreDownloadParams) => {
  return http.post<any[]>('/score', params)
}

export const apiDetailWall = ({ id }) => {
  return http.get<any[]>('/wallpaper/find' + id)
}

export const apiGetClassList = (params) => {
  return http.get<any[]>('/wallpaper/classify', params)
}

export const apiGetHistoryList = (params) => {
  return http.get<any[]>('/score/getUserRecordByType', params)
}
