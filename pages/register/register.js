// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    code: '',
    passWord: '',
    nextPassWord: '',
    trueName: '',
    getCode: '获取验证码',
    loading: false,
    disabled: true,
    rules: [{
      name: 'userName',
      rule: '用户名'
    },{
      name: 'code',
      rule: '验证码'
    },{
      name: 'passWord',
      rule: '密码'
    },{
      name: 'trueName',
      rule: '真实姓名'
    }]
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
  // 保存再次输入的密码
  saveNextPassWord(val) {
    this.setData({
      nextPassWord : val.detail.value
    })
  },
  // 保存真实姓名
  saveTrueName(val) {
    this.setData({
      trueName : val.detail.value
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
    let mobileId = this.data.userName
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/util/reg/sms/${mobileId}`,
      data: null,
      method: 'GET',
      success(res) {
        wx.showToast({
          title: res.data.statusDesc,
          icon: 'none',
          duration: 2000
        })
        if(res.data.statusDesc === "操作成功")
        this.getCodeLoading(60)
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
  // 注册按钮
  newUser() {
    for(let val of this.data.rules) {
      if(!this.data[val.name])
      return wx.showToast({
        title: '请输入' + val.rule,
        icon: 'none',
        duration: 2000
      })
    }
    if(this.data.passWord !== this.data.nextPassWord)
    return wx.showToast({
      title: '两次密码输入不一致',
      icon: 'none',
      duration: 2000
    })
    let data = {
        userName: this.data.userName,
        password: this.data.passWord,
        mobileId: this.data.userName,
        mobileCode: this.data.code,
        trueName: this.data.trueName,
    }
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/user/reg/code`,
      data,
      method: 'POST',
      success(res) {
        wx.showToast({
          title: res.data.statusDesc,
          icon: 'none',
          duration: 2000
        })
        wx.navigateBack()
      },
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