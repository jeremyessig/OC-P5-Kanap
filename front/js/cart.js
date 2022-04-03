const getCartFromLocalStorage = () =>{
    let string = localStorage.getItem("products");
    return JSON.parse(string);
}

//Retourne l'objet 
const getProductFromCart = (products) =>{
    let cart = [];
    let local = getCartFromLocalStorage();
    local.forEach(prod => {
        cart.push(products.find(element => element._id === prod.id));
    });

    return cart;
}

const renderItem = () =>{

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
})
.catch(err => console.log(err));
