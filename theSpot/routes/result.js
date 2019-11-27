var express = require('express');
var router = express.Router();
const request = require('request');
const pool = require('../module/pool');
const resUtil = require('../module/responseUtil');
const statCode = require('../module/statusCode');
const resMsg = require('../module/resMsg');
const query = require('../module/query');
const ak = require('../config/appkey');
const kakaoAPI = require('../module/kakaoAPI');

router.get('/', async (req,res)=>{ //x == longitude y == latitude
    const getLocationResult = await pool.queryParam_Arr(query.getLocationQuery, [1]);
    let xArr = [];
    let yArr = [];
    for(var i = 0 ; i < 6 ; i++) {
        xArr.push(getLocationResult[i].userLongitude);
        yArr.push(getLocationResult[i].userLatitude);
    }
    xArr.sort((a,b)=>a>b);
    yArr.sort((a,b)=>a>b);
    let centerX = 0;
    let centerY = 0;
    centerX = xArr[0]+((xArr[5]-xArr[0])/2);
    centerY = yArr[0]+((yArr[5]-yArr[0])/2);
    console.log(centerX);
    console.log(centerY);

    const result = await kakaoAPI.locationToAddress(centerX, centerY);
    
    if(result.meta.total_count === 0) {
        res.status(200).send(resUtil.successFalse(statCode.FAIL,resMsg.NO_CENTER_POINT));
    }
    else {
        res.status(200).send(resUtil.successTrue(statCode.OK,resMsg.CENTER_POINT_COMPLETE, result));
    }
})


module.exports = router;
