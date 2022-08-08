const cart_items = document.querySelector('#cart .cart-items');


const parentNode = document.getElementById('music-content');


window.addEventListener('DOMContentLoaded', () => {
    console.log('data');

    axios.get('http://localhost:3000/products').then((data) => {
        console.log(data);
        if(data.request.status === 200) {
            const products = data.data.products;
            const parentSection = document.getElementById('Products');
            products.forEach(product => {
                const productHtml = `
                <div>
                    <h1>${product.title}</h1>
                    <img src=${product.imageUrl}></img>
                    <button onClick="addToCart(${product.id})"> Add To Cart </button>

                </div>`
                parentSection.innerHTML += productHtml;
            })
        }
        // products.data.forEach(product => {
        //     const productHtml = `
        //         <div id="album-${product.id}">
        //             <h3>${product.title}</h3>
        //             <div class="image-container">
        //                 <img class="prod-images" src=${product.imageUrl} alt="">
        //             </div>
        //                             <div class="prod-details">
        //                 <span>$<span>${product.price}</span></span>
        //                 <button class="shop-item-button" type='button'>ADD TO CART</button>
        //             </div>
        //         </div>`
        //     parentNode.innerHTML += productHtml

        // })
    })

})

function addToCart(productId){
    axios.post('http://localhost:3000/cart',{productId:productId})
    .then(response=>{
       if(response.status === 200){

        notifyUsers(response.data.message)

       }else{
        throw new Error(response.data.message);
       }
    })
    .catch((errMsg)=>{
        console.log(errMsg)
        notifyUsers(errMsg)

    })
}

function getCartDetails(){
    axios.get('http://localhost:3000/cart')
    .then(response=>{

        if(response.status === 200){
            response.data.products.forEach(product => {
                const cartContainer  =document.getElementById('cart')
                cartContainer.innerHTML += `<li>${product.title} - ${product.cartItem.quantity} - ${product.price}`

            })
            document.querySelector('#cart').style = "display:block;"
        }else{
            throw new Error('Something went wrong')
        }
        
        //console.log(response)
    })
    .catch(error=>{
        notifyUsers(error)
    })
}

function notifyUsers(message){
    const container = document.getElementById('container');
    const notification =  document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}<h4>`;
    container.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
    },2500)

}

document.addEventListener('click',(e)=>{

    if (e.target.className=='shop-item-button'){
        const prodId = Number(e.target.parentNode.parentNode.id.split('-')[1]);
        axios.post('http://localhost:3000/cart', { productId: prodId}).then(data => {
            if(data.data.error){
                throw new Error('Unable to add product');
            }
            showNotification(data.data.message, false);
        })
        .catch(err => {
            console.log(err);
            showNotification(err, true);
        });

    }
    if (e.target.className=='cart-btn-bottom' || e.target.className=='cart-bottom' || e.target.className=='cart-holder'){
        getCartDetails();
       /// document.querySelector('#cart').style = "display:block;"
        /*axios.get('http://localhost:3000/cart').then(carProducts => {
            showProductsInCart(carProducts.data);
            document.querySelector('#cart').style = "display:block;"

        })*/
    }
    if (e.target.className=='cancel'){
        document.querySelector('#cart').style = "display:none;"
    }
    if (e.target.className=='purchase-btn'){
        if (parseInt(document.querySelector('.cart-number').innerText) === 0){
            alert('You have Nothing in Cart , Add some products to purchase !');
            return
        }
        alert('This Feature is yet to be completed ')
    }
})

function showProductsInCart(listofproducts){
    cart_items.innerHTML = "";
    listofproducts.forEach(product => {
        const id = `album-${product.id}`;
        const name = document.querySelector(`#${id} h3`).innerText;
        const img_src = document.querySelector(`#${id} img`).src;
        const price = product.price;
        document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)+1
        const cart_item = document.createElement('div');
        cart_item.classList.add('cart-row');
        cart_item.setAttribute('id',`in-cart-${id}`);
        cart_item.innerHTML = `
        <span class='cart-item cart-column'>
        <img class='cart-img' src="${img_src}" alt="">
            <span>${name}</span>
        </span>
        <span class='cart-price cart-column'>${price}</span>
        <form onsubmit='deleteCartItem(event, ${product.id})' class='cart-quantity cart-column'>
            <input type="text" value="1">
            <button>REMOVE</button>
        </form>`
        cart_items.appendChild(cart_item)
    })
}
function deleteCartItem(e, prodId){
    e.preventDefault();
    axios.post('http://localhost:3000/cart-delete-item', {productId: prodId})
        .then(() => removeElementFromCartDom(prodId))
}

function showNotification(message, iserror){
    const container = document.getElementById('container');
    const notification = document.createElement('div');
    notification.style.backgroundColor = iserror ? 'red' : 'green';
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}<h4>`;
    container.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
    },2500)
}

function removeElementFromCartDom(prodId){
        document.getElementById(`in-cart-album-${prodId}`).remove();
        showNotification('Succesfuly removed product')
}

  