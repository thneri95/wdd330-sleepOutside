function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`;
  }

  async getData() {
    try {
      const response = await fetch(this.path);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error loading data:", error);
      return [];
    }
  }

  async findProductById(id) {
    const data = await this.getData();
    return data.find((product) => product.Id === id);
  }
}
