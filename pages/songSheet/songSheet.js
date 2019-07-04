var baseUrl = require('../../utils/api.js');
var common = require("../../utils/util.js");
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 歌单详情数据
        playInfo: [],
        // 歌单中SQ音质数据
        privileges: [],
        // 播放栏处理
        music: {},
        playing: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id;
        // let id = 2853229030
        // console.log("歌单id:" + id);
        this.getPlaylistDetail(id);
        this.setData({
            music: app.globalData.curPlaying,
            playing: app.globalData.playing,
        })
    },

    // 去播放页面
    toplayview: function (e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../player/player?id=' + id,
        })
    },

    // 播放or暂停
    toggleplay: function () {
        common.toggleplay(this, app);
    },

    /**
     * 获取歌单详情
     */
    getPlaylistDetail(id) {
        let that = this;
        wx.request({
            url: baseUrl + 'playlist/detail?id=' + id,
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                if (res.data.code === 200) {
                    that.setData({
                        playInfo: res.data.playlist,
                        privileges: res.data.privileges
                    })
                }
            }
        })
    },

    /**
     * 播放音乐
     */
    playMusic: function (e) {
        var that = this;
        // 获取音乐id 108245（爱笑的眼睛）
        var audioId = e.currentTarget.dataset.id;
        const index = e.currentTarget.dataset.index;
        // console.log("音乐id:" + audioId + ",下标：" + index)
        let playlist = this.data.playInfo.tracks;
        // 全局属性设置(所有歌曲，及当前播放歌曲下标)
        app.globalData.list_song = playlist;
        app.globalData.index_song = index;
        wx.navigateTo({
            url: '../player/player?id=' + audioId
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 处理播放栏
        WxNotificationCenter.addNotification("music", (res) => {
            this.setData({
                music: res.curPlaying,
                playing: res.playing,
                isShow: res.list_song.length
            });
        }, this)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})