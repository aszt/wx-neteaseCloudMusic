const api = require('api.js');

/**
 * 获取歌曲url
 */
const getMusicUrl = (id, sueecss, fail, cb) => {
    wx.request({
        url: api + 'song/url',
        data: {
            id,
            br: 128000
        },
        success: (res) => {
            if (res.data.code === 200) {
                const data = res.data.data[0];
                if (!data.url) { // 没有歌曲url， 自动播放下一首
                    fail && fail();
                } else {
                    sueecss && sueecss(data.url);
                }
            }
        }
    })
}

/**
 * 获取歌曲评论
 */
const getComments = (query, cb) => {
    wx.request({
        url: api + 'comment/music',
        data: query,
        success: (res) => {
            if (res.data.code === 200) {
                cb && cb(res.data);
            }
        }
    })
}

module.exports = {
    getMusicUrl: getMusicUrl,
    getComments: getComments
}