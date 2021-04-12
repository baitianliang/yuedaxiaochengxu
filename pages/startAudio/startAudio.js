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

  likeWork() {
    let form = this.data.form, that = this
    form.workHit += 1
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/work/hit/${this.data.workId}`,
      data: null,
      method: 'GET',
      success (res) {
        that.setData({
          like: true,
          form
        })
        wx.setStorage({
          key: that.data.form.workId,
          data: that.data.form.workId
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if(!options.workId) {
      that.setData({
        page : 1,
        scoreId: options.scoreId
      })
      wx.request({
        url: `https://xcx.jthapp.com/rest/public/enroll/detail/score/${this.data.scoreId}`,
        data: null,
        method: 'GET',
        success (res) {
          let form = res.data.result,
          scoreList = res.data.supplement
          form.average = parseInt(form.average)
          that.setData({ workId: form.workId })
          wx.getStorage({
            key: form.workId,
            success: function(res){
              that.setData({ like: true })
            }
          })
          that.setData({ form, scoreList })
        }
      })
    } else {
      that.setData({ workId: options.workId })
      wx.request({
        url: `https://xcx.jthapp.com/rest/public/work/detail/${this.data.workId}`,
        data: null,
        method: 'GET',
        // header: {
        //   'Content-Type': 'application/x-www-form-urlencoded'
        // },
        success (res) {
          let form = res.data.result
          wx.getStorage({
            key: form.workId,
            success: function(res){
              that.setData({ like: true })
            }
          })
          that.setData({ form })
        }
      })
    }
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