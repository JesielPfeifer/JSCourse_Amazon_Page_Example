export let cart = JSON.parse(localStorage.getItem("cart"));

if (!cart) {
  cart = [
    {
      id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
      deliveryOptionId: "1",
    },
    {
      id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
      deliveryOptionId: "2",
    },
  ];
}

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function getCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

export function updateCartQuantity(productId, newQuantity) {
  cart.forEach((cartItem) => {
    if (productId === cartItem.id) {
      cartItem.quantity = newQuantity;
    }
  });
  saveToStorage();
}

export function addToCart(productId, quantitySelected) {
  let matchinItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.id) {
      matchinItem = cartItem;
    }
  });

  if (matchinItem) {
    matchinItem.quantity += quantitySelected;
  } else {
    cart.push({
      id: productId,
      quantity: quantitySelected,
      deliveryOptionId: "1",
    });
  }
  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.id !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchinItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.id) {
      matchinItem = cartItem;
    }
  });

  matchinItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}
