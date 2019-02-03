// 视频信息页
const app = getApp()

Page({
  data: {
    cover: "cover" // 对视频进行拉伸
  },
  // 页面加载
  onLoad: function (params) {
    var that = this;

    
  },
  // 展示搜索页面
  showSearch: function() {
    // 跳转到搜索视频页面
    wx.navigateTo({
      url: '../searchVideo/searchVideo',
    })
  }
})
