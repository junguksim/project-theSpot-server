var express = require('express');
var router = express.Router();
const request = require('request');
const pool = require('../module/pool');
const resUtil = require('../module/responseUtil');
const statCode = require('../module/statusCode');
const resMsg = require('../module/resMsg');
const query = require('../module/query');
const ak = require('../config/appkey');

router.get('/', async (req,res)=>{ //x == longitude y == latitude
    const getLocationResult = await pool.queryParam_Arr(query.getLocationQuery, [1]);
    let area = 0 ;
    for(var i = 0 ; i < 5; i++) {
        area += (getLocationResult[i].userLongitude*getLocationResult[i+1].userLatitude - getLocationResult[i+1].userLongitude*getLocationResult[i].userLatitude);
    }
    area = area/2;
    console.log(area);

    let centerX = 0;
    let centerY = 0;
    for(var i = 0 ; i < 5 ; i++) {
        centerX += (getLocationResult[i].userLongitude+getLocationResult[i+1].userLongitude)*(getLocationResult[i].userLongitude*getLocationResult[i+1].userLatitude-getLocationResult[i+1].userLongitude*getLocationResult[i].userLatitude);
        centerY += (getLocationResult[i].userLatitude+getLocationResult[i+1].userLatitude)*(getLocationResult[i].userLongitude*getLocationResult[i+1].userLatitude-getLocationResult[i+1].userLongitude*getLocationResult[i].userLatitude);
    }
    centerX = centerX / (6*area);
    centerY = centerY / (6*area);
    console.log(centerX);
    console.log(centerY);

    const options = {
        'uri' : 'https://dapi.kakao.com/v2/local/geo/coord2address.json', 
        'headers' : {
            'Authorization' : `KakaoAK ${ak.AK}`,
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        'qs' : {
            'x' : `${centerX}`,
            'y' : `${centerY}`
        }
    }
    await request(options, (err, result)=>{
        if(err) console.log('request err : ' + err);
        else {
            res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.CENTER_POINT_COMPLETE, JSON.parse(result.body)));
        }
    })
})


module.exports = router;
