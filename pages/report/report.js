// 举报页面
const app = getApp();

Page({
  data: {
    reasonType: '请选择原因', // 举报原因
    reportReasonArray: app.reportReasonArray, // 举报原因数组
    publishUserId: '', // 视频发布者id
    videoId: '' // 视频id
  },
  onLoad: function (params) {
    const that = this;

    // 获取从视频详情页传来的参数
    const publishUserId = params.publishUserId;
    const videoId = params.videoId;

    that.setData({
      publishUserId: publishUserId,
      videoId: videoId
    });
  },
  // 举报原因选择框点击事件
  changeMe: function (e) {
    const that = this;
    
    // 获取用户点击的下标
    const index = e.detail.value;
    // 下标对应的原因类型
    const reasonType = app.reportReasonArray[index];

    that.setData({
      reasonType: reasonType
    });
  },
  // 提交举报
  submitReport: function (e) {
    const that = this;

    // 用户点击的举报原因下标
    const reasonIndex = e.detail.value.reasonIndex;
    // 举报详情说明
    const reasonContent = e.detail.value.reasonContent;

    // 获取全局用户信息
    const userInfo = app.getGlobalUserInfo();
    // 当前用户id
    const currentUserId = userInfo.id;

    if (!reasonIndex) {
      // 未选择举报原因时，进行提示
      wx.showToast({
        title: '请选择举报理由',
        icon: 'icon'
      });
      return;
    }

    const serverUrl = app.serverUrl;

    // 提交举报数据
    wx.request({
      url: serverUrl + '/user/reportUser',
      method: "POST",
      data: {
        dealUserId: that.data.publishUserId, // 被处理的用户id
        dealVideoId: that.data.videoId, // 被处理的视频id
        title: app.reportReasonArray[reasonIndex], // 举报原因
        content: reasonContent, // 举报内容详情
        userId: currentUserId // 当前用户id
      },
      header: {
        'content-type': 'application/json', // 默认值
        'headerUserId': userInfo.id,
        'headerUserToken': userInfo.userToken
      },
      success(res) {
        wx.showToast({
          title: res.data.data,
          duration: 2000,
          icon: "none",
          success(res) {
            setTimeout(function () {
              // 返回上一页
              wx.navigateBack();
            }, 2000);
          }
        })
      }
    })
  }
});
