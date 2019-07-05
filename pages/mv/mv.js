// pages/mv/mv.js
var baseUrl = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 简介状态
    isOpen: false,
    // MV数据信息
    mvDetail: [],
    // MVUrl
    mvUrl: [],
    // 相关视频
    relatedAllvideo: [],
    // 精彩评论
    hotComments: [],
    // 最新评论
    comments: [],
    // 评论总数
    total: 0
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
   * 获取相关视频
   */
  getRelatedAllvideo(id) {
    let that = this;
    wx.request({
      url: baseUrl + 'related/allvideo?id=' + id,
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        // console.log(res);
        if (res.data.code == 200) {
          that.setData({
            relatedAllvideo: res.data.data
          })
        }
      }
    })
  },

  /**
   * 获取评论
   */
  getComments(id) {
    let that = this;
    wx.request({
      url: baseUrl + 'comment/mv?id=' + id,
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        // console.log(res);
        if (res.data.code == 200) {
          // 评论表情需要转换(!!!)
          var data = res.data;
          for (let i in data.hotComments) {
            data.hotComments[i].time = util.formatTime(data.hotComments[i].time, 2);
            data.hotComments[i].content = util.emoji(data.hotComments[i].content)
            if (data.hotComments[i].beReplied[0]) {
              data.hotComments[i].beReplied[0].content = util.emoji(data.hotComments[i].beReplied[0].content)
            }
          }
          for (let i in data.comments) {
            data.comments[i].time = util.formatTime(data.comments[i].time, 2);
            data.comments[i].content = util.emoji(data.comments[i].content)
            if (data.comments[i].beReplied[0]) {
              data.comments[i].beReplied[0].content = util.emoji(data.comments[i].beReplied[0].content)
            }
          };
          that.setData({
            hotComments: data.hotComments,
            comments: data.comments,
            total: data.total
          })
          console.log(that.data.hotComments);
        }
        
      }
    })
  },

  // 查看或关闭简介
  openOrCloseDesc: function(e) {
    var isOpen = this.data.isOpen
    if (isOpen) {
      isOpen = false;
    } else {
      isOpen = true;
    }
    this.setData({
      isOpen
    })
    console.log(isOpen);
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
    this.getMvUrl(mvId);
    // 获取相关mv
    this.getRelatedAllvideo(mvId);
    // 获取评论
    this.getComments(mvId);
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