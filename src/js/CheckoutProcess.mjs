import ExternalServices from "./ExternalServices.mjs";
import { alertMessage, getLocalStorage, setLocalStorage } from "./utils.mjs";

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: Number(item.FinalPrice || 0),
    quantity: Number(item.quantity || 1),
  }));
}

function getErrorMessages(error) {
  if (error?.name === "servicesError") {
    const details = error.message;

    if (Array.isArray(details)) {
      return details.map(String);
    }

    if (typeof details === "string") {
      return [details];
    }

    if (details && typeof details === "object") {
      if (typeof details.message === "string") {
        return [details.message];
      }

      return Object.values(details).flatMap((value) => {
        if (Array.isArray(value)) {
          return value.map(String);
        }

        if (typeof value === "string" || typeof value === "number") {
          return [String(value)];
        }

        return [];
      });
    }
  }

  return ["Sorry, your order could not be submitted. Please check your details and try again."];
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
    if (!this.list.length) {
      alertMessage("Your cart is empty. Add at least one item before checking out.");
      return null;
    }

    const formData = new FormData(form);
    const order = Object.fromEntries(formData.entries());
    order.orderDate = new Date().toISOString();
    order.items = packageItems(this.list);
    order.orderTotal = this.orderTotal.toFixed(2);
    order.shipping = this.shipping;
    order.tax = this.tax.toFixed(2);

    try {
      const response = await this.services.checkout(order);
      setLocalStorage(this.key, []);
      window.location.assign("/checkout/success.html");
      return response;
    } catch (error) {
      const messages = getErrorMessages(error);
      alertMessage(messages);
      return null;
    }
  }
}
