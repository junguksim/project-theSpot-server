var express = require('express');
var router = express.Router();
const resUtil = require('../module/responseUtil');
const statCode = require('../module/statusCode');
const resMsg = require('../module/resMsg');
const query = require('../module/query');
const pool = require('../module/pool')

router.post('/', async (req,res)=>{
    const insertPartyResult = await pool.queryParam_Arr(query.insertParty, [req.body.partyName, req.body.leaderIdx, req.body.userCount]);
    const insertPartyMemberQuery = 'INSERT INTO user_party (userIdx, partyIdx) VALUES(?,1)';

    for(var i = 1 ; i < 7 ; i++) {
        await pool.queryParam_Arr(insertPartyMemberQuery, [i,1]);
    }
    
    console.log('완료!');
})


module.exports = router;
