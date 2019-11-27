const request = require('request');
const ak = require('../config/appkey');

module.exports = {
    find :  (findKeyword) => {
        return new Promise((resolve, reject)=>{
            const options = {
                'uri' : 'https://dapi.kakao.com/v2/local/search/address.json', 
                'headers' : {
                    'Authorization' : `KakaoAK ${ak.kakao}`,
                    'Content-Type' : 'application/x-www-form-urlencoded'
                },
                'qs' : {
                    'query' : `${findKeyword}`
                }  
            }
    
            request(options, async (err, result)=>{
                const jsonResult = JSON.parse(result.body);
                console.log(jsonResult);
                if(err) {
                    console.log('request err : ' + err);
                    reject(err)
                }
                else resolve(jsonResult);
            })
        })
    },
    locationToAddress : (x,y) => {
        return new Promise((resolve, reject)=>{
            const options = {
                'uri' : 'https://dapi.kakao.com/v2/local/geo/coord2address.json', 
                'headers' : {
                    'Authorization' : `KakaoAK ${ak.kakao}`,
                    'Content-Type' : 'application/x-www-form-urlencoded'
                },
                'qs' : {
                    'x' : `${x}`,
                    'y' : `${y}`
                }
            }
            request(options, (err, result)=>{
                if(err) {
                    console.log('request err : ' + err);
                    reject(err);
                }
                else {
                    resolve(JSON.parse(result.body));
                }
            })
        })
    }
}