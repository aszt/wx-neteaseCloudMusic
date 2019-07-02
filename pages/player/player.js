// pages/player/player.js
var baseUrl = require('../../utils/api.js');
const util = require('../../utils/util.js');
const audio = require('../../utils/backgroundAudio.js');
const app = getApp();
const backgroundAudioManager = app.globalData.backgroundAudioManager;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    music: {},
    totalCountComments: 0, // 评论总数
    currentTime: '00:00', // 进度时长
    duration: '00:00', // 总时长
    sliderValue: 0, // 当前滑块值
    sliderMax: 0, // 滑块最大值
    isMovingSlider: false, // 手动拖动触发slider更新
    showLyric: false, // 是否显示歌词
    playMode: 1, // 循环类型
    playing: false, // 是否正在播放
    curPlayList: [], // 歌曲列表
    // 循环类型集合
    modeList: [{
        id: 1,
        name: '列表循环',
        icon: '../../images/cm2_icn_loop@2x.png',
        icon2: '../../images/cm2_playlist_icn_loop@2x.png'
      },
      {
        id: 2,
        name: '单曲循环',
        icon: '../../images/cm2_icn_one@2x.png',
        icon2: '../../images/cm2_playlist_icn_one@2x.png'
      },
      {
        id: 3,
        name: '随机播放',
        icon: '../../images/cm2_icn_shuffle@2x.png',
        icon2: '../../images/cm2_playlist_icn_shuffle@2x.png'
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id;
    console.log("音乐id:" + id);


    // 一、获取歌词（接口问题待排查）
    // this.getSongLyric(options.id)

    // 二、初始化设置
    this.setData({
      playing: app.globalData.playing,
      curPlayList: app.globalData.list_song,
      playMode: app.globalData.playMode,

    });

    // console.log("路径：" + app.globalData.curPlaying.url)
    // ***判断歌曲是否在当前列表中***
    if ((!app.globalData.curPlaying.url) || (app.globalData.curPlaying.id != id)) {
      // 三、播放歌曲(重新播放)
      this.playMusic(id)
    } else {
      console.log("播放状态:" + app.globalData.playing)
      // 三、继续播放状态
      this.setData({
        music: app.globalData.curPlaying,
        duration: util.formatTime(app.globalData.curPlaying.dt),
        sliderMax: Math.floor(app.globalData.curPlaying.dt),
      })
      // 设置标题
      wx.setNavigationBarTitle({
        title: `${app.globalData.curPlaying.name}-${app.globalData.curPlaying.ar[0].name}`,
      });
      // 获取评论总数
      audio.getComments({
        id: app.globalData.curPlaying.id,
        offset: 0,
        limit: 0,
      }, data => {
        this.setData({
          totalCountComments: data.total,
        })
      });
    }
  },

  playMusic: function(id) {
    let that = this;
    wx.request({
      url: baseUrl + 'song/detail?ids=' + id,
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        // console.log(res)
        if (res.data.code === 200) {
          // 全局设置当前播放歌曲
          app.globalData.curPlaying = res.data.songs[0];
          if (!app.globalData.list_song.length) {
            // 歌曲集合中设置当前播放歌曲详情（待定）
            app.globalData.list_song.push(res.data.songs[0]);
          }
          that.setData({
            music: res.data.songs[0],
            duration: util.formatTime(app.globalData.curPlaying.dt),
            sliderMax: Math.floor(app.globalData.curPlaying.dt),
          })
          // 获取歌曲url
          audio.getMusicUrl(app.globalData.curPlaying.id, (url) => {
            app.globalData.curPlaying.url = url;
            // 播放音乐
            app.playAudio(that);
          });

          // 设置标题
          wx.setNavigationBarTitle({
            title: `${app.globalData.curPlaying.name}-${app.globalData.curPlaying.ar[0].name}`,
          });
          // 获取评论
          audio.getComments({
            id: app.globalData.curPlaying.id,
            offset: 0,
            limit: 0,
          }, data => {
            that.setData({
              totalCountComments: data.total,
            })
          });
        }
      }
    });
  },

  // 切换播放类型
  modeChange: function() {
    let {
      playMode,
      modeList
    } = this.data;
    playMode++;
    playMode = playMode > (modeList.length) ? 1 : playMode;
    app.globalData.playMode = playMode;
    this.setData({
      playMode
    });

    wx.showToast({
      title: modeList[playMode - 1].name,
      duration: 2000
    });
  },

  // 暂停或播放
  playStatusChange: function(e) {
    // console.log(this.data.playing)
    let {
      playing
    } = this.data;
    if (playing) {
      backgroundAudioManager.pause();
      playing = false;
    } else {
      backgroundAudioManager.play();
      playing = true;
    }
    app.globalData.playing = playing;
    this.setData({
      playing
    });
  },

  // 上、下一首
  playMusicChange: function(event) {
    const value = parseInt(event.currentTarget.id);
    app.nextAudio(value, this);
  },



  // 进度条
  sliderChange: function(e) {
    const position = e.detail.value;
    app.seekAudio(position, this);
  },
  sliderMoveStart: function() {
    this.setData({
      isMovingSlider: true
    });
  },
  sliderMoveEnd: function() {
    this.setData({
      isMovingSlider: false
    });
  },

  /**
   * 获取歌词
   */
  getSongLyric(id) {
    let that = this;
    wx.request({
      url: baseUrl + 'lyric?id=' + id,
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        if (res.data.code === 200) {
          let lyric = res.data.lrc.lyric;
          let pattern = /\[\d{2}:\d{2}.\d{2}\]/g;
          let arrLyric = lyric.split('\n');
          let lyricsList = [];
          while (!pattern.test(arrLyric[0])) {
            arrLyric = arrLyric.slice(1);
          }

          for (let data of arrLyric) {
            if (data) {
              let index = data.indexOf(']');
              let time = data.substring(0, index + 1);
              let value = data.substring(index + 1);
              let timeString = time.substring(1, time.length - 2);
              let timeArr = timeString.split(':');
              if (value) {
                lyricsList.push({
                  lrc: value,
                  lrc_sec: parseInt(timeArr[0], 10) * 60 + parseFloat(timeArr[1])
                })
              }
            }
          }
          this.setData({
            lyricsList,
            lyricsUser: res.data.lyricUser
          });
          console.log(lyricsList)
        }
      }
    })
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
    // 背景音频播放进度更新事件
    backgroundAudioManager.onTimeUpdate(() => {
      let curLrcIndex = 0;
      if (this.data.showLyric) {
        for (let i in this.data.lyricsList) {
          const item = this.data.lyricsList[i];
          if (item.lrc_sec <= backgroundAudioManager.currentTime) {
            curLrcIndex = i;
          }
        }
      }
      this.setData({
        curLrcIndex,
        sliderValue: Math.floor(backgroundAudioManager.currentTime * 1000),
        currentTime: util.formatTime(Math.floor(backgroundAudioManager.currentTime * 1000)),
      });
    });

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