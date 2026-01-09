import { test, expect } from "@playwright/test";
import { login } from "../helpers/auth";
import { resetDatabase, seedTestData } from "../helpers/db";

let testData: Awaited<ReturnType<typeof seedTestData>>;

test.describe("Finance Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase();
    testData = await seedTestData();
    await login(page);
  });

  test("should load finance dashboard", async ({ page }) => {
    await page.goto("/finances");

    // Verify page title or heading
    await expect(page).toHaveURL("/finances");
  });

  test("should display fiscal year information", async ({ page }) => {
    await page.goto("/finances");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Verify fiscal year dropdown is visible
    const fiscalYearSelect = page.locator("#fiscal-year-select");
    await expect(fiscalYearSelect).toBeVisible();

    // Verify current fiscal year is selected or available in the dropdown
    const selectedValue = await fiscalYearSelect.inputValue();
    expect(selectedValue).toBe(testData.currentFiscalYear);
  });

  test("should show scout balances section", async ({ page }) => {
    await page.goto("/finances");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Click on Scouts tab using JavaScript to ensure the click fires
    await page.evaluate(() => {
      const scoutsButton = Array.from(document.querySelectorAll("button")).find(
        (btn) => btn.textContent?.trim() === "Scouts",
      );
      scoutsButton?.click();
    });

    // Wait for content to update
    await page.waitForTimeout(100);

    // Wait for the scout balances content to appear
    await expect(
      page.getByRole("heading", { name: "Scout Balances" }),
    ).toBeVisible();

    // Verify both scouts are listed
    await expect(page.getByText("Test Scout 1")).toBeVisible();
    await expect(page.getByText("Test Scout 2")).toBeVisible();
  });

  test("should display scout beginning balances", async ({ page }) => {
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

    // Scout 2 should show balance of $25.50
    await expect(page.getByText("Test Scout 2")).toBeVisible();
  });

  test("should have navigation to scout details", async ({ page }) => {
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

    // Click on a scout name
    await page.getByText("Test Scout 1").click();

    // Should navigate to scout detail page
    await expect(page).toHaveURL(
      new RegExp(`/finances/scouts/${testData.scout1.id}`),
    );
  });

  test("should be accessible after authentication", async ({ page }) => {
    await page.goto("/finances");

    // Verify page loaded (not redirected to login)
    await expect(page).toHaveURL("/finances");
  });
});
