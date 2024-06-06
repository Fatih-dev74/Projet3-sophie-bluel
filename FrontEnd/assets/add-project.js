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