const itemsSection = document.getElementById('items');

/**
 * Récupération des données de l'API.
 * @return {Object} data - Un objet contenant les informations de chaque 
produit est retourné (numéro d'identifiant, couleurs, prix, etc...).
 */
function getData() {
    return fetch('http://localhost:3000/api/products')
        .then((res) => res.json())
        .then((data) => {
            return data;          
        })
        .catch(function(err){
            const noProductMsg = document.createElement("p");
            noProductMsg.innerHTML = "<em>Désolé, aucun produit n'est disponible à la vente pour le moment... n'hésitez pas à repasser plus tard !</em>";
            itemsSection.appendChild(noProductMsg);
            console.log(err);
        });     
}; 


/**
 * Affichage d'un produit sur la page d'accueil.
 * @param {object} data - Ce paramètre sera l'objet retourné par le fonction 'getData()'.
 */
function displayItem(data) {

    let itemCard = document.createElement("a");
    itemCard.setAttribute("href", `./product.html?id=${data._id}`);
    itemsSection.appendChild(itemCard);

    let article = document.createElement("article");
    itemCard.appendChild(article);

    let image = document.createElement("img");
    image.setAttribute("src", data.imageUrl);
    image.setAttribute("alt", data.textAlt);
    article.appendChild(image);

    let name = document.createElement("h3");
    name.classList.add("productName");
    name.textContent = data.name;
    article.appendChild(name);

    let description = document.createElement("p");
    description.classList.add("productDescription");
    description.textContent = data.description;
    article.appendChild(description);
};


/**
 * Pour chaque produit présent dans l'API, la fonction ci-dessous execute la 
 * fonction 'displayItem()' qui va afficher chaque produit sur la page d'accueil.
 */
async function displayItems() {
    let dataFromAPI = await getData();
    for (let i in dataFromAPI) {
        displayItem(dataFromAPI[i]);
    };
};

displayItems()