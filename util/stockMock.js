const moment = require('moment-timezone');
const stockModel = require('../models/stock');

exports.stockMarketOpening = async () => {
    // This function prepares base mock data for 100 stocks

    try{
        let stockExists = await stockModel.findOne({});
        if(!stockExists){
            let baseName = "company";
            let price = 0;
            let arrayOfStocks = []
            for(let i = 0; i < 100; i++){
                if(price >= 1000) price = 0;
                let symbol = baseName+i;
                price = price+100;
                arrayOfStocks.push({symbol: symbol, open: price, current: price, high: price, low: price})
            }
            arrayOfStocks.forEach(saveData);
            async function saveData(singleStock){
                let stock = new stockModel(singleStock);
                await stock.save();
            }
            console.log("Stock Market Started");
        }else{
            console.log("Stock Market Opened Already");
        }
    }catch(openingError){
        console.log("*********************Something went wrong in openinh the stock market**************");
        throw openingError;
    }
 }
 
exports.stockMarketWorking = async () => {
    // This function pushes ticks for mock stocks and had to be called per minute

    try{
        let baseName = "company";
        let arrayOfStocks = []
        for(let i = 0; i < 100; i++){
            let symbol = baseName+i;
            let change = Math.floor((Math.random() * 50) + 1);
            let changeType = Math.floor((Math.random() * 2) + 1);
            arrayOfStocks.push({symbol: symbol, change: change, changeType});
        }
        arrayOfStocks.forEach(singleTick);
        async function singleTick(singleStock){
            let savedStock = await stockModel.findOne({symbol: singleStock.symbol});
            let current;
            if(savedStock){
                if(singleStock.changeType == 1){
                    // stock goes up
                     current = savedStock.current + singleStock.change;    
                }else{
                    //stock goes down
                    if(savedStock.current - singleStock.change < 1){
                        // if value goes in negative or 0, ignore tick change
                        current = savedStock.current;
                    }else{
                        current = savedStock.current - singleStock.change;  
                    }
                }
    
                let change = current-savedStock.current;
                savedStock.change = change;
                savedStock.percentChange = ((change/savedStock.current)*100);

                let changeFromOpen = current-savedStock.open;
                savedStock.changeFromOpen = changeFromOpen;
                savedStock.percentChangeFromOpen = ((changeFromOpen/savedStock.open)*100);

                savedStock.current = current;
                if(savedStock.high < current) savedStock.high = current;
                if(savedStock.low > current) savedStock.low = current;
                let tick = {
                    minute: moment().tz("Asia/Kolkata").diff(moment().tz("Asia/Kolkata").startOf('day'), 'minutes'),
                    price: current
                }
                savedStock.ticks.push(tick);
                savedStock.save();
            }else{
                console.log("Stock not found in db while tick for symbol ", singleStock.symbol);
            }
        }
        console.log("Tick Data Added for this minute")
    }catch(tickError){
        console.log("**********************Error in saving tick data*****************************");
    }
 }
