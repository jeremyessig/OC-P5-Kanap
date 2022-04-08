//____________________Variables et constantes________________________________
const cartItems = document.getElementById("cart__items");
const totalPrice = document.getElementById("totalPrice");
const orderBtn = document.getElementById('order');
let productsInCart = [];




//________________________ Fonctions___________________________________________

// Validation du formulaire de contact



// Afficahge et gestion des produits 

const getCartFromLocalStorage = () =>{
    let string = localStorage.getItem("products");
    return JSON.parse(string);
}

//Retourne l'objet 
const getProductFromCart = (products) =>{
    let productsInCart = [];
    let local = getCartFromLocalStorage();
    local.forEach(prod => {
        products.forEach(element => {
                if(element._id === prod.id){
                    let obj = {...element, 
                        quantity: parseInt(prod.quantity),
                        colorSelected: prod.color
                    }
                    productsInCart.push(obj)
                }
        });
    });
    return productsInCart;
}

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
    delete productsInCart[productsInCart.indexOf(productsInCart.find(element => element._id === id && element.colorSelected === color))]
    console.log(productsInCart)
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

const renderTotalPrice = (products) =>{
    totalPrice.innerHTML = `
    ${calculateTotalPrice(products)}
    `
} 

const renderItem = (products) =>{

    if(products.length === 0){
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
    //console.log(productsInCart)
    renderItem(productsInCart);
    renderTotalPrice(productsInCart);
    document.querySelectorAll('article').forEach(article => {
       article.querySelector('input').addEventListener('click', event => {
          setProductQuantity(
              article.getAttribute("data-id"), 
              article.getAttribute("data-color"), 
              article.querySelector('input').value);
        })
        article.querySelector('.deleteItem').addEventListener('click', event =>{
            removeFromCart(
                article.getAttribute("data-id"), 
                article.getAttribute("data-color") 
                );
        })
      })
})
.catch(err => console.log(err));
