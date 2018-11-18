let App = getApp();

Page({
  data: {
    no_more: false,
    scrollHeight: null,
    page: 0,

  },


  onLoad: function () {

    let _this = this;

    let user_id = wx.getStorageSync('user_id');
    console.log("用户登录后的user_id：", user_id);

    if (user_id == "") {
      //跳转到登录页面
      wx.redirectTo({
        url: "/pages/login/login"
      });
    }

    // 设置商品列表高度
    _this.setListHeight();

    // 获取首页数据
    _this.getIndexData();
  },

  onShow:function(){
    this.getIndexData();
  },
  

  /**
   * 获取首页数据
   */
  getIndexData: function (page) {
    let _this = this;

    //用于存储加载的数据
    var moment_list = _this.data;

    // 显示加载图标
    // wx.showLoading({
    //   title: '加载中',
    // })

    //page===undefined时，需要清空moment_list.data 原始数据
    if (typeof page === 'undefined') {
      moment_list.data = [];
    }

    App._post_form('index', {
      page: page || 0,
      limit: 10,
    }, function (result) {
     
      //第一次加载 moment_list.data 是undefined；
      //第一次加载后的每一次加载都将result.data数组添加到moment_list.data数组的后面
      //然后赋值给result.data
      if (typeof moment_list.data != 'undefined') {
        result.data = moment_list.data.concat(result.data);
      }

      _this.setData(result);
      // 隐藏加载框
      // wx.hideLoading();
    });
  },

  /**
   * 设置商品列表高度
   */
  setListHeight: function () {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight+10,
        });
      }
    });
  },


  /**
   * 分享
   */
  onShareAppMessage: function () {
    return {
      title: "等你来撩~~~",
      desc: "",
      path: "/pages/index/index"
    };
  },

  /**
   *  下拉刷新
   */
  // onPullDownRefresh: function () {

  //   // 显示顶部刷新图标
  //   wx.showNavigationBarLoading();

  //   let _this = this;
  //   _this.getIndexData();

  //   // 隐藏导航栏加载框
  //   wx.hideNavigationBarLoading();

  //   // 停止下拉动作
  //   wx.stopPullDownRefresh();
  // },



  /**
   *  跳转到详情页面 
   */
  details: function (e) {
    let _this = this,
      title = e.currentTarget.dataset.title,
      id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../details/index?id=' + id + '&title=' + title,
    });
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad: function () {
    // 已经是最后一页
    // if (this.data.page >= this.data.last_page) {

    var last_page = 50;

    if (this.data.page >= last_page) {
      this.setData({ no_more: true });
      return false;
    }
    this.getIndexData(++this.data.page);
  },



});