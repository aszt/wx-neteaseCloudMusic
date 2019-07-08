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
        total: 0,
        // MVID
        mvId: 0,
        // 页数
        page: 2,
        // 0-mv、1-视频
        type: 0,

    },

    /**
     * 打开MV
     */
    openMv: function (e) {
        var id = e.currentTarget.dataset.id;
        var type = e.currentTarget.dataset.type;
        // 0-MV、1-用户上传视频
        // console.log("视频id为：" + id + "，类型为：" + type)
        wx.redirectTo({
            url: 'mv?id=' + id + "&type=" + type,
        })
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
            success: function (res) {
                // console.log(res);
                if (res.data.code == 200) {
                    that.setData({
                        mvDetail: res.data.data,
                        mvId: id
                    })
                }
            }
        })
    },

    /**
     * 获取video数据
     */
    getVideoDetail(id) {
        let that = this;
        wx.request({
            url: baseUrl + 'video/detail?id=' + id,
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        'mvDetail.cover': res.data.data.coverUrl,
                        'mvDetail.name': res.data.data.title,
                        'mvDetail.publishTime': util.formatTimeCommit(res.data.data.publishTime, 3),
                        'mvDetail.desc': res.data.data.description,
                        'mvDetail.playCount': res.data.data.playTime,
                        'mvDetail.likeCount': res.data.data.praisedCount,
                        'mvDetail.subCount': res.data.data.subscribeCount,
                        'mvDetail.commentCount': res.data.data.commentCount,
                        'mvDetail.shareCount': res.data.data.shareCount,
                        mvId: id
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
            success: function (res) {
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
     * 获取videoUrl
     */
    getVideoUrl(id) {
        let that = this;
        wx.request({
            url: baseUrl + 'video/url?id=' + id,
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {

                if (res.data.code == 200) {
                    console.log(res.data.urls[0].url)
                    that.setData({
                        'mvUrl.url': res.data.urls[0].url
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
            success: function (res) {
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
        let url = null;
        if (this.data.type == 0) {
            url = baseUrl + 'comment/mv?id=' + id
        } else {
            url = baseUrl + 'comment/video?id=' + id
        }
        wx.request({

            url: url,
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {
                // console.log(res);
                if (res.data.code == 200) {
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
                        total: data.total
                    })
                    // console.log(that.data.hotComments);
                }

            }
        })
    },

    /**
     * 加载更多评论
     */
    loadMore() {
        // console.log("上滑了");
        var that = this;
        var page = that.data.page;
        // console.log("页数为：" + page);
        var mvId = that.data.mvId;
        // 显示加载图标
        wx.showLoading({
            title: '加载中',
        })
        // 页数+1
        // page = page + 1;
        // 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
        var offset = (page - 1) * 20;
        // console.log("偏移量为：" + offset)
        let url = null;
        if (this.data.type == 0) {
            url = baseUrl + 'comment/mv?id=' + mvId + "&offset=" + offset
        } else {
            url = baseUrl + 'comment/video?id=' + mvId + "&offset=" + offset
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
                wx.hideLoading();
            }
        })
    },

    // 查看或关闭简介
    openOrCloseDesc: function (e) {
        var isOpen = this.data.isOpen
        if (isOpen) {
            isOpen = false;
        } else {
            isOpen = true;
        }
        this.setData({
            isOpen
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id;
        let type = options.type;
        // console.log("视频id为：" + id + "，类型为：" + type)
        this.setData({
            type: type
        })
        if (type == 0) {
            // 获取mv数据（播放地址做了防盗链处理，需单独获取[额，可用]）
            this.getMvDetail(id);
            // 获取mvUrl
            this.getMvUrl(id);
            // 获取相关mv
            this.getRelatedAllvideo(id);
            // 获取评论
            this.getComments(id);
        } else {
            // 同上，修改请求路径及返回值
            this.getVideoDetail(id);
            this.getVideoUrl(id);
            this.getRelatedAllvideo(id);
            this.getComments(id);
        }

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
        // 加载更多评论
        this.loadMore();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})