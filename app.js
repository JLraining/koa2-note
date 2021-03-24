const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");

const session = require("koa-generic-session");
const redisStore = require("koa-redis");
const { REDIS_CONF } = require("../conf/db");

const index = require("./src/routes/index");
const users = require("./src/routes/users");

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/src/public"));

app.use(
  views(__dirname + "/src/views", {
    extension: "ejs",
  })
);

// session 配置
app.keys = ["UhsjF_67jh&&*$"];
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
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
