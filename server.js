const express = require("express"); // Node.js的框架
const app = express();
const hbs = require("hbs"); // npm install hbs
const path = require("path")

const apiDocs       = require("./router/api-docs");
const toDoListRouter = require("./router/to-do-list");

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
