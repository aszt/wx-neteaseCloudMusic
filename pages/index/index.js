var baseUrl = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 轮播图数据
        banner: [],
        // 推荐歌单数据
        personalized: [],
    },

    /**
     * 获取轮播图数据
     */
    getBanner() {
        let that = this;
        wx.request({
            url: baseUrl + 'banner',
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                console.log(res);
                if (res.data.code == 200) {
                    that.setData({
                        banner: res.data.banners
                    })
                }
            }
        })
    },

    /**
     * 获取歌单信息
     */
    getPersonalized() {
        let that = this;
        wx.request({
            url: baseUrl + 'personalized',
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                console.log(res);
                if (res.data.code == 200) {
                    that.setData({
                        personalized: res.data.result
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 1、获取轮播图数据
        this.getBanner();
        // 2、获取歌单数据
        this.getPersonalized();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})