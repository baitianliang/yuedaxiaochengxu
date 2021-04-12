// pages/saishi/saishi.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: {}
  },

  details(val) {
    let activityId = val.currentTarget.dataset.activityid
    app.activityId = activityId
    wx.navigateTo({
      url: '../matchEvent/matchEvent?activityId=' + activityId
    })
  },
  // 获取赛事列表
  getDataList() {
    let that = this
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/activity/list/0/20?activityStatus=active`,
      data: null,
      method: 'GET',
      // header: {
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // },
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
    this.getDataList()
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