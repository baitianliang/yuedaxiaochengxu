// pages/faxian/faxian.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    token: ''
  },

  details(val) {
    let { enrollId, orderId } = val.currentTarget.dataset.val
    if(orderId)
    wx.navigateTo({
      url: '../bangding/bangding?enrollId=' + enrollId
    })
    else
    this.pay(val)
  },
  // 支付
  pay(val) {
    wx.login({
      success: res => {
        let code = res.code,
        enrollId = val.currentTarget.dataset.val.enrollId,
        fee = parseFloat(val.currentTarget.dataset.val.activityLevelFee),
        data = { code, enrollId, fee }
        wx.request({
          url: `https://xcx.jthapp.com/rest/public/util/tenpay/prepay/xcx`,
          data,
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
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
            wx.requestPayment({
              timeStamp: res.data.result.timeStamp,
              nonceStr: res.data.result.nonceStr,
              package: "prepay_id="+res.data.result.package,
              signType: res.data.result.signType,
              paySign: res.data.result.sign,
              success (res) {
                this.getDataList(this.data.token)
                console.log(res)
              },
              fail (res) {
                this.getDataList(this.data.token)
                console.log(res)
              }
            })
          },
          fail(err) {
            console.log(err)
          }
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  // 获取参赛列表
  getDataList(token) {
    let that = this
    wx.request({
      url: `https://xcx.jthapp.com/rest/user/enroll/list/score/0/50`,
      data: null,
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + token,
      },
      success (res) {
        let dataList = res.data.result
        that.setData({ dataList })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ token: options.t })
    this.getDataList(options.t)
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