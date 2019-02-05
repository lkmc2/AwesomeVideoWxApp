/**
 * 上传视频
 */
function uploadVideo() {
    // 选择视频
    wx.chooseVideo({
        sourceType: ['album', 'camera'], // 最相册或拍摄获取视频
        maxDuration: 11, // 视频最长时间
        camera: 'back', // 调用后置摄像头
        success(res) {
            console.log(res);

            const duration = res.duration; // 播放时长
            const tempHeight = res.height; // 视频宽
            const tempWidth = res.width; // 视频高
            const tempVideoUrl = res.tempFilePath; // 视频临时地址

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
                })
            }
        }
    })
}

module.exports = {
    uploadVideo: uploadVideo
};