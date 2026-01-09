import { Page, Locator } from '@playwright/test';

export class FinanceDashboardPage {
	readonly page: Page;
	readonly scoutsList: Locator;
	readonly totalBalance: Locator;

	constructor(page: Page) {
		this.page = page;
		this.scoutsList = page.locator('[data-testid="scouts-list"]');
		this.totalBalance = page.locator('[data-testid="total-balance"]');
	}

	async goto() {
		await this.page.goto('/finances');
	}

	async getScoutBalance(scoutName: string): Promise<string> {
		const scoutRow = this.page.locator(`[data-testid="scout-row-${scoutName}"]`);
		return (await scoutRow.locator('[data-testid="balance"]').textContent()) || '0';
	}
}
