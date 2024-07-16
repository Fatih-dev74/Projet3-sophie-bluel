// Fonction pour se connecter
async function userLogin() {

  const errorMessage = document.getElementById("error-login-msg");

  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", async function(event) {
      event.preventDefault(); // Empêcher le rechargement de la page

      try {
          // Créer l'objet utilisateur
          const user = {
              email: event.target.querySelector("[name=email]").value,
              password: event.target.querySelector("[name=password]").value
          }

          // Créer la charge utile au format JSON
          const chargeUtile = JSON.stringify(user);
      
          // Appeler l'API avec la fonction fetch
          const response = await fetch("http://localhost:5678/api/users/login", {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: chargeUtile
          })

          if (!response.ok) {
              throw new Error(`Erreur HTTP! Statut: ${response.status}`);
          }
          
          const data = await response.json();

          // Stocker le token dans localStorage
          const token = data.token;
          localStorage.setItem('token', token);            
          
          // Rediriger vers index.html après une connexion réussie
          window.location.href = "index.html";

      } catch(error) {
          errorMessage.classList.remove("hidden");
  
          if (error instanceof TypeError) {
              // Message si la connexion au serveur n'est pas correcte
              errorMessage.textContent = "Erreur de connexion au serveur, veuillez essayer ultérieurement.";
              setTimeout(() => {
                  errorMessage.classList.add("hidden");
              }, 3000);
          } else {
              // Message si les identifiants de connexion sont incorrects
              errorMessage.textContent = "Votre combinaison email/mot de passe est incorrecte.";
              setTimeout(() => {
                  errorMessage.classList.add("hidden");
              }, 3000);
          }

      }
  });

}

userLogin();