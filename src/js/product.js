import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

export function normalizeCartItems(cartItems) {
  if (Array.isArray(cartItems)) {
    return cartItems;
  }

  return cartItems ? [cartItems] : [];
}

// Add a product to the shopping cart
function addProductToCart(product) {
  const cartItems = normalizeCartItems(getLocalStorage("so-cart"));
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
}

// Add to Cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// Add listener to Add to Cart button
const addToCartButton = document.getElementById("addToCart");

if (addToCartButton) {
  addToCartButton.addEventListener("click", addToCartHandler);
}