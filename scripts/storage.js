function checkForStorage() {
    return typeof (Storage) !== "undefined";
}

function saveProducts(data) {
    if (checkForStorage()) {
        localStorage.setItem("products", JSON.stringify(data))
    }
}

function getProduct(id) {
    if (checkForStorage()) {
        const products = JSON.parse(localStorage.getItem("products"));
        return products.find(item => item.id === parseInt(id));
    }
}

function saveCartItem(cart) {
    if (checkForStorage()) {
        localStorage.setItem("carts", JSON.stringify(cart))
    }
}

function getCartItem() {
    if (checkForStorage()) {
        return JSON.parse(localStorage.getItem("carts")) || [];
    } else {
        return [];
    }
}