const items = document.getElementById("cart__items");



const getCartFromLocalStorage = () =>{
    let string = localStorage.getItem("products");
    return JSON.parse(string);
}

//Retourne l'objet 
const getProductFromCart = (products) =>{
    let cart = [];
    let local = getCartFromLocalStorage();
    local.forEach(prod => {
        products.forEach(element => {
                if(element._id === prod.id){
                    let obj = {...element, 
                        quantity: parseInt(prod.quantity),
                        colorSelected: prod.color
                    }
                    cart.push(obj)
                }
        });
    });
    return cart;
}



const renderItem = (products) =>{

    if(products.length === 0){
        items.innerHTML = "<h2> Aucun résultat</h2>";
    }else{
        items.innerHTML = products
        .map((product) => {
            
            return `
            <article class="cart__item" data-id="{${product._id}}" data-color="{${product.colorSelected}}">
                <div class="cart__item__img">
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${product.colorSelected}</p>
                    <p>${product.price * product.quantity / 100} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
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


// Execution du script

fetch(`http://localhost:3000/api/products`)
.then(res => {
    if (res.ok) {
        return res.json();
    }
})
.then(res => {
    let productsInCart = getProductFromCart(res)
    console.log(productsInCart)
    renderItem(productsInCart)
})
.catch(err => console.log(err));
