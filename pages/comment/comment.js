// pages/comment/comment.js
var baseUrl = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 精彩评论
    hotComments: [],
    // 最新评论
    comments: [],
    page: 2,
    id: null,
    // 评论总数
    total: 0,
    loading: true,
    loadingMore: false,
    type: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    // 0-歌单评论，1-歌曲评论
    let type = options.type;
    if (type == 0) {
      this.getPlaylistComment(id);
    }
    if (type == 1) {
      this.getMusicComment(id);
    }
    this.setData({
      type: type,
      id: id
    })
  },

  getPlaylistComment(id) {
    console.log("歌单评论：" + id)
    let that = this;
    wx.request({
      url: baseUrl + 'comment/playlist?id=' + id,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 评论表情与日期需要转换(!!!)
        var data = res.data;
        for (let i in data.hotComments) {
          data.hotComments[i].time = util.formatTimeCommit(data.hotComments[i].time, 2);
          data.hotComments[i].content = util.emoji(data.hotComments[i].content)
          if (data.hotComments[i].beReplied[0]) {
            data.hotComments[i].beReplied[0].content = util.emoji(data.hotComments[i].beReplied[0].content)
          }
        }
        for (let i in data.comments) {
          data.comments[i].time = util.formatTimeCommit(data.comments[i].time, 2);
          data.comments[i].content = util.emoji(data.comments[i].content)
          if (data.comments[i].beReplied[0]) {
            data.comments[i].beReplied[0].content = util.emoji(data.comments[i].beReplied[0].content)
          }
        };
        that.setData({
          hotComments: data.hotComments,
          comments: data.comments,
          total: data.total,
          loading: false
        })

        wx.setNavigationBarTitle({
          title: '评论(' + (data.total || 0) + ")"
        })
      }
    })
  },

  getMusicComment(id) {
    console.log("歌曲评论：" + id)
    let that = this;
    wx.request({
      url: baseUrl + 'comment/music?id=' + id,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 评论表情与日期需要转换(!!!)
        var data = res.data;
        for (let i in data.hotComments) {
          data.hotComments[i].time = util.formatTimeCommit(data.hotComments[i].time, 2);
          data.hotComments[i].content = util.emoji(data.hotComments[i].content)
          if (data.hotComments[i].beReplied[0]) {
            data.hotComments[i].beReplied[0].content = util.emoji(data.hotComments[i].beReplied[0].content)
          }
        }
        for (let i in data.comments) {
          data.comments[i].time = util.formatTimeCommit(data.comments[i].time, 2);
          data.comments[i].content = util.emoji(data.comments[i].content)
          if (data.comments[i].beReplied[0]) {
            data.comments[i].beReplied[0].content = util.emoji(data.comments[i].beReplied[0].content)
          }
        };
        that.setData({
          hotComments: data.hotComments,
          comments: data.comments,
          total: data.total,
          loading: false
        })

        wx.setNavigationBarTitle({
          title: '评论(' + (data.total || 0) + ")"
        })
      }
    })
  },

  loadMore() {
    var that = this;
    var page = that.data.page;
    var id = that.data.id;
    // 显示加载图标
    // wx.showLoading({
    //   title: '加载中',
    // })
    // 页数+1
    // page = page + 1;
    // 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
    var offset = (page - 1) * 20;
    // console.log("偏移量为：" + offset)
    let url = null;
    if (this.data.type == 0) {
      url = baseUrl + 'comment/playlist?id=' + id + "&offset=" + offset
    } else {
      url = baseUrl + 'comment/music?id=' + id + "&offset=" + offset
    }
    wx.request({
      url: url,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 200) {
          // 数据处理
          var data = res.data;
          for (let i in data.comments) {
            data.comments[i].time = util.formatTimeCommit(data.comments[i].time, 2);
            data.comments[i].content = util.emoji(data.comments[i].content)
            if (data.comments[i].beReplied[0]) {
              data.comments[i].beReplied[0].content = util.emoji(data.comments[i].beReplied[0].content)
            }
          };

          // 旧数据
          const oldComments = that.data.comments;
          that.setData({
            // 数据写入
            comments: oldComments.concat(data.comments),
            page: page + 1,
          })
        }
      },
      complete: function () {
        // 隐藏加载框
        // wx.hideLoading();
        that.setData({
          loadingMore: false
        })
      }
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
    this.setData({
      loadingMore: true
    })
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})