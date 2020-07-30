const cron = require("node-cron");
const Stock = require('../models/Stock');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const runStockCron = () => {

    cron.schedule("* * * * *", async function () {
        try {
            const randomRecord = await Stock.aggregate([{$sample: {size: 1}}]);
            const randomRecordId = randomRecord[0]['_id'];
            let stockPrice = {
                low: Number((Math.random() * 200).toFixed(2)),
                volume: Math.ceil(Math.random() * 500)
            };
            stockPrice['open'] = stockPrice['low'];
            stockPrice['close'] = Number((Math.random() * (200 - Math.ceil(stockPrice['low']) + 1) + Math.ceil(stockPrice['low'])).toFixed(2));
            stockPrice['high'] = Number((Math.random() * (200 - Math.ceil(stockPrice['close']) + 1) + Math.ceil(stockPrice['close'])).toFixed(2));
            let currentPrice = stockPrice['close'];
            let updatedStock = await Stock.updateOne({_id: ObjectId(randomRecordId)},{$push: {'stockPrices': stockPrice} ,$set: {'currentPrice': currentPrice}});
            console.log(`Updated stock data for stock Id ${randomRecordId}`);


        }
        catch(e){

        }

    })
};
module.exports = runStockCron;

