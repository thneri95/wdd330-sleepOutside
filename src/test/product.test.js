import { normalizeCartItems } from "../js/product.js";
import ProductData from "../js/ProductData.mjs";

describe("normalizeCartItems", () => {
  it("returns an empty array when nothing is stored", () => {
    expect(normalizeCartItems(null)).toEqual([]);
  });

  it("wraps a single stored item in an array", () => {
    const item = { Id: "123" };
    expect(normalizeCartItems(item)).toEqual([item]);
  });

  it("keeps an existing array unchanged", () => {
    const items = [{ Id: "1" }, { Id: "2" }];
    expect(normalizeCartItems(items)).toEqual(items);
  });

  it("creates a product data source with api methods", () => {
    const dataSource = new ProductData();
    expect(typeof dataSource.getData).toBe("function");
    expect(typeof dataSource.findProductById).toBe("function");
  });
});
