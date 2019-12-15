module.exports = {
    //--------------------user------------------------------
    insertUser : 'INSERT INTO user (email, profileImg, nickname, accToken, refToken, kakaouuid) VALUES (?,?,?,?,?,?)',
    updateTokens : 'UPDATE user SET accToken=?, refToken=? WHERE email = ?',
    findAlready : 'SELECT userIdx FROM user WHERE email = ?',
    getLocationQuery : 'SELECT userLatitude, userLongitude FROM user WHERE userIdx IN (SELECT userIdx FROM user_party WHERE partyIdx=?)',
    getUserInfoQuery : 'SELECT nickname, profileImg, userAddress, userLatitude, userLongitude FROM user WHERE userIdx IN (SELECT userIdx FROM user_party WHERE partyIdx=?)',
    getIdxByAccToken : 'SELECT userIdx FROM user WHERE accToken = ?',
    updateAddress : 'UPDATE user SET userAddress = ? , userLongitude = ? , userLatitude = ? WHERE userIdx = ?',
    //--------------------party------------------------------
    insertParty : 'INSERT INTO party (partyName, leaderIdx, userCount) VALUES (?,?,?)',
    insertUserParty : 'INSERT INTO user_party (userIdx, partyIdx) VALUES (?,?)',
    selectAllParty : 'SELECT * FROM party WHERE partyIdx IN (SELECT partyIdx FROM user_party WHERE userIdx = ?)',
    selectParty : 'SELECT * FROM party WHERE partyIdx = ?',
    selectPartyAddress : 'SELECT centerAddress, centerLongitude, centerLatitude FROM party WHERE partyIdx = ?',
    updateCenterPoint : 'UPDATE party SET centerLongitude=?, centerLatitude=? , centerAddress=? WHERE leaderIdx=?',
    deleteParty : 'DELETE FROM party WHERE partyIdx = ?',
    insertNearStation : 'INSERT INTO party_station (partyIdx, stationIdx, stationName, stationX, stationY) VALUES (?,?,?,?,?)',
    nearStationVerify : 'SELECT * FROM party_station WHERE partyIdx = ?',
    updateStatus : 'UPDATE party SET partyStatus = 1 WHERE partyIdx = ?',

    getStationInfo : 'SELECT stationIdx, stationName, stationX, stationY FROM party_station WHERE partyIdx = ?'
}