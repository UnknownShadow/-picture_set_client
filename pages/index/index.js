// pages/home/home.js
let App = getApp();

var loadMoreView, page
const http = require('../../utils/http')
const ui = require('../../utils/ui')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    ads: [],
    system: {},
    items: [],
    selectedView: 'article',
    float: false
  },


  //统计用户进入次数
  setTimes: function () {
    App._post_form('setTimes', {
      id: wx.getStorageSync('user_id')
    }, function (result) {
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;

    let user_id = wx.getStorageSync('user_id');
    console.log("用户登录后的user_id：", user_id);

    //统计用户进入小程序的次数
    _this.setTimes();

    if (user_id == "") {
      //跳转到登录页面
      wx.redirectTo({
        url: "/pages/login/login"
      });
    }

    page = 0;

    loadMoreView = _this.selectComponent("#loadMoreView");

    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          system: res
        })
      },
    })

    this.loadData('article', true);
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
    page = 0
    this.loadData(this.data.selectedView, false)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    page = 0
    this.loadData(this.data.selectedView, false)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    page = 0
    this.loadData(this.data.selectedView, false)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    loadMoreView.loadMore()
  },

  onPageScroll: function (e) {
    console.log(e)
    if (e.scrollTop >= this.data.system.windowWidth / 9 * 5 && !this.data.float) {
      this.setData({
        float: true
      })
    } else if (e.scrollTop < this.data.system.windowWidth / 9 * 5 && this.data.float) {
      this.setData({
        float: false
      })
    }
  },
  switchView: function (e) {
    page = 0
    this.loadData(e.target.id, true)
  },

  loadData: function (viewType, showLoading) {
    var that = this;
    http.post({
      // url: 'http://192.168.0.199:8080/small/api/index',
      url: 'https://meitu.byte160.com/small/api/index',
      data: {
        page: page,
        limit: 20,
      },
      showLoading: showLoading,
      success: (res) => {

        console.log("返回数据：", res);

        var items = that.data;
        if (page == 0) {
          items.data = res;
          wx.stopPullDownRefresh()
        } else {
          console.log("加载数据===：", res);
          // items=res;
          items.data = items.data.concat(res);
        }
        that.setData({
          items: items.data,
          selectedView: viewType,
        })
        loadMoreView.loadMoreComplete(res)
      },
      fail: () => {
        if (page != 0) {
          loadMoreView.loadMoreFail()
        }
      }
    })
  },
  loadMoreListener: function (e) {
    page += 1
    this.loadData(this.data.selectedView, false)
  },
  clickLoadMore: function (e) {
    this.loadData(this.data.selectedView, false)
  },
  clickItem: function (e) {
    var link = this.data.items[e.currentTarget.id].link
    ui.navigateTo(`../../pages/detail/detail?link=${link}`)
  },
  clickAdItem: function (e) {
    var url = e.currentTarget.dataset.url
    ui.navigateTo(`../../pages/detail/detail?link=${url}`)
  },
  /**
  *  跳转到详情页面 
  */
  details: function (e) {
    let _this = this,
      title = e.currentTarget.dataset.title,
      id = e.currentTarget.dataset.id,
      date = e.currentTarget.dataset.date;;

    wx.navigateTo({
      url: '../details/index?id=' + id + '&title=' + title + '&date=' + date,
    });
  },
})