<template>
  <view class="layout">
    <view class="navbar">
      <view class="statusBar" :style="{ height: getStatusBarHeight() + 'px' }"></view>
      <view
        class="titleBar"
        :style="{ height: getTitleBarHeight() + 'px', marginLeft: getLeftIconLeft() + 'px' }"
      >
        <view class="title">{{ title }}</view>
        <navigator url="/pages/search/search" class="search">
          <uni-icons class="icon" type="search" color="#888" size="18"></uni-icons>
          <text class="text">搜索</text>
        </navigator>
      </view>
    </view>

    <view class="fill" :style="{ height: getNavBarHeight() + 'px' }"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import {
  getStatusBarHeight,
  getTitleBarHeight,
  getNavBarHeight,
  getLeftIconLeft,
} from '@/utils/system'

defineProps({
  title: {
    type: String,
    default: '壁纸',
  },
})
</script>

<style lang="scss" scoped>
.layout {
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    background: linear-gradient(to bottom, transparent, #fff 400rpx),
      linear-gradient(to right, #beecd8 20%, #f4e2d8);
    .titleBar {
      display: flex;
      align-items: center;
      padding: 0 30rpx;

      .title {
        font-size: 22px;
        font-weight: 700;
        color: $text-font-color-1;
      }
      .search {
        display: flex;
        align-items: center;
        width: 220rpx;
        height: 50rpx;
        margin-left: 30rpx;
        font-size: 28rpx;
        color: #999;
        background: rgba(255, 255, 255, 0.4);
        border: 1px solid #fff;
        border-radius: 60rpx;
        .icon {
          margin-left: 5rpx;
        }
        .text {
          padding-left: 10rpx;
        }
      }
    }
  }
}
</style>
