const express = require("express");
const router = express.Router();

const model = require("../models"); // 若require資料夾，預設尋找index.js

// /dramas/page --> 回傳 dramas.html
router.get("/page" , (req,res)=>{
  res.render("dramas.html");
}); 

// 取得 影集資料
// GET /dramas/list?type={} --> 取得資料
router.get("/list", async (req, res) => {
  try{
    // let data = await model.dramas.find(); // 透過model.drama  操作資料

    let condition = req.query.type === "全" ? {} : { category : req.query.type };
    let data = await model.dramas.find( condition );
    res.json({result : data})
  }

  catch( err ){
    console.log(err);
    res.status(500).json({message : "Server error."});
  };
});

router.post("/detail", async ( req, res ) => {
  try{
    console.log(req.body);

    // 使用findOne返回的是一個物件
    let latestDramaId = await model.dramas.findOne({}, {dramaId : 1} ).sort({ dramaId: -1 })
    let newId = Number(latestDramaId["dramaId"]);
    console.log("latestId = " + newId + " " + typeof(newId));
    // let newDrama = req.body;
    // newDrama = {"dramaId": (parseInt(latestDramaId["dramaId"]) + 1).toString(), "category": newDrama["category"], "name": newDrama["name"], "score": newDrama["score"]}; // 設定新資料格式
    // console.log(newDrama);
    req.body.dramaId = String(newId + 1);
    await model.dramas.create(req.body);
    res.json({message : "ok."});
  }

  catch( err ){
    console.log(err);
    res.status(500).json({message : "server err."});
  }
})
// router.post("/createNewDramaData", async (req, res) => {
//   try{
//       console.log(req.body);
//       let data = await readFilePromise("models/sample2.json"); // 讀檔案
      
//       let latestDramaId = parseInt(data[data.length - 1]["dramaId"]);
//       let newDrama = req.body; // 設定新資料其他內容
//       // newDrama["dramaId"] = (latestDramaId + 1).toString(); // 設定新資料dramaId
//       newDrama = {"dramaId": (latestDramaId + 1).toString(), "category": newDrama["category"], "name": newDrama["name"], "score": newDrama["score"]}; // 設定新資料格式
//       console.log(newDrama);

      
//       for( let i = 0 ; i < data.length ; i++ ){
//           if( data[i]["name"] == newDrama["name"] ){
//               res.json({ message: "已有重複資料" });
//               return;
//           }
//       }


//       data.push(newDrama);
//       await fs.writeFileSync("models/sample2.json", JSON.stringify(data), "utf8");
//       res.json({ message: "ok." });

//   }
//   catch(err){
//       res.status(500).json({message: "新增失敗"});
//   }

  

// });

// 新增資料
// POST /dramas/detail
// payload : {category : 犯罪, name :ZZZZ, score : 2.5}
router.put("/detail/:dramaId", async (req, res) => {
  try{
    let dramaId = req.params.dramaId;
    let result = await model.dramas.updateOne(
      // 語法糖: {dramaId} 意思是創建{ dramaId : dramaId的值 }的鍵值對，"dramaId"從變數名稱變成鍵
      {dramaId},
      { $set : { name : req.body.name, score : req.body.score } }
    );
    res.json({message : "ok."});
  }catch( err ) {
    console.log(err);
    res.status(500).json({message : "server err."});
  }
})


// 修改資料
// PUT /dramas/detail/:dramaId
// payload : {name : ABEER, score : 5}

router.delete("/detail/:dramaId", async (req, res) => {
  try{
    let dramaId = req.params.dramaId;
    let result = await model.dramas.deleteOne({dramaId})
    if (result.deletedCount) {
      console.log(`dramaId: ${dramaId} 已刪除`);
      res.json({message : "ok."});
    }
    else{
      console.log(`dramaId: ${dramaId} 刪除失敗`);
      throw "無匹配資料";
    } 
  }catch(err){
    console.log(err);
    res.status(500).json({message : "server err."});
  }

})



// 刪除資料
// DELETE /dramas/detail/:dramaId



module.exports = router;