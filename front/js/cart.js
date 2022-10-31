// Déclaration de constante afin de rendre le code plus lisible concernant les tableaux (cart[i][ID] au lieu de cart[i][0]).
const ID = 0;
const COLOR = 1;
const QUANTITY = 2;


//--------------------------------------------
// AFFICHAGE DES PRODUITS DANS LE PANIER (1/5)
//--------------------------------------------
let cart = JSON.parse(localStorage.getItem("cart")); // Récupération du tableau du local storage (i.e. panier).
let cartItems = document.getElementById("cart__items");


/**
 * Récupération des informations du produit grâce à l'identifiant présent dans le local storage.
 * @param {String} - Il s'agit de l'identifiant du produit.
 */
function fetchDataOfProduct(productId) {
    return fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => res.json())
    .then((data) => {
        return data;
    })
    .catch(function(err){
        console.log(err);
    });           
};  

 
/**
 * Affichage dans le DOM des informations à partir du fetch et du local storage.
 * @param {Object} productData - Il s'agit de informations du produit issues de l'API.
 * @param {String} color
 * @param {Number} quantity
 */
function displayItem(productData, color, quantity) {

    //Création de l'élément <article>
        let article = document.createElement("article");
        article.classList.add("cart__item");
        article.setAttribute("data-id", productData._id);
        article.setAttribute("data-color", color);
        cartItems.appendChild(article);
        
    //Affichage de l'image
        let imageDiv = document.createElement("div");
        imageDiv.classList.add('cart__item__img');
        article.appendChild(imageDiv);

        let image = document.createElement("img");
        image.setAttribute("src", productData.imageUrl);
        image.setAttribute("alt", productData.altTxt);
        imageDiv.appendChild(image);

    // Affichage du titre, couleur et prix
        let itemContentDiv = document.createElement('div');
        itemContentDiv.classList.add('cart__item__content');
        article.appendChild(itemContentDiv);

        let itemContentDescriptionDiv = document.createElement('div');
        itemContentDescriptionDiv.classList.add('cart__item__content__description');
        itemContentDiv.appendChild(itemContentDescriptionDiv);
        
        let title = document.createElement('h2');
        title.textContent = productData.name;
        itemContentDescriptionDiv.appendChild(title);

        let colorItem = document.createElement('p');
        colorItem.textContent = color;
        itemContentDescriptionDiv.appendChild(colorItem);

        let price = document.createElement('p');
        price.textContent = productData.price + " €";
        itemContentDescriptionDiv.appendChild(price);

    // Affichage de la quantité (input)
        let contentSettingsDiv = document.createElement('div');
        contentSettingsDiv.classList.add('cart__item__content__settings');
        itemContentDiv.appendChild(contentSettingsDiv);

        let contentSettingsQuantityDiv = document.createElement('div');
        contentSettingsQuantityDiv.classList.add('cart__item__content__settings__quantity');
        contentSettingsDiv.appendChild(contentSettingsQuantityDiv);
            
        let quantityItem = document.createElement('p');
        quantityItem.textContent = "Qté : ";
        contentSettingsQuantityDiv.appendChild(quantityItem);
            
        let inputQuantity = document.createElement("input");
        inputQuantity.setAttribute('type', "number");
        inputQuantity.setAttribute('name', "itemQuantity");
        inputQuantity.setAttribute('min', 1);
        inputQuantity.setAttribute('max', 100);
        inputQuantity.setAttribute('value', quantity);
        inputQuantity.classList.add('itemQuantity');
        contentSettingsQuantityDiv.appendChild(inputQuantity);

    // Affichage du bouton supprimer
        let contentSettingsDelete = document.createElement('div');
        contentSettingsDelete.classList.add('cart__item__content__settings__delete');
        contentSettingsDiv.appendChild(contentSettingsDelete);

        let deleteItem = document.createElement('p');
        deleteItem.classList.add('deleteItem');
        deleteItem.textContent = "Supprimer";
        contentSettingsDelete.appendChild(deleteItem);
};



//-------------------------------------------------------
// SETTINGS : SUPPRESSION et CHANGEMENT DE QUANTITE (2/5)
//-------------------------------------------------------

/**
 * Suppression d'un produit du panier.
 * @param {HTML Element} deleteButton - Il s'agit du bouton sur lequel est assigné un 'addEventListenner'.
 */
function deleteItem(deleteButton) {
    deleteButton.addEventListener("click", (e) => {
        let elementClicked = e.target;
        let idFromDeleteButtonClicked = elementClicked.closest(".cart__item").dataset.id; //récup de l'id depuis son <article> parent
        let colorFromDeleteButtonClicked = elementClicked.closest(".cart__item").dataset.color; //récup de la color depuis son <article> parent
        let indexItem = getIndex(idFromDeleteButtonClicked, colorFromDeleteButtonClicked);
        
        if (!confirm("Voulez-vous supprimer cet article ?")) {
            return;
        };

        cart.splice(indexItem, 1); //supprime du cart l'élément d'indice 'indexItem'
        localStorage.setItem("cart", JSON.stringify(cart));
        
        // Maintenant que le l'element est supprimer du cart, il s'agit maintenant de supprimer l'item du DOM (de la page)
        let itemToDelete = document.querySelector(`article[data-id="${idFromDeleteButtonClicked}"][data-color="${colorFromDeleteButtonClicked}"]`);       
        itemToDelete.remove();
        displayTotalQuantityAndPrice(cart); // mettre à jour les totaux
    });
};


/**
 * Changement de la quantité d'un produit dans le panier.
 * @param {HTML Element} itemQuantity - Il s'agit de l'input permettant de changer la quantité d'un produit.
 */
function changeQuantity(itemQuantity) {
    itemQuantity.addEventListener("change", (e) => {
        let quantitySetting = e.target;

        // l'utilisateur pourra entrer une valeur comprise entre 1 et 100 seulement, sinon message d'erreur + rechargement de page.
        if (quantitySetting.value > 100 || quantitySetting.value === "") {
            alert("Choisissez une quantité comprise entre 1 et 100.");
            location.reload();
            return;
        };

        let idFromQuantityButtonChanged = quantitySetting.closest(".cart__item").dataset.id; //récup de l'id depuis son <article> parent
        let colorFromQuantityButtonChanged = quantitySetting.closest(".cart__item").dataset.color; //récup de la color depuis son <article> parent
        let indexItem = getIndex(idFromQuantityButtonChanged, colorFromQuantityButtonChanged);

        cart[indexItem][QUANTITY] = quantitySetting.value;
        localStorage.setItem("cart", JSON.stringify(cart));
        displayTotalQuantityAndPrice(cart);
    });
};


/**
 * Récupération de l'indice d'un produit dans le panier.
 * @param {String} id 
 * @param {String} color 
 * @returns {Number} indexOfItem
 */
function getIndex(id, color) {
    let indexOfItem = null;
    indexOfItem = cart.findIndex(item => item[ID] === id && item[COLOR] === color);
    return indexOfItem;
};



//---------------------------
// AFFICHAGE DES TOTAUX (3/5)
//---------------------------

/**
 * Affichage du prix total et du nombre total d'articles dans le panier.
 * @param {Array} cart
 */
async function displayTotalQuantityAndPrice(cart) {
    let totalQuantity = document.getElementById("totalQuantity");
    let totalPrice = document.getElementById("totalPrice");
    let quantities = [];
    let priceItems = [];
    let total = [];

    if (cart === null || cart.length === 0) {
        displayEmptyCart();
        totalQuantity.textContent = "0";
        totalPrice.textContent = "0";
        return;
    };

    for (let i in cart) {
        quantities.push(Number(cart[i][QUANTITY]));

        let infoItem = await fetchDataOfProduct(cart[i][ID]);
        priceItems.push(infoItem.price);
        total.push(priceItems[i] * quantities[i]);
        
        totalQuantity.textContent = quantities.reduce((a, b) => a + b, 0);
        totalPrice.textContent = total.reduce((a, b) => a + b, 0);
    };
};

/**
 * Cette fontion affiche "Panier vide", elle est appelée dans la fonction 'displayTotalQuantityAndPrice()'.
 */
function displayEmptyCart() {
        let emptyMsg = document.createElement("span");
        emptyMsg.classList.add("cart__item");
        emptyMsg.textContent = "Votre panier est vide !";
        cartItems.appendChild(emptyMsg);
};
    
/**
 * Execution de l'ensemble des fonctions créées. Pour chaque produit du panier, la fonction 'displayItem()' est jouée.
 */
async function displayCart() {
    for (let i in cart) {
        const dataProduct = await fetchDataOfProduct(cart[i][ID]);      
        displayItem(dataProduct, cart[i][COLOR], cart[i][QUANTITY]);

        let deleteItemButtons = document.querySelectorAll(".deleteItem");  
        deleteItem(deleteItemButtons[i]);

        let itemQuantityButtons = document.querySelectorAll(".itemQuantity");
        changeQuantity(itemQuantityButtons[i]);
    };
    
    displayTotalQuantityAndPrice(cart);
};

displayCart();



//---------------------------------
// VERIFICATION DU FORMULAIRE (4/5)
//---------------------------------
const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
const form = document.querySelector(".cart__order__form");
let firstName = "", lastName = "", address = "", city = "", email = "";
let isFirstNameValid = false;
let isLastNameValid = false;
let isAddressValid = false;
let isCityValid = false;
let isEmailValid = false;


/**
 * Vérification de l'entrée de l'utilisateur. Les 5 fonctions suivantes vont vérifier si
 * les champs sont correctement remplis.
 * @param {String} value - C'est ce que l'utilisateur écrit dans le champ.
 * @return {Boolean} isFirstNameValid - Ce bouléen nous informe le champ a été correctement rempli ou non.
 */
function firstNameChecker(value) {
    let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");

    if (value.length >= 0 && (value.length < 2 || value.length > 25)) {
        firstNameErrorMsg.textContent = "Ce champs doit contenir 2 à 25 caractères.";
        isFirstNameValid = false;
    } else if (!value.match(/^[a-z A-Z-]*$/)) {
        firstNameErrorMsg.textContent = "Ce champs ne peut contenir que des lettres et des tirets.";
        isFirstNameValid = false;
    } else {
        firstNameErrorMsg.textContent = "";
        firstName = value;
        isFirstNameValid = true;
    };
};
function lastNameChecker(value) {
    let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");

    if (value.length >= 0 && (value.length < 2 || value.length > 25)) {
        lastNameErrorMsg.textContent = "Ce champs doit contenir 2 à 25 caractères.";
        isLastNameValid = false;
    } else if (!value.match(/^[a-z A-Z-]*$/)) {
        lastNameErrorMsg.textContent = "Ce champs ne peut contenir que des lettres et des tirets.";
        isLastNameValid = false;
    } else {
        lastNameErrorMsg.textContent = "";
        lastName = value;
        isLastNameValid = true;
    };
};
function cityChecker(value) {
    let cityErrorMsg = document.getElementById("cityErrorMsg");

    if (value.length >= 0 && (value.length < 2 || value.length > 25)) {
        cityErrorMsg.textContent = "Ce champs doit contenir 2 à 25 caractères.";
        isCityValid = false;
    } else if (!value.match(/^[a-z A-Z-]*$/)) {
        cityErrorMsg.textContent = "Ce champs ne peut contenir que des lettres et des tirets.";
        isCityValid = false;
    } else {
        cityErrorMsg.textContent = "";
        city = value;
        isCityValid = true;
    };
};
function addressChecker(value) {
    let addressErrorMsg = document.getElementById("addressErrorMsg");

    if (value.length >= 0 && (value.length < 5 || value.length > 100)) {
        addressErrorMsg.textContent = "Ce champs doit contenir 5 à 100 caractères.";
        isAddressValid = false;
    } else if (!value.match(/^[a-z A-Z-0-9]*$/)) {
        addressErrorMsg.textContent = "Ce champs ne peut contenir que des chiffres, des lettres et des tirets.";
        isAddressValid = false;
    } else {
        addressErrorMsg.textContent = "";
        address = value;
        isAddressValid = true;
    };
};
function emailChecker(value) {
    let emailErrorMsg = document.getElementById("emailErrorMsg");

    if (!value.match(/^[\w_.-]+@[\w_-]+\.[a-z]{2,4}$/i) && value.length >= 0) {
        emailErrorMsg.textContent = "Email invalide.";
        isEmailValid = false;
    } else {
        emailErrorMsg.textContent = "";
        email = value;
        isEmailValid = true;
    };
};

 
/**
 * Affectation des fonctions de vérification, créées ci-dessus, au champ respectif qu'elles doivent vérifier.
 * @param {Array of HTML Element} inputs - Il s'agit d'un tableau de l'ensemble des inputs du formulaire.
 */
function formChecker(inputs) {
    inputs.forEach(input => {
        input.addEventListener("input", (e) => {
            let value = e.target.value;
            let id = e.target.id;
            
            switch (id) {
                case "firstName":
                firstNameChecker(value);
                break;
                    
                case "lastName":
                lastNameChecker(value);
                break;

                case "address":
                addressChecker(value);
                break;

                case "city":
                cityChecker(value);
                break;
                
                case "email":
                emailChecker(value);
                break;
                default: null;
            };
        });
    });
};

formChecker(inputs);



//---------------------------
// ENVOI DE LA COMMANDE (5/5)
//---------------------------

/**
 * Récupération de l'ensemble des identifiants présents dans le panier.
 * @return {Array} ids
 */
 function getIdToPost() {
    let ids = [];
    for (let i in cart) {
        let id = cart[i][ID];
        ids.push(id)
    }
    return ids;
};


/**
 * Création de l'objet à envoyer au back-end, et envoi des données au back-end avec
 * fetch et la méthode 'POST'.
 */
function sendDataToBackEnd() {

    // Création de l'objet à envoyer au back-end.
    const dataToPost = {
        contact: {
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email
        },
        products: getIdToPost()
    };

    // Méthode POST
    const post = {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(dataToPost)
    };

    //Envoi des données au back-end, et stockage du numéro de commande dans l'URL de la page confirmation.
    fetch("http://localhost:3000/api/products/order", post)
        .then((res) => res.json())
        .then((data) => {
            inputs.forEach(input => {
                input.value = "";  // Remise à zéro du formulaire.
            });
            sessionStorage.setItem("orderId", data.orderId); // Stockage du n° de commande pour y avoir accès au cas où l'utilisateur modifierai l'URL de la page confirmation.
            window.location.href = "./confirmation.html?orderId=" + data.orderId;
        })
        .catch(function(err){
            console.log(err);
        });
};


/**
 * Au click sur le bouton "Commander !", envoyer les informations au back-end seulement si le formulaire
 * est correctement rempli. Puis récupération du numéro de commande pour l'injecter dans l'URL de la page
 * confirmation.
 * @param {HTML Element} form - Il s'agit du formulaire de la page panier à remplir avant l'envoi de la commande.
 */
function submitOrder(form) {
    form.addEventListener("submit", (e) => {  
        e.preventDefault();
        let totalPrice = document.getElementById("totalPrice");
        
        if (cart === null || cart.length === 0) {
            alert("Votre panier est vide !")
            return;
        };
        console.log("3 : ", isFirstNameValid);
        if (!isFirstNameValid || !isLastNameValid || !isAddressValid || !isCityValid || !isEmailValid) {
            alert("Veuillez remplir correctement les champs.")
            return;
        };
        
        if (!confirm(`Le total de votre commande est de ${totalPrice.textContent} €. Voulez-vous procéder au paiement ?`)) return;
        
        sendDataToBackEnd();
    });
};

submitOrder(form);