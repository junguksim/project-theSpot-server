var express = require('express');
var router = express.Router();
const resMsg = require('../module/resMsg');
const statCode = require('../module/statusCode');
const resUtil = require('../module/responseUtil');
const pool = require('../module/pool')
const query = require('../module/query');

router.post('/signin', async (req,res)=>{
    console.log(req.body);
    //const findAlreadyResult = await pool.queryParam_Arr(query.findAlready, ['올 인자']);
    // if(!findAlreadyResult) {
    //     await resUtil.successFalse(statCode.FAIL, resMsg.ALREADY_USER);
    // }
    // else {
    //     await resUtil.successTrue(statCode.OK, resMsg.SIGNIN_SUCCESS);
    // }
    res.send('테스트');
    res.end();
})



module.exports = router;
