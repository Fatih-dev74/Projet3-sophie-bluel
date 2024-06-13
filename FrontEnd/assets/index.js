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

/* --- Récupération des données de l'API --- */
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Erreur de récupération des données");
  return response.json();
}

async function init() {
  try {
    const [works, categories] = await Promise.all([
      fetchData("http://localhost:5678/api/works"),
      fetchData("http://localhost:5678/api/categories")
    ]);

    categories.forEach(category => {
      createButton(category);
      createOption(category);
    });

    document.querySelectorAll(".filters-nav button").forEach(button => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".filters-nav button").forEach(btn => btn.classList.remove("is-active"));
        button.classList.add("is-active");
        displayWorks(works, button.getAttribute("data-id"));
      });
    });

    displayWorks(works);

  } catch (error) {
    console.error(error);
  }
}

function displayWorks(works, categoryId) {
  clearElement(gallery);
  clearElement(modalGallery);
  works.forEach(project => {
    if (!categoryId || categoryId == project.category.id) {
      createProject(project);
      createModalProject(project);
    }
  });
}

/* --- Initialisation --- */
init();

/* --- Fonctions du mode admin --- */
const token = window.sessionStorage.getItem("token");

function logOut() {
  sessionStorage.removeItem("token");
  window.location.href = "./index.html";
}

function adminPage() {
  document.body.insertAdjacentHTML("afterbegin", `
    <div class="edit-bar">
      <span class="edit"><i class="fa-regular fa-pen-to-square"></i> Mode édition</span>
      <button>publier les changements</button>
    </div>
  `);

  document.querySelector("#portfolio h2").insertAdjacentHTML("afterend", `
    <a id="open-modal" href="#modal" class="edit-link"><i class="fa-regular fa-pen-to-square"></i>modifier</a>
  `);
  document.querySelector(".filters-nav").style.display = "none";
  document.querySelector(".portfolio-title").style.paddingBottom = "76px";

  const logButton = document.querySelector("#logButton");
  logButton.innerHTML = `<a href="./index.html">logout</a>`;
  logButton.addEventListener("click", logOut);

  document.querySelector("#open-modal").addEventListener("click", openModal);
}

/* --- Modale et gestion des projets --- */
async function deleteWork(workID) {
  try {
    await fetch(`http://localhost:5678/api/works/${workID}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    init(); // Re-fetch data after deletion
  } catch (error) {
    console.error(error);
  }
}

function openModal() {
  divModal.classList.remove("modal-non-active");
  divModal.setAttribute("aria-hidden", "false");
  galerieModal.classList.remove("modal-non-active");

  document.querySelector("#add-photo-button1").addEventListener("click", () => {
    galerieModal.classList.add("modal-non-active");
    ajoutModal.classList.remove("modal-non-active");
    document.querySelector(".close-icon-2").addEventListener("click", closeModal);
    document.querySelector(".back-icon").addEventListener("click", () => {
      galerieModal.classList.remove("modal-non-active");
      ajoutModal.classList.add("modal-non-active");
    });
  });

  document.querySelector("#valider-button").addEventListener("click", validateForm);
  document.querySelector("#delete-galery").addEventListener("click", () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer la galerie?")) {
      modalGallery.querySelectorAll("figure").forEach(figure => {
        deleteWork(figure.getAttribute("data-id"));
      });
    }
  });

  document.querySelector(".close-icon").addEventListener("click", closeModal);
  document.getElementById("modal").addEventListener("click", event => {
    if (event.target === document.getElementById("modal")) {
      closeModal();
    }
  });

  init(); // Re-fetch data to ensure the modal has the latest data
}

function closeModal() {
  divModal.classList.add("modal-non-active");
  galerieModal.classList.add("modal-non-active");
  ajoutModal.classList.add("modal-non-active");
  document.querySelector("#ajout-box").reset();
  const previewImage = document.querySelector("#preview-image");
  if (previewImage) {
    previewImage.remove();
  }
  document.querySelector(".photo-upload-button").style.display = "";
  document.querySelector(".picture-icon").style.display = "";
  document.querySelector(".type-files").style.display = "";
  document.querySelector("#valider-button").style.backgroundColor = "#a7a7a7";
}

/* --- Ajout de projet --- */
document.querySelector("#image").addEventListener("change", showFile);
document.querySelector("#title").addEventListener("input", checkForm);
document.querySelector("#category").addEventListener("input", checkForm);
document.querySelector("#image").addEventListener("change", checkForm);

async function addWork() {
  const formData = new FormData();
  formData.append("image", document.getElementById("image").files[0]);
  formData.append("title", document.getElementById("title").value);
  formData.append("category", document.getElementById("category").value);
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });
    if (response.ok) {
      init(); // Re-fetch data after adding a new project
      closeModal();
    } else {
      console.error("Erreur d'ajout de projet");
    }
  } catch (error) {
    console.error(error);
  }
}

function validateForm(e) {
  e.preventDefault();
  const errMessImg = document.querySelector("#error-img");
  const errMessTitle = document.querySelector("#error-title");
  const errMessCat = document.querySelector("#error-category");

  if (document.getElementById("title").value && document.getElementById("category").value && document.getElementById("image").files.length > 0) {
    addWork();
    errMessImg.style.display = "none";
    errMessTitle.style.display = "none";
    errMessCat.style.display = "none";
  } else {
    if (document.getElementById("image").files.length === 0) errMessImg.style.display = "block";
    if (!document.getElementById("title").value) errMessTitle.style.display = "block";
    if (!document.getElementById("category").value) errMessCat.style.display = "block";
  }
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