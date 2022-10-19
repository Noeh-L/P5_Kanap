// *****************************************************
// AFFICHAGE DES INFOS DU PRODUITS SUR LA PAGE "PRODUCT"
// *****************************************************


// 1/4 ------------------------------------------
// va lire l'url de la page, et en extraire l'id.
function getIdOfProduct() {
    const productUrl = new URL(location.href).searchParams.get("id");

    // si l'user s'amuse a retirer l'id de l'url, ça le renvoit dans page accueil
    if (productUrl == null || productUrl == "") {
        window.location.href = "http://127.0.0.1:5500/front/html/index.html";
        return;
    } else {
        return productUrl;
    };
};  

// 2/4 -----------------------------------------------------
// va chercercher les données de l'id en question seulement.
function fetchDataOfProduct(productId) {
    return fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => res.json())
    .then((data) => {
        return data;
    });            
};  

// 3/4 ----------------------------------------------------
// va modifier le DOM pour y insérer les infos du produits.
function displayDataOfProducts(productData) {
    document.getElementById("title").innerHTML = productData.name;
    document.getElementById("price").innerHTML = productData.price;
    document.getElementById("description").innerHTML = productData.description;
    document.querySelector(".item__img").innerHTML = `<img src="${productData.imageUrl}" alt="${productData.altTxt}" />`;
    document.querySelector("title").innerHTML = `${productData.name}`;

    productData.colors.forEach(color => {
        document.getElementById("colors").innerHTML += 
        `
        <option value=${color}>${color}</option>
        `      
    });
};

// 4/4 ---------------------------------------------------------------------
// va jouer toutes les fonctions précememment créées, de manière asynchrone.
async function main() {
    const productId = getIdOfProduct();
    const productData = await fetchDataOfProduct(productId);
    displayDataOfProducts(productData);
};

main();


//_____________________________________________________________________________________ 
//_____________________________________________________________________________________ 


// **********************************************
// Stockage des infos lors de l'ajout au panier :
// **********************************************


// va ajouter les infos de l'user qu'on lui met en paramètre dans le local storage du navigateur.
async function addToLocalStorage() {
    let id = getIdOfProduct();
    let color = document.getElementById("colors");
    let quantity = document.getElementById("quantity");
    let addToCart = document.getElementById("addToCart");
    
    addToCart.addEventListener("click", () => {       
        let cart = [];  //le panier
        let cartLS = localStorage.getItem("cart"); //ce qu'il y a dans le LS
        
        let infoOfProductAdded = [id, color.value, Number(quantity.value)]
        
        
        if (color.value === "" || Number(quantity.value) === 0) {
            alert("Veuillez choisir une couleur et une quantité.");
            return;
        };
        

        //cette conditions intérroge mon LS : si non-vide, le panier récupère les produits du LS (cartLS) et les range dans le panier (cart)
        if (cartLS == null) {

            cart.push(infoOfProductAdded);
            localStorage.setItem("cart", JSON.stringify(cart));

        } else {

            cart = JSON.parse(cartLS); //je mets cette ligne ici pour que dans la ligne suivante (index), on puisse récupérer la valeur de cart[0 et 1]          
            let index = cart.findIndex(cart => infoOfProductAdded[0] == cart[0] && infoOfProductAdded[1] == cart[1]);      
           
           // si kanap inexistant dans cart, ajoutons le, sinon augmentons seulement la quantité du kanap existant
            if (index === -1) {               
                cart.push(infoOfProductAdded);
                localStorage.setItem("cart", JSON.stringify(cart));
            } else {
                cart[index][2] = cart[index][2] + infoOfProductAdded[2];
                localStorage.setItem("cart", JSON.stringify(cart));
            }
        };
      
        console.log(cart);

        if(confirm("Article ajouté au panier ! Souhaitez accéder à votre panier ?")) {
        window.location.href = "./cart.html"
        };               
        
    });
};


addToLocalStorage();