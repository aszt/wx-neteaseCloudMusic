// pages/mv/mv.js
var baseUrl = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // MV数据信息
        mvDetail: [],
        // MVUrl
        mvUrl: [],
    },

    /**
     * 获取MV数据
     */
    getMvDetail(id) {
        let that = this;
        wx.request({
            url: baseUrl + 'mv/detail?mvid=' + id,
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                // console.log(res);
                if (res.data.code == 200) {
                    that.setData({
                        mvDetail: res.data.data
                    })
                }
            }
        })
    },

    /**
     * 获取MVUrl
     */
    getMvUrl(id) {
        let that = this;
        wx.request({
            url: baseUrl + 'mv/url?id=' + id,
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                // console.log(res);
                if (res.data.code == 200) {
                    that.setData({
                        mvUrl: res.data.data
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let mvId = options.id;
        console.log("MVID:" + mvId);
        // 获取mv数据（播放地址做了防盗链处理，需单独获取[额，可用]）
        this.getMvDetail(mvId);
        // 获取mvUrl
        this.getMvUrl(mvId)
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