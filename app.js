const util = require('utils/util.js');
App({
    onLaunch: function() {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                }
            })
            // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },

    // 背景音频播放
    playAudio: function(that) {
        const { curPlaying, backgroundAudioManager } = this.globalData;
        backgroundAudioManager.title = curPlaying.name;
        // backgroundAudioManager.desc = "描述";
        backgroundAudioManager.singer = curPlaying.ar[0].name;
        backgroundAudioManager.coverImgUrl = curPlaying.al.picUrl;
        backgroundAudioManager.src = curPlaying.url;
        // 设置全局播放状态
        this.globalData.playing = true;
        // 设置页面播放状态
        that.setData({
            playing: true,
            list_song: this.globalData.list_song
        });

        // 背景音频进入可以播放状态，但不保证后面可以流畅播放
        backgroundAudioManager.onCanplay(() => {
                backgroundAudioManager.play();
            })
            // 背景音频播放事件
        backgroundAudioManager.onPlay(() => {
            this.globalData.playing = true;
            that.setData({
                playing: true,
                list_song: this.globalData.list_song
            });
        });
        // 背景音频暂停事件
        backgroundAudioManager.onPause(() => {
            this.globalData.playing = false;
            that.setData({
                playing: false,
                list_song: this.globalData.list_song
            });

        });
    },

    // 跳转到音频指定位置
    seekAudio: function(position, that, cb) {
        const { curPlaying, backgroundAudioManager } = this.globalData;
        // seek在暂停状态下无法改变currentTime，需要先play后pause
        const pauseStatus = this.globalData.backgroundAudioManager.paused; // 是否处于暂停状态
        if (pauseStatus) {
            backgroundAudioManager.play();
        }
        wx.seekBackgroundAudio({
            position: Math.floor(position / 1000), // 单位秒【此处的position是毫秒】
            success: () => {
                that.setData({
                    currentTime: util.formatTime(position),
                    sliderValue: position,
                });
                // 如果跳转前是暂停的，成功后设置成暂停
                if (pauseStatus) {
                    backgroundAudioManager.pause();
                }
                cb && cb();
            }
        });
    },

    // 初始化配置
    globalData: {
        list_song: [], // 歌曲播放列表
        index_song: 0, // 当前播放歌曲在播放列表中的index
        curPlaying: {}, // 当前播放歌曲
        currentTime: '00:00', // 当前歌曲播放到什么时间
        playMode: 1, // 播放类型 【1 列表循环  2 单曲循环  3 随机播放】
        playing: false, // 是否正在播放
        backgroundAudioManager: wx.getBackgroundAudioManager(),
    }
})