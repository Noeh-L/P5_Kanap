/**
 * Ne pas oublier
 * de bien commenter ! Notamment les fonctions.
 *  /!\ /!\
 * (ceci est ce que l'on appelle un commentaire
 * au format JSDoc)
 */
//__________________________________________________
const items = document.getElementById('items');
let allData = {
    name: [],
    price: [],
    description: [],
    image: [],
    altTxt: [],
    id: []
}

let numberOfProducts = 0;

// Cette fonction appelle les données des produits, et les range
// dans des tableaux à l'intérieur de l'objet allData.
// async function getData() {
//     await fetch('http://localhost:3000/api/products')
//         .then((res) => res.json())
//         .then((data) => {
            
//             for (let i = 0; i < data.length; i++) {
//                 allData.name.push(data[i].name); 
//                 allData.price.push(data[i].price); 
//                 allData.description.push(data[i].description); 
//                 allData.image.push(data[i].imageUrl); 
//                 allData.altTxt.push(data[i].altTxt); 
//                 allData.id.push(data[i].name);
//             };

//             numberOfProducts = data.length;
//         });
// };
    
// // Cette fonction ajoute au DOM les cards des kanap.
// function displayInDOM() {
//     for (let i=0; i < numberOfProducts; i++) {

//         items.innerHTML += 
//             `
//             <a href="./product.html?id=${allData.id}">
//                 <article>
//                     <img src="../../back/images/kanap0${i+1}.jpeg" alt="${allData.altTxt[i]}" />
//                     <h3 class="productName">${allData.name[i]}</h3>
//                     <p class="productDescription">${allData.description[i]}</p>
//                 </article>
//             </a>
//             `;
//     };
    
// };

// getData();
// setTimeout(displayInDOM, "1000"); //Comment faire autrement ?? SetTimeout c'est du brocolage nan ?

// Finalement j'ai reussi à faire autrement :
// good or not ? (mentorat)
async function getData() {

    await fetch('http://localhost:3000/api/products')
          .then((res) => res.json())
          .then((data) => {
            
            for (let i = 0; i < data.length; i++) {
                allData.name.push(data[i].name); 
                allData.price.push(data[i].price); 
                allData.description.push(data[i].description); 
                allData.image.push(data[i].imageUrl); 
                allData.altTxt.push(data[i].altTxt); 
                allData.id.push(data[i]._id);
            };

            numberOfProducts = data.length;
          });
        
    for (let i=0; i < numberOfProducts; i++) {
        
        items.innerHTML += 
        `
        <a href="./product.html?id=${allData.id[i]}">
        <article>
        <img src="../../back/images/kanap0${i+1}.jpeg" alt="${allData.altTxt[i]}" />
        <h3 class="productName">${allData.name[i]}</h3>
        <p class="productDescription">${allData.description[i]}</p>
        </article>
        </a>
        `;
    };
}; 

getData();
console.log(allData);