import { getParam, loadHeaderFooter, updateCartItemCount } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// Export the function for testing
export function normalizeCartItems(items) {
  // Your implementation here
  return items;
}

const productId = getParam("product");
const dataSource = new ProductData("tents");

async function init() {
  await loadHeaderFooter();
  const product = new ProductDetails(productId, dataSource);
  await product.init();
  updateCartItemCount();
}

init();
