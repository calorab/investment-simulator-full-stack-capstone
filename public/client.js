//trigger for when the page loads
$(function () {

    hidePages();
    $('#homePage').show();
    createAccount();
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

function goToPortfolio() {
    $(this).parent().find('#portfolioDashboard').show();
}

function createTemplate() {
    let title = $('.newTitle').val();
    let description = $('.newDescription').val();
    let cardTemplate = `<div class="card">
<h3 class="portfolioTitle">${title}</h3>
<p class="portfolioDescription">${description}</p>
<button type="submit">GO!</button>
</div>`
    return cardTemplate;
}

function displayCard(element, template) {
    $(element).html(template);
}

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

$('#loginForm').submit(event => {
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
        //console.log(loginUserObject);

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
                //            $('#loggedInUserName').val(result.username);
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

$('.addPortfolioForm').submit(event => {
    event.preventDefault;
    let card = createTemplate();
    //take the input from the user
    const title = $("#portfolioTitle").val();
    const description = $("#newPortfolioDescription").val();

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
            description: description
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
                displayCard('#portfolioSection', card);
                alert('You have successfully added a new portfolio');
                $('#userDashboard').show();
                //            $('#loggedInName').text(result.name);
                //            $('#loggedInUserName').val(result.username);
                //            $('#add-entry-container').hide();
                //            //                noEntries();
                //            //Add Entry to page
                //            $('#user-list').prepend(addEntryRenderHTML(result));
                //            $('html, body').animate({
                //                scrollTop: $(`#${result._id}`).offset().top
                //            }, 1000);
                //                $().scrollTop();
                //                updateEditFormValues(result);
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };
});
