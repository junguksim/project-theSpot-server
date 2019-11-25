var express = require('express');
var router = express.Router();
const request = require('request');
const resUtil = require('../module/responseUtil');
const statCode = require('../module/statusCode');
const resMsg = require('../module/resMsg');
const ak = require('../config/appkey');

router.get('/find', async (req,res)=>{
    const options = {
        'uri' : 'https://dapi.kakao.com/v2/local/search/address.json', 
        'headers' : {
            'Authorization' : `KakaoAK ${ak.AK}`,
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        'qs' : {
            'query' : `${req.query.addr}`
        }
        
    }
    if(!req.query.addr) {
        await res.status(200).send(resUtil.successFalse(statCode.FAIL, resMsg.NO_ADDRESS_INPUT))
    }
    else {
        await request(options, async (err, result)=>{
            const jsonResult = JSON.parse(result.body);
            console.log(jsonResult);
            if(err) console.log('request err : ' + err);
            else if (jsonResult.meta.total_count == 0) { //찾는 주소가 없을때
                await res.status(200).send(resUtil.successFalse(statCode.FAIL, resMsg.NO_FIND_RESULT));
            }
            else {
                await res.status(200).send(resUtil.successTrue(statCode.OK, resMsg.FIND_ADDRESS_SUCCESS, jsonResult));
            }
        })
    }
})

router.get('/', async (req,res)=>{

})


module.exports = router;
