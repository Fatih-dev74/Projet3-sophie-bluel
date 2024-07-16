// Adresse de l'API
const apiUrl = "http://localhost:5678/api/";

// Récupère les travaux depuis l'API
async function getWorks() {
  const reponse = await fetch(`${apiUrl}works`);
  let works = await reponse.json();
  return works;
}

let works = await getWorks();
const divGallery = document.querySelector(".gallery");
const divGalleryModal = document.querySelector(".gallery-modal");

// Afficher tous les travaux pour la page principale
function genererWorks(works) {
  divGallery.innerHTML = "";
  // Boucle pour afficher tous les travaux
  for (let i = 0; i < works.length; i++) {
    const work = works[i]; // Un travail
    // Créer une image et une légende de figure
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    const figCaptionElement = document.createElement("figcaption");
    figCaptionElement.innerText = work.title;
    // Créer une figure pour joindre l'image et la légende
    const figureElement = document.createElement("figure");
    figureElement.id = `${work.id}-gall`;
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figCaptionElement);
    // Attacher la figure au DOM
    const divGallery = document.querySelector(".gallery");
    divGallery.appendChild(figureElement);
  }
}

// Première exposition des travaux
genererWorks(works);

// Obtenir des catégories
async function getCategories() {
  try {
    const response = await fetch(`${apiUrl}categories`);
    return await response.json();
  } catch {
    console.error("Erreur lors de la récupération des catégories :", error);
    return [];
  }
}
const categories = await getCategories();

// Créer les boutons de filtre V2
function createFilterButtons(categories) {
  const filterBar = document.getElementById("filter-bar");
  // Créer un bouton pour tous les travaux
  const allFilterButton = document.createElement("button");
  allFilterButton.className = "filter-button";
  allFilterButton.id = "all-filter-btn";
  allFilterButton.innerText = "Tous";
  allFilterButton.addEventListener("click", () => {
    // Effacer tous les travaux précédemment filtrés
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(works);
  });
  filterBar.appendChild(allFilterButton);

  // Créer un bouton pour chaque catégorie
  categories.forEach((category) => {
    const filterButton = document.createElement("button");
    filterButton.className = "filter-button";
    filterButton.id = `filter-btn-${category.id}`;
    filterButton.innerText = category.name;
    filterButton.addEventListener("click", () => {
      const filteredWorks = works.filter(
        (work) => work.category.id === category.id
      );
      genererWorks(filteredWorks);
    });
    // Ajouter chaque bouton à la barre de filtre
    filterBar.appendChild(filterButton);
  });
}
createFilterButtons(categories);

// Créer les options de sélection
function createSelectOptions(categories) {
  const selectMenu = document.getElementById("category");
  // Créer une option pour chaque catégorie
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.innerText = category.name;
    selectMenu.appendChild(option);
  });
}
createSelectOptions(categories);

// Récupérer le token
const token = localStorage.getItem("token");
// Modifier l'affichage de index.html si connecté
if (token) {
  // Changer login en logout
  const logLink = document.getElementById("log-link");
  logLink.innerText = "logout";
  // Afficher la barre "Mode édition"
  const modeEdition = document.getElementById("creation-mode");
  modeEdition.classList.remove("hidden");
  // Afficher le lien "modifier"
  const modifProjects = document.getElementById("modif-projects");
  modifProjects.classList.remove("hidden");
  // Masquer les filtres
  const filterBar = document.getElementById("filter-bar");
  filterBar.classList.add("hidden");

  // Déconnexion si le lien est cliqué
  logLink.addEventListener("click", (event) => {
    event.preventDefault(); // Empêcher la redirection vers login.html
    localStorage.removeItem("token"); // Supprimer le token
    location.reload(); // Recharger la page
  });
}

// Variables pour les Modals et les écouteurs
const modal = document.querySelectorAll(".modal");
const openModalBtn = document.querySelectorAll(".btn-open");
openModalBtn[0].addEventListener("click", openModal1);
const openModal2Btn = document.querySelector("#open-modal-2");
openModal2Btn.addEventListener("click", openModal2);
const closeModalBtn = document.querySelectorAll(".btn-close");
closeModalBtn[0].addEventListener("click", closeModal);
closeModalBtn[1].addEventListener("click", closeModal);
const overlay = document.querySelector(".overlay");
overlay.addEventListener("click", closeModal);
const backModal1 = document.querySelector("#back");
backModal1.addEventListener("click", openModal1);

// Ouvrir Modal 1
async function openModal1() {
  modal[0].classList.remove("hidden");
  modal[1].classList.add("hidden");
  overlay.classList.remove("hidden");
  resetModal2();
  works = await getWorks();
  // Afficher tous les travaux
  genererThumbnails(works);
}

// Ouvrir modal 2
function openModal2() {
  modal[1].classList.remove("hidden");
  modal[0].classList.add("hidden");
}

// Fermer Modal 1 & 2
function closeModal() {
  modal[0].classList.add("hidden");
  modal[1].classList.add("hidden");
  overlay.classList.add("hidden");
}

// Créer tous les travaux pour le modal
function genererThumbnails(works) {
  divGalleryModal.innerHTML = "";
  // Boucle pour afficher tous les travaux
  for (let i = 0; i < works.length; i++) {
    const work = works[i]; // Un travail
    // Créer l'image
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    // Créer une poubelle
    const divTrash = document.createElement("div");
    divTrash.className = "trash";
    const imgTrash = document.createElement("img");
    imgTrash.src = "assets/icons/trashbin.png";
    divTrash.appendChild(imgTrash);
    // Créer une figure pour joindre l'image et la poubelle
    const figureElement = document.createElement("figure");
    figureElement.id = `${work.id}-thumb`;
    figureElement.appendChild(imageElement);
    figureElement.appendChild(divTrash);
    // Attacher la figure au DOM
    const divGalleryModal = document.querySelector(".gallery-modal");
    divGalleryModal.appendChild(figureElement);

    // Ajouter un écouteur d'événement pour le clic sur la poubelle
    divTrash.addEventListener("click", function (event) {
      // Empêcher la propagation de l'événement
      event.stopPropagation();
      // Appeler la fonction de suppression
      deleteWork(work.id);
    });
  }
}

// Supprimer un travail
// Fonction pour supprimer un travail avec son ID
async function deleteWork(workId) {
  const deleteMsg = document.getElementById("delete-msg");
  try {
    const response = await fetch(`${apiUrl}works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      let message = "Projet supprimé avec succès.";
      displayMessage(deleteMsg, message, "success-message");
      // Supprimer le travail du modal
      const deletedWorkModal = document.getElementById(`${workId}-thumb`);
      deletedWorkModal.remove();
      // Supprimer le travail de la galerie
      const deletedWorkGall = document.getElementById(`${workId}-gall`);
      deletedWorkGall.remove();
    }
  } catch (error) {
    let message = `Impossible de supprimer le projet : ${error.message}`;
    displayMessage(deleteMsg, message, "error-message");
  }
}

// Vérifier le champ du formulaire
function checkFormField(field) {
  if (field.value === "") {
    throw new Error(`Le champ ${field.name} est vide. Veuillez le renseigner.`);
  }
}

// Sélectionner le champ du formulaire et vérifier s'il est rempli pour changer le style du bouton de validation
const title = document.getElementById("title");
title.addEventListener("input", updateValidationBtnStyle);
const category = document.getElementById("category");
category.addEventListener("input", updateValidationBtnStyle);
const filediv = document.getElementById("file-input");
filediv.addEventListener("input", updateValidationBtnStyle);
const validationBtn = document.getElementById("validation-btn");

// Vérifier le formulaire et changer le style du bouton de validation
function updateValidationBtnStyle() {
  // Vérifiez que tous les champs sont remplis
  if (title.value !== "" && category.value !== "" && filediv.value !== "") {
    // Changer le style du bouton de validation
    validationBtn.style.backgroundColor = "#1D6154";
  }
}

// Créer un travail
// Fonction pour ajouter un travail
const projectForm = document.getElementById("project-form");
projectForm.addEventListener("submit", async function (event) {
  // Empêcher le rechargement de la page après la soumission du formulaire
  event.preventDefault();
  const statutMsg = document.getElementById("statut-msg");
  // Vérifier le formulaire
  try {
    checkFormField(title);
    checkFormField(category);
    checkFormField(filediv);
  } catch (error) {
    let message = `${error.message}`;
    displayMessage(statutMsg, message, "error-message");
  }
  // Envoyer les données du formulaire
  try {
    const formData = new FormData(this);
    const token = localStorage.getItem("token");
    const response = await fetch(`${apiUrl}works`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (response.ok) {
      // Attendre la mise à jour des travaux
      const updatedWorks = await getWorks();
      genererWorks(updatedWorks);
      let message = "Projet ajouté avec succès.";
      await displayMessage(statutMsg, message, "success-message");
      // Effacer le formulaire et fermer le modal
      projectForm.reset();
      closeModal();
    }
  } catch (error) {
    let message = `Erreur du serveur lors de l'envoi du formulaire : ${error.message}`;
    displayMessage(statutMsg, message, "error-message");
  }
});

// Fonction de message
async function displayMessage(element, message, className) {
  element.className = className;
  element.classList.remove("hidden");
  element.textContent = message;
  await new Promise((resolve) => setTimeout(resolve, 3000));
  element.classList.add("hidden");
}

// Bouton d'entrée
function openFileInput() {
  document.getElementById("file-input").click();
}

const addButton = document.getElementById("add-button-filediv");
addButton.addEventListener("click", openFileInput);
const fileInput = document.getElementById("file-input");
fileInput.addEventListener("change", displaySelectedImage);
const fileDiv = document.getElementById("filediv");

// Afficher l'image téléchargée
function displaySelectedImage() {
  // Vérifier si un fichier est sélectionné
  if (fileInput.files) {
    const selectedImage = fileInput.files[0];
    // Créer un objet URL pour l'image sélectionnée
    const imageURL = URL.createObjectURL(selectedImage);
    // Créer un élément image
    const imgElement = document.createElement("img");
    imgElement.src = imageURL;
    imgElement.id = "image-to-upload";
    // Ajouter l'image à la div parent
    fileDiv.appendChild(imgElement);
    // Changer la hauteur de l'image
    imgElement.style.height = "100%";
    // Masquer tous les éléments derrière l'image
    hideAllElementsBehindImage(fileDiv, imgElement);
  }
}

function hideAllElementsBehindImage(parentElement, exceptionElement) {
  // Récupérer tous les éléments de parentElement
  const childElements = parentElement.children;
  // Appliquer la classe hidden à tous les childElements sauf un
  for (const child of childElements) {
    if (child !== exceptionElement) {
      child.classList.add("hidden");
    }
  }
}

// Fonction pour réinitialiser Modal 2
function resetModal2() {
  const imgElement = document.getElementById("image-to-upload");
  // Supprimer l'image si présente
  if (imgElement) {
    imgElement.remove();
  }
  // Réinitialiser la classe
  const pictureFileDiv = document.getElementById("picture-filediv");
  const addButtonFileDiv = document.getElementById("add-button-filediv");
  const textFileDiv = document.getElementById("text-filediv");
  pictureFileDiv.classList.remove("hidden");
  addButtonFileDiv.classList.remove("hidden");
  textFileDiv.classList.remove("hidden");
  // Effacer le contenu des champs
  fileInput.value = "";
  title.value = "";
  category.value = "";
  validationBtn.style.backgroundColor = "";
}