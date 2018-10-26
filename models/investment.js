"use strict";

const mongoose = require('mongoose');


const investmentSchema = new mongoose.Schema({
    investmentSymbol: {
        symbol: String,
        required: false
    }
});

const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment;
