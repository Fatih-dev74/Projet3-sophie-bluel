'use strict';

const authentication_url = 'http://localhost:5678/api/users/login';
const store = sessionStorage;
const form = document.querySelector('#loginForm');
const topBar = document.querySelector('.topBar');
const loginLogoutLink = document.getElementById('loginLink');

/*** Add login/logout link to the nav bar and show edit mode if token is present ***/
document.addEventListener('DOMContentLoaded', function() {
    addAuthLink();
    displayEditionMode();
    activeLinkLogin(); 
});

/*** Handle form submission for login ***/
form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideError();

    let data = {
        email: form.email.value,
        password: form.password.value
    };

    let response = await httpPost(authentication_url, data);
        authResponse(response);
});

function authResponse(response) 
{
    !response?.userId 
    ? authError("Erreur dans l’identifiant ou le mot de passe") : response?.token 
    ? authSuccess(response.token) : authError("Une erreur est survenue");
}

function authSuccess(token) 
{
    saveToken(token);
    redirectTo('./index.html');
}

function authError(message) 
{
    showError(message);
}

function saveToken(token) {
    store.setItem('token', token);
}

function showError(message) 
{
    let errNode = document.createElement('div');
        errNode.classList.add('error-message-login');
        errNode.textContent = message;
    
    form.prepend(errNode);
}

/*** Hide error message ***/
function hideError() 
{
    document.querySelector('.error-message-login')?.remove();
}

function isAuthenticated() 
{
    return !!store.getItem('token');
}

/*** Add login or logout link to the nav bar ***/
function addAuthLink() 
{
    let navList = document.querySelector('nav ul');
    let authLink = createAuthLink();
    
    navList && (insertAuthLink(navList, authLink), isAuthenticated() && setLogoutLink(authLink));
}

function createAuthLink() 
{
    let authAnchor = document.createElement('a');
        authAnchor.classList.add('nav-link');
        authAnchor.id = 'loginLink';
        authAnchor.textContent = "login";
        authAnchor.href = './login.html';

    let authLink = document.createElement('li');
        authLink.appendChild(authAnchor);

    return authLink;
}

function setLogoutLink(authLink) 
{
    let authAnchor = authLink.querySelector('a');
        authAnchor.textContent = "logout";
        authAnchor.href = '#';
        authAnchor.addEventListener('click', function(event) {
            event.preventDefault();
            logout();
        });
}

function insertAuthLink(navList, authLink) 
{
    navList.insertBefore(authLink, navList.children[navList.children.length - 1]);
}

/*** Logout user ***/
function logout() 
{
    store.removeItem('token');
    redirectTo('./index.html');
}

/*** Update the active link based on the current URL ****/
function activeLinkLogin() 
{
    const loginLink = document.getElementById('loginLink');
    loginLink?.classList.toggle('active', loginLink?.href === window.location.href);
}

/*** Display full edit mode if token is present ***/
function displayEditionMode() 
{
    isAuthenticated() && (styleModif(), deleteFilters(), addModifyLink());
}

/*** Change the page style for edit mode ***/
function styleModif() 
{
    let icon = document.createElement('i');
        icon.classList.add('fa-regular', 'fa-pen-to-square');

    let editionText = document.createElement('p');
        editionText.textContent = "Mode édition";

    let editionMode = document.createElement('div');
        editionMode.classList.add('editionMode');
        editionMode.appendChild(icon);
        editionMode.appendChild(editionText);

    topBar.style.margin = '38px 0 0 0';
    topBar.appendChild(editionMode);
}

/*** Remove filters ***/
function deleteFilters() 
{
    document.querySelector('.filters')?.remove();
}

/*** Create "modify" link with icon ***/
function addModifyLink() 
{
    let icon = document.createElement('i');
        icon.classList.add('fa-regular', 'fa-pen-to-square');

    let linkText = document.createTextNode("modifier");

    let modifyLink = document.createElement('a');
        modifyLink.href = '#modal';
        modifyLink.dataset.modal = 'gallery';
        modifyLink.classList.add('modify-link');
        modifyLink.appendChild(icon);
        modifyLink.appendChild(linkText);

    let projectsSection = document.querySelector('#portfolio .projects');
        projectsSection.appendChild(modifyLink);
}