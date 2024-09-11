import { products } from './product.js';
import { cartItems , savetoStorage } from './cart.js';

console.log(products);
let productsHtml = '';

// Render products
products.forEach((product) => {
    productsHtml += `
        <div class="product-container">
            <div class="product-image-container">
                <img src="${product.image}" class="product-image">
            </div>

            <div class="product-text">
                ${product.name}          
            </div>

            <div class="product-rating">
                <img src="images/ratings/rating-${product.rating.stars * 10}.png" class="product-rating-image" alt="">
                <span class="product-rating-counts">${product.rating.count}</span>
            </div>

            <div class="product-price">$ ${(product.priceCents / 100).toFixed(2)}</div>

            <div class="product-quantity-container">
                <select name="" class="product-quantity">
                    <option selected value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
            </div>

            <div class="extraspace"></div>
     
            <div class="added-to-cart-text">
                <img src="images/icons/checkmark.png" height="20px" style="margin-right: 5px;"> Added 
            </div>

            <div class="product-add-to-cart-container">
                <button class="product-add-to-cart" data-product-id="${product.id}">Add to cart</button>
            </div>
        </div>`;
});

document.querySelector('.js-prods').innerHTML = productsHtml;


    let cartItemsQuantityElement = document.querySelector('.cart-quantity');

    cartItemsQuantityElement.textContent=localStorage.getItem('totalquantity')
    

    const toggleButton = document.querySelector('.toggle-option');
    const mobilesection = document.querySelector('.mobile-section');
    
    // Handle toggle button click
    toggleButton.addEventListener('click', () => {
        mobilesection.classList.toggle('clicked-toggle');
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // If screen width is larger than 575px, hide the mobile section
        if (window.innerWidth > 575) {
            mobilesection.classList.remove('clicked-toggle');
        }
    });
    

        // Get the search bar and items list
    const searchBar = document.querySelector('.search-box');
    const productContainers=document.querySelectorAll('.product-container')
    // Add event listener to the search bar
    searchBar.addEventListener('input', ()=>{

        const searchTerm=searchBar.value.toLowerCase();
        console.log(searchTerm)

        products.forEach((product, index) => {
            const productName = product.name.toLowerCase();
    
            const productContainer = productContainers[index]; // Access the corresponding product container

        // Show or hide the product container based on the search term
        if (!productName.includes(searchTerm)) {
            console.log("found"+productName)
            productContainer.classList.remove('product-container')
            productContainer.classList.add('product-container-remove'); // Hide the product
        } 
        else{
            productContainer.classList.add('product-container')
            productContainer.classList.remove('product-container-remove')
        }
        });

    });






let addToCartButtons = document.querySelectorAll('.product-add-to-cart');

addToCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
  
        // Find the parent container of the clicked button
        const productContainer = button.closest('.product-container');
        
        // Locate the select element for quantity within the same container
        const quantitySelect = productContainer.querySelector('.product-quantity');
         
        // Get the selected quantity value
        const selectedQuantity = parseInt(quantitySelect.value);

        // Update the cart quantity
        let cartItemsQuantityElement = document.querySelector('.cart-quantity');
        let currentCartItemsQuantity = parseInt(cartItemsQuantityElement.textContent) || 0; // Default to 0 if no value present
        cartItemsQuantityElement.textContent = currentCartItemsQuantity + selectedQuantity; // Add the new quantity to the existing total
        
        // Save updated cart quantity to localStorage
        localStorage.setItem('cartQuantity', cartItemsQuantityElement.textContent);

        const prodId = button.dataset.productId;
        let matchingItem = null;

        // Check if the product is already in the cart
        cartItems.forEach((item) => {
            if (prodId === item.productId) {
                matchingItem = item;
            }
        });

        // If a matching item is found, update its quantity
        if (matchingItem) {
            matchingItem.quantity += selectedQuantity;
        } else {
            // If no matching item is found, add a new item to the cart
            cartItems.push({
                productId: prodId,
                quantity: selectedQuantity,
                deliveryOptionId:'1'
            });
        }

        // After updating the cartItems array
        savetoStorage();

        console.log(JSON.stringify(cartItems));
         
        // Get the corresponding 'added-to-cartitems-text' element
        const addedText = productContainer.querySelector('.added-to-cart-text');
        
        // Add the class to show the added success message
        addedText.classList.add('added-success');
        
        // Remove the class after a timeout
        setTimeout(() => {
            addedText.classList.remove('added-success');
        }, 2500); // 2.5 seconds
    });
});

let quantitySelectors = document.querySelectorAll('.product-quantity');

quantitySelectors.forEach((selector) => {
    selector.addEventListener('focus', () => {
        selector.classList.add('quantity-bg');
    });
    selector.addEventListener('blur', () => {
        selector.classList.remove('quantity-bg');
    });
});
