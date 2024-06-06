/* --- Sélection des éléments du DOM --- */
const gallery = document.querySelector(".gallery");
const navFilters = document.querySelector(".filters-nav");
const divModal = document.querySelector("#modal");
const galerieModal = document.querySelector(".modal-box-galerie-photo");
const modalGallery = document.querySelector(".modal-gallery");
const ajoutModal = document.querySelector(".modal-box-ajout-photo");
const selectForm = document.querySelector("#category");

/* --- Fonctions utilitaires --- */
function createElement(tag, attributes, textContent) {
  const element = document.createElement(tag);
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/* --- Fonctions de création --- */
function createProject(project) {
  const figure = createElement("figure", { "data-tag": project.category.name, "data-id": project.id });
  const img = createElement("img", { src: project.imageUrl, alt: project.title });
  const figcaption = createElement("figcaption", {}, project.title);
  figure.append(img, figcaption);
  gallery.appendChild(figure);
}

function createButton(category) {
  const button = createElement("button", { "data-tag": category.name, "data-id": category.id }, category.name);
  navFilters.appendChild(button);
}

function createOption(category) {
  const option = createElement("option", { value: category.id }, category.name);
  selectForm.appendChild(option);
}

function createModalProject(project) {
  const figure = createElement("figure", { "data-id": project.id });
  const img = createElement("img", { src: project.imageUrl, alt: project.title, class: "modal-project-img" });
  const trashIcon = createElement("img", { src: "assets/icons/trash-icon.svg", class: "trash-icon", "data-id": project.id });
  trashIcon.addEventListener("click", () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      deleteWork(project.id);
    }
  });
  const moveIcon = createElement("img", { src: "assets/icons/move-icon.svg", class: "move-icon" });
  const figcaption = createElement("figcaption", {}, "éditer");
  figure.append(img, trashIcon, moveIcon, figcaption);
  modalGallery.appendChild(figure);
}





/* --- Prévisualisation de l'image --- */
function showFile(event) {
  const input = event.target;
  const previewImage = document.querySelector("#preview-image");
  if (previewImage) {
    previewImage.remove();
  }
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = createElement("img", { src: e.target.result, id: "preview-image" });
      document.querySelector("#ajout-box").appendChild(img);
      document.querySelector(".photo-upload-button").style.display = "none";
      document.querySelector(".picture-icon").style.display = "none";
      document.querySelector(".type-files").style.display = "none";
    };
    reader.readAsDataURL(input.files[0]);
  }
}

/* --- Vérification du formulaire --- */
function checkForm() {
  if (document.getElementById("title").value && document.getElementById("category").value && document.getElementById("image").files.length > 0) {
    document.querySelector("#valider-button").style.backgroundColor = "#1D6154";
  } else {
    document.querySelector("#valider-button").style.backgroundColor = "#a7a7a7";
  }
}

/* --- Activation du mode admin --- */
if (token) {
  adminPage();
} 