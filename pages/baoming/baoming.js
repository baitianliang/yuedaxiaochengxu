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
    rules: [{name: 'enrollTrueName', rule: '姓名'},
    {name: 'enrollSex', rule: '性别'},
    {name: 'enrollActivityLevelId', rule: '组别'},
    {name: 'enrollProvinceId', rule: '直辖市、省、自治区'},
    {name: 'enrollCityId', rule: '省辖市'},
    {name: 'enrollDistrictId', rule: '区\\县'},
    {name: 'enrollBirthday', rule: '出生日期'},
    {name: 'enrollStudyTime', rule: '开始学琴时间'},
    {name: 'enrollIdCard', rule: '证件号'},
    {name: 'enrollPhone', rule: '联系方式'}],
    fileList: [],
    activityLevelList: [],
    activityLevelIndex: null,
    provinceIndex: null,
    cityIndex: null,
    districtIndex: null,
    provinceList: [],
    cityList: [],
    districtList: [],
    array: ['女', '男'],
    token: '',
    index: 0,
    enrollId: '',
    radio: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { form } = this.data,
    token = options.t
    form.userId = app.userId
    form.enrollActivityId = app.activityId
    this.setData({ token, form })
    this.getQiniuToken()
    this.getProvinceList()
    this.getActivityLevelList(form.enrollActivityId)
  },
  // 获取省份列表
  getProvinceList() {
    let that = this
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/area/province/list`,
      data: null,
      method: 'GET',
      success (res) {
        let provinceList = res.data.result
        that.setData({ provinceList })
      }
    })
  },
  // 获取组别列表
  getActivityLevelList(activityId) {
    let that = this
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/activity/level/list/${activityId}`,
      data: null,
      method: 'GET',
      success (res) {
        let activityLevelList = res.data.result
        that.setData({ activityLevelList })
      }
    })
  },
  // 获取用户信息
  // getUserInfo(token) {
  //   let that = this
  //   this.setData({ token })
  //   wx.request({
  //     url: `https://xcx.jthapp.com/rest/common/user/info`,
  //     data: null,
  //     method: 'GET',
  //     header: {
  //       'Authorization': 'Bearer ' + token,
  //     },
  //     success (res) {
  //       let userInfo = res.data.result, fileList = [], index = 0
  //       if(userInfo.userAvatar) {
  //         fileList[0] = {url: userInfo.userAvatar}
  //       }
  //       userInfo.userBirth = userInfo.userBirth ? userInfo.userBirth.substring(0,10) : userInfo.userBirth
  //       index = userInfo.userSex ? userInfo.userSex : 0
  //       that.setData({ userInfo, fileList, index })
  //     }
  //   })
  // },
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
    let { fileList, form } = this.data
    qiniuUploader.upload(file.path, (res) => {
      fileList = [...fileList, {url: res.imageURL}]
      form.enrollIdCardPic = res.imageURL
      this.setData({ fileList, form })
    }, (error) => {
      console.error('error: ' + JSON.stringify(error));
    });
  },
  // 删除头像
  delete(e) {
    let { form } = this.data,
    fileList = []
    form.enrollIdCardPic = ''
    this.setData({ fileList, form })
  },
  // 保存表单
  saveform(e) {
    let { form } = this.data
    form[e.target.dataset.name] = e.detail.value
    this.setData({ form })
  },
  // 切换性别
  bindPickerChange(e) {
    let { form } = this.data
    form.enrollSex = e.detail.value
    this.setData({ form })
  },
  // 切换组别
  activityLevelChange(e) {
    let { form, activityLevelList } = this.data,
    activityLevelIndex = e.detail.value
    form.enrollActivityLevelId = activityLevelList[activityLevelIndex].activityLevelId
    this.setData({ form, activityLevelIndex })
  },
  // 切换省份
  provinceChange(e) {
    let { form, provinceList } = this.data,
    cityList = [],
    districtList = [],
    provinceIndex = e.detail.value,
    cityIndex = null,
    districtIndex = null
    form.enrollProvinceId = provinceList[provinceIndex].provinceId
    form.enrollProvinceName = provinceList[provinceIndex].provinceName
    form.enrollCityId = null
    form.enrollCityName = ''
    form.enrollDistrictId = null
    form.enrollDistrictName = ''
    this.setData({ form, cityList, districtList, provinceIndex, cityIndex, districtIndex })
    let that = this
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/area/city/list/${form.enrollProvinceId}`,
      data: null,
      method: 'GET',
      success (res) {
        let cityList = res.data.result
        that.setData({ cityList })
      }
    })
  },
  // 切换市区
  cityChange(e) {
    let { form, cityList } = this.data,
    districtList = [],
    cityIndex = e.detail.value,
    districtIndex = null
    form.enrollCityId = cityList[cityIndex].cityId
    form.enrollCityName = cityList[cityIndex].cityName
    form.enrollDistrictId = null
    form.enrollDistrictName = ''
    this.setData({ form, districtList, cityIndex, districtIndex })
    let that = this
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/area/district/list/${form.enrollCityId}`,
      data: null,
      method: 'GET',
      success (res) {
        let districtList = res.data.result
        that.setData({ districtList })
      }
    })
  },
  // 切换县区
  districtChange(e) {
    let { form, districtList } = this.data,
    districtIndex = e.detail.value
    form.enrollDistrictId = districtList[districtIndex].districtId
    form.enrollDistrictName = districtList[districtIndex].districtName
    this.setData({ form, districtIndex })
  },
  // 单选框切换
  checkboxChange() {
    let { form } = this.data
    form.checkbox = !form.checkbox
    this.setData({ form })
  },
  // 单选框切换
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  // 提交报名信息
  updateInfo() {
    let { form, rules, radio } = this.data,
    reg = new RegExp(/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/),
    that = this
    if(!form.checkbox)
    return wx.showToast({
      title: '请勾选已阅读',
      icon: 'none',
      duration: 2000
    })
    for(let item of rules) {
      if(!form[item.name]) 
      return wx.showToast({
        title: '请填写' + item.rule,
        icon: 'none',
        duration: 2000
      })
    }
    if(radio && !reg.test(form.enrollIdCard)) {
      return wx.showToast({
        title: '请填写正确身份证号',
        icon: 'none',
        duration: 2000
      })
    }
    if(form.enrollBirthday > form.enrollStudyTime)
    return wx.showToast({
      title: '学习日期不得早于出生日期',
      icon: 'none',
      duration: 2000
    })
    form.enrollBirthday = form.enrollBirthday ? form.enrollBirthday + ' 00:00:00' : form.enrollBirthday
    form.enrollStudyTime = form.enrollStudyTime ? form.enrollStudyTime + ' 00:00:00' : form.enrollStudyTime
    let data = {}
    for(let item in form) {
        if(!!form[item]) {
          data[item] = form[item]
        }
    }
    wx.request({
      url: `https://xcx.jthapp.com/rest/user/enroll/add`,
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
        else if(res.data.status == -1 || res.statusCode === 500) {
          wx.showToast({
            title: '报名失败，请重新登录或联系技术人员',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '报名成功',
            icon: 'success',
            duration: 2000
          })
          that.getEnroll(res.data.returnId)
        }
      }
    })
  },
  // 获取报名信息
  getEnroll(enrollId) {
    let that = this
    this.setData({ enrollId })
    wx.request({
      url: `https://xcx.jthapp.com/rest/public/enroll/detail/score/${enrollId}`,
      data: null,
      method: 'GET',
      success (res) {
        let form = { enrollId: res.data.result.enrollId, fee: res.data.result.activityLevelFee }
        that.pay(form)
      }
    })
  },
  // 支付
  pay(val) {
    let that = this
    wx.login({
      success: res => {
        let code = res.code,
        data = { code, ...val }
        wx.request({
          // url: `https://xcx.jthapp.com/rest/public/util/tenpay/prepay`,
          url: `https://xcx.jthapp.com/rest/public/util/tenpay/prepay/xcx`,
          data,
          method: 'POST',
          header: {
            // 'Authorization': 'Bearer ' + this.data.token,
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
            wx.requestPayment({
              timeStamp: res.data.result.timeStamp,
              nonceStr: res.data.result.nonceStr,
              package: "prepay_id="+res.data.result.package,
              signType: res.data.result.signType,
              paySign: res.data.result.sign,
              success (res) {
                wx.redirectTo({
                  url: '../bangding/bangding?enrollId=' + that.data.enrollId
                })
              },
              fail (res) {
              }
            })
          },
          fail(err) {
            console.log(err)
          }
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
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