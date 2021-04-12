// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    code: '',
    passWord: '',
    loading: false,
    disabled: true,
  },

  // 保存用户名
  saveUserName(val) {
    this.setData({
      userName : val.detail.value
    })
  },
  // 保存短信验证码
  saveCode(val) {
    this.setData({
      code : val.detail.value
    })
  },
  // 保存密码
  savePassWord(val) {
    this.setData({
      passWord : val.detail.value
    })
  },
  // 获取验证码
  getCode() {
    if(!this.data.userName)
    return wx.showToast({
      title: '请输入手机号',
      icon: 'none',
      duration: 2000
    })
    let mobileId = this.data.userName,
    that = this
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/util/pwd/sms/${mobileId}`,
      data: null,
      method: 'GET',
      success(res) {
        wx.showToast({
          title: res.data.statusDesc,
          icon: 'none',
          duration: 2000
        })
        if(res.data.statusDesc === "操作成功")
        that.getCodeLoading(60)
      }
    })
  },
  // 获取验证码读秒
  getCodeLoading(val) {
    if(val === 0) 
    return this.setData({
      getCode : '获取验证码',
      loading : false
    })
    this.setData({
      getCode: '获取验证码' + val,
      loading: true,
      disabled: false
    })
    setTimeout(() => {
      val = val - 1
      this.getCodeLoading(val)
    }, 1000);
  },
  // 忘记密码按钮
  updatePaw() {
    if(!this.data.userName) 
    return wx.showToast({
      title: '请输入手机号',
      icon: 'none',
      duration: 2000
    })
    if(!this.data.code) 
    return wx.showToast({
      title: '请输入验证码',
      icon: 'none',
      duration: 2000
    })
    if(!this.data.passWord) 
    return wx.showToast({
      title: '请输入新密码',
      icon: 'none',
      duration: 2000
    })
    let data = {
        mobileId: this.data.userName,
        mobileCode: this.data.code,
        newPwd: this.data.passWord
    }
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/user/fpwd`,
      data,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.showToast({
          title: res.data.statusDesc,
          icon: 'none',
          duration: 2000
        })
        wx.navigateBack()
      }
    })
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