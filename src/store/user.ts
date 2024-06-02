import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiGetUserInfo, getUserIp } from '@/service/index'

const initState = { username: '', avatar: '' }

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<IUserInfo>({ ...initState })

    const getUserInfo = async () => {
      const ipRes = await getUserIp()
      userInfo.value.token = ipRes.data
      const res = await apiGetUserInfo()
      res.data.token = res.data.username
      userInfo.value = res.data
    }

    const setUserInfo = (val: IUserInfo) => {
      userInfo.value = val
    }

    const clearUserInfo = () => {
      userInfo.value = { ...initState }
    }
    // 一般没有reset需求，不需要的可以删除
    const reset = () => {
      userInfo.value = { ...initState }
    }
    const isLogined = computed(() => !!userInfo.value.token)

    return {
      userInfo,
      getUserInfo,
      setUserInfo,
      clearUserInfo,
      isLogined,
      reset,
    }
  },
  {
    persist: true,
  },
)
