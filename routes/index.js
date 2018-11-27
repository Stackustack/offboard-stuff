const express = require('express');
const router = express.Router();
const {
  urlGoogle
} = require('./../src/google-utils')

/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('login', {
    url: urlGoogle()
  })

});

module.exports = router;