const seq = require("../seq");
const { STRING, DECIMAL } = require('../types')

// 创建 user 模型。注意此处数据表的名字是 users (会默认加上s)
const User = seq.define("user", {
  // id 主键会自动创建 并设为主键 自增
  userName: {
    type: STRING,
    allowNull: false,
    unique: true,
    comment: "用户名，唯一",
  },
  password: {
    type: STRING,
    allowNull: false,
    comment: "密码",
  },
  nickName: {
    type: STRING,
    allowNull: false,
    comment: "昵称",
  },
  gender: {
    type: DECIMAL,
    allowNull: false,
    defaultValue: 3,
    comment: "性别（1 男性，2 女性，3 保密）",
  },
  picture: {
    type: STRING,
    comment: "头像，图片地址",
  },
  city: {
    type: STRING,
    comment: "城市",
  },
});

module.exports = User;
