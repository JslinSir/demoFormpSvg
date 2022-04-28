
Page({
  data: {
    color:"eee",
    
  },

  onLoad(){
    const { loadingSvg } = require('./loading.svg.js')
    const svgImg = loadingSvg('#07c160')
 
    this.setData({svgImg})
  },

 
})
