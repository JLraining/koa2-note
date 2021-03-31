/**
 * @description 数据模型入口文件
 */

const User = require("./User");
const Blog = require("./Blog");

// 外键关联
Blog.belongsTo(User, {
  foreighKey: "userId",
});

module.exports = {
  User,
  Blog,
};
