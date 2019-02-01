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
  },
  // 更换头像
  changeFace: function() {
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

        let serverUrl = app.serverUrl;

        // 上传图片
        wx.uploadFile({
          url: serverUrl + '/user/uploadFace?userId=' + app.userInfo.id,
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            var data = JSON.parse(res.data);

            // 隐藏进度条
            wx.hideLoading();

            if (data.status == 200) {
              wx.showToast({
                title: '上传成功！',
                icon: 'success'
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
  }
})