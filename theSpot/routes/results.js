var express = require('express');
var router = express.Router();
const pool = require('../module/pool');
const resUtil = require('../module/responseUtil');
const statCode = require('../module/statusCode');
const resMsg = require('../module/resMsg');
const query = require('../module/query');
const kakaoAPI = require('../module/kakaoAPI');
const seoulAPI = require('../module/seoulAPI');
const jwt = require('../module/jwt');

router.get('/', async (req, res) => { //x == longitude y == latitude
    const partyIdx = req.query.partyIdx;
    const getLocationResult = await pool.queryParam_Arr(query.getLocationQuery, [partyIdx]);
    const userCount = (await pool.queryParam_Arr(query.selectParty, [partyIdx]))[0].userCount;

    let xArr = [];
    let yArr = [];
    for (var i = 0; i < userCount ; i++) {
        xArr.push(getLocationResult[i].userLongitude);
        yArr.push(getLocationResult[i].userLatitude);
    }
    xArr.sort((a, b) => a > b);
    yArr.sort((a, b) => a > b);
    let centerX = 0;
    let centerY = 0;
    centerX = xArr[0] + ((xArr[userCount-1] - xArr[0]) / 2);
    centerY = yArr[0] + ((yArr[userCount-1] - yArr[0]) / 2);
    const locToAddrResult = await kakaoAPI.locationToAddress(centerX, centerY); //중간지점 주소
    const transformResult = (await kakaoAPI.transform(centerX, centerY, 'WGS84', 'TM')).documents[0];
    const nearStationResult = await seoulAPI.nearStation(transformResult.x, transformResult.y); //중간지점 근처 역

    if (req.query.category == undefined || req.query.station == undefined) {

        await pool.queryParam_Arr(query.updateCenterPoint, [centerX, centerY, partyIdx]); //party의 중간지점 정보 수정
        const nearStationVerifyResult = await pool.queryParam_Arr(query.nearStationVerify, [partyIdx]);
        console.log(nearStationResult);
        console.log('=====================================================');
        if (nearStationVerifyResult.length == 0) { //신규 검색일 경우
            for (var i = 0; i < nearStationResult.stationList.length; i++) {
                console.log(nearStationResult.stationList[i]);
                await pool.queryParam_Arr(query.insertNearStation, [partyIdx, nearStationResult.stationList[i].statnId, nearStationResult.stationList[i].statnNm, nearStationResult.stationList[i].subwayXcnts, nearStationResult[i].subwayYcnts]);
            }
            res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.CENTER_POINT_COMPLETE, {
                centerAddress: locToAddrResult,
                nearStationResult: nearStationResult
            }));
        }
        else {
            res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.CENTER_POINT_COMPLETE, {
                centerAddress: locToAddrResult,
                nearStationResult: nearStationResult
            }));
        }
    }
    else {
        let category = req.query.category;
        let station = req.query.station;
        //statnNm, subwayXcnts, subwayYcnts

        let transSubway = [];
        for (var j = 0; j < nearStationResult.stationList.length; j++) {
            transSubway[j] = (await kakaoAPI.transform((nearStationResult.stationList)[j].subwayXcnts, (nearStationResult.stationList)[j].subwayYcnts, 'TM', 'WGS84')).documents[0];
            (nearStationResult.stationList)[j].list = await kakaoAPI.findByCategory(category, transSubway[j].x, transSubway[j].y, 400);
        }
        if (locToAddrResult.meta.total_count === 0) {
            res.status(200).send(resUtil.successFalse(statCode.FAIL, resMsg.NO_CENTER_POINT));
        }
        else {
            res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.CENTER_POINT_COMPLETE));

        }
    }

})

// router.get('/', async(req,res)=>{

// })


module.exports = router;
