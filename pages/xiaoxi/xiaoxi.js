// pages/xiaoxi/xiaoxi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: []
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
        wx.request({
          url: `https://xcx.jthapp.com/rest/user/message/listbyreceiverid/0/50`,
          data: null,
          method: 'GET',
          header: {
            'Authorization': 'Bearer ' + res.data
          },
          success (res) {
            let dataList = res.data.result
            that.setData({ dataList })
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