import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    const finalPrice = Number(product.FinalPrice || 0);
    const retailPrice = Number(product.SuggestedRetailPrice || 0);
    const isDiscounted = retailPrice > finalPrice;
    const discountPercent = isDiscounted
        ? Math.round(((retailPrice - finalPrice) / retailPrice) * 100)
        : 0;

    const discountHtml = isDiscounted
        ? `<p class="product-card__discount"><span class="discount-badge">-${discountPercent}%</span><span class="product-card__original">$${retailPrice.toFixed(2)}</span></p>`
        : "";

    return `<li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}" />
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.Name}</h3>
            ${discountHtml}
            <p class="product-card__price">$${finalPrice.toFixed(2)}</p>
    </a>
  </li>`;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData();
        this.renderList(list);
    }

    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}