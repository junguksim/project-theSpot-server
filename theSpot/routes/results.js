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
    if (req.query.category == undefined || req.query.station == undefined) {
        let ID = jwt.verify(req.headers.authorization);
        const getLocationResult = await pool.queryParam_Arr(query.getLocationQuery, [req.body.partyIdx]);
        let xArr = [];
        let yArr = [];
        for (var i = 0; i < 6; i++) {
            xArr.push(getLocationResult[i].userLongitude);
            yArr.push(getLocationResult[i].userLatitude);
        }
        xArr.sort((a, b) => a > b);
        yArr.sort((a, b) => a > b);
        let centerX = 0;
        let centerY = 0;
        centerX = xArr[0] + ((xArr[5] - xArr[0]) / 2);
        centerY = yArr[0] + ((yArr[5] - yArr[0]) / 2);

        const locToAddrResult = await kakaoAPI.locationToAddress(centerX, centerY);
        await pool.queryParam_Arr(query.updateCenterPoint, [centerX, centerY, ID]);
        res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.CENTER_POINT_COMPLETE, locToAddrResult));
    }
    else {
        let category = req.query.category;
        let station = req.query.station;
        //statnNm, subwayXcnts, subwayYcnts
        const transformResult = (await kakaoAPI.transform(centerX, centerY, 'WGS84', 'TM')).documents[0];
        const nearStationResult = await seoulAPI.nearStation(transformResult.x, transformResult.y);
        let transSubway = [];
        for (var j = 0; j < nearStationResult.stationList.length; j++) {
            transSubway[j] = (await kakaoAPI.transform((nearStationResult.stationList)[j].subwayXcnts, (nearStationResult.stationList)[j].subwayYcnts, 'TM', 'WGS84')).documents[0];
            (nearStationResult.stationList)[j].list = await kakaoAPI.findByCategory('FD6', transSubway[j].x, transSubway[j].y, 400);
        }
    
        if (locToAddrResult.meta.total_count === 0) {
            res.status(200).send(resUtil.successFalse(statCode.FAIL, resMsg.NO_CENTER_POINT));
        }
        else {
            res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.CENTER_POINT_COMPLETE, {
                locToAddrResult: locToAddrResult,
                nearStationResult: nearStationResult
            }));
    
        }
    }
    
})

// router.get('/', async(req,res)=>{

// })


module.exports = router;
