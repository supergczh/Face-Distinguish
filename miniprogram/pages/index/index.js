//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    fileID: '',
    cloudPath: '',
    imagePath: '',
  },

onLoad: function() {

  },
getface(){
      let payload  = { "image" : this.data.userimage,'image_type':"URL", 'face_field':'age'};
      wx.request({
        url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=',
        method: 'POST',
        data:JSON.stringify(payload),    //参数为键值对字符串
        header: {
          "Content-type" : "application/json",
        },
        success: res=>{
          console.log(res)
            this.setData({
                age:res.data.result.face_list[0].age
            })
        },

      })
},
getimage(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res => {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        
        const filePath = res.tempFilePaths[0]
       
            // 上传图片
        const cloudPath = (new Date()).valueOf() + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
              this.setData({
                fileID:res.fileID
              },e=>{
                wx.cloud.getTempFileURL({
                  fileList: [this.data.fileID], // 文件 ID
                  success: res => {
                    this.setData({
                      userimage:res.fileList[0].tempFileURL
                })
                    console.log(res.fileList[0].tempFileURL);
                    // 返回临时文件路径
                    wx.request({
                      url: res.fileList[0].tempFileURL,
                      method: 'GET',
                      responseType: 'arraybuffer',
                      success: res=> {
                      var base64 = wx.arrayBufferToBase64(res.data);
                      this.setData({
                        user:base64
                  })
                    }
                    })
                  },
                  fail: console.error
                })
              })
          },
        })
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },


})
