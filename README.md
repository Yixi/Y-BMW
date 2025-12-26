## Y-BMW

提供了docker镜像可以自行部署，提供登录接口和refresh_token 接口

https://github.com/Yixi/y-bmw-api/pkgs/container/y-bmw-api

替换bimmer_connect的验证部分，可以参考 https://github.com/Yixi/Y-BMW/issues/2#issuecomment-2805928386


---
用于生成宝马中国账号登录所需要的 token 和 refresh token, 提供密码和短信验证码两种登录方式

因前端无法跨域访问 https://myprofile.bmw.com.cn，所以需要后端代理进行转发

例如: http://bmw.yixi.pro/api/bmw/eadrax-coas/v2/cop/slider-captcha  ->  https://myprofile.bmw.com.cn/eadrax-coas/v2/cop/slider-captcha

后端只做端口转发，不会收集任何信息。


### 本地开发：

#### 安装依赖

`pnpm install`

### 启动本地服务

`pnpm dev`

#### 编译打包

`pnpm build`
