export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   **/
  constructor(page) {
    this.page = page;
    this.username = this.page.getByPlaceholder("Username");
    this.password = this.page.getByPlaceholder("Password");
    this.loginBtn = this.page.getByRole("button", {
      name: "Login",
      exact: true,
    });
    this.errorMsg = this.page.getByTestId("error");
  }

  async goto() {
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
  }

  async login(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginBtn.click();
  }

  async getErrorMessage() {
    return this.errorMsg.textContent();
  }
}
