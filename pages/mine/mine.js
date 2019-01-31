// 获取应用实例
const app = getApp()

Page({
  data: {
    isMe: true,
    faceUrl: "../resource/images/noneface.png"
  },
  onLoad: function(params) {

  },
  // 退出登陆
  logout: function() {
    var user = app.userInfo;
    let serverUrl = app.serverUrl;

    // 调用后端
    wx.request({
      // 退出登陆
      url: serverUrl + '/logout?userId=' + user.id,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.status == 200) {
          // 退出登录成功跳转 
          wx.showToast({
            title: '注销成功',
            icon: 'success',
            duration: 2000
          });

          // 清空用户信息
          app.userInfo = null;
          // 跳转到登陆页面
          wx.navigateTo({
            url: '../userLogin/login'
          })
        }
      }
    })
  }
})