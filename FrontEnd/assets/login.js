const loginForm = document.querySelector('.login');

// Envoie sur l'API
async function fetchLogin() {
    const mail = document.querySelector('#mail').value;
    const password = document.querySelector('#password').value;
    if (mail === 'sophie.bluel@test.tld' && password === 'S0phie') {
        await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: mail,
            password: password,
        }),
    })
        .then((response) => {
            console.log(response);
            if (response.status === '404') {
                return false;
            }
            return response.json()
        })
        .then ((data) => {
            window.localStorage.setItem('tokenId', data.token); // Stockage du token
            window.location.href = './index.html';
        })
    } else {
        const error = document.querySelector('.error');
        error.style.display = 'flex';
    }
}

// Bouton de validation du login
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await fetchLogin();
});