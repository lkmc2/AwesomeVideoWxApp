// 获取应用实例
const app = getApp()

Page({
  data: {
    isMe: true,
    faceUrl: "../resource/images/noneface.png",
    nickname: '',
    fansCounts: 0,
    followCounts: 0,
    receiveLikeCounts: 0
  },
  // 页面加载时加载用户数据到本地
  onLoad: function() {
    const that = this;
    const serverUrl = app.serverUrl;
    // const user = app.userInfo;

    // 获取全局用户信息
    const userInfo = app.getGlobalUserInfo();

    wx.showLoading({
      title: '请等待...',
    });

    // 调用后端
    wx.request({
      url: serverUrl + '/user/query?userId=' + userInfo.id,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.status == 200) {
          const userInfo = res.data.data;


          let faceUrl = "../resource/images/noneface.png";
          if (userInfo.faceImage) {
            faceUrl = serverUrl + userInfo.faceImage
          }

          that.setData({
            faceUrl: faceUrl,
            nickname: userInfo.nickname,
            fansCounts: userInfo.fansCounts,
            followCounts: userInfo.followCounts,
            receiveLikeCounts: userInfo.receiveLikeCounts
          })
        }
      }
    })
  },
  // 退出登陆
  logout: function() {
    // const user = app.userInfo;
    const serverUrl = app.serverUrl;

    // 获取全局用户信息
    const userInfo = app.getGlobalUserInfo();

    // 调用后端
    wx.request({
      // 退出登陆
      url: serverUrl + '/logout?userId=' + userInfo.id,
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

          // 清空用户信息，移除本地用户信息缓存
          // app.userInfo = null;
          wx.removeStorageSync('userInfo');

          // 跳转到登陆页面
          wx.navigateTo({
            url: '../userLogin/login'
          })
        }
      }
    })
  },
  // 更换头像
  changeFace: function() {
    const that = this;

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 压缩图片
      sourceType: ['album'], // 从相册中选取
      success(res) {
        // 上传到微信服务器的临时图片数组
        const tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths)

        // 弹出进度条
        wx.showLoading({
          title: '上传中……',
        })

        const serverUrl = app.serverUrl;
        // 获取全局用户信息
        const userInfo = app.getGlobalUserInfo();

        // 上传头像
        wx.uploadFile({
          url: serverUrl + '/user/uploadFace?userId=' + userInfo.id,
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            const data = JSON.parse(res.data);

            // 隐藏进度条
            wx.hideLoading();

            if (data.status == 200) {
              wx.showToast({
                title: '上传成功！',
                icon: 'success'
              })

              const imageUrl = data.data;
              // 设置头像到页面
              that.setData({
                faceUrl: serverUrl + imageUrl
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
  },
  // 上传视频
  uploadVideo: function() {
    const that = this;

    // 选择视频
    wx.chooseVideo({
      sourceType: ['album', 'camera'], // 最相册或拍摄获取视频
      maxDuration: 11, // 视频最长时间
      camera: 'back', // 调用后置摄像头
      success(res) {
        console.log(res)

        const duration = res.duration; // 播放时长
        const tempHeight = res.height; // 视频宽
        const tempWidth = res.width; // 视频高
        const tempVideoUrl = res.tempFilePath; // 视频临时地址
        const tempCoverUrl = res.thumbTempFilePath; // 视频封面图

        if (duration > 11) {
          wx.showToast({
            title: '视频长度不能超过10秒…',
            icon: 'none',
            duration: 2500
          })
        } else if (duration < 1) {
          wx.showToast({
            title: '视频长度太短，请上传超过1秒的视频…',
            icon: 'none',
            duration: 2500
          })
        } else {
          // 打开选择bgm背景乐的页面，并携带参数给下一个页面
          wx.navigateTo({
            url: '../chooseBgm/chooseBgm?duration=' + duration
              + '&tempHeight=' + tempHeight
              + '&tempWidth=' + tempWidth
              + '&tempVideoUrl=' + tempVideoUrl
              + '&tempCoverUrl=' + tempCoverUrl
          })
        }
      }
    })
  }
})