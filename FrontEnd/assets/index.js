/* --- Sélection des éléments du DOM --- */
const gallery = document.querySelector(".gallery");
const navFilters = document.querySelector(".filters-nav");
const divModal = document.querySelector("#modal");
const galerieModal = document.querySelector(".modal-box-galerie-photo");
const modalGallery = document.querySelector(".modal-gallery");
const ajoutModal = document.querySelector(".modal-box-ajout-photo");
const selectForm = document.querySelector("#category");







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