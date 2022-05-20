import { createElements } from "./utils.js";

const items = document.getElementById("items");
let products = [];

/**
 * Créé les différents éléments HTML
 * @param {*} elements 
 * @returns Object
 */

// const createElements = (elements) => {
//     let destructuring = {}
//     elements.forEach(element => {
//         const key = element
//         destructuring[key] = document.createElement(element);
//     })
//     return destructuring
// }


/**
 * Affiche tous les produits contenus dans le tableau products
 */
const renderItems = () => {
    if (products.length === 0) {
        items.innerHTML = "<h2> Aucun résultat</h2>";
    } else {
        products.forEach(product => {

            //const { a, article, img, h3, p } = createElements(["a", "article", "img", "h3", "p"]);
            const { a, article, img, h3, p } = createElements(["a", "article", "img", "h3", "p"]);

            [img, h3, p].forEach(htmlChild => article.appendChild(htmlChild));

            h3.classList.add('productName');
            h3.innerText = product.name;

            p.classList.add('productDescription');
            p.innerText = product.description

            a.appendChild(article);
            a.href = `./product.html?id=${product._id}`

            img.alt = product.altTxt
            img.src = product.imageUrl;

            items.appendChild(a);
        });
    }
}

/**
 * Récupère tous les produits auprès du serveur et stock ces produits dans le tableau products
 */
fetch('http://localhost:3000/api/products')
    .then(res => {
        if (res.ok) {
            return res.json();
        }
    })
    .then(res => {
        products = res;
    }
    )
    .then(() => renderItems())
    .catch(err => console.log(err));