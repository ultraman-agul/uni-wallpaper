<template>
  <view class="preview" v-if="currentInfo">
    <swiper circular :current="currentIndex" @change="swiperChange">
      <swiper-item v-for="(item, index) in classList" :key="item._id">
        <image
          v-if="readImgs.includes(index)"
          @click="maskChange"
          :src="item.picurl"
          mode="aspectFill"
        ></image>
      </swiper-item>
    </swiper>

    <view class="mask" v-if="maskState">
      <!-- #ifndef MP-TOUTIAO -->
      <view class="goBack" @click="goBack" :style="{ top: getStatusBarHeight() + 'px' }">
        <wd-icon name="thin-arrow-left" color="#fff" size="22px"></wd-icon>
      </view>
      <!-- #endif -->

      <view class="count">{{ currentIndex + 1 }} / {{ classList.length }}</view>
      <view class="time">
        <uni-dateformat :date="new Date()" format="hh:mm"></uni-dateformat>
      </view>
      <view class="date">
        <uni-dateformat :date="new Date()" format="MM月dd日"></uni-dateformat>
      </view>
      <view class="footer">
        <view class="box" @click="clickInfo">
          <uni-icons type="info" size="28"></uni-icons>
          <view class="text">信息</view>
        </view>

        <view class="box" @click="clickScore">
          <uni-icons type="star" size="28"></uni-icons>
          <view class="text">{{ currentInfo.score }}分</view>
        </view>

        <view class="box" @click="clickDownload">
          <uni-icons type="download" size="23"></uni-icons>
          <view class="text">下载</view>
        </view>
      </view>
    </view>

    <uni-popup ref="infoPopup" type="bottom">
      <view class="infoPopup">
        <view class="popHeader">
          <view></view>
          <view class="title">壁纸信息</view>
          <view class="close" @click="clickInfoClose">
            <uni-icons type="closeempty" size="18" color="#999"></uni-icons>
          </view>
        </view>
        <scroll-view scroll-y>
          <view class="content">
            <view class="row">
              <view class="label">壁纸ID：</view>
              <text selectable class="value">{{ currentInfo._id }}</text>
            </view>
            <!--
						<view class="row">
							<view class="label">分类：</view>
							<text class="value class">明星美女</text>
						</view>
						 -->
            <view class="row">
              <view class="label">发布者：</view>
              <text class="value">{{ currentInfo.nickname }}</text>
            </view>

            <view class="row">
              <text class="label">评分：</text>
              <view class="value roteBox">
                <uni-rate readonly touchable :value="currentInfo.score" size="16" />
                <text class="score">{{ currentInfo.score }}分</text>
              </view>
            </view>

            <view class="row">
              <text class="label">摘要：</text>
              <view class="value">
                {{ currentInfo.description }}
              </view>
            </view>

            <view class="row">
              <text class="label">标签：</text>
              <view class="value tabs">
                <view class="tab" v-for="tab in currentInfo.tabs" :key="tab">
                  {{ tab }}
                </view>
              </view>
            </view>

            <view class="copyright">
              声明：本图片来用户投稿，非商业使用，用于免费学习交流，如侵犯了您的权益，您可以拷贝壁纸ID举报至平台，邮箱513894357@qq.com，管理将删除侵权壁纸，维护您的权益。
            </view>

            <view class="safe-area-inset-bottom"></view>
          </view>
        </scroll-view>
      </view>
    </uni-popup>

    <uni-popup ref="scorePopup" :is-mask-click="false">
      <view class="scorePopup">
        <view class="popHeader">
          <view></view>
          <view class="title">{{ isScore ? '评分过了~' : '壁纸评分' }}</view>
          <view class="close" @click="clickScoreClose">
            <uni-icons type="closeempty" size="18" color="#999"></uni-icons>
          </view>
        </view>

        <view class="content">
          <uni-rate v-model="userScore" allowHalf :disabled="isScore" disabled-color="#FFCA3E" />
          <text class="text">{{ userScore }}分</text>
        </view>

        <view class="footer">
          <button
            @click="submitScore"
            :disabled="!userScore || isScore"
            type="default"
            size="mini"
            plain
          >
            确认评分
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { getStatusBarHeight } from '@/utils/system'
import { apiGetSetupScore, apiWriteDownload, apiDetailWall } from '@/service/index'
const maskState = ref(true)
const infoPopup = ref(null)
const scorePopup = ref(null)
const userScore = ref(0)
const classList = ref([])
const currentId = ref(null)
const currentIndex = ref(0)
const currentInfo = ref(null)
const isScore = ref(false)
const readImgs = ref([])

const storgClassList = uni.getStorageSync('storgClassList') || []
classList.value = storgClassList.map((item) => {
  return {
    ...item,
    picurl: item.smallPicurl.replace('_small.webp', '.jpg'),
  }
})

onLoad(async (e) => {
  currentId.value = e.id
  if (e.type == 'share') {
    const res = await apiDetailWall({ id: currentId.value })
    classList.value = res.data.map((item) => {
      return {
        ...item,
        picurl: item.smallPicurl.replace('_small.webp', '.jpg'),
      }
    })
  }
  currentIndex.value = classList.value.findIndex((item) => item._id == currentId.value)
  currentInfo.value = classList.value[currentIndex.value]
  readImgsFun()
})

const swiperChange = (e) => {
  currentIndex.value = e.detail.current
  currentInfo.value = classList.value[currentIndex.value]
  readImgsFun()
  console.log(e)
}

console.log(classList.value)

// 点击info弹窗
const clickInfo = () => {
  infoPopup.value.open()
}

// 点击关闭信息弹窗
const clickInfoClose = () => {
  infoPopup.value.close()
}

// 评分弹窗
const clickScore = () => {
  if (currentInfo.value.userScore) {
    isScore.value = true
    userScore.value = currentInfo.value.userScore
  }
  scorePopup.value.open()
}
// 关闭评分框
const clickScoreClose = () => {
  scorePopup.value.close()
  userScore.value = 0
  isScore.value = false
}

// 确认评分
const submitScore = async () => {
  uni.showLoading({
    title: '加载中...',
  })
  const { classid, _id: wallId } = currentInfo.value
  const res = await apiGetSetupScore({
    classid,
    wallId,
    userScore: userScore.value,
  })
  uni.hideLoading()
  if (res.errCode === 0) {
    uni.showToast({
      title: '评分成功',
      icon: 'none',
    })
    classList.value[currentIndex.value].userScore = userScore.value
    uni.setStorageSync('storgClassList', classList.value)
    clickScoreClose()
  }
}

// 遮罩层状态
const maskChange = () => {
  maskState.value = !maskState.value
}

// 返回上一页
const goBack = () => {
  uni.navigateBack({
    success: () => {},
    fail: (err) => {
      uni.reLaunch({
        url: '/pages/index/index',
      })
    },
  })
}

// 点击下载
const clickDownload = async () => {
  // #ifdef H5
  uni.showModal({
    content: '请长按保存壁纸',
    showCancel: false,
  })
  // #endif

  // #ifndef H5
  try {
    uni.showLoading({
      title: '下载中...',
      mask: true,
    })
    const { classid, _id: wallId } = currentInfo.value
    const res = await apiWriteDownload({
      classid,
      wallId,
    })
    if (res.errCode != 0) throw res
    uni.getImageInfo({
      src: currentInfo.value.picurl,
      success: (res) => {
        uni.saveImageToPhotosAlbum({
          filePath: res.path,
          success: (res) => {
            uni.showToast({
              title: '保存成功，请到相册查看',
              icon: 'none',
            })
          },
          fail: (err) => {
            if (err.errMsg == 'saveImageToPhotosAlbum:fail cancel') {
              uni.showToast({
                title: '保存失败，请重新点击下载',
                icon: 'none',
              })
              return
            }
            uni.showModal({
              title: '授权提示',
              content: '需要授权保存相册',
              success: (res) => {
                if (res.confirm) {
                  uni.openSetting({
                    success: (setting) => {
                      console.log(setting)
                      if (setting.authSetting['scope.writePhotosAlbum']) {
                        uni.showToast({
                          title: '获取授权成功',
                          icon: 'none',
                        })
                      } else {
                        uni.showToast({
                          title: '获取权限失败',
                          icon: 'none',
                        })
                      }
                    },
                  })
                }
              },
            })
          },
          complete: () => {
            uni.hideLoading()
          },
        })
      },
    })
  } catch (err) {
    console.log(err)
    uni.hideLoading()
  }
  // #endif
}

// 分享给好友
onShareAppMessage((e) => {
  return {
    title: '咸虾米壁纸',
    path: '/pages/preview/preview?id=' + currentId.value + '&type=share',
  }
})

// 分享朋友圈
onShareTimeline(() => {
  return {
    title: '咸虾米壁纸',
    query: 'id=' + currentId.value + '&type=share',
  }
})

function readImgsFun() {
  readImgs.value.push(
    currentIndex.value <= 0 ? classList.value.length - 1 : currentIndex.value - 1,
    currentIndex.value,
    currentIndex.value >= classList.value.length - 1 ? 0 : currentIndex.value + 1,
  )
  readImgs.value = [...new Set(readImgs.value)]
}
</script>

<style lang="scss" scoped>
.preview {
  position: relative;
  width: 100%;
  height: 100vh;

  swiper {
    width: 100%;
    height: 100%;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .mask {
    & > view {
      position: absolute;
      right: 0;
      left: 0;
      width: fit-content;
      margin: auto;
      color: #fff;
    }

    .goBack {
      top: 0;
      left: 30rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      margin-left: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10rpx);
      border: 1rpx solid rgba(255, 255, 255, 0.3);
      border-radius: 100px;
    }

    .count {
      top: 10vh;
      padding: 8rpx 28rpx;
      font-size: 28rpx;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10rpx);
      border-radius: 40rpx;
    }

    .time {
      top: calc(10vh + 80rpx);
      font-size: 140rpx;
      font-weight: 100;
      line-height: 1em;
      text-shadow: 0 4rpx rgba(0, 0, 0, 0.3);
    }

    .date {
      top: calc(10vh + 230rpx);
      font-size: 34rpx;
      text-shadow: 0 2rpx rgba(0, 0, 0, 0.3);
    }

    .footer {
      bottom: 10vh;
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 65vw;
      height: 120rpx;
      color: #000;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(20rpx);
      border-radius: 120rpx;
      box-shadow: 0 2rpx 0 rgba(0, 0, 0, 0.1);

      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rpx 12rpx;

        .text {
          font-size: 26rpx;
          color: $text-font-color-2;
        }
      }
    }
  }

  .popHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 26rpx;
      color: $text-font-color-2;
    }

    .close {
      padding: 6rpx;
    }
  }

  .infoPopup {
    padding: 30rpx;
    overflow: hidden;
    background: #fff;
    border-radius: 30rpx 30rpx 0 0;

    scroll-view {
      max-height: 60vh;

      .content {
        .row {
          display: flex;
          padding: 16rpx 0;
          font-size: 32rpx;
          line-height: 1.7em;

          .label {
            width: 140rpx;
            font-size: 30rpx;
            color: $text-font-color-3;
            text-align: right;
          }

          .value {
            flex: 1;
            width: 0;
          }

          .roteBox {
            display: flex;
            align-items: center;

            .score {
              padding-left: 10rpx;
              font-size: 26rpx;
              color: $text-font-color-2;
            }
          }

          .tabs {
            display: flex;
            flex-wrap: wrap;

            .tab {
              padding: 10rpx 30rpx;
              margin: 0 10rpx 10rpx 0;
              font-size: 22rpx;
              line-height: 1em;
              color: $brand-theme-color;
              border: 1px solid $brand-theme-color;
              border-radius: 40rpx;
            }
          }

          .class {
            color: $brand-theme-color;
          }
        }

        .copyright {
          padding: 20rpx;
          margin: 20rpx 0;
          font-size: 28rpx;
          line-height: 1.6em;
          color: #666;
          background: #f6f6f6;
          border-radius: 10rpx;
        }
      }
    }
  }

  .scorePopup {
    width: 70vw;
    padding: 30rpx;
    background: #fff;
    border-radius: 30rpx;

    .content {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30rpx 0;

      .text {
        width: 80rpx;
        padding-left: 10rpx;
        font-size: 28rpx;
        line-height: 1em;
        color: #ffca3e;
        text-align: right;
      }
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10rpx 0;
    }
  }
}
</style>
