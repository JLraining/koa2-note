const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const session = require("koa-generic-session");
const redisStore = require("koa-redis");

const userAPIRouter = require("./routes/api/user");
const userViewRouter = require("./routes/view/user");
const errorViewRouter = require("./routes/view/error");

const { isProd } = require("./utils/env");
const { REDIS_CONF } = require("./conf/db");
const { SESSION_SECRET_KEY } = require("./conf/secretKeys");

// error handler
let onerrorConf = {};
if (isProd) {
  onerrorConf = {
    redirect: "/error",
  };
}
onerror(app, onerrorConf);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "ejs",
  })
);

// session 配置
app.keys = [SESSION_SECRET_KEY];
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

// routes
app.use(userAPIRouter.routes(), userAPIRouter.allowedMethods());
app.use(userViewRouter.routes(), userViewRouter.allowedMethods());
app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods()); // 404 路由注册到最后面

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error =====================", err, ctx);
});

module.exports = app;
