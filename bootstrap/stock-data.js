const Stock = require('../models/Stock');

const importStockSeedData = async () => {
    const stockData = [];
    for (let i = 0; i < 100; i++) {
        stockData.push({
            "companyName": Math.random().toString(36).substring(7), //generates random company names of 100s
            "stockPrices": []
        });

    }
    const noOfDocs = await Stock.countDocuments();
    if(!noOfDocs) {
        const data = await Stock.insertMany(stockData);
        console.log("Done seeding data");
    }


};
module.exports = importStockSeedData;

