let works = [];
let categories = [];
const gallery = document.querySelector('.gallery');
const filters = document.querySelector('.filters');

// Récupération des catégories via l'API
async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const listCategories = await response.json();
        categories = listCategories;

        listCategories.map((category) => {
            const filter = document.createElement('button'); // Création des boutons
            filter.className = 'filter';
            filter.dataset.id = category.id;
            filter.textContent = category.name;
            filters.appendChild(filter); 
        })
    } catch (error) {
        console.log(error);
    }
}

// Récupération des données works via l'API
async function fetchWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const listWorks = await response.json();
        works = listWorks;
        displayWorks(works)
    } catch (error) {
        console.log(error);
    }
}

// Filtrage des projets par catégorie
async function worksFilteredByCategory() {
    const filterItems = document.querySelectorAll('.filters button');
    filterItems.forEach((item) => item.addEventListener('click', () => {
        filterItems.forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
        if (item.dataset.id > 0) {
            let worksFiltered = [];
            gallery.innerHTML = '';
            // Uniquement si on clique sur un filtre autre que "TOUS"
        worksFiltered = works.filter(work => work.category.id == item.dataset.id);
        displayWorks(worksFiltered);
        } else {
            gallery.innerHTML = '';
            displayWorks(works);
        }
    }))
}

// Création des projets de la gallerie
function displayWorks(works) {
    works.map((work) => {
        const workItem = document.createElement('figure');
        workItem.dataset.id = work.category.id;
        workItem.innerHTML = `<img src=${work.imageUrl} alt=${work.title}>
            <figcaption>${work.title}</figcaption>`
        gallery.appendChild(workItem);
    })
}