var express = require('express');
var router = express.Router();
const request = require('request');
const resUtil = require('../module/responseUtil');
const statCode = require('../module/statusCode');
const resMsg = require('../module/resMsg');
const ak = require('../config/appkey');
const kakaoAPI = require('../module/kakaoAPI');

router.get('/find', async (req,res)=>{
    const result = await kakaoAPI.find(req.query.addr);
    console.log(result);
    if(result.meta.total_count === 0) {
        await res.status(200).send(resUtil.successFalse(statCode.FAIL, resMsg.NO_FIND_RESULT));
    }
    else {
        await res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.FIND_ADDRESS_SUCCESS, result));
    }
})

module.exports = router;
