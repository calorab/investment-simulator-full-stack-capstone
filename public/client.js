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
// ++ backend
function createAccount() {

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
                    $('#loggedInName').text(result.name);
                    $('#loggedInUserName').val(result.username);
                    $('section').hide();
                    $('.navbar').show();
                    $('#user-dashboard').show();
                    populateUserDashboardDate(result.username);
                })
                //if the call is failing
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                });
        };
        //        alert('You have successfully created a new account');
        //        $('#userDashboard').show();
    });
}

function login() {
    $('#loginButton').submit(event => {
        $('#userDashboard').show();
    });
}

function addPortfolio() {
    $('#createNewPortfolio').submit(event => {
        event.preventDefault;
        let card = createTemplate();
        displayCard('#portfolioSection', card);
        alert('You have successfully added a new portfolio');
        $('#userDashboard').show();
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
