import ExternalServices from "./ExternalServices.mjs";
import { getLocalStorage } from "./utils.mjs";

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: Number(item.FinalPrice || 0),
    quantity: Number(item.quantity || 1),
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.services = new ExternalServices();
  }

  init() {
    const storedItems = getLocalStorage(this.key);
    this.list = Array.isArray(storedItems)
      ? storedItems
      : storedItems
        ? [storedItems]
        : [];
    this.calculateItemSubTotal();
    this.displayOrderTotals();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (sum, item) =>
        sum + Number(item.FinalPrice || 0) * Number(item.quantity || 1),
      0,
    );
    this.displayOrderTotals();
  }

  calculateOrderTotal() {
    const itemCount = this.list.reduce(
      (count, item) => count + Number(item.quantity || 1),
      0,
    );
    this.tax = this.itemTotal * 0.06;
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const subtotal = document.querySelector(`${this.outputSelector} #subtotal`);
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(
      `${this.outputSelector} #orderTotal`,
    );

    if (!subtotal || !tax || !shipping || !orderTotal) {
      return;
    }

    subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
    tax.innerText = `$${this.tax.toFixed(2)}`;
    shipping.innerText = `$${this.shipping.toFixed(2)}`;
    orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const formData = new FormData(form);
    const order = Object.fromEntries(formData.entries());
    order.orderDate = new Date().toISOString();
    order.items = packageItems(this.list);
    order.orderTotal = this.orderTotal.toFixed(2);
    order.shipping = this.shipping;
    order.tax = this.tax.toFixed(2);

    return this.services.checkout(order);
  }
}
