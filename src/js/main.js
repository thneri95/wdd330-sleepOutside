import Alert from "./Alert.js";
import { loadHeaderFooter } from "./utils.mjs";

const mainElement = document.querySelector("main");
const alertList = new Alert("/json/alerts.json", mainElement);

async function init() {
  await loadHeaderFooter();
  alertList.init();
}

init();
