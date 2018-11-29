"use strict";

const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    title: 'string',
    description: 'string',
    userName: 'string',
    userId: 'string'
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);


module.exports = Portfolio;
