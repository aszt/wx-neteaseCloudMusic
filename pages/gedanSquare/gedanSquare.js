// pages/gedanSquare/gedanSquare.js
var baseUrl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateisShow: false,
    loading: true,
    catelist: {
      res: {},
      checked: {
        "name": "全部歌单"
      }
    },
    playlist: {
      loading: true,
      list: {},
      offset: 0,
      limit: 30
    },
  },

  // 打开歌单详情
  openSongSheet: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../songSheet/songSheet?id=' + id + "&type=0",
    })
  },

  // open or close 选择分类
  togglePtype: function () {
    this.setData({
      cateisShow: !this.data.cateisShow
    })
  },

  // 歌单选择
  cateselect: function (e) {
    var t = e.currentTarget.dataset.catype;
    this.data.catelist.checked = t
    this.setData({
      playlist: {
        list: {},
        offset: 0,
        limit: 30
      },
      loading: true,
      cateisShow: !this.data.cateisShow,
      catelist: this.data.catelist
    });
    this.gplaylist();
  },

  // 全部歌单
  gplaylist: function (isadd) {
    //分类歌单列表
    var that = this;
    // console.log(that.data.catelist.checked.name)
    wx.request({
      url: baseUrl + 'top/playlist',
      data: {
        limit: that.data.playlist.limit,
        offset: that.data.playlist.offset,
        cat: that.data.catelist.checked.name
      },
      complete: function (res) {
        // console.log(res)
        that.data.playlist.loading = true;
        if (!isadd) {
          that.data.playlist.list = res.data
        } else {
          res.data.playlists = that.data.playlist.list.playlists.concat(res.data.playlists);
          that.data.playlist.list = res.data
        }
        that.data.playlist.offset += res.data.playlists.length;
        that.setData({
          loading: false,
          playlist: that.data.playlist
        })
      }
    })
  },

  init: function () {
    var that = this
    wx.request({
      url: baseUrl + 'playlist/catlist',
      complete: function (res) {
        that.setData({
          catelist: {
            isShow: false,
            res: res.data,
            checked: res.data.all
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gplaylist();
    this.init();
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
    this.gplaylist(1);//更多歌单
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})