import { test, expect } from "@playwright/test";
import { users } from "../test-data/test-users";
import { LoginPage } from "../pages/login";

test.describe("Login Scenarios", () => {
  let loginPage;
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("Login with valid user", async ({ page }) => {
    await loginPage.login(
      users.standardUser.username,
      users.standardUser.password
    );
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test("Verify Error for locked out user", async () => {
    await loginPage.login(users.lockedUser.username, users.lockedUser.password);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Sorry, this user has been locked out");
  });

  test("Verify error for invalid credentials", async () => {
    await loginPage.login(users.standardUser.username, "invalidpassword");
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Username and password do not match");
  });

  test("Verify error for empty username", async () => {
    await loginPage.login("", "");
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Username is required");
  });

  test("Verify error for empty password", async () => {
    await loginPage.login(users.standardUser.username, "");
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Password is required");
  });
});
