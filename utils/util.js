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

module.exports = {
    formatTime: formatTime,
    trim: trim
}