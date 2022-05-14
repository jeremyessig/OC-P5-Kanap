const orderId = document.getElementById('orderId');

const getItemID = (urlParam) => {
    let url = new URL (window.location.href)
    let search_params = new URLSearchParams(url.search); 
    if(search_params.has(urlParam)) {
      return search_params.get(urlParam);
    }
}

orderId.textContent = getItemID('orderId');