import {
  setLocalStorage,
  getLocalStorage,
  updateCartItemCount,
} from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    const addToCartButton = document.getElementById("addToCart");
    if (addToCartButton) {
      addToCartButton.addEventListener(
        "click",
        this.addProductToCart.bind(this),
      );
    }
  }

  renderProductDetails() {
    const productElement = document.getElementById("product-detail");

    if (!productElement) return;

    if (!this.product) {
      productElement.innerHTML = "<p>Product not found.</p>";
      return;
    }

    const productImage =
      this.product.Images?.PrimaryLarge ||
      this.product.Images?.PrimaryMedium ||
      this.product.Image ||
      "";
    const colorName = this.product.Colors?.[0]?.ColorName || "";

    productElement.innerHTML = `
      <h3>${this.product.Brand?.Name || ""}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img
        class="divider"
        src="${productImage}"
        alt="${this.product.Name}"
      />
      <p class="product-card__price">$${this.product.FinalPrice}</p>
      <p class="product__color">${colorName}</p>
      <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>
    `;
  }

  normalizeCartItems(cartItems) {
    if (Array.isArray(cartItems)) {
      return cartItems;
    }
    return cartItems ? [cartItems] : [];
  }

  addProductToCart() {
    const cartItems = this.normalizeCartItems(getLocalStorage("so-cart"));
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
    updateCartItemCount();
  }
}
