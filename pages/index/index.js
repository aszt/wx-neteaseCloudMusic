var baseUrl = require('../../utils/api.js');
var common = require("../../utils/util.js")
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab切换
    currentTab: 1,
    // 轮播图数据
    banner: [],
    // 推荐歌单数据
    personalized: [],
    // 新碟数据
    newest: [],
    // 播放栏处理
    music: {},
    playing: false,
  },

  music_next: function(r) {
    this.setData({
      music: r.music,
      playtype: r.playtype
    })
  },
  music_toggle: function(r) {
    this.setData({
      playing: r.playing
    })
  },

  // tab切换处理
  swichNav: function(e) {

    console.log(e);

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {

      return false;

    } else {

      that.setData({

        currentTab: e.target.dataset.current,

      })

    }

  },

  swiperChange: function(e) {

    console.log(e);

    this.setData({

      currentTab: e.detail.current,

    })


  },

  // 去播放页面
  toplayview: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../player/player?id=' + id,
    })
  },

  // 打开菜单新页面
  openNewView: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id);
    if (id == 0) {
      // 每日推荐
      wx.navigateTo({
        url: '../logs/logs',
      })
    }
    if (id == 1) {
      // 歌单
      wx.navigateTo({
        url: '../logs/logs',
      })
    }
    if (id == 2) {
      // 排行榜
      wx.navigateTo({
        url: '../logs/logs',
      })
    }
    if (id == 3) {
      // 电台
      wx.navigateTo({
        url: '../logs/logs',
      })
    }
    if (id == 4) {
      // 直播
      wx.navigateTo({
        url: '../logs/logs',
      })
    }
  },

  // 打开歌单详情页面
  openSongSheet: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    // console.log("歌单id:" + id);
    wx.navigateTo({
      url: '../songSheet/songSheet?id=' + id,
    })
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
        // console.log(res);
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
        if (res.data.code == 200) {
          let pageData = res.data.result;
          // 播放量四舍五入精确到万
          pageData.forEach(function(item, index) {
            item.playCount = (item.playCount / 10000).toFixed(0)
          })
          that.setData({
            personalized: pageData
          })

        }
      }
    })
  },

  /**
   * 获取新碟信息
   */
  getNewest() {
    let that = this;
    wx.request({
      url: baseUrl + 'album/newest',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        // console.log(res);
        if (res.data.code == 200) {
          that.setData({
            newest: res.data.albums
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
    // 3、获取新碟数据
    this.getNewest();
  },

  // 播放or暂停
  toggleplay: function() {
    common.toggleplay(this, app);
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
    // 处理播放栏
    WxNotificationCenter.addNotification("music", (res) => {
      this.setData({
        music: res.curPlaying,
        playing: res.playing,
        // isShow: res.list_song.length
        isShow: true
        // music: app.globalData.curPlaying,
        // playing: app.globalData.playing,
        // isShow: app.globalData.list_song.length
      });
    }, this)
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