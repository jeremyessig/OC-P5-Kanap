//____________________Variables et constantes________________________________
const cartItems = document.getElementById("cart__items");
const totalPrice = document.getElementById("totalPrice");
const orderBtn = document.getElementById('order');
const totalQuantity = document.getElementById('totalQuantity');

const firstNameField = document.getElementById('firstName');
const lastNameField = document.getElementById('lastName');
const addressField = document.getElementById('address');
const cityField = document.getElementById('city');
const emailField = document.getElementById('email');


let productsInCart = [];



//________________________ Fonctions___________________________________________
/**
 * Créé les différents éléments HTML
 * @param {*} elements 
 * @returns Object
 */
const createElements = (elements) => {
    let destructuring = {}
    elements.forEach(element => {
        const [key, html] = element.split(':')
        destructuring[key] = document.createElement(html);
    })
    return destructuring;
}
// Validation du formulaire de contact

/**
 * Vérifie si les champs sont valides
 * Sinon renvoie les erreurs 
 */
const isFormValid = () => {
    let ok = true;
    let fields = [firstNameField, lastNameField, addressField, cityField, emailField];
    fields.forEach(field => {
        let errMsg = field.closest('div').querySelector('p');
        if (!field.value) {
            errMsg.textContent = "Veuillez remplir ce champs";
            ok = false;
        } else if (field.value.length > 0 && (field.value.length < 3)) {
            errMsg.textContent = "Veuillez entrer au minimum 3 caractères";
            ok = false;
        } else if (field === emailField && !field.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
            errMsg.textContent = "Veuillez entrer une adresse e-mail valide";
            ok = false;
        } else if (!field.value.match(/^[a-zA-ZÀ-ÿ-0-9. ]*$/) && field !== emailField) {
            errMsg.textContent = "Les caractères spéciaux ne sont pas acceptés";
            ok = false;
        } else {
            errMsg.textContent = "";
        }
    });
    return ok
}

/**
 * Renvoie les informations du client sous forme d'objet
 * @returns 
 */

const getCustomerContact = () => {
    return {
        firstName: firstNameField.value,
        lastName: lastNameField.value,
        address: addressField.value,
        city: cityField.value,
        email: emailField.value
    }
}


/**
 * Renvoie un tableau des ID des produits dans le panier 
 * @returns 
 */
const getCartProductsID = () => {
    let id = [];
    productsInCart.forEach(product => {
        id.push(product._id);
    })
    return id
}


/**
 * Revnoie un objet contenant les informations de contact du client et ses achats
 * @returns 
 */

const createOrder = () => {
    return {
        contact: getCustomerContact(),
        products: getCartProductsID()
    }
}


/**
 * Passe la commande auprès du serveur et redirige l'internaute sur la page de confirmation
 */
const postOrderToServer = () => {
    let bodyContent = JSON.stringify(createOrder());
    fetch(`http://localhost:3000/api/products/order`, {
        method: 'post',
        headers: { "Content-Type": "application/json", "Content-Length": "<calculated when request is sent>" },
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


/**
 * Renvoie les objets contenu dans le localstorage
 * @returns 
 */

const getCartFromLocalStorage = () => {
    if (localStorage.getItem("products") === null) {
        return false
    }
    let string = localStorage.getItem("products");
    return JSON.parse(string);
}

/**
 * Compare les produits du localstorage avec la base de données 
 * Retourne les produits que l'utilisateur à dans son localstorage
 * 
 * @param {array} products 
 * @returns {array}
 */
const getProductFromCart = (products) => {
    let allProducts = [];
    let local = getCartFromLocalStorage();
    if (!local) {
        return allProducts;
    }
    local.forEach(prod => {
        products.forEach(element => {
            if (element._id === prod.id) {
                let obj = {
                    ...element,
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
 * Renvoie un objet de type product
 * @param {Object} product 
 * @returns {Object}
 */
const newObjPorduct = (product) => {
    let newProduct = {
        id: product._id,
        quantity: product.quantity,
        color: product.colorSelected
    }
    return newProduct
}


/**
 * Met à jour le localstorage de l'utilisateur
 */
const updateLocalStorage = () => {
    let productsToStringify = [];
    window.localStorage.removeItem('products');
    productsInCart.forEach(element => {
        productsToStringify.push(newObjPorduct(element));
    });

    let string = JSON.stringify(productsToStringify)
    localStorage.setItem("products", string);
}


/**
 * Met à jour la quantité du produit
 * @param {*} id 
 * @param {*} color 
 * @param {*} quantity 
 */
const setProductQuantity = (id, color, quantity) => {
    productsInCart.find(element => element._id === id && element.colorSelected === color).quantity = quantity;
    renderTotalPrice(productsInCart);
    updateLocalStorage();

}


/**
 *  Supprime un produit du panier et recharge la page pour la mettre à jour
 * @param {*} id 
 * @param {*} color 
 */
const removeFromCart = (id, color) => {
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


/**
 * Retourne une somme formatée en euro
 * @param {*} amount 
 * @returns 
 */
const formatToCurrency = amount => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};


/**
 *  Renvoie le prix total des différents produits dans le panier
 * @param {*} products 
 * @returns 
 */
const calculateTotalPrice = (products) => {
    let price = 0
    products.forEach(element => {
        price += parseInt(element.price) * parseInt(element.quantity)
    });
    price = price / 100;
    return formatToCurrency(price);
}

const calculateTotalProductQuantity = (products) => {
    let quantity = 0;

    products.forEach(element => {
        quantity += parseInt(element.quantity)
    });

    return quantity;
}

// Fonctions d'affichage et de rendu HTML


/**
 *  Affiche le prix total en HTML
 * @param {*} products 
 */
const renderTotalPrice = (products) => {
    totalPrice.textContent = calculateTotalPrice(products);
    totalQuantity.textContent = calculateTotalProductQuantity(products);
}


/**
 * Crée tous les éléements de l'article
 * @param {*} products 
 */

const renderItem = (products) => {

    if (products.length == 0) {
        cartItems.innerHTML = "<h2> Aucun résultat</h2>";
    } else {
        //cartItems
        products.forEach(product => {

            const { article,
                cartItemImg,
                cartItemContent,
                cartItemContentDescription,
                cartItemContentSettings,
                img,
                h2,
                color,
                price,
                cartItemContentSettingsQuantity,
                quantity,
                itemQuantity,
                cartItemContentSettingsDelete,
                deleteItem

            } =
                createElements(["article:article",
                    "cartItemImg:div",
                    "cartItemContent:div",
                    "cartItemContentDescription:div",
                    "cartItemContentSettings:div",
                    "img:img",
                    "h2:h2",
                    "color:p",
                    "price:p",
                    "cartItemContentSettingsQuantity:div",
                    "quantity:p",
                    "itemQuantity:input",
                    "cartItemContentSettingsDelete",
                    "deleteItem:p"
                ]);


            [cartItemImg, cartItemContent].forEach(htmlChild => article.appendChild(htmlChild));

            [cartItemContentDescription, cartItemContentSettings].forEach(htmlChild => cartItemContent.appendChild(htmlChild));

            cartItemImg.classList.add('cart__item__img');
            cartItemContent.classList.add('cart__item__content');
            cartItemContentDescription.classList.add('cart__item__content__description');
            cartItemContentSettings.classList.add('cart__item__content__settings');

            cartItemImg.appendChild(img);
            img.src = product.imageUrl;
            img.alt = product.altTxt;

            cartItemContentDescription.appendChild(h2);
            h2.textContent = product.name;

            cartItemContentDescription.appendChild(color);
            color.textContent = product.colorSelected;

            cartItemContentDescription.appendChild(price);
            price.textContent = product.price / 100 + " €";


            cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);
            cartItemContentSettingsQuantity.classList.add('cart__item__content__settings__quantity');

            cartItemContentSettingsQuantity.appendChild(quantity);
            quantity.textContent = "Qté : ";

            cartItemContentSettingsQuantity.appendChild(itemQuantity);
            itemQuantity.classList.add('itemQuantity');
            itemQuantity.type = 'number';
            itemQuantity.name = 'itemQuantity';
            itemQuantity.min = '1';
            itemQuantity.max = '100';
            itemQuantity.valueAsNumber = product.quantity;

            cartItemContentSettings.appendChild(cartItemContentSettingsDelete);
            cartItemContentSettingsDelete.classList.add('cart__item__content__settings__delete');

            cartItemContentSettingsDelete.appendChild(deleteItem);
            deleteItem.classList.add("deleteItem");
            deleteItem.textContent = "Supprimer";

            article.classList.add('cart__item');
            article.dataset.id = product._id;
            article.dataset.color = product.colorSelected;
            cartItems.appendChild(article);
        });
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
            article.querySelector('.deleteItem').addEventListener('click', event => {
                event.preventDefault();
                removeFromCart(
                    article.getAttribute("data-id"),
                    article.getAttribute("data-color")
                );
            })
        })
        orderBtn.addEventListener('click', event => {
            event.preventDefault();
            if (productsInCart.length === 0) {
                window.alert("Votre panier est vide !")
                return
            }
            if (isFormValid()) {
                postOrderToServer();
            }

        })
    })
    .catch(err => console.log(err));
