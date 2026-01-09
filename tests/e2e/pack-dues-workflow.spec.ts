import { test, expect } from "@playwright/test";
import { PackDuesPaymentPage } from "../pages/PackDuesPaymentPage";
import { login } from "../helpers/auth";
import { resetDatabase, seedTestData } from "../helpers/db";

let testData: Awaited<ReturnType<typeof seedTestData>>;

test.describe("Pack Dues Payment Workflow", () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase();
    testData = await seedTestData();
    await login(page);
  });

  test("should update progress bar after payment", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    await packDuesPage.gotoScoutDetail(testData.scout1.id);

    // Verify initial state - 0% paid
    await expect(page.getByText("Paid: $0.00")).toBeVisible();

    // Make first payment of $50
    await packDuesPage.openPaymentModal();
    await packDuesPage.recordPayment("Cash", 50.0);

    // Verify success and updated balance
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.getByText("Paid: $50.00")).toBeVisible();
    await expect(page.getByText("Remaining: $50.00")).toBeVisible();
  });

  test("should show fully paid status after complete payment", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    await packDuesPage.gotoScoutDetail(testData.scout1.id);
    await packDuesPage.openPaymentModal();
    await packDuesPage.recordPayment("Cash", 100.0);

    // Verify fully paid badge appears
    await expect(page.getByText("✓ Fully Paid")).toBeVisible();
    await expect(page.getByText("Remaining: $0.00")).toBeVisible();
  });

  test("should allow multiple partial payments", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    await packDuesPage.gotoScoutDetail(testData.scout1.id);

    // First payment - $30
    await packDuesPage.openPaymentModal();
    await packDuesPage.recordPayment("Cash", 30.0);
    await expect(page.getByText("Remaining: $70.00")).toBeVisible();

    // Second payment - $40
    await packDuesPage.openPaymentModal();
    await packDuesPage.recordPayment("Check", 40.0, "12345");
    await expect(page.getByText("Remaining: $30.00")).toBeVisible();

    // Third payment - $30
    await packDuesPage.openPaymentModal();
    await packDuesPage.recordPayment("Cash", 30.0);
    await expect(page.getByText("✓ Fully Paid")).toBeVisible();
  });

  test("should display payment history", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    await packDuesPage.gotoScoutDetail(testData.scout1.id);

    // Make a payment
    await packDuesPage.openPaymentModal();
    await packDuesPage.recordPayment("Cash", 50.0);

    // Verify payment appears in history
    await expect(page.getByRole("heading", { name: "Payment History" })).toBeVisible();
    await expect(page.getByText("$50.00")).toBeVisible();
    await expect(page.getByText("Cash")).toBeVisible();
  });

  test("should allow deleting a payment", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    await packDuesPage.gotoScoutDetail(testData.scout1.id);

    // Make a payment
    await packDuesPage.openPaymentModal();
    await packDuesPage.recordPayment("Cash", 50.0);

    // Verify payment exists
    await expect(page.getByText("Paid: $50.00")).toBeVisible();

    // Set up dialog handler to confirm deletion
    page.on('dialog', dialog => dialog.accept());

    // Delete the payment
    await page.getByRole("button", { name: "Delete" }).first().click();

    // Verify payment is removed
    await expect(page.getByText("Paid: $0.00")).toBeVisible();
  });

  test("should record check payment with check number in history", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    await packDuesPage.gotoScoutDetail(testData.scout1.id);
    await packDuesPage.openPaymentModal();
    await packDuesPage.recordPayment("Check", 75.0, "98765");

    // Verify check number appears in payment history
    await expect(page.getByText("98765")).toBeVisible();
    await expect(page.getByText("Check")).toBeVisible();
  });

  test("should use fill remaining button", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    await packDuesPage.gotoScoutDetail(testData.scout1.id);
    await packDuesPage.openPaymentModal();

    // Click "Fill Remaining" button
    await page.getByRole("button", { name: "Fill Remaining" }).click();

    // Verify amount is filled with full remaining balance
    const amountInput = page.locator('[data-testid="amount"]');
    await expect(amountInput).toHaveValue("100");
  });

  test("should handle notes in payment", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    await packDuesPage.gotoScoutDetail(testData.scout1.id);
    await packDuesPage.openPaymentModal();
    await packDuesPage.recordPayment("Cash", 50.0, undefined, "Test payment note");

    // Verify note appears in history
    await expect(page.getByText("Test payment note")).toBeVisible();
  });
});
