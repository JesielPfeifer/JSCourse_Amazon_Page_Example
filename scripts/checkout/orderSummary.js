import {
  cart,
  removeFromCart,
  getCartQuantity,
  updateCartQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let cartSummaryHTML = "";

  function showCartQuantity() {
    document.querySelector(
      ".js-cart-quantity"
    ).innerHTML = `Checkout (${getCartQuantity()} items)`;
  }

  cart.forEach((cartItem) => {
    showCartQuantity();
    const productId = cartItem.id;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `
    <div class="cart-item-container 
    js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">Delivery date: ${dateString}</div>
        <div class="cart-item-details-grid">
          <img
            class="product-image"
            src="${matchingProduct.image}"
            />

            <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">$${formatCurrency(
              matchingProduct.priceCents
            )}</div>
            <div class="product-quantity">
                <span>
                Quantity: <span class="quantity-label js-quantity-label-${
                  matchingProduct.id
                }">${cartItem.quantity}</span>
                </span>
                <span 
                  class="update-quantity-link link-primary js-update-link" 
                  data-product-id="${matchingProduct.id}">
                    Update
                </span>
                <input class="quantity-input js-quantity-input">
                <span class="save-quantity-link link-primary js-save-link" data-product-id="${
                  matchingProduct.id
                }">Save</span>
                <span class="delete-quantity-link link-primary js-delete-link" 
                data-product-id="${matchingProduct.id}">
                  Delete</span>
            </div>
            </div>

            <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
            </div>
          </div>
        </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");

      const dateString = deliveryDate.format("dddd, MMMM D");
      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
      <div class="delivery-option 
        js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? "checked" : ""}
            class="delivery-option-input" 
            name="delivery-option-${matchingProduct.id}"/>
          <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${priceString} Shipping
          </div>
        </div>
      </div>
        `;
    });
    return html;
  }

  // load itens on cart
  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  // delete itens from cart
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      showCartQuantity();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  // update quantity on cart
  document.querySelectorAll(".js-update-link").forEach((update) => {
    update.addEventListener("click", () => {
      const productId = update.dataset.productId;

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.add("is-editing-quantity");
    });
  });

  // save quantity on cart
  document.querySelectorAll(".js-save-link").forEach((save) => {
    save.addEventListener("click", () => {
      const productId = save.dataset.productId;

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.remove("is-editing-quantity");
      const newQuantityValue = Number(
        document.querySelector(".js-quantity-input").value
      );
      updateCartQuantity(productId, newQuantityValue);
      showCartQuantity();
      const quantityLabel = document.querySelector(
        `.js-quantity-label-${productId}`
      );
      quantityLabel.innerHTML = newQuantityValue;
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
