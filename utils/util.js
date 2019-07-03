const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

const formatTime = time => {
  time = new Date(time);
  return formatNumber(time.getMinutes()) + ':' + formatNumber(time.getSeconds());
}

const trim = (str) => {
  return str.replace(/(^\s *)| (\s * $)/g, '');
}

function toggleplay(that, app) {
  if (that.data.playing) {
    console.log("暂停播放");
    that.setData({
      playing: false
    });
    app.globalData.playing = false;
    app.stopmusic();
  } else {
    console.log("继续播放")
    that.setData({
      playing: true
    });
    app.globalData.playing = true;
    console.log("继续时进度：" + app.globalData.currentPosition)
    var currentPosition = app.globalData.currentPosition;
    // 三种方案（记录暂停值真机有问题，play可用，playBackgroundAudio传url也可）
    app.seekmusic(currentPosition);
  }
}

// 转换歌词字符串为数组
function parse_lrc(lrc_content) {
  let now_lrc = [];
  let lrc_row = lrc_content.split("\n");
  let scroll = true;
  for (let i in lrc_row) {
    if ((lrc_row[i].indexOf(']') == -1) && lrc_row[i]) {
      now_lrc.push({ lrc: lrc_row[i] });
    } else if (lrc_row[i] != "") {
      var tmp = lrc_row[i].split("]");
      for (let j in tmp) {
        scroll = false
        let tmp2 = tmp[j].substr(1, 8);
        tmp2 = tmp2.split(":");
        let lrc_sec = parseInt(tmp2[0] * 60 + tmp2[1] * 1);
        if (lrc_sec >= 0) {
        // if (lrc_sec && (lrc_sec > 0)) {
          let lrc = (tmp[tmp.length - 1]).replace(/(^\s*)|(\s*$)/g, "");
          lrc && now_lrc.push({ lrc_sec: lrc_sec, lrc: lrc });
        }
      }
    }
  }
  if (!scroll) {
    now_lrc.sort(function (a, b) {
      return a.lrc_sec - b.lrc_sec;
    });
  }
  return {
    now_lrc: now_lrc,
    scroll: scroll
  };
}

module.exports = {
  formatTime: formatTime,
  trim: trim,
  toggleplay: toggleplay,
  parse_lrc: parse_lrc,
}