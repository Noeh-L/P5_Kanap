const ID = 0;
const COLOR = 1;
const QUANTITY = 2;

// je recupere le l'array du local storage
let cart = JSON.parse(localStorage.getItem("cart"));
let cartItems = document.getElementById("cart__items");


// je recupère les data grâce à l'id qu'il y a dans le local storage
function fetchDataOfProduct(productId) {
    return fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => res.json())
    .then((data) => {
        return data;
    });            
};  


// j'affiche dans le DOM les infos à partir du fetch ET du local storage. Le 2eme parametre 'indexOfItem' c'est l'index du produit dans le panier. Je l'incrémente plus bas, lors de l'execution des fonctions, avec une boucle for.

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
    // AAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHH !!!!!
    
    let deleteButtons = cartItems.querySelectorAll('.deleteItem');
    let deleteButton = deleteButtons[deleteButtons.length-1];
    console.log(deleteButton.closest(`article[data-id="${product._id}"][data-color="${color}"]`));
    

    
    deleteButton.addEventListener("click", () => {
        if (!confirm("Voulez-vous supprimer cet l'article ?")) {
            return;
        }

        
        // let idFromDeleteButton = e.target.closest(".cart__item").dataset.id;
        // let colorFromDeleteButton = e.target.closest(".cart__item").dataset.color;
        let indexItem = getIndex(product._id, color);

        if (indexItem === -1) {
            alert("ERREUR : l'élement que vous essayez de supprimer n'existe plus dans le local storage.");
            return;
        }

        cart.splice(indexItem, 1) //supprime du cart l'element d'indice 'indexItem'
        localStorage.setItem("cart", JSON.stringify(cart));

        // maintenant que le l'element est supprimer du cart, il s'agit maintenant de supprimer l'item du DOM (de la page)
        let itemToDelete = document.querySelector(`article[data-id="${product._id}"][data-color="${color}"]`);
        
        itemToDelete.remove();
       
    });
};







// ********************************** DELETE BUTTON ********************************************
// lorsque l'user clique sur supprimer, cela doit enlever l'array de notre cart
// function deleteItem() {
//     let deleteButtons = document.querySelectorAll(".deleteItem");
   
//     deleteButtons.forEach(button => { 
        
//     });
    
// };

// recupere l'index de l'element du cart qui correspond à la condition.
function getIndex(id, color) {
    let indexOfItem = null;
    indexOfItem = cart.findIndex(item => item[ID] === id && item[COLOR] === color)
    return indexOfItem;
};

// ************* END - DELETE BUTTON ****************************************
// **************************************************************************


// **************************************************************************
// *************** CHANGE QUANTITY ******************************************

function displayItemQuantity(cart) {
    let totalQuantity = document.getElementById('totalQuantity');
    totalQuantity.textContent = cart.length;
}





// ************* END - DELETE BUTTON ****************************************
// **************************************************************************



// **************************************************************************
// *************** CHANGE QUANTITY ******************************************


// itemQuantities.forEach(itemQuantity => {
    
//     itemQuantity.addEventListener('change', (e) => {
//         console.log("oooooh");

//     });

// });







// ************* END -  ****************************************
// **************************************************************************



// *********
// EXECUTION
// *********
async function displayCart() {
  
    for (let i in cart) {
        const dataProduct = await fetchDataOfProduct(cart[i][ID]);      
        displayInDOM(dataProduct, cart[i][COLOR], cart[i][QUANTITY]);
    };

    // deleteItem();
    displayItemQuantity(cart);

    let itemQuantities = document.getElementsByClassName("itemQuantity");
    let itemQuant = document.querySelectorAll(".itemQuantity");
    // console.log(itemQuantities[0]);
    // console.log(itemQuant);
};

displayCart();

