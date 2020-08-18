var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path')
var cors = require('cors');


var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use('/static', express.static(path.join(__dirname, 'public')))

var mongoose = require('mongoose');
const stocksMongo = mongoose.createConnection("ASSET_MONGO=mongodb://127.0.0.1/stocks-test", { useNewUrlParser: true ,  useUnifiedTopology: true});
global.stocksMongo = stocksMongo;
stocksMongo.on('error', console.error.bind(console, 'Asset Mongo connection error:'));
stocksMongo.once('open', async function() {
  console.log("Stock Mongo Connection Successful!");
  const {stockMarketOpening, stockMarketWorking} = require('./util/stockMock.js');
  console.log("Starting Stock Market");
  await stockMarketOpening();
  setInterval(function(){ stockMarketWorking() }, 60000);
  console.log("Now starting per minute mocking");
});

// controllers
var stockRouter = require('./routes/stock.js');
var viewRouter = require('./routes/view.js');

// app.use('/', indexRouter);
app.use('/stocks', stockRouter);
app.use('/ui', viewRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  var message = err.message ? err.message : "Something went wrong";
  var body = {
    "message": message
  }
  
  res.send(body);
});

module.exports = app;
