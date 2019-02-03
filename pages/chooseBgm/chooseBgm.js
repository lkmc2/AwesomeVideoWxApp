const app = getApp()

Page({
    data: {
      bgmList: [], // 背景乐列表
      serverUrl: '', // 服务器地址
      poster: '/poster/cover.jpg', // 音乐封面
      videoParams: {} // 从mine页面传来的参数
    },
    onLoad: function (params) {
      const that = this;
      // console.log(params);

      // 获取从mine页面传来的参数
      that.setData({
        videoParams: params
      })

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
    },
    // 上传背景乐
    upload: function(e) {
      const that = this;

      // 获取界面上的属性(背景乐id、视频描述)
      const bgmId = e.detail.value.bgmId;
      const desc = e.detail.value.desc;

      const duration = that.data.videoParams.duration; // 播放时长
      const tempHeight = that.data.videoParams.tempHeight; // 视频宽
      const tempWidth = that.data.videoParams.tempWidth; // 视频高
      const tempVideoUrl = that.data.videoParams.tempVideoUrl; // 视频临时地址
      const tempCoverUrl = that.data.videoParams.tempCoverUrl; // 视频封面图

      const serverUrl = app.serverUrl;
      // 获取全局用户信息
      const userInfo = app.getGlobalUserInfo();

      // 上传短视频
      wx.uploadFile({
        url: serverUrl + '/video/upload',
        formData: {
          userId: userInfo.id,
          bgmId: bgmId,
          desc: desc,
          videoSeconds: duration,
          videoWidth: tempHeight,
          videoHeight: tempWidth
        },
        filePath: tempVideoUrl,
        name: 'file',
        success(res) {
          const data = JSON.parse(res.data);
          console.log(res);
          // 隐藏进度条
          wx.hideLoading();

          if (data.status == 200) {
            wx.showToast({
              title: '上传成功！',
              icon: 'success',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  // 返回上一页
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000) //延迟时间
              }
            })
          } else {
            wx.showToast({
              title: data.msg
            })
          } 
        }
      })
    }
})

