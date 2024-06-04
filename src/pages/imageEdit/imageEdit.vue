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

const dataImg = ref('')
function onMessage(e) {
  const data = e.detail.data
  console.log('收到来自web-view的消息: ', data)
  switch (data.action) {
    case 'save':
      dataImg.value = item.data.replace(/^data:image\/\w+;base64,/, '') // API只接受纯Base64编码的数据部分
      getSetting() // 根据base64保存图片
      break
    case 'cancel':
      dataImg.value = ''
      break
  }
}

// 判断是否授权，引导授权
const getSetting = () => {
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

// 转换Base64为本地临时文件
function base64ToTempFilePath(base64Data) {
  return new Promise((resolve, reject) => {
    uni.base64ToTempFile({
      base64Data,
      success: (res) => {
        resolve(res.tempFilePath)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

// 保存图片
async function saveBase64Image() {
  try {
    const tempFilePath = await base64ToTempFilePath(dataImg.value)

    // 保存到相册
    uni.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success() {
        console.log('图片已保存到相册')
      },
      fail() {
        console.log('保存图片到相册失败')
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
