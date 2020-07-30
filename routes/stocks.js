const express = require('express');
const {
    getCurentPrice,
    getStocks
} = require('../controllers/stocks');



const router = express.Router();




router
    .route('/:stockId')
    .get(getCurentPrice);

router
    .route('')
    .get(getStocks);

module.exports = router;
