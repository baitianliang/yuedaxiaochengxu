// pages/matchEvent/matchEvent.js
let app = getApp()
let util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: '',
    form: {},
    even: true,
    pic: [],
    apply: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let date = util.formatTime(new Date())
    this.setData({activityId: options.activityId})
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/activity/detail/${options.activityId}`,
      data: null,
      method: 'GET',
      success(res) {
        let form = res.data.result
        form.activityDescPic1 = JSON.parse(form.activityDescPic1)
        form.activityDescPic2 = JSON.parse(form.activityDescPic2)
        let pic = form.activityDescPic1
        if(form.activityStartTime.substring(0,10) < date)  
        that.setData({form, pic, apply: false})
        else
        that.setData({form, pic})
      }
    })
  },
  // 切换为赛事介绍
  changeEven() {
    this.setData({
      even: true,
      pic: this.data.form.activityDescPic1
    })
  },
  // 切换为报名须知
  changeApply() {
    this.setData({
      even: false,
      pic: this.data.form.activityDescPic2
    })
  },
  // 参赛作品
  getWorks() {
    let activityId = this.data.activityId
    wx.navigateTo({url: "../works/works?activityId=" + activityId})
  },
  // 报名按钮
  enroll() {
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: `https://xcx.jthapp.com/rest/common/user/info`,
          data: null,
          method: 'GET',
          header: {
            'Authorization': `Bearer ${res.data}`
          },
          success (e) {
            if(e.statusCode === 401) 
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
            app.userId = e.data.result.userId
            wx.navigateTo({
              url: `../baoming/baoming?t=${res.data}`
            })
          }
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