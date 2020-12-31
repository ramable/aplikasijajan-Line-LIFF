window.onload = function () {
    // if not using a node server, set this value to false
    const useNodeJS = false;
    // change the default LIFF value if not using a node server
    const defaultLiffId = "1655528399-Jnk8B6D7";

    let myLiffId = "";

    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function (reqResponse) {
                return reqResponse.json();
            })
            .then(function (jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch((err) => {
                console.log("Error : Unable to receive the LIFF ID as an environment variable" + err);
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};

// Check if myLiffId is null. If null do not initiate liff
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        console.log("You have not assigned any value for LIFF ID")
    } else {
        initializeLiff(myLiffId);
    }
}

function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            console.log("Error : Something went wrong with LIFF initialization " + err.code, err.message);
        });
}

function initializeApp() {

    displayIsInClientInfo();
    getClientProfile()
    registerButtonHandlers();

    if (liff.isLoggedIn()) {
        isloaded()
        document.querySelector(".login-page").classList.add("hidden");
        document.getElementById("header").classList.remove("hidden");
        document.getElementById("display-food").classList.remove("hidden");
        document.getElementById("footer").classList.remove("hidden");
    } else {
        isloaded()
        document.querySelector(".login-page").classList.remove("hidden");
        document.getElementById("tab-section").classList.add("hidden");
    }
}

function displayIsInClientInfo() {
    if (liff.isInClient()) {
        document.getElementById("line-version").innerText = liff.getLineVersion();
        document.getElementById("get-os").innerText = liff.getOS();
    } else {
        document.getElementById("open-running").innerText = "External Browser";
        document.getElementById("line-version").classList.add("hidden");
        document.getElementById("get-os").innerText = liff.getOS();
        document.getElementById("btn-logout").classList.remove("hidden");
        document.getElementById("open-window").classList.add("hidden");
    }
}



function getClientProfile() {
    liff.getProfile().then(data => {
            document.querySelector(".display-name").innerText = data.displayName;
            document.querySelector(".name-tab").innerText = data.displayName;
            document.getElementById("status").innerText = data.statusMessage === undefined ? "Tidak Ada Status" : data.statusMessage;
            document.querySelector(".display-picture").innerHTML = `<img class="circle responsive-img" src="${data.pictureUrl}">`;
            document.querySelector(".header-photo").innerHTML = `<img class="circle responsive-img" src="${data.pictureUrl}">`;
            document.getElementById("display-cover").innerHTML = `<div class="cover" style="background-image: url(${data.pictureUrl});">
            </div>`;
        })
        .then(data => {
            const userName = data.displayName;
            return userName
        })
        .catch((err) => {
            console.log(err);
        })
}

function registerButtonHandlers() {
    document.getElementById("open-window").addEventListener("click", function () {
        liff.openWindow({
            url: "https://aplikasijajan.herokuapp.com",
            external: true
        });
    });

    document.getElementById("btn-login").addEventListener("click", function () {
        if (!liff.isLoggedIn()) {
            liff.login();
        }
    });

    document.getElementById("btn-logout").addEventListener("click", function () {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        }
    });

    document.getElementById("send-message").addEventListener("click", function () {
        liff.sendMessages([{
                "type": "text",
                "text": sendReport()
            }]).then(() => {
                console.log("message sent");
            })
            .catch((err) => {
                console.log("Error :" + err);
            })
    })
}

function sendReport() {
    const orderItem = getCartItem()
    let tempTotal = 0;
    orderItem.map(item => tempTotal += item.price * item.amount);

    let msgBody = "";

    orderItem.forEach((m) => {
        msgBody += `
        ${m.amount} biji ${m.title}
        `;
    });

    let msgContent = `
    Hallo,

    Selamat!! Kamu baru saja berhemat dengan total jajan cuma Rp ${currencyConvert(tempTotal)} di aplikasi JajanKuy.
    
    Berikut review jajanan yang kamu pesan:
    ${msgBody}
    
    Mohon ditunggu ya, pesanan kamu sedang dalam proses pengiriman. Lanjut jajan hemat lagi kuy di JajanKuy!!
    `;

    return msgContent;
}