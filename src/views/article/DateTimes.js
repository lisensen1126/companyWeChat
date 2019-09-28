// 时间戳与当前时间做对比，转成对应格式
var dateTime = function(timestamp) {
  // 补全为13位
  var arrTimestamp = (timestamp + "").split("");
  for (var start = 0; start < 13; start++) {
    if (!arrTimestamp[start]) {
      arrTimestamp[start] = "0";
    }
  }
  timestamp = arrTimestamp.join("") * 1;

  var minute = 1000 * 60;
  var hour = minute * 60;
  var now = new Date().getTime();
  var diffValue = now - timestamp;

  // 如果本地时间反而小于变量时间
  if (diffValue < 0) {
    return "不久前";
  }

  // 计算差异时间的量级
  var hourC = diffValue / hour;
  var minC = diffValue / minute;

  // 数值补0方法
  var zero = function(value) {
    if (value < 10) {
      return "0" + value;
    }
    return value;
  };

  // 使用
  if (hourC > 24) {
    // 超过，直接显示年月日
    return (function() {
      var date = new Date(timestamp);
      return (
        date.getFullYear() +
        "年" +
        zero(date.getMonth() + 1) +
        "月" +
        zero(date.getDate()) +
        "日"
      );
    })();
  } else if (hourC >= 1) {
    return parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    return parseInt(minC) + "分钟前";
  }
  return "刚刚";
};

// 时间戳转日期
var ChangeDate = function(data) {
  var str = data * 1000;
  var time = new Date(str);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();

  return y + "年" + add0(m) + "月" + add0(d) + "日";
};
// 时间戳转日期
var ChangeDateTime = function(data, link = '/') {
  var str = data * 1000;
  var time = new Date(str);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var f = time.getMinutes();

  return y + link + add0(m) + link + add0(d) + " " + add0(h) + ":" + add0(f);
};
// 时间戳转日期
var ChangeDateTime2 = function(data, link = '/') {
  if (!data) {
    return "";
  }
  var str = data * 1000;
  var time = new Date(str);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();

  return y + link + add0(m) + link + add0(d);
};
var add0 = function(data) {
  return data < 10 ? "0" + data : data;
};

export { dateTime, ChangeDate, ChangeDateTime, ChangeDateTime2 };
