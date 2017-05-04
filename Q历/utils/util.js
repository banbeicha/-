
function xingshu(n) {
  let zhengti;
  for (let i = 0; i < n; i++) {
    zhengti += "★";
  }
  for (let i = 0; i < 5 - n; i++) {
    zhengti += "☆";
  }
  return zhengti;
}


function getyunshi(data, a) {
  var text_data = ["白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "魔蝎座", "水平座", "双鱼座"];
  var date_data = ["3.21-4.19", "4.20-5.20", "5.21-6.21", "6.22-7.22", "7.23-8.22", "8.23-9.22", "9.23-10.23", "10.24-11.22", "11.23-12.21", "12.22-1.19", "1.20-2.18", "2.19-3.20"];

  let type = wx.getStorageSync('id') ? wx.getStorageSync('id') : 6;


  var xingzhuo = text_data[type - 1];
  var date = date_data[type - 1];



  let n = data.pointAll;
  var zhengti = xingshu(n).substring(9);


  n = data.pointLove;
  let aiqing = xingshu(n).substring(9);


  n = data.pointCareer;
  let shiye = xingshu(n).substring(9);


  n = data.pointFortune;
  let caifu = xingshu(n).substring(9);

  a.setData({
    data: data,
    xingzhuo: xingzhuo,
    zhengti: zhengti,
    aiqing: aiqing,
    shiye: shiye,
    caifu: caifu,
    date: date

  })

}

function getHoliday(that, year, month, day) {

  wx.getStorage({
    key: 'year',
    success: function (res) {
       console.log("获得日期成功")
      if ((new Date().getFullYear()) > res.data) {
        wx.clearStorage({
          key: 'jie',
          success: function (res) {
            console.log("清理缓存成功")
            wx.setStorage({
              key: 'year',
              data: new Date().getFullYear(),
              success: function (res) {
                console.log("缓存新日期成功")
              },
              fail: function (res) {
                console.log("缓存新日期失败")

              },
              complete: function (res) {
                // complete
              }
            })
            // success
          },
          fail: function (res) {
            console.log("清理缓存失败")
          },
          complete: function (res) {
            // complete
          }
        })
      }

    },
    fail: function (res) {
      wx.setStorage({
        key: 'year',
        data: year,
        success: function (res) {
          console.log("缓存日期成功")
        },
        fail: function (res) {
          console.log("缓存日期失败")
        },
        complete: function (res) {
          // complete
        }
      })
    },
    complete: function (res) {
      // complete
    }
  })
  wx.getStorage({
    key: 'jie',
    success: function (res) {
          console.log("获得放假缓存成功")
      chuli(that, res.data, year, month, day)
    },
    fail: function (res) {
      wx.request({
        url: 'https://api.jisuapi.com/calendar/holiday?appkey=c8a9b267dee09c53',
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
          chuli(that, res.data, year, month, day)
          wx.setStorage({
            key: 'jie',
            data: res.data,
            success: function (res) {
            },
            fail: function (res) {
              // fail
            },
            complete: function (res) {
              // complete
            }
          })
        },
        fail: function (res) {
          console.log("数据请求失败" + res.data)
        },
        complete: function (res) {
          // complete
        }
      })
    },
    complete: function (res) {
      // complete
    }
  })

}
function chuli(that, data, year, month, day) {
  var data = data.result;
  var holiday_list = new Array();
  var j = 0;
  for (var i in data) {
    let c = data[i].content;
    let n = c.indexOf("月");
    let a = c.indexOf("日");
    let m = c.substring(0, n)
    let d = c.substring(n + 1, a);

    if (month == m) {
      if (day < d) {
        holiday_list[j] = { id: j, date: GetDateDiff(year + "-" + month + "-" + day, i), content: data[i].name + ":    " + c }
        j++
      }
    }
    else if (month < m) {
      holiday_list[j] = { id: j, date: GetDateDiff(year + "-" + month + "-" + day, i), content: data[i].name + ":    " + c }
      j++
    }



  }
  that.setData({
    holiday_list: holiday_list

  })



}
function GetDateDiff(start, end) {
  var startTime = new Date(Date.parse(start.replace(/-/g, "/"))).getTime();
  var endTime = new Date(Date.parse(end.replace(/-/g, "/"))).getTime();
  var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
  return dates + "天后";

}
module.exports = {
  getHoliday: getHoliday,
  xingshu: xingshu,
  getyunshi: getyunshi
}