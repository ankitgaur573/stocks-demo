const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const stocksMongo = global.stocksMongo;
const dateToday = require('../util/dateToday');

let StockSchema = new Schema({
    dayDate: String,
    symbol: String,
    open: Number,
    current: Number,
    high: Number,
    low: Number,
    change: Number,
    percentChange: Number,
    changeFromOpen: Number,
    percentChangeFromOpen: Number,
    ticks: [{
      minute: Number,
      price: Number
    }]
},
{
  timestamps: true
});

StockSchema.pre('save', function(next) {
    this.dayDate = dateToday();
    next();
  });

// Export the model
StockModel = stocksMongo.model('Stock', StockSchema);
module.exports = StockModel;
