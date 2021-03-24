const Sequelize = require("sequelize");
const seq = require("./seq");

// 创建 user 模型。注意此处数据表的名字是 users (会默认加上s)
const User = seq.define("user", {
  // id 主键会自动创建 并设为主键 自增
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nickName: {
    type: Sequelize.STRING,
  },
});

// seq.sync({force: true}).then(() => {
//     process.exit
// })

// (async function () {
//   const UserList = await User.findAll({
//     where: {},
//     order: [["id", "desc"]],
//   });
//   console.log(UserList);
// })();

module.exports = {
  User,
};
