<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '创作',
  },
}
</route>

<template>
  <view class="">
    <!-- <web-view src="/static/html/index.html"></web-view> -->
    <web-view
      @message="onMessage"
      id="webView"
      :src="`http://127.0.0.1:8080?url=${url}`"
    ></web-view>
  </view>
</template>

<script lang="ts" setup>
const url = ref('https://n.sinaimg.cn/front/413/w1600h1213/20190115/cI63-hrsecha8755357.jpg')

onLoad((e) => {
  url.value = decodeURIComponent(e.url)
  console.log(url.value)
})
const dataImg = ref('')
function onMessage(e) {
  const data = e.detail.data[0]
  console.log('收到来自web-view的消息: ', data)
  switch (data.action) {
    case 'save':
      dataImg.value = data.data
      getSetting() // 根据base64保存图片
      break
    case 'cancel':
      dataImg.value = ''
      break
  }
}

// 保存base64图片
const saveBase64Image = () => {
  console.log('saveBase64Image')
  const timestamp = new Date().getTime()
  const base64 = dataImg.value.replace(/^data:image\/\w+;base64,/, '') // 去掉data:image/png;base64,
  const filePath = wx.env.USER_DATA_PATH + `/editImg_${timestamp}.png`
  uni.showLoading({
    title: '保存中',
    mask: true,
  })
  uni.getFileSystemManager().writeFile({
    filePath, // 创建一个临时文件名
    data: base64, // 写入的文本或二进制数据
    encoding: 'base64', // 写入当前文件的字符编码
    success: (res) => {
      console.log(res, '成功')

      uni.saveImageToPhotosAlbum({
        filePath,
        success: function () {
          uni.hideLoading()
          uni.showToast({
            title: '保存成功，请到相册查看',
            icon: 'none',
          })
        },
        fail: function (err) {
          console.log(err, '失败')
          uni.hideLoading()
          console.log(err.errMsg)
          uni.showToast({
            title: '保存失败',
            icon: 'none',
          })
        },
      })
    },
    fail: (err) => {
      uni.hideLoading()
      console.log(err)
      uni.showToast({
        title: '创建文件失败',
        icon: 'none',
      })
    },
  })
}

// 判断是否授权，引导授权
const getSetting = () => {
  console.log('getSetting')
  uni.getSetting({
    success: (res) => {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        // 如果用户未授权，引导用户授权
        uni.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            // 授权成功后执行保存图片的逻辑
            saveBase64Image()
          },
          fail() {
            // 用户拒绝授权
            console.log('用户拒绝授权')
          },
        })
      } else {
        // 已经授权，直接保存图片
        saveBase64Image()
      }
    },
  })
}
</script>

<style lang="scss" scoped>
//
</style>
