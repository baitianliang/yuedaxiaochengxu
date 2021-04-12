// pages/faxian/faxian.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    offset: 0,
    limit: 10,
    dataList: [],
    loading: false
  },

  details(val) {
    let workId = val.currentTarget.dataset.workid
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/work/view/${workId}`,
      data: null,
      method: 'GET',
      success (res) {
        wx.navigateTo({
          url: '../startAudio/startAudio?workId=' + workId
        })
      }
    })
  },
  getDataList() {
    let { offset, limit } = this.data, that = this
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/work/list/${offset}/${limit}?workStatus=active`,
      data: null,
      method: 'GET',
      // header: {
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // },
      success (res) {
        let list = [...that.data.dataList, ...res.data.result]
        that.setData({
          dataList: list,
          loading: false
        })
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
    if(this.data.loading) return
    this.setData({
      offset: this.data.offset + 10,
      loading: true
    })
    this.getDataList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})