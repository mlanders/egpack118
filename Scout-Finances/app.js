// Database Manager using IndexedDB
class DatabaseManager {
    constructor() {
        this.dbName = 'ScoutPackFinances';
        this.version = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Scouts store
                if (!db.objectStoreNames.contains('scouts')) {
                    const scoutStore = db.createObjectStore('scouts', { keyPath: 'id', autoIncrement: true });
                    scoutStore.createIndex('name', 'name', { unique: false });
                }

                // Transactions store (scout account transactions)
                if (!db.objectStoreNames.contains('transactions')) {
                    const transactionStore = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
                    transactionStore.createIndex('scoutName', 'scoutName', { unique: false });
                    transactionStore.createIndex('date', 'date', { unique: false });
                    transactionStore.createIndex('type', 'type', { unique: false });
                }

                // Pack transactions store
                if (!db.objectStoreNames.contains('packTransactions')) {
                    const packStore = db.createObjectStore('packTransactions', { keyPath: 'id', autoIncrement: true });
                    packStore.createIndex('date', 'date', { unique: false });
                    packStore.createIndex('type', 'type', { unique: false });
                }
            };
        });
    }

    async addScout(scout) {
        return this.performTransaction('scouts', 'readwrite', (store) => {
            return store.add(scout);
        });
    }

    async getAllScouts() {
        return this.performTransaction('scouts', 'readonly', (store) => {
            return store.getAll();
        });
    }

    async updateScout(scout) {
        return this.performTransaction('scouts', 'readwrite', (store) => {
            return store.put(scout);
        });
    }

    async deleteScout(id) {
        return this.performTransaction('scouts', 'readwrite', (store) => {
            return store.delete(id);
        });
    }

    async addTransaction(transaction) {
        return this.performTransaction('transactions', 'readwrite', (store) => {
            return store.add(transaction);
        });
    }

    async getAllTransactions() {
        return this.performTransaction('transactions', 'readonly', (store) => {
            return store.getAll();
        });
    }

    async updateTransaction(transaction) {
        return this.performTransaction('transactions', 'readwrite', (store) => {
            return store.put(transaction);
        });
    }

    async deleteTransaction(id) {
        return this.performTransaction('transactions', 'readwrite', (store) => {
            return store.delete(id);
        });
    }

    async addPackTransaction(transaction) {
        return this.performTransaction('packTransactions', 'readwrite', (store) => {
            return store.add(transaction);
        });
    }

    async getAllPackTransactions() {
        return this.performTransaction('packTransactions', 'readonly', (store) => {
            return store.getAll();
        });
    }

    async updatePackTransaction(transaction) {
        return this.performTransaction('packTransactions', 'readwrite', (store) => {
            return store.put(transaction);
        });
    }

    async deletePackTransaction(id) {
        return this.performTransaction('packTransactions', 'readwrite', (store) => {
            return store.delete(id);
        });
    }

    performTransaction(storeName, mode, callback) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], mode);
            const store = transaction.objectStore(storeName);
            const request = callback(store);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

// Calculator for all formulas from Excel
class FinanceCalculator {
    // Calculate total deposits for a scout
    static getTotalDeposits(scoutName, transactions) {
        return transactions
            .filter(t => t.scoutName === scoutName && (t.type === 'Deposit' || t.type === 'Reimbursement'))
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    }

    // Calculate total withdrawals for a scout
    static getTotalWithdrawals(scoutName, transactions) {
        return transactions
            .filter(t => t.scoutName === scoutName && t.type === 'Withdrawal')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    }

    // Calculate current balance for a scout
    static getCurrentBalance(scout, transactions) {
        const deposits = this.getTotalDeposits(scout.name, transactions);
        const withdrawals = this.getTotalWithdrawals(scout.name, transactions);
        return parseFloat(scout.beginningBalance || 0) + deposits - withdrawals;
    }

    // Check if scout paid pack dues
    static hasPackDuesPaid(scoutName, transactions) {
        return transactions.some(t =>
            t.scoutName === scoutName && t.description === 'Pack Dues'
        );
    }

    // Determine payment method for pack dues
    static getPackDuesPaymentMethod(scoutName, transactions) {
        const paidFromAccount = transactions.some(t =>
            t.scoutName === scoutName &&
            t.description === 'Pack Dues' &&
            t.type === 'Withdrawal'
        );

        const paidCash = transactions.some(t =>
            t.scoutName === scoutName &&
            t.type === 'Pack Dues Paid'
        );

        if (paidFromAccount) return 'Scout Account';
        if (paidCash) return 'Family Cash';
        return '';
    }

    // Calculate pack's 25% share from a transaction
    static getPackShare(transaction) {
        if (transaction.type === 'Deposit' || transaction.type === 'Reimbursement') {
            return parseFloat(transaction.amount) * 0.25;
        }
        return 0;
    }

    // Calculate total fundraising share (25% of all deposits)
    static getTotalFundraisingShare(transactions) {
        return transactions
            .filter(t => t.type === 'Deposit' || t.type === 'Reimbursement')
            .reduce((sum, t) => sum + this.getPackShare(t), 0);
    }

    // Calculate pack dues from scout accounts
    static getPackDuesFromAccounts(transactions) {
        const count = transactions.filter(t =>
            t.description === 'Pack Dues' && t.type === 'Withdrawal'
        ).length;
        return count * 100;
    }

    // Calculate pack dues from family cash
    static getPackDuesFromCash(transactions) {
        const count = transactions.filter(t =>
            t.type === 'Pack Dues Paid'
        ).length;
        return count * 100;
    }

    // Calculate total reimbursements
    static getTotalReimbursements(transactions) {
        return transactions
            .filter(t => t.type === 'Reimbursement')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    }

    // Calculate other pack income
    static getOtherPackIncome(packTransactions) {
        return packTransactions
            .filter(t => t.type === 'Income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    }

    // Calculate total pack expenses
    static getTotalPackExpenses(packTransactions) {
        return packTransactions
            .filter(t => t.type === 'Expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    }

    // Calculate pack balance
    static getPackBalance(transactions, packTransactions) {
        const duesFromAccounts = this.getPackDuesFromAccounts(transactions);
        const duesFromCash = this.getPackDuesFromCash(transactions);
        const fundraisingShare = this.getTotalFundraisingShare(transactions);
        const otherIncome = this.getOtherPackIncome(packTransactions);
        const totalRevenue = duesFromAccounts + duesFromCash + fundraisingShare + otherIncome;

        const expenses = this.getTotalPackExpenses(packTransactions);
        const reimbursements = this.getTotalReimbursements(transactions);

        return totalRevenue - expenses - reimbursements;
    }
}

// Main Application
class ScoutFinanceApp {
    constructor() {
        this.db = new DatabaseManager();
        this.scouts = [];
        this.transactions = [];
        this.packTransactions = [];
        this.currentEditingTransaction = null;
        this.currentEditingPackTransaction = null;
    }

    async init() {
        await this.db.init();
        await this.loadData();
        this.setupEventListeners();
        this.setupTabs();
        this.render();

        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('transaction-date').value = today;
        document.getElementById('pack-transaction-date').value = today;
    }

    async loadData() {
        this.scouts = await this.db.getAllScouts();
        this.transactions = await this.db.getAllTransactions();
        this.packTransactions = await this.db.getAllPackTransactions();

        // Sort by date (newest first)
        this.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        this.packTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;

                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                button.classList.add('active');
                document.getElementById(tabName).classList.add('active');
            });
        });
    }

    setupEventListeners() {
        // Add Scout
        document.getElementById('add-scout-btn').addEventListener('click', () => {
            this.openModal('add-scout-modal');
        });

        document.getElementById('add-scout-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleAddScout();
        });

        // Add Transaction
        document.getElementById('add-transaction-btn').addEventListener('click', () => {
            this.currentEditingTransaction = null;
            document.getElementById('transaction-modal-title').textContent = 'Add New Transaction';
            this.openModal('add-transaction-modal');
            this.updateScoutDropdown();
        });

        document.getElementById('add-transaction-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleAddTransaction();
        });

        // Add Pack Transaction
        document.getElementById('add-pack-transaction-btn').addEventListener('click', () => {
            this.currentEditingPackTransaction = null;
            this.openModal('add-pack-transaction-modal');
        });

        document.getElementById('add-pack-transaction-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleAddPackTransaction();
        });

        // Close modals
        document.querySelectorAll('.close, .cancel-btn').forEach(element => {
            element.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal.id);
            });
        });

        // Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        // Reset forms
        const form = document.querySelector(`#${modalId} form`);
        if (form) form.reset();
    }

    async handleAddScout() {
        const name = document.getElementById('scout-name').value.trim();
        const beginningBalance = parseFloat(document.getElementById('beginning-balance').value) || 0;
        const notes = document.getElementById('scout-notes').value.trim();

        const scout = {
            name,
            beginningBalance,
            notes,
            createdAt: new Date().toISOString()
        };

        await this.db.addScout(scout);
        await this.loadData();
        this.render();
        this.closeModal('add-scout-modal');
    }

    async handleAddTransaction() {
        const date = document.getElementById('transaction-date').value;
        const scoutName = document.getElementById('transaction-scout').value;
        const description = document.getElementById('transaction-description').value.trim();
        const type = document.getElementById('transaction-type').value;
        const amount = parseFloat(document.getElementById('transaction-amount').value);
        const notes = document.getElementById('transaction-notes').value.trim();

        const transaction = {
            date,
            scoutName,
            description,
            type,
            amount,
            notes,
            createdAt: new Date().toISOString()
        };

        if (this.currentEditingTransaction) {
            transaction.id = this.currentEditingTransaction.id;
            await this.db.updateTransaction(transaction);
        } else {
            await this.db.addTransaction(transaction);
        }

        await this.loadData();
        this.render();
        this.closeModal('add-transaction-modal');
        this.currentEditingTransaction = null;
    }

    async handleAddPackTransaction() {
        const date = document.getElementById('pack-transaction-date').value;
        const description = document.getElementById('pack-transaction-description').value.trim();
        const type = document.getElementById('pack-transaction-type').value;
        const amount = parseFloat(document.getElementById('pack-transaction-amount').value);
        const category = document.getElementById('pack-transaction-category').value.trim();
        const notes = document.getElementById('pack-transaction-notes').value.trim();

        const transaction = {
            date,
            description,
            type,
            amount,
            category,
            notes,
            createdAt: new Date().toISOString()
        };

        if (this.currentEditingPackTransaction) {
            transaction.id = this.currentEditingPackTransaction.id;
            await this.db.updatePackTransaction(transaction);
        } else {
            await this.db.addPackTransaction(transaction);
        }

        await this.loadData();
        this.render();
        this.closeModal('add-pack-transaction-modal');
        this.currentEditingPackTransaction = null;
    }

    updateScoutDropdown() {
        const select = document.getElementById('transaction-scout');
        select.innerHTML = '<option value="">Select a scout...</option>';

        this.scouts.forEach(scout => {
            const option = document.createElement('option');
            option.value = scout.name;
            option.textContent = scout.name;
            select.appendChild(option);
        });
    }

    async deleteScout(id) {
        if (!confirm('Are you sure you want to delete this scout? This will not delete their transactions.')) {
            return;
        }

        await this.db.deleteScout(id);
        await this.loadData();
        this.render();
    }

    async deleteTransaction(id) {
        if (!confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        await this.db.deleteTransaction(id);
        await this.loadData();
        this.render();
    }

    async deletePackTransaction(id) {
        if (!confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        await this.db.deletePackTransaction(id);
        await this.loadData();
        this.render();
    }

    render() {
        this.renderScoutAccounts();
        this.renderLedger();
        this.renderPackFinances();
    }

    renderScoutAccounts() {
        const tbody = document.getElementById('scout-accounts-tbody');

        if (this.scouts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center">
                        <div class="empty-state">
                            <h3>No scouts added yet</h3>
                            <p>Click "Add Scout" to get started</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.scouts.map(scout => {
            const deposits = FinanceCalculator.getTotalDeposits(scout.name, this.transactions);
            const withdrawals = FinanceCalculator.getTotalWithdrawals(scout.name, this.transactions);
            const balance = FinanceCalculator.getCurrentBalance(scout, this.transactions);
            const duesPaid = FinanceCalculator.hasPackDuesPaid(scout.name, this.transactions);
            const paymentMethod = FinanceCalculator.getPackDuesPaymentMethod(scout.name, this.transactions);

            return `
                <tr>
                    <td><strong>${this.escapeHtml(scout.name)}</strong></td>
                    <td class="amount">$${scout.beginningBalance.toFixed(2)}</td>
                    <td class="amount positive">$${deposits.toFixed(2)}</td>
                    <td class="amount negative">$${withdrawals.toFixed(2)}</td>
                    <td class="amount"><strong>$${balance.toFixed(2)}</strong></td>
                    <td>
                        ${duesPaid ? '<span class="badge badge-success">✓ Paid</span>' : ''}
                    </td>
                    <td>${paymentMethod ? `<span class="badge badge-info">${paymentMethod}</span>` : ''}</td>
                    <td>${this.escapeHtml(scout.notes || '')}</td>
                    <td>
                        <button class="btn btn-danger btn-small" onclick="app.deleteScout(${scout.id})">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderLedger() {
        const tbody = document.getElementById('ledger-tbody');

        if (this.transactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        <div class="empty-state">
                            <h3>No transactions yet</h3>
                            <p>Click "Add Transaction" to record your first transaction</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.transactions.map(transaction => {
            const packShare = FinanceCalculator.getPackShare(transaction);
            const formattedDate = new Date(transaction.date).toLocaleDateString();

            return `
                <tr>
                    <td>${formattedDate}</td>
                    <td><strong>${this.escapeHtml(transaction.scoutName)}</strong></td>
                    <td>${this.escapeHtml(transaction.description)}</td>
                    <td><span class="badge ${this.getTypeBadgeClass(transaction.type)}">${transaction.type}</span></td>
                    <td class="amount">$${transaction.amount.toFixed(2)}</td>
                    <td class="amount">${packShare > 0 ? `$${packShare.toFixed(2)}` : ''}</td>
                    <td>${this.escapeHtml(transaction.notes || '')}</td>
                    <td>
                        <button class="btn btn-danger btn-small" onclick="app.deleteTransaction(${transaction.id})">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderPackFinances() {
        // Calculate all pack finance metrics
        const duesFromAccounts = FinanceCalculator.getPackDuesFromAccounts(this.transactions);
        const duesFromCash = FinanceCalculator.getPackDuesFromCash(this.transactions);
        const totalDues = duesFromAccounts + duesFromCash;
        const fundraisingShare = FinanceCalculator.getTotalFundraisingShare(this.transactions);
        const otherIncome = FinanceCalculator.getOtherPackIncome(this.packTransactions);
        const totalRevenue = totalDues + fundraisingShare + otherIncome;
        const expenses = FinanceCalculator.getTotalPackExpenses(this.packTransactions);
        const reimbursements = FinanceCalculator.getTotalReimbursements(this.transactions);
        const packBalance = totalRevenue - expenses - reimbursements;

        // Update summary
        document.getElementById('pack-dues-accounts').textContent = `$${duesFromAccounts.toFixed(2)}`;
        document.getElementById('pack-dues-cash').textContent = `$${duesFromCash.toFixed(2)}`;
        document.getElementById('pack-dues-total').textContent = `$${totalDues.toFixed(2)}`;
        document.getElementById('fundraising-share').textContent = `$${fundraisingShare.toFixed(2)}`;
        document.getElementById('other-income').textContent = `$${otherIncome.toFixed(2)}`;
        document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('total-expenses').textContent = `$${expenses.toFixed(2)}`;
        document.getElementById('total-reimbursements').textContent = `$${reimbursements.toFixed(2)}`;
        document.getElementById('pack-balance').textContent = `$${packBalance.toFixed(2)}`;

        // Render pack transactions table
        const tbody = document.getElementById('pack-transactions-tbody');

        if (this.packTransactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        <div class="empty-state">
                            <h3>No pack transactions yet</h3>
                            <p>Click "Add Pack Transaction" to record income or expenses</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.packTransactions.map(transaction => {
            const formattedDate = new Date(transaction.date).toLocaleDateString();

            return `
                <tr>
                    <td>${formattedDate}</td>
                    <td><strong>${this.escapeHtml(transaction.description)}</strong></td>
                    <td><span class="badge ${transaction.type === 'Income' ? 'badge-success' : 'badge-warning'}">${transaction.type}</span></td>
                    <td class="amount ${transaction.type === 'Income' ? 'positive' : 'negative'}">$${transaction.amount.toFixed(2)}</td>
                    <td>${this.escapeHtml(transaction.category || '')}</td>
                    <td>${this.escapeHtml(transaction.notes || '')}</td>
                    <td>
                        <button class="btn btn-danger btn-small" onclick="app.deletePackTransaction(${transaction.id})">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    getTypeBadgeClass(type) {
        switch (type) {
            case 'Deposit':
                return 'badge-success';
            case 'Withdrawal':
                return 'badge-warning';
            case 'Pack Dues Paid':
                return 'badge-info';
            case 'Reimbursement':
                return 'badge-success';
            default:
                return '';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', async () => {
    app = new ScoutFinanceApp();
    await app.init();
});
