// 負責在連線上對資料表格建立操作實例

const mongoose = require("mongoose");
const conn = require("./db"); // 存放點

// 建立schema
const missionSchema = new mongoose.Schema({
    to_do_id        : String,
    subject         : String,
    reserved_time   : String,
    modified_time   : String,
    brief           : String,
    author          : String,
    content         : String,
    level           : Number,
    attachments      : [String] 
},{
    collection      : "missions",
    strict          : true, // 嚴格模式，排除未定義欄位
    versionKey      : false
});
// 建立model 物件(在conn連線上，註冊一個物件)
// (node.js 透過Model物件， 和collection(表格)互動)
let missionModel = conn.model("Missions", missionSchema);

module.exports = missionModel;