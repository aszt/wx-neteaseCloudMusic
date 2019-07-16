// pages/rankingList/rankingList.js
var baseUrl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 官方榜
    officialList: [],
    // 推荐榜
    recommendationList: [],
    // 全球榜
    globalList: [],
    // 更多榜单
    moreList: [],
  },

  /**
   * 所有榜单内容摘要
   */
  getToplistDetail() {
    let that = this;
    wx.request({
      url: baseUrl + 'toplist/detail',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 200) {
          var list = res.data.list;
          var officialList = []
          var recommendationList = []
          var globalList = []
          var moreList = []
          for (var index in list) {
            var name = list[index].name
            if (name == "云音乐飙升榜" || name == "云音乐新歌榜" || name == "网易原创歌曲榜" || name == "云音乐热歌榜") {
              officialList.push(list[index])
            }
            else if (name == "江小白YOLO云音乐说唱榜" || name == "说唱TOP榜" || name == "云音乐电音榜" || name == "云音乐ACG音乐榜" || name == "云音乐欧美新歌榜" || name == "抖音排行榜") {
              recommendationList.push(list[index])
            }
            else if (name == "美国Billboard周榜" || name == "UK排行榜周榜" || name == "Beatport全球电子舞曲榜" || name == "日本Oricon周榜" || name == "iTunes榜" || name == "香港电台中文歌曲龙虎榜") {
              globalList.push(list[index])
            } else {
              moreList.push(list[index])
            }
          }
          that.setData({
            officialList,
            recommendationList,
            globalList,
            moreList
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getToplistDetail();
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