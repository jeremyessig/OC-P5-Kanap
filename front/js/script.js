const items = document.getElementById("items");
let products = [];


const renderItems = () => {
    if(products.length === 0){
        items.innerHTML = "<h2> Aucun résultat</h2>";
    }else{
        items.innerHTML = products
        .map((product) => {
            
            return `
            <a href="./product.html?id=${product._id}">
                <article>
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                  <h3 class="productName">${product.name}</h3>
                  <p class="productDescription">${product.description}</p>
                </article>
              </a>
            `
        }).join("");
    }
}

fetch('http://localhost:3000/api/products')
.then(res => {
    if (res.ok) {
        return res.json();
    }
})
.then(res => {
    console.log(res);
    products = res;
}
    )
.then(() => renderItems())
.catch(err => console.log(err));