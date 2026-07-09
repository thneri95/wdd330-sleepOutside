import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

const dataSource = new ProductData("tents");
const listElement = document.querySelector(".products");

const productList = new ProductList("tents", dataSource, listElement);
productList.init();
