const moment = require('moment-timezone');

module.exports = function () { 
   return moment().tz("Asia/Kolkata").format("DD-MM-YYYY");
};
