//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '福州印象欢迎您！',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '个人中心',
    })
    var userInfoTemp = {
      "avatarUrl": "../image/tabBar2.png",
      "nickName": "未登录"
    };
    if (app.globalData.userInfo) {
      userInfoTemp = app.globalData.userInfo;
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        userInfoTemp = res.userInfo;
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          userInfoTemp = app.globalData.userInfo;
        }
      })
    };
    this.setData({
      list: [{
        text: '头像',
        tip: '',
        img: true,
        info: userInfoTemp.avatarUrl
      }, {
        text: '昵称',
        tip: '',
          url: '../components/username-edit/username-edit',
        info: userInfoTemp.nickName
      }, {
        text: '绑定手机号',
        tip: '',
        url: '../components/tel-bind/tel-bind',
        info: userInfoTemp.mobile || '尚未绑定'
      }]
    });
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      list: [{
        text: '头像',
        tip: '',
        img: true,
        info: app.globalData.userInfo.avatarUrl
      }, {
        text: '昵称',
        tip: '',
        url: 'pages/components/username-edit',
        info: app.globalData.userInfo.nickName
      }, {
        text: '绑定手机号',
        tip: '',
        url: 'tel-bind/tel-bind',
        info: app.globalData.userInfo.mobile || '尚未绑定'
      }]
    })
  },
  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    const that = this;
    if (url === undefined) {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths[0]);
          wx.uploadFile({
            url: resource.getUrl('/wx/upload'), // 仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              user: 'test'
            },
            success(res) {
              if (res.statusCode != 200) {
                resource.showTips(that, '图片上传失败');
                console.log(res);
                return;
              }
              var icon = res.data;
              resource.updateUserInfo({
                icon: icon
              }).then(res => {
                if (res.statusCode == 200) {
                  app.globalData.userInfo.avatarUrl = res.data.data.icon;
                  resource.showTips(that, '修改成功');
                  that.onLoad();
                } else {
                  resource.showTips(that, '修改失败');
                }
              });
            },
            fail(res) {
              console.log(res);
              resource.showTips(that, '图片上传失败');
            }
          });
        }
      });
    } else {
      wx.navigateTo({
        url
      });
    }
  }
})