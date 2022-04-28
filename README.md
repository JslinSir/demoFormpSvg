###  SVG 的优势
* 清晰度: 可以进行放大，而不失真
* 更小的文件体积 
* 可扩展性，可以动态颜色
* 动效  可以添加动效

### 在小程序中使用
目前小程序 的image标签已经支持了 svg 的显示
```svg
 <image src="./xx.svg"/>
``` 
### 如何动态的改变 svg 属性呢？
大体思路：把svg转成 base64 然后通过 image标签 src设置图片，再动态赋值svg颜色
1.  把svg转成base64 
 - 如下一个svg 代码文件
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="24 24 48 48"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" from="0" to="360" dur="1400ms"></animateTransform><circle cx="48" cy="48" r="20" fill="none" stroke="#eeeeee" stroke-width="2" transform="translate\(0,0\)"><animate attributeName="stroke-dasharray" values="1px, 200px;100px, 200px;100px, 200px" dur="1400ms" repeatCount="indefinite"></animate><animate attributeName="stroke-dashoffset" values="0px;-15px;-125px" dur="1400ms" repeatCount="indefinite"></animate></circle></svg>
```
- 转成base64，其实就是 对这个svg进行 encodeURIComponent 得到 如下代码
```xml
%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%2224%2024%2048%2048%22%3E%3CanimateTransform%20attributeName%3D%22transform%22%20type%3D%22rotate%22%20repeatCount%3D%22indefinite%22%20from%3D%220%22%20to%3D%22360%22%20dur%3D%221400ms%22%3E%3C%2FanimateTransform%3E%3Ccircle%20cx%3D%2248%22%20cy%3D%2248%22%20r%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%23eeeeee%22%20stroke-width%3D%222%22%20transform%3D%22translate%5C(0%2C0%5C)%22%3E%3Canimate%20attributeName%3D%22stroke-dasharray%22%20values%3D%221px%2C%20200px%3B100px%2C%20200px%3B100px%2C%20200px%22%20dur%3D%221400ms%22%20repeatCount%3D%22indefinite%22%3E%3C%2Fanimate%3E%3Canimate%20attributeName%3D%22stroke-dashoffset%22%20values%3D%220px%3B-15px%3B-125px%22%20dur%3D%221400ms%22%20repeatCount%3D%22indefinite%22%3E%3C%2Fanimate%3E%3C%2Fcircle%3E%3C%2Fsvg%3E
```
- 拼接base64
 ```css
    data:image/svg+xml;charset=utf-8,encodeURIComponent后的代码
 ```
2. 在对应svg属性上动态设置颜色，比如这里用到的是填充颜色
    在js文件 data中定义 color 状态
    在wxml中动态渲染
```xml
 <image src="data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewBox%3D%2224%2024%2048%2048%22%3E%3CanimateTransform%20attributeName%3D%22transform%22%20type%3D%22rotate%22%20repeatCount%3D%22indefinite%22%20from%3D%220%22%20to%3D%22360%22%20dur%3D%221400ms%22%3E%3C%2FanimateTransform%3E%3Ccircle%20cx%3D%2248%22%20cy%3D%2248%22%20r%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%23{{color}}%22%20stroke-width%3D%222%22%20transform%3D%22translate%5C(0%2C0%5C)%22%3E%3Canimate%20attributeName%3D%22stroke-dasharray%22%20values%3D%221px%2C%20200px%3B100px%2C%20200px%3B100px%2C%20200px%22%20dur%3D%221400ms%22%20repeatCount%3D%22indefinite%22%3E%3C%2Fanimate%3E%3Canimate%20attributeName%3D%22stroke-dashoffset%22%20values%3D%220px%3B-15px%3B-125px%22%20dur%3D%221400ms%22%20repeatCount%3D%22indefinite%22%3E%3C%2Fanimate%3E%3C%2Fcircle%3E%3C%2Fsvg%3E" />
```
`注意：这里的颜色 由于是已经被编码了，所以# 已经被转义了 %23， 直接写颜色数字即可 `
当然你也可以 去掉%23 自己实现一个内部方法
```javaScript
 if (color && color.startsWith('#')) {
    return `%23${color.slice(1)}`;
  }
```

这样其实就实现了 svg的动态渲染，可是这种写法，写在wxml中 不是特别的优雅，那么如何重构下让我们的代码看起来更优雅呢？
- 把 svg 单独存放 支持动态返回
- 动态复制 image src 属性

 #### svg 动态函数
 
loading.svg.js 文件
```js
export const loadingSvg = (color='#ddd') =>{
  const svgXml = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="24 24 48 48"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" from="0" to="360" dur="1400ms"></animateTransform><circle cx="48" cy="48" r="20" fill="none" stroke="${color}" stroke-width="2" transform="translate\(0,0\)"><animate attributeName="stroke-dasharray" values="1px, 200px;100px, 200px;100px, 200px" dur="1400ms" repeatCount="indefinite"></animate><animate attributeName="stroke-dashoffset" values="0px;-15px;-125px" dur="1400ms" repeatCount="indefinite"></animate></circle></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgXml)}`
}
```
#### 逻辑层引入，setData
```js
  onLoad(){
    const { loadingSvg } = require('./loading.svg.js')
    const svgImg = loadingSvg('#eee')
    this.setData({svgImg})
  },
```
#### 渲染层使用
```xml
  <image src="{{svgImg}}"/>
```
 



