var express = require('express');
var router = express.Router();
const resUtil = require('../module/responseUtil');
const statCode = require('../module/statusCode');
const resMsg = require('../module/resMsg');
const query = require('../module/query');
const pool = require('../module/pool');

//그룹 만들기
router.post('/', async (req,res)=>{
    let getIdxByAccTokenResult = await pool.queryParam_Arr(query.getIdxByAccToken, [req.headers.accesstoken]);
    if(getIdxByAccTokenResult.length == 0) {
        await res.status(200).send(resUtil.successFalse(statCode.OK, resMsg.NO_USER));
    }
    else {
        let ID = getIdxByAccTokenResult[0].userIdx;
        if(req.body.partyName == null || req.body.userCount == null) {
            await res.status(200).send(resUtil.successFalse(statCode.FAIL, resMsg.NULL_VALUES));
        }
        else {
            const insertPartyResult = await pool.queryParam_Arr(query.insertParty, [req.body.partyName, ID, req.body.userCount]);
            const insertUserPartyResult = await pool.queryParam_Arr(query.insertUserParty, [ID, insertPartyResult.insertId]);
            console.log(insertPartyResult);
            console.log(insertUserPartyResult);
            console.log('====================CREATE PARTY SUCCESS!=================');
            await res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.CREATE_PARTY_COMPLETE));
        }
    }
})

// //그룹에 가입
// router.post('/', async (req,res)=>{

// })

//그룹 리스트 불러오기
router.get('/', async (req, res) => {
    let getIdxByAccTokenResult = await pool.queryParam_Arr(query.getIdxByAccToken, [req.headers.accesstoken]);
    console.log(getIdxByAccTokenResult);

    if (getIdxByAccTokenResult.length == 0) {
        await res.status(200).send(resUtil.successFalse(statCode.OK, resMsg.NO_USER));
    }
    else {
        let ID = getIdxByAccTokenResult[0].userIdx;
        const selectAllPartyResult = await pool.queryParam_Arr(query.selectAllParty, [ID]);
        for(var i = 0 ; i < selectAllPartyResult.length ; i++) {
            if(ID == selectAllPartyResult[i].leaderIdx) {
                selectAllPartyResult[i].isAdmin = true;
            }
            else {
                selectAllPartyResult[i].isAdmin = false;
            }
        }
        console.log(selectAllPartyResult);
        console.log('===============GET ALL PARTY LIST SUCCESS!==================');
        await res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.GET_PARTY_LIST_COMPLETE, selectAllPartyResult));
    }

})

//그룹 정보 불러오기
router.get('/:partyId', async (req, res)=>{
    let partyId = req.params.partyId;

    const selectPartyResult = await pool.queryParam_Arr(query.selectParty, [partyId]);
    console.log(selectPartyResult);
    console.log('====================GET PARTY INFO SUCCESS!================');
    await res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.GET_PARTY_INFO_COMPLETE, selectPartyResult));
})

//그룹 삭제
router.delete('/', async(req,res)=>{
    let getIdxByAccTokenResult = await pool.queryParam_Arr(query.getIdxByAccToken, [req.headers.accesstoken]);
    let partyId = req.body.partyId;
    console.log(getIdxByAccTokenResult);

    if (getIdxByAccTokenResult.length == 0) {
        await res.status(200).send(resUtil.successFalse(statCode.OK, resMsg.NO_USER));
    }
    else {
        let ID = getIdxByAccTokenResult[0].userIdx;
        console.log(ID);
        const selectPartyResult = await pool.queryParam_Arr(query.selectParty, [partyId]);
        if(selectPartyResult.length == 0) {
            await res.status(200).send(resUtil.successTrue(statCode.FAIL, resMsg.NO_PARTY));
        }
        else {
            if(selectPartyResult[0].leaderIdx !== ID) {
                await res.status(200).send(resUtil.successTrue(statCode.FAIL, resMsg.ONLY_LEADER_CAN_DELETE));
            }
            else {
                const deletePartyResult = await pool.queryParam_Arr(query.deleteParty, [partyId]);
                await res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.DELETE_PARTY_SUCCESS, deletePartyResult));
            }
        }        
    }
})


module.exports = router;
