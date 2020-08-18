var express = require('express');
var router = express.Router();
var path = require('path');
var stockModel = require('../models/stock');

router.get('/', async (req, res, next) => {
    res.sendFile(path.resolve('public/index.html'));
});

// router.get('/getAds', async (req, res, next) => {
//     let response = {"image": "http://localhost:3000/static/demo.jpg"};
//     res.send(response);
// });

module.exports = router;

