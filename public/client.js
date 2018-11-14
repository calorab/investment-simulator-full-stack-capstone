//trigger for when the page loads
$(function () {
    hidePages();

    $('#loginPage').show();
});


//hide pages
function hidePages() {
    $('.page').each((index, item) => {
        $(item).hide();
    });
}

function addInvestment() {
    $('#addStock').submit(event => {

        alert('You have successfully added a new Stock');
    });
}

function getCardsByUser(userId, symbol) {
    console.log(userId);
    $.ajax({
            type: 'GET',
            url: '/portfolio/' + userId,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if the call is succefull
        .done(function (result) {
            console.log(result);
            displayCard(result);
        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}


function displayCard(results) {
    console.log(results);
    let cardTemplate = "";
    $.each(results, function (resultsKey, resultsValue) {
        getPortfolioById(resultsValue._id);
        cardTemplate += '<div class="card">';
        cardTemplate += `<input type="hidden" class="portfolioTitleValue" value="${resultsValue.title}">`;
        cardTemplate += `<h3 class="portfolioTitle">${resultsValue.title}</h3>`;
        cardTemplate += `<p class="portfolioDescription">${resultsValue.description}</p>`;
        cardTemplate += '<section class="portfolioWrap">';
        cardTemplate += `<section id="portfolioStats${resultsValue._id}">`;
        cardTemplate += '</section>';
        cardTemplate += '<div class="addInvestment">';
        cardTemplate += '<form class="newInvestmentForm">';
        cardTemplate += `<input type="hidden" class="portfolioIdValue" value="${resultsValue._id}">`;
        cardTemplate += '<legend>Add New Investment</legend>';
        cardTemplate += '<fieldset class="fieldset">';
        cardTemplate += '<label for="newStockTitle">Enter a stock symbol</label>';
        cardTemplate += '<input type="search" class="stockSearch" placeholder="AAPL">';
        cardTemplate += '</fieldset>';
        cardTemplate += '<button type="button" class="createNewInvestment">Get Stock</button>';
        cardTemplate += '<button type="reset" class="cancelInvestment">Cancel</button>';
        cardTemplate += '</form>';
        cardTemplate += '<div class="stockSearchResults"></div>';
        cardTemplate += '</div>';
        cardTemplate += '<hr class = "breakLine">';
        cardTemplate += '<section id="portfolioCharts"></section>';
        cardTemplate += '<div class="deletePortfolioButton">';
        cardTemplate += '<button type="button" class="deletePortfolio">Delete Portfolio</button>';
        cardTemplate += '</div>';
        cardTemplate += '</section>';
        cardTemplate += '<section>';
        cardTemplate += '<button class="showHide">Show/Hide</button>';
        cardTemplate += '</section>';
        cardTemplate += '</div>';
    });
    $("#portfolioSection").html(cardTemplate);
    $('.portfolioWrap').hide();
}

function getInvestmentsBySymbol(symbol) {
    $.ajax({
            type: 'GET',
            url: '/barchart/' + symbol,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            console.log(result);

        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}
//CALEB here display details
//function getLastPortfolio() {
//    const portfolioTitle = $('.portfolioTitleValue').val();
//
//    $.ajax({
//            type: 'GET',
//            url: '/portfolio/' + portfolioTitle,
//            dataType: 'json',
//            contentType: 'application/json'
//        })
//        //if call is succefull
//        .done(function (result) {
//            console.log(result);
//            $('#portfolioDashboard').show();
//
//        })
//        //if the call is failing
//        .fail(function (jqXHR, error, errorThrown) {
//            console.log(jqXHR);
//            console.log(error);
//            console.log(errorThrown);
//        });
//}

function getPortfolioById(portfolioId) {
    console.log(portfolioId);
    $.ajax({
            type: 'GET',
            url: '/portfolio-by-id/' + portfolioId,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            console.log(result);
            getInvestmentByPortfolioId(result[0]._id);

        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function getInvestmentByPortfolioId(portfolioId) {
    console.log(portfolioId);
    $.ajax({
            type: 'GET',
            url: '/investment-by-id/' + portfolioId,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is succesfull
        .done(function (result) {
            console.log(result);
            let investmentTemplate = "";
            $.each(result, function (resultsKey, resultsValue) {

                if (resultsValue.investmentChange > 0) {
                    investmentTemplate += `<p class="stock" >${resultsValue.investmentSymbol} <i class="fa fa-arrow-up" style="font-size:24px;color:green"></i> ${resultsValue.investmentChange}%</p>`;
                } else if (resultsValue.investmentChange <= 0) {
                    investmentTemplate += `<p class="stock" >${resultsValue.investmentSymbol} <i class="fa fa-arrow-down" style="font-size:24px;color:red"></i> ${resultsValue.investmentChange}%</p>`;
                } else if (!(resultsValue.investmentChange)) {
                    investmentTemplate += '<p class="noStocks">There are no stocks in this portfolio</p>';
                }
            });
            $(`#portfolioStats${portfolioId}`).html(investmentTemplate);

        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

$(document).on('click', '.showHide', function (event) {
    console.log("hi");

    $(this).parent().parent().find('.portfolioWrap').toggle();
});

$('#goToNewPortfolio').on('click', function (event) {
    $('#userDashboard').hide();
    $('#addPortfolio').show();
});


$(document).on("click", '.deletePortfolio', function (event) {
    if (confirm("Are you sure you want to perminently delete this portfolio?")) {
        //take the input from the user
        const portfolioId = $(this).parent().parent().parent().find('.portfolioIdValue').val();
        const loggedInUserName = $("#loggedInUserName").val();

        console.log(portfolioId, loggedInUserName);
        //make the api call using the payload above
        $.ajax({
                type: 'DELETE',
                url: `/portfolio/${portfolioId}`,
                dataType: 'json',
                contentType: 'application/json'
            })

            //if call is succefull
            .done(function (result) {
                console.log(result);
                window.location.reload();

            })

            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };
});


$('.createAccountForm').submit(event => {
    event.preventDefault();

    //take the input from the user
    const username = $("#createUsername").val();
    const password = $("#createPassword").val();
    //    const symbol = $(".stockSearch").val();
    const symbol = $(this).parent().find(".stockSearch").val();

    //validate the input
    if (username == "") {
        alert('Please add an user name');
    } else if (password == "") {
        alert('Please add a password');
    }
    //if the input is valid
    else {
        //create the payload object (what data we send to the api call)
        const newUserObject = {
            username: username,
            password: password
        };
        console.log(newUserObject);

        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/users/create',
                dataType: 'json',
                data: JSON.stringify(newUserObject),
                contentType: 'application/json'
            })
            //if call is succefull
            .done(function (result) {
                console.log(result);
                $('#loggedInUserName').val(result.username);
                alert('You have successfully created a new account');
                $('#userDashboard').show();
                getInvestmentsBySymbol(symbol);
                //                    populateUserDashboardDate(result.username);
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };
});

$('.loginForm').submit(event => {
    event.preventDefault();

    //take the input from the user
    const username = $("#loginUsername").val();
    const password = $("#loginPassword").val();
    //    const symbol = $(".stockSearch").val();
    const symbol = $(this).parent().find(".stockSearch").val();

    //validate the input
    if (username == "") {
        alert('Please input user name');
    } else if (password == "") {
        alert('Please input password');
    }
    //if the input is valid
    else {
        //create the payload object (what data we send to the api call)
        const loginUserObject = {
            username: username,
            password: password
        };
        console.log(loginUserObject);

        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/users/login',
                dataType: 'json',
                data: JSON.stringify(loginUserObject),
                contentType: 'application/json'
            })
            //if call is succefull
            .done(function (result) {
                console.log(result);
                $('#userDashboard').show();
                $('#loginPage').hide();
                $('#loggedInUserName').val(result.username);
                $('#loggedInUserId').val(result._id);
                getCardsByUser(result._id);
                getInvestmentsBySymbol(symbol);
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                alert('Incorrect Username or Password');
            });
    };
});


// ---------------Portfolio end points--------------------------
//Portfolio POST
$('.addPortfolioForm').submit(event => {
    event.preventDefault();


    //take the input from the user
    const title = $("#newPortfolioTitle").val();
    const description = $("#newPortfolioDescription").val();
    const userName = $("#loggedInUserName").val();
    const userId = $("#loggedInUserId").val();


    if (title == "") {
        alert('Please input portfolio title');
    } else if (description == "") {
        alert('Please input portfolio description');
    }
    //if the input is valid
    else {

        //create the payload object (what data we send to the api call)
        const entryObject = {
            title: title,
            description: description,
            userName: userName,
            userId: userId
        };
        console.log(entryObject);

        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/portfolio/create',
                dataType: 'json',
                data: JSON.stringify(entryObject),
                contentType: 'application/json'
            })
            //if call is succefull
            .done(function (result) {
                console.log(result);
                alert('You have successfully added a new portfolio');
                $('#userDashboard').show();
                $('#addPortfolio').hide();
                getCardsByUser(userId);
                $('.portfolioTitleValue').val(result.title);
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };
});


//$('.confirmDelete').on('click', function (event) {
//
//    //take the input from the user
//    const portfolioId = $(this).parent().find('.inputPortfolioID').val();
//    const loggedInUserName = $("#loggedInUserName").val();
//    //const parentDiv = $(this).closest('.entries-container');
//
//    //    console.log(currentForm, entryId);
//    //    console.log(entryType, inputDate, inputPlay, inputAuthor, inputRole, inputCo, inputLocation, inputNotes);
//
//    //make the api call using the payload above
//    $.ajax({
//            type: 'DELETE',
//            url: `/portfolio/${portfolioId}`,
//            dataType: 'json',
//            contentType: 'application/json'
//        })
//
//        //if call is succefull
//        .done(function (result) {
//            console.log(result);
//            alert("Portfolio deleted");
//            $('#portfolioDashboard').hide();
//            $('#userDashboard').show();
//        })
//
//        //if the call is failing
//        .fail(function (jqXHR, error, errorThrown) {
//            console.log(jqXHR);
//            console.log(error);
//            console.log(errorThrown);
//        });
//});


// ---------------Investment end points--------------------------
//create a new investment
$(document).on("click", '.createNewInvestment', function (event) {
    event.preventDefault();
    const investmentSymbol = $(this).parent().find(".stockSearch").val();
    const portfolioId = $(this).parent().find(".portfolioIdValue").val();

    if (investmentSymbol == "") {
        alert('Please input stock symbol');
    }

    //if the input is valid
    else {
        //create the payload object (what data we send to the api call)
        const entryObject = {
            investmentSymbol: investmentSymbol,
            portfolioId: portfolioId
        };
        console.log(entryObject);

        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/investment/create',
                dataType: 'json',
                data: JSON.stringify(entryObject),
                contentType: 'application/json'
            })
            //if call is succefull
            .done(function (result) {
                console.log(result);
                $('#portfolioDashboard').show();
                getPortfolioById(portfolioId);
                //alert('You have successfully added a new Investment');
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };
});

//Get an investment



//delete an investment
$('.deleteStock').on('click', function (event) {
    event.preventDefault();

    $.ajax({
            method: 'DELETE',
            dataType: 'json',
            contentType: 'application/json',
            url: '/delete - from - portfolio /' + symbol,
        })
        .done(function (result) {
            populateBucketListContainer();
            populateBeenThereContainer();
            sweetAlert('Removed!', 'Maybe next time...', 'success');
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            sweetAlert('Oops...', 'Please try again', 'error');
        });
});
