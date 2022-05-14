// Variables
const section = document.querySelector("section")

// Fonctions 
/**
 * Récupère les informations passées en paramètre de l'url
 * @param {*} urlParam 
 * @returns 
 */
const getItemID = (urlParam) => {
    let url = new URL(window.location.href)
    let search_params = new URLSearchParams(url.search);
    if (search_params.has(urlParam)) {
        return search_params.get(urlParam);
    }
}


/**
 * Crée un bouton option contenant une couleur
 * @param {*} list 
 * @returns 
 */

const createColorOption = (color) => {
    const colorOption = document.createElement('option');
    colorOption.innerText = color;
    colorOption.value = color;

    return colorOption;
}


/**
 * Affiche le produit avec ses caractéristiques techniques
 * @param {*} product 
 */

const setElementsValue = (product) => {

    const title = document.querySelector("#title");
    title.textContent = product.name;

    const img = document.querySelector("#productPicture");
    img.src = product.imageUrl;
    img.alt = product.altTxt;

    const price = document.querySelector("#price");
    price.textContent = formatToCurrency(product.price / 100);

    const desc = document.querySelector("#description");
    desc.textContent = product.description;

    const color = document.querySelector("#colors");
    product.colors
        .map(color => createColorOption(color))
        .forEach(element => color.appendChild(element))

}

// récupère l'id, la quantité, la couleur
const formatToCurrency = amount => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

/**
 * Ajoute le produit au localstorages (panier)
 * @returns 
 */
const addToCart = () => {
    let product = {
        id: getItemID('id'),
        quantity: document.getElementById("quantity").value,
        color: document.getElementById("colors").value
    }
    if (product.quantity < 1 || product.color === "") {
        window.alert("Veuillez remplir correctement les champs");
        return
    }
    addToLocalStorage(product);
}

/**
 * Vérifie si le produit est déjà dans le panier ou non
 * @param {*} obj 
 * @param {*} products 
 * @returns 
 */
const isProductInCart = (obj, products) => {
    let isInCart = false;
    products.forEach(element => {
        if (obj.id === element.id && obj.color === element.color) {
            isInCart = true;
            return
        }
    });
    return isInCart;
}

/**
 * Ajout du produit dans le local storage
 * @param {*} obj 
 */
const addToLocalStorage = (obj) => {
    let products = [];
    if (localStorage.getItem("products")) {
        let string = localStorage.getItem("products");
        products = JSON.parse(string);
        if (!isProductInCart(obj, products)) {
            products.push(obj);
        } else {
            let product = products.find(element => element.id === obj.id && element.color === obj.color)
            product.quantity = parseInt(product.quantity)
            product.quantity += parseInt(obj.quantity)
        }
    } else {
        products.push(obj);
    }

    let string = JSON.stringify(products)
    localStorage.setItem("products", string);
}


// Execution du script
if (getItemID('id')) {
    fetch(`http://localhost:3000/api/products/${getItemID('id')}`)
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        })
        .then(res => {
            //renderProduct(res);
            setElementsValue(res)
            document.getElementById("addToCart").addEventListener("click", () => {
                addToCart()
            })
        })
        .catch(err => console.log(err));
}