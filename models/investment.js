"use strict";

const mongoose = require('mongoose');


const investmentSchema = new mongoose.Schema({
    investmentSymbol: {
        symbol: String,
        required: false
    },
    investmentPrice: {
        lastPrice: Number,
        required: false
    },
    investmentChange: {
        percentChange: Number,
        required: false
    }
});

const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment;
