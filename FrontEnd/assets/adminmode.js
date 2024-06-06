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