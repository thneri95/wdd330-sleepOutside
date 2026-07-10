import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.js";
import { updateCartItemCount } from "./utils.mjs";

const dataSource = new ProductData("tents");
const listElement = document.querySelector(".products");
const mainElement = document.querySelector("main");

const alertList = new Alert("/json/alerts.json", mainElement);
alertList.init();

const productList = new ProductList("tents", dataSource, listElement);
productList.init();
updateCartItemCount();
