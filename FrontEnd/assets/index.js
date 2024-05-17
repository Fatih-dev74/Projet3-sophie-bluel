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
const createButton = (category) => {
    const buttonFilters = document.createElement("button");
    buttonFilters.setAttribute("data-tag", category.name);
    buttonFilters.setAttribute("data-id", category.id);
    buttonFilters.innerText = category.name;
    navFilters.appendChild(buttonFilters);
  };
  
  const createOption = (category) => {
    const optionForm = document.createElement("option");
    optionForm.setAttribute("value", category.id);
    optionForm.innerText = category.name;
    selectForm.appendChild(optionForm);
  };