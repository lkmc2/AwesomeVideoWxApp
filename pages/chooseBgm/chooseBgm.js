const app = getApp()

Page({
    data: {
      bgmList: [],
      serverUrl: '',
      poster: '/poster/cover.jpg'
    },
    onLoad: function () {
      const that = this;

      // 弹出进度条
      wx.showLoading({
        title: '请等待…',
      })

      const serverUrl = app.serverUrl;

      // 调用后端
      wx.request({
        url: serverUrl + '/bgm/list',
        method: "POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          // 隐藏进度条
          wx.hideLoading();
          if (res.data.status == 200) {
            const bgmList = res.data.data;

            that.setData({
              bgmList: bgmList,
              serverUrl: serverUrl
            })
          }
        }
      })
    }
})

