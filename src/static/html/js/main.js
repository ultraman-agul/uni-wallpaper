const locale_zh = {
  Crop: '裁剪',
  DeleteAll: '全部删除',
  Delete: '删除',
  Undo: '撤销',
  Redo: '反撤销',
  Reset: '重置',
  Flip: '镜像',
  Rotate: '旋转',
  Draw: '画',
  Shape: '形状标注',
  Icon: '图标标注',
  Text: '文字标注',
  Mask: '遮罩',
  Filter: '滤镜',
  Bold: '加粗',
  Italic: '斜体',
  Underline: '下划线',
  Left: '左对齐',
  Center: '居中',
  Right: '右对齐',
  Color: '颜色',
  'Text size': '字体大小',
  Custom: '自定义',
  Square: '正方形',
  Apply: '应用',
  Cancel: '取消',
  'Flip X': 'X 轴',
  'Flip Y': 'Y 轴',
  Range: '区间',
  Stroke: '描边',
  Fill: '填充',
  Circle: '圆',
  Triangle: '三角',
  Rectangle: '矩形',
  Free: '曲线',
  Straight: '直线',
  Arrow: '箭头',
  'Arrow-2': '箭头2',
  'Arrow-3': '箭头3',
  'Star-1': '星星1',
  'Star-2': '星星2',
  Polygon: '多边形',
  Location: '定位',
  Heart: '心形',
  Bubble: '气泡',
  'Custom icon': '自定义图标',
  'Load Mask Image': '加载蒙层图片',
  Grayscale: '灰度',
  Blur: '模糊',
  Sharpen: '锐化',
  Emboss: '浮雕',
  'Remove White': '除去白色',
  Distance: '距离',
  Brightness: '亮度',
  Noise: '噪音',
  'Color Filter': '彩色滤镜',
  Sepia: '棕色',
  Sepia2: '棕色2',
  Invert: '负片',
  Pixelate: '像素化',
  Threshold: '阈值',
  Tint: '色调',
  Multiply: '正片叠底',
  Blend: '混合色',
}

window.msgFromUniapp = (appData) => {
  console.log('msgFromUniapp')
  initEditor(appData)
}

window.addEventListener('message', function (event) {
  // const base64Data = event.data.data
  // initEditor(base64Data)
  // 处理接收到的base64数据
  // console.log('收到来自小程序的base64数据：', base64Data)
})

function UniAppJSBridgeFunc() {
  document.querySelector('.cancelReturn').onclick = () => {
    console.log('cancelReturn click')
    uni.postMessage({
      data: {
        action: 'cancel',
      },
    })
    uni.webView.switchTab({
      // 跳转到首页
      url: '/pages/index/index',
      success: (res) => {
        console.log('success')
      },
      fail: () => {
        console.log('fail')
      },
      complete: () => {
        console.log('complete')
      },
    })
  }

  document.querySelector('.saveBtn').onclick = () => {
    console.log('saveBtn click')
    const base64Data = imageEditor.toDataURL()
    uni.postMessage({
      data: {
        action: 'save',
        data: base64Data,
      },
    })
    // uni.webView.navigateTo({
    uni.webView.switchTab({
      // 跳转到首页
      url: '/pages/index/index',
      success: (res) => {
        console.log('success')
      },
      fail: () => {
        console.log('fail')
      },
      complete: () => {
        console.log('complete')
      },
    })
  }
}

let imageEditor

function initEditor(base64) {
  console.log('initEditor')
  // Image editor
  imageEditor = new tui.ImageEditor('#tui-image-editor-container', {
    includeUI: {
      loadImage: {
        path: base64,
        name: 'SampleImage',
      },
      theme: blackTheme, // or whiteTheme
      initMenu: 'draw',
      menu: [
        'crop', // 裁切
        // "flip", // 翻转
        'rotate', // 旋转
        'draw', // 添加绘画
        'shape', // 添加形状
        // "icon", // 添加图标
        'text', // 添加文本
        // "mask", // 添加覆盖
      ],
      menuBarPosition: 'bottom',
      locale: locale_zh,
      // theme: customTheme, //定义的样式
    },
    cssMaxWidth: 700,
    cssMaxHeight: 500,
    usageStatistics: false,
  })

  document.querySelector('.btn').style.visibility = 'visible'

  window.onresize = function () {
    imageEditor.ui.resizeEditor()
  }
}

function getImgBase64(url) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const image = new Image()
  image.setAttribute('crossOrigin', 'anonymous')
  image.src = url
  image.onload = function () {
    canvas.width = image.width
    canvas.height = image.height
    context.drawImage(image, 0, 0, image.width, image.height)
    const base64Data = canvas.toDataURL()
    console.log('图片的base64编码：', base64Data)
    initEditor(base64Data)
  }
}

// 获取url的参数
function getUrlParam() {
  return window.location.href.split('url=')[1]
}

document.addEventListener('UniAppJSBridgeReady', function () {
  console.log('初始化uniapp的API成功')
  UniAppJSBridgeFunc()
  const url = getUrlParam()
  getImgBase64(url) // 获取到base64编码后，调用初始化编辑器
})
