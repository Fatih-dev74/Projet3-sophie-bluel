/* --- Récupération des données de l'API --- */
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur de récupération des données");
    return response.json();
  }
  
  async function init() {
    try {
      const [works, categories] = await Promise.all([
        fetchData("http://localhost:5678/api/works"),
        fetchData("http://localhost:5678/api/categories")
      ]);
  
      categories.forEach(category => {
        createButton(category);
        createOption(category);
      });
  
      document.querySelectorAll(".filters-nav button").forEach(button => {
        button.addEventListener("click", () => {
          document.querySelectorAll(".filters-nav button").forEach(btn => btn.classList.remove("is-active"));
          button.classList.add("is-active");
          displayWorks(works, button.getAttribute("data-id"));
        });
      });
  
      displayWorks(works);
  
    } catch (error) {
      console.error(error);
    }
  }
  
  function displayWorks(works, categoryId) {
    clearElement(gallery);
    clearElement(modalGallery);
    works.forEach(project => {
      if (!categoryId || categoryId == project.category.id) {
        createProject(project);
        createModalProject(project);
      }
    });
  }
  
  /* --- Initialisation --- */
  init();