// pages/dingdan/dingdan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = options.t,
    that = this
    wx.request({
      url: `https://xcx.jthapp.com/rest/user/order/list/0/50`,
      data: null,
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + token,
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
        let orderList = res.data.result
        that.setData({ orderList })
      }
    })
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