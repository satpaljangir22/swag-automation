export class HomePage {
  /**
   *
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.openMenu = this.page.getByRole("button", { name: "Open Menu" });
    this.closeMenu = this.page.getByRole("button", { name: "Close Menu" });
    this.allItems = this.page.getByRole("link", { name: "All items" });
    this.about = this.page.getByRole("link", { name: "About" });
    this.logout = this.page.getByRole("link", { name: "Logout" });
    this.resetAppState = this.page.getByRole("link", {
      name: "Reset App State",
    });
    this.shoppingCart = this.page.getByTestId("shopping-cart-link");
    this.productSortContainer = this.page.getByTestId("product-sort-container");
    this.activeSorOption = this.page.getByTestId("active-option");
    this.productName = this.page.getByTestId("inventory-item-name");
    this.inventoryItem = this.page.getByTestId("inventory-item");
  }

  async getOptionsMenus() {
    await this.openMenu.click();
    const allitems = await this.allItems.textContent();
    const about = await this.about.textContent();
    const logout = await this.logout.textContent();
    const resetAppState = await this.resetAppState.textContent();
    await this.closeMenu.click();
    return [allitems, about, logout, resetAppState];
  }

  async getProductPrice(productName) {
    const product = this.inventoryItem.filter({ hasText: productName });
    const productPrice = await product
      .getByTestId("inventory-item-price")
      .textContent();
    return productPrice;
  }

  async addProductToCart(productName) {
    const product = this.inventoryItem.filter({ hasText: productName });
    await product.getByRole("button", { name: "Add to cart" }).click();
  }

  async getCartCount() {
    const cartCount = await this.shoppingCart.textContent();
    return parseInt(cartCount);
  }

  async getAllProducts() {
    let productNames = [];
    const allProducts = await this.productName.all();
    for (let product of allProducts) {
      productNames.push(await product.textContent());
    }
    return productNames;
  }
}
