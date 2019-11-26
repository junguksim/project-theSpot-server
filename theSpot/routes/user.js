var express = require('express');
var router = express.Router();
const resMsg = require('../module/resMsg');
const statCode = require('../module/statusCode');
const resUtil = require('../module/responseUtil');
const pool = require('../module/pool')
const query = require('../module/query');

router.post('/signin', async (req,res)=>{
    const findAlreadyResult = await pool.queryParam_Arr(query.findAlready,[req.body.email]);
    console.log(findAlreadyResult);
    if(findAlreadyResult.length!==0) {
        await res.status(200).send(resUtil.successFalse(statCode.FAIL, resMsg.ALREADY_USER));
    }
    else {
        await pool.queryParam_Arr(query.insertUser, [req.body.email, req.body.profileImg, req.body.nickname]);
        await res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.SIGNIN_SUCCESS));
    }
})



module.exports = router;
