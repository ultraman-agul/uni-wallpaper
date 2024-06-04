<!-- <route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '图片编辑',
  },
}
</route> -->

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
// 保存图片
async function saveBase64Image() {
  try {
    const base64Data = dataImg.value // base64数据
    const arr = base64Data.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    const filePath = `${wx.env.USER_DATA_PATH}/temp.${mime.split('/')[1]}`
    wx.getFileSystemManager().writeFile({
      filePath,
      data: u8arr,
      encoding: 'binary',
      success: function () {
        console.log('写入成功')
        uni.saveImageToPhotosAlbum({
          filePath,
          success: function () {
            console.log('保存成功')
          },
          fail: function (err) {
            console.log('保存失败', err)
          },
        })
      },
      fail: function (err) {
        console.log('写入失败', err)
      },
    })
  } catch (error) {
    console.error('处理Base64数据出错:', error)
  }
}
</script>

<style lang="scss" scoped>
//
</style>
