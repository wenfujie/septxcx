# septwolves

> A MPVue project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


##2019.5.27  jiangzeping
#开发时需注意： 
#（1）修改请求地址：分别为common.js的baseConstant，和filterCommon.js、filterCommon.wxs
#（2）修改图片地址，在assets/scss/common/var_fn.scss的$serverUrl
#（3）修改过滤器时，filterCommon.js和filterCommon.wxs文件需保持一致
#（4）现在先把线上图片放在中间层里了，server/assets/images/下
