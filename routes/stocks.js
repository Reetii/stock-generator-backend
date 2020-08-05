const express = require('express');
const {
    getCurentPrice,
    getStocks,
    getAggregatedStocks
} = require('../controllers/stocks');



const router = express.Router();

router
    .route('')
    .get(getStocks);

router
    .route('/aggregated-data')
    .get(getAggregatedStocks);

router
    .route('/:stockId')
    .get(getCurentPrice);



module.exports = router;
