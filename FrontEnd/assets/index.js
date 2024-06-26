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

// Au chargement de la page
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
        works.map((work) => {
            const sectionGallery = document.querySelector('.gallery');
            const figureGallery = document.createElement('figure');
            figureGallery.dataset.id = work.category.id;
            figureGallery.innerHTML = `<img src=${work.imageUrl} alt=${work.title}>
            <figcaption>${work.title}</figcaption>`
            sectionGallery.appendChild(figureGallery);
        });
    } catch (error) {
        alert('impossible de se connecter au serveur')
    }
}

// Ajout des photos des projets dans la modale
async function genererPictureGallery () {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();
        works.map((work) => {
            const modaleGallery = document.querySelector('.modale_gallery');
            const modaleFigureGallery = document.createElement('figure');
            modaleFigureGallery.className = 'project_img'
            modaleFigureGallery.id = work.id;
            modaleFigureGallery.innerHTML = `<img src=${work.imageUrl} alt=${work.title}>
            <div class="move_delete">
                <button class="btn_delete" id="${work.id}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
            <figcaption> éditer </figcaption>`
            modaleGallery.appendChild(modaleFigureGallery);
        });
        const btnDeletes = document.querySelectorAll('.btn_delete');
        btnDeletes.forEach((btnDelete) => btnDelete.addEventListener('click', () => deleteWork(btnDelete.id)));
    } catch (error) {
        alert('impossible de se connecter au serveur')
    }
}

// Ouverture de la modale
const openModale = function () {
    sectionModale.style.display = null;
    modalContent.style.display = 'flex'
    modalContent.style.background = 'rgba(0, 0, 0, 0.3)';
    sectionModale2.style.display = 'none';
    modal = sectionModale;
}

// Fermeture de la modale
const closeModale = function () {
    if (modal === null) return;
    modalContent.style.display = 'none'
    modalContent.style.background = 'rgba(0, 0, 0)';
    cleanForm();
    modal = null;
}

// Bouton d'affichage de la modale
buttonModification.forEach(b => {
    b.addEventListener('click', openModale)
});

// Bouton de fermeture de la modale
crossCloseModale.forEach(b => {
    b.addEventListener('click', closeModale);
});

// Fermeture de la modale via clic en dehors de la modale
window.onclick = (event) => {
    if (event.target == modalContent) 
        modalContent.style.display = 'none';
        closeModale;
}

// Fermeture via touche escape
window.addEventListener('keydown', function (event) {
    if (event.key === "Escape" || event.key === "Esc") {
        closeModale(event)
    }
})

// Ouverture de la modale d'ajout de photo
const openModale2 = function () {
    sectionModale2.style.display = null;
    sectionModale.style.display = 'none';
}

// Bouton d'ouverture de la modale d'ajout de photo
buttonAddPicture.addEventListener('click', openModale2);

// Retour à la 1ère modale
const returnModale1 = function () {
    sectionModale2.style.display = 'none';
    sectionModale.style.display = null;
    cleanForm();
}

// Bouton de retour à la 1ère modale
buttonReturnModale.addEventListener('click', returnModale1);

// Preview image ajouter
addFileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        addFileContainer.style.display = 'none';
        filePreviewContainer.style.display = 'block';
        reader.addEventListener('load', function () {
            filePreview.setAttribute('src', this.result);
        });
        reader.readAsDataURL(file);
    } else {
        addFileContainer.style.display = null;
        filePreviewContainer.style.display = null;
        filePreview.setAttribute('src', '');
    }
});

// Changement du bouton en fonction des champs remplis
function buttonChange() {
    if (addPictureInput.value !== '' && addTitleInput.value !=='' && addCategoryInput.value !=='') {
        buttonValidation.style.background = '#1D6154';
        } else {
            buttonValidation.style.background = null;
        }
}
addProjectForm.addEventListener('change', buttonChange);

// Ajout d'un nouveau projet
async function fetchPostWork () {
    const formData = new FormData();
    formData.append('image', document.getElementById('picture').files[0]);
    formData.append('title', document.getElementById('title').value);
    formData.append('category', document.getElementById('category_select').value);
    
    await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem('tokenId')}`,
        },
        body: formData,
    })
        .then ((response) => {
            console.log(response);
            if (response.status === '401') {
                alert ("Vous n'êtes pas connectés.");
                return false;
            } else if (response.status === '500') {
                alert ("Erreur Serveur");
                return false;
            }
            return response.json();
        })
}

// Validation d'ajout d'un projet
addProjectForm.addEventListener('submit', async (event) => {
    const modaleGallery = document.querySelector('.modale_gallery');
    modaleGallery.innerHTML = '';
    const projectGallery = document.querySelector('.gallery');
    projectGallery.innerHTML='';
    event.preventDefault();
    await fetchPostWork();
    await genererPictureGallery();
    await genererGallery ();
    cleanForm();
});

// Suppression de toute la gallerie
deleteAllGallery.addEventListener('click', function () {
    let confirmation = prompt('Voulez-vous vraiment supprimer toute la gallerie de projet? : YES ou NO');
    if(confirmation === 'YES') {
        alert('Tous les projets on était effacé')
    } else {
        alert(`Aucun projet n'a était effacé`)
    }
})

// Suppression d'un projet
async function fetchDeleteWork (id) {
    await fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            Accept: '*/*',
            'Authorization': `Bearer ${window.localStorage.getItem('tokenId')}`,
        }
    })
        .then ((response) => {
            console.log(response);
            if (response.status === '401') {
                alert ('Erreur serveur');
                return false;
            }
        })
}

const deleteWork = async function(projectId) {
    console.log(works);
    console.log('test' + projectId);
    const modaleGallery = document.querySelector('.modale_gallery');
    modaleGallery.innerHTML = '';
    const projectGallery = document.querySelector('.gallery');
    projectGallery.innerHTML='';
    await fetchDeleteWork(projectId);
    await genererPictureGallery();
    await genererGallery ();
}

// Nettoyage du formulaire
function cleanForm() {
    addProjectForm.reset();
    addFileContainer.style.display = null;
    filePreviewContainer.style.display = null;
    filePreview.setAttribute('src', '');
}