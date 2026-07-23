import {
  getLocalStorage,
  loadHeaderFooter,
  setLocalStorage,
  updateCartItemCount,
} from "./utils.mjs";

function normalizeCartItems(items) {
  if (Array.isArray(items)) {
    return items;
  }
  return items ? [items] : [];
}

function renderCartContents() {
  const cartItems = normalizeCartItems(getLocalStorage("so-cart"));
  const cartList = document.querySelector(".product-list");

  if (!cartItems.length) {
    cartList.innerHTML = "<li class=\"cart-empty\">Your cart is empty.</li>";
    toggleCartFooter(cartItems);
    updateCartItemCount();
    return;
  }

  const htmlItems = cartItems.map((item, index) =>
    cartItemTemplate(item, index),
  );
  cartList.innerHTML = htmlItems.join("");

  addRemoveFromCartListeners();
  toggleCartFooter(cartItems);
  updateCartItemCount();
}

function cartItemTemplate(item, index) {
  const productUrl = `/product_pages/?product=${item.Id}`;
  const productImage =
    item.Images?.PrimarySmall || item.Images?.PrimaryMedium || item.Image || "";
  const colorName = item.Colors?.[0]?.ColorName || "";

  const newItem = `<li class="cart-card divider">
  <button class="cart-card__remove" data-id="${item.Id}" data-index="${index}" aria-label="Remove ${item.Name} from cart">X</button>
  <a href="${productUrl}" class="cart-card__image" aria-label="View ${item.Name}">
    <img
      src="${productImage}"
      alt="${item.Name}"
    />
  </a>
  <a href="${productUrl}" aria-label="View ${item.Name}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${colorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function addRemoveFromCartListeners() {
  const removeButtons = document.querySelectorAll(".cart-card__remove");
  removeButtons.forEach((button) => {
    button.addEventListener("click", handleRemoveFromCart);
  });
}

function handleRemoveFromCart(event) {
  const productId = event.currentTarget.dataset.id;
  const removeIndex = Number(event.currentTarget.dataset.index);
  const cartItems = normalizeCartItems(getLocalStorage("so-cart"));

  if (Number.isInteger(removeIndex) && removeIndex >= 0) {
    cartItems.splice(removeIndex, 1);
  } else {
    const updatedCart = cartItems.filter(
      (item) => String(item.Id) !== String(productId),
    );
    setLocalStorage("so-cart", updatedCart);
    renderCartContents();
    return;
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

function toggleCartFooter(cartItems) {
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotalElement = document.querySelector(".cart-total");

  if (!cartFooter || !cartTotalElement) {
    return;
  }

  if (!cartItems.length) {
    cartFooter.classList.add("hide");
    cartTotalElement.textContent = "Total: $0.00";
    return;
  }

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.FinalPrice || 0),
    0,
  );
  cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
  cartFooter.classList.remove("hide");
}

async function init() {
  await loadHeaderFooter();
  renderCartContents();
}

init();
