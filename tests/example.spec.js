import { test, expect } from "@playwright/test";
import { testUsers } from "../test-data/test-users";

test("find most expensive product", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/", {
    waitUntil: "domcontentloaded",
  });
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

  const prices = await page.getByTestId("inventory-item-description").all();
  let maxPrice = 0;
  let maxPriceElement;

  for (const price of prices) {
    const priceValueString = await price
      .getByTestId("inventory-item-price")
      .innerText();
    const priceValue = parseFloat(priceValueString.replace("$", ""));
    if (priceValue > maxPrice) {
      maxPrice = priceValue;
      maxPriceElement = price;
    }
  }

  const addToCartButton = maxPriceElement.getByRole("button", {
    name: "Add to cart",
    exact: true,
  });

  expect(await addToCartButton.innerText()).toBe("Add to cart");

  await addToCartButton.click();
  await expect(
    page.getByRole("button", { name: "Remove", exact: true })
  ).toBeVisible();

  const cartCount = await page.getByTestId("shopping-cart-link").innerText();
  expect(parseInt(cartCount)).toBe(1);

  await page.getByTestId("shopping-cart-link").click();
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
  expect(await page.getByTestId("inventory-item-price").innerText()).toEqual(
    `$${maxPrice}`
  );
  await expect(
    page.getByRole("button", { name: "Checkout", exact: true })
  ).toBeEnabled();
  await page.screenshot({
    path: "./test-results/screenshots/valid-order/your-cart.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Checkout", exact: true }).click();
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-step-one.html"
  );
  await expect(page.getByText("Checkout: Your Information")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Continue", exact: true })
  ).toBeEnabled();

  await page.getByPlaceholder("First Name").fill("Satpal");
  await page.getByPlaceholder("Last Name").fill("Jangir");
  await page.getByPlaceholder("Zip/Postal Code").fill("332301");
  await page.screenshot({
    path: "./test-results/screenshots/valid-order/checkout-information.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-step-two.html"
  );
  await expect(
    page.getByRole("button", { name: "Finish", exact: true })
  ).toBeEnabled();
  await page.screenshot({
    path: "./test-results/screenshots/valid-order/checkout-overview.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "Finish", exact: true }).click();
  await expect(page.getByText("Thank you for your order!")).toBeVisible();
  await page.screenshot({
    path: "./test-results/screenshots/valid-order/checkout-complete.png",
    fullPage: true,
  });
  await expect(
    page.getByRole("button", { name: "Back Home", exact: true })
  ).toBeEnabled();
});

testUsers.forEach(({ userName, password }) => {
  test(`testing with ${userName}`, async ({ page }) => {
    await page.goto("https://www.saucedemo.com/", {
      waitUntil: "domcontentloaded",
    });
    await page.getByPlaceholder("Username").fill(userName);
    await page.getByPlaceholder("Password").fill(password);
    await page.getByRole("button", { name: "Login", exact: true }).click();
    await page.waitForLoadState("domcontentloaded");
    await page.screenshot({
      path: `./test-results/screenshots/valid-users/${userName}.png`,
      fullPage: true,
    });
  });
});
