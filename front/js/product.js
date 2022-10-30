// Déclaration de constante afin de rendre le code plus lisible (cart[i][ID] au lieu de cart[i][0]).
const ID = 0;
const COLOR = 1;
const QUANTITY = 2;
const NOTFOUND = -1;

// -----------------------------------------------------
// AFFICHAGE DES INFOS DU PRODUITS SUR LA PAGE 'PRODUCT'
// -----------------------------------------------------

/**
 * Cette fonction va lire l'URL de la page, et en extraire l'identifiant du produit. Si l'utilisateur
 * retire l'identifiant de l'URL, alors il sera redirigé vers la page d'accueil.
 * @return {String} idFromUrl - Cette fonction retourne l'identifiant du produit sous forme de chaine de caractères. 
 */
function getIdOfProduct() {
    const idFromUrl = new URL(location.href).searchParams.get("id");

    if (idFromUrl === null || idFromUrl === "") {
        alert("Vous allez être redirigé vers la page d'accueil.")
        window.location.href = "./index.html";
        return;
    } else {
        return idFromUrl;
    };
};


/**
 * Cette fonction va chercher dans l'API les informations du produit dont l'identifiant a été retourné dans la fonction 'getIdOfProduct()'.
 * @param {String} productId - L'identifiant du produit.
 * @return {Object} data - Un objet contenant les informations du produits sera retourné. 
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
 * Cette fonction va modifier le DOM pour y insérer les informations du produit.
 * @param {Objet} productData - Il s'agit de l'objet retourné par la fonction 'fetchDataOfProduct()', contenant les informations du produit. 
 */
function displayDataOfProducts(productData) {
    document.getElementById("title").innerHTML = productData.name;
    document.getElementById("price").innerHTML = productData.price;
    document.getElementById("description").innerHTML = productData.description;
    document.querySelector(".item__img").innerHTML = `<img src="${productData.imageUrl}" alt="${productData.altTxt}" />`;

    productData.colors.forEach(color => {
        document.getElementById("colors").innerHTML += `<option value=${color}>${color}</option>`;
    });
};


/**
 * Execution de l'ensemble des fonctions précédemment créées, de manière asynchrone.
 */
async function main() {
    const productId = getIdOfProduct();
    const productData = await fetchDataOfProduct(productId);
    displayDataOfProducts(productData);
};

main();



// --------------------------------------------
// Stockage des infos lors de l'ajout au panier
// --------------------------------------------

/**
 * Récupération de l'indice d'un produit dans le panier.
 * @param {Array} cart - Il s'agit du panier.
 * @param {String} id - Il s'agit de l'identifiant du produit dont nous voulons l'index.
 * @param {String} color - Il s'agit de la couleur du produit dont nous voulons l'index.
 * @return {Number} indexOfItem - L'index du produit dans le panier ('cart') qui respecte la condition imposée.
 */
function getIndex(cart, id, color) {
    let indexOfItem = null;
    indexOfItem = cart.findIndex(item => id === item[ID] && color === item[COLOR]);
    return indexOfItem;
};


/**
 * Cette fonction ajoute le produit au panier seulement si ce dernier est ajoutable. C'est-à-dire
 * si la quantité de ce dernier n'excède pas la quantité autorisée (100 exemplaires).
 * @param {String} id
 * @param {String} color
 * @param {String} quantity
 */
function addIfAddable(id, color, quantity) { 
    let cart = [];
    let cartFromLS = localStorage.getItem("cart");
    let infoOfProductAdded = [id, color.value, Number(quantity.value)];

    // Si le local storage est non-vide, le(s) produit(s) déjà présent(s) dans le LS (i.e. tableau 'cartFromLS') seront stockés dans le tableau 'cart'. 
    if (cartFromLS !== null) {
        cart = JSON.parse(cartFromLS);          
    };

    let index = getIndex(cart, infoOfProductAdded[ID], infoOfProductAdded[COLOR]); 
    if (index === NOTFOUND) {
        cart.push(infoOfProductAdded);
        localStorage.setItem("cart", JSON.stringify(cart));
    } else if (cart[index][QUANTITY] + infoOfProductAdded[QUANTITY] > 100) {
        let itemsLeftToBuy = 100 - cart[index][QUANTITY];
        if (itemsLeftToBuy === 0) {
            alert("Désolé, vous avez atteint le nombre maximal d'exemplaire achetable pour ce modèle (100 exemplaires).");
            quantity.value = 1;
            return;
        } else { 
            alert(`Seulement 100 exemplaires par modèle sont achetables. Vous pouvez encore en ajouter ${itemsLeftToBuy}.`);
            quantity.value = itemsLeftToBuy;
            return;
        };
    } else {
        cart[index][QUANTITY] = cart[index][QUANTITY] + infoOfProductAdded[QUANTITY];
        localStorage.setItem("cart", JSON.stringify(cart));
    };

    if (confirm("Article ajouté au panier ! Souhaitez accéder à votre panier ?")) {
        window.location.href = "./cart.html";
    };
};


/**
 * Au click sur le bouton "Ajouter au panier", cette fonction va appeler la fonction 'addIfAddable()'
 * seuelement su l'utilisateur entre une couleur et une quantité comprise entre 1 et 100. 
 */
async function addToLocalStorage() {
    let id = getIdOfProduct();
    let color = document.getElementById("colors");
    let quantity = document.getElementById("quantity");
    let addToCart = document.getElementById("addToCart");

    addToCart.addEventListener("click", () => {
        if (color.value === "" || Number(quantity.value) === 0 || Number(quantity.value) < 0 || Number(quantity.value) > 100) {
            alert("Veuillez choisir une couleur et une quantité comprise entre 1 et 100.");
            quantity.value = 1;
            return;
        };
        addIfAddable(id, color, quantity);      
    });
};

addToLocalStorage();
