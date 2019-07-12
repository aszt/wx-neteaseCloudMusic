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
    // 单曲页数(加载更多使用参数)
    singlePage: 2,
    // 视频列表
    videoList: [],
    videoPage: 2,
    // 歌手列表
    artistsList: [],
    artistsPage: 2,
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
    const that = this;
    // 开始处理其它选项
    var current = e.detail.current;
    var videoList = that.data.videoList
    var artistsList = that.data.artistsList
    // console.log("滑动了" + current);
    if (current == 0) {
      // 单曲
      console.log("加载单曲")
    } else if (current == 1) {
      // 视频
      if (videoList.length == 0) {
        console.log("加载视频")
        this.loadvideo(that);
      }
    } else if (current == 2) {
      // 歌手
      if (artistsList.length == 0) {
        console.log("加载歌手")
        this.loadartists(that);
      }
    } else if (current == 3) {
      // 专辑
      console.log("加载专辑")
    } else if (current == 4) {
      // 歌单
      console.log("加载歌单")
    } else if (current == 5) {
      // 主播电台
      console.log("加载主播电台")
    } else if (current == 6) {
      // 用户
      console.log("加载用户")
    } else {
      console.log("未知")
    }
    // console.log(e);
    this.setData({
      currentTab: e.detail.current,
    })
  },

  /**
   * 加载视频
   */
  loadvideo(that) {
    // 输入框值
    var searchValue = that.data.searchKey;
    if (searchValue != '') {
      // console.log(searchValue)
      wx.request({
        url: baseUrl + 'search?keywords=' + searchValue + "&type=1014",
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          // console.log(res)
          if (res.data.code == 200) {
            // console.log(res.data.result.videos)
            that.setData({
              videoList: res.data.result.videos
            })
          }
        }
      })
    }
  },

  loadartists(that) {
    // 输入框值
    var searchValue = that.data.searchKey;
    if (searchValue != '') {
      // console.log(searchValue)
      wx.request({
        url: baseUrl + 'search?keywords=' + searchValue + "&type=100",
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          // console.log(res)
          if (res.data.code == 200) {
            // console.log(res.data.result.videos)
            that.setData({
              artistsList: res.data.result.artists
            })
          }
        }
      })
    }
  },

  // 播放视频
  openMv: function (e) {
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    // 0-MV、1-用户上传视频
    // console.log("视频id为：" + id + "，类型为：" + type)
    wx.navigateTo({
      url: '../mv/mv?id=' + id + "&type=" + type,
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
      that.setData({
        showView: true,
        showSuggest: false,
        showResult: false,
      })
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
    // var value = e.detail.value
    // if (value != '') {
    //   let history = wx.getStorageSync("history") || [];
    //   history.push(this.data.searchKey)
    //   wx.setStorageSync("history", history);
    // }
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
        if (res.data.code == 200) {
          var songs = res.data.result.songs;
          // 数据一致性处理（播放项）
          for (var index in songs) {
            // 专辑
            var name = songs[index].album.name
            // 歌手
            var singerName = songs[index].artists[0].name
            songs[index].al = { name }
            songs[index].ar = [{ name: singerName }]
          };
          // console.log(songs);
          that.setData({
            showView: false,
            showSuggest: false,
            showResult: true,
            singleList: songs,
            // 数据重置
            videoList: [],
            artistsList: []
          })
        }
      }
    })

    if (searchValue != '') {
      let history = wx.getStorageSync("history") || [];
      history.push(that.data.searchKey)
      wx.setStorageSync("history", history);
    }
  },

  // 输入框删除事件
  clear_kw: function () {
    this.setData({
      searchKey: "",
      showView: true,
      showSuggest: false,
      showResult: false,
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
    // console.log("加载更多单曲")
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
        // console.log(res)
        if (res.data.code == 200) {
          var songs = res.data.result.songs;
          // 数据一致性处理（播放项）
          for (var index in songs) {
            // 专辑
            var name = songs[index].album.name
            // 歌手
            var singerName = songs[index].artists[0].name
            songs[index].al = { name }
            songs[index].ar = [{ name: singerName }]
          };
          // 旧数据
          const oldSingleList = that.data.singleList;
          that.setData({
            // 数据写入
            singleList: oldSingleList.concat(songs),
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
   * 加载更多视频
   */
  loadMoreVideo() {
    // console.log("加载更多视频")
    var that = this;
    var page = that.data.videoPage;
    var searchKey = that.data.searchKey;
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    // 偏移数量 , 用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值
    var offset = (page - 1) * 30;
    wx.request({
      url: baseUrl + 'search?keywords=' + searchKey + "&type=1014&offset=" + offset,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 200) {
          // 旧数据
          const oldVideoList = that.data.videoList;
          var videos = res.data.result.videos
          that.setData({
            // 数据写入
            videoList: oldVideoList.concat(videos),
            videoPage: page + 1,
          })
        }
      },
      complete: function () {
        // 隐藏加载框
        wx.hideLoading();
      }
    })
  },

  // 加载更多歌手
  loadMoreArtists() {
    var that = this;
    var page = that.data.artistsPage;
    var searchKey = that.data.searchKey;
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    // 偏移数量 , 用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值
    var offset = (page - 1) * 30;
    wx.request({
      url: baseUrl + 'search?keywords=' + searchKey + "&type=100&offset=" + offset,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 200) {
          // 旧数据
          const oldArtistsList = that.data.artistsList;
          var artists = res.data.result.artists
          that.setData({
            // 数据写入
            artistsList: oldArtistsList.concat(artists),
            artistsPage: page + 1,
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
      history: (wx.getStorageSync("history") || []).reverse()
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
    // 因为swiper高度问题，弃用此方案（没办法，搞大半天没弄好，偷个鸡）
    // if (this.data.showResult) {
    //   console.log("到底了：" + this.data.currentTab)
    //   var currentTab = this.data.currentTab;
    //   if (currentTab == 0) {
    //     // 单曲到底了
    //     console.log("单曲到底了！")
    //     this.loadMoreSingle();
    //   } else if (currentTab == 1) {
    //     console.log("视频到底了！")
    //     this.loadMoreVideo();
    //   }
    // }

  },

  loadMore: function (e) {
    if (this.data.showResult) {
      // console.log("到底了：" + this.data.currentTab)
      var currentTab = this.data.currentTab;
      if (currentTab == 0) {
        // 单曲到底了
        console.log("单曲到底了！")
        this.loadMoreSingle();
      } else if (currentTab == 1) {
        console.log("视频到底了！")
        this.loadMoreVideo();
      } else if (currentTab == 2) {
        console.log("歌手到底了！")
        this.loadMoreArtists();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})