/**
 * @description 数据模型入口文件
 */

const User = require("./User");
const Blog = require("./Blog");
const UserRelation = require("./UserRelation");

// 外键关联
// blog通过userid和User表关联 如果user被删相关blog被删 可以连表查询到user的blog
Blog.belongsTo(User, {
  foreighKey: "userId",
});

// UserRelation通过followerId和user关联 如果user被删相关关系被删 可以连表查询到user的粉丝
UserRelation.belongsTo(User, {
  foreignKey: "followerId",
});

// UserRelation通过userId和user关联 如果user被删相关关系被删 可以连表查询到user的关注。下面两种方式等价
User.hasMany(UserRelation, {
  foreignKey: 'userId'
})
// UserRelation.belongsTo(User, {
//   foreignKey: "userId",
// });

// blog通过userid和UserRelation表关联的followerId关联 可以连表查询到followerId的blog
Blog.belongsTo(UserRelation, {
  foreignKey: 'userId',
  targetKey: 'followerId'
})

module.exports = {
  User,
  Blog,
  UserRelation
};
