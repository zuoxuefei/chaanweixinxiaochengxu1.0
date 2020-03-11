const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const countTime = (hour,minute,second,millsecond) => {
  
  millsecond++
  if (millsecond >= 100) {
    millsecond =  '0' + 0;
    second++
    if (second >= 60) {
      second = "0" + 0;
      minute++
      if (minute >= 60) {
        minute = 0 + "0";
        hours++
        if (hours < 10) {
          // 少于10补零
          hour =  '0' + hour
        } else {
          hour = '0' + hour
        }
      }
      if (minute < 10) {
        // 少于10补零
        minute =  '0' + minute
      } else {
        minute =  minute
      }
    } if (second < 10) {
      // 少于10补零
      second =  '0' + second
    } else {
      second = second
    }
  } else {
    millsecond = millsecond
  }
  return [hour, minute, second, millsecond]
}
const dateDifference = startDateMinseconds => {
 
  var stime = startDateMinseconds;
  console.log("startDateMinseconds")
  console.log(startDateMinseconds)
  var etime = new Date().getTime();
  var usedTime = etime - stime;  //两个时间戳相差的毫秒数
  var days = Math.floor(usedTime / (24 * 3600 * 1000));
  //计算出小时数
  var leave1 = usedTime % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000));
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
  var seconds = Math.floor(leave3 / 1000)
  // 计算相差毫秒数
  var leave4 = leave3 % 100      //计算分钟数后剩余的毫秒数
  var minseconds = Math.floor(leave4)

  if (minseconds < 10) {
    minseconds = "0" + minseconds;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  
  // var time = hours + "时" + minutes + "分" + seconds + "秒" + minseconds+"毫秒";
  var times = [hours, minutes, seconds, minseconds]
  return times;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  dateDifference: dateDifference,
  coutTime: countTime
}
