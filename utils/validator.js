const typeList = ["犯罪", "殭屍", "全", "愛情", "政治", "其他"];

// 1.加入參數檢查
let isTypeExist = (req, res, next) => {
    console.log('-------------------');
    console.log("----開始列表檢查----")
    if(!req.query.type){
        console.log("1.缺少type參數");
        res.status(400).json({message: "缺少type參數"});
    }   
    else {
        console.log("1. 確認type參數存在");
        next();

    }
}

// 2.加入檢查type參數是否為全
let isTypeValid = (req, res, next) => {
    // console.log(req.query.type);
    if ( (typeList.indexOf(req.query.type)) == -1 ){
        console.log("2.type參數錯誤");
        res.status(400).json({message: "type參數錯誤"});
    }

    else {
        console.log(`2. type:${req.query.type}_參數正確`);
        next();
    }
}

const user1 = {"account" : "kyle", "passwd" : "0209"};

// 檢查欄位
let checkAccountAndPasswd = (req, res, next) => {
    if(!req.body.account)
        res.status(400).json({"message" : "缺少帳號"});
    else if(!req.body.passwd)
        res.status(400).json({"message" : "缺少密碼"});
    else next();
}

// 對比資料
let isUserValid = (req, res, next) => {
    if( req.body["account"] === user1["account"] ){    
        if( req.body["passwd"] === user1["passwd"] ){
            // res.json({"message" : `Welcome ${req.body["account"]}`});
            next();
            return;
        }
        res.status(403).json({"message" : "密碼錯誤"});
        return;
    }
    res.status(403).json({"message" : "帳號錯誤"});
}

// 紀錄資訊至session
// 建立userID 鍵值對
let setSessionInfo = (req, res, next) => {
    req.session.userInfo = {
        name : req.body.account,
        isLogined : true,
    };

    next();
}

// 檢查是否有token
let isTokenExist = (req, res, next) => {
    console.log("\n----開始新增檢查----");
    if(!req.headers["x-jeff-token"]){
        console.log("1.缺少token，break");
        res.status(400).json({message: "缺少token"});
    }
    else{
        console.log("1. 確認token存在");
        next();
    }
};

// 檢查token是否正確
let isTokenValid = (req, res, next) => {
    if(req.headers["x-jeff-token"] !== 'APTX4869' ){
        console.log("2.token憑證錯誤，break");
        res.status(403).json({message:"token憑證錯誤"});
        // 403 == 被禁止or無權限(forbidden)
    }

    else{
        console.log("2. 憑證正確");
        next();
    }
};

let isLogined = (req, res, next) => {
    // console.log(req.session.userInfo + " " + req.session.userInfo.isLogined);   
    if(!req.session.userInfo || !req.session.userInfo.isLogined === true){
    // 登入驗證
        res.redirect("/login");
        return;
    }
    
    next();
};


module.exports = {
    "isTypeExist" : isTypeExist,
    "isTypeValid" : isTypeValid,
    "checkAccountAndPasswd" : checkAccountAndPasswd,
    "isUserValid" : isUserValid,
    "setSessionInfo" : setSessionInfo,
    "isTokenExist" : isTokenExist, // value為middleware本身
    "isTokenValid" : isTokenValid,
    "isLogined" : isLogined
}
