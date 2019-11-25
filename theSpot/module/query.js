module.exports = {
    insertUser : 'INSERT INTO user (email, profileImg, nicknamE) VALUES (?,?,?)',
    findAlready : 'SELECT userIdx FROM user WHERE email = ?'
}