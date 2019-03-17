//app.js
App({
  serverUrl: "http://127.0.0.1:8080",
  userInfo: null,
  // 全局存储用户信息
  setGlobalUserInfo: function (user) {
    wx.setStorageSync('userInfo', user);
  },
  // 获取全局用户信息
  getGlobalUserInfo: function () {
    return wx.getStorageSync('userInfo');
  },
  // 举报原因数组
  reportReasonArray: [
    "色情低俗",
    "政治敏感",
    "涉嫌诈骗",
    "辱骂谩骂",
    "广告垃圾",
    "诱导分享",
    "引人不适",
    "过于暴力",
    "违法违纪",
    "其它原因"
  ]
});