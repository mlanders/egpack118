import { Page } from "@playwright/test";

export async function login(page: Page) {
  // Set authentication cookie (session-based auth)
  await page.context().addCookies([
    {
      name: "finance_auth_timestamp",
      value: Date.now().toString(),
      domain: "localhost",
      path: "/finances",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  // Navigate to finances to verify auth
  await page.goto("/finances");
}
