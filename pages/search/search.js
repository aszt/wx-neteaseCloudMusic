// pages/search/search.js
var baseUrl = require('../../utils/api.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索值
    searchKey: "",
    // 热搜榜
    searchHotDetail: [],
    // 搜索历史
    history: [],
    // 搜索建议
    searchsuggest: [],
    // 搜索结果(可能分多类型)
    searchresult: [],
    // 历史及热搜
    showView: true,
    // 搜索建议
    showSuggest: false,
    // 搜索结果列表
    showResult: false,
    // 被点击的导航索引
    currentTab: 0,
    // 搜索类型
    searchType: [
      {
        "id": 1,
        "name": "单曲"
      },
      {
        "id": 1014,
        "name": "视频"
      },
      {
        "id": 100,
        "name": "歌手"
      },
      {
        "id": 10,
        "name": "专辑"
      },
      {
        "id": 1000,
        "name": "歌单"
      },
      {
        "id": 1009,
        "name": "主播电台"
      },
      {
        "id": 1002,
        "name": "用户"
      }
    ],
    // 单曲列表(数据格式不同，我擦咧)
    singleList: [],
    js:
    {
      "id": null,
      "name": null,
      "al": {
        "name": null,
      },
      "ar": [],
      "mvid": null
    },
    js2:
    {
      "name": null,
    },
    // 单曲页数(加载更多使用参数)
    singlePage: 2,
  },

  // tab切换处理
  activeNav(e) {
    // console.log(e);
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
    // console.log(e);
    this.setData({
      currentTab: e.detail.current,
    })
  },

  // 播放音乐
  playMusic: function (e) {
    var that = this;
    // 获取音乐id 108245（爱笑的眼睛）
    var audioId = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    // console.log("音乐id:" + audioId + ",下标：" + index)
    let playlist = this.data.singleList;
    // 全局属性设置(所有歌曲，及当前播放歌曲下标)
    app.globalData.list_song = playlist;
    app.globalData.index_song = index;
    wx.navigateTo({
      url: '../player/player?id=' + audioId
    })
  },

  // 播放mv
  playMv: function (e) {
    var mvId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../mv/mv?id=' + mvId + "&type=" + 0
    })
  },

  // 输入框实时监测
  inputext: function (e) {
    let that = this;
    var value = e.detail.value;
    console.log(value)
    that.setData({
      searchKey: value
    });

    // 组件隐藏，发送搜索建议
    if (value != '') {
      that.setData({
        showSuggest: true
      })
      // 发送搜索建议
      that.searchSuggest();
    } else {

    }
  },

  // 搜索建议
  searchSuggest() {
    let that = this;
    wx.request({
      url: baseUrl + 'search/suggest?keywords=' + this.data.searchKey + "&type=mobile",
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // console.log(res)
        if (res.data.code == 200) {
          that.setData({
            searchsuggest: res.data.result.allMatch
          })
        }
      }
    })
  },

  // input失去焦点(待改)
  routeSearchResPage: function (e) {
    var value = e.detail.value
    if (value != '') {
      let history = wx.getStorageSync("history") || [];
      history.push(this.data.searchKey)
      wx.setStorageSync("history", history);
    }
    this.setData({
      showSuggest: false
    })

  },

  // 选中搜索建议
  chooseKey: function (e) {
    var key = e.currentTarget.dataset.key;
    this.setData({
      showSuggest: false,
      searchKey: key
    })
    // 去搜索
  },

  // 搜索事件
  searhFinput: function (e) {
    // 输入框值
    var searchValue = e.detail.value.name;
    console.log(searchValue)
    const that = this;
    wx.request({
      url: baseUrl + 'search?keywords=' + searchValue + "&type=1",
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // console.log(res);
        if (res.data.code == 200) {
          var js = that.data.js
          var js2 = that.data.js2
          var singleList = that.data.singleList
          var songs = res.data.result.songs;
          // 数据一致性处理
          for (var index in songs) {
            // var ab = "songs[" + index + "].ar[0].name";
            // var ac = "songs[" + index + "].al.name";
            // console.log(ab);
            // console.log(ac);

            // [ab]= songs[index].artists[0].name
            // songs[" + index + "].al.name= songs[index].name
            // songs[index].ar[0].name = songs[index].artists[0].name;
            // songs[index].al.name = songs[index].name;
            js.name = songs[index].name
            js2.name = songs[index].artists[0].name
            js.ar.push(js2)
            singleList.push(js)

          };
          console.log(js);
          console.log(singleList);

          that.setData({
            showView: false,
            showSuggest: false,
            showResult: true,
            singleList,
          })
        }
      }
    })
  },

  // 输入框删除事件
  clear_kw: function () {
    this.setData({
      searchKey: "",
    })
  },

  // 清除历史
  deleHistory: function () {
    const that = this;
    wx.showModal({
      content: '确认清空全部历史记录',
      cancelColor: 'black',
      confirmColor: 'red',
      success(res) {
        if (res.confirm) {
          that.setData({
            history: []
          })
          wx.setStorageSync("history", []) //把空数组给history,即清空历史记录
        } else if (res.cancel) {
        }
      }
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
        wx.hideLoading()
        // console.log(res.data);
        if (res.data.code == 200) {
          that.setData({
            searchHotDetail: res.data.data
          })
        }
      }
    })
  },

  /**
   * 加载更多单曲
   */
  loadMoreSingle() {
    console.log("加载更多单曲")
    var that = this;
    var page = that.data.singlePage;
    var searchKey = that.data.searchKey;
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    // 偏移数量 , 用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值
    var offset = (page - 1) * 30;
    wx.request({
      url: baseUrl + 'search?keywords=' + searchKey + "&type=1&offset=" + offset,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          // 旧数据
          const oldSingleList = that.data.singleList;
          that.setData({
            // 数据写入
            singleList: oldSingleList.concat(res.data.result.songs),
            singlePage: page + 1,
          })
        }
      },
      complete: function () {
        // 隐藏加载框
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
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
    // 每次页面改变去拿搜索历史
    this.setData({
      history: wx.getStorageSync("history") || []
    })
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
    console.log("到底了：" + this.data.currentTab)
    var currentTab = this.data.currentTab;
    if (currentTab == 0) {
      // 单曲到底了
      console.log("单曲到底了！")
      this.loadMoreSingle();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})