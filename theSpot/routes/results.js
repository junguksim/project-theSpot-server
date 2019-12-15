var express = require('express');
var router = express.Router();
const pool = require('../module/pool');
const resUtil = require('../module/responseUtil');
const statCode = require('../module/statusCode');
const resMsg = require('../module/resMsg');
const query = require('../module/query');
const kakaoAPI = require('../module/kakaoAPI');
const seoulAPI = require('../module/seoulAPI');

router.get('/', async (req, res) => { //x == longitude y == latitude
    if (!req.query.partyIdx) {
        await res.status(200).send(resUtil.successFalse(statCode.FAIL, resMsg.NULL_VALUES));
    }
    else {
        let partyIdx = req.query.partyIdx;

        /*  partyIdx만 입력했을 경우 => 중간지점과 근처 역 5개 내놓기   */
        
        const nearStationVerifyResult = await pool.queryParam_Arr(query.nearStationVerify, [partyIdx]);
        if (nearStationVerifyResult.length == 0) { //신규 검색일 경우
            const getLocationResult = await pool.queryParam_Arr(query.getLocationQuery, [partyIdx]);
            const userCount = (await pool.queryParam_Arr(query.selectParty, [partyIdx]))[0].userCount;
            let xArr = [];
            let yArr = [];
            for (var i = 0; i < userCount; i++) {
                if (getLocationResult[i].userLongitude == null || getLocationResult[i].userLatitude == null) {
                    console.log('=================NULL ADDRESS! ===========================');
                    await res.status(200).send(resUtil.successFalse(statCode.FAIL, resMsg.NULL_VALUES)); // 주소값이 빈 유저가 있는지 검사
                }
                xArr.push(getLocationResult[i].userLongitude);
                yArr.push(getLocationResult[i].userLatitude);
            }
            xArr.sort((a, b) => a > b);
            yArr.sort((a, b) => a > b);
            let centerX = 0;
            let centerY = 0;
            centerX = xArr[0] + ((xArr[userCount - 1] - xArr[0]) / 2);
            centerY = yArr[0] + ((yArr[userCount - 1] - yArr[0]) / 2);
            const locToAddrResult = await kakaoAPI.locationToAddress(centerX, centerY); //중간지점 주소
            const transformResult = (await kakaoAPI.transform(centerX, centerY, 'WGS84', 'TM')).documents[0];
            const nearStationResult = await seoulAPI.nearStation(transformResult.x, transformResult.y); //중간지점 근처 역
            await pool.queryParam_Arr(query.updateCenterPoint, [centerX, centerY, locToAddrResult.documents[0].address.address_name,partyIdx]); //party의 중간지점 좌표 수정
            
            for (var i = 0; i < nearStationResult.stationList.length; i++) {
                await pool.queryParam_Arr(query.insertNearStation, [partyIdx, nearStationResult.stationList[i].statnId, nearStationResult.stationList[i].statnNm, nearStationResult.stationList[i].subwayXcnts, nearStationResult.stationList[i].subwayYcnts]);
            }
            console.log('=========================>>> NEW <<<CENTER POINT COMPLETE!====================================');
            await pool.queryParam_None(query.updateStatus);
            res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.CENTER_POINT_COMPLETE, {
                centerAddress: locToAddrResult,
                nearStationResult: nearStationResult
            }));
        }
        else {
            const getStationInfoResult = await pool.queryParam_Arr(query.getStationInfo, [partyIdx]);
            const selectPartyAddressResult = await pool.queryParam_Arr(query.selectPartyAddress, [partyIdx]);
            await pool.queryParam_Arr(query.updateStatus, [partyIdx]);
            console.log('=========================CENTER POINT COMPLETE!====================================');
            res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.CENTER_POINT_COMPLETE, {
                centerAddress: selectPartyAddressResult,
                nearStationResult: getStationInfoResult
            }));
        }

    }


})

router.get('/find', async (req, res) => {
    let partyIdx = req.query.partyIdx;
    let category = req.query.category;
    let station = req.query.station;
    //statnNm, subwayXcnts, subwayYcnts
    const getStationInfoResult = await pool.queryParam_Arr(query.getStationInfo, [partyIdx]);
    if(!req.query.partyIdx || !req.query.category || !req.query.station) {
        await res.status(200).send(resUtil.successFalse(statCode.FAIL, resMsg.NULL_VALUE));
    }
    else {
        for(var i = 0 ; i < getStationInfoResult.length ; i++) {
            if(getStationInfoResult[i].stationName == station) {
                const trResult = (await kakaoAPI.transform(getStationInfoResult[i].stationX, getStationInfoResult[i].stationY, 'TM', 'WGS84')).documents[0];
                const result = await kakaoAPI.findByCategory(category, trResult.x, trResult.y, 500);
                console.log('===================FIND BY CATEGORY COMPLETE========================');
                await res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.FIND_BY_CATEGORY_AND_STATION_COMPLETE, result));
            }
            else {
                if(i == getStationInfoResult.length) {
                    await res.status(200).send(resUtil.successFalse(statCode.FAIL, resMsg.WRONG_VALUE));
                }
            }
        }  
    }
})


module.exports = router;
