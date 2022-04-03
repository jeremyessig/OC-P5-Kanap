const getItemID = () => {
    let url = new URL (window.location.href)
    let search_params = new URLSearchParams(url.search); 
    if(search_params.has('id')) {
      return search_params.get('id');
    }
}

if(getItemID()){
    fetch(`http://localhost:3000/api/products/${getItemID()}`)
    .then(res => {
        if (res.ok) {
            return res.json();
        }
    })
    .then(res => {
        console.log(res);
    }
        )
    //.then(() => renderItems())
    .catch(err => console.log(err));
}