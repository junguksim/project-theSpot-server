module.exports = {
    insertUser : 'INSERT INTO user (email, profileImg, nickname) VALUES (?,?,?)',
    findAlready : 'SELECT userIdx FROM user WHERE email = ?',
    getLocationQuery : 'SELECT userLatitude, userLongitude FROM user WHERE userIdx IN (SELECT userIdx FROM user_party WHERE partyIdx=?)',
    insertParty : 'INSERT INTO party (partyName, leaderIdx, userCount) VALUES (?,?,?)'
}