// 登陆页
const app = getApp();

Page({
  data: {},

  // 加载时
  onLoad: (params) => {
    let that = this;
    // 获取重定向url
    // let redirectUrl = params.redirectUrl;
    //
    // if (redirectUrl) {
    //   redirectUrl = redirectUrl.replace(/#/g, "?");
    //   redirectUrl = redirectUrl.replace(/@/g, "=");
    //
    //   that.redirectUrl = redirectUrl;
    // }
  },

  // 登陆事件
  doLogin: (event) => {
    let that = this;

    let formObject = event.detail.value;
    let username = formObject.username;
    let password = formObject.password;

    // 简单验证
    if (username.length === 0 || password.length === 0) {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 3000
      })
    } else {
      const serverUrl = app.serverUrl;

      // 显示进度条
      wx.showLoading({
        title: '请等待……',
      });

      // 请求后端登陆
      wx.request({
        url: serverUrl + '/login',
        method: 'POST',
        data: {
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log(res.data);

          // 隐藏进度条
          wx.hideLoading();

          if (res.data.status === 200) {
            // 登陆成功跳转
            wx.showToast({
              title: '登陆成功',
              icon: 'seccess',
              duration: 2000
            });

            // 存储用户信息到本地
            // app.userInfo = res.data.data;

            // 修改原有的全局对象为本地缓存
            app.setGlobalUserInfo(res.data.data);

            // 跳转到我的页面
            wx.redirectTo({
              url: '../mine/mine',
            });

            // const redirectUrl = that.redirectUrl;
            // // 判断是否需要进行重定向
            // if (redirectUrl) {
            //   wx.redirectTo({
            //     url: redirectUrl
            //   });
            // } else {
            //   // 跳转到我的页面
            //   wx.redirectTo({
            //     url: '../mine/mine',
            //   });
            // }
          } else if (res.data.status === 500) {
            // 登陆失败，弹出失败提示框
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
  },

  // 跳转到注册页事件
  goRegistPage: function () {
    wx.redirectTo({
      url: '../userRegist/regist',
    })
  }
});