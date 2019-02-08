// 我的页面
// 获取应用实例
const app = getApp();

// 视频工具类
const videoUtil = require('../../utils/videoUtils.js');

Page({
  data: {
    userId: '', // 用户id
    faceUrl: "../resource/images/noneface.png", // 头像地址
    isMe: true, // 是否是本人的详情页
    isFollow: false, // 是否关注该用户
    nickname: '', // 昵称


    fansCounts: 0, // 粉丝数
    followCounts: 0, // 关注数
    receiveLikeCounts: 0, // 收到的点赞数

    videoSelClass: "video-info",  // 视频选择器的样式类
    isSelectedWord: "video-info-selected", // 是否选择了自己的作品列表
    isSelectedLike: "", // 是否选择喜欢
    isSelectedFollow: "", // 是否选择订阅

    myVideoList: [], // 我的作品视频列表
    myVideoPage: 1, // 我的作品视频当前页
    myVideoTotal: 1, // 我的作品视频总页数

    likeVideoList: [], // 喜欢的视频列表
    likeVideoPage: 1, // 喜欢的视频当前页
    likeVideoTotal: 1, // 喜欢的视频总页数

    followVideoList: [], // 关注视频列表
    followVideoPage: 1, // 关注视频当前页
    followVideoTotal: 1, // 关注视频总页数

    myWorkFlag: false, // 我的作品标志
    myLikesFlag: true, // 我的喜欢标志
    myFollowFlag: true // 我的关注标志
  },
  // 页面加载时加载用户数据到本地
  onLoad: function (params) {
    const that = this;
    const serverUrl = app.serverUrl;

    // 获取全局用户信息
    const userInfo = app.getGlobalUserInfo();
    let userId = userInfo.id;

    // 发布者id
    const publisherId = params.publisherId;
    if (publisherId) {
      userId = publisherId;

      // 设置发布者并非本人
      that.setData({
        isMe: false,
        publisherId: publisherId,
        serverUrl: serverUrl
      })
    }

    that.setData({
      userId: userId
    });

    wx.showLoading({
      title: '请等待...',
    });

    // 调用后端
    wx.request({
      url: `${serverUrl}/user/query?userId=${userId}&fanId=${userInfo.id}`,
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'headerUserId': userInfo.id,
        'headerUserToken': userInfo.userToken
      },
      success(res) {
        console.log(res.data);

        wx.hideLoading();
        if (res.data.status === 200) {
          const user = res.data.data;

          let faceUrl = "../resource/images/noneface.png";
          if (user.faceImage) {
            faceUrl = serverUrl + user.faceImage
          }

          that.setData({
            faceUrl: faceUrl,
            nickname: user.nickname,
            fansCounts: user.fansCounts,
            followCounts: user.followCounts,
            receiveLikeCounts: user.receiveLikeCounts,
            isFollow: user.follow
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 2000,
            icon: "none",
            success(res) {
              setTimeout(() => {
                wx.redirectTo({
                  url: '../userLogin/login'
                });
              }, 2000);
            }
          })
        }
      }
    });

    // 获取我的视频列表
    that.getMyVideoList(1);
  },
  // 关注该用户
  followMe: function (e) {
    const that = this;

    // 获取全局用户信息
    const userInfo = app.getGlobalUserInfo();
    // 用户id
    const userId = userInfo.id;
    // 发布者id
    const publisherId = that.data.publisherId;

    // 关注类型（1 关注，0 取消关注）
    const followType = e.currentTarget.dataset.followtype;

    let url = '';
    if (followType === '1') {
      url = `/user/beYourFans?userId=${publisherId}&fanId=${userId}`;
    } else {
      url = `/user/dontBeYourFans?userId=${publisherId}&fanId=${userId}`;
    }

    // 显示进度条
    wx.showLoading();

    wx.request({
      url: app.serverUrl + url,
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'headerUserId': userInfo.id,
        'headerUserToken': userInfo.userToken
      },
      success(res) {
        // 隐藏进度条
        wx.hideLoading();

        if (followType === '1') {
          that.setData({
            isFollow: true,
            fansCounts: ++that.data.fansCounts
          });
        } else {
          that.setData({
            isFollow: false,
            fansCounts: --that.data.fansCounts
          })
        }
      }
    })
  },
  // 退出登陆
  logout: function () {
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
        if (res.data.status === 200) {
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
  changeFace: function () {
    const that = this;

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 压缩图片
      sourceType: ['album'], // 从相册中选取
      success(res) {
        // 上传到微信服务器的临时图片数组
        const tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths)

        // 弹出进度条
        wx.showLoading({
          title: '上传中……',
        });

        const serverUrl = app.serverUrl;
        // 获取全局用户信息
        const userInfo = app.getGlobalUserInfo();

        // 上传头像
        wx.uploadFile({
          url: serverUrl + '/user/uploadFace?userId=' + userInfo.id,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'application/json', // 默认值
            'headerUserId': userInfo.id,
            'headerUserToken': userInfo.userToken
          },
          success(res) {
            const data = JSON.parse(res.data);
            console.log(data);

            // 隐藏进度条
            wx.hideLoading();

            if (data.status === 200) {
              wx.showToast({
                title: '上传成功！',
                icon: 'success'
              });

              const imageUrl = data.data;
              // 设置头像到页面
              that.setData({
                faceUrl: serverUrl + imageUrl
              })
            } else if (data.status === 500) {
              wx.showToast({
                title: data.msg
              });
            } else {
              wx.showToast({
                title: res.data.msg,
                duration: 2000,
                icon: "none",
                success: function () {
                  setTimeout(() => {
                    wx.redirectTo({
                      url: '../userLogin/login',
                    })
                  }, 2000);
                }
              });
            }
          }
        })
      }
    })
  },
  // 上传视频
  uploadVideo: function () {
    // 上传视频
    videoUtil.uploadVideo();
  },
  // 选择自己上传的作品的标签
  doSelectWork: function () {
    this.setData({
      isSelectedWork: "video-info-selected",
      isSelectedLike: "",
      isSelectedFollow: "",

      myWorkFalg: false,
      myLikesFalg: true,
      myFollowFalg: true,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1
    });

    // 获取自己上传的视频列表
    this.getMyVideoList(1);
  },
  // 选择收藏的视频标签
  doSelectLike: function () {
    this.setData({
      isSelectedWork: "",
      isSelectedLike: "video-info-selected",
      isSelectedFollow: "",

      myWorkFalg: true,
      myLikesFalg: false,
      myFollowFalg: true,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1
    });

    // 获取收藏的视频列表
    this.getMyLikesList(1);
  },
  // 获取我的视频列表
  getMyVideoList: function (page) {
    const that = this;

    // 显示进度条
    wx.showLoading();

    const serverUrl = app.serverUrl;
    // 获取我的视频列表
    wx.request({
      url: `${serverUrl}/video/showAll?page=${page}&pageSize=6`,
      method: "POST",
      data: {
        userId: that.data.userId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);

        // 隐藏进度条
        wx.hideLoading();

        // 合并新加载的视频与原来的视频列表
        const myVideoList = res.data.data.rows;
        const oldVideoList = that.data.myVideoList;

        that.setData({
          myVideoPage: page,
          myVideoList: oldVideoList.concat(myVideoList),
          myVideoTotal: res.data.data.total,
          serverUrl: serverUrl
        });
      }
    })
  },
  // 获取收藏的视频列表
  getMyLikesList: function (page) {
    const that = this;
    const userId = that.data.userId;

    // 显示进度条
    wx.showLoading();

    const serverUrl = app.serverUrl;
    // 获取收藏的视频列表
    wx.request({
      url: `${serverUrl}/video/showMyLike?userId=${userId}&page=${page}&pageSize=6`,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);

        // 隐藏进度条
        wx.hideLoading();

        // 合并新加载的视频与原来的视频列表
        const likeVideoList = res.data.data.rows;
        const oldVideoList = that.data.likeVideoList;

        that.setData({
          myVideoPage: page,
          myVideoList: oldVideoList.concat(likeVideoList),
          myVideoTotal: res.data.data.total,
          serverUrl: serverUrl
        });
      }
    })
  }
});