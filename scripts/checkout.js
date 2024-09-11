  import { cartItems , removefromcart, updateDeliveryOption } from "./cart.js";
  import { products } from "./product.js";
  import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
  import {deliveryOptions} from "./deliveryOptions.js";


  function renderOrderSummary(){

  // Retrieve cartItems from localStorage (already parsed as array)
  let storedCartItems = cartItems;
  console.log(storedCartItems);



  const deliveryOptionsHtml=(product,item)=>{

    let deliveryHtml='';

    deliveryOptions.forEach((deliveryOption)=>{

      const today=dayjs();
      const deliveryDate=today.add(deliveryOption.deliveryDays,'days');
      const dateString=deliveryDate.format('dddd,MMMM D');

      const priceString=deliveryOption.priceCents===0
      ? 'Free'
      : `$ ${deliveryOption.priceCents}-`

      const isChecked=deliveryOption.id===item.deliveryOptionId;

    deliveryHtml+= `
            <div class="delivery-option js-delivery-option" data-product-id='${product.id}' data-delivery-option-id=${deliveryOption.id}>
                    <input type="radio" 
                    ${isChecked ? 'checked' : ''}
                      class="delivery-option-input"
                      name="delivery-option-${product.id}">
                    <div>
                      <div class="delivery-option-date">
                        ${dateString}
                      </div>
                      <div class="delivery-option-price">
                        ${priceString} Shipping
                      </div>
                    </div>
            </div>
    `
    
    })

    
    return deliveryHtml
  }




  let cartSummaryHtml = '';

  storedCartItems.forEach(item => {
    // Find the corresponding product from products using productId
    let product = products.find(p => p.id === item.productId);


    const deliveryOptionnid=item.deliveryOptionId;

    let deliveryoption;

    deliveryOptions.forEach((option)=>{
      if(option.id===deliveryOptionnid){
        deliveryoption=option;
      }
    })


    const today=dayjs();
      const deliveryDate=today.add(deliveryoption.deliveryDays,'days');
      const dateString=deliveryDate.format('dddd,MMMM D');
      console.log(dateString)

    // If a matching product is found, use its data
    if (product) {
      cartSummaryHtml += `
        <div class="cart-item-container
            js-cart-item-container-${product.id}">
          <div class="delivery-date">
            Delivery date: ${dateString}
          </div>
          <div class="cart-item-details-grid">
            <img class="product-image" src="${product.image}" alt="${product.name}">
            <div class="cart-item-details" data-product-id="${product.id}">
              <div class="product-name">
                ${product.name}
              </div>
              <div class="product-price">
                $ ${(product.priceCents / 100).toFixed(2)}
              </div>
              <div class="product-quantity">
                <span>
                  Quantity: <span class="quantity-label">${item.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary">
                  Update
                </span>
                <span class="update-quantity">
                  <input type='number' min="0" max="50" class='quantity-input'>
                </span>
                <span class="save-quantity-link link-primary">
                  Save
                </span>
                <span class="delete-quantity-link link-primary" data-product-id="${product.id}">
                  Delete
                </span>
              </div>
            </div>
        



        <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  
                    ${deliveryOptionsHtml(product,item)}
                </div>
              </div>
            </div>
      `;
    }


  });




  window.onload = function() {
    changeinquant();
  };


  // Inject the generated HTML into the checkout grid
  document.querySelector('.cart-summary').innerHTML = cartSummaryHtml;



  let updateitems=document.querySelectorAll('.update-quantity-link');
  let deleteitems=document.querySelectorAll('.delete-quantity-link');

  // When "Update" is clicked, show the input field with the current quantity
  updateitems.forEach((updatethis) => {
    updatethis.addEventListener('click', () => {
      const parentContainer = updatethis.closest('.cart-item-details');

      // Show the update quantity input and save link
      const updateQuantity = parentContainer.querySelector('.quantity-input');
      const quantityLabel = parentContainer.querySelector('.quantity-label');
      const saveQuantityLink = parentContainer.querySelector('.save-quantity-link');

      // Pre-fill the input field with the current quantity from the quantity-label
      updateQuantity.value = quantityLabel.textContent.trim();

      quantityLabel.classList.add('quantity-hidden');
      updateQuantity.classList.add('quantity-inputfield-displayed');
      saveQuantityLink.classList.add('save-displayed');

      updatethis.classList.add('clicked-update');
    });
  });

  let savequantity=document.querySelectorAll('.save-quantity-link');
  // When "Save" is clicked, update the quantity-label with the input value
  savequantity.forEach((savethis) => {
    savethis.addEventListener('click', () => {
      const parentContainer = savethis.closest('.cart-item-details');

      const quantityInput = parentContainer.querySelector('.quantity-input');
      const quantityLabel = parentContainer.querySelector('.quantity-label');

      // Get the input value from the input field
      const inputValue = parseInt (quantityInput.value);
      localStorage.setItem('eachitemquant',inputValue);



      const thisprodId=parentContainer.dataset.productId;
      let eachitemquant = parseInt(localStorage.getItem('eachitemquant'));

      // Now update the quantity in storedCartItems using eachitemquant
      if (eachitemquant && !isNaN(eachitemquant)) {
        storedCartItems.forEach(item => {
          // Assuming productId is available to match the correct item
          if (item.productId === thisprodId) {
            item.quantity = eachitemquant;
          }
        });


      // Check if the quantity is zero
      if (inputValue === 0) {
      // Get product ID from data-product-id on delete link
      const productId = parentContainer.querySelector('.delete-quantity-link').dataset.productId;
        deleteitem(productId);
      } else {


        // Update the quantity label with the new value
        quantityLabel.textContent = inputValue;

        // Hide the input field and show the updated quantity label
        const updateVal = parentContainer.querySelector('.update-quantity-link');
        updateVal.classList.remove('clicked-update');


        // Save the updated cartItems array to localStorage
        localStorage.setItem('cartItems', JSON.stringify(storedCartItems));

        savethis.classList.remove('save-displayed');
        quantityInput.classList.remove('quantity-inputfield-displayed');
        quantityLabel.classList.remove('quantity-hidden');

        changeinquant(); // Update the total quantity
        updatePaymentSummary();
      }
    };
  })
  })
  ;



  let changeinquant=()=>{
      
    let totalquantity=0;

    let quantityofeach=document.querySelectorAll('.quantity-label');


      quantityofeach.forEach((item)=>{

        let quantity=item.textContent;
        // Check for empty or invalid quantities and default to 0 if necessary
        let value = parseInt(quantity);
        console.log("quantity"+quantity)
        if (isNaN(value)) {
          value = 0; // If NaN, treat it as 0
        }
        totalquantity+=value;
        console.log(totalquantity);
        

        

        
      })
      if(totalquantity===0){
        console.log('empty')
        const alldeleted=document.querySelector('.empty-cart');
        alldeleted.classList.add('show-empty')
      }

      document.querySelector('.checkoutquant').innerHTML=totalquantity;
      document.querySelector('.paymentsidequantity').innerHTML=totalquantity

      localStorage.setItem('totalquantity',totalquantity)

      updatePaymentSummary();

  };



  // Delete item function
  const deleteitem = (prodid) => {
    const updatedCartItems = cartItems.filter(item => item.productId !== prodid);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    cartItems.length = 0;
    cartItems.push(...updatedCartItems);

    const container = document.querySelector(`.js-cart-item-container-${prodid}`);
    if (container) {
      container.remove();
    }

    changeinquant(); // Update total quantity
  };

  // Set up delete functionality for delete links
  document.querySelectorAll('.delete-quantity-link').forEach((thisitem) => {
    thisitem.addEventListener('click', () => {
      const prodid = thisitem.dataset.productId;
      deleteitem(prodid);
      updatePaymentSummary();
      changeinquant();
    });
  });


  document.querySelectorAll('.js-delivery-option').forEach((element)=>{
    element.addEventListener('click',()=>{
      console.log(element)
      console.log('clicked')
      const {productId,deliveryOptionId}=element.dataset;
      console.log(deliveryOptionId)
      updateDeliveryOption(productId,deliveryOptionId);

      renderOrderSummary();
      updatePaymentSummary();
      changeinquant();

    })

  })



  let paymentsummary='';
  paymentsummary+=`
  <div class="payment-summary-title">
              Order Summary
            </div>

            <div class="payment-summary-row">
              <div>Items (<span id="totalitems" style="color: rgb(0,113,133);"><span class="paymentsidequantity"></span></span>):</div>
              <div class="payment-summary-money">$0.00</div>
            </div>

            <div class="payment-summary-row">
              <div>Shipping &amp; handling:</div>
              <div class="shipping-summary-money">$0.00</div>
            </div>

            <div class="payment-summary-row subtotal-row">
              <div>Total before tax:</div>
              <div class="total-before-tax-summary-money">$0.00</div>
            </div>

            <div class="payment-summary-row">
              <div>Estimated tax (10%):</div>
              <div class="tenpercent">$0.00</div>
            </div>

            <div class="payment-summary-row total-row">
              <div>Order total:</div>
              <div class="grandtotal">$0.00</div>
            </div>

            <a href="orderplaced.html">
              <button class="place-order-button button-primary">
              Place your order
            </button>
            </a>
          </div>
        </div>
  `
  document.querySelector('.payment-summary').innerHTML = paymentsummary; // Insert the payment summary


// Update payment summary when quantities change
function updatePaymentSummary() {
  let price = 0;
  let shippingprice = 0;

  storedCartItems.forEach((item) => {
    let product = products.find(p => p.id === item.productId);
    const priceofone = (product.priceCents / 100).toFixed(2);
    price += priceofone * item.quantity;

    let deliveryOptionId = item.deliveryOptionId;
    let deliveryOption;
    deliveryOptions.forEach(option => {
      if (option.id == deliveryOptionId) {
        deliveryOption = option;
      }
    });

    shippingprice += deliveryOption.priceCents;
  });

  // Update payment summary values
  document.querySelector('.payment-summary-money').textContent = price.toFixed(2);
  document.querySelector('.shipping-summary-money').textContent = shippingprice;

  let totalwithouttax = parseFloat(price.toFixed(2)) + parseFloat(shippingprice);
  document.querySelector('.total-before-tax-summary-money').textContent = totalwithouttax.toFixed(2);

  let tenpercent = totalwithouttax / 10;
  document.querySelector('.tenpercent').textContent = tenpercent.toFixed(2);

  let grandtotal = totalwithouttax + tenpercent;
  document.querySelector('.grandtotal').textContent = grandtotal.toFixed(2);
}



  }

  renderOrderSummary();
  document.querySelector('.payment-summary').innerHTML = paymentsummary; // Insert the payment summary

  updatePaymentSummary();
