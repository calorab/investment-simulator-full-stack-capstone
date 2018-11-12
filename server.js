const User = require('./models/user');
const Investment = require('./models/investment');
const Portfolio = require('./models/portfolios');
const bodyParser = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose');
const moment = require('moment');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const express = require('express');
const https = require('https');
const http = require('http');

// testing changes

//Need to add these to package.json **
var unirest = require('unirest');
var events = require('events');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

mongoose.Promise = global.Promise;

// ---------------- RUN/CLOSE SERVER -----------------------------------------------------
let server = undefined;

function runServer(urlToUse) {
    return new Promise((resolve, reject) => {
        mongoose.connect(urlToUse, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(config.PORT, () => {
                console.log(`Listening on localhost:${config.PORT}`);
                resolve();
            }).on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

if (require.main === module) {
    runServer(config.DATABASE_URL).catch(err => console.error(err));
}

function closeServer() {
    return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    }));
}


let getFromBarchart = function (symbol) {
    let emitter = new events.EventEmitter();


    let options = {
        host: 'marketdata.websol.barchart.com',
        path: "/getQuote.json?apikey=26a582762cf5be1605b1727afd385458&symbols=" + symbol,
        method: 'GET',
        headers: {
            'Content-Type': "application/json",
            'Port': 443
        }
    };

    https.get(options, function (res) {
        let body = '';
        res.on('data', function (chunk) {
            body += chunk;
            let jsonFormattedResults = JSON.parse(body);
            emitter.emit('end', jsonFormattedResults);
        });

    }).on('error', function (e) {

        emitter.emit('error', e);
    });
    return emitter;
};

//local API endpont communicating with the external api endpoint
//localhost:8080/barchart/AAPL
app.get('/barchart/:symbol', function (req, res) {


    //external api function call and response
    let searchReq = getFromBarchart(req.params.symbol);

    //get the data from the first api call
    searchReq.on('end', function (item) {
        res.json(item);
    });

    //error handling
    searchReq.on('error', function (code) {
        res.sendStatus(code);
    });

});


// ---------------USER ENDPOINTS-------------------------------------
// POST -----------------------------------
// creating a new user
app.post('/users/create', (req, res) => {

    //take the name, username and the password from the ajax api call
    let username = req.body.username;
    let password = req.body.password;

    //exclude extra spaces from the username and password
    username = username.trim();
    password = password.trim();

    //create an encryption key
    bcrypt.genSalt(10, (err, salt) => {

        //if creating the key returns an error...
        if (err) {

            //display it
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        //using the encryption key above generate an encrypted pasword
        bcrypt.hash(password, salt, (err, hash) => {

            //if creating the ncrypted pasword returns an error..
            if (err) {

                //display it
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }

            //using the mongoose DB schema, connect to the database and create the new user
            User.create({
                username,
                password: hash,
            }, (err, item) => {

                //if creating a new user in the DB returns an error..
                if (err) {
                    //display it
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }
                //if creating a new user in the DB is succefull
                if (item) {

                    //display the new user
                    console.log(`User \`${username}\` created.`);
                    return res.json(item);
                }
            });
        });
    });
});

// signing in a user
app.post('/users/login', function (req, res) {

    //take the username and the password from the ajax api call
    const username = req.body.username;
    const password = req.body.password;

    //using the mongoose DB schema, connect to the database and the user with the same username as above
    User.findOne({
        username: username
    }, function (err, items) {

        //if the there is an error connecting to the DB
        if (err) {

            //display it
            return res.status(500).json({
                message: "Internal server error"
            });
        }
        // if there are no users with that username
        if (!items) {
            //display it
            return res.status(401).json({
                message: "Not found!"
            });
        }
        //if the username is found
        else {

            //try to validate the password
            items.validatePassword(password, function (err, isValid) {

                //if the connection to the DB to validate the password is not working
                if (err) {

                    //display error
                    console.log('Could not connect to the DB to validate the password.');
                }

                //if the password is not valid
                if (!isValid) {

                    //display error
                    return res.status(401).json({
                        message: "Password Invalid"
                    });
                }
                //if the password is valid
                else {
                    //return the logged in user
                    console.log(`User \`${username}\` logged in.`);
                    return res.json(items);
                }
            });
        };
    });
});

// -------------Portfolio ENDPOINTS------------------------------------------------
// POST -----------------------------------------
// creating a new Portfolio
app.post('/portfolio/create', (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let userName = req.body.userName;
    let userId = req.body.userId;


    Portfolio.create({
        title,
        description,
        userName,
        userId
    }, (err, item) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        if (item) {
            return res.json(item);
        }
    });
});

// GET -----------------------------------------
// reading a Portfolio
app.get('/portfolio/:userId', function (req, res) {
    Portfolio
        .find({
            userId: req.params.userId
        }).exec().then(function (portfolio) {
            return res.json(portfolio);
        })
        .catch(function (portfolio) {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        });
});

// DELETE -----------------------------------------
// deleting a  Portfolio by id

app.delete('/portfolio/:id', function (req, res) {
    Portfolio.findByIdAndRemove(req.params.id).exec().then(function (portfolio) {
        return res.status(204).end();
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});



// -------------investment ENDPOINTS------------------------------------------------
// POST -----------------------------------------
// creating a new Investment
app.post('/investment/create', (req, res) => {
    let investmentSymbol = req.body.investmentSymbol;
    let portfolioId = req.body.portfolioId;



    console.log(investmentSymbol);

    //external api function call and response
    let searchReq = getFromBarchart(investmentSymbol);

    //get the data from the first api call
    searchReq.on('end', function (portfolioDetailsOutput) {
        console.log(portfolioDetailsOutput);

        //After gettig data from API, save in the DB
        Investment.create({
            investmentSymbol,
            portfolioId,
            investmentPrice: portfolioDetailsOutput.results[0].lastPrice,
            investmentChange: portfolioDetailsOutput.results[0].percentChange,
            dateAndTime: portfolioDetailsOutput.results[0].tradeTimestamp
        }, (err, addedPortfolioDataOutput) => {
            console.log(addedPortfolioDataOutput);
            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                });
            }
            if (addedPortfolioDataOutput) {
                return res.json(addedPortfolioDataOutput);
            }
        });
    });

    //error handling
    searchReq.on('error', function (code) {
        res.sendStatus(code);
    });






});

// PUT --------------------------------------
app.put('/investment/:symbol', function (req, res) {
    let toUpdate = {};

    let updateableFields = ['investmentSymbol'];
    updateableFields.forEach(function (field) {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    //    console.log(toUpdate);
    Investment
        .findByIdAndUpdate(req.params.id, {
            $set: toUpdate
        }).exec().then(function (output) {
            return res.status(204).end();
        }).catch(function (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        });
});


// GET ------------------------------------
// accessing a single investment by id
app.get('/investment/:id', function (req, res) {
    Investment
        .findById(req.params.id).exec().then(function (investment) {
            return res.json(investment);
        })
        .catch(function (investment) {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        });
});

// DELETE ----------------------------------------
// deleting an achievement by id CALEB this endpoint could be wrong!!!
app.delete('portfolio/:id', function (req, res) {
    Investment.findByIdAndRemove(req.params.id).exec().then(function (investment) {
        return res.status(204).end();
    }).catch(function (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    });
});

// MISC ------------------------------------------
// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not Found'
    });
});

exports.app = app;
exports.runServer = runServer;
exports.closeServer = closeServer;
