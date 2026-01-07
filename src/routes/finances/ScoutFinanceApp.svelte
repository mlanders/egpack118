<script lang="ts">
    import { onMount } from "svelte";
    import { enhance } from "$app/forms";
    import "./styles.css";
    import * as api from "$lib/services/financeApi";
    import type {
        ScoutInput,
        TransactionInput,
        PackTransactionInput,
    } from "$lib/types/finances";
    import Dashboard from "./components/Dashboard.svelte";
    import ScoutBalances from "./components/ScoutBalances.svelte";
    import Transactions from "./components/Transactions.svelte";
    import Reconciliation from "./components/Reconciliation.svelte";
    import YearSummary from "./components/YearSummary.svelte";
    import AddScoutModal from "./components/AddScoutModal.svelte";
    import AddTransactionModal from "./components/AddTransactionModal.svelte";
    import AddPackTransactionModal from "./components/AddPackTransactionModal.svelte";
    import NewFiscalYearModal from "./components/NewFiscalYearModal.svelte";

    // Types
    interface Scout {
        id?: number;
        name: string;
        beginningBalance: number;
        notes: string;
        active: boolean;
        createdAt: string;
        fiscalYear: string;
    }

    interface Transaction {
        id?: number;
        date: string;
        scoutName: string;
        description: string;
        type:
            | "Deposit"
            | "Withdrawal"
            | "Pack Dues Paid"
            | "Reimbursement"
            | "Transfer to Pack";
        amount: number;
        notes: string;
        createdAt: string;
        fiscalYear: string;
    }

    interface PackTransaction {
        id?: number;
        date: string;
        description: string;
        type: "Income" | "Expense";
        amount: number;
        category: string;
        notes: string;
        createdAt: string;
        fiscalYear: string;
    }

    // State
    let scouts = $state<Scout[]>([]);
    let transactions = $state<Transaction[]>([]);
    let packTransactions = $state<PackTransaction[]>([]);
    let activeTab = $state<
        | "dashboard"
        | "scout-balances"
        | "transactions"
        | "reconciliation"
        | "year-summary"
    >("dashboard");
    let showInactiveScouts = $state(false);
    let selectedFiscalYear = $state<string>("");

    // Modal state
    let showAddScoutModal = $state(false);
    let showAddTransactionModal = $state(false);
    let showAddPackTransactionModal = $state(false);
    let showNewFiscalYearModal = $state(false);
    let newFiscalYearOptions = $state({
        carryForwardBalances: true,
        markPreviousInactive: false,
    });

    // Transaction view mode
    let transactionViewMode = $state<"scout" | "pack">("scout");

    // Form state
    let scoutForm = $state<Partial<Scout>>({
        name: "",
        beginningBalance: 0,
        notes: "",
        active: true,
    });
    let transactionForm = $state<Partial<Transaction>>({
        date: new Date().toISOString().split("T")[0],
        scoutName: "",
        description: "",
        type: "Deposit",
        amount: 0,
        notes: "",
    });
    let packTransactionForm = $state<Partial<PackTransaction>>({
        date: new Date().toISOString().split("T")[0],
        description: "",
        type: "Income",
        amount: 0,
        category: "",
        notes: "",
    });

    // Fiscal Year Helper Functions
    function getFiscalYear(date: Date): string {
        const year = date.getFullYear();
        const month = date.getMonth();

        if (month >= 6) {
            return `${year}-${year + 1}`;
        } else {
            return `${year - 1}-${year}`;
        }
    }

    function getCurrentFiscalYear(): string {
        return getFiscalYear(new Date());
    }

    function getAvailableFiscalYears(): string[] {
        const years = new Set<string>();

        scouts.forEach((scout) => {
            if (scout.fiscalYear) {
                years.add(scout.fiscalYear);
            }
        });

        transactions.forEach((transaction) => {
            if (transaction.fiscalYear) {
                years.add(transaction.fiscalYear);
            }
        });

        packTransactions.forEach((transaction) => {
            if (transaction.fiscalYear) {
                years.add(transaction.fiscalYear);
            }
        });

        return Array.from(years).sort().reverse();
    }

    function getFiscalYearStartDate(fiscalYear: string): Date {
        const startYear = parseInt(fiscalYear.split("-")[0]);
        return new Date(startYear, 6, 1);
    }

    function getFiscalYearEndDate(fiscalYear: string): Date {
        const endYear = parseInt(fiscalYear.split("-")[1]);
        return new Date(endYear, 5, 30, 23, 59, 59);
    }

    // Finance Calculator
    function getTotalDeposits(scoutName: string): number {
        return filteredTransactions()
            .filter(
                (t) =>
                    t.scoutName === scoutName &&
                    (t.type === "Deposit" || t.type === "Reimbursement"),
            )
            .reduce((sum, t) => sum + t.amount, 0);
    }

    function getTotalWithdrawals(scoutName: string): number {
        return filteredTransactions()
            .filter(
                (t) =>
                    t.scoutName === scoutName &&
                    (t.type === "Withdrawal" || t.type === "Transfer to Pack"),
            )
            .reduce((sum, t) => sum + t.amount, 0);
    }

    function getCurrentBalance(scout: Scout): number {
        const deposits = getTotalDeposits(scout.name);
        const withdrawals = getTotalWithdrawals(scout.name);
        return scout.beginningBalance + deposits - withdrawals;
    }

    function getTotalEarnedFromFundraising(scoutName: string): number {
        return filteredTransactions()
            .filter((t) => t.scoutName === scoutName && t.type === "Deposit")
            .reduce((sum, t) => sum + t.amount * 0.75, 0);
    }

    function getTotalFamilyCash(scoutName: string): number {
        return filteredTransactions()
            .filter(
                (t) =>
                    t.scoutName === scoutName &&
                    (t.type === "Pack Dues Paid" || t.type === "Reimbursement"),
            )
            .reduce((sum, t) => sum + t.amount, 0);
    }

    function hasPackDuesPaid(scoutName: string): boolean {
        return filteredTransactions().some(
            (t) => t.scoutName === scoutName && t.description === "Pack Dues",
        );
    }

    function getPackDuesPaymentMethod(scoutName: string): string {
        const paidFromAccount = filteredTransactions().some(
            (t) =>
                t.scoutName === scoutName &&
                t.description === "Pack Dues" &&
                t.type === "Withdrawal",
        );
        const paidCash = filteredTransactions().some(
            (t) => t.scoutName === scoutName && t.type === "Pack Dues Paid",
        );

        if (paidFromAccount) return "Earmarked Funds";
        if (paidCash) return "Family Cash";
        return "";
    }

    function getPackShare(transaction: Transaction): number {
        if (
            transaction.type === "Deposit" ||
            transaction.type === "Reimbursement"
        ) {
            return transaction.amount * 0.25;
        }
        return 0;
    }

    $effect(() => {
        packFinances;
    });

    const packFinances = $derived(() => {
        const duesFromAccounts =
            filteredTransactions().filter(
                (t) => t.description === "Pack Dues" && t.type === "Withdrawal",
            ).length * 100;

        const duesFromCash =
            filteredTransactions().filter((t) => t.type === "Pack Dues Paid")
                .length * 100;

        const fundraisingShare = filteredTransactions()
            .filter((t) => t.type === "Deposit" || t.type === "Reimbursement")
            .reduce((sum, t) => sum + getPackShare(t), 0);

        const transfersFromScouts = filteredTransactions()
            .filter((t) => t.type === "Transfer to Pack")
            .reduce((sum, t) => sum + t.amount, 0);

        const otherIncome = filteredPackTransactions()
            .filter((t) => t.type === "Income")
            .reduce((sum, t) => sum + t.amount, 0);

        const totalDues = duesFromAccounts + duesFromCash;
        const totalRevenue =
            totalDues + fundraisingShare + otherIncome + transfersFromScouts;

        const expenses = filteredPackTransactions()
            .filter((t) => t.type === "Expense")
            .reduce((sum, t) => sum + t.amount, 0);

        const reimbursements = filteredTransactions()
            .filter((t) => t.type === "Reimbursement")
            .reduce((sum, t) => sum + t.amount, 0);

        const totalEarmarked = filteredScouts().reduce((sum, scout) => {
            const balance = getCurrentBalance(scout);
            return sum + (balance > 0 ? balance : 0);
        }, 0);

        const packCashOnHand = totalRevenue - expenses - reimbursements;
        const unallocatedFunds = packCashOnHand - totalEarmarked;

        return {
            duesFromAccounts,
            duesFromCash,
            totalDues,
            fundraisingShare,
            transfersFromScouts,
            otherIncome,
            totalRevenue,
            expenses,
            reimbursements,
            packCashOnHand,
            totalEarmarked,
            unallocatedFunds,
            balance: packCashOnHand,
        };
    });

    // Account health status
    const accountHealth = $derived(() => {
        const unallocated = packFinances().unallocatedFunds;
        const packCash = packFinances().packCashOnHand;

        if (unallocated < 0) return "critical";
        if (unallocated < packCash * 0.1) return "warning";
        return "healthy";
    });

    // Filtered data by fiscal year
    const filteredScouts = $derived(() => {
        let filtered = scouts;

        if (selectedFiscalYear !== "") {
            filtered = filtered.filter(
                (s) => s.fiscalYear === selectedFiscalYear,
            );
        }

        filtered = filtered.filter((s) => s.active || showInactiveScouts);

        return filtered;
    });

    const filteredTransactions = $derived(() => {
        if (selectedFiscalYear === "") {
            return transactions;
        }
        return transactions.filter((t) => t.fiscalYear === selectedFiscalYear);
    });

    const filteredPackTransactions = $derived(() => {
        if (selectedFiscalYear === "") {
            return packTransactions;
        }
        return packTransactions.filter(
            (t) => t.fiscalYear === selectedFiscalYear,
        );
    });

    // Recent activity for dashboard
    const recentActivity = $derived(() => {
        const allActivity = [
            ...filteredTransactions().map((t) => ({
                ...t,
                category: "scout" as const,
            })),
            ...filteredPackTransactions().map((t) => ({
                ...t,
                category: "pack" as const,
                scoutName: "Pack",
            })),
        ]
            .sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .slice(0, 10);

        return allActivity;
    });

    // Data loading
    async function loadData() {
        try {
            // Load all data in parallel
            const [loadedScouts, loadedTransactions, loadedPackTransactions] =
                await Promise.all([
                    api.getScouts(selectedFiscalYear || undefined),
                    api.getTransactions(selectedFiscalYear || undefined),
                    api.getPackTransactions(selectedFiscalYear || undefined),
                ]);

            scouts = loadedScouts;
            transactions = loadedTransactions.sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
            );
            packTransactions = loadedPackTransactions.sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
            );
        } catch (error) {
            console.error("Error loading data:", error);
            alert(
                `Failed to load data: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }

    // Scout actions
    async function addScout() {
        try {
            const now = new Date();
            const scoutInput: ScoutInput = {
                name: scoutForm.name!,
                beginningBalance: scoutForm.beginningBalance!,
                notes: scoutForm.notes!,
                active: true,
                fiscalYear: getFiscalYear(now),
            };

            await api.createScout(scoutInput);
            await loadData();
            showAddScoutModal = false;
            scoutForm = {
                name: "",
                beginningBalance: 0,
                notes: "",
                active: true,
            };
        } catch (error) {
            console.error("Error adding scout:", error);
            alert(
                `Failed to add scout: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }

    async function deleteScout(id: number) {
        if (
            !confirm(
                "Are you sure you want to delete this scout? This will not delete their transactions.",
            )
        ) {
            return;
        }

        try {
            await api.deleteScout(id);
            await loadData();
        } catch (error) {
            console.error("Error deleting scout:", error);
            alert(
                `Failed to delete scout: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }

    async function markScoutInactive(scout: Scout) {
        const currentBalance = getCurrentBalance(scout);

        if (currentBalance > 0) {
            const confirmMsg = `${scout.name} has a balance of $${currentBalance.toFixed(2)}. This will be transferred back to the pack and the scout will be marked inactive. Continue?`;
            if (!confirm(confirmMsg)) {
                return;
            }

            try {
                // Create transfer transaction
                const transferTransaction: TransactionInput = {
                    date: new Date().toISOString(),
                    scoutName: scout.name,
                    description: "Balance transfer - Scout marked inactive",
                    type: "Transfer to Pack",
                    amount: currentBalance,
                    notes: "Automatic transfer when marking scout inactive",
                    fiscalYear: getCurrentFiscalYear(),
                };
                await api.createTransaction(transferTransaction);
            } catch (error) {
                console.error("Error creating transfer transaction:", error);
                alert(
                    `Failed to create transfer: ${error instanceof Error ? error.message : "Unknown error"}`,
                );
                return;
            }
        } else {
            if (!confirm(`Mark ${scout.name} as inactive?`)) {
                return;
            }
        }

        try {
            await api.updateScout(scout.id!, { active: false });
            await loadData();
        } catch (error) {
            console.error("Error marking scout inactive:", error);
            alert(
                `Failed to mark scout inactive: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }

    async function markScoutActive(scout: Scout) {
        if (!confirm(`Mark ${scout.name} as active again?`)) {
            return;
        }

        try {
            await api.updateScout(scout.id!, { active: true });
            await loadData();
        } catch (error) {
            console.error("Error marking scout active:", error);
            alert(
                `Failed to mark scout active: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }

    // Transaction actions
    async function addTransaction() {
        try {
            const transactionDate = new Date(transactionForm.date!);
            const transactionInput: TransactionInput = {
                date: new Date(transactionForm.date!).toISOString(),
                scoutName: transactionForm.scoutName!,
                description: transactionForm.description!,
                type: transactionForm.type!,
                amount: transactionForm.amount!,
                notes: transactionForm.notes!,
                fiscalYear: getFiscalYear(transactionDate),
            };

            await api.createTransaction(transactionInput);
            await loadData();
            showAddTransactionModal = false;
            transactionForm = {
                date: new Date().toISOString().split("T")[0],
                scoutName: "",
                description: "",
                type: "Deposit",
                amount: 0,
                notes: "",
            };
        } catch (error) {
            console.error("Error adding transaction:", error);
            alert(
                `Failed to add transaction: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }

    async function deleteTransaction(id: number) {
        if (!confirm("Are you sure you want to delete this transaction?")) {
            return;
        }

        try {
            await api.deleteTransaction(id);
            await loadData();
        } catch (error) {
            console.error("Error deleting transaction:", error);
            alert(
                `Failed to delete transaction: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }

    // Pack transaction actions
    async function addPackTransaction() {
        try {
            const transactionDate = new Date(packTransactionForm.date!);
            const packTransactionInput: PackTransactionInput = {
                date: new Date(packTransactionForm.date!).toISOString(),
                description: packTransactionForm.description!,
                type: packTransactionForm.type!,
                amount: packTransactionForm.amount!,
                category: packTransactionForm.category!,
                notes: packTransactionForm.notes!,
                fiscalYear: getFiscalYear(transactionDate),
            };

            await api.createPackTransaction(packTransactionInput);
            await loadData();
            showAddPackTransactionModal = false;
            packTransactionForm = {
                date: new Date().toISOString().split("T")[0],
                description: "",
                type: "Income",
                amount: 0,
                category: "",
                notes: "",
            };
        } catch (error) {
            console.error("Error adding pack transaction:", error);
            alert(
                `Failed to add pack transaction: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }

    async function deletePackTransaction(id: number) {
        if (!confirm("Are you sure you want to delete this transaction?")) {
            return;
        }

        try {
            await api.deletePackTransaction(id);
            await loadData();
        } catch (error) {
            console.error("Error deleting pack transaction:", error);
            alert(
                `Failed to delete pack transaction: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }

    function getTypeBadgeClass(type: string): string {
        switch (type) {
            case "Deposit":
                return "badge-success";
            case "Withdrawal":
                return "badge-warning";
            case "Pack Dues Paid":
                return "badge-info";
            case "Reimbursement":
                return "badge-success";
            case "Transfer to Pack":
                return "badge-warning";
            default:
                return "";
        }
    }

    // New Fiscal Year Management
    async function createNewFiscalYear() {
        const currentYear = getCurrentFiscalYear();
        const currentYearEnd = parseInt(currentYear.split("-")[1]);
        const newFiscalYear = `${currentYearEnd}-${currentYearEnd + 1}`;

        const existingYears = getAvailableFiscalYears();
        if (existingYears.includes(newFiscalYear)) {
            alert(
                `Fiscal year ${newFiscalYear} already exists. Please select it from the dropdown.`,
            );
            return;
        }

        const confirmMsg =
            `This will create a new fiscal year ${newFiscalYear} starting on July 1, ${currentYearEnd}.\n\n` +
            `Options:\n` +
            `- Carry forward balances: ${newFiscalYearOptions.carryForwardBalances ? "Yes" : "No"}\n` +
            `- Mark scouts in ${currentYear} as inactive: ${newFiscalYearOptions.markPreviousInactive ? "Yes" : "No"}\n\n` +
            `Continue?`;

        if (!confirm(confirmMsg)) {
            return;
        }

        try {
            if (newFiscalYearOptions.carryForwardBalances) {
                const activeScouts = scouts.filter((s) => s.active);

                for (const scout of activeScouts) {
                    const currentBalance = getCurrentBalance(scout);

                    if (
                        currentBalance > 0 ||
                        !newFiscalYearOptions.markPreviousInactive
                    ) {
                        const newScoutInput: ScoutInput = {
                            name: scout.name,
                            beginningBalance: currentBalance,
                            notes: `Carried forward from ${currentYear}`,
                            active: true,
                            fiscalYear: newFiscalYear,
                        };

                        await api.createScout(newScoutInput);
                    }

                    if (newFiscalYearOptions.markPreviousInactive) {
                        await api.updateScout(scout.id!, { active: false });
                    }
                }
            }

            // Reload all scouts to get the new fiscal year data
            selectedFiscalYear = newFiscalYear;
            localStorage.setItem("selectedFiscalYear", newFiscalYear);
            await loadData();

            showNewFiscalYearModal = false;

            alert(
                `Fiscal year ${newFiscalYear} created successfully! You are now viewing the new fiscal year.`,
            );
        } catch (error) {
            console.error("Error creating new fiscal year:", error);
            alert(
                `Failed to create new fiscal year: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }

    // Reactive effect to reload data when fiscal year changes
    $effect(() => {
        if (selectedFiscalYear !== undefined && selectedFiscalYear !== "") {
            loadData();
        }
    });

    onMount(async () => {
        const savedYear = localStorage.getItem("selectedFiscalYear");
        if (savedYear) {
            selectedFiscalYear = savedYear;
        } else {
            selectedFiscalYear = getCurrentFiscalYear();
            localStorage.setItem("selectedFiscalYear", selectedFiscalYear);
        }

        await loadData();
    });
</script>

<div class="max-w-7xl mx-auto px-4 py-6 space-y-4">
    <!-- Compact Header -->
    <div
        class="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3"
    >
        <div>
            <h1 class="text-xl font-semibold text-gray-900">Pack Finances</h1>
            <p class="text-xs text-gray-600">Financial management tracker</p>
        </div>
        <form method="POST" action="?/logout" use:enhance>
            <button
                type="submit"
                class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
                Logout
            </button>
        </form>
    </div>

    <!-- Compact Fiscal Year Selector -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
        <div class="flex items-center gap-3 flex-wrap">
            <label
                for="fiscal-year-select"
                class="text-sm font-medium text-gray-700"
            >
                Fiscal Year:
            </label>
            <select
                id="fiscal-year-select"
                bind:value={selectedFiscalYear}
                onchange={() => {
                    localStorage.setItem(
                        "selectedFiscalYear",
                        selectedFiscalYear,
                    );
                }}
                class="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">All Years</option>
                {#each getAvailableFiscalYears() as year}
                    <option value={year}>{year}</option>
                {/each}
            </select>
            <button
                class="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                onclick={() => (showNewFiscalYearModal = true)}
            >
                New Year
            </button>
        </div>
    </div>

    <!-- Compact Tabs -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <nav class="flex border-b border-gray-200 overflow-x-auto">
            <button
                class="px-4 py-3 text-sm font-medium border-b-2 transition-colors {activeTab ===
                'dashboard'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}"
                onclick={() => (activeTab = "dashboard")}
            >
                Dashboard
            </button>
            <button
                class="px-4 py-3 text-sm font-medium border-b-2 transition-colors {activeTab ===
                'scout-balances'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}"
                onclick={() => (activeTab = "scout-balances")}
            >
                Scouts
            </button>
            <button
                class="px-4 py-3 text-sm font-medium border-b-2 transition-colors {activeTab ===
                'transactions'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}"
                onclick={() => (activeTab = "transactions")}
            >
                Transactions
            </button>
            <button
                class="px-4 py-3 text-sm font-medium border-b-2 transition-colors {activeTab ===
                'reconciliation'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}"
                onclick={() => (activeTab = "reconciliation")}
            >
                Reconcile
            </button>
            <button
                class="px-4 py-3 text-sm font-medium border-b-2 transition-colors {activeTab ===
                'year-summary'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}"
                onclick={() => (activeTab = "year-summary")}
            >
                Summary
            </button>
        </nav>

        <!-- DASHBOARD TAB -->
        {#if activeTab === "dashboard"}
            <div class="p-4">
                <Dashboard
                    {scouts}
                    {transactions}
                    {packTransactions}
                    {packFinances}
                    {accountHealth}
                    {filteredScouts}
                    {filteredTransactions}
                    {filteredPackTransactions}
                    {recentActivity}
                    {getTypeBadgeClass}
                    onAddScout={() => (showAddScoutModal = true)}
                    onAddTransaction={() => (showAddTransactionModal = true)}
                    onAddPackTransaction={() =>
                        (showAddPackTransactionModal = true)}
                    onNewFiscalYear={() => (showNewFiscalYearModal = true)}
                />
            </div>
        {/if}

        <!-- SCOUT BALANCES TAB -->
        {#if activeTab === "scout-balances"}
            <div class="p-4">
                <ScoutBalances
                    {scouts}
                    {showInactiveScouts}
                    {filteredScouts}
                    {getCurrentBalance}
                    {getTotalEarnedFromFundraising}
                    {getTotalFamilyCash}
                    {getTotalWithdrawals}
                    {hasPackDuesPaid}
                    onToggleInactive={() =>
                        (showInactiveScouts = !showInactiveScouts)}
                    onAddScout={() => (showAddScoutModal = true)}
                    onMarkInactive={markScoutInactive}
                    onMarkActive={markScoutActive}
                    onDeleteScout={deleteScout}
                />
            </div>
        {/if}

        <!-- TRANSACTIONS TAB -->
        {#if activeTab === "transactions"}
            <div class="p-4">
                <Transactions
                    {transactionViewMode}
                    {transactions}
                    {packTransactions}
                    {selectedFiscalYear}
                    {filteredTransactions}
                    {filteredPackTransactions}
                    {getTypeBadgeClass}
                    {getPackShare}
                    onViewModeChange={(mode) => (transactionViewMode = mode)}
                    onAddTransaction={() => (showAddTransactionModal = true)}
                    onAddPackTransaction={() =>
                        (showAddPackTransactionModal = true)}
                    onDeleteTransaction={deleteTransaction}
                    onDeletePackTransaction={deletePackTransaction}
                />
            </div>
        {/if}

        <!-- RECONCILIATION TAB -->
        {#if activeTab === "reconciliation"}
            <Reconciliation {scouts} {packFinances} {getCurrentBalance} />
        {/if}

        <!-- YEAR SUMMARY TAB -->
        {#if activeTab === "year-summary"}
            <YearSummary
                {scouts}
                {transactions}
                {packTransactions}
                {getAvailableFiscalYears}
                {getPackShare}
                onSelectYear={(year) => {
                    selectedFiscalYear = year;
                    localStorage.setItem("selectedFiscalYear", year);
                    activeTab = "dashboard";
                }}
            />
        {/if}
    </div>
</div>

<!-- Add Scout Modal -->
<AddScoutModal
    show={showAddScoutModal}
    {scoutForm}
    onClose={() => (showAddScoutModal = false)}
    onSubmit={addScout}
    onUpdateForm={(field, value) => {
        scoutForm = { ...scoutForm, [field]: value };
    }}
/>

<!-- Add Transaction Modal -->
<AddTransactionModal
    show={showAddTransactionModal}
    {scouts}
    {transactionForm}
    onClose={() => (showAddTransactionModal = false)}
    onSubmit={addTransaction}
    onUpdateForm={(field, value) => {
        transactionForm = { ...transactionForm, [field]: value };
    }}
/>

<!-- Add Pack Transaction Modal -->
<AddPackTransactionModal
    show={showAddPackTransactionModal}
    {packTransactionForm}
    onClose={() => (showAddPackTransactionModal = false)}
    onSubmit={addPackTransaction}
    onUpdateForm={(field, value) => {
        packTransactionForm = { ...packTransactionForm, [field]: value };
    }}
/>

<!-- New Fiscal Year Modal -->
<NewFiscalYearModal
    show={showNewFiscalYearModal}
    {getCurrentFiscalYear}
    {newFiscalYearOptions}
    onClose={() => (showNewFiscalYearModal = false)}
    onSubmit={createNewFiscalYear}
    onUpdateOptions={(field, value) => {
        newFiscalYearOptions = { ...newFiscalYearOptions, [field]: value };
    }}
/>

<style>
    .inactive-row {
        opacity: 0.6;
        background-color: #f5f5f5;
    }

    .warning-box {
        background-color: #fff3cd;
        border: 1px solid #ffc107;
        border-radius: 4px;
        padding: 0.75rem;
        color: #856404;
    }

    .success-box {
        background-color: #d4edda;
        border: 1px solid #28a745;
        border-radius: 4px;
        padding: 0.75rem;
        color: #155724;
    }

    .total-row {
        font-weight: bold;
        background-color: #f8f9fa;
        border-top: 2px solid #dee2e6;
    }

    .badge-secondary {
        background-color: #6c757d;
        color: white;
    }

    /* Enhanced Fiscal Year Selector */
    .fiscal-year-selector-prominent {
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        border: 2px solid #003f87;
        border-radius: 10px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .fiscal-year-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .fiscal-year-label {
        margin: 0;
        font-size: 1.2rem;
        color: #003f87;
    }

    .fiscal-year-dropdown {
        padding: 0.6rem 1.2rem;
        font-size: 1.1rem;
        font-weight: 600;
        border: 2px solid #003f87;
        border-radius: 6px;
        background-color: white;
        cursor: pointer;
        min-width: 180px;
        transition: all 0.3s ease;
    }

    .fiscal-year-dropdown:hover {
        border-color: #002f67;
        box-shadow: 0 2px 6px rgba(0, 63, 135, 0.2);
    }

    .fiscal-year-dropdown:focus {
        outline: none;
        border-color: #002f67;
        box-shadow: 0 0 0 4px rgba(0, 63, 135, 0.15);
    }

    /* Dashboard Grid */
    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .metric-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
    }

    .metric-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    }

    .metric-card.highlight {
        background: linear-gradient(135deg, #003f87, #005bb5);
        color: white;
    }

    .metric-icon {
        font-size: 3rem;
        line-height: 1;
    }

    .metric-content {
        flex: 1;
    }

    .metric-label {
        font-size: 0.9rem;
        opacity: 0.8;
        margin-bottom: 0.5rem;
    }

    .metric-card.highlight .metric-label {
        opacity: 0.9;
    }

    .metric-value {
        font-size: 1.8rem;
        font-weight: 700;
        font-family: "Courier New", monospace;
    }

    .metric-value.large {
        font-size: 2.5rem;
    }

    .metric-value.small {
        font-size: 1.2rem;
    }

    .status-badge {
        display: inline-block;
        padding: 0.4rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .status-healthy {
        background-color: #28a745;
        color: white;
    }

    .status-warning {
        background-color: #ffc107;
        color: #212529;
    }

    .status-critical {
        background-color: #dc3545;
        color: white;
    }

    /* Quick Stats Grid */
    .quick-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background: white;
        border-radius: 8px;
        padding: 1.25rem;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        border-left: 4px solid #003f87;
    }

    .stat-label {
        font-size: 0.9rem;
        color: #6c757d;
        margin-bottom: 0.5rem;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        font-family: "Courier New", monospace;
    }

    /* Reconciliation Mini */
    .reconciliation-mini {
        text-align: center;
        margin: 2rem 0;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
    }

    /* Quick Actions */
    .quick-actions {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem 1.5rem;
        background: white;
        border: 2px solid #003f87;
        border-radius: 8px;
        color: #003f87;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .action-btn:hover {
        background: #003f87;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0, 63, 135, 0.3);
    }

    .action-icon {
        font-size: 1.5rem;
    }

    /* Activity Feed */
    .activity-feed {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        max-height: 500px;
        overflow-y: auto;
    }

    .activity-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid #e9ecef;
        transition: background-color 0.2s ease;
    }

    .activity-item:last-child {
        border-bottom: none;
    }

    .activity-item:hover {
        background-color: #f8f9fa;
    }

    .activity-date {
        font-size: 0.85rem;
        color: #6c757d;
        min-width: 100px;
    }

    .activity-details {
        flex: 1;
    }

    .activity-title {
        margin-bottom: 0.25rem;
    }

    .activity-meta {
        font-size: 0.85rem;
    }

    .activity-amount {
        font-size: 1.2rem;
        font-weight: 700;
        font-family: "Courier New", monospace;
        min-width: 100px;
        text-align: right;
    }

    /* Transaction Toggle */
    .transaction-toggle {
        display: flex;
        gap: 0.5rem;
        background: #e9ecef;
        padding: 0.3rem;
        border-radius: 8px;
    }

    .toggle-btn {
        padding: 0.6rem 1.2rem;
        background: transparent;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        color: #6c757d;
    }

    .toggle-btn.active {
        background: #003f87;
        color: white;
    }

    .toggle-btn:hover:not(.active) {
        background: #dee2e6;
    }

    /* Section Actions */
    .section-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
        .dashboard-grid {
            grid-template-columns: 1fr;
        }

        .quick-stats-grid {
            grid-template-columns: 1fr;
        }

        .quick-actions {
            grid-template-columns: 1fr;
        }

        .activity-item {
            flex-direction: column;
            align-items: flex-start;
        }

        .activity-date {
            min-width: auto;
        }

        .activity-amount {
            width: 100%;
            text-align: left;
        }

        .fiscal-year-container {
            flex-direction: column;
            align-items: flex-start;
        }

        .metric-value.large {
            font-size: 2rem;
        }

        .transaction-toggle {
            flex-direction: column;
        }

        .section-actions {
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
        }
    }

    .text-center {
        text-align: center;
    }
</style>
