document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.querySelector(".overlay");
    const openModalButton = document.getElementById("modif-projects");

    // Fonction pour créer les éléments
    function createElement(tag, attributes = {}, ...children) {
        const element = document.createElement(tag);
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }
        for (const child of children) {
            if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        }
        return element;
    }

    // Fonction pour créer la première modale dynamiquement
    function createModal1() {
        const modal1 = createElement(
            "aside",
            { id: "modal-1", class: "modal hidden" },
            createElement(
                "div",
                { class: "icons" },
                createElement("img", {
                    class: "btn-close cross",
                    src: "./assets/icons/cross.png",
                    alt: "Croix de fermeture"
                })
            ),
            createElement(
                "div",
                { class: "modal-content" },
                createElement("h3", {}, "Galerie photo"),
                createElement("div", { class: "gallery-modal" }),
                createElement("div", { id: "delete-msg", class: "hidden" }),
                createElement("hr"),
                createElement("input", {
                    type: "submit",
                    id: "open-modal-2",
                    value: "Ajouter une photo"
                })
            )
        );

        document.body.appendChild(modal1);

        const openModal2Button = modal1.querySelector("#open-modal-2");
        openModal2Button.addEventListener("click", openModal2);

        const closeModalButton = modal1.querySelector(".btn-close");
        closeModalButton.addEventListener("click", closeModal);

        return modal1;
    }

    // Fonction pour créer la deuxième modale dynamiquement
    function createModal2() {
        const modal2 = createElement(
            "aside",
            { id: "modal-2", class: "modal hidden" },
            createElement(
                "div",
                { class: "icons" },
                createElement("img", {
                    src: "./assets/icons/back-icon.png",
                    alt: "Bouton retour",
                    id: "back"
                }),
                createElement("img", {
                    class: "btn-close cross",
                    src: "./assets/icons/cross.png",
                    alt: "Croix de fermeture"
                })
            ),
            createElement(
                "div",
                { class: "modal-content" },
                createElement("h3", {}, "Ajout photo"),
                createElement(
                    "form",
                    {
                        name: "project-form",
                        id: "project-form",
                        enctype: "multipart/form-data"
                    },
                    createElement(
                        "div",
                        { id: "filediv" },
                        createElement("img", {
                            src: "assets/icons/picture.png",
                            alt: "Logo image",
                            id: "picture-filediv"
                        }),
                        createElement(
                            "button",
                            { type: "button", id: "add-button-filediv" },
                            "+ Ajouter photo"
                        ),
                        createElement("input", {
                            type: "file",
                            id: "file-input",
                            name: "image",
                            accept: ".jpg, .png"
                        }),
                        createElement("p", { id: "text-filediv" }, "jpg, png : 4mo max")
                    ),
                    createElement("label", { for: "title" }, "Titre"),
                    createElement("input", { type: "text", name: "title", id: "title" }),
                    createElement("label", { for: "category" }, "Catégorie"),
                    createElement("select", { name: "category", id: "category" },
                        createElement("option", { value: "" })
                    ),
                    createElement("div", { id: "statut-msg", class: "hidden" }),
                    createElement("hr"),
                    createElement("input", {
                        type: "submit",
                        value: "Valider",
                        id: "validation-btn",
                        "aria-label": "Valider"
                    })
                )
            )
        );

        document.body.appendChild(modal2);

        const backButton = modal2.querySelector("#back");
        backButton.addEventListener("click", openModal1);

        const closeModalButton = modal2.querySelector(".btn-close");
        closeModalButton.addEventListener("click", closeModal);

        return modal2;
    }

    // Fonctions pour ouvrir et fermer les modales
    function openModal1() {
        modal1.classList.remove("hidden");
        overlay.classList.remove("hidden");
    }

    function openModal2() {
        modal1.classList.add("hidden");
        modal2.classList.remove("hidden");
    }

    function closeModal() {
        modal1.classList.add("hidden");
        modal2.classList.add("hidden");
        overlay.classList.add("hidden");
    }

    // Initialisation des modales
    const modal1 = createModal1();
    const modal2 = createModal2();

    openModalButton.addEventListener("click", openModal1);
    overlay.addEventListener("click", closeModal);
});