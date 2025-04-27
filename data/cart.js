export let cart = [
  {
    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
  },
  {
    id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
  },
];

export function addToCart(productId, quantitySelected) {
  let matchinItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchinItem = cartItem;
    }
  });

  if (matchinItem) {
    matchinItem.quantity += quantitySelected;
  } else {
    cart.push({
      productId,
      quantity: quantitySelected,
    });
  }
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;
}
