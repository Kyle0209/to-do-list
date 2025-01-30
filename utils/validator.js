let isLogined = (req, res, next) => {
    if( !req.session.userInfo || !req.session.userInfo.isLogined ) {
        res.redirect("/login");
    }
    
    else {
        next();
    }
}

module.exports = {
    isLogined : isLogined
};