// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function normalizeCartItems(cartItems) {
  if (Array.isArray(cartItems)) {
    return cartItems;
  }

  return cartItems ? [cartItems] : [];
}

export function updateCartItemCount() {
  const cartLink = qs(".cart a");

  if (!cartLink) {
    return;
  }

  let countElement = cartLink.querySelector(".cart-count");
  if (!countElement) {
    countElement = document.createElement("span");
    countElement.className = "cart-count hide";
    countElement.setAttribute("aria-hidden", "true");
    cartLink.appendChild(countElement);
  }

  const cartItems = normalizeCartItems(getLocalStorage("so-cart"));
  const count = cartItems.length;

  countElement.textContent = count;
  countElement.classList.toggle("hide", count === 0);
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
// retrieve a parameter from the URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// render a list of items using a template function
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Unable to load template: ${path}`);
  }
  return res.text();
}

export async function loadHeaderFooter() {
  const [headerTemplate, footerTemplate] = await Promise.all([
    loadTemplate("/partials/header.html"),
    loadTemplate("/partials/footer.html"),
  ]);

  const headerElement = qs("#main-header");
  const footerElement = qs("#main-footer");

  if (!headerElement || !footerElement) {
    return;
  }

  renderWithTemplate(headerTemplate, headerElement, null, updateCartItemCount);
  renderWithTemplate(footerTemplate, footerElement);
}

export function alertMessage(message, scroll = true) {
  const main = qs("main");
  if (!main || !message) {
    return;
  }

  const previousAlert = qs(".alert", main);
  if (previousAlert) {
    previousAlert.remove();
  }

  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.setAttribute("role", "alert");

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.classList.add("alert-close");
  closeButton.setAttribute("aria-label", "Dismiss message");
  closeButton.textContent = "X";

  const content = document.createElement("div");
  content.classList.add("alert-content");

  if (Array.isArray(message)) {
    const list = document.createElement("ul");
    message.forEach((entry) => {
      const item = document.createElement("li");
      item.textContent = entry;
      list.appendChild(item);
    });
    content.appendChild(list);
  } else {
    const text = document.createElement("p");
    text.textContent = message;
    content.appendChild(text);
  }

  alert.appendChild(content);
  alert.appendChild(closeButton);

  alert.addEventListener("click", (event) => {
    if (event.target === closeButton) {
      main.removeChild(alert);
    }
  });

  main.prepend(alert);

  if (scroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}