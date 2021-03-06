'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const moment = require('moment');

const User = require('../models/user');
const Investment = require('../models/investment');
const Portfolio = require('../models/portfolios');
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
        username: faker.internet.email(),
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

const userId = faker.random.word();

function generatePortfolioData() {


    return {
        title: faker.lorem.paragraph(),
        description: faker.lorem.paragraph(),
        userName: 'paul.thomp@gmail.com',
        userId: '5bc91e7d9eff48629be02261'
    }
}

function generateInvestmentData() {


    return {
        investmentSymbol: 'AAPL',
        portfolioId: '5be23cb71eb528683f98ac21',
        investmentPrice: '1038.69',
        investmentChange: '0.25',
        dateAndTime: '2018-11-14T13:28:45-06:00'
    }
}

// Seed portfolio Data
function seedPortfolioData() {
    console.info('Seeding portfolio data');
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push(generatePortfolioData());
    }
    //    console.log(seedData);


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
                res.body.should.include.keys('username', 'password');
                res.body.username.should.equal(newUser.username);
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
                //                console.log(res);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.include.keys(
                    'title',
                    'description',
                    'userName',
                    'userId');
                res.body._id.should.not.be.null;
            });
    });

    //CALEB  example delete !!!

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
                return Portfolio.findById(portfolio._id)
            })
            .then(function (_portfolio) {
                should.not.exist(_portfolio);
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
        const newInvestment = generateInvestmentData();
        return chai.request(app)
            .post('/investment/create')
            .send(newInvestment)
            .then(function (res) {
                //                console.log(res);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.include.keys(
                    'investmentSymbol',
                    'portfolioId',
                    'investmentPrice',
                    'investmentChange',
                    'dateAndTime');
                res.body._id.should.not.be.null;
            });
    });

    //CALEB  example delete !!!

    it('should delete an investment by ID', function () {
        let investment;
        return Investment
            .findOne()
            .then(function (_investment) {
                console.log(_investment);
                investment = _investment;
                return chai.request(app).delete(`/investment/${_investment._id}`);
            })
            .then(function (res) {
                res.should.have.status(204);
                return Investment.findById(investment._id)
            })
            .then(function (_investment) {
                should.not.exist(_investment);
            });
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
});
