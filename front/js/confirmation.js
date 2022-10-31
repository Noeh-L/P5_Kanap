let orderIdSpan = document.getElementById("orderId");
let orderId = getIdOfProduct();

displayOrderId(orderIdSpan);
clearLocalStorage();

/**
 * Récupération du numéro de commande via l'URL.
 * @return {String} orderIdFromUrl
 */ 
function getIdOfProduct() {
    const orderIdFromUrl = new URL(location.href).searchParams.get("orderId");
    const orderIdFromSS = sessionStorage.getItem("orderId")
    
    // si l'user s'amuse a retirer l'id de l'url, cela n'affectera pas l'affichage de l'orderId dans la span
    if (orderIdFromUrl === null || orderIdFromUrl === "" || orderIdFromUrl === "undefined") {
        window.location.href = "./confirmation.html?orderId=" + orderIdFromSS; //ne rien mettre signifie index.html automatiquement
        return;
    } else if (orderIdFromUrl !== orderIdFromSS) {
        return orderIdFromSS;
    } else {
        return orderIdFromUrl;
    };
};


/**
 * Affichage du numéro de commande dans la page confirmation.
 * @param {HTML Element} orderIdSpan 
 */
function displayOrderId(orderIdSpan) {
    orderIdSpan.innerHTML = `<strong>${orderId}</strong>`;
};


/**
 * Cette fonction vide le local storage. 
 */
function clearLocalStorage() {
    localStorage.clear();
};
