// 負責與資料庫建立連線
// mongoose 操作練習
const mongoose = require("mongoose");

// 1. 建立連線
// 使用IPv4 : "127.0.0.1:27017"
// ? IPv4/ IPv6 ?
// *連線設定值:"mongodb://{host_ip}:{port}/{db_name}"
const connConfig = process.env.MONGO_URL;
if (!connConfig) {
  console.error('MONGO_URL is not defined in .env file');
  process.exit(1);
}
const conn = mongoose.createConnection(connConfig,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 5
    }
);

console.log("trying to connect...");
// 連線成功觸發callback Func()
conn.on("connected", () => {
    console.log("MongoDB is connected.");
});

module.exports = conn;