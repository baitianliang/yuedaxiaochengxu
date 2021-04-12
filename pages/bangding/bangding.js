// pages/shezhi/shezhi.js
const qiniuUploader = require("../../utils/qiniuUploader");
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      userId: '',
      enrollActivityId: '',
      enrollActivityLevelId: null,
      enrollTrueName: '',
      enrollSex: null,
      enrollProvinceId: null,
      enrollProvinceName: '',
      enrollCityId: null,
      enrollCityName: '',
      enrollDistrictId: null,
      enrollDistrictName: '',
      enrollAddr: '',
      enrollBirthday: '',
      enrollStudyTime: '',
      enrollIdCard: '',
      enrollIdCardPic: '',
      enrollPhone: '',
      enrollMail: '',
      enrollGov: '',
      enrollTeacher: '',
      enrollTeacherPhone: '',
      checkbox: false
    },
    array: ['女', '男'],
    enrollId: '',
    show: false,
    dataList: [],
    token: '',
    active: null,
    workId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ enrollId: options.enrollId })
    this.getForm()
  },
  // 获取报名信息
  getForm() {
    let that = this
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/enroll/detail/score/${this.data.enrollId}`,
      data: null,
      method: 'GET',
      success (res) {
        let form = res.data.result
        form.enrollBirthday = form.enrollBirthday ? form.enrollBirthday.substring(0,10) : ''
        form.enrollStudyTime = form.enrollStudyTime ? form.enrollStudyTime.substring(0,10) : ''
        that.setData({ form })
      }
    })
  },
  // 绑定作品信息
  updateInfo() {
    let that = this
    wx.getStorage({
      key: 'token',
      success(res) {
        that.setData({ token: res.data })
        wx.request({
          url: `https://xcx.jthapp.com/rest/user/work/list/0/50`,
          data: null,
          method: 'GET',
          header: {
            'Authorization': 'Bearer ' + res.data,
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
            if(dataList.length === 0)
            wx.showToast({
              title: '暂无作品,请上传作品',
              icon: 'none',
              duration: 2000
            })
            that.setData({ dataList, show: true })
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
  conHandle() {
    let data = {
      enrollId: this.data.enrollId,
      workId: this.data.workId
    },
    that = this
    wx.request({
      url: `https://xcx.jthapp.com/rest/user/enroll/work/relation`,
      data,
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + this.data.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        if (res.statusCode != 200) {
          wx.showToast({
            title: '作品已关联,请勿多次关联同一作品',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          that.getForm()
        }
      }
    })
  },
  checkWork(e) {
    let { index, workid } = e.currentTarget.dataset
    this.setData({ active: index, workId: workid })
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