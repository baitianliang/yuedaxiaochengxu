// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    passWord: ''
  },
  // 登录按钮
  login() {
    if(!this.data.userName||!this.data.passWord)
    return wx.showToast({
      title: '请输入用户名和密码',
      icon: 'none',
      duration: 2000
    })
    let username = this.data.userName, password = this.data.passWord,
    params = {
        client_id:'c1',
        client_secret:'secret',
        grant_type:'password',
        username,
        password,
    };
    wx.request({
      url: `https://xcx.jthapp.com/rest/oauth/token`,
      data: params,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        if(res.statusCode !== 200) {
          wx.showToast({
            title: '用户名或密码错误，请重新登录或联系技术人员',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.request({
            url: `https://xcx.jthapp.com/rest/common/user/info`,
            data: null,
            method: 'GET',
            header: {
              'Authorization': `Bearer ${res.data.access_token}`
            },
            success (e) {
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 2000
              })
              wx.setStorage({
                key: 'token',
                data: res.data.access_token
              })
              wx.reLaunch({
                url: '../faxian/faxian'
              })
            }
          })
        }
      }
    })
  },
  // 忘记密码
  forgetPassword() {
    wx.navigateTo({
      url: '../forget/forget',
    })
  },
  // 前往注册
  register() {
    wx.navigateTo({
      url: '../register/register',
    })
  },
  // 回到首页
  back() {
    wx.reLaunch({
      url: '../faxian/faxian'
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