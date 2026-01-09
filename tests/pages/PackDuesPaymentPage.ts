import { Page, Locator } from "@playwright/test";

export class PackDuesPaymentPage {
  readonly page: Page;
  readonly recordPaymentButton: Locator;
  readonly paymentMethodCash: Locator;
  readonly paymentMethodCheck: Locator;
  readonly paymentMethodScoutAccount: Locator;
  readonly amountInput: Locator;
  readonly checkNumberInput: Locator;
  readonly notesInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.recordPaymentButton = page.getByRole("button", {
      name: "Record Payment",
    });
    this.paymentMethodCash = page.locator(
      '[data-testid="payment-method-cash"]',
    );
    this.paymentMethodCheck = page.locator(
      '[data-testid="payment-method-check"]',
    );
    this.paymentMethodScoutAccount = page.locator(
      '[data-testid="payment-method-scout-account"]',
    );
    this.amountInput = page.locator('[data-testid="amount"]');
    this.checkNumberInput = page.locator('[data-testid="check-number"]');
    this.notesInput = page.locator('[data-testid="notes"]');
    this.submitButton = page.locator('[data-testid="submit-payment"]');
  }

  async gotoScoutDetail(scoutId: number) {
    await this.page.goto(`/finances/scouts/${scoutId}`);
  }

  async openPaymentModal() {
    await this.recordPaymentButton.click();
  }

  async recordPayment(
    method: "Cash" | "Check" | "Scout Account",
    amount: number,
    checkNumber?: string,
    notes?: string,
  ) {
    // Select payment method
    if (method === "Cash") {
      await this.paymentMethodCash.click();
    } else if (method === "Check") {
      await this.paymentMethodCheck.click();
    } else {
      await this.paymentMethodScoutAccount.click();
    }

    // Fill amount
    await this.amountInput.fill(amount.toString());

    // Fill check number if needed
    if (method === "Check" && checkNumber) {
      await this.checkNumberInput.fill(checkNumber);
    }

    // Fill notes if provided
    if (notes) {
      await this.notesInput.fill(notes);
    }

    // Submit
    await this.submitButton.click();
  }
}
