let orderIdElement = document.getElementById("orderId");
let orderId = getIdOfProduct();

displayOrderId(orderIdElement);
clearLocalStorage();

// Récupération du numéro de commande via l'URL
function getIdOfProduct() {
    const productUrl = new URL(location.href).searchParams.get("orderId");
    
    // si l'user s'amuse a retirer l'id de l'url, ça le renvoit dans page d'accueil
    if (productUrl === null || productUrl === "" || productUrl === "undefined") {
        alert("Erreur. Le numéro de commande n'a pas pu être généré. Retour à la page d'acccueil.")
        window.location.href = "http://127.0.0.1:5500/front/html/index.html";
        return;
    } else {
        return productUrl;
    };
};

// Affichage du numéro de commande
function displayOrderId(orderIdElement) {
    orderIdElement.textContent = orderId;
};

// Vidage du local storage.
function clearLocalStorage() {
    localStorage.clear()
};
