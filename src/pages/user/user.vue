<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '我的',
  },
}
</route>
<template>
  <view class="userLayout pageBg" v-if="userinfo">
    <!-- #ifndef MP-TOUTIAO -->
    <custom-nav-bar title="我的"></custom-nav-bar>
    <!-- #endif -->
    <view :style="{ height: getNavBarHeight() + 'px' }"></view>
    <view class="userInfo">
      <view class="avatar">
        <image :src="userinfo.pic ?? '../../static/logo.svg'" mode="aspectFill"></image>
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
            <view class="text">
              {{ userinfo.downloadCount }}
            </view>
            <wd-icon name="arrow-right" size="22px"></wd-icon>
          </view>
        </navigator>

        <navigator url="/pages/classlist/classlist?name=我的评分&type=score" class="row">
          <view class="left">
            <wd-icon name="star-on" size="22px"></wd-icon>
            <view class="text">我的评分</view>
          </view>
          <view class="right">
            <view class="text">
              {{ userinfo.scoreCount }}
            </view>
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

    <!-- <view class="section">
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

        <navigator url="" class="row" @click="getUserInfo1">
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
    </view> -->
  </view>

  <view class="loadingLayout" v-else>
    <view :style="{ height: getNavBarHeight() + 'px' }"></view>
    <uni-load-more status="loading"></uni-load-more>
  </view>
</template>

<script setup>
import { getNavBarHeight } from '@/utils/system'
import { apiUserInfo, login } from '@/service/index'
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

uni.login({
  provider: 'weixin',
  success: function (loginRes) {
    console.log('登录成功，code为：' + loginRes.code)
    // 将code发送给后台服务器
    login({ code: loginRes.code })
      .then((res) => {
        console.log(res)
        // getUserInfo1()
      })
      .catch((err) => {
        console.log(err)
      })
  },
})

function getUserInfo1(e) {
  // 获取用户信息
  uni.getUserProfile({
    desc: '获取你的昵称、头像、地区及性别',
    success: (res) => {
      console.log('获取你的昵称、头像', res)
    },
    fail: (err) => {
      console.log('拒绝了', err)
    },
  })
}
// getUserInfo1()

// uni.getProvider({
//   // 类型为oauth，用于获取第三方登录提供商
//   service: 'oauth',
//   success: (res) => {
//     // 输出支持的第三方登录提供商列表
//     console.log(res)
//     if (~res.provider.indexOf('weixin')) {
//       // 发起登录请求，获取临时登录凭证 code
//       uni.login({
//         // 登录提供商，如微信
//         provider: 'weixin',
//         success: (loginRes) => {
//           // 获取用户登录凭证
//           console.log(loginRes)

//           // this.handleLogin(loginRes.code);
//         },
//       })
//     }
//   },
// })
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
