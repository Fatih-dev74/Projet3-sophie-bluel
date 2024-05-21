const gallery = document.querySelector(".gallery");

const navFilters = document.querySelector(".filters-nav");

// modal box gallery photo
const galerieModal = document.querySelector(".modal-box-galerie-photo");
// gallery photo modal 1
const ModalGallery = document.querySelector(".modal-gallery");
// gallery photo modal 2
const ajoutModal = document.querySelector(".modal-box-ajout-photo");
// ajouter des photos
const selectForm = document.querySelector("#category");

// Utilisation pour concevoir un projet dans la galerie
const createProject = (project) => {
  const figureProject = document.createElement("figure");
  figureProject.setAttribute("data-tag", project.category.name);
  figureProject.setAttribute("data-id", project.id);

  const imageProject = document.createElement("img");
  imageProject.src = project.imageUrl;
  imageProject.alt = project.title;

  const figcaptionProject = document.createElement("figcaption");
  figcaptionProject.innerText = project.title;

  figureProject.appendChild(imageProject);
  figureProject.appendChild(figcaptionProject);
  gallery.appendChild(figureProject);
};

// Utilisation pour créer un bouton dans la nav des filtres
const createFilterButton = (category) => {

  const btn = document.createElement("button");
        btn.setAttribute("data-tag", category.name);
        btn.setAttribute("data-id", category.id);
        btn.innerText = category.name;
  navFilters.appendChild(btn);
};

const createOption = (category) => {
  const optionForm = document.createElement("option");
  optionForm.setAttribute("value", category.id);
  optionForm.innerText = category.name;
  selectForm.appendChild(optionForm);
};

// Fonction qui supprime tous les éléments enfant d'un élément parent dans le DOM.
const dropElement = (parent_element) => {
// Il faut au moins un enfant
  while(parent_element.childNodes.length > 0) {
// Le dernier élément est supprimé. Le précédent devient le dernier, jusqu'à ce qu'il n'y ait plus aucun enfant.
    parent_element.removeChild(parent_element.lastChild);
  }
};


// La fonction "Fetch" pour récupère les works de l'API
const getWorks = async (categoryId) => {
// On met le lien de l'API Works 
  await fetch("http://localhost:5678/api/works")
// Une fois que le fetch est activé, les données sont récupérées en Java. Dans le cas contraire, une erreur est affichée.
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      console.log("Erreur dans la récupération des données de l'API");
    }
  })

  .then((project) => {
    // On efface tous les travaux pour avoir une page blanche
    dropElement(gallery); // Sur la galerie
    dropElement(modalGallery); // Dans la modale

    project.forEach((project) => {
      //si categoryId est vide, on affiche tout
      //si categoryId est renseigné, On filtre les works sur la catégorie,
      if (categoryId == project.category.id || categoryId == null) {
        createProject(project); // Créé la galerie section portfolio
        createModalProject(project); // Créé la galerie dans la modale
      }
    });
  })
  .catch((error) => {
    console.log(error);
  });
};


// La fonction "Fetch" pour récupère les categories de filtres de l'API
const getCategories = async(category) => {
  // On met le lien de l'API Works
  await fetch("http://localhost:5678/api/categories")
  // Une fois que le fetch est activé, les données sont récupérées en Java. Dans le cas contraire, une erreur est affichée.
  .then((response) => {
    if(response.ok) {
      return response.json();
    } else {
      console.log("Erreur dans la récupération des donnés de l'API")
    }
  })

  .then((category) => {
    category.forEach((category) =>{
      createButton(category);
      createOption(category);
    });
  })

  .then((filter) => {
    // on récupère les boutons et les filtres
    const buttons = document.querySelectorAll(".filters-nav button")
    buttons.forEach((button) => {
      // a chaque fois qu'on clic sur les buttons
      button.addEventListener("click", function() {

        // obtenir l'identifiant de la catégorie
        let categorieId = button.getAttribute("data-id");
        console.log(categorieId);

        // La classe 'is-active' est supprimée pour chaque bouton.
        buttons.forEach((button) => button.classList.remove("is-active"));

        // Ensuite, nous ajoutons la classe active au bouton cliqué.
        this.classList.add("is-active");

        // Les workflows de l'API sont récupérés en fonction des catégories.
        getWorks(categorieId);
      });
    });
  })

  .catch((error) => {
    console.log(error);
  });
};


// Fonction permettant d'afficher le getWorks sans paramètre (tout affiché).
const main = async () => {
  await getWorks();
  await getCategories();
};

// une fois la page ouverte on execute la fonction getWorks et getCategories
main();


// Fonctions du mode administrateur

// Get the body 
const body = document.querySelector("body");
//obtenir  l'image principale de Sophie
const imgSophie = document.querySelector("#introduction img");
//obtenir le titre de la galerie
const galleryTitle = document.querySelector("#portfolio h2")
// il faut récupérer le token
const token = window.sessionStorage.getItem("token");


// Fonction permettant de se déconnecter de l'administrateur
const logOut = () => {
  sessionStorage.removeItem("token");
  window.location.href = "./index.html";
};


// Fonction permettant de créer les éléments du mode administrateur
const adminPage = () => {
  body.insertAdjacentHTML(
    "afterbegin",
    `<div class="edit-bar">
        <span class="edit"><i class="fa-regular fa-pen-to-square"></i> Mode édition</span>
        <button>publier les changements</button>
    </div>`
  );
  // button pour modifier l'images
  imgSophie.insertAdjacentHTML(
    "afterend",
    `<a href="#" class="edit-link">
      <i class="fa-regular fa-pen-to-square"></i>modifier
    </a>`
  );
  // button pour modifier les titres de la galerie
  galleryTitle.insertAdjacentHTML(
    "afterend",
    `<a id="open-modal" href="#modal" class="edit-link">
      <i class="fa-regular fa-pen-to-square"></i>modifier
    </a>`
  );

  //pour enlever les filtres
  document.querySelector(".filters-nav").computedStyleMap.display = "none";
  document.querySelector(".portfolio-title").computedStyleMap.paddingBottom = "76px";

  // ajout du button login et logout
  const logButton = document.querySelector("#logButton");
  // on met le button login a la place de logout
  logButton.innerHTML = `<a href="./index.html">logout</a>`;
  // À chaque clic sur le button la fonction logout s'exécute
  logButton.addEventListener("click", logOut);

  // ajout du button pour modifier et ouverture du modale
  const modalLink = document.querySelector("#open-modal");
  // À chaque clic sur le button la fonction openModal s'exécute
  modalLink.addEventListener("click", openModal); //jsp pk le open modal ne s'affiche pas en jaune!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
};


// Fonction pour supprimer un projet dans le modale
const deleteWork = async(workID) => {
  // On importe le lien de l'API Works
  await fetch("http://localhost:5678/api/works/1"+workID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  }).catch((error) => {
    console.log(error);
  });

  //fonction pour afficher des produits ; getWorks()
  getWorks();
};


// Utilisation de la modale pour créer un projet
const createModalProject = (project) => {
  const figureModalProject = document.createElement("figure");
  figureModalProject.setAttribute("data-id", project.id);

  const imageModalProject = document.createElement("img");
  imageModalProject.src = project.imageUrl;
  imageModalProject.alt = project.title;
  imageModalProject.classList.add("modal-project-img");

  const trashIcon = document.createElement("img");
  trashIcon.src = "assets/icons/trash-icon.svg";
  trashIcon.classList.add("trash-icon");
  trashIcon.setAttribute("data-id", project.id);
  let trashIconID = trashIcon.getAttribute("data-id");

  trashIcon.addEventListener("click", function (event) {
    event.preventDefault();
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?") == true){
      deleteWork(trashIconID);
    }
  });

  const moveIcon = document.createElement("img");
  moveIcon.src = "assets/icons/move-icon.svg";
  moveIcon.classList.add("move-icon");

  const figcaptionModalProject = document.createElement("figcaption");
  figcaptionModalProject.innerText = "éditer";

  figureModalProject.appendChild(imageModalProject);
  figureModalProject.appendChild(trashIcon);
  figureModalProject.appendChild(moveIcon);
  figureModalProject.appendChild(figcaptionModalProject);
  ModalGallery.appendChild(figureModalProject);
};