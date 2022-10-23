let orderIdElement = document.getElementById("orderId");
let orderId = getIdOfProduct();
console.log(orderId);

displayOrderId(orderIdElement);
clearLocalStorage();


function getIdOfProduct() {
    const productUrl = new URL(location.href).searchParams.get("orderId");
    
    // si l'user s'amuse a retirer l'id de l'url, ça le renvoit dans page d'accueil
    if (productUrl == null || productUrl == "") {
        window.location.href = "http://127.0.0.1:5500/front/html/index.html";
        return;
    } else {
        return productUrl;
    };
};

function displayOrderId(orderIdElement) {
    orderIdElement.textContent = orderId;
};

function clearLocalStorage() {
    localStorage.clear()
};
