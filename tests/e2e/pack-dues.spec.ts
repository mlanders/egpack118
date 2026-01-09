import { test, expect } from "@playwright/test";
import { PackDuesPaymentPage } from "../pages/PackDuesPaymentPage";
import { FinanceDashboardPage } from "../pages/FinanceDashboardPage";
import { login } from "../helpers/auth";
import { resetDatabase, seedTestData } from "../helpers/db";

let testData: Awaited<ReturnType<typeof seedTestData>>;

test.describe("Pack Dues Payment", () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase();
    testData = await seedTestData();
    await login(page);
  });

  test("should record cash payment successfully", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    // Navigate to first scout using actual ID
    await packDuesPage.gotoScoutDetail(testData.scout1.id);

    // Open payment modal
    await packDuesPage.openPaymentModal();

    // Record cash payment
    await packDuesPage.recordPayment("Cash", 100.0);

    // Verify success message appears
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      "Payment recorded successfully",
    );
  });

  test("should record check payment with check number", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    // Navigate to first scout using actual ID
    await packDuesPage.gotoScoutDetail(testData.scout1.id);

    // Open payment modal
    await packDuesPage.openPaymentModal();

    // Record check payment
    await packDuesPage.recordPayment("Check", 100.0, "12345");

    // Verify success message appears
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      "Payment recorded successfully",
    );
  });

  test("should record scout account payment and create transaction", async ({
    page,
  }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    // Navigate to second scout using actual ID (has balance of 25.50)
    await packDuesPage.gotoScoutDetail(testData.scout2.id);

    // Open payment modal
    await packDuesPage.openPaymentModal();

    // Record scout account payment
    await packDuesPage.recordPayment("Scout Account", 25.5);

    // Verify payment recorded with success message
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      "Payment recorded successfully",
    );

    // Navigate to dashboard and verify balance decreased
    const dashboard = new FinanceDashboardPage(page);
    await dashboard.goto();

    const balance = await dashboard.getScoutBalance("Test Scout 2");
    expect(parseFloat(balance)).toBe(0); // 25.50 - 25.50 = 0
  });

  test("should handle partial payment", async ({ page }) => {
    const packDuesPage = new PackDuesPaymentPage(page);

    // Navigate to first scout using actual ID
    await packDuesPage.gotoScoutDetail(testData.scout1.id);

    // Open payment modal
    await packDuesPage.openPaymentModal();

    // Record partial cash payment (50 out of 100 required)
    await packDuesPage.recordPayment("Cash", 50.0);

    // Verify success message appears (partial payment is still successful)
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      "Payment recorded successfully",
    );

    // Verify remaining balance shows on the page
    await expect(page.getByText("Remaining: $50.00")).toBeVisible();
  });
});
