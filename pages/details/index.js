let App = getApp();

Page({
  data: {
    title: '',
    id: 0,
    details:{},
  },

  onLoad: function (option) {
    let _this = this;
    _this.setData({
      title: option.title,
      id: option.id,
    });
    _this.getIndexData();
  },

  /**
   * 获取详情数据
   */
  getIndexData: function () {
    let _this = this;

    console.log("ID:", _this.data.id);

    App._get('details', {
      id: _this.data.id,
    }, function (result) {
      _this.setData(result);
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

});