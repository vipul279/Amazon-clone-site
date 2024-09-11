

let storedCartItems = localStorage.getItem('cartItems');
console.log(storedCartItems);
export let cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
console.log(cartItems)



export const removefromcart=(prodId)=>{
    let newcart=[];

    cartItems.forEach((item)=>{
        if(item.prodId!==prodId){
            console.log("not matched")
            newcart.push(item);
        }
    })

    cartItems=newcart;

}

export function savetoStorage(){
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

export const updateDeliveryOption=(productId,deliveryOptionId)=>{
    
    cartItems.forEach((item)=>{
        
        console.log("entered function")
        if(productId===item.productId){
            item.deliveryOptionId=deliveryOptionId;
        }
    })


    console.log(deliveryOptionId);

    savetoStorage();
}