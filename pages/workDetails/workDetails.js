// pages/startAudio/startAudio.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    workId: '',
    scoreId: '',
    form: {},
    like: false,
    page: 0,
    scoreList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ workId: options.workId })
  },
  // 编辑按钮
  compile() {
    let workId = this.data.form.workId
    wx.navigateTo({
      url: '../addWork/addWork?workId=' + workId
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
    let that = this
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/work/detail/${this.data.workId}`,
      data: null,
      method: 'GET',
      success (res) {
        let form = res.data.result
        that.setData({ form })
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