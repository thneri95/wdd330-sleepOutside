import { getParam, loadHeaderFooter, updateCartItemCount } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

export function normalizeCartItems(items) {
  if (Array.isArray(items)) {
    return items;
  }

  return items ? [items] : [];
}

const productId = getParam("product");
const dataSource = new ProductData();

async function init() {
  await loadHeaderFooter();
  const product = new ProductDetails(productId, dataSource);
  await product.init();
  updateCartItemCount();
}

init();
