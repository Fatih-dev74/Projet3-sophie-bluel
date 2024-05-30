// il faut récupérer le form
const form = document.getElementById("form");
// il faut récupérer l'input "email"
const email = document.getElementById("email");
// il faut récupérer l'input "password"
const password = document.getElementById("password");
// il faut récupérer  le span "error-message"
const error = document.querySelector(".error-message");
error.innerText = "";

// La fonction redirection
function goHome() {
  document.location.href = "./index.html";
}

//Lorsque le formulaire est soumis, la fonction est exécutée.
form.addEventListener("submit", function (event) {
  event.preventDefault();

  //Un objet est créé pour récupérer les données du formulaire.
  let user = {
    email: email.value,
    password: password.value,
  };

   // Nous utilisons l'API login pour envoyer nos données rentrées.
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Les données de l'utilisateur sont placées dans le JSON.
    body: JSON.stringify(user), 
  })
    // nous obtenons la réponse
    .then((response) => {
      // Dans le cas où le statut est de 200, les données sont conservées dans le JSON.
      if (response.ok) {
        return response.json();
        // Dans le cas où les deux champs ne concordent pas.
      } else if (response.status === 401) {
        console.log("Unauthorized");
        error.innerText = "Erreur dans l'identifiant et/ou le mot de passe";
        // Dans le cas où un utilisateur inconnu se trouve dans la base de données.
      } else if (response.status === 404) {
        console.log("User not found");
        error.innerText = "Utilisateur inconnu";
      }
    })
    // Il faut récupérer le token dans les données du JSON, le stocker, puis le rediriger.
    .then((data) => {
      sessionStorage.setItem("token", data.token);
      goHome();
    })
    .catch((error) => {
      console.log(error);
    });
});