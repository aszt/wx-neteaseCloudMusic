// pages/newsong/newsong.js
var baseUrl = require('../../utils/api.js');
const app = getApp();
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
    // 推荐新音乐
    newsong: [],
    newsongloading: true,
    huayusong: [],
    huayusongloading: true,
    oumeisong: [],
    oumeisongloading: true,
    hanguosong: [],
    hanguosongloading: true,
    ribensong: [],
    ribensongloading: true,
  },

  activeNav: function (e) {
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
    var that = this
    var newsong = that.data.newsong
    var huayusong = that.data.huayusong
    var oumeisong = that.data.oumeisong
    var hanguosong = that.data.hanguosong
    var ribensong = that.data.ribensong
    var current = e.detail.current;
    if (current == 0) {
      if (newsong.length == 0) {
        that.getNewsong();
      }
    } else if (current == 1) {
      if (huayusong.length == 0) {
        that.getHuayusong();
      }
    } else if (current == 2) {
      if (oumeisong.length == 0) {
        that.getOumeisong();
      }
    } else if (current == 3) {
      if (hanguosong.length == 0) {
        that.getHanguosong();
      }
    } else if (current == 4) {
      if (ribensong.length == 0) {
        that.getRibensong();
      }
    }

    this.setData({
      currentTab: e.detail.current,
    })
  },

  /**
   * 推荐新音乐
   */
  getNewsong() {
    let that = this;
    wx.request({
      url: baseUrl + 'personalized/newsong',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 200) {
          // 数据一致性处理（播放项）
          var result = res.data.result
          for (var index in result) {
            var name = result[index].song.album.name
            var picUrl = result[index].song.album.picUrl
            var singerName = result[index].song.artists[0].name
            result[index].al = { name, picUrl }
            result[index].ar = [{ name: singerName }]
            result[index].dt = result[index].song.duration
          }
          that.setData({
            newsong: result,
            newsongloading: false
          })
        }
      }
    })
  },

  getHuayusong() {
    let that = this;
    wx.request({
      url: baseUrl + 'top/song?type=7',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data.data);
        if (res.data.code == 200) {
          var result = res.data.data
          for (var index in result) {
            var name = result[index].album.name
            var picUrl = result[index].album.picUrl
            var singerName = result[index].artists[0].name
            result[index].al = { name, picUrl }
            result[index].ar = [{ name: singerName }]
            result[index].dt = result[index].duration
          }
          that.setData({
            huayusong: result,
            huayusongloading: false
          })
        }
      }
    })
  },

  // 播放音乐
  playMusic: function (e) {
    var audioId = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    let playlist;
    if (type == 0) {
      playlist = this.data.newsong;
    } else if (type == 1) {
      playlist = this.data.huayusong;
    } else if (type == 2) {
      playlist = this.data.oumeisong;
    } else if (type == 3) {
      playlist = this.data.hanguosong;
    } else if (type == 4) {
      playlist = this.data.ribensong;
    }

    // 全局属性设置(所有歌曲，及当前播放歌曲下标)
    app.globalData.list_song = playlist;
    app.globalData.index_song = index;
    wx.navigateTo({
      url: '../player/player?id=' + audioId
    })
  },


  getOumeisong() {
    let that = this;
    wx.request({
      url: baseUrl + 'top/song?type=96',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data.data);
        if (res.data.code == 200) {
          var result = res.data.data
          for (var index in result) {
            var name = result[index].album.name
            var picUrl = result[index].album.picUrl
            var singerName = result[index].artists[0].name
            result[index].al = { name, picUrl }
            result[index].ar = [{ name: singerName }]
            result[index].dt = result[index].duration
          }
          that.setData({
            oumeisong: result,
            oumeisongloading: false
          })
        }
      }
    })
  },

  getHanguosong() {
    let that = this;
    wx.request({
      url: baseUrl + 'top/song?type=16',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data.data);
        if (res.data.code == 200) {
          var result = res.data.data
          for (var index in result) {
            var name = result[index].album.name
            var picUrl = result[index].album.picUrl
            var singerName = result[index].artists[0].name
            result[index].al = { name, picUrl }
            result[index].ar = [{ name: singerName }]
            result[index].dt = result[index].duration
          }
          that.setData({
            hanguosong: result,
            hanguosongloading: false
          })
        }
      }
    })
  },

  getRibensong() {
    let that = this;
    wx.request({
      url: baseUrl + 'top/song?type=8',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data.data);
        if (res.data.code == 200) {
          var result = res.data.data
          for (var index in result) {
            var name = result[index].album.name
            var picUrl = result[index].album.picUrl
            var singerName = result[index].artists[0].name
            result[index].al = { name, picUrl }
            result[index].ar = [{ name: singerName }]
            result[index].dt = result[index].duration
          }
          that.setData({
            ribensong: result,
            ribensongloading: false
          })
        }
      }
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNewsong();
    // this.getHuayusong();
    // this.getOumeisong();
    // this.getHanguosong();
    // this.getRibensong();
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