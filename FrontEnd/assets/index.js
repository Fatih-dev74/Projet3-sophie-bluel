const sectionModale = document.querySelector('.modal');
const buttonModification = document.querySelectorAll('.btn_modification')
const modalContent = document.querySelector('.bloc_modal');
const crossCloseModale = document.querySelectorAll('.close_modale');
const buttonAddPicture = document.querySelector('.add_picture');
const buttonReturnModale = document.querySelector('.return');
const sectionModale2 = document.querySelector('.modal_2');
const addFileInput = document.getElementById('picture');
const addFileContainer = document.querySelector('.add_file_input');
const filePreviewContainer = document.querySelector('.file_preview');
const filePreview = document.querySelector('.preview');
const addProjectForm = document.querySelector('.add_project')
const buttonValidation = document.querySelector('.validation');
const addPictureInput = document.getElementById('picture');
const addTitleInput = document.getElementById('title');
const addCategoryInput = document.getElementById('category_select');
const deleteAllGallery = document.querySelector('.delete_gallery');
let modal = null

addEventListener("DOMContentLoaded", async (event) => {
    await fetchCategories()
    await fetchWorks();
    await worksFilteredByCategory();
    await genererPictureGallery();
});

async function genererGallery () {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();
        works.forEach((work) => {
            const sectionGallery = document.querySelector('.gallery');
            const figureGallery = document.createElement('figure');
            figureGallery.dataset.id = work.category.id;
            
            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = work.title;
            
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = work.title;
            
            figureGallery.appendChild(img);
            figureGallery.appendChild(figcaption);
            sectionGallery.appendChild(figureGallery);
        });
    } catch (error) {
        alert('impossible de se connecter au serveur');
    }
}

// Ajout des photos des projets dans la modale
async function genererPictureGallery () {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();
        works.forEach((work) => {
            const modaleGallery = document.querySelector('.modale_gallery');
            const modaleFigureGallery = document.createElement('figure');
            modaleFigureGallery.className = 'project_img';
            modaleFigureGallery.id = work.id;
            
            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = work.title;
            
            const divMoveDelete = document.createElement('div');
            divMoveDelete.className = 'move_delete';
            
            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn_delete';
            btnDelete.id = work.id;
            
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-trash-can';
            
            btnDelete.appendChild(icon);
            divMoveDelete.appendChild(btnDelete);
            
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = 'éditer';
            
            modaleFigureGallery.appendChild(img);
            modaleFigureGallery.appendChild(divMoveDelete);
            modaleFigureGallery.appendChild(figcaption);
            modaleGallery.appendChild(modaleFigureGallery);
        });
        
        const btnDeletes = document.querySelectorAll('.btn_delete');
        btnDeletes.forEach((btnDelete) => btnDelete.addEventListener('click', () => deleteWork(btnDelete.id)));
    } catch (error) {
        alert('impossible de se connecter au serveur');
    }
}

// Ouverture de la modale
const openModale = function () {
    sectionModale.style.display = null;
    modalContent.style.display = 'flex';
    modalContent.style.background = 'rgba(0, 0, 0, 0.3)';
    sectionModale2.style.display = 'none';
    modal = sectionModale;
}

// Fermeture de la modale
const closeModale = function () {
    if (modal === null) return;
    modalContent.style.display = 'none';
    modalContent.style.background = 'rgba(0, 0, 0)';
    cleanForm();
    modal = null;
}

// Bouton d'affichage de la modale
buttonModification.forEach(b => {
    b.addEventListener('click', openModale);
});

// Bouton de fermeture de la modale
crossCloseModale.forEach(b => {
    b.addEventListener('click', closeModale);
});

// Fermeture de la modale via clic en dehors de la modale
window.onclick = (event) => {
    if (event.target == modalContent) {
        modalContent.style.display = 'none';
        cleanForm();
        modal = null;
    }
};
