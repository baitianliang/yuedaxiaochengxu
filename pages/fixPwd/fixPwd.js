// pages/fixPwd/fixPwd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPwd: '',
    newPwd: '',
    conPwd: '',
    rules:[{name: 'oldPwd', rule: '旧密码'},
          {name: 'newPwd', rule: '新密码', min: 6},
          {name: 'conPwd', rule: '确认新密码', min: 6}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 保存旧密码
  saveOldPwd(val) {
    this.setData({
      oldPwd : val.detail.value
    })
  },
  // 保存新密码
  saveNewPwd(val) {
    this.setData({
      newPwd : val.detail.value
    })
  },
  // 保存确认新密码
  saveConPwd(val) {
    this.setData({
      conPwd : val.detail.value
    })
  },
  // 修改密码
  updatePaw() {
    for(let val of this.data.rules) {
      if(!this.data[val.name])
      return wx.showToast({
        title: '请输入' + val.rule,
        icon: 'none',
        duration: 2000
      })
      if(val.min && this.data[val.name].length < val.min)
      return wx.showToast({
        title: val.rule + '不得少于六位',
        icon: 'none',
        duration: 2000
      })
    }
    let { oldPwd, newPwd, conPwd } = this.data
    if(newPwd !== conPwd) 
    return wx.showToast({
      title: '两次输入密码不一致',
      icon: 'none',
      duration: 2000
    })
    let token = ''
    wx.getStorage({
      key: 'token',
      success(res) {
        token = res.data
        wx.request({
          url: `https://xcx.jthapp.com/rest/common/user/pwd`,
          data: { oldPwd, newPwd },
          method: 'POST',
          header: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            if(res.data.status !== 0) {
              return wx.showToast({
                title: res.data.statusDesc,
                icon: 'none',
                duration: 2000
              })
            }
            wx.showToast({
              title: '修改成功，请重新登录',
              icon: 'none',
              duration: 2000
            })
            wx.removeStorage({
              key: 'token',
              success() {
                wx.reLaunch({
                  url: '../login/login'
                })
              }
            })
          }
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