// pages/page/select_xingzhuo.js
Page({
  data: {

    data: ''
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '设置星座',
      success: function(res) {
        // success
      }
    })
    var img_data = ["../../img/baiyang.png", "../../img/jinniu.png", "../../img/shuangzi.png", "../../img/juxie.png", "../../img/shizizuo.png", "../../img/chunvzuo.png", "../../img/tiancheng.png", "../../img/tianxie.png", "../../img/sheshou.png", "../../img/moxie.png", "../../img/shuiping.png", "../../img/shuangyu.png"];
    var text_data = ["白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "魔蝎座", "水平座", "双鱼座"];
    var date_data = ["3.21-4.19", "4.20-5.20", "5.21-6.21", "6.22-7.22", "7.23-8.22", "8.23-9.22", "9.23-10.23", "10.24-11.22",  "11.23-12.21", "12.22-1.19", "1.20-2.18", "2.19-3.20"];
    var data = new Array();
    for (let i = 0; i < img_data.length; i++) {
      data[i] = {id:i+1, img_data: img_data[i], text_data: text_data[i], date_data: date_data[i] }
    }
   this.setData({
    data:data
   })
  },
  selects:function(event){
  wx.setStorageSync('id', event.target.dataset.id)
  wx.redirectTo({
    url: '../index/index',
    success: function(res){
      // success
    },
    fail: function(res) {
      // fail
    },
    complete: function(res) {
      // complete
    }
  })
  
  }
})