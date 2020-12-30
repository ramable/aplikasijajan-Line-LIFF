const cartTotal = document.getElementById("cart-total");
const totalDisplay = document.getElementById("total");
const itemTotalNum = document.getElementById("total-item");
const emptyState = document.querySelector(".empty-cart");
const cartContent = document.querySelector(".cart-content");
const buyItem = document.querySelector(".btn-buy");
const sendItem = document.querySelector(".btn-send");

document.addEventListener("DOMContentLoaded", function () {
    const elem = document.querySelector(".tabs");
    M.Tabs.init(elem, {
        swipeable: true
    });

    const elems = document.querySelector('.modal');
    instances = M.Modal.init(elems);

    getFoodCards()
})

document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;

// Button horizontal scroll homepage
const btnRightScroll = document.getElementById("scroll-right");

function slideRight() {
    const scroller = document.querySelector(".scroller");
    sideScroll(scroller, "right", 10, 350, 10);
};

const btnLeftScroll = document.getElementById("scroll-left");

function slideLeft() {
    const scroller = document.querySelector(".scroller");
    sideScroll(scroller, "left", 10, 350, 10);
};

function sideScroll(element, direction, speed, distance, step) {
    scrollAmount = 0;
    let slideTimer = setInterval(function () {
        if (direction === "left") {
            element.scrollLeft -= step;
        } else {
            element.scrollLeft += step;
        }
        scrollAmount += step;
        if (scrollAmount >= distance) {
            window.clearInterval(slideTimer);
        }
    }, speed);
}

// Coverting integer to currency
function currencyConvert(nominal) {
    let numString = nominal.toString(),
        remains = numString.length % 3,
        rupiah = numString.substr(0, remains),
        thousands = numString.substr(remains).match(/\d{3}/g);

    if (thousands) {
        separator = remains ? "." : "";
        rupiah += separator + thousands.join(".");
    }
    return `${rupiah}`;
}

// Get Data Food
function getFoodCards() {
    if ("caches" in window) {
        caches.match("products.json").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    showFoodCards(data);
                })
            }
        })
    }
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            showFoodCards(data);
        })
}

function showFoodCards(data) {
    const foodList = data.items;
    saveProducts(foodList);

    let scrollCards = "";
    foodList.forEach((m) => {
        scrollCards += `
        <div class="col s6">
            <div class="card card-food">
                <div class="card-image">
                    <img src="${m.image}">
                </div>
                <div class="card-content">
                    <span class="card-title truncate">
                        <h6>${m.title}</h6>
                    </span>
                    <p class="price">Rp ${currencyConvert(m.price)}</p>
                    <button class="btn waves-effect waves-light btn-item add-to-cart" type="submit"name="action" data-id="${m.id}">PESAN</button>
                </div>
            </div>
        </div>`;
    });
    document.querySelector(".scroller").innerHTML = scrollCards;
    getButtons()
}

function getButtons() {
    let cart = [];
    const buttons = [...document.querySelectorAll(".add-to-cart")];
    buttons.forEach(btn => {
        const id = btn.dataset.id;
        const inCart = cart.find(item => item.id === id);

        if (inCart) {
            btn.innerText = "sudah dipesan";
            btn.disabled = true;
            btn.style.boxShadow = "none";
        }

        btn.addEventListener("click", e => {
            e.preventDefault();
            e.target.innerText = "sudah dipesan";
            e.target.disabled = true;

            // Get product
            const cartItem = {
                ...getProduct(id),
                amount: 1
            };

            // Add product to the cart
            cart = [...cart, cartItem]

            // Storage product in local storage
            saveCartItem(cart);

            // SetItemValues
            this.setItemValues(cart);

            // show Display Cart
            this.showCartItems(cart);
        });
    })
}

function setItemValues(cart) {
    let tempTotal = 0;
    let itemTotal = 0;

    cart.map(item => {
        tempTotal += item.price * item.amount;
        itemTotal += item.amount;
    });

    if (tempTotal > 0) {
        totalDisplay.classList.remove("hidden");
        cartTotal.innerText = currencyConvert(tempTotal);
    } else {
        totalDisplay.classList.add("hidden");
    }

    if (itemTotal > 0) {
        itemTotalNum.classList.remove("hidden");
        itemTotalNum.innerText = itemTotal;
    } else {
        itemTotalNum.classList.add("hidden");
    }
}

function showCartItems(cart) {
    if (cart.length > 0) {
        let cartList = "";
        cart.forEach((m) => {
            cartList += `
            <div class="row cart-row">
                <div class="col s2">
                    <img class="item-cart-image" src="${m.image}" alt="">
                </div>
                <div class="col s4">
                    <p class="valign-wrapper">${m.title}</p>
                </div>
                <div class="col s4">
                    <p>Rp ${currencyConvert(m.price)}</p>
                </div>
                    <div class="col s1 qty-list">
                        <button class="btn-floating waves-effect waves-light btn-cart-list increase" data-id="${m.id}">
                            <i class="material-icons green-text text-accent-4 qty-icon">keyboard_arrow_up</i>
                        </button>
                        <p>1</p>
                        <button class="btn-floating waves-effect waves-light btn-cart-list decrease" data-id="${m.id}">
                            <i class="material-icons green-text text-accent-4 qty-icon">keyboard_arrow_down</i>
                        </button>
                    </div>
                    <div class="col s1 remove-col">
                        <button class="btn-floating btn-cart-list remove-item" data-id="${m.id}">
                            <i class="material-icons red-text text-accent-2 qty-icon">delete_forever</i>
                        </button>
                    </div>   
            </div>`;
        });
        cartContent.innerHTML = cartList;
        emptyState.classList.add("hidden");
        cartLogic(cart);
    } else {
        emptyState.classList.remove("hidden");
    }
}

function cartLogic(cart) {
    const singleModalElem = document.querySelector('#modal1');
    const instance = M.Modal.getInstance(singleModalElem);

    // Buy button
    buyItem.addEventListener("click", () => {
        instance.open();
    })

    // Send button
    sendItem.addEventListener("click", btn => {
        btn.target.disabled = true;
        btn.target.innerText = "terkirim"
        sendComplete()
    })

    document.querySelectorAll(".cart-row").forEach(elm => {
        elm.addEventListener("click", e => {
            const target = e.target.closest("button");
            if (!target) return;

            if (target.classList.contains("remove-item")) {
                const id = parseInt(target.dataset.id);
                this.removeItem(id);
                cartContent.removeChild(target.parentElement.parentElement);
            } else if (target.classList.contains("increase")) {
                const id = parseInt(target.dataset.id);
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount++;
                saveCartItem(cart);
                this.setItemValues(cart);
                target.nextElementSibling.innerText = tempItem.amount;
            } else if (target.classList.contains("decrease")) {
                const id = parseInt(target.dataset.id);
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount--;
                if (tempItem.amount > 0) {
                    saveCartItem(cart);
                    this.setItemValues(cart);
                    target.previousElementSibling.innerText = tempItem.amount;
                } else if (tempItem.amount === 0) {
                    this.removeItem(id);
                    cartContent.removeChild(target.parentElement.parentElement);
                }
            }
            if (getCartItem().length === 0) {
                emptyState.classList.remove("hidden");
            }
        });
    });
}

function removeItem(id) {
    cart = getCartItem().filter(item => item.id !== id);
    saveCartItem(cart);
    this.setItemValues(cart);

    let button = this.btnActivate(id);
    button.disabled = false;
    button.innerText = "pesan";
}

function btnActivate(id) {
    const buttons = [...document.querySelectorAll(".add-to-cart")]
    return buttons.find(button => parseInt(button.dataset.id) === id)
}

function sendComplete() {
    const cartItems = getCartItem().map(item => item.id);
    const cartContent = document.querySelector(".cart-content")

    cartItems.forEach(id => this.removeItem(id));
    emptyState.classList.remove("hidden");

    while (cartContent.children.length > 0) {
        cartContent.removeChild(cartContent.children[0]);
        document.getElementById("modal-interaction").innerHTML = `
                    <img class="img-order" src="images/assets/undraw_happy_announcement_ac67.svg" alt="">
                    <h4>Berhasil!!! &#129395</h4>
                    <p>Selamat, jajanan kamu sudah dikirim. <br> Silakan lihat chat LINE kamu.</p>`;
    }
}