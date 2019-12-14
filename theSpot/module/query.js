module.exports = {
    //--------------------user------------------------------
    insertUser : 'INSERT INTO user (email, profileImg, nickname, accToken, refToken) VALUES (?,?,?,?,?)',
    updateTokens : 'UPDATE user SET accToken=?, refToken=? WHERE email = ?',
    findAlready : 'SELECT userIdx FROM user WHERE email = ?',
    getLocationQuery : 'SELECT userLatitude, userLongitude FROM user WHERE userIdx IN (SELECT userIdx FROM user_party WHERE partyIdx=?)',
    getIdxByAccToken : 'SELECT userIdx FROM user WHERE accToken = ?',
    //--------------------party------------------------------
    insertParty : 'INSERT INTO party (partyName, leaderIdx, userCount) VALUES (?,?,?)',
    insertUserParty : 'INSERT INTO user_party (userIdx, partyIdx) VALUES (?,?)',
    selectAllParty : 'SELECT * FROM party WHERE partyIdx IN (SELECT partyIdx FROM user_party WHERE userIdx = ?)',
    selectParty : 'SELECT * FROM party WHERE partyIdx = ?',
    updateCenterPoint : 'UPDATE party SET centerLongitude=?, centerLatitude=? WHERE leaderIdx=?',
    deleteParty : 'DELETE FROM party WHERE partyIdx = ?'
}