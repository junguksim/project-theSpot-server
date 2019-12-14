var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/users', require('./users'));
router.use('/parties', require('./parties'));
router.use('/results', require('./results'));
router.use('/address', require('./address'));

module.exports = router;
