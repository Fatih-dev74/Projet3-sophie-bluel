// const categories_url = "http://localhost:5678/api/categories";

// (async () => {
//     const categories = await httpGet(categories_url);

//     console.log(categories);
// }) ();

async function fetchCategories(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch(error) {
        console.error("Erreur de récupération des catégories");
        return [];
    }
}

(async () => {
    const categories = await fetchCategories("http://localhost:5678/api/categories");

    console.log(categories);
})();
