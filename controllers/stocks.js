const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Stock = require('../models/Stock');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


exports.getCurentPrice = asyncHandler(async (req, res, next) => {
    const stockId = req.params.stockId;
    const queryParams = req.query.params;
    const params = {sort:{}, searchParams:{_id: ObjectId(stockId)}};
    let query = [];
    if(!queryParams){       //gets all data for a particular stockId
        query.push({$match: params.searchParams});

    }
    if(queryParams && queryParams.includes("currentPrice")) {
        query.push({$match: params.searchParams}); //gets current price and all data for a particular stockId
    }
    if(queryParams && queryParams.includes("highLow")) {   //gets total high-low percentage from total open
        query.push(
            { $unwind : "$stockPrices"},
            {
                $group:
                    {
                        _id: null,
                        stockId: { "$first": "$_id"},
                        companyName: { "$first": "$companyName"},
                        currentPrice: { "$first": "$currentPrice"},
                        totalHigh: { $sum: "$stockPrices.high" },
                        totalLow: { $sum: "$stockPrices.low" },  // Finding total high, total low and finding percentage from total open
                        totalOpen: { $sum: "$stockPrices.open" },
                    }
            },
            {$project: {
                 '_id': "$stockId",
                "companyName": 1,
                "currentPrice" : 1,
                "totalHighLowPercentage": {$multiply: [{$divide: [{ $subtract: ["$totalHigh" , "$totalLow"]}, "$totalOpen"]}, 100]}}
            }
            );
    }
    let stockInfo = await Stock.aggregate(query);



    res.status(200).json({ success: true, data: stockInfo });
});
exports.getStocks = asyncHandler(async (req, res, next) => {
    const params = {sort:{}, searchParams:{}};
    const queryParams = req.query;
    let query = [];
    const type = req.query.type;
    const resultLimit = Number(queryParams.limit);  //for getting (n) results
    if(type === 'all') {     //getting all data for all stocks
        query.push(
            { $project: { _id: 1, companyName:1, currentPrice: 1, stockPrice: { $slice: [ "$stockPrices", -1 ] } } }, //gets the latest price of every stock
            { $unwind : "$stockPrice"});
    }

    if(!type && queryParams.sort === 'gainer') {     //getting gainer stocks
        query.push(
            { $project: { _id: 1, companyName:1, currentPrice: 1, stockPrice: { $slice: [ "$stockPrices", -1 ] } } }, //gets the latest price of every stock
            { $unwind : "$stockPrice"},
            {$addFields: {
                    gainPercentage: {$divide: [{ $subtract: ["$currentPrice" , "$stockPrice.open"]}, "$stockPrice.open"]}} //Top gainers are calculated by (current price - opening price)/opening price

            },
            {$project: {_id: 1, companyName: 1, currentPrice:1, gainPercentage:1}},
           { $sort : { gainPercentage : -1} },
            {$limit: resultLimit} //get n results





        );

    }
    if(!type && queryParams.sort === 'loser') {
        query.push(
            { $project: { _id: 1, companyName:1, currentPrice: 1, stockPrice: { $slice: [ "$stockPrices", -1 ] } } }, //gets the latest price of every stock
            { $unwind : "$stockPrice"},
            {$addFields: {
                    gainPercentage: {$divide: [{ $subtract: ["$currentPrice" , "$stockPrice.open"]}, "$stockPrice.open"]}} //Top gainers are calculated by (current price - opening price)/opening price

            },
            {$project: {_id: 1, companyName: 1, currentPrice:1, gainPercentage:1}},
            { $sort : { gainPercentage : 1} },
            {$limit: resultLimit}   //get n results





        );

    }
    let stockInfo = await Stock.aggregate(query);



    res.status(200).json({ success: true, data: stockInfo });

});


