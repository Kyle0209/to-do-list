const express = require("express");
var router = express.Router();

const model = require("../models");

// to-do-list 清單頁面
router.get("/page/list",
    (req,res)=>{
        res.render("to-do-list.html",{ 
            templateName : req.session ? req.session.userInfo.name : ""
        });
    }
);

// to-do-list 細節頁面 
router.get("/page/detail",
    (req,res)=>{
        res.render("to-do-detail.html",{
            templateName : req.session ? req.session.userInfo.name : ""
        });
    }
);

router.get("/list", 
    async (req, res) => {
        try{
            let result = await model.to_do_list
                                    .find({}, {content:0, modified_time:0 ,_id:0 , attachments:0});
            // console.log(result);
            res.json({result});
        }catch(err){
            console.log(err);
            res.status(500).json({message : "serve err."});
        }
});

router.get("/detail/:to_do_id", async (req, res) => {
    try{
        let result = await model.to_do_list
                                .findOne({to_do_id : req.params.to_do_id}, {"_id" : 0}); 
            res.status(200).json({result});        
    }
    catch(err){
        console.log(err);
        res.status(500).json({message : "server err."});
    }
});

router.post("/detail/:to_do_id", async (req, res) => {
    let to_do_id = req.params.to_do_id;
    let newData = req.body;
    console.log("\nnew : " + JSON.stringify(newData) + "\n");
    try{
        let id = await model.to_do_list.findOne({to_do_id});
        if(!id){
            let newId = await model.to_do_list.find().sort({to_do_id : -1}).limit(1);
            req.body.todo_id = newId[0].to_do_id + 1;
            let result = await model.to_do_list.create(req.body);
            console.log("new : " + result);
        }
        else{
            let result = await model.to_do_list.updateOne({to_do_id}, req.body)
            res.status(200).json({message : "ok."});
            // console.log("change : " + JSON.stringify(req.body));        
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message : "server err."});
    }
})
router.get("/the-newest-id", async (req, res) => {
    try{
        let result = await model.to_do_list.find().sort({to_do_id : -1}).limit(1);
        let newestId = result[0].to_do_id;
        newestId = newestId.trim();
        console.log(typeof newestId);
        console.log("   : " + newestId);
        res.status(200).json({result : newestId});
    }catch(err){
        console.log(err);
        res.status(500).json({message : "server err."});
    }    
})

module.exports = router;