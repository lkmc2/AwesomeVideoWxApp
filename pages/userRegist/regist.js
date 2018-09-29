const app = getApp()

Page({
    data: {
      
    },
    doRegist: (event) => {
      let formObject = event.detail.value;
      let username = formObject.username;
      let password = formObject.password;

      // 简单验证
      if (username.length == 0 || password.length == 0) {
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
            console.log(res.data)
          }
        })
      }
    }
})