hidePages();

$('#homePage').show();

//hide pages
function hidePages() {
    $('.page').each((index, item) => {
        $(item).hide();
    });
}
// ++ backend
function createAccount() {
    $('#createAccountButton').submit(event => {
        alert('You have successfully created a new account');
        $('#userDashboard').show();
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
