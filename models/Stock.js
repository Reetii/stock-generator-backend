const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const StockSchema = new mongoose.Schema(
    {
        companyName:{
            type: String,
            required:true

        },
        currentPrice:{
            type: Number,
            default: 0
        },
        stockPrices: [
            {
                open: Number,
                high: Number,
                low: Number,
                close: Number,
                volume: Number,
                createdAt: {
                    type: Date,
                    default: Date.now
                }

            }
        ],
    }
);


module.exports = mongoose.model('Stock', StockSchema);
