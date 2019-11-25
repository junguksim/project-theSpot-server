var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/user', require('./user'));
router.use('/party', require('./party'));
router.use('/result', require('./result'));
router.use('/address', require('./address'));

module.exports = router;
