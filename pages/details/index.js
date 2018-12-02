let App = getApp();

Page({
  data: {
    title: '',
    id: 0,
    date: '',
    details: {},
    imgList: [],
  },

  onLoad: function (option) {
    let _this = this;
    _this.setData({
      title: option.title,
      id: option.id,
      date: option.date,
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

      //将图片放入imgList中，预览需要
      var imgList = new Array();
      if (result.code == 0) {
        for (var i = 0; i < result.data.length; i++) {
          imgList.push(result.data[i].img);
        }
      }
      _this.setData({ imgList: imgList });
      _this.setData(result);
    });
  },

  /**
   * 分享
   */

  onShareAppMessage: function (options) {
    var _this = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "等你来撩~~~", // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index', // 默认是当前页面，必须是以‘/’开头的完整路径
      imgUrl: '', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log("转发成功");
          _this.setShare(1);
        }
      },
      fail: function (res) {
        console.log("信息", res.errMsg);
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:cancel') {
          _this.setShare(0);
          console.log("用户取消转发");
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          _this.setShare(2);
          console.log("转发失败");
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function () {
        // 转发结束之后的回调（转发成不成功都会执行）
      }
    }
    // 来自页面内的按钮的转发
    // if (options.from == 'button') {
    //   var eData = options.target.dataset;
    //   console.log(eData.name); // shareBtn
    //   // 此处可以修改 shareObj 中的内容
    //   shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;
    // }
    // 返回shareObj
    return shareObj;
  },
  setShare: function (status) {
    let _this = this;
    console.log("diaoyong");
    App._post_form('setShare', {
      id: wx.getStorageSync('user_id'),
      categoryId: _this.data.id,
      status: status
    }, function (result) {
      // _this.setData(result);
    });
  },

  previewImage: function (e) {
    var current = e.target.dataset.src,
      picturesId = e.target.dataset.id;

    //记录当前用户点击的预览图片
    App._post_form('setPreview', {
      id: wx.getStorageSync('user_id'),
      picturesId: picturesId,
    }, function (result) {
    });

    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgList // 需要预览的图片http链接列表  
    })
  }


  // onShareAppMessage: function () {
  //   return {
  //     title: "等你来撩~~~",
  //     desc: "",
  //     path: "/pages/index/index"
  //   };
  // },

});