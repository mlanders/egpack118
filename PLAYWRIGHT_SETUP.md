# Playwright MCP Setup Complete

This document describes the Playwright MCP setup for interactive browser automation with Claude Code.

## What Was Installed

### 1. Dependencies
- `@playwright/test` (v1.57.0) - Playwright testing framework
- `@playwright/mcp` (v0.0.54) - Microsoft's Playwright MCP server
- Chromium browser (v143.0.7499.4) - Headless browser for testing

### 2. Configuration Files

#### `.mcp.json` - MCP Server Configuration for Claude Code CLI
Enables Claude Code to control the browser through the MCP protocol.

#### `playwright.config.ts` - Playwright Test Configuration
- Runs tests sequentially (workers: 1) for database safety
- Automatically starts dev server on port 5173
- Captures screenshots on failure
- Generates HTML test reports

#### `.env.test` - Test Database Configuration
Template for test database connection string (needs to be configured).

### 3. Test Infrastructure

```
tests/
├── helpers/
│   ├── db.ts           # Database reset and seeding utilities
│   └── auth.ts         # Authentication helper (cookie-based)
├── pages/
│   ├── PackDuesPaymentPage.ts      # Page object for pack dues
│   └── FinanceDashboardPage.ts     # Page object for dashboard
└── e2e/
    └── pack-dues.spec.ts           # Pack dues payment tests
```

### 4. Component Updates

Added `data-testid` attributes to:
- `src/routes/finances/scouts/[id]/components/RecordDuesPaymentModal.svelte`
  - Payment method radio buttons
  - Amount input
  - Check number input
  - Notes textarea
  - Submit button

- `src/routes/finances/scouts/[id]/+page.svelte`
  - Success message display

## How to Use

### Option 1: Interactive Browser Automation with Claude (MCP)

The MCP server is now configured. You can ask Claude to control the browser:

**Examples:**
```
"Navigate to http://localhost:5173/finances and show me the dashboard"
"Open scout #1 and record a $100 cash payment for pack dues"
"Take a screenshot of the pack dues payment modal"
"Test the check payment flow with check number 12345"
```

Claude will:
- Open and control the browser
- Navigate through your application
- Fill forms and click buttons
- Take screenshots
- Verify results
- Report findings

**To activate MCP in Claude Code:**
The `.mcp.json` configuration is already in place. The MCP server will automatically start when Claude needs browser control.

**For Claude Desktop:**
Add this to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"],
      "env": {
        "PLAYWRIGHT_BROWSERS_PATH": "0"
      }
    }
  }
}
```

Then restart Claude Desktop.

### Option 2: Run Automated Tests

#### Run all tests
```bash
npm test
```

#### Run tests with visible browser
```bash
npm run test:headed
```

#### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

#### Run tests in debug mode
```bash
npm run test:debug
```

#### View test report
```bash
npx playwright show-report
```

## Test Database Setup

**Important:** Configure a test database before running tests.

### Option 1: Create Neon Database Branch (Recommended)
1. Go to your Neon console
2. Create a new branch from your main database
3. Name it `test` or `testing`
4. Copy the connection string
5. Update `.env.test`:
   ```
   TEST_DATABASE_URL=postgresql://user:pass@host/egpack118_test?sslmode=require
   ```

### Option 2: Use Main Database (Not Recommended)
Update `.env.test`:
```
TEST_DATABASE_URL=${DATABASE_URL}
```

**Warning:** Tests will delete all data before running!

## Current Test Coverage

### Pack Dues Payment Tests (`tests/e2e/pack-dues.spec.ts`)

✅ **Cash Payment**
- Opens payment modal
- Selects cash payment method
- Records payment
- Verifies success message

✅ **Check Payment**
- Opens payment modal
- Selects check payment method
- Enters check number
- Records payment
- Verifies success message

✅ **Scout Account Payment**
- Opens payment modal
- Selects scout account payment
- Records payment
- Verifies success message
- Confirms balance decreased

✅ **Partial Payment**
- Opens payment modal
- Records partial payment (50 out of 100)
- Verifies success message
- Confirms remaining balance displayed

## MCP Integration Benefits

### For Development
- **Real-time debugging**: Ask Claude to navigate and inspect your app
- **Form testing**: Claude can fill out complex forms
- **Visual verification**: Take screenshots at any point
- **Data extraction**: Extract information from pages

### For Testing
- **Interactive test creation**: Describe what to test, Claude creates the test
- **Bug reproduction**: Describe a bug, Claude tries to reproduce it
- **Accessibility checks**: Ask Claude to check for accessibility issues
- **Cross-browser testing**: Test on different browsers

## Next Steps

### 1. Configure Test Database
Update `.env.test` with your test database URL.

### 2. Add More Tests
Expand test coverage to:
- Scout management (create, update, archive)
- Transaction history
- Fiscal year configuration
- Calendar features
- Authentication flows

### 3. CI/CD Integration
Add to `.github/workflows/test.yml`:
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### 4. Visual Regression Testing
Install `@playwright/test` visual comparison:
```bash
npm install -D pixelmatch
```

### 5. Accessibility Testing
Install axe-core for accessibility checks:
```bash
npm install -D axe-playwright
```

## Troubleshooting

### MCP Server Not Working
- Ensure `.mcp.json` is in project root
- Restart Claude Code CLI
- Check that dev server is running on port 5173

### Tests Failing
- Verify test database is configured in `.env.test`
- Ensure dev server is running (`npm run dev`)
- Check that Chromium is installed (`npx playwright install chromium`)
- Run tests in headed mode to see what's happening (`npm run test:headed`)

### Authentication Issues
- Tests use cookie-based auth (no login form needed)
- Auth cookie is set automatically in `tests/helpers/auth.ts`
- Cookie expires after 15 minutes (SESSION_TIMEOUT in `src/lib/server/auth.ts`)

## Files Modified

### New Files
- `.mcp.json`
- `playwright.config.ts`
- `.env.test`
- `PLAYWRIGHT_SETUP.md` (this file)
- `tests/helpers/db.ts`
- `tests/helpers/auth.ts`
- `tests/pages/PackDuesPaymentPage.ts`
- `tests/pages/FinanceDashboardPage.ts`
- `tests/e2e/pack-dues.spec.ts`

### Modified Files
- `package.json` - Added Playwright dependencies and test scripts
- `.gitignore` - Added Playwright report directories
- `src/routes/finances/scouts/[id]/components/RecordDuesPaymentModal.svelte` - Added test IDs
- `src/routes/finances/scouts/[id]/+page.svelte` - Added success message display

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright MCP Documentation](https://github.com/microsoft/playwright-mcp)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [SvelteKit Testing Guide](https://svelte.dev/docs/svelte/testing)

## Support

For questions or issues:
1. Check this documentation
2. Review the plan file at `~/.claude/plans/glimmering-plotting-peacock.md`
3. Ask Claude for help with MCP browser automation
