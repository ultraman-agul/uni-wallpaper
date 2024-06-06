export function compareTimestamp(timestamp) {
  const currentTime = new Date().getTime()
  const timeDiff = currentTime - timestamp

  if (timeDiff < 60000) {
    return '1分钟内'
  } else if (timeDiff < 3600000) {
    return Math.floor(timeDiff / 60000) + '分钟'
  } else if (timeDiff < 86400000) {
    return Math.floor(timeDiff / 3600000) + '小时'
  } else if (timeDiff < 2592000000) {
    return Math.floor(timeDiff / 86400000) + '天'
  } else if (timeDiff < 7776000000) {
    return Math.floor(timeDiff / 2592000000) + '月'
  } else {
    return null
  }
}

export function gotoHome() {
  uni.showModal({
    title: '提示',
    content: '页面有误将返回首页',
    showCancel: false,
    success: (res) => {
      if (res.confirm) {
        uni.reLaunch({
          url: '/pages/index/index',
        })
      }
    },
  })
}

// 检查用户是否允许保存图片，如果不允许则引导授权
export function getSaveImgAuth(fn) {
  uni.getSetting({
    success: (res) => {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        // 如果用户未授权，引导用户授权
        uni.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            // 授权成功后执行保存图片的逻辑
            fn()
          },
          fail() {
            // 用户拒绝授权
            console.log('用户拒绝授权')
          },
        })
      } else {
        // 已经授权，直接保存图片
        fn()
      }
    },
  })
}
