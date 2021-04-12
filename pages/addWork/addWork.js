// pages/shezhi/shezhi.js
const qiniuUploader = require("../../utils/qiniuUploader");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    fileList: [],
    videoList: [],
    array: ['女', '男'],
    token: '',
    index: 0,
    workTag: '',
    workName: '',
    workNum: '',
    workAuthor: '',
    workArticle: '',
    workContent: '',
    workAvatar: '',
    workId: '',
    rules: [{name: 'workTag', rule: '演奏者姓名'},
            {name: 'workName', rule: '作品名称'},
            {name: 'workNum', rule: '作品号'},
            {name: 'workAuthor', rule: '作曲家'},
            {name: 'workArticle', rule: '乐段乐章'},]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.workId) 
    this.getWorkForm(options.workId)
    this.getQiniuToken()
  },
  getWorkForm(workId) {
    let that = this
    this.setData({ workId })
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/work/detail/${workId}`,
      data: null,
      method: 'GET',
      success (res) {
        let form = res.data.result,
        workTag = form.workTag,
        workName = form.workName,
        workNum = form.workNum,
        workAuthor = form.workAuthor,
        workArticle = form.workArticle,
        workContent = form.workContent,
        workAvatar = form.workAvatar
        that.setData({ workTag, workName, workNum, workAuthor, workArticle, workContent, workAvatar })
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
  // 检测视频格式
  videoBeforeRead(file) {
    console.log(file)
    if (file.type !== 'video/mp4') {
      wx.showToast({
        title: '请上传(mp4)视频文件',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    return true;
  },
  // 上传视频
  videoAfterRead(event) {
    const { file } = event.detail;
    let { videoList } = this.data
    qiniuUploader.upload(file.path, (res) => {
      videoList = [{url: res.fileURL}]
      let workContent = res.fileURL,
      workAvatar = res.fileURL + '?vframe/jpg/offset/1'
      this.setData({ videoList, workContent, workAvatar })
    }, (error) => {
      console.error('error: ' + JSON.stringify(error));
    });
  },
  // 上传作品封面
  afterRead(event) {
    const { file } = event.detail;
    let { fileList } = this.data
    qiniuUploader.upload(file.path, (res) => {
      fileList = [{url: res.imageURL}]
      let workAvatar = res.imageURL
      this.setData({ fileList, workAvatar })
    }, (error) => {
      console.error('error: ' + JSON.stringify(error));
    });
  },
  deleteWork() {
    let workContent = '', videoList = []
    this.setData({ workContent, videoList })
  },
  // 删除作品封面
  delete(e) {
    let workAvatar = '',
    fileList = []
    this.setData({ fileList, workAvatar })
  },
  // 添加视频
  updateInfo() {
    let { workTag, workName, workNum, workAuthor, workArticle, workContent, workAvatar } = this.data
    if(!workContent)
    return wx.showToast({
      title: '请上传作品视频',
      icon: 'none',
      duration: 2000
    })
    let data = { workTag, workName, workNum, workAuthor, workArticle, workContent, workAvatar }
    for(let item of this.data.rules) {
      if(!data[item.name])
      return wx.showToast({
        title: '请填写' + item.rule,
        icon: 'none',
        duration: 2000
      })
    }
    data.workAvatar = data.workAvatar ? data.workAvatar : data.workContent + '?vframe/jpg/offset/1'
    if(this.data.workId) 
    return this.compile(data)
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: `https://xcx.jthapp.com/rest/user/work/add`,
          data,
          method: 'POST',
          header: {
            'Authorization': 'Bearer ' + res.data,
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
                title: '添加失败，请重新登录或联系技术人员',
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 2000
              })
              wx.navigateBack()
            }
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
  compile(data) {
    data.workId = this.data.workId
    wx.getStorage({
      key: 'token',
      success(res) {
        wx.request({
          url: `https://xcx.jthapp.com/rest/user/work/update`,
          data,
          method: 'POST',
          header: {
            'Authorization': 'Bearer ' + res.data,
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