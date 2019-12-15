var express = require('express');
var router = express.Router();
const resUtil = require('../module/responseUtil');
const statCode = require('../module/statusCode');
const resMsg = require('../module/resMsg');
const ak = require('../config/appkey');
const kakaoAPI = require('../module/kakaoAPI');
const query = require('../module/query');
const pool = require('../module/pool');

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

router.post('/', async (req,res)=>{
    let getIdxByAccTokenResult = await pool.queryParam_Arr(query.getIdxByAccToken, [req.headers.accesstoken]);
    if(getIdxByAccTokenResult.length == 0) {
        await res.status(200).send(resUtil.successFalse(statCode.OK, resMsg.NO_USER));
    }
    else {
        let ID = getIdxByAccTokenResult[0].userIdx;
        console.log(ID);
        await pool.queryParam_Arr(query.updateAddress, [req.body.userAddress ,req.body.userX, req.body.userY, ID]);
        await res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.UPDATE_ADDRESS_SUCCESS));
    }
    
})

module.exports = router;
