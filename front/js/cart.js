//____________________Variables et constantes________________________________
const cartItems = document.getElementById("cart__items");
const totalPrice = document.getElementById("totalPrice");
const orderBtn = document.getElementById('order');

const firstNameField = document.getElementById('firstName');
const lastNameField = document.getElementById('lastName');
const addressField = document.getElementById('address');
const cityField = document.getElementById('city');
const emailField = document.getElementById('email');


let productsInCart = [];

//________________________ Fonctions___________________________________________

// Validation du formulaire de contact

/**
 * Vérifie si les champs sont valides
 * Sinon renvoie les erreurs 
 */
const isFormValid = () =>{
    let ok = true;
    let fields = [firstNameField, lastNameField, addressField, cityField, emailField];
    fields.forEach(field => {
        let errMsg = field.closest('div').querySelector('p');
        if (!field.value){
            errMsg.textContent = "Veuillez remplir ce champs";
            ok = false;
        }else if(field.value.length > 0 && (field.value.length < 3)){
            errMsg.textContent = "Veuillez entrer au minimum 3 caractères";
            ok = false;
        }else if (field === emailField && !field.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){
            errMsg.textContent = "Veuillez entrer une adresse e-mail valide";
            ok = false;
        }else if(!field.value.match(/^[a-zA-ZÀ-ÿ-0-9. ]*$/) && field !== emailField ){
            errMsg.textContent = "Les caractères spéciaux ne sont pas acceptés";
            ok = false;
        }else{
            errMsg.textContent = "";
        }
    });
    return ok
}

const getCustomerContact = () =>{
    return {
        firstName: firstNameField.value,
        lastName: lastNameField.value,
        address: addressField.value,
        city: cityField.value,
        email: emailField.value
    }
}

const getCartProductsID = () =>{
    let id = [];
    productsInCart.forEach(product => {
        id.push(product._id);
    })
    return id
}

const createOrder = () =>{
    return {
        contact: getCustomerContact(),
        products: getCartProductsID()
    }
}

const postOrderToServer = () =>{
    let bodyContent = JSON.stringify(createOrder());
    fetch(`http://localhost:3000/api/products/order`, {
        method: 'post',
        headers: { "Content-Type" : "application/json", "Content-Length": "<calculated when request is sent>"},
        body: bodyContent
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }
    })
    .then(res => {
        localStorage.removeItem('products');
        window.location.href = `confirmation.html?orderId=${res.orderId}`;
    })
    .catch(err => console.log(err));
}


// Afficahge et gestion des produits 

const getCartFromLocalStorage = () =>{
    if (localStorage.getItem("products") === null){
        return false
    }
    let string = localStorage.getItem("products");
    return JSON.parse(string);
}

/**
 * 
 * @param {array} products 
 * @returns {array}
 */
const getProductFromCart = (products) =>{
    let allProducts = [];
    let local = getCartFromLocalStorage();
    if (!local){
        return allProducts;
    }
    local.forEach(prod => {
        products.forEach(element => {
                if(element._id === prod.id){
                    let obj = {...element, 
                        quantity: parseInt(prod.quantity),
                        colorSelected: prod.color
                    }
                    allProducts.push(obj)
                }
        });
    });
    return allProducts;
}

/**
 * 
 * @param {Object} product 
 * @returns {Object}
 */
const newObjPorduct = (product) =>{
    let newProduct = {
        id: product._id,
        quantity: product.quantity,
        color: product.colorSelected
    }
    return newProduct
}


const updateLocalStorage = () =>{
    let productsToStringify = [];
    window.localStorage.removeItem('products');
    productsInCart.forEach(element => {
        productsToStringify.push(newObjPorduct(element));
    });

    let string = JSON.stringify(productsToStringify)
    localStorage.setItem("products", string);
}


const setProductQuantity = (id, color, quantity) =>{
    productsInCart.find(element => element._id === id && element.colorSelected === color).quantity = quantity;
    renderTotalPrice(productsInCart);
    updateLocalStorage();

}


const removeFromCart = (id, color) =>{
    delete productsInCart[
        productsInCart.indexOf(
            productsInCart.find(element => 
                element._id === id && 
                element.colorSelected === color
                )
            )
    ]
    updateLocalStorage();
    location.reload();
}


const formatToCurrency = amount => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };


const calculateTotalPrice = (products) => {
    let price = 0
    products.forEach(element => {
        price += parseInt(element.price) * parseInt(element.quantity)
    });
    price = price / 100;
    return formatToCurrency(price);
}


// Fonctions d'affichage et de rendu HTML

const renderTotalPrice = (products) =>{
    totalPrice.innerHTML = `
    ${calculateTotalPrice(products)}
    `
} 

const renderItem = (products) =>{

    if(products.length == 0){
        cartItems.innerHTML = "<h2> Aucun résultat</h2>";
    }else{
        cartItems.innerHTML = products
        .map((product) => {
            
            return `
            <article class="cart__item" data-id="${product._id}" data-color="${product.colorSelected}">
                <div class="cart__item__img">
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${product.colorSelected}</p>
                    <!--<p>${product.price * product.quantity / 100} €</p>-->
                    <p>${ formatToCurrency(product.price / 100)} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}" data-id="${product._id}" data-color="${product.colorSelected}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
                </div>
            </article>
        `
        }).join("");
    }
}



// ____________________________Execution du script________________________________________

fetch(`http://localhost:3000/api/products`)
.then(res => {
    if (res.ok) {
        return res.json();
    }
})
.then(res => {
    productsInCart = getProductFromCart(res)
    // console.log(productsInCart)
    // console.log(getCartProductsID())
    renderItem(productsInCart);
    renderTotalPrice(productsInCart);
    document.querySelectorAll('article').forEach(article => {
       article.querySelector('input').addEventListener('click', event => {
            event.preventDefault();
            setProductQuantity(
                article.getAttribute("data-id"), 
                article.getAttribute("data-color"), 
                article.querySelector('input').value);
        })
        article.querySelector('.deleteItem').addEventListener('click', event =>{
            event.preventDefault();
            removeFromCart(
                article.getAttribute("data-id"), 
                article.getAttribute("data-color") 
                );
        })
      })
    orderBtn.addEventListener('click', event =>{
        event.preventDefault();
        if(productsInCart.length === 0){
            window.alert("Votre panier est vide !")
            return
        }
        if(isFormValid()){
            postOrderToServer();
        }

    })
})
.catch(err => console.log(err));
