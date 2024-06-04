<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <view class="homeLayout pageBg">
    <!-- #ifndef MP-TOUTIAO -->
    <custom-nav-bar title="推荐"></custom-nav-bar>
    <!-- #endif -->
    <view class="banner">
      <swiper
        circular
        indicator-dots
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#fff"
        autoplay
      >
        <swiper-item v-for="item in bannerList" :key="item.id">
          <navigator
            v-if="item.target == 'miniProgram'"
            :url="item.url"
            class="like"
            target="miniProgram"
            :app-id="item.appid"
          >
            <image :src="item.picurl" mode="aspectFill"></image>
          </navigator>

          <navigator v-else :url="`/pages/classlist/classlist?${item.url}`" class="like">
            <image :src="item.picurl" mode="aspectFill"></image>
          </navigator>
        </swiper-item>
      </swiper>
    </view>

    <view class="select">
      <common-title>
        <template #name>每日推荐</template>
        <template #custom>
          <view class="date">
            <uni-icons type="calendar" size="18"></uni-icons>
            <view class="text">
              <uni-dateformat :date="Date.now()" format="dd日"></uni-dateformat>
            </view>
          </view>
        </template>
      </common-title>
      <view class="content">
        <scroll-view scroll-x>
          <view class="box" v-for="item in randomList" :key="item.id" @click="goPreview(item.id)">
            <image :src="item.url" mode="aspectFill"></image>
          </view>
        </scroll-view>
      </view>
    </view>

    <view class="theme">
      <common-title>
        <template #name>专题精选</template>
        <template #custom>
          <navigator url="/pages/classify/classify" open-type="reLaunch" class="more">
            More+
          </navigator>
        </template>
      </common-title>

      <view class="content">
        <theme-item v-for="item in classifyList" :key="item.id" :item="item"></theme-item>
        <theme-item :isMore="true"></theme-item>
      </view>
      <image
        @click="handleOpenImg"
        src="http://img5.adesk.com/66506d35e7bce714fb0d51f2?imageMogr2/thumbnail/!640x480r/gravity/Center/crop/640x480&sign=f022d1c67c23df25461037a09f14e80d&t=665d4b6e"
        mode="scaleToFill"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
import {
  getBannerList,
  IBannerItem,
  apiGetDayRandom,
  IWallpaperItem,
  apiGetClassify,
  IClassifyItem,
} from '@/service/index/index'

defineOptions({
  name: 'Home',
})

// banner轮播图
const bannerList = ref<IBannerItem[]>()
const getBanner = async () => {
  const res = await getBannerList()
  bannerList.value = res.data
}
getBanner()

// 随机壁纸
const randomList = ref<IWallpaperItem[]>()
const getDayRandom = async () => {
  const res = await apiGetDayRandom(2)
  randomList.value = res.data
}
getDayRandom()

// 获取分类列表
const classifyList = ref<IClassifyItem[]>()
const getClassify = async () => {
  const res = await apiGetClassify()
  classifyList.value = res.data
}
getClassify()

// 跳转到预览页面
const goPreview = (id) => {
  uni.setStorageSync('storgClassList', randomList.value)
  uni.navigateTo({
    url: '/pages/preview/preview?id=' + id,
  })
}

const imgEdRef = ref(null)
const handleOpenImg = () => {
  console.log(imgEdRef)
  uni.setStorageSync(
    'url',
    'http://img5.adesk.com/66506d35e7bce714fb0d51f2?imageMogr2/thumbnail/!640x480r/gravity/Center/crop/640x480&sign=f022d1c67c23df25461037a09f14e80d&t=665d4b6e',
  )
  uni.navigateTo({
    url: '/pages/imageEdit/imageEdit',
  })
}
</script>

<style lang="scss">
.homeLayout {
  .banner {
    width: 750rpx;
    padding: 30rpx 0;
    swiper {
      width: 750rpx;
      height: 340rpx;
      &-item {
        width: 100%;
        height: 100%;
        padding: 0 30rpx;
        .like {
          width: 100%;
          height: 100%;
          image {
            width: 100%;
            height: 100%;
            border-radius: 10rpx;
          }
        }
      }
    }
  }
  .notice {
    display: flex;
    width: 690rpx;
    height: 80rpx;
    margin: 0 auto;
    line-height: 80rpx;
    background: #f9f9f9;
    border-radius: 80rpx;
    .left {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 140rpx;
      :deep() {
        .uni-icons {
          color: $brand-theme-color !important;
        }
      }
      .text {
        font-size: 28rpx;
        font-weight: 600;
        color: $brand-theme-color;
      }
    }
    .center {
      flex: 1;
      swiper {
        height: 100%;
        &-item {
          height: 100%;
          overflow: hidden;
          font-size: 30rpx;
          color: #666;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 70rpx;
    }
  }

  .select {
    padding-top: 50rpx;
    .date {
      display: flex;
      align-items: center;
      color: $brand-theme-color;
      :deep() {
        .uni-icons {
          color: $brand-theme-color !important;
        }
      }
      .text {
        margin-left: 5rpx;
      }
    }
    .content {
      width: 720rpx;
      margin-top: 30rpx;
      margin-left: 30rpx;
      scroll-view {
        white-space: nowrap;
        .box {
          display: inline-block;
          width: 200rpx;
          height: 430rpx;
          margin-right: 15rpx;
          image {
            width: 100%;
            height: 100%;
            border-radius: 10rpx;
          }
        }
        .box:last-child {
          margin-right: 30rpx;
        }
      }
    }
  }

  .theme {
    padding: 50rpx 0;
    .more {
      font-size: 32rpx;
      color: #888;
    }
    .content {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15rpx;
      padding: 0 30rpx;
      margin-top: 30rpx;
    }
  }
}
</style>
