import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.js";
import { loadHeaderFooter } from "./utils.mjs";

const dataSource = new ProductData("tents");
const listElement = document.querySelector(".products");
const mainElement = document.querySelector("main");

const alertList = new Alert("/json/alerts.json", mainElement);

async function init() {
  await loadHeaderFooter();
  alertList.init();

  const productList = new ProductList("tents", dataSource, listElement);
  productList.init();
}

init();
