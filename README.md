## Y-BMW

用于生成宝马中国账号登录所需要的 token 和 refresh token, 提供密码和短信验证码两种登录方式

因前端无法跨域访问 https://myprofile.bmw.com.cn，所以需要后端代理进行转发

例如: http://bmw.yixi.pro/api/bmw/eadrax-coas/v2/cop/slider-captcha  ->  https://myprofile.bmw.com.cn/eadrax-coas/v2/cop/slider-captcha

后端只做端口转发，不会收集任何信息。


### 本地开发：

#### 安装依赖

`yarn install`

### 启动本地服务

`yarn dev`

#### 编译打包

`yarn build`
