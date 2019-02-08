// 首页
const app = getApp();

Page({
  data: {
    // 用于分页的属性
    totalPage: 1, // 总页数
    currentPage: 1, // 当前页数
    videoList: [], // 视频列表

    screenWidth: 350, // 屏幕宽度
    serverUrl: '', // 服务器地址

    searchContent: '' // 搜索的内容
  },
  // 页面加载
  onLoad: function (params) {
    const that = this;

    // 获取系统中的屏幕宽度
    const screenWidth = wx.getSystemInfoSync().screenWidth;
    that.setData({
      screenWidth: screenWidth,
    });

    // 搜索内容
    let searchContent = params.search;
    // 是否保存记录
    let isSaveRecord = params.isSaveRecord;
    if (!searchContent) {
      searchContent = '';
    }
    if (!isSaveRecord) {
      isSaveRecord = 0;
    }

    that.setData({
      searchContent: searchContent
    });

    // 获取当前页数
    const currentPage = that.data.currentPage;
    // 获取所有视频列表分页信息
    that.getAllVideoList(currentPage, isSaveRecord);
  },
  // 获取所有视频列表分页信息
  getAllVideoList: function (currentPage, isSaveRecond) {
    var that = this;
    const serverUrl = app.serverUrl;

    // 显示进度条
    wx.showLoading({
      title: '加载中…'
    });

    // 获取搜索内容
    const searchContent = that.data.searchContent;

    // 请求视频分页数据
    wx.request({
      url: `${serverUrl}/video/showAll?currentPage=${currentPage}&isSaveRecord=${isSaveRecond}`,
      method: 'POST',
      data: {
        videoDesc: searchContent
      },
      success: function (res) {
        // 隐藏进度条
        wx.hideLoading();
        // 隐藏导航条加载动画
        wx.hideNavigationBarLoading();
        // 停止页面下拉刷新
        wx.stopPullDownRefresh();

        console.log(res);

        // 判断当前页currentPage是否是第一页，如果是第一页，那么设置videoList为空
        if (currentPage === 1) {
          that.setData({
            videoList: []
          });
        }

        // 加载新数据

        // 新视频列表数据
        const videoList = res.data.data.rows;
        // 原视频列表数据
        const oldVideoList = that.data.videoList;

        that.setData({
          videoList: oldVideoList.concat(videoList),
          currentPage: currentPage,
          totalPage: res.data.data.total,
          serverUrl: serverUrl
        });
      }
    })
  },
  // 滑动到页面顶部（下拉刷新）
  onPullDownRefresh: function () {
    // 在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    // 请求第一页的数据
    this.getAllVideoList(1, 0);
  },
  // 滑动到页面底部（上拉刷新）
  onReachBottom: function () {
    const that = this;
    // 当前页数
    let currentPage = that.data.currentPage;
    // 视频总页数
    const totalPage = that.data.totalPage;

    // 判断当前页数和总页数是否相等，如果相等则无需刷新
    if (currentPage === totalPage) {
      wx.showToast({
        title: '已经没有视频啦~~',
        icon: 'none'
      });
      return;
    }

    // 获取所有视频列表分页信息
    that.getAllVideoList(currentPage + 1, 0);
  },
  // 展示视频详情信息
  showVideoInfo: function (e) {
    const that = this;

    const videoList = that.data.videoList;
    const arrIndex = e.target.dataset.arrindex;
    // 将被点击的视频转换成字符串格式的json
    const videoInfo = JSON.stringify(videoList[arrIndex]);

    wx.navigateTo({
      url: '../videoinfo/videoinfo?videoInfo=' + videoInfo
    })
  }
});
