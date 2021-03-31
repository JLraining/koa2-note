/**
 * @description 微博 view 路由
 */

const router = require("koa-router")();
const { loginRedirect } = require("../../middlewares/loginChecks");

router.get("/", loginRedirect, async (ctx, next) => {
  const userInfo = ctx.session.userInfo;
  const { id: userId } = userInfo;

  await ctx.render("index", {
    userData: {
      userInfo,
      fansData: {
        count: 0,
        list: []
      },
      followersData: {
        count: 0,
        list: []
      },
      atCount: 0,
    },
    blogData: {
        isEmpty: true,
        blogList: [],
        pageSize: 1,
        pageIndex: 1,
        count: 0, 
    }
  });
});

module.exports = router;
