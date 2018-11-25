'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const moment = require('moment');

const User = require('./models/user');
const Investment = require('./models/investment');
const Portfolio = require('./models/portfolios');
const {
    app,
    runServer,
    closeServer
} = require('../server');
const {
    TEST_DATABASE_URL
} = require('../config');

const should = chai.should();
chai.use(chaiHttp);


// Create user to seed db and test create user
function generateUser() {
    return {
        email: faker.internet.email(),
        password: faker.internet.password()
    }
}

function seedUserData() {
    console.info('Seeding user data');
    const seedData = [];

    for (let i = 1; i < 10; i++) {
        seedData.push(generateUser());
    }
    return User.insertMany(seedData);
}


function generateType() {
    const type = ['insight', 'headspace', 'timer', 'unassisted'];
    return type[Math.floor(Math.random() * type.length)];
}

const userId = faker.random.word();

function generatePortfolioData() {


    return {
        title: faker.lorem.paragraph(),
        description: faker.lorem.paragraph(),
        userName: 'paul.thomp@gmail.com',
        userId: '5bc91e7d9eff48629be02261'
    }
}

// Seed portfolio Data
function seedPortfolioData() {
    console.info('Seeding portfolio data');
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push(generatePortfolioData());
    }
    console.log(seedData);


    return Portfolio.insertMany(seedData);
}

// Tear down Database after each test
function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection.dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

// --------------- Test User Endpoints ---------------

describe('User API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL)
            .then(console.log('Running server'))
            .catch(err => console.log({
                err
            }));
    });

    beforeEach(function () {
        return seedUserData();
    });

    // Test create a new user
    it('should create a new user', function () {
        const newUser = generateUser();
        return chai.request(app)
            .post('/users/create')
            .send(newUser)
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.include.keys('email', 'password');
                res.body.email.should.equal(newUser.email);
                res.body.password.should.not.equal(newUser.password);
                res.body._id.should.not.be.null;
            });
    });


    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
});


// --------------- Test Portfolio Endpoints ---------------

describe('Portfolio API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL)
            .then(console.log('Running server'))
            .catch(err => console.log({
                err
            }));
    });

    beforeEach(function () {
        return seedPortfolioData();
    });

    // Test create a new portfolio
    it('should create a new portfolio', function () {
        const newPortfolio = generatePortfolioData();
        return chai.request(app)
            .post('/portfolio/create')
            .send(newPortfolio)
            .then(function (res) {
                console.log(res);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.include.keys(
                    'title',
                    'description',
                    'userName',
                    'userId');
                //                res.body.loggedInUserId.should.equal(newPortfolio.loggedInUserId);
                //                res.body.portfolioDate.should.equal(newPortfolio.portfolioDate);
                //                res.body.portfolioDateUnix.should.equal(newPortfolio.portfolioDateUnix);
                //                res.body.portfolioTime.should.equal(newPortfolio.portfolioTime);
                //                res.body.portfolioType.should.equal(newPortfolio.portfolioType);
                //                res.body.journalEntry.should.equal(newPortfolio.journalEntry);
                res.body._id.should.not.be.null;
            });
    });

    //CALEB  example delete !!!
    describe('DELETE endpoint', function () {
        it('should delete an portfolio by ID', function () {
            let portfolio;
            return Portfolio
                .findOne()
                .then(function (_portfolio) {
                    portfolio = _portfolio;
                    return chai.request(app).delete(`/portfolio/${portfolio.id}`);
                })
                .then(function (res) {
                    res.should.have.status(204);
                    return Portfolio.findById(portfolio.id);
                })
                .then(function (_portfolio) {
                    should.not.exist(_portfolio);
                });
        });
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
});

// --------------- Test Investment Endpoints ---------------

describe('Investment API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL)
            .then(console.log('Running server'))
            .catch(err => console.log({
                err
            }));
    });

    //MARIUS
    beforeEach(function () {
        return seedPortfolioData();
    });

    // Test create a new portfolio
    it('should create a new Investment', function () {
        const newInvestment = generatePortfolioData();
        return chai.request(app)
            .post('/investment/create')
            .send(newInvestment)
            .then(function (res) {
                console.log(res);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.include.keys(
                    'investmentSymbol',
                    'portfolioId',
                    'userName',
                    'userId');
                //                res.body.loggedInUserId.should.equal(newPortfolio.loggedInUserId);
                //                res.body.portfolioDate.should.equal(newPortfolio.portfolioDate);
                //                res.body.portfolioDateUnix.should.equal(newPortfolio.portfolioDateUnix);
                //                res.body.portfolioTime.should.equal(newPortfolio.portfolioTime);
                //                res.body.portfolioType.should.equal(newPortfolio.portfolioType);
                //                res.body.journalEntry.should.equal(newPortfolio.journalEntry);
                res.body._id.should.not.be.null;
            });
    });

    //CALEB  example delete !!!
    describe('DELETE investment endpoint', function () {
        it('should delete an investment by ID', function () {
            let investment;
            return Investment
                .findOne()
                .then(function (_investment) {
                    investment = _investment;
                    return chai.request(app).delete(`/investment/${investment.id}`);
                })
                .then(function (res) {
                    res.should.have.status(204);
                    return Investment.findById(investment.id);
                })
                .then(function (_investment) {
                    should.not.exist(_investment);
                });
        });
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
});
