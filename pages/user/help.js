let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取帮助列表
    this.getHelpList();
  },

  /**
   * 获取帮助列表
   */
  getHelpList: function () {
    let _this = this;
    
    App._post_form('getHelp', {}, function (result) {
      console.log('返回值：', result);
      _this.setData(result);
    });
  },

})