'use strict';

//add/hide pages
function hidePages() {
    $('.page').each((index, item) => {
        $(item).removeClass('show');
    });
}

function showPages(name) {
    hidePages();
    $(name).addClass('show');
}

function createAccount() {
    $('#createAccountButton').submit(() => {
        alert('You have successfully created a new account');
        showPages(userDashboard);

    });
}

function login() {
    $('#loginButton').submit(() => {
        showPages(userDashboard);
    });
}

function addPortfolio() {
    $('#createNewPortfolio').submit(() => {
        alert('You have successfully added a new portfolio');
        showPages(userDasboard);
    });
}

function addInvestment() {
    $('#addStock').submit(() => {
        alert('You have successfully added a new Stock');
        showPages(portfolioDashboard);
    });
}
