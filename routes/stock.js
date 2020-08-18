var express = require('express');
var router = express.Router();
var path = require('path');
var stockModel = require('../models/stock');

router.get('/', async (req, res, next) => {
    let limit = req.query.limit;
    if(!limit) limit = 5;
    let q = req.query.q;
    limit = parseInt(limit);
    if(limit < 1 || limit > 50) res.status(404).send({message: "Allowed Limit Between 1 and 50 !"});
    let query = {};
    if(q) query.symbol = { $regex: q, $options: 'i'};
    let stockData = await stockModel.find(query, { symbol: 1, open: 1, high:1, low: 1, current: 1, changeFromOpen:1, percentChangeFromOpen: 1, _id: 0 }).limit(limit);
    res.send(stockData);
});

router.get('/:symbol', async (req, res, next) => {
    let symbol = req.params.symbol;
    let stockData = await stockModel.findOne({symbol: symbol});
    if(stockData) res.send(stockData);
    else res.status(404).send({message: "Not Found!"});
});

router.get('/leaders/data', async (req, res, next) => {
    let limit = req.query.limit;
    if(!limit) limit = 5;
    limit = parseInt(limit);
    if(limit < 1 || limit > 50) res.status(404).send({message: "Allowed Limit Between 1 and 50 !"})
    let stockDataLosers = await stockModel.find({}, { symbol: 1, open: 1, current: 1, changeFromOpen:1, percentChangeFromOpen: 1, _id: 0 }).sort({percentChangeFromOpen: 1}).limit(limit);
    let stockDataGainers = await stockModel.find({}, { symbol: 1, open: 1, current: 1, changeFromOpen:1, percentChangeFromOpen: 1, _id: 0 } ).sort({percentChangeFromOpen: -1}).limit(limit);
    let data = {
        gainers: stockDataGainers,
        losers: stockDataLosers
    }
    res.send(data);
});

router.get('/getJS', async (req, res, next) => {
    res.sendFile(path.resolve('public/render.js'));
});

router.get('/getAds', async (req, res, next) => {
    let response = {"image": "http://localhost:3000/static/demo.jpg"};
    res.send(response);
});

module.exports = router;

