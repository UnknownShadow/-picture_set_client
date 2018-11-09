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
   * 授权登录
   */
  authorLogin: function (e) {
    let _this = this;
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      return false;
    }
    wx.showLoading({ title: "正在登录", mask: true });
    // 执行微信登录
    wx.login({
      success: function (res) {
        console.log(e.detail.rawData);
        
        // 将json字符串转 json对象
        var jsonStr = e.detail.rawData;
        if(typeof jsonStr!= 'object'){
          jsonStr= jsonStr.replace(/\ufeff/g,"");//重点
          jsonStr = JSON.parse(jsonStr);
        }


        // 发送用户信息
        App._post_form('signIn'
          , {
            code: res.code,
            userInfo: jsonStr,
            // encrypted_data: e.detail.encryptedData,
            // iv: e.detail.iv,
            // signature: e.detail.signature
          }
          , function (result) {
            // 记录user_id
            wx.setStorageSync('user_id', result.data.userId);
            // 跳转回原页面
            // _this.navigateBack();
            //跳首页
            wx.switchTab({
              url: '../index/index',
            });
          }
          , false
          , function () {
            wx.hideLoading();
          });
      }
    });
  },

  /**
   * 授权成功 跳转回原页面
   */
  navigateBack: function () {
    wx.navigateBack();
    // let currentPage = wx.getStorageSync('currentPage');
    // wx.redirectTo({
    //   url: '/' + currentPage.route + '?' + App.urlEncode(currentPage.options)
    // });
  },

})