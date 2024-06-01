<template>
  <view class="userLayout pageBg" v-if="userinfo">
    <view :style="{ height: getNavBarHeight() + 'px' }"></view>
    <view class="userInfo">
      <view class="avatar">
        <!-- <image src="../../static/images/xxmLogo.png" mode="aspectFill"></image> -->
      </view>
      <view class="ip">{{ userinfo.IP }}</view>
      <view class="address">
        来自于：
        {{ userinfo.address.city || userinfo.address.province || userinfo.address.country }}
      </view>
    </view>

    <view class="section">
      <view class="list">
        <navigator url="/pages/classlist/classlist?name=我的下载&type=download" class="row">
          <view class="left">
            <wd-icon name="download" size="22px"></wd-icon>
            <view class="text">我的下载</view>
          </view>
          <view class="right">
            <view class="text">{{ userinfo.downloadSize }}</view>
            <wd-icon name="arrow-right" size="22px"></wd-icon>
          </view>
        </navigator>

        <navigator url="/pages/classlist/classlist?name=我的评分&type=score" class="row">
          <view class="left">
            <wd-icon name="star-on" size="22px"></wd-icon>
            <view class="text">我的评分</view>
          </view>
          <view class="right">
            <view class="text">{{ userinfo.scoreSize }}</view>
            <wd-icon name="arrow-right" size="22px"></wd-icon>
          </view>
        </navigator>

        <view class="row">
          <view class="left">
            <wd-icon name="chat" size="22px"></wd-icon>
            <view class="text">联系客服</view>
          </view>
          <view class="right">
            <view class="text"></view>
            <wd-icon name="arrow-right" size="22px"></wd-icon>
          </view>
          <!-- #ifdef MP -->
          <button open-type="contact">联系客服</button>
          <!-- #endif -->
          <!-- #ifndef MP -->
          <button @click="clickContact">拨打电话</button>
          <!-- #endif -->
        </view>
      </view>
    </view>

    <view class="section">
      <view class="list">
        <navigator url="/pages/notice/detail?id=653507c6466d417a3718e94b" class="row">
          <view class="left">
            <wd-icon name="spool" size="22px"></wd-icon>
            <view class="text">订阅更新</view>
          </view>
          <view class="right">
            <view class="text"></view>
            <wd-icon name="arrow-right" size="22px"></wd-icon>
          </view>
        </navigator>

        <navigator url="/pages/notice/detail?id=6536358ce0ec19c8d67fbe82" class="row">
          <view class="left">
            <wd-icon name="error-fill" size="22px"></wd-icon>
            <view class="text">常见问题</view>
          </view>
          <view class="right">
            <view class="text"></view>
            <wd-icon name="arrow-right" size="22px"></wd-icon>
          </view>
        </navigator>
      </view>
    </view>
  </view>

  <view class="loadingLayout" v-else>
    <view :style="{ height: getNavBarHeight() + 'px' }"></view>
    <uni-load-more status="loading"></uni-load-more>
  </view>
</template>

<script setup>
import { getNavBarHeight } from '@/utils/system'
import { apiUserInfo } from '@/service/index'
import { ref } from 'vue'

const userinfo = ref(null)

const clickContact = () => {
  uni.makePhoneCall({
    phoneNumber: '114',
  })
}

const getUserInfo = () => {
  apiUserInfo().then((res) => {
    console.log(res)
    userinfo.value = res.data
  })
}

getUserInfo()
</script>

<style lang="scss" scoped>
.userLayout {
  .userInfo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50rpx 0;
    .avatar {
      width: 160rpx;
      height: 160rpx;
      overflow: hidden;
      border-radius: 50%;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .ip {
      padding: 20rpx 0 5rpx;
      font-size: 44rpx;
      color: #333;
    }
    .address {
      font-size: 28rpx;
      color: #aaa;
    }
  }

  .section {
    width: 690rpx;
    margin: 50rpx auto;
    border: 1px solid #eee;
    border-radius: 10rpx;
    box-shadow: 0 0 30rpx rgba(0, 0, 0, 0.05);
    .list {
      .row {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100rpx;
        padding: 0 30rpx;
        background: #fff;
        border-bottom: 1px solid #eee;
        &:last-child {
          border-bottom: 0;
        }
        .left {
          display: flex;
          align-items: center;
          :deep() {
            .uni-icons {
              color: $brand-theme-color !important;
            }
          }
          .text {
            padding-left: 20rpx;
            color: #666;
          }
        }
        .right {
          position: absolute;
          top: 50%;
          right: 10rpx;
          display: flex;
          align-items: center;
          transform: translateY(-50%);
          .text {
            font-size: 28rpx;
            color: #aaa;
          }
        }
        button {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100rpx;
          opacity: 0;
        }
      }
    }
  }
}
</style>
