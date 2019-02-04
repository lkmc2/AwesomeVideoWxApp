// 视频信息页
const app = getApp();

Page({
    data: {
        cover: "cover", // 对视频进行拉伸
        videoId: "", // 视频id
        src: "", // 视频播放地址
        videoInfo: {}, // 视频信息

        userLikeVideo: false, // 用户视频喜欢该视频

        commentsPage: 1, // 当前评论页面
        commentsTotalPage: 1, // 评论总页数
        commentsList: [], // 评论列表

        placeholder: '说点什么…' // 输入框提示信息
    },
    // 视频播放组件
    videoCtx: {},
    // 页面加载
    onLoad: function (params) {
        const that = this;

        // 创建视频播放组件
        that.videoCtx = wx.createVideoContext('myVideo', that);

        // 获取上一个页面传入的参数
        const videoInfo = JSON.parse(params.videoInfo);

        const height = videoInfo.videoHeight;
        const width = videoInfo.videoWidth;
        let cover = "cover";

        // 当是横屏的视频，不对画面进行裁剪
        if (width >= height) {
            cover = "";
        }

        that.setData({
            videoId: videoInfo.id,
            src: app.serverUrl + videoInfo.videoPath,
            videoInfo: videoInfo,
            cover: cover
        });

        const serverUrl = app.serverUrl;
        // 获取全局用户信息
        const userInfo = app.getGlobalUserInfo();
        // 登陆用户id
        let loginUserId = "";

        if (userInfo) {
            loginUserId = userInfo.id;
        }

        // 调用后端，查询发布者
        wx.request({
            url: serverUrl + '/user/queryPublisher?loginUserId=' + loginUserId + '&videoId=' + videoInfo.id + '&publishUserId=' + videoInfo.userId,
            method: "POST",
            success: function (res) {
                console.log(res.data);

                // 发布者
                const publisher = res.data.data.publisher;
                // 用户是否喜欢该视频
                const userLikeVideo = res.data.data.userLikeVideo;

                that.setData({
                    serverUrl: serverUrl,
                    publisher: publisher,
                    userLikeVideo: userLikeVideo
                })
            }
        });
    },
    // 页面展示时
    onShow: function () {
        const that = this;
        // 启动视频播放
        that.videoCtx.play();
    },
    // 页面隐藏时
    onHide: function () {
        const that = this;
        // 暂停视频播放
        that.videoCtx.pause();
    },
    // 展示搜索页面
    showSearch: function () {
        // 跳转到搜索视频页面
        wx.navigateTo({
            url: '../searchVideo/searchVideo',
        })
    }
});
