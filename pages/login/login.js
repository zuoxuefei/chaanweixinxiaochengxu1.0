//获取应用实例
const app = getApp()

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  
  onLoad: function () {
    
  },

  getUserInfo: function (e) {
    var that = this;
    
    wx.getUserInfo({
      success: function (res) {
        //把对应的用户信息存在本页面变量里面。
        try {
          wx.setStorageSync('userInfo', res.userInfo);
          app.globalData.userInfo = res.userInfo;
          app.globalData.isAuth = true;
          wx.navigateBack({
            url: '../index/index'
          })
        } catch (e) {
          wx.showToast({
            icon: 'loading',
            title: '用户基本信息数据存入缓存失败!'
          })
        }
      }
    });
  },
  
})
