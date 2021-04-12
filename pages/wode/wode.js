// pages/wode/wode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {},
    userRole: {}
  },
  // 退出登录
  quit() {
    wx.removeStorage({
      key: 'token',
      success() {
        wx.redirectTo({
          url: '../login/login'
        })
      }
    })
  },
  // 修改密码
  update() {
    wx.navigateTo({
      url: '../fixPwd/fixPwd'
    })
  },
  // 我的订单
  order() {
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.navigateTo({
          url: `../dingdan/dingdan?t=${res.data}`
        })
      },
      fail() {
        wx.showToast({
          title: '请登录',
          icon: 'none',
          duration: 2000
        })
        wx.redirectTo({
          url: '../login/login'
        })
      }
    })
  },
  // 我的视频
  video() {
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.navigateTo({
          url: `../shipin/shipin?t=${res.data}`
        })
      },
      fail() {
        wx.showToast({
          title: '请登录',
          icon: 'none',
          duration: 2000
        })
        wx.redirectTo({
          url: '../login/login'
        })
      }
    })
  },
  // 我的参赛
  activity() {
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.navigateTo({
          url: `../cansai/cansai?t=${res.data}`
        })
      },
      fail() {
        wx.showToast({
          title: '请登录',
          icon: 'none',
          duration: 2000
        })
        wx.redirectTo({
          url: '../login/login'
        })
      }
    })
  },
  // 个人设置
  setting() {
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.navigateTo({
          url: `../shezhi/shezhi?t=${res.data}`
        })
      },
      fail() {
        wx.showToast({
          title: '请登录',
          icon: 'none',
          duration: 2000
        })
        wx.redirectTo({
          url: '../login/login'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that = this
    wx.getStorage({
      key: 'token',
      success: function(res){
        let token = 'Bearer ' + res.data
        wx.request({
          url: `https://xcx.jthapp.com/rest/common/user/info`,
          data: null,
          method: 'GET',
          header: {
            'Authorization': `${token}`
          },
          success (res) {
            if(res.statusCode === 401) 
            return wx.reLaunch({
              url: '../login/login',
              success() {
                wx.showToast({
                  title: '登录失效，请重新登录',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
            let form = res.data.result,
            userRole = res.data.supplement
            that.setData({form, userRole})
          }
        })
      },
      fail(res) {
        wx.redirectTo({
          url: '../login/login',
          success() {
            wx.showToast({
              title: '请登录',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})