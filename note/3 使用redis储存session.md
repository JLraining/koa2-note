## redis配置
### 启动redis
```
redis-server
```
### 配置
conf/db
```
let REDIS_CONF = {
  port: 6379,
  host: '127.0.0.1'
}

module.exports = {
  REDIS_CONF
};
```

## 使用redis储存session
```
const redisStore = require("koa-redis");
const session = require("koa-generic-session");

// session 配置
app.keys = ['ujdsghuvygf$87987'];
app.use(
  session({
    key: "weibo.sid",
    prefix: "weibo:sess:",
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
    ttl: 24 * 60 * 60 * 1000, // 可以不写，默认和maxAge保持一致
    // 存储到redis中
    store: redisStore({
      all: `${REDIS_CONF.host}:${REDIS_CONF.port}`,
    }),
  })
);

```

## 使用session
### 登录
登录成功后储存查询到的userInfo到ctx.session中
* controller
```
async function login(ctx, userName, password) {
  // 获取用户信息
  const userInfo = await getUserInfo(userName, doCrypto(password));
  if (!userInfo) {
    // 登录失败
    return new ErrorModel(loginFailInfo);
  }

  // 登录成功
  if (ctx.session.userInfo == null) {
    ctx.session.userInfo = userInfo;
  }
  return new SuccessModel();
}
```
### 登出
delete  ctx.session.userInfo 信息
* controller
```
async function logout(ctx) {
  delete ctx.session.userInfo;
  return new SuccessModel();
}
```
### 判断登录状态 (抽成middleware在router中使用)
判断ctx.session.userInfo是否存在 否则返回错误信息
```
async function loginCheck(ctx, next) {
  if (ctx.session && ctx.session.userInfo) {
    // 已登录
    await next();
    return;
  }
  // 未登录
  ctx.body = new ErrorModel(loginCheckFailInfo);
}
```