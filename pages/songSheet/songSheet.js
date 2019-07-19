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
        loading: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id;
        // type(0-歌单、1-排行榜、2-专辑)
        let type = options.type;
        // let id = 2853229030
        // console.log("歌单id:" + id);
        if (type == 0) {
            this.getPlaylistDetail(id);
        }
        if (type == 1) {
            this.getTopList(id);
        }
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
     * 获取排行榜数据
     */
    getTopList(id) {
        let that = this;
        wx.request({
            url: baseUrl + 'top/list?idx=' + id,
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                if (res.data.code === 200) {
                    that.setData({
                        playInfo: res.data.playlist,
                        privileges: res.data.privileges,
                        loading: false
                    })
                }
            }
        })
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
                        privileges: res.data.privileges,
                        loading: false
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
     * 播放mv
     */
    playMv: function (e) {
        var mvId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../mv/mv?id=' + mvId + "&type=" + 0
        })
    },

    // 歌单评论
    getComment: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../comment/comment?id=' + id + "&type=" + 0
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