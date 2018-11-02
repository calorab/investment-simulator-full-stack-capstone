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
        $('#userDashboard').show();
    });
}

function getCardsByUser(loggedInUserName) {
    $.ajax({
            type: 'GET',
            url: '/portfolio/' + loggedInUserName,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is succefull
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
    let cardTemplate = "";
    $.each(results, function (resultsKey, resultsValue) {
        getPortfolioByTitle(resultsValue.title); //(resultsValue._id)**
        cardTemplate += `<div class="card">
<input type="hidden" class="portfolioTitleValue" value="${resultsValue.title}">
<h3 class="portfolioTitle">${resultsValue.title}</h3>
<p class="portfolioDescription">${resultsValue.description}</p>
<section id="portfolioWrap">
<section id="portfolioStats">
<p class="stocksOdd" id="stock1">AAPL <i class="fa fa-arrow-up" style="font-size:24px;color:green"></i> 1.37%</p>
<p class="stocksEven" id="stock2">GOOG <i class="fa fa-arrow-down" style="font-size:24px;color:red"></i> 3.09%</p>
<p class="stocksOdd" id="stock3">BAC <i class="fa fa-arrow-up" style="font-size:24px;color:green"></i> 5.3%</p>
<p class="stocksEven" id="stock4">TSLA <i class="fa fa-arrow-down" style="font-size:24px;color:red"></i> 0.09%</p>
<p class="stocksOdd" id="stock5">GS <i class="fa fa-arrow-up" style="font-size:24px;color:green"></i> 4.7%</p>
</section>
<div id="addInvestment">
<form class="newInvestmentForm">
<input type="hidden" class="portfolioTitleValue" value="${resultsValue.title}">
<legend>Add New Investment</legend>
<fieldset>
<label for="newStockTitle">Enter a stock symbol</label>
<input type="search" id="stockSearch" placeholder="AAPL">
</fieldset>
<button type="submit" class="submit-button" id="addStock">Add Stock</button>
<button type="button" class="cancelInvestment">Cancel</button>
</form>
<div class="stockSearchResults"></div>
</div>
<hr class="breakLine">
<section id="portfolioCharts"></section>
<div class="deletePortfolioButton">
<button type='button' class="deletePortfolio">Delete Portfolio</button>
</div>
</div>
</section>`;
    });
    $("#portfolioSection").html(cardTemplate);
}

function getLastPortfolio() {
    const portfolioTitle = $('.portfolioTitleValue').val();

    $.ajax({
        type: 'GET',
        url: '/portfolio/' + portfolioTitle,
        dataType: 'json',
        contentType: 'application/json'
    })
    //if call is succefull
        .done(function (result) {
        console.log(result);
        $('#portfolioDashboard').show();

    })
    //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });
}
//MARIUS2
function getPortfolioByTitle(portfolioTitle) {
    $.ajax({
        type: 'GET',
        url: '/portfolio/' + portfolioTitle,
        dataType: 'json',
        contentType: 'application/json'
    })
    //if call is succefull
        .done(function (result) {
        console.log(result);
        //displayInvestments();

    })
    //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
        console.log(jqXHR);
        console.log(error);
        console.log(errorThrown);
    });
}
//MARIUS3
function displayInvestments(results){
    investmentTemplateUp = `<p class="stocksOdd" >${results.symbol}<i class="fa fa-arrow-up" style="font-size:24px;color:green"></i>${results.percentChange}%</p>`;
    investmentTemplateDown = `<p class="stocksEven" >${results.symbol}<i class="fa fa-arrow-down" style="font-size:24px;color:red"></i>${results.percentChange}%</p>`;
    $.each(results, function () {
        if (results.percentChange < 0) {
            $('#portfolioStats').append(investmentTemplateDown);
        } else if (results.percentChange > 0) {
            $('#portfolioStats').append(investmentTemplateUp);
        }
    });
}

$('#goToNewPortfolio').on('click', function (event) {
    $('#userDashboard').hide();
    $('#addPortfolio').show();
});


$('.deletePortfolio').on('click', function (event) {
    let confirmDelete = `<div class="page" id="deletePortfolioPage">
<p>Are you sure you want to delete this portfolio? This is permanent.</p>
<button type="button" class="confirmDelete">Confirm</button>
<button type="button" class="cancelDelete">Cancel</button>
</div>`;
    console.log(confirmDelete);
    $('.deletePortfolioButton').html(confirmDelete);
});


$('.createAccountForm').submit(event => {
    event.preventDefault();

    //take the input from the user
    const username = $("#createUsername").val();
    const password = $("#createPassword").val();

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
                //            $('#loggedInName').text(result.name);
                $('#loggedInUserName').val(result.username);
                getCardsByUser(result.username);
                //            htmlUserDashboard();
                //            populateUserDashboardDate(result.username); //AJAX call in here??
                //                noEntries();
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
            userName: userName
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
                getCardsByUser(userName);
                //MARIUS1
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


//Portfolio GET ****
//$('#portfolioSection').on('click', 'button', function () {
//    event.preventDefault();
//
//
//});

$('.confirmDelete').on('click', function (event) {

    //take the input from the user  === QUESTION ABOUT THIS FOR MARIUS!!!
    //Marius where should inputPortfolioID be??
    const portfolioId = $(this).parent().find('.inputPortfolioID').val();
    const loggedInUserName = $("#loggedInUserName").val();
    const parentDiv = $(this).closest('.entries-container');

    //    console.log(currentForm, entryId);
    //    console.log(entryType, inputDate, inputPlay, inputAuthor, inputRole, inputCo, inputLocation, inputNotes);

    //make the api call using the payload above
    $.ajax({
            type: 'DELETE',
            //=== Marius QUESTION ABOUT THIS TOO
            url: `/portfolio/${portfolioId}`,
            dataType: 'json',
            contentType: 'application/json'
        })

        //if call is succefull
        .done(function (result) {
            console.log(result);
            alert("Portfolio deleted");
            $('#portfolioDashboard').hide();
            $('#userDashboard').show();
        })

        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
});


// ---------------Investment end points--------------------------
//create a new investment
$('.newInvestmentForm').submit(function (event) {
    event.preventDefault();

    const symbol = $("#stockSearch").val();

    if (symbol == "") {
        alert('Please input stock symbol');
    }

    //if the input is valid
    else {
        //create the payload object (what data we send to the api call)
        const entryObject = {
            symbol: symbol
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
                getLastPortfolio();
                $('.addInvestment').hide();
                alert('You have successfully added a new Investment');
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };
});

//update an investment

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
