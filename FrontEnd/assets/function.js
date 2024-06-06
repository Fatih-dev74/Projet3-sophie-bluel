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