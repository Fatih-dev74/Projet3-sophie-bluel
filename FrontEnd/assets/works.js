
// const works_url = "http://localhost:5678/api/works";

// const node_gallery = document.querySelector('.gallery');

// function resetworksViews() {
//     node_gallery.innerHTML = "";
// }

// function createWork(work) {
//     let img = document.createElement('img');
//         img.src = work.imageUrl; 
//         img.alt = work.title;

//     let figcaption = document.createElement('figcaption'); 
//         figcaption.textContent = work.title;

//     let figure = document.createElement('figure');
//         figure.append(img); 
//         figure.append(figcaption);
    
//     node_gallery.append(figure);
// }


// function displayWorks(works) {

//     // Reset la gallery 
//     resetworksView();

//     // Ajoute les projets dans la gallery 
//     works.forEach(work => createWork (work));
// }

// (async () => {
//     const works = await httpGet(works_url);

//     displayWorks (works);
// }) ();
const works_url = "http://localhost:5678/api/works";
const node_gallery = document.querySelector('.gallery');

function resetworksViews() {
    node_gallery.innerHTML = "";
}

function createWork(work) {
    let img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    let figcaption = document.createElement('figcaption');
    figcaption.textContent = work.title;

    let figure = document.createElement('figure');
    figure.append(img);
    figure.append(figcaption);

    node_gallery.append(figure);
}

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur de récupération des données");
    return response.json();
}

async function displayWorks() {
    try {
        const works = await fetchData(works_url);
        // Reset la gallery
        resetworksViews();
        // Ajoute les projets dans la gallery
        works.forEach(work => createWork(work));
    } catch (error) {
        console.error(error);
    }
}

displayWorks();
