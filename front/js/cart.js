const ID = 0;
const COLOR = 1;
const QUANTITY = 2;

// Je recupere l'array du local storage
let cart = JSON.parse(localStorage.getItem("cart"));
let cartItems = document.getElementById("cart__items");


// Je recupère les data grâce à l'id qu'il y a dans le local storage
function fetchDataOfProduct(productId) {
    return fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => res.json())
    .then((data) => {
        return data;
    });            
};  


// J'affiche dans le DOM les infos à partir du fetch ET du local storage.
function displayInDOM(product, color, quantity) {
    cartItems.innerHTML +=
    `
    <article class="cart__item" data-id="${product._id}" data-color="${color}">
        <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${color}</p>
                <p>${product.price} €</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                </div>
            </div>
        </div>
    </article>
    `
};

// J'écoute le click de l'user pour supprimer et changer la quantité d'un item (recherche internet : EVENT DELEGATION)
cartItems.addEventListener("click", (e) => {
    
    let elementClicked = e.target;
    let deleteButton = document.querySelector(".deleteItem");
    let changeQuantity = document.querySelector(".itemQuantity");

    let idFromButtonClicked = elementClicked.closest(".cart__item").dataset.id; //récup de l'id depuis son <article> parent
    let colorFromButtonClicked = elementClicked.closest(".cart__item").dataset.color;
    let indexItem = getIndex(idFromButtonClicked, colorFromButtonClicked);
    
    // SUPPRESSION DE L'ITEM
    if (elementClicked.className === deleteButton.className)
    {
        if (!confirm("Voulez-vous supprimer cet l'article ?")) {
        return;
        };

        cart.splice(indexItem, 1); //supprime du cart l'élément d'indice 'indexItem'
        localStorage.setItem("cart", JSON.stringify(cart));
        
        // Maintenant que le l'element est supprimer du cart, il s'agit maintenant de supprimer l'item du DOM (de la page)
        let itemToDelete = document.querySelector(`article[data-id="${idFromButtonClicked}"][data-color="${colorFromButtonClicked}"]`);       
        itemToDelete.remove();
        displayTotalQuantityAndPrice(cart);
    };

    // CHANGER LA QUANTITE DE L'ITEM
    if (elementClicked.className === changeQuantity.className)
    {  
        cart[indexItem][QUANTITY] = elementClicked.value;
        localStorage.setItem("cart", JSON.stringify(cart));
        displayTotalQuantityAndPrice(cart);
    };
        
});

// Récupération de l'index du cart qui possède la même id et même couleur que l'élément qui subit l'évènement (suppression et changement de quzntité).
function getIndex(id, color) {
    let indexOfItem = null;
    indexOfItem = cart.findIndex(item => item[ID] === id && item[COLOR] === color);
    return indexOfItem;
};


// Affichage du prix total et du nombre total d'article.
async function displayTotalQuantityAndPrice(cart) {
    let totalQuantity = document.getElementById("totalQuantity");
    let totalPrice = document.getElementById("totalPrice");
    let quantities = [];
    let priceItems = [];
    let total = [];

    for (let i in cart) {
        quantities.push(Number(cart[i][QUANTITY]));

        let infoItem = await fetchDataOfProduct(cart[i][ID]);
        priceItems.push(infoItem.price);
        total.push(priceItems[i] * quantities[i]);
        
        totalQuantity.textContent = quantities.reduce((a, b) => a + b, 0);
        totalPrice.textContent = total.reduce((a, b) => a + b, 0);
    };
};



// **********************************
// Execution de l'affichage du panier
// **********************************
async function displayCart() {
    for (let i in cart) {
        const dataProduct = await fetchDataOfProduct(cart[i][ID]);      
        displayInDOM(dataProduct, cart[i][COLOR], cart[i][QUANTITY]);
    };
  
    displayTotalQuantityAndPrice(cart);   
};

displayCart();



// **********************
// FORMULAIRE et COMMANDE
// **********************
const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
const form = document.querySelector(".cart__order__form");
let firstName, lastName, address, city, email;
let isFirstNameValid, isLastNameValid, isAddressValid, isCityValid, isEmailValid;

// Ces fonctions vont vérifier si les infos utilisateurs sont recevable par le back-end. Et ce, en utilisant des REGEX.
function firstNameChecker(value) {
    let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");

    if (value.length > 0 && (value.length < 2 || value.length > 25)) {
        firstNameErrorMsg.textContent = "Ce champs doit contenir 2 à 25 caractères."
        isFirstNameValid = false;
    } else if (!value.match(/^[a-z A-Z-]*$/)) {
        firstNameErrorMsg.textContent = "Ce champs ne peut contenir que des lettres et des tirets."
        isFirstNameValid = false;
    } else {
        firstNameErrorMsg.textContent = "";
        firstName = value;
        isFirstNameValid = true;
    };
};
function lastNameChecker(value) {
    let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");

    if (value.length > 0 && (value.length < 2 || value.length > 25)) {
        lastNameErrorMsg.textContent = "Ce champs doit contenir 2 à 25 caractères."
        isLastNameValid = false;
    } else if (!value.match(/^[a-z A-Z-]*$/)) {
        lastNameErrorMsg.textContent = "Ce champs ne peut contenir que des lettres et des tirets."
        isLastNameValid = false;
    } else {
        lastNameErrorMsg.textContent = "";
        lastName = value;
        isLastNameValid = true;
    };
};
function cityChecker(value) {
    let cityErrorMsg = document.getElementById("cityErrorMsg");

    if (value.length > 0 && (value.length < 2 || value.length > 25)) {
        cityErrorMsg.textContent = "Ce champs doit contenir 2 à 25 caractères."
        isCityValid = false;
    } else if (!value.match(/^[a-z A-Z-]*$/)) {
        cityErrorMsg.textContent = "Ce champs ne peut contenir que des lettres et des tirets."
        isCityValid = false;
    } else {
        cityErrorMsg.textContent = "";
        city = value;
        isCityValid = true;
    };
};
function addressChecker(value) {
    let addressErrorMsg = document.getElementById("addressErrorMsg");

    if (value.length > 0 && (value.length < 5 || value.length > 100)) {
        addressErrorMsg.textContent = "Ce champs doit contenir 5 à 100 caractères."
        isAddressValid = false;
    } else if (!value.match(/^[a-z A-Z-0-9]*$/)) {
        addressErrorMsg.textContent = "Ce champs ne peut contenir que des chiffres, des lettres et des tirets."
        isAddressValid = false;
    } else {
        addressErrorMsg.textContent = "";
        address = value;
        isAddressValid = true;
    };
};
function emailChecker(value) {
    let emailErrorMsg = document.getElementById("emailErrorMsg");

    if (!value.match(/^[\w_.-]+@[\w_-]+\.[a-z]{2,4}$/i) && value.length > 0) {
        emailErrorMsg.textContent = "Email invalide."
        isEmailValid = false;
    } else {
        emailErrorMsg.textContent = "";
        email = value;
        isEmailValid = true;
    };
};

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

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (cart === null || cart.length === 0) {
        alert("Votre panier est vide !")
        return;
    };

    if (!isFirstNameValid || !isLastNameValid || !isAddressValid || !isCityValid || !isEmailValid) {
        alert("Veuillez remplir correctement les champs.")
        return;
    };
    
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

    const post = {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(dataToPost)
    };

    fetch("http://localhost:3000/api/products/order", post)
        .then((res) => res.json())
        .then((data) => {
            inputs.forEach(input => {
                input.value = "";
            });
            window.location.href = "./confirmation.html?orderId=" + data.orderId;
        });

});

//Récupération de l'ensemble de id présents dans le cart.
function getIdToPost() {
    let ids = [];
    for (let i in cart) {
        let id = cart[i][ID];
        ids.push(id)
    }
    return ids;
}