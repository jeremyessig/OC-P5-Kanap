// Variables
const section = document.querySelector("section")


// Fonctions 
const getItemID = () => {
    let url = new URL (window.location.href)
    let search_params = new URLSearchParams(url.search); 
    if(search_params.has('id')) {
      return search_params.get('id');
    }
}

const renderColorList = (list) =>{
    let html = "";
    list.forEach(element => {
        html += `<option value="${element}">${element}</option>`
    });
    return html
}

const renderProduct = (product) =>{
    console.log(product)
    section.innerHTML = `
    <article>
            <div class="item__img">
              <img src="${product.imageUrl}" alt="Photographie d'un canapé">
            </div>
            <div class="item__content">

              <div class="item__content__titlePrice">
                <h1 id="title">${product.name}</h1>
                <p>Prix : <span id="price">${product.price}</span>€</p>
              </div>

              <div class="item__content__description">
                <p class="item__content__description__title">Description :</p>
                <p id="description">${product.description}</p>
              </div>

              <div class="item__content__settings">
                <div class="item__content__settings__color">
                  <label for="color-select">Choisir une couleur :</label>
                  <select name="color-select" id="colors">
                      <option value="">--SVP, choisissez une couleur --</option>
                      ${renderColorList(product.colors)}
                  </select>
                </div>

                <div class="item__content__settings__quantity">
                  <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
                  <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
                </div>
              </div>

              <div class="item__content__addButton">
                <button id="addToCart">Ajouter au panier</button>
              </div>

            </div>
          </article>
    `
}


// récupère l'id, la quantité, la couleur
const addToCart = () =>{
    let product = {
        id: getItemID(),
        quantity: document.getElementById("quantity").value,
        color: document.getElementById("colors").value
    }
    if(product.quantity < 1 || product.color === ""){
        window.alert("Veuillez remplir correctement les champs");
        return
    }
    addToLocalStorage(product);
}


const isProductInCart = (product, productInCart) =>{
    if(JSON.stringify(product) === JSON.stringify(productInCart)){
        return true;
    }
    return false;
}


const addToLocalStorage = (obj) =>{
    let isInCart = false;
    let products = [];
    if(localStorage.getItem("products")){
        let string = localStorage.getItem("products");
        products = JSON.parse(string);
        products.forEach(element => {
            if(isProductInCart(obj, element)){
                isInCart = true;
                return
            }
        });
        if (!isInCart) {
            products.push(obj);
        }else{
            window.alert("Ce produit est déjà dans votre panier");
            return
        }
    }else{
        products.push(obj);
    }

    let string = JSON.stringify(products)
    localStorage.setItem("products", string);
}


// Execution du script
if(getItemID()){
    fetch(`http://localhost:3000/api/products/${getItemID()}`)
    .then(res => {
        if (res.ok) {
            return res.json();
        }
    })
    .then(res => {
        renderProduct(res);
        document.getElementById("addToCart").addEventListener("click", ()=>{
            addToCart()
        })
    })
    .catch(err => console.log(err));
}