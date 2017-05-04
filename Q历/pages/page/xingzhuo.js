
var util = require('../../utils/util.js');
Page({
  data: {
    data: '',
    xingzhuo: '',
    zhengti: '',
    aiqing: '',
    shiye: '',
    caifu: '',
    date: '',
    color: '',
    color1: '',
    color2: '',
    data1: '',
    mingcheng:'',
    mingcheng1:'',
    mingcheng2:'',
    mingcheng3:''
  },
  onLoad: function (options) {
    var data = JSON.parse(options.data);
    util.getyunshi(data, this);
    this.setData({
      color: 'red',
      color1: 'black',
      color2: 'black',
      data1: data,
       mingcheng:'幸运颜色',
    mingcheng1:'贵人方位',
    mingcheng2:'贵人星座',
    mingcheng3:'幸运数字'

    })
    wx.setNavigationBarTitle({
      title: '星座运势'
    })
  },
  jintian: function () {

    util.getyunshi(this.data.data1, this);
    this.setData({
      color: 'red',
      color1: 'black',
      color2: 'black',
        mingcheng:'幸运颜色',
    mingcheng1:'贵人方位',
    mingcheng2:'贵人星座',
    mingcheng3:'幸运数字'

    })

  },
  benzhou: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    that.setData({
      color: 'black',
      color1: 'red',
      color2: 'black',
        mingcheng:'幸运颜色',
    mingcheng1:'贵人方位',
    mingcheng2:'贵人星座',
    mingcheng3:'幸运数字'

    })
    var date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    date = year + "-" + month + "-" + day;

    let type = 6;
    if (wx.getStorageSync('id')) {
      type = wx.getStorageSync('id');
    }
    wx.request({
      url: 'https://cal.meizu.com/android/unauth/horoscope/getweekhoroscope.do?type=' + type + '&date=' + date,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        util.getyunshi(res.data.value[0], that);
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  benyue: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    that.setData({
      color: 'black',
      color1: 'black',
      color2: 'red',
        mingcheng:'开运物品',
    mingcheng1:'贵人方位',
    mingcheng2:'休闲解压',
    mingcheng3:'幸运数字'

    })
    var date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    date = year + "-" + month + "-" + day;

    let type = 6;
    if (wx.getStorageSync('id')) {
      type = wx.getStorageSync('id');
    }
    wx.request({
      url: 'https://cal.meizu.com/android/unauth/horoscope/getmonthhoroscope.do?type=' + type + '&date=' + date,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        util.getyunshi(res.data.value[0], that);
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        wx.hideLoading();
      }
    })
  },
  select_xingzuo: function () {
    wx.redirectTo({
      url: '../page/select_xingzhuo',
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })


  }
})