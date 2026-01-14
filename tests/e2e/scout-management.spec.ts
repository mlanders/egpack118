import { test, expect } from "@playwright/test";
import { login } from "../helpers/auth";
import { resetDatabase, seedTestData } from "../helpers/db";

let testData: Awaited<ReturnType<typeof seedTestData>>;

test.describe("Scout Management", () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase();
    testData = await seedTestData();
    await login(page);
  });

  test("should display all scouts on finance dashboard", async ({ page }) => {
    await page.goto("/finances");
    await page.waitForLoadState("networkidle");

    // Click on Scouts tab using JavaScript
    await page.evaluate(() => {
      const scoutsButton = Array.from(document.querySelectorAll("button")).find(
        (btn) => btn.textContent?.trim() === "Scouts",
      );
      scoutsButton?.click();
    });
    await page.waitForTimeout(100);

    // Verify both test scouts are visible
    await expect(page.getByText("Test Scout 1")).toBeVisible();
    await expect(page.getByText("Test Scout 2")).toBeVisible();
  });

  test("should navigate to scout detail page", async ({ page }) => {
    await page.goto("/finances");
    await page.waitForLoadState("networkidle");

    // Click on Scouts tab using JavaScript
    await page.evaluate(() => {
      const scoutsButton = Array.from(document.querySelectorAll("button")).find(
        (btn) => btn.textContent?.trim() === "Scouts",
      );
      scoutsButton?.click();
    });
    await page.waitForTimeout(100);

    // Click on first scout
    await page.getByText("Test Scout 1").click();

    // Verify we're on the detail page
    await expect(
      page.getByRole("heading", { name: "Test Scout 1" }),
    ).toBeVisible();
    await expect(
      page.getByText(`Fiscal Year: ${testData.currentFiscalYear}`),
    ).toBeVisible();
  });

  test("should display scout balance correctly", async ({ page }) => {
    await page.goto(`/finances/scouts/${testData.scout2.id}`);

    // Scout 2 has beginning balance of 25.50 - check the current balance specifically
    await expect(page.getByText("Current Balance")).toBeVisible();
    await expect(
      page.locator("text=Current Balance").locator("..").getByText("$25.50"),
    ).toBeVisible();
  });

  test("should show active status badge", async ({ page }) => {
    await page.goto(`/finances/scouts/${testData.scout1.id}`);

    // Verify active badge is shown
    await expect(page.getByText("Active")).toBeVisible();
  });

  test("should display pack dues section", async ({ page }) => {
    await page.goto(`/finances/scouts/${testData.scout1.id}`);

    // Verify pack dues section exists
    await expect(
      page.getByText(`Pack Dues ${testData.currentFiscalYear}`),
    ).toBeVisible();
    await expect(page.getByText("Annual pack dues: $100.00")).toBeVisible();
  });

  test("should show transaction history section", async ({ page }) => {
    await page.goto(`/finances/scouts/${testData.scout1.id}`);

    // Verify transaction history section
    await expect(
      page.getByRole("heading", { name: "Transaction History" }),
    ).toBeVisible();
  });

  test("should have back to finances navigation", async ({ page }) => {
    await page.goto(`/finances/scouts/${testData.scout1.id}`);

    // Click back link
    await page.getByRole("link", { name: "Back to Finances" }).click();

    // Verify we're back on the dashboard
    await expect(page).toHaveURL("/finances");
  });
});
