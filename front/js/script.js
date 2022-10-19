/**
 * Ne pas oublier
 * de bien commenter ! Notamment les fonctions.
 *  /!\ /!\
 * (ceci est ce que l'on appelle un commentaire
 * au format JSDoc)
 */
//__________________________________________________
const itemsSection = document.getElementById('items');

let numberOfProducts = 0;


function getData() {
    return fetch('http://localhost:3000/api/products')
          .then((res) => res.json())
          .then((data) => {
            return data;          
        });
}; 

function displayInDOM(data) {
    for (let i in data) {                
        itemsSection.innerHTML += 
        `
        <a href="./product.html?id=${data[i]._id}">
        <article>
        <img src="${data[i].imageUrl}" alt="${data[i].altTxt}" />
        <h3 class="productName">${data[i].name}</h3>
        <p class="productDescription">${data[i].description}</p>
        </article>
        </a>
        `;
    };
}


async function main() {
    let dataFromAPI = await getData();
    displayInDOM(dataFromAPI);
};

main()