//引入计算农历方法
var Lunar = require('../../utils/lunar.js');
// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../libs/bmap-wx.min.js');
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js');
var b = 0, j = -1, i = 1;

Page({
  data: {
    h: true,
    weatherData: '',
    yunshi: '',
    xingshu: '',
    shuju: "",
    img: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    day: new Date().getDate(),
    img_data: ["../../img/baiyang.png", "../../img/jinniu.png", "../../img/shuangzi.png", "../../img/juxie.png", "../../img/shizizuo.png", "../../img/chunvzuo.png", "../../img/tiancheng.png", "../../img/tianxie.png", "../../img/sheshou.png", "../../img/moxie.png", "../../img/shuiping.png", "../../img/shuangyu.png"],
    holiday_list: '',
    holiday: { "status": "0", "msg": "ok", "result": { "2017-01-01": { "name": "元旦", "content": "1月1日放假，1月2日（星期一）补休。" }, "2017-01-27": { "name": "春节", "content": "1月27日至2月2日放假调休，共7天。1月22日（星期日）、2月4日（星期六）上班。" }, "2017-04-02": { "name": "清明节", "content": "4月2日至4日放假调休，共3天。4月1日（星期六）上班。" }, "2017-05-01": { "name": "劳动节", "content": "5月1日放假，与周末连休。" }, "2017-05-28": { "name": "端午节", "content": "5月28日至30日放假调休，共3天。5月27日（星期六）上班。" }, "2017-10-01": { "name": "中秋节 国庆节", "content": "10月1日至8日放假调休，共8天。9月30日（星期六）上班。" } } }
  },
  onLoad: function () {
    var that = this;

    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'sUB7PwsM4kLQ9gTovXZrkFMxjb5MCEri'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      var weatherData = data.currentWeather[0];
      weatherData = weatherData.currentCity + "    " + weatherData.weatherDesc + "    " + weatherData.temperature;
      that.setData({
        weatherData: weatherData,
      });
    }
    // 发起weather请求 
    BMap.weather({
      fail: fail,
      success: success
    });

    var date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    date = year + "-" + month + "-" + day;
    util.getHoliday(that, year, month, day);
    let type = 6;
    if (wx.getStorageSync('id')) {
      type = wx.getStorageSync('id');
    }


    wx.request({
      url: 'https://cal.meizu.com/android/unauth/horoscope/gethoroscope.do?type=' + type + '&date=' + date + '&searchType=2',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        let n = res.data.value[0].pointAll;
        var xingshu = '';
        for (let i = 0; i < n; i++) {
          xingshu += "★";
        }
        for (let i = 0; i < 5 - n; i++) {
          xingshu += "☆";
        }

        that.setData({
          yunshi: res.data.value[0].shorts,
          xingshu: xingshu,
          shuju: res.data.value[0],
          img: that.data.img_data[type - 1]
        });

      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  details: function () {
    var that = this;
    wx.navigateTo({
      url: '../page/xingzhuo?data=' + JSON.stringify(this.data.shuju),
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {

        // complete
      }
    })

  },
  onReady: function () {
    this.canvasCalendar(0, 0);
  },
  canvasCalendar: function (i, a) {
    var that = this;
    let week = new Array("一", "二", "三", "四", "五", "六", "日");
    //获取年月日
    let year = this.data.year;
    let month = this.data.month + i;

    let day = this.data.day - a;

    that.setData({
      month: month,
      year: year
    }
    )
    //获取本月有多少天
    var tianshu = new Date(year, month, 0);
    tianshu = tianshu.getDate();
    //获取每月第一天为周几
    var t = new Date(year, month - 1, 1);
    let fistweek = t.getDay();

    let w, h = 40, j = fistweek == 0 ? 7 : fistweek;
    wx.getSystemInfo({
      success: function (res) {
        w = res.windowWidth / 7 - 10;
      }
    })

    var ctx = wx.createContext();
    var ctxlunar = wx.createContext();


    //绘制星期栏
    ctx.setFontSize(18);
    for (let i = 0; i < week.length; i++) {
      ctx.fillText(week[i], w * (i + 1), h);
    }
    wx.drawCanvas({
      canvasId: 'weeks',
      actions: ctx.getActions()
    })

    //绘制日历栏
    ctx.setFontSize(20);
    for (let i = 0; i < tianshu; i++) {

      if (j > 7) {
        j = 1;
        h += 60;
      }
      if (i + 1 == day) {
        ctx.setFillStyle('red');
        ctx.arc(w * j + 10, h, 23, 0, 2 * Math.PI)
        ctx.fill();
        ctx.setFillStyle('white');
      }
      else {
        ctx.setFillStyle('black');
      }
      if ((i + 1) <= 9) {
        ctx.fillText(i + 1 + "", w * j + 6, h);
      }
      else {
        ctx.fillText(i + 1 + "", w * j, h);
      }

      //获得农历
      ctx.setFontSize(10);
      let jieqi;
      let lunar;
      let d = new Date(year, month - 1, i + 1);
      let f = d.getDay() == 0 ? 7 : d.getDay();
      let lunarmonth = Lunar.calendar.solar2lunar(year, month, i + 1).lMonth;
      if (Lunar.calendar.solar2lunar(year, month, i + 1).IDayCn == "初一") {
        lunar = Lunar.calendar.solar2lunar(year, month, i + 1).IMonthCn;
      }
      else {
        lunar = Lunar.calendar.solar2lunar(year, month, i + 1).IDayCn;

      }
      //公农历节日
      if (month == 1 && (i + 1) == 1) {
        jieqi = "元旦节"
      }
      else if (lunar == "初八" && lunarmonth == 12) {
        jieqi = "腊八节"
      } else if (lunar == "正月" && lunarmonth == 1) {
        jieqi = "春节"
      } else if (lunar == "十五" && lunarmonth == 1) {
        jieqi = "元宵节"
      }
      else if (lunar == "初二" && lunarmonth == 2) {
        jieqi = "龙头节"
      }
      else if (month == 2 && (i + 1) == 14) {
        jieqi = "情人节"
      }
      else if (month == 3 && (i + 1) == 8) {
        jieqi = "妇女节"
      } else if (month == 3 && (i + 1) == 12) {
        jieqi = "植树节"
      } else if (month == 3 && (i + 1) == 15) {
        jieqi = "消权日"
      } else if (month == 4 && (i + 1) == 1) {
        jieqi = "愚人节"
      } else if (month == 4 && (i + 1) == 22) {
        jieqi = "地球日"
      }
      else if (month == 5 && (i + 1) == 1) {
        jieqi = "劳动节"
      }
      else if (month == 5 && (i + 1) == 4) {
        jieqi = "青年节"
      } else if (month == 5 && (i + 1) == 12) {
        jieqi = "护士节"
      }
      else if (lunar == "初五" && lunarmonth == 5) {
        jieqi = "端午节"
      }
      else if (month == 6 && (i + 1) == 1) {
        jieqi = "儿童节"
      } else if (month == 6 && (i + 1) == 5) {
        jieqi = "环境日"
      } else if (month == 7 && (i + 1) == 1) {
        jieqi = "建党节"
      } else if (month == 8 && (i + 1) == 1) {
        jieqi = "建军节"
      } else if (lunar == "初七" && lunarmonth == 7) {
        jieqi = "七夕节"
      } else if (lunar == "十五" && lunarmonth == 7) {
        jieqi = "中元节"
      } else if (month == 9 && (i + 1) == 10) {
        jieqi = "教师节"
      } else if (month == 10 && (i + 1) == 1) {
        jieqi = "国庆节"
      } else if (lunar == "十五" && lunarmonth == 8) {
        jieqi = "中秋节"
      } else if (lunar == "初九" && lunarmonth == 9) {
        jieqi = "重阳节"
      } else if (lunar == "初一" && lunarmonth == 10) {
        jieqi = "寒衣节"
      } else if (month == 12 && (i + 1) == 1) {
        jieqi = "HIV日"
      } else if (lunar == "十五" && lunarmonth == 10) {
        jieqi = "下元节"
      } else if (month == 12 && (i + 1) == 24) {
        jieqi = "平安夜"
      } else if (month == 12 && (i + 1) == 25) {
        jieqi = "圣诞节"
      }
      else if (month == 5 && Math.ceil(((i + 1 + 7 - f) / 7)) == 2 && f == 7) {
        jieqi = "母亲节"
      } else if (month == 6 && Math.ceil(((i + 1 + 7 - f) / 7)) == 3 && f == 7) {
        jieqi = "父亲节"
      } else if (month == 11 && Math.ceil(((i + 1 + 7 - f) / 7)) == 4 && f == 4) {
        jieqi = "感恩节"
      }
      else {
        //二十四节气
        jieqi = Lunar.calendar.getjq(year, month, i + 1)
      }

      if (jieqi.length == 3) {
        ctx.fillText(jieqi == "" ? lunar : jieqi, w * j - 5, h + 11);

      }
      else {
        ctx.fillText(jieqi == "" ? lunar : jieqi, w * j, h + 11);
      }
      ctx.setFontSize(20);
      j++;
    }
    wx.drawCanvas({
      canvasId: 'myCanvas',
      actions: ctx.getActions()
    })
  },
  next: function () {

    this.canvasCalendar(i, new Date().getDate());
    this.hid();
    if (this.data.month > 12) {
      this.setData(
        {
          month: 1,
          year: this.data.year + 1
        }
      )
    }
    else {
      i = 1;
    }
  },
  pre: function () {

    this.canvasCalendar(j, new Date().getDate());
    this.hid();
    if (this.data.month < 1) {
      this.setData(
        {
          month: 12,
          year: this.data.year - 1
        }
      )
    }
    else {
      j = -1;
    }


  },
  day: function () {
    this.setData(
      {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        day: new Date().getDate(),
        h: true
      }
    )
    this.canvasCalendar(0, 0);
  },
  hid: function () {
    if (this.data.year == new Date().getFullYear() && this.data.month == (new Date().getMonth() + 1)) {
      this.setData(
        {
          h: true
        }
      )
    }
    else {
      this.setData(
        {
          h: false
        }
      )

    }
  },
  onShareAppMessage: function () {
    return {
      title: 'Q历',
      path: 'pages/index/index',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }

})
