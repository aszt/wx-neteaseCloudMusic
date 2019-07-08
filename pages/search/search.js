// pages/search/search.js
var baseUrl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: "",
    loading: false,
    searchHotDetail: []
  },

  // 输入框事件
  inputext: function (e) {
    var name = e.detail.value;
    // console.log(name)
    this.setData({ value: name });
  },

  // 搜索事件
  searhFinput: function (e) {
    // console.log(e.detail.value.name)
  },

  clear_kw: function () {
    this.setData({
      value: "",
      loading: false,
    })
  },

  /**
   * 获取热搜榜
   */
  getSearchHotDetail() {
    let that = this;
    wx.request({
      url: baseUrl + 'search/hot/detail',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 200) {
          that.setData({
            searchHotDetail: res.data.data
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1、获取热搜榜
    this.getSearchHotDetail();
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