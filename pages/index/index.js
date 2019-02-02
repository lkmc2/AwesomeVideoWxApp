// 首页
const app = getApp()

Page({
  data: {
    screenWidth: 350 // 屏幕宽度
  },
  // 页面加载
  onLoad: function (params) {
    var that = this;

    // 获取系统中的屏幕宽度
    var screenWidth = wx.getSystemInfoSync().screenWidth;
    that.setData({
      screenWidth: screenWidth,
    });
  }
})
