// pages/rankingList/rankingList.js
var baseUrl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    // 官方榜
    officialList: [],
    // 推荐榜
    recommendationList: [],
    // 全球榜
    globalList: [],
    // 更多榜单
    moreList: [],
  },

  // 打开排行榜
  openRankingList: function(e) {
    var name = e.currentTarget.dataset.name;
    // 其实只用拿id获取即可，接口转化了一下这就比较尴尬了！！！
    // console.log(name)
    var id;
    if (name == "云音乐新歌榜") {
      id = 0;
    }
    if (name == "云音乐热歌榜") {
      id = 1;
    }
    if (name == "网易原创歌曲榜") {
      id = 2;
    }
    if (name == "云音乐飙升榜") {
      id = 3;
    }
    if (name == "云音乐电音榜") {
      id = 4;
    }
    if (name == "UK排行榜周榜") {
      id = 5;
    }
    if (name == "美国Billboard周榜") {
      id = 6;
    }
    if (name == "KTV嗨榜") {
      id = 7;
    }
    if (name == "iTunes榜") {
      id = 8;
    }
    if (name == "Hit FM Top榜") {
      id = 9;
    }
    if (name == "日本Oricon周榜") {
      id = 10;
    }
    if (name == "韩国Melon排行榜周榜") {
      id = 11;
    }
    if (name == "韩国Mnet排行榜周榜") {
      id = 12;
    }
    if (name == "韩国Melon原声周榜") {
      id = 13;
    }
    if (name == "中国TOP排行榜(港台榜)") {
      id = 14;
    }
    if (name == "中国TOP排行榜(内地榜)") {
      id = 15;
    }
    if (name == "香港电台中文歌曲龙虎榜") {
      id = 16;
    }
    if (name == "华语金曲榜") {
      id = 17;
    }
    if (name == "中国嘻哈榜") {
      id = 18;
    }
    if (name == "法国 NRJ EuroHot 30周榜") {
      id = 19;
    }
    if (name == "台湾Hito排行榜") {
      id = 20;
    }
    if (name == "Beatport全球电子舞曲榜") {
      id = 21;
    }
    if (name == "云音乐ACG音乐榜") {
      id = 22;
    }
    if (name == "云音乐嘻哈榜") {
      id = 23;
    }
    wx.navigateTo({
      url: '../songSheet/songSheet?id=' + id + "&type=1",
    })
  },

  // 打开排行榜(新)
  openTopList: function(e) {
    var id = e.currentTarget.dataset.id;
    // console.log(id)
    wx.navigateTo({
      url: '../songSheet/songSheet?id=' + id + "&type=1",
    })
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
      success: function(res) {
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
            } else if (name == "江小白YOLO云音乐说唱榜" || name == "说唱TOP榜" || name == "云音乐电音榜" || name == "云音乐ACG音乐榜" || name == "云音乐欧美新歌榜" || name == "抖音排行榜") {
              recommendationList.push(list[index])
            } else if (name == "美国Billboard周榜" || name == "UK排行榜周榜" || name == "Beatport全球电子舞曲榜" || name == "日本Oricon周榜" || name == "iTunes榜" || name == "香港电台中文歌曲龙虎榜") {
              globalList.push(list[index])
            } else {
              moreList.push(list[index])
            }
          }
          that.setData({
            officialList,
            recommendationList,
            globalList,
            moreList,
            loading: false,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getToplistDetail();
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