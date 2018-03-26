//index.js
//获取应用实例
const app = getApp()

var ObjFun
var timing = 0
var H, W,CH
var interval = 20
var intervalHandler
var colors = ['rgb(255,255,255)', 'rgb(255,255,0)', 'rgb(255,0,255)', 'rgb(0,255,255)', 'rgb(0,255,0)', 'rgb(255,0,0)', 'rgb(0,0,255)']
var intervals=[25,20,10,5]
var fontSize = [80,100,180,150]
var speed = [1, 2, 3, 4]
var starSpeed = [30,40,50,60,70]
Page({
  data: {
    tool: 0,//0=模式选择  1=弹幕  2=星星  3=酷炫
    show: false,
    mode: 1,//1=弹幕模式 2=星星模式  3=酷炫模式
    showMode:false
  },
  Star: {
    text: '嫁给我吧！',
    colorMode:1,
    R: 255,
    G: 255,
    B: 255,
    fontSizeMode:2,
    opt: 1,//1=add -1=sub
    speedMode:2,
    blink: 25,
    blinkColorMode: 1,//1 = white->yellow,2=white->purple,3=white->cyan,4=white->green,5=white->red,6=white->blue
  },
  Text: {
    text: 'TFBOYS',
    speedMode: 2,//1=慢 2=正常 3=快 4=超快
    blink: true,
    fontSizeMode: 2,//1=小 2=中  3=大 4=超大
    colorMode: 4,//0=white , 1 = white->yellow,2=white->purple,3=white->cyan,4=white->green,5=white->red,6=white->blue
    blinkColorMode:4,
    blinkOffset: 30
  },

  onLoad: function () {
    var that = this
    W = wx.getSystemInfoSync().screenWidth
    H = wx.getSystemInfoSync().screenHeight
    CH = H
    that.setData({ W: W, H: H, CH: CH })
  },
  onShow: function () {
    var that = this
    if (wx.getStorageSync('mode')){
      that.setData({mode: wx.getStorageSync('mode')})
    }
    if (wx.getStorageSync('Text')){
      that.Text = JSON.parse(wx.getStorageSync('Text'))
    }
    if (wx.getStorageSync('Star')) {
      that.Star = JSON.parse(wx.getStorageSync('Star'))
    } 
    wx.setKeepScreenOn({
      keepScreenOn: true,
    })
    that.setModeFunc()
    that.update()
  },
  onHide:function(){
    wx.setStorageSync('mode', this.data.mode)
    wx.setStorage({
      key: 'Star',
      data: JSON.stringify(that.Star),
    })
    wx.setStorage({
      key: 'Text',
      data: JSON.stringify(that.Text),
    })
  },
  setModeFunc:function(){
    var that = this
    console.log('update mode=', that.data.mode)

    if (that.data.mode == 1) {
      that.setData({ Text: that.Text })
      ObjFun = that.updateText
    }

    if (that.data.mode == 2) {
      that.setData({ Star: that.Star })
      ObjFun = that.updateStar
    }
  },
  update: function () {
    var that = this 
    clearInterval(intervalHandler)
    if (that.data.show || that.data.showMode) {      
      console.log('canvas update pasued')
      return
    } 
   
    timing = 0
    var interval = 0
    var speedMode = 0
    if(that.data.mode==1){
      speedMode = that.Text.speedMode
      interval = intervals[speedMode - 1]
    }else if (that.data.mode == 2) {
      speedMode = that.Star.speedMode
      interval = intervals[speedMode - 1]
    }else if (that.data.mode == 3) {
       return 
    }else{
      return 
    }
    console.log('speedMode', speedMode, intervals[speedMode - 1])
    intervalHandler = setInterval(function () {
      ObjFun()
      timing++
    }, interval)
  },

  blinkColorSelect: function (e) {
    var that = this
    console.log('blinkColorSelect mode - >', that.data.mode)
    if(that.data.mode==1){
      that.Text.blinkColorMode = e.currentTarget.dataset.blinkcolormode
    }
    if (that.data.mode == 2) {
      that.Star.blinkColorMode = e.currentTarget.dataset.blinkcolormode
    }   
    that.setModeFunc()
  },
  colorSelect: function (e) {
    var that = this
    var colormode = e.currentTarget.dataset.colormode
    if (that.data.mode == 1) {
      that.Text.colorMode = colormode 
    }
    if (that.data.mode == 2) {
      that.Star.colorMode = colormode 
    }
    that.setModeFunc()     
  },
  fontSizeSelect:function(e){
    var that = this   
    var fontsizemode = e.currentTarget.dataset.fontsizemode
    if(that.data.mode==1){
      that.Text.fontSizeMode = fontsizemode
    } 
    if (that.data.mode == 2) {
      that.Star.fontSizeMode = fontsizemode
    }
     
    that.setModeFunc()
  },
  speedSelect: function(e){
    var that = this
    var speedmode = e.currentTarget.dataset.speedmode

    if(that.data.mode == 1){
      that.Text.speedMode = speedmode
    }

    if (that.data.mode == 2) {
      that.Star.speedMode = speedmode
    }
    
   
    that.setModeFunc()
  },
  modeSelect: function (e) {
    var that = this
    var mode = e.currentTarget.dataset.mode    

    if (mode != 1 && mode != 2 && mode!=3){
      return 
    }
    if (mode != that.data.mode) {
      //切换动画
      that.setData({ mode: mode})
    }
    that.setData({ showMode: false,CH:H })
    that.setModeFunc()
    that.update()
  },
  inputText:function(e){
    var that = this
    var text = e.detail.value
    that.Text.text = text
    that.setModeFunc()
  },
  clearText: function () {
    var that = this
    that.Text.text = ''
    that.setData({Text:that.Text})
    that.setModeFunc()
  },

  inputTextForStar:function(e){
    var that = this
    var text = e.detail.value
    that.Star.text = text 
    that.setModeFunc()   
  },
  showMode:function(){
    var that = this
    if (that.data.show){
      wx.showToast({
        title: '请完成设置',
      })
      return
    }
    that.setData({ showMode: !that.data.showMode })
    if (that.data.showMode ){
      this.setData({ CH: H - 120 - 30 })
    }else{
      this.setData({ CH: H})
    }
    that.setModeFunc()
    that.update() 
  },
  show: function () {
    var that = this
    console.log('show click', this.data.show)

    if (that.data.showMode){
      wx.showToast({
        title: '请选择模式',
      })
      return 
    }

    this.setData({ show: !this.data.show })
    if (!this.data.show) {
      this.setData({ tool: 0, CH: H })
    }

    if (that.data.mode == 1 && this.data.show) {
      this.setData({ CH: H - 250 - 30 })
    } 
    if (that.data.mode == 2 && this.data.show) {
      this.setData({ CH: H - 250 - 30 })
    } 
    if (that.data.mode == 3 && this.data.show) {
      this.setData({ CH: H - 250 - 30 })
    } 
    that.update() 
  },
  updateStar: function () {
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.clearRect(0, 0, W, CH)
    ctx.translate(W / 2, CH / 2)
    ctx.rotate(90 * Math.PI / 180)
    ctx.setTextBaseline('middle')
    ctx.setTextAlign('center')



    let w = 0
     
    /*
    if (this.Star.fontSizeMode == 1) {
      w = W - 150
      fontSize = 50
    }
    if (this.Star.fontSizeMode == 2) {
      w = W - 100
      fontSize = 70
    }
    if (this.Star.fontSizeMode == 3) {
      w = W
      fontSize = 110
    }*/

    
    //white->yellow
    if (this.Star.opt == 1) {
      var speed = starSpeed[this.Star.speedMode - 1]
      if (this.Star.blinkColorMode == 1) {
        this.Star.R = 255
        this.Star.G = 255
        this.Star.B -= speed
      }
      //white->purple    
      if (this.Star.blinkColorMode == 2) {
        this.Star.G -= speed
        this.Star.R = 255
        this.Star.B = 255
      }
      //white->cyan
      //this.Star.R--
      if (this.Star.blinkColorMode == 3) {
        this.Star.R -= speed
        this.Star.B = 255
        this.Star.G = 255
      }
      //white->green
      //this.Star.B--
      //this.Star.R--
      if (this.Star.blinkColorMode == 4) {
        this.Star.R -= speed
        this.Star.B -= speed
        this.Star.G = 255
      }
      //white->red
      //this.Star.B--
      //this.Star.G--
      if (this.Star.blinkColorMode == 5) {
        this.Star.G -= speed
        this.Star.B -= speed
        this.Star.R = 255 
      }
      //white->blue
      //this.Star.R--
      //this.Star.G-- 
      if (this.Star.blinkColorMode == 6) {
        this.Star.G -= speed
        this.Star.R -= speed 
        this.Star.B = 255
      }
    }
    if (this.Star.opt == -1) {

      var speed = starSpeed[starSpeed.length - this.Star.speedMode]

      if (this.Star.blinkColorMode == 1) {
        this.Star.B += speed
        this.Star.R = 255
        this.Star.G = 255 
      }
      //white->purple    
      if (this.Star.blinkColorMode == 2) {
        this.Star.G += speed
        this.Star.R = 255 
        this.Star.B = 255
      }
      //white->cyan
      //this.Star.R--
      if (this.Star.blinkColorMode == 3) {
        this.Star.R += speed 
        this.Star.G = 255
        this.Star.B = 255
      }
      //white->green
      //this.Star.B--
      //this.Star.R--
      if (this.Star.blinkColorMode == 4) {
        this.Star.R += speed
        this.Star.B += speed 
        this.Star.G = 255 
      }
      //white->red
      //this.Star.B--
      //this.Star.G--
      if (this.Star.blinkColorMode == 5) {
        this.Star.G += speed
        this.Star.B += speed
        this.Star.R = 255 
      }
      //white->blue
      //this.Star.R--
      //this.Star.G-- 
      if (this.Star.blinkColorMode == 6) {
        this.Star.G += speed
        this.Star.R += speed 
        this.Star.B = 255
      }
    }

    if (this.Star.R < 0 || this.Star.G < 0 || this.Star.B < 0) {
      this.Star.opt = -1
    }
    if (this.Star.R > 255 || this.Star.G > 255 || this.Star.B > 255) {
      this.Star.opt = 1
    }
    let rgb = 'rgb(' + this.Star.R + ',' + this.Star.G + ',' + this.Star.B + ')' 
    ctx.setFontSize(fontSize[this.Star.fontSizeMode - 1])
    ctx.setShadow(0, 0, this.Star.blink, rgb) 
    ctx.setFillStyle(colors[this.Star.colorMode]) 
    ctx.fillText(this.Star.text, 0, 0)
    ctx.draw()
  },
  updateText: function () {

    const ctx = wx.createCanvasContext('myCanvas')
    var that = this
    var y = timing * speed[this.Text.speedMode-1]
    ctx.clearRect(0, 0, W, CH)
    ctx.translate(W / 2, CH / 2)
    ctx.rotate(90 * Math.PI / 180)
    ctx.setFillStyle(colors[this.Text.colorMode])
    ctx.setTextBaseline('middle')
    ctx.setTextAlign('left')
   
    ctx.setFontSize(fontSize[this.Text.fontSizeMode-1])
     
    if (that.Text.blinkColorMode != -1) {
      ctx.setShadow(0, 0, this.Text.blinkOffset, colors[that.Text.blinkColorMode])
    }
    var y = H / 2 - y;
    const metrics = ctx.measureText(this.Text.text)

    if (y < (H / 2 + metrics.width) * -1) {
      timing = 0
    }
    ctx.fillText(this.Text.text, y, 0)
    //ctx.arc(0, 0, 5, 0, 2 * Math.PI)
    //ctx.setFillStyle('lightgreen')
    ctx.fill()
    ctx.draw()
  }
})
