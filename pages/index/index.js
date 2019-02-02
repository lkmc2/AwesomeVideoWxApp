// 首页
const app = getApp()

Page({
  data: {
    // 用于分页的属性
    totalPage: 1, // 总页数
    currentPage: 1, // 当前页数
    videoList: [], // 视频列表
    screenWidth: 350, // 屏幕宽度
    serverUrl: '' // 服务器地址
  },
  // 页面加载
  onLoad: function (params) {
    var that = this;

    // 获取系统中的屏幕宽度
    var screenWidth = wx.getSystemInfoSync().screenWidth;
    that.setData({
      screenWidth: screenWidth,
    });

    // 获取当前页数
    const currentPage = that.data.currentPage;
    const serverUrl = app.serverUrl;

    // 显示进度条
    wx.showLoading({
      title: '加载中…'
    })

    // 请求视频分页数据
    wx.request({
      url: serverUrl + '/video/showAll?currentPage=' + currentPage,
      method: 'POST',
      success: function(res) {
        // 隐藏进度条
        wx.hideLoading();

        console.log(res)
      }
    })
  }
})
