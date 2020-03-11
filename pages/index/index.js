//index.js
//获取应用实例（全局app.js）


const app = getApp()

// 导入工具类js
var util = require('../../utils/util.js');

Page({
  data: {
    hours: '0' + 0,   // 时
    minute: '0' + 0,   // 分
    second: '0' + 0,    // 秒
    millsecond: '0' + 0, //毫秒 
    buttonText: "扫码开始",
    isTimerRunning: false,
    timer:null,
    showModal:false,
    rank:0,
    startDateMinseconds:0
  },
  //get authorize 
  getAuthorize:function(){
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              try {
                wx.setStorageSync('userInfo', res.userInfo);
              } catch (e) {
                wx.showToast({
                  icon: 'loading',
                  title: '用户基本信息数据存入缓存失败!'
                })
              }
            },
            fail:function(){
            }
          });
        } else {
          // 用户没有授权
          wx.showModal({
            title: '授权提示',
            content: '扫码需要获取用户信息，您是否进行授权?',
            showCancel: true,//是否显示取消按钮
            cancelText: "否",//默认是“取消”
            cancelColor: '#000',//取消文字的颜色
            confirmText: "是",//默认是“确定”
            confirmColor: '#000',//确定文字的颜色
            success: function (res) {
              if (res.cancel) {
                //点击取消,默认隐藏弹框
              } else {
                // wx.reLaunch({
                //   url: '../login/login'
                // })
                wx.navigateTo({
                  url: '../login/login',
                })
              }
            },
            fail: function (res) { },//接口调用失败的回调函数
            complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
          })
        }
      }
    });
  },
  onLoad:function(){
    
  },
  scanQrCode: function() {
    // 先把本页面最大的对象给 self
    if (!app.globalData.isAuth){
      this.getAuthorize();
      return
    }
    var self = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        var result = res.result
        if (result == "aHR0cHMlM0EvL3d3dy5jaGFhbi5mdW4vYmVnaW4=") {
          console.log("time running " + self.data.isTimerRunning)
          if(self.data.isTimerRunning){
            wx.showModal({
              title: '提示',
              content: '是否结束计时',
              showCancel: true,//是否显示取消按钮
              cancelText: "否",//默认是“取消”
              cancelColor: '#3cc51f',//取消文字的颜色
              confirmText: "是",//默认是“确定”
              confirmColor: '#3cc51f',//确定文字的颜色
              success: function (res) {
                if (res.cancel) {
                  
                } else {
                  //点击确定
                  self.stopTimer(false)
                }
              },
              fail: function (res) { },//接口调用失败的回调函数
              complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
            })
          }else{
            self.start()
          }
        } else if (result == "aHR0cHMlM0EvL3d3dy5jaGFhbi5mdW4vZW5k"){
          if(self.data.isTimerRunning) {
            self.stopTimer(true)
          }else{
            wx.showToast({
              title: '您还没有开始计时',
              icon: 'none',
              duration: 2000
            })
          }
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {

      }
    });
  },
  start:function(){
    var self = this;
    var openid = wx.getStorageSync("openid");
    var nickName = wx.getStorageSync("userInfo").nickName;
    var avatarUrl = wx.getStorageSync("userInfo").avatarUrl;
    let goin_goinpark_backend_url = "https://chaan.fun/chaan/timer_ranking/goinpark/"
      + nickName + "/" + openid;

    // let goin_goinpark_backend_url = "http://localhost:8888/chaan/timer_ranking/goinpark/"
    //    + nickName + "/" + openid;
    wx.request({
      url: goin_goinpark_backend_url,
      data: { 'headImage': avatarUrl },
      method: 'get',
      success(res) {
        if (res.statusCode = 200 && res.data.status == 1) {
          console.log("登记成功" + new Date().getTime());
          
          self.setData({
            startDateMinseconds:new Date().getTime()
          })
          self.startTimer()
        }
        else {
          wx.showToast({
            icon: 'loading',
            title: '开始计时异常!'
          })
        }
      }
    })
  },
  initData: function () {
    this.setData({
      hours: '0' + 0,   // 时
      minute: '0' + 0,   // 分
      second: '0' + 0,    // 秒
      millsecond: '0' + 0, //毫秒 
      timer: null,
      isTimerRunning: false,
      buttonText: "扫码开始",
      showModal:false
    })
  },
  changeScanButtonText: function () {
    if (this.data.isTimerRunning) {
      this.setData({
        buttonText: "扫码结束"
      })
    } else {
      this.setData({
        buttonText: "扫码开始"
      })
    }
  },
  //stop timer
  stopTimer: function (isRank) {
    this.setData({
      isTimerRunning: false
    })
    this.changeScanButtonText()
    clearInterval(this.data.timer);
    if(isRank){
      this.getRank()
    }
  },
  startTimer:function(){
    console.log(this.data.startDateMinseconds)
    // 进行计时功能 start
    if (this.data.isTimerRunning) {
      this.stopTimer(true)
      return
    }
    this.initData()
    this.setData({
      isTimerRunning: true
    })
    console.log("startTimer time running " + this.data.isTimerRunning)
    this.changeScanButtonText()
    var self = this
    this.startTimeCount()
    // var time = setInterval(
    //   function () {
    //     var time = util.coutTime(self.data.hours, self.data.minute, self.data.second, self.data.millsecond)
    //     self.setData({
    //       hours: time[0],
    //       minute: time[1],   // 分
    //       second: time[2],    // 秒
    //       millsecond: time[3]
    //     });
    //   }
    //   , 10);

    // self.setData({
    //   timer: time
    // }) 
               
  },
  startTimeCount(){
    var self = this
      var timer = setTimeout(function () {
      var time = util.dateDifference(self.data.startDateMinseconds)
      console.log(time)
      self.setData({
        hours: time[0],
        minute: time[1],   // 分
        second: time[2],    // 秒
        millsecond: time[3]
      });
      self.startTimeCount()
    }, 10)
    self.setData({
      timer: timer
    }) 
  },
  showModel:function(){
    this.setData({
      showModal:true
    })
  },
  hideModel:function(){
    this.setData({
      showModal: false
    })
  },
  /*页面加载的方法 */
  getRank: function () {
    // 发起ajax 向后台得到排名列表数据 start
    var openid = wx.getStorageSync("openid")
    var millsecond = this.data.hours * 60 * 60 * 1000 + this.data.minute * 60 * 1000+ this.data.second * 1000+ this.data.millsecond ;
    var backend_ranklist_url = "https://chaan.fun/chaan/timer_ranking/logout/park/" + openid + "/" + millsecond;
    // var backend_ranklist_url = "http://localhost:8888/chaan/timer_ranking/logout/park/" + openid + "/" + millsecond;
    var self = this;
    wx.request({
      url: backend_ranklist_url,
      method: 'get',
      dataType: "json",
      success(res) {
        if (res.statusCode = 200 && res.data.status == 1) {
          console.log("登出成功" + res);
          self.setData({
            rank: res.data.myranking,
            showModal:true
          });
        }
        else {
          wx.showToast({
            icon: 'loading',
            title: '排名情况获取异常!'
          })
        }
      }
    })
    // 发起ajax 向后台得到排名列表数据 end
  }
})
