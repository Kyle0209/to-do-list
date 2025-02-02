const express = require("express");
const router = express.Router();

const validator = require("../utils/validator");

router.post("/", 
    // 1. 確認帳號及密碼都有輸入
    validator.checkAccountAndPasswd,

    // 2. 確認輸入資訊正確
    validator.isUserValid,
    
    // 3. 將資料記錄在session上
    validator.setSessionInfo,
    
    // 4. response回應前端
    (req, res) => {
        let message = "ok.";
        res.json({
            message : message,
            redirect : "/"
        });
    }
)


module.exports = router;