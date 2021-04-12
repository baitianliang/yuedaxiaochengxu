// pages/faxian/faxian.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    token: ''
  },

  details(val) {
    let workId = val.currentTarget.dataset.workid
    wx.navigateTo({
      url: '../workDetails/workDetails?workId=' + workId
    })
  },
  // 获取作品列表
  getDataList(token) {
    let that = this
    wx.request({
      url: `https://xcx.jthapp.com/rest/user/work/list/0/50`,
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
        let dataList = res.data.result
        that.setData({ dataList })
      }
    })
  },
  // 添加作品
  addWork() {
    wx.navigateTo({
      url: '../addWork/addWork'
    })
  },
  deleteWork(e) {
    let workId = e.currentTarget.dataset.workid,
    token = this.data.token,
    that = this
    wx.showModal({
      title: '提示',
      content: '确认删除该条作品',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          wx.request({
            url: `https://xcx.jthapp.com/rest/user/work/del/${workId}`,
            data: null,
            method: 'GET',
            header: {
              'Authorization': 'Bearer ' + token,
            },
            success (res) {
              if(res.data.status != 200)
              return wx.showToast({
                title: '作品已关联,删除失败',
                icon: 'none',
                duration: 2000
              })
              else
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              that.getDataList(token)
            }
          })
        } else {//这里是点击了取消以后
          wx.showToast({
            title: '已取消删除',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ token: options.t })
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
    this.getDataList(this.data.token)
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