// pages/shezhi/shezhi.js
const qiniuUploader = require("../../utils/qiniuUploader");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    fileList: [],
    array: ['女', '男'],
    token: '',
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo(options.t)
    this.getQiniuToken()
  },
  // 获取用户信息
  getUserInfo(token) {
    let that = this
    this.setData({ token })
    wx.request({
      url: `https://xcx.jthapp.com/rest/common/user/info`,
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
        let userInfo = res.data.result, fileList = [], index = 0
        if(userInfo.userAvatar) {
          fileList[0] = {url: userInfo.userAvatar}
        }
        userInfo.userBirth = userInfo.userBirth ? userInfo.userBirth.substring(0,10) : userInfo.userBirth
        index = userInfo.userSex ? userInfo.userSex : 0
        that.setData({ userInfo, fileList, index })
      }
    })
  },
  // 获取七牛token
  getQiniuToken() {
    let that = this
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/util/qiniu/token`,
      data: null,
      method: 'GET',
      success (res) {
        let qiniuToken = res.data
        that.qiniuConfig(qiniuToken)
      }
    })
  },
  // 上传七牛配置
  qiniuConfig(qiniuToken) {
    var options = {
      region: 'SCN', // 华南
      // ECN, SCN, NCN, NA, ASG，分别对应七牛的：华东，华南，华北，北美，新加坡 5 个区域
      uptoken: qiniuToken,
      // uptokenURL: 'https://[yourserver.com]/api/uptoken',
      // domain: 'https://qiniup.jthapp.com',
      domain: 'http://videos.jthapp.com',
      shouldUseQiniuFileName: false
    };
    qiniuUploader.init(options);
  },
  // 上传图片
  afterRead(event) {
    const { file } = event.detail;
    let { fileList, userInfo } = this.data
    qiniuUploader.upload(file.path, (res) => {
      fileList = [...fileList, {url: res.imageURL}]
      userInfo.userAvatar = res.imageURL
      this.setData({ fileList, userInfo })
    }, (error) => {
      console.error('error: ' + JSON.stringify(error));
    });
  },
  // 删除头像
  delete(e) {
    let { userInfo } = this.data,
    fileList = []
    userInfo.userAvatar = ''
    this.setData({ fileList, userInfo })
  },
  // 保存真实姓名
  saveUserName(val) {
    let { userInfo } = this.data
    userInfo.trueName = val.detail.value
    this.setData({ userInfo })
  },
  // 保存出生日期
  bindDateChange(e) {
    let { userInfo } = this.data
    userInfo.userBirth = e.detail.value
    this.setData({ userInfo })
  },
  // 保存邮箱
  saveUserEmail(val) {
    let { userInfo } = this.data
    userInfo.userEmail = val.detail.value
    this.setData({ userInfo })
  },
  // 保存身份证号
  saveUserIdCard(val) {
    let { userInfo } = this.data
    userInfo.userIdCard = val.detail.value
    this.setData({ userInfo })
  },
  // 切换性别
  bindPickerChange: function(e) {
    let { userInfo } = this.data
    userInfo.userSex = e.detail.value
    this.setData({
      index: e.detail.value,
      userInfo
    })
  },
  // 修改个人信息
  updateInfo() {
    let { userId, userAvatar, trueName, userSex, userBirth, userEmail, userIdCard } = this.data.userInfo
    userBirth = userBirth ? userBirth + ' 00:00:00' : userBirth
    if(!userIdCard) 
    return wx.showToast({
      title: '请输入身份证号',
      icon: 'none',
      duration: 2000
    })
    let data = { userId, userAvatar, trueName, userSex, userBirth, userEmail, userIdCard }
    wx.request({
      url: `https://xcx.jthapp.com/rest/common/user/info/update`,
      data,
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + this.data.token,
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
        else if(res.statusCode !== 200 ) {
          wx.showToast({
            title: '修改失败，请重新登录或联系技术人员',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack()
        }
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