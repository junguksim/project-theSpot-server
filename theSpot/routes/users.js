var express = require('express');
var router = express.Router();
const resMsg = require('../module/resMsg');
const statCode = require('../module/statusCode');
const resUtil = require('../module/responseUtil');
const pool = require('../module/pool')
const query = require('../module/query');

router.post('/signin', async (req, res) => {
    let findAlreadyResult = await pool.queryParam_Arr(query.findAlready, [req.body.email]);
    if (findAlreadyResult.length !== 0) {
        console.log('RE-LOGIN SUCCESS')
        await pool.queryParam_Arr(query.updateTokens, [req.headers.accesstoken, req.headers.refreshtoken, req.body.email]);
        await res.status(201).send(resUtil.successTrue(statCode.OK1, resMsg.SIGNIN_SUCCESS));
    }
    else {
        console.log('NEW LOGIN SUCCESS')
        const insertUserResult = await pool.queryParam_Arr(query.insertUser, [req.body.email, req.body.profileImg, req.body.nickname, req.headers.accesstoken, req.headers.refreshtoken]);
        await res.status(201).send(resUtil.successTrue(statCode.OK1, resMsg.SIGNIN_SUCCESS));
    }
})



module.exports = router;
