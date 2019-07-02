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

function toggleplay(that, app, cb) {
  cb = cb || null;
  if (that.data.disable) {
    return;
  }
  if (that.data.playing) {
    console.log("暂停播放");
    that.setData({
      playing: false
    });
    console.log("暂停时进度：" + app.globalData.currentPosition)
    app.stopmusic();
  } else {
    console.log("继续播放")
    that.setData({
      playing: true
    });
    console.log("继续时进度：" + app.globalData.currentPosition)
    app.seekmusic(app.globalData.currentPosition);
  }
}

module.exports = {
  formatTime: formatTime,
  trim: trim,
  toggleplay: toggleplay
}