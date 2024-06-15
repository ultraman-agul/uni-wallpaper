<template>
  <view class="classlist">
    <view class="loadingLayout" v-if="!classList.length && !noData">
      <uni-load-more status="loading"></uni-load-more>
    </view>

    <view class="content">
      <navigator
        :url="'/pages/preview/preview?id=' + item.id"
        class="item"
        v-for="item in classList"
        :key="item.id"
      >
        <image :src="item.url" mode="aspectFill" class="image"></image>
      </navigator>
    </view>

    <view class="loadingLayout" v-if="classList.length || noData">
      <uni-load-more :status="noData ? 'noMore' : 'loading'"></uni-load-more>
    </view>

    <view class="safe-area-inset-bottom"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import {
  onLoad,
  onUnload,
  onReachBottom,
  onShareAppMessage,
  onShareTimeline,
} from '@dcloudio/uni-app'

import { apiGetClassList, apiGetHistoryList } from '@/service/index'
import { gotoHome } from '@/utils/common'
// 分类列表数据
const classList = ref([])
const noData = ref(false)

// 定义data参数
const queryParams = {
  pageNum: 1,
  pageSize: 4,
}
let pageName

onLoad((e) => {
  const { id: classifyId, name = null, type = null } = e
  if (type) queryParams.type = type
  if (classifyId) queryParams.classifyId = classifyId

  pageName = name
  // 修改导航标题
  uni.setNavigationBarTitle({
    title: name,
  })
  // 执行获取分类列表方法
  getClassList()
})

onReachBottom(() => {
  if (noData.value) return
  queryParams.pageNum++
  getClassList()
})

// 获取分类列表网络数据
const getClassList = async () => {
  let res
  console.log(queryParams, 'queryParams')
  if (queryParams.classifyId) res = await apiGetClassList(queryParams)
  if (queryParams.type) {
    res = await apiGetHistoryList(queryParams)
    res.data = res.data.map((item) => item.wallpaper)
  }

  classList.value = [...classList.value, ...res.data]
  if (queryParams.pageNum >= res.data.totalPage) noData.value = true
  uni.setStorageSync('storgClassList', classList.value)
  console.log(classList.value)
}

// 分享给好友
onShareAppMessage((e) => {
  return {
    title: '苍穹壁纸-' + pageName,
    path: '/pages/classlist/classlist?id=' + queryParams.classifyId + '&name=' + pageName,
  }
})

// 分享朋友圈
onShareTimeline(() => {
  return {
    title: '苍穹壁纸-' + pageName,
    query: 'id=' + queryParams.classifyId + '&name=' + pageName,
  }
})

onUnload(() => {
  uni.removeStorageSync('storgClassList')
})
</script>

<style lang="scss" scoped>
.classlist {
  .content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5rpx;
    padding: 5rpx;
    .item {
      height: 440rpx;
      .image {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
