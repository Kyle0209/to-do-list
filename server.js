require('dotenv').config();
const express = require("express"); // Node.js的框架
const app = express();
const hbs = require("hbs"); // npm install hbs
const path = require("path")
const validator = require("./utils/validator");

const apiDocs       = require("./router/api-docs");
const toDoListRouter = require("./router/to-do-list");
const PORT = process.env.PORT || 8088;

// Redis 
const session = require("express-session");
const redis = require("redis");


// 初始化 RedisStore
const RedisStore = require("connect-redis")(session);
const redisClient = redis.createClient({url : "rediss://default:AWckAAIjcDFkYTk2M2YyZDcyNGE0ZjU3YjFjNTJjZTIxNDk0ZTRjZHAxMA@pro-lamprey-26404.upstash.io:6379"});
redisClient.on('error', err => console.error('Redis Client Error', err));
// {url: process.env.REDIS_URL}

// redisClient.on('error', (err) => console.error('Redis Client Error', err));

app.use(session({
  store: new RedisStore({ client : redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  name: "_test_",
  cookie: { 
      maxAge: 24 * 60 * 60 * 1000  // 24小時
  }
}));

// 解析 JSON 和 URL-encoded 資料
app.use(express.json());  // 解析 JSON
app.use(express.urlencoded({ extended: true })); // 解析 form data

app.engine("html", hbs.__express);

app.set("views", path.join(__dirname, "application", "views")); 

app.use( express.static(path.join(__dirname, "application")));

//// Model 部分建立完 , 再開啟即可使用
const dramasRouter   = require("./router/dramas.controllers");
// const imagesRouter   = require("./router/images");
const aboutRouter    = require("./router/about");
const authRouter = require("./router/auth");

app.use("/dramas",dramasRouter);
// app.use("/images",imagesRouter);
app.use("/about", aboutRouter);
app.use("/auth", authRouter);
////////////

// app.use(validator.loginValidator);
app.use(`/api-docs`,apiDocs);

app.get("/login", (req, res) => {
  res.render("login.html")
});

app.get("/logout", (req, res) => {
  req.session.destroy(); // 刪除session物件資料
  res.clearCookie("_test_"); // 刪掉cookie上的鍵值對
  res.redirect("/login");
});

app.use(validator.isLogined);


app.use("/to-do-list",toDoListRouter);



app.get("/",(req,res)=>{
  res.redirect("/to-do-list/page/list");
});


app.use((req,res)=>{
  res.status(404).send("API 尚未開發！");
});



app.listen(PORT, '0.0.0.0',function(){
    console.log("Server is running at port:" + PORT);
});