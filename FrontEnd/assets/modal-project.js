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