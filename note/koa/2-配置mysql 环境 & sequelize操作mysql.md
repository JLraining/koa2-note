## 启动本地mysql并配置
### 启动mysql
```
mysql.server start
```
### config
conf/db
```
let MYSQL_CONF = {
  host: "localhost",
  user: "root",
  password: "",
  port: "3306",
  database: "koa2_db",
};

module.exports = {
  MYSQL_CONF
};
```

## sequelize连接数据库
### 使用sequelize连接数据库
seq.js
```
const Sequelize = require("sequelize");
const { MYSQL_CONF } = require("../conf/db");
const { host, user, password, database } = MYSQL_CONF;

const conf = {
  host,
  dialect: "mysql",
};

// 连接池
conf.pool = {
  max: 5, // 连接池中的最大的连接数量
  min: 0, // 最小
  idle: 10000, // 如果一个连接池10s之类没有被使用, 则释放
};

const seq = new Sequelize(database, user, password, conf);
module.exports = seq;
```
### 同步数据库
```
/**
 * @description sequelize 同步数据库
 */
const seq = require('./seq')
require('./model/index')

// 测试连接
seq.authenticate().then(() => {
    console.log('auth ok')
}).catch(() => {
    console.log('auth err')
})

// 执行同步
seq.sync({ force: true }).then(() => {
    console.log('sync ok')
    process.exit()
})
```

## sequelize操作数据库
### 建表
```
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
  picture: {
    type: STRING,
    comment: "头像，图片地址",
  }
});
```
### 外键
```
const User = require("./User");
const Blog = require("./Blog");

// 外键关联
Blog.belongsTo(User, {
  foreighKey: "userId",
});
```
### 增 create
```
  const result = await User.create({
    userName,
    password,
    nickName: nickName ? nickName : userName,
    gender,
  });
  const data = result.dataValues;
```
### 删 destroy
```
const result = await User.destroy({
    where: {
      userName: 'tangyuan'
    },
  });
  // result 删除的行数
  return result > 0;
```
### 改 update
```
const result = await User.update({
  // 修改后的值
  userName: 'tangyuan1'
}, {
  where: {
    userName: 'tangyuan'
  },
});
return result[0] > 0; // 修改的行数
```

### 查询
#### findOne
```
 const result = await User.findOne({
    // 需要得到的列的属性
    attributes: ["id", "userName", "nickName", "picture", "city"],
    where: {
      userName: 'tangyuan'
    },
  });
  // 未找到
  if (!result) {
    return null;
  }
  return result.dataValues;
```

#### findAndCountAll 
(分页/查询总数/连表查询)的demo
```
  const result = await Blog.findAndCountAll({
    limit: pageSize, // 每页多少条
    offset: pageSize * pageIndex, // 跳过多少条
    order: [["id", "desc"]],
    include: [
      {
        model: User,
        attributes: ["userName", "nickName", "picture"],
        where: {
          userName: 'tangyuan'
        },
      },
    ],
  });
  
  // result.count 总数，跟分页无关
  // result.rows 查询结果，数组
  // 获取 dataValues
  let blogList = result.rows.map((row) => row.dataValues);
  blogList = blogList.map((blogItem) => {
    // 获取连表查询的user
    blogItem.user = blogItem.user.dataValues;
    return blogItem;
  });
  return {
    count: result.count,
    blogList,
  };
```

#### findAll
```
const result = await Blog.findAll({
  limit: 2,
  offset: 0,
  order:[ 
    ['id', 'desc']
  ]
})
return result.map(blog => blog.dataValues)
```