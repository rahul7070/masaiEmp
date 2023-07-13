const jwt = require("jsonwebtoken");
const BlackModel = require("../model/blacklist.model");

const auth = async (req, res, next)=>{
    let token = req.headers?.authorization;
    if(token){
        // console.log(token)
        let isBlacklisted = await BlackModel.findOne({token})
        if(isBlacklisted) return res.json({"msg": "login again"})
        let decoded = jwt.verify(token, 'accesstoken');
        if(!decoded){
            return res.json({"msg": "login First"})
        }else {
            next();
        }
    }else{
        return res.json({"msg": "login First"})
    }
}

module.exports = {auth}