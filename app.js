//app.js
App({
  serverUrl: "http://192.168.199.213:8080",
  userInfo: null,
  // 全局存储用户信息
  setGlobalUserInfo: function (user) {
    wx.setStorageSync('userInfo', user);
  },
  // 获取全局用户信息
  getGlobalUserInfo: function () {
    return wx.getStorageSync('userInfo');
  }
});