'use strict';

const works_url = 'http://localhost:5678/api/works';
const categories_url = 'http://localhost:5678/api/categories';

const token = sessionStorage.getItem('token');

let galleryModal = document.createElement('div');
    galleryModal.classList.add('modal', 'gallery-modal');
    document.body.appendChild(galleryModal);

let confirmationModal = document.createElement('div');
    confirmationModal.classList.add('modal', 'confirmation-modal');
    document.body.appendChild(confirmationModal);

/*** Add triggers to open modals ***/
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-modal]')?.forEach(trigger => {
        trigger.addEventListener('click', event => {
            event.preventDefault();
            event.stopImmediatePropagation();

            switch (trigger.dataset.modal) {
                case 'gallery':
                    modalGallery();
                    break;
                case 'addPhoto':
                    modalAddPhoto();
                    break;
            }
        });
    });
});


/***************** MODAL : PHOTO GALLERY ******************/

/*** Create and display the photo gallery modal ***/
function modalGallery() 
{
    let btn = document.createElement('button');
        btn.textContent = "Ajouter une photo";
        btn.dataset.modal = 'addPhoto';
        btn.classList.add('gallery-btn');
        btn.addEventListener('click', modalAddPhoto);

    let body = document.createElement('div');
        body.classList.add('gallery-body');

    createModal({
        header: "Galerie photo",
        body: body,
        footer: btn
    }, '.gallery-modal');

    createAndDisplayWorks(works);
}

/*** Create and add works to the gallery modal ***/
function createAndDisplayWorks(works) 
{
    resetWorksModalGallery();

    works.forEach(work => {
        let img = document.createElement('img');
            img.src = work.imageUrl;

        let article = document.createElement('article');
            article.setAttribute('data-work-id', work.id);
            article.appendChild(img);
        
        let galleryBody = document.querySelector('.gallery-body');
            galleryBody.appendChild(article);

        addTrashIcon(article);
    });
}

/*** Fetch works from the API ***/
async function fetchWorks() 
{
    return await httpGet(works_url);
}

/*** Add trash icon to an article ***/
function addTrashIcon(article) 
{
    let trashIcon = document.createElement('i');
        trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash-icon');

    article.appendChild(trashIcon);
    trashIconClick(trashIcon, article);
}

/*** Add click event to trash icon ***/
function trashIconClick(trashIcon, article) 
{
    trashIcon.addEventListener('click', () => {
        showConfirmModal(article);
    });
}

/*** Reset the content of the gallery body ***/
function resetWorksModalGallery() 
{
    let galleryBody = document.querySelector('.gallery-body');
        galleryBody.innerHTML = ''; 
}


/***************** MODAL : CONFIRM DELETE ******************/

/*** Show confirmation modal for deleting a project ***/
function showConfirmModal(article) 
{
    let cancelButton = document.createElement('button');
        cancelButton.textContent = "Annuler";
        cancelButton.classList.add('modal-btn', 'cancel-btn');
        cancelButton.addEventListener('click', () => closeModal('.confirmation-modal'));

    let confirmButton = document.createElement('button');
        confirmButton.textContent = "Confirmer";
        confirmButton.classList.add('modal-btn', 'confirm-btn');
        confirmButton.addEventListener('click', () => confirmButtonClick(article));
 
    let footer = document.createElement('div'); 
        footer.classList.add('modal-footer');
        footer.append(cancelButton, confirmButton);

    createModal({
        header: "Confirmation",
        body: "Êtes-vous sûr de vouloir supprimer ce projet ?",
        footer: footer
    }, 'small-modal', '.confirmation-modal'); 
}

/*** Handle confirm button click for deleting a project ***/
async function confirmButtonClick(article) 
{
    closeModal('.confirmation-modal');
    let workId = article.getAttribute('data-work-id');

    let success = await httpDelete(`${works_url}/${workId}`);
        success && (works = await fetchWorks(), createAndDisplayWorks(works), createWorks(works), showSuccessModal("Projet supprimé avec succès"));
}


/***************** MODAL : ADD PHOTO ******************/

/*** Show the modal to add a photo ***/
function modalAddPhoto() 
{
    let submitButton = formSubmitButton();
        submitButton.addEventListener('click', handleSubmit);
    
    let formContent = document.createElement('div');
        formContent.classList.add('form-content');
        formContent.appendChild(formPhotoComponent());
        formContent.appendChild(formTitleComponent());
        formContent.appendChild(formCategoryComponent());

    let body = document.createElement('form');
        body.classList.add('form-add-work');
        body.appendChild(formContent);

    createModal({
        header: "Ajout photo",
        body: body,
        footer: submitButton
    });

    iconBack();
    loadCategories();
}

/*** Create the photo upload section in the form ***/
function formPhotoComponent() 
{
    let errorContainer = document.createElement('p');
        errorContainer.classList.add('error-message');

    let fileErrorContainer = document.createElement('p');
        fileErrorContainer.classList.add('file-error-message');

    let imgPreview = document.createElement('img');
        imgPreview.id = 'img-preview';
        imgPreview.style.display = 'none';
        imgPreview.style.maxWidth = '100%';
        imgPreview.style.maxHeight = '169px';

    let fileInfo = document.createElement('p');
        fileInfo.classList.add('p-photo');
        fileInfo.textContent = "jpg, png : 4mo max";

    let inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.id = 'input-file';
        inputFile.classList.add('form-work-photo');
        inputFile.accept = 'image/jpeg, image/png';
        inputFile.addEventListener('change', (event) => {
            handleFileChange(event, imgPreview, icon, label, fileInfo, fileErrorContainer);
            checkFormValidity();
        });

    let label = document.createElement('label');
        label.classList.add('form-button-add-photo');
        label.setAttribute('for', 'input-file');
        label.textContent = "+ Ajouter photo";
        label.appendChild(inputFile);
    
    let icon = document.createElement('i');
        icon.classList.add('fa-regular', 'fa-image');

    let photoDiv = document.createElement('div');
        photoDiv.classList.add('form-add-photo');
        photoDiv.appendChild(icon);
        photoDiv.appendChild(label);
        photoDiv.appendChild(fileInfo);
        photoDiv.appendChild(imgPreview);
        photoDiv.appendChild(fileErrorContainer);
        photoDiv.appendChild(errorContainer);

    return photoDiv;
}

/*** Create the title input section in the form ***/

function formTitleComponent() 
{
    let errorContainer = document.createElement('p');
        errorContainer.classList.add('error-message');

    let input = document.createElement('input');
        input.type = 'text';
        input.name = 'titre';
        input.id = 'input-title';
        input.classList.add('form-title-work');
        input.setAttribute('autocomplete', 'off');
        input.addEventListener('input', checkFormValidity);

    let label = document.createElement('label');
        label.setAttribute('for', 'input-title');
        label.textContent = "Titre";    

    let titleDiv = document.createElement('div');
        titleDiv.classList.add('form-title');
        titleDiv.appendChild(label);
        titleDiv.appendChild(input);
        titleDiv.appendChild(errorContainer);

    return titleDiv;
}

/*** Create the category selection section in the form ***/
function formCategoryComponent() 
{
    let errorContainer = document.createElement('p');
        errorContainer.classList.add('error-message');

    let icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-chevron-down', 'select-icon');

    let select = document.createElement('select');
        select.id = 'categories';
        select.addEventListener('change', checkFormValidity);

    let label = document.createElement('label');
        label.setAttribute('for', 'categories');
        label.textContent = "Catégorie";
   
    let categoryDiv = document.createElement('div');
        categoryDiv.classList.add('form-categories');
        categoryDiv.appendChild(label);
        categoryDiv.appendChild(select);
        categoryDiv.appendChild(icon);
        categoryDiv.appendChild(errorContainer);

    return categoryDiv;
}

/*** Create the submit button for the form ***/
function formSubmitButton() 
{
    let submitButton = document.createElement('input');
        submitButton.type = 'button';
        submitButton.value = "Valider";
        submitButton.id = 'form-button-submit';
        submitButton.disabled = true;
        submitButton.classList.add('submit-button');
        submitButton.addEventListener('click', handleSubmit);

    return submitButton;
}

/*** Create back icon in the add photo modal ***/
function iconBack() 
{
    let iconBack = document.createElement('i');
        iconBack.classList.add('icon-back', 'fa-solid', 'fa-arrow-left');
        iconBack.addEventListener('click', modalGallery);
    
    let modalContent = document.querySelector('.modal-content');
        modalContent.prepend(iconBack);
}

/*** Load categories into the category select element ***/
async function loadCategories() 
{
    const categories = await httpGet(categories_url);
    const categorySelect = document.getElementById('categories');

    categorySelect.appendChild(new Option('', ''));

    categories.forEach(({ id, name }) => 
        categorySelect.appendChild(new Option(name, id))
    );
}

/*** Handle file input change and display selected image ***/
function handleFileChange(event, imgPreview, icon, label, fileInfo, fileErrorContainer) 
{
    const file = event.target.files[0];
    
    fileErrorContainer.textContent = "";

    const isValidFile = checkFileSize(file, fileErrorContainer);
    
    if (isValidFile) {
        let reader = new FileReader();
            reader.onload = (event) => displayImagePreview(event, imgPreview, icon, label, fileInfo, fileErrorContainer);
            reader.readAsDataURL(file);
        }
    
    checkFormValidity(!isValidFile);
}

/*** Check the size of the file ***/
function checkFileSize(file, fileErrorContainer) 
{
    let maxSize = 4 * 1024 * 1024;

    file.size > maxSize && (fileErrorContainer.textContent = "La taille du fichier ne doit pas dépasser 4 Mo.");

    return file.size <= maxSize;
}

/*** Display the image preview ***/
function displayImagePreview(event, imgPreview, icon, label, fileInfo, fileErrorContainer) 
{
    imgPreview.src = event.target.result;
    imgPreview.style.display = 'block';
    icon.style.display = 'none';
    label.style.display = 'none';
    fileInfo.style.display = 'none';
    addTrashIconImg(imgPreview, icon, label, fileInfo, fileErrorContainer);
}

/*** Add trash icon next to the image ***/
function addTrashIconImg(imgPreview, icon, label, fileInfo, fileErrorContainer) 
{
    let trashIcon = document.createElement('i');
        trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash-icon', 'trash-icon-preview');
        trashIcon.addEventListener('click', () => removeImagePreview(imgPreview, icon, label, fileInfo, trashIcon, fileErrorContainer));

    imgPreview.parentElement.appendChild(trashIcon);
}

/*** Remove the image preview ***/
function removeImagePreview(imgPreview, icon, label, fileInfo, trashIcon, fileErrorContainer) 
{
    imgPreview.style.display = 'none';
    imgPreview.src = '';
    icon.style.display = 'block';
    label.style.display = 'block';
    fileInfo.style.display = 'block';
    fileErrorContainer.textContent = "";
    trashIcon.remove();

    document.getElementById('input-file').value = ''; 
    
    checkFormValidity(); 
}

/*** Handle form submission ***/

async function handleSubmit() 
{
    const title = document.getElementById('input-title').value.trim();
    const category = document.getElementById('categories').value;
    const fileInput = document.getElementById('input-file');
    const file = fileInput.files[0];

    let formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('image', file);

    let newWork = await httpPost(works_url, formData);
        
    if (newWork) {
        works.push(newWork);
        refreshGalleries();
        resetForm();
        showSuccessModal("Projet ajouté avec succès");
    } 
}

/*** Reset the form after adding a project ***/
function resetForm() 
{
    let formContent = document.querySelector('.form-content');
        formContent.innerHTML = "";
        formContent.appendChild(formPhotoComponent());
        formContent.appendChild(formTitleComponent());
        formContent.appendChild(formCategoryComponent());

    document.getElementById('form-button-submit').disabled = true;
    document.getElementById('form-button-submit').classList.remove('active');

    loadCategories();
}

/*** Refresh galleries after adding a project ***/
async function refreshGalleries() 
{
    works = await fetchWorks();
    createWorks(works);
}

/*** Check the validity of the form ***/
function checkFormValidity() 
{
    const photoInput = document.getElementById('input-file');
    const titleInput = document.getElementById('input-title');
    const selectCategories = document.getElementById('categories');

    let isValid = true;

    isValid = validateInput(photoInput, validatePhotoInput, "Veuillez sélectionner un fichier") && isValid;
    isValid = validateInput(titleInput, validateTitleInput, "Veuillez entrer un titre") && isValid;
    isValid = validateInput(selectCategories, validateSelectCategories, "Veuillez sélectionner une catégorie") && isValid;

    let submitButton = document.getElementById('form-button-submit');
    submitButton.disabled = !isValid;
    submitButton.classList.toggle('active', isValid);
}

/*** Validate an input field ***/
function validateInput(field, validationFunction, errorMessage) 
{
    const isValid = validationFunction(field);
    isValid ? hideFieldError(field) : showFieldError(field, errorMessage);
    return isValid;
}

/*** Validate file input ***/
function validatePhotoInput(input) 
{
    return input.files.length !== 0;
}

/*** Validate title input ***/
function validateTitleInput(input) 
{
    return input.value.trim() !== '';
}

/*** Validate category selection ***/
function validateSelectCategories(select) 
{
    return select.value !== '';
}

/*** Show field error message ***/
function showFieldError(field, message) 
{
    let parentDiv = field.closest('.form-add-photo, .form-title, .form-categories');
    let errorContainer = parentDiv.querySelector('.error-message');
    errorContainer.textContent = message;
    errorContainer.classList.add('active');
}

/*** Hide field error message ***/
function hideFieldError(field) 
{
    let parentDiv = field.closest('.form-add-photo, .form-title, .form-categories');
    let errorContainer = parentDiv.querySelector('.error-message');
    errorContainer.textContent = "";
    errorContainer.classList.remove('active');
}


/************** GENERAL SUCCES MODAL ****************/

/*** Show success modal with a message ***/
function showSuccessModal(message) 
{
    let successModal = document.querySelector('.success-modal');
        if (!successModal) {
            successModal = document.createElement('div');
            successModal.classList.add('modal', 'success-modal');
            document.body.appendChild(successModal);
        }
    
    createModal({
        header: '',
        body: message,
        footer: ''
    }, 'small-modal', '.success-modal');

    let iconClose = document.querySelector('.success-modal .icon-close');
        iconClose.addEventListener('click', () => closeSuccessModal(successModal));

    openModal(successModal);
}

/*** Close the success modal ***/
function closeSuccessModal() 
{
    closeModal('.success-modal');
}


/***************** GENERAL MODAL ******************/

/*** Open the modal ***/
function openModal(modal) 
{
    modal.style.display = 'flex';
}

/*** Close the modal ***/
function closeModal(modalSelector = '.modal') 
{
    let modal = document.querySelector(modalSelector);
        modal && (modal.style.display = 'none', modal.innerHTML = '');
}

/*** Close the modal when clicking outside of it ***/
function closeClickOutsideModal(modalSelector) 
{
    let modal = document.querySelector(modalSelector);
        modal && window.addEventListener('click', (event) => event.target === modal && closeModal(modalSelector));
}

/*** Create the modal structure and display it ***/
function createModal(data, className, modalSelector = '.modal') 
{
    let iconClose = document.createElement('i');
        iconClose.classList.add('icon-close', 'fa-solid', 'fa-xmark');
        iconClose.addEventListener('click', () => closeModal(modalSelector));
  
    let modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        className && modalContent.classList.add(className);
        modalContent.append(iconClose);
    
    let modal = document.querySelector(modalSelector);
        modal.innerHTML = '';
        modal.append(modalContent);

    if (data.header) {
        let header = document.createElement('div');
            header.classList.add('modal-header');
            header.append(data.header);
            modalContent.append(header);
    }

    if (data.body) {
        let body = document.createElement('div');
            body.classList.add('modal-body');
            body.append(data.body);
            modalContent.append(body);
    }

    if (data.footer) {
        let footer = document.createElement('div');
            footer.classList.add('modal-footer');
            footer.append(data.footer);
            modalContent.append(footer);
    }

    openModal(modal);
    closeClickOutsideModal(modalSelector); 
}