const express = require("express"); // Node.js的框架
const app = express();
const hbs = require("hbs"); // npm install hbs
const path = require("path")
const session = require("express-session");
const validator = require("./utils/validator");

const apiDocs       = require("./router/api-docs");
const toDoListRouter = require("./router/to-do-list");

// Redis 
const { createClient } = require("redis");
const client = createClient();
client.connect();
const redisStore = require("connect-redis")(session);

app.use(session({
  // session外存[3] 設定好redisStore
  store : new redisStore({ client }), // session資料存放的地方
  secret : "c90dis90#",   // session資料加密使用
  resave : true,          // 回存store; true: 不論修改與否都存 ; false: 修改才存
  saveUninitialized : false,  // 初始化的session是否存到store
  name : "_test_",        // clokie的key值
  ttl : 24*60*60*1        // session有效時間
}))

// 解析 JSON 和 URL-encoded 資料
app.use(express.json());  // 解析 JSON
app.use(express.urlencoded({ extended: true })); // 解析 form data

app.engine("html", hbs.__express);

app.set("views", path.join(__dirname, "application", "views")); 

app.use( express.static(path.join(__dirname, "application")));

//// Model 部分建立完 , 再開啟即可使用
// const dramasRouter   = require("./router/dramas");
// const imagesRouter   = require("./router/images");
// const aboutRouter    = require("./router/about");

// app.use("/dramas",dramasRouter);
// app.use("/images",imagesRouter);
// app.use("/about", aboutRouter);
////////////

// app.use(validator.loginValidator);

app.get("/login", (req, res) => {
  res.render("login.html")
});

app.get("/logout", (req, res) => {
  req.session.destroy(); // 刪除session物件資料
  res.clearCookie("_test_"); // 刪掉cookie上的鍵值對
  res.redirect("/login");
});

app.use(validator.isLogined);


app.use(`/api-docs`,apiDocs);
app.use("/to-do-list",toDoListRouter);



app.get("/",(req,res)=>{
  res.send("Hello world!");
});


app.use((req,res)=>{
  res.status(404).send("API 尚未開發！");
});



app.listen(8088,function(){
    console.log("Server is running at http://localhost:" + String(8088));
});