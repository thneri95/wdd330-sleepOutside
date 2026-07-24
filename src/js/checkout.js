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
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const isValid = form.checkValidity();
      form.reportValidity();

      if (!isValid) {
        return;
      }

      if (!zipInput?.value.trim()) {
        form.reportValidity();
        return;
      }

      checkout.calculateOrderTotal();
      await checkout.checkout(form);
    });
  }
}

init();
