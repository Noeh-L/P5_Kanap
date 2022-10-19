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
function displayInDOM(product, indexOfItem) {
    cartItems.innerHTML +=
    `
    <article class="cart__item" data-id="${product._id}" data-color="${cart[indexOfItem][1]}">
        <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${cart[indexOfItem][1]}</p>
                <p>${product.price} €</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[indexOfItem][2]}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                </div>
            </div>
        </div>
    </article>
    `
};

// ********************************** DELETE BUTTON ********************************************
// lorsque l'user clique sur supprimer, cela doit enlever l'array de notre cart
function deleteItem() {
    let deleteButtons = document.querySelectorAll(".deleteItem");
   
    deleteButtons.forEach(button => { 
        button.addEventListener('click', (e) => {
            if (confirm("Voulez-vous supprimer cet l'article ?")) {
                let idFromDeleteButton = e.target.closest(".cart__item").dataset.id;
                let colorFromDeleteButton = e.target.closest(".cart__item").dataset.color;
                let indexItem = getIndex(idFromDeleteButton, colorFromDeleteButton);
        
                if (indexItem === -1) {
                    alert("ERREUR : l'élement que vous essayez de supprimer n'existe plus dans le local storage.");
                    return;
                }

                cart.splice(indexItem, 1) //supprime du cart l'element d'indice 'indexItem'
                localStorage.setItem("cart", JSON.stringify(cart));

                // maintenant que le l'element est supprimer du cart, il s'agit maintenant de supprimer l'item du DOM (de la page)
                let itemToDelete = document.querySelector(`article[data-id="${idFromDeleteButton}"][data-color="${colorFromDeleteButton}"]`);
                
                itemToDelete.remove();

            } else {
                return;
            };
        });
    });
    
};

// recupere l'index de l'element du cart qui correspond à la condition.
function getIndex(id, color) {
    let indexOfItem = null;
    return indexOfItem = cart.findIndex(item => item[0] === id && item[1] === color)
};

// ************* END - DELETE BUTTON ****************************************
// **************************************************************************


// **************************************************************************
// *************** CHANGE QUANTITY ******************************************

let itemQuantities = document.getElementsByClassName("itemQuantity");
let itemQuantitis = document.querySelectorAll("input.type");
console.log(itemQuantities, HTMLCollection);
console.log(itemQuantitis);

// itemQuantities.forEach(itemQuantity => {
    
//     itemQuantity.addEventListener('change', (e) => {
//         console.log("oooooh");

//     });

// });
















// ************* END - DELETE BUTTON ****************************************
// **************************************************************************



// *********
// EXECUTION
// *********
async function mainCart() {
  
    for (let i = 0; i < cart.length; i++) {
        const dataProduct = await fetchDataOfProduct(cart[i][0]);      
        displayInDOM(dataProduct, i);      
    };

    deleteItem();

};

mainCart();