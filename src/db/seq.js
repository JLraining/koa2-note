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
