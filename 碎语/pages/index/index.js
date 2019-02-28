//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    contentData: new Array(),
    day: new Array(),

  },
  onReady: function() {
    this.getData();
  },
  onLoad: function() {

  },
  getData: function() {
    wx.request({
      url: 'https://judouapp.com/api/v6/op/sentences/daily?app_key=af66b896-665e-415c-a119-6ca5233a6963&channel=App%20Store&device_id=469dccddba93415a190ea85b3be62e98&device_type=iPhone11%2C8&page=1&per_page=45&platform=ios&signature=7a04331c4a72e0dab320f1444a35eade&system_version=12.1.4&timestamp=1550785419&version=3.7.0&version_code=45',
      success: (result) => {
        let data = result.data.data;
        let day = new Array();
        for (let i = 0; i < data.length; i++) {
          let date = data[i].daily_date;
          if (null != date) {
            day[i] = data[i].daily_date.split("-")[2];
            data[i].daily_date = this.getDate(date);

          }
        }
        this.setData({
          contentData: data,
          day: day
        });
        console.log(this.data.contentData[0])
        this.drawText(this.data.day[0], this.data.contentData[0].published_at);

      },
      fail: (error) => {
        console.log(error.errMsg)
        wx.showToast({
          title: '获取数据失败' + error.errMsg,
        })
      }
    })

  },
  getDate: function(date) {
    let d = new Date(date);
    let day = d.getDay();
    let week = [" 星期日", " 星期一", " 星期二", " 星期三", " 星期四", " 星期五", " 星期六"];
    return date.substring(0, 7).replace("-", ".") + week[day];

  },
  drawText: function(text, id) {
    const ctx = wx.createCanvasContext("TCanvas" + id, this)
    const grd = ctx.createLinearGradient(0, 0, 150, 150)
    grd.addColorStop(0, 'red')
    grd.addColorStop(1, 'black')
    ctx.setFillStyle(grd)
    ctx.setFontSize(48)
    ctx.fillText(text, 20, 50)
    ctx.draw();

  },
  pageChange: function(e) {
    let current = e.detail.current
    if (this.data.contentData[current].image == null) {
      return;
    }
    this.drawText(this.data.day[current], this.data.contentData[current].published_at)

  }


})