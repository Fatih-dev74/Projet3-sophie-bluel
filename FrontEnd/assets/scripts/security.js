'use strict';

const authentication_url = 'http://localhost:5678/api/users/login';
const store = sessionStorage;
const form = document.querySelector('#loginForm');
const topBar = document.querySelector('.topBar');
const loginLogoutLink = document.getElementById('loginLink');

/**
 * Add login/logout link to the nav bar and show edit mode if token is present
 */
document.addEventListener('DOMContentLoaded', function() {
    addAuthLink();
    displayEditionMode();
    activeLinkLogin(); 
});

/**
 * Handle form submission for login
 */
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

/**
 * Process authentication response
 * @param {Object} response - The response from the authentication request
 * @returns void
 */
function authResponse(response) 
{
    !response?.userId 
    ? authError("Erreur dans l’identifiant ou le mot de passe") : response?.token 
    ? authSuccess(response.token) : authError("Une erreur est survenue");
}

/**
 * Handle successful authentication
 * @param {string} token - The authentication token
 * @returns void
 */
function authSuccess(token) 
{
    saveToken(token);
    redirectTo('./index.html');
}

/**
 * Handle authentication error
 * @param {string} message - The error message to display
 * @returns void
 */
function authError(message) 
{
    showError(message);
}

/**
 * Save token to session storage
 * @param {string} token - The authentication token
 * @returns void
 */
function saveToken(token) {
    store.setItem('token', token);
}

/**
 * Show error message
 * @param {string} message - The error message to display
 * @returns void
 */
function showError(message) 
{
    let errNode = document.createElement('div');
        errNode.classList.add('error-message-login');
        errNode.textContent = message;
    
    form.prepend(errNode);
}

/**
 * Hide error message
 */
function hideError() 
{
    document.querySelector('.error-message-login')?.remove();
}

/**
 * Check if user is authenticated
 * @returns {boolean} - True if the user is authenticated, false otherwise
 */
function isAuthenticated() 
{
    return !!store.getItem('token');
}

/**
 * Add login or logout link to the nav bar
 */
function addAuthLink() 
{
    let navList = document.querySelector('nav ul');
    let authLink = createAuthLink();
    
    navList && (insertAuthLink(navList, authLink), isAuthenticated() && setLogoutLink(authLink));
}

/**
 * Create login link structure
 * @returns {HTMLElement} - The created login link element
 */
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

/**
 * Replace login link with logout
 * @param {HTMLElement} authLink - The login link element to replace
 * @returns void
 */
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

/**
 * Insert auth link into the nav bar
 * @param {HTMLElement} navList - The nav list element
 * @param {HTMLElement} authLink - The auth link element
 * @returns void
 */
function insertAuthLink(navList, authLink) 
{
    navList.insertBefore(authLink, navList.children[navList.children.length - 1]);
}

/**
 * Logout user
 */
function logout() 
{
    store.removeItem('token');
    redirectTo('./index.html');
}

/**
 * Update the active link based on the current URL
 */
function activeLinkLogin() 
{
    const loginLink = document.getElementById('loginLink');
    loginLink?.classList.toggle('active', loginLink?.href === window.location.href);
}

/**
 * Display full edit mode if token is present
 */
function displayEditionMode() 
{
    isAuthenticated() && (styleModif(), deleteFilters(), addModifyLink());
}

/**
 * Change the page style for edit mode
 */
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

/**
 * Remove filters
 */
function deleteFilters() 
{
    document.querySelector('.filters')?.remove();
}

/**
 * Create "modify" link with icon
 */
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