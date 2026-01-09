import { test, expect } from "@playwright/test";
import { PackDuesPaymentPage } from "../pages/PackDuesPaymentPage";
import { login } from "../helpers/auth";
import { resetDatabase, seedTestData } from "../helpers/db";

let testData: Awaited<ReturnType<typeof seedTestData>>;

test.describe("Pack Dues Payment Validation", () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase();
    testData = await seedTestData();
    await login(page);
  });

  test("should require check number for check payments", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    await packDuesPage.gotoScoutDetail(testData.scout1.id);
    await packDuesPage.openPaymentModal();

    // Select check payment method
    await page.locator('[data-testid="payment-method-check"]').click();

    // Fill amount but not check number
    await page.locator('[data-testid="amount"]').fill("50");

    // Try to submit - use evaluate to bypass viewport issues
    await page.evaluate(() => {
      const button = document.querySelector(
        '[data-testid="submit-payment"]',
      ) as HTMLButtonElement;
      button?.click();
    });

    // Verify validation error appears
    await expect(page.getByText(/Check number is required/i)).toBeVisible();
  });

  test("should validate check number is numeric", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    await packDuesPage.gotoScoutDetail(testData.scout1.id);
    await packDuesPage.openPaymentModal();

    // Select check payment
    await page.locator('[data-testid="payment-method-check"]').click();

    // Enter non-numeric check number
    await page.locator('[data-testid="amount"]').fill("50");
    await page.locator('[data-testid="check-number"]').fill("ABC123");

    // Try to submit - use evaluate to bypass viewport issues
    await page.evaluate(() => {
      const button = document.querySelector(
        '[data-testid="submit-payment"]',
      ) as HTMLButtonElement;
      button?.click();
    });

    // Verify validation error
    await expect(page.getByText(/Check number must be numeric/i)).toBeVisible();
  });

  test("should prevent overpayment without override", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    await packDuesPage.gotoScoutDetail(testData.scout1.id);
    await packDuesPage.openPaymentModal();

    // Try to pay more than required (100.00 dues, paying 150.00)
    await page.locator('[data-testid="payment-method-cash"]').click();
    await page.locator('[data-testid="amount"]').fill("150");

    // Try to submit - use evaluate to bypass viewport issues
    await page.evaluate(() => {
      const button = document.querySelector(
        '[data-testid="submit-payment"]',
      ) as HTMLButtonElement;
      button?.click();
    });

    // Verify validation error
    await expect(
      page.getByText(/Amount cannot exceed remaining balance/i),
    ).toBeVisible();
  });

  test("should validate amount is greater than zero", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    await packDuesPage.gotoScoutDetail(testData.scout1.id);
    await packDuesPage.openPaymentModal();

    // Try to pay 0 or negative
    await page.locator('[data-testid="payment-method-cash"]').click();
    await page.locator('[data-testid="amount"]').fill("0");

    // Try to submit - use evaluate to bypass viewport issues
    await page.evaluate(() => {
      const button = document.querySelector(
        '[data-testid="submit-payment"]',
      ) as HTMLButtonElement;
      button?.click();
    });

    // Verify validation error
    await expect(
      page.getByText(/Amount must be greater than 0/i),
    ).toBeVisible();
  });

  test("should validate scout account has sufficient balance", async ({
    page,
  }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    // Scout 2 has only $25.50 balance
    await packDuesPage.gotoScoutDetail(testData.scout2.id);
    await packDuesPage.openPaymentModal();

    // Try to pay more than available scout account balance
    await page.locator('[data-testid="payment-method-scout-account"]').click();
    await page.locator('[data-testid="amount"]').fill("50");

    // Try to submit - use evaluate to bypass viewport issues
    await page.evaluate(() => {
      const button = document.querySelector(
        '[data-testid="submit-payment"]',
      ) as HTMLButtonElement;
      button?.click();
    });

    // Verify validation error
    await expect(
      page.getByText(/Insufficient scout account balance/i),
    ).toBeVisible();
  });

  test("should allow closing modal without submitting", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    await packDuesPage.gotoScoutDetail(testData.scout1.id);
    await packDuesPage.openPaymentModal();

    // Click cancel button
    await page.getByRole("button", { name: "Cancel" }).click();

    // Verify modal is closed (payment button is visible again)
    await expect(
      page.getByRole("button", { name: "Record Payment" }),
    ).toBeVisible();
  });

  test("should show remaining dues amount in modal", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    await packDuesPage.gotoScoutDetail(testData.scout1.id);
    await packDuesPage.openPaymentModal();

    // Verify dues status is displayed
    await expect(page.getByText("Total Dues: $100.00")).toBeVisible();
    await expect(page.getByText("Paid: $0.00")).toBeVisible();
    await expect(page.getByText("Remaining: $100.00")).toBeVisible();
  });
});
