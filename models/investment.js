"use strict";

const mongoose = require('mongoose');


const investmentSchema = new mongoose.Schema({
    //change type to relavent data later
    investmentSymbol: {
        type: String,
        required: false
    },
    portfolioId: {
        type: String,
        required: false
    },
    investmentPrice: {
        type: String,
        required: false
    },
    investmentChange: {
        type: String,
        required: false
    },
    dateAndTime: {
        type: String,
        required: false
    }
});

const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment;
