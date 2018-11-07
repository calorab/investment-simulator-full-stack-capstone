"use strict";

const mongoose = require('mongoose');


const portfolioSchema = new mongoose.Schema({
    //should this be title and description rather than investments? Adding investments to a portfolio
    title: 'string',
    description: 'string',
    userName: 'string',
    userId: 'string'
    //investments CALEB Marius
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
