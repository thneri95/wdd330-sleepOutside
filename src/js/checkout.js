import CheckoutProcess from "./CheckoutProcess.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const checkout = new CheckoutProcess("so-cart", "#order-summary");

async function init() {
  await loadHeaderFooter();
  checkout.init();

  const zipInput = document.querySelector("#zip");
  if (zipInput) {
    zipInput.addEventListener("change", () => {
      if (zipInput.value.trim()) {
        checkout.calculateOrderTotal();
      }
    });
  }

  const form = document.querySelector("#checkout-form");
  const message = document.querySelector("#checkout-message");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      checkout.calculateOrderTotal();
      const response = await checkout.checkout(form);
      if (message) {
        message.textContent = response.message || "Order submitted successfully.";
      }
    });
  }
}

init();
