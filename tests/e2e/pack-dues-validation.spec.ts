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

    // Try to submit - click the button to trigger validation
    await page.evaluate(() => {
      const button = document.querySelector(
        '[data-testid="submit-payment"]',
      ) as HTMLButtonElement;
      button?.click();
    });

    // Wait for validation error to appear
    const validationError = page.locator('[data-testid="validation-error"]');
    await expect(validationError).toBeVisible();
    await expect(validationError).toContainText(/Check number is required/i);
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

    // Try to submit - click the button to trigger validation
    await page.evaluate(() => {
      const button = document.querySelector(
        '[data-testid="submit-payment"]',
      ) as HTMLButtonElement;
      button?.click();
    });

    // Wait for validation error to appear
    const validationError = page.locator('[data-testid="validation-error"]');
    await expect(validationError).toBeVisible();
    await expect(validationError).toContainText(
      /Check number must be numeric/i,
    );
  });

  test("should prevent overpayment without override", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    await packDuesPage.gotoScoutDetail(testData.scout1.id);
    await packDuesPage.openPaymentModal();

    // Try to pay more than required (100.00 dues, paying 150.00)
    await page.locator('[data-testid="payment-method-cash"]').click();
    await page.locator('[data-testid="amount"]').fill("150");

    // Try to submit - click the button to trigger validation
    await page.evaluate(() => {
      const button = document.querySelector(
        '[data-testid="submit-payment"]',
      ) as HTMLButtonElement;
      button?.click();
    });

    // Wait for validation error to appear
    const validationError = page.locator('[data-testid="validation-error"]');
    await expect(validationError).toBeVisible();
    await expect(validationError).toContainText(
      /Amount cannot exceed remaining balance/i,
    );
  });

  test("should validate amount is greater than zero", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    await packDuesPage.gotoScoutDetail(testData.scout1.id);
    await packDuesPage.openPaymentModal();

    // Try to pay 0 or negative
    await page.locator('[data-testid="payment-method-cash"]').click();
    await page.locator('[data-testid="amount"]').fill("0");

    // Try to submit - click the button to trigger validation
    await page.evaluate(() => {
      const button = document.querySelector(
        '[data-testid="submit-payment"]',
      ) as HTMLButtonElement;
      button?.click();
    });

    // Wait for validation error to appear
    const validationError = page.locator('[data-testid="validation-error"]');
    await expect(validationError).toBeVisible();
    await expect(validationError).toContainText(
      /Amount must be greater than 0/i,
    );
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

    // Try to submit - click the button to trigger validation
    await page.evaluate(() => {
      const button = document.querySelector(
        '[data-testid="submit-payment"]',
      ) as HTMLButtonElement;
      button?.click();
    });

    // Wait for validation error to appear
    const validationError = page.locator('[data-testid="validation-error"]');
    await expect(validationError).toBeVisible();
    await expect(validationError).toContainText(
      /Insufficient scout account balance/i,
    );
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

    // Verify dues status is displayed - use more specific selectors to avoid strict mode
    const duesStatus = page.locator(".bg-blue-50.border-blue-200");
    await expect(duesStatus.getByText("Total Dues: $100.00")).toBeVisible();
    await expect(duesStatus.getByText(/Paid: \$0\.00/)).toBeVisible();
    await expect(duesStatus.getByText(/Remaining: \$100\.00/)).toBeVisible();
  });
});
