// pages/newsong/newsong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    searchType: [{
      "id": 0,
      "name": "推荐"
    },
    {
      "id": 7,
      "name": "华语"
    },
    {
      "id": 96,
      "name": "欧美"
    },
    {
      "id": 16,
      "name": "韩国"
    },
    {
      "id": 8,
      "name": "日本"
    },
    ],
  },

  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },

  swiperChange: function (e) {
    this.setData({
      currentTab: e.detail.current,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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