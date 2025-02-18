import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login";
import { HomePage } from "../pages/home";
import { users } from "../test-data/test-users";

test.describe("Home Page Validations", () => {
  let loginPage;
  let homePage;
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await loginPage.goto();
    await loginPage.login(
      users.standardUser.username,
      users.standardUser.password
    );
  });

  test("Verify all the Menu Links", async () => {
    const menuItems = await homePage.getOptionsMenus();
    expect(menuItems).toEqual(
      expect.arrayContaining([
        "All Items",
        "About",
        "Logout",
        "Reset App State",
      ])
    );
  });

  test("Verify all the products", async () => {
    const products = await homePage.getAllProducts();
    expect(products).toHaveLength(6);
    for (let product of products) {
      let price = await homePage.getProductPrice(product);
      expect(parseInt(price.replace("$", ""))).toBeGreaterThan(0);
    }
  });

  const addToCart = test("Add Item to the Cart", async () => {
    const products = await homePage.getAllProducts();
    await homePage.addProductToCart(products[0]);
    const cartCount = await homePage.getCartCount();
    expect(cartCount).toBe(1);
  });
});
