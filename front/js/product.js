
function getIdOfProduct () {
    const productUrl = new URL(location.href).searchParams.get("id");
    return productUrl;
};          
// +
function fetchDataOfProduct(productId) {
    return fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => res.json())
    .then((data) => {
        return data;
    });            
};  
// +
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
// =

async function main() {
    const productId = getIdOfProduct();
    const productData = await fetchDataOfProduct(productId);
    displayDataOfProducts(productData);
};


// launch:
main();