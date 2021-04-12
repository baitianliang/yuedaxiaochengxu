// pages/faxian/faxian.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    offset: 0,
    limit: 20,
    dataList: [],
    loading: false,
    searchLevel: '全部组别',
    levelList: [],
    showLevelList: false,
    allLevel: {
      activityLevelName: '全部组别',
      activityLevelId: ''
    },
    activityLevelId: ''
  },
  // 点击作品跳转作品详情页
  details(val) {
    this.setData({showLevelList: false})
    let scoreId = val.currentTarget.dataset.scoreid
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/work/view/${scoreId}`,
      data: null,
      method: 'GET',
      success (res) {
        wx.navigateTo({
          url: '../startAudio/startAudio?scoreId=' + scoreId
        })
      }
    })
  },
  // 获取作品列表
  getDataList() {
    let { offset, limit, activityId, activityLevelId } = this.data, that = this
    let str = activityLevelId ? `&&activityLevelId=${activityLevelId}` : ''
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/enroll/list/score/${offset}/${limit}?activityId=${activityId}&&isOrder=a&&isWork=a${str}`,
      data: null,
      method: 'GET',
      success (res) {
        let list = [...that.data.dataList, ...res.data.result]
        list.every(el => el.average = parseInt(el.average))
        that.setData({
          dataList: list,
          loading: false
        })
      }
    })
  },
  // 获取组别列表
  getLevelList() {
    let { activityId } = this.data, that = this
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/activity/level/list/${activityId}`,
      data: null,
      method: 'GET',
      success (res) {
        let levelList = res.data.result
        that.setData({ levelList })
      }
    })
  },
  // 组别筛选按钮
  showLevelList() {
    this.setData({showLevelList: !this.data.showLevelList})
  },
  // 切换组别查询
  changeLevel(val) {
    let { activityLevelName, activityLevelId } = val.target.dataset.val
    this.setData({searchLevel: activityLevelName, activityLevelId, dataList: [], showLevelList: false})
    this.getDataList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({activityId: options.activityId})
    this.getDataList()
    this.getLevelList()
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
      offset: this.data.offset + 20,
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