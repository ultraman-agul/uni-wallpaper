import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserIp } from '@/service/index'

const initState = { nickname: '', avatar: '' }

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<IUserInfo>({ ...initState })

    const getUserInfo = async () => {
      const res = await getUserIp()
      userInfo.value.token = res.data
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
