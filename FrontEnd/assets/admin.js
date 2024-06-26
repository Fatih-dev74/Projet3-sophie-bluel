// Récupération du token
let tokenId = window.localStorage.getItem('tokenId');
console.log(tokenId);

const editionBar = document.querySelector('.edition_bar');
const sectionPortfolio = document.querySelector('#portfolio h2');
const categoryFilter = document.querySelector('.filters');
const adminLogin = document.querySelector('.login')


if (tokenId) {
    console.log('le token est bon, vous pouvez admin');
    genererAdminElement();
}

function genererAdminElement () {
    editionBar.style.display = 'block'
    const editionMod = document.createElement('div');
    editionMod.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Mode édition 
                            <button class="btn_change">publier les changements</button>`
    editionBar.appendChild(editionMod);

     const portfolioEdition = document.createElement('button');
     portfolioEdition.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> modifier`
     portfolioEdition.className = 'btn_modification';
     sectionPortfolio.appendChild(portfolioEdition);


     categoryFilter.style.display = 'none';
     adminLogin.innerHTML = 'logout'
}

adminLogin.addEventListener('click', function() {
    window.localStorage.removeItem('tokenId');
    window.location.href='./login.html';
});