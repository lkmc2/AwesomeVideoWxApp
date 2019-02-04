// 注册页
const app = getApp();

Page({
  data: {},
  doRegist: (event) => {
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
      let serverUrl = app.serverUrl;

      // 请求后台注册接口
      wx.request({
        url: serverUrl + '/register',
        method: "POST",
        data: {
          username,
          password
        },
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          // console.log(res.data)
          let status = res.data.status;

          if (status === 200) {
            wx.showToast({
              title: '用户注册成功',
              icon: 'none',
              duration: 3000
            });

            // app.userInfo = res.data.data;

            // 修改原有的全局对象为本地缓存
            app.setGlobalUserInfo(res.data.data);
          } else if (status === 500) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
  }
});