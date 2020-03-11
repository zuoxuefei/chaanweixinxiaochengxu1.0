//app.js
App({
  onLoad: function (options) {
    console.log("page ---onLoad---");
  },
  onReady: function () {
    console.log("page ---onReady---");
  },
  onShow: function () {
    console.log("app.js ---onShow---");
  },
  onHide: function () {
    console.log("app.js ---onHide---");
  },
  onError: function (msg) {
    console.log("app.js ---onError---" + msg);
  },
  onLaunch: function (options) {
    
    this.login();
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          that.globalData.isAuth = true;
          wx.setStorageSync('isAuth', true);
          wx.getUserInfo({
            success: function (res) {
              //把对应的用户信息存在本页面变量里面。
             
              that.globalData.userInfo = res.userInfo;
              
              try {
                wx.setStorageSync('userInfo', res.userInfo);
                
              } catch (e) {
                wx.showToast({
                  icon: 'loading',
                  title: '用户基本信息数据存入缓存失败!'
                })
              }
            }
          });
        } else {
          wx.setStorageSync('isAuth', false);
        }
      }
    });
    wx.setKeepScreenOn({
      　　keepScreenOn: true,
    })
  },
  login: function () {

    // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
    var that = this;
    wx.login({
      success: res => {
        // 获取到用户的 code 之后：res.code
        // wx.login方法可以得到 jscode2session 接口需要用的js_code===res.code
        console.log("用户的code:" + res.code);
        let get_wechat_openid_url = "https://chaan.fun/chaan/wechat/openid/" + res.code;
        //let get_wechat_openid_url = "http://localhost:8080/parktimeranking/wechat/openid/" + res.code;
        // 获取openid start
        wx.request({
          url: get_wechat_openid_url,
          method: 'get',
          success(res) {
            if (res.statusCode == 200 && null == res.errcode) {

              try {
                wx.setStorageSync('session_key', res.data.session_key);
                wx.setStorageSync('openid', res.data.openid);
               console.log("login success")
              } catch (e) {

                wx.showToast({
                  icon: 'loading',
                  title: '把openid等数据存入缓存失败!'
                })
              }
            }
            else {
              wx.showToast({
                icon: 'loading',
                title: '获取openid失败!'
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              icon: 'loading',
              title: '获取openid失败!'
            })
          }
        })
        // 获取openid end
      }
    });

  },
  globalData: {
    userInfo: null,
    isAuth:false
  }
})