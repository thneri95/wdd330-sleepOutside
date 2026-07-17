import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

function formatCategoryTitle(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function init() {
  await loadHeaderFooter();

  const category = getParam("category") || "tents";
  const titleElement = document.querySelector(".products-section h2");
  if (titleElement) {
    titleElement.textContent = `Top Products: ${formatCategoryTitle(category)}`;
  }

  const dataSource = new ProductData();
  const listElement = document.querySelector(".product-list");
  const productList = new ProductList(category, dataSource, listElement);
  await productList.init();
}

init();
