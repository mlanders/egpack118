// Sample Data Loader
// Run this in the browser console to populate the app with sample data from the Excel file

async function loadSampleData() {
    console.log('Loading sample data...');

    // Sample scouts
    const scouts = [
        { name: 'Scout 1', beginningBalance: 0, notes: '' },
        { name: 'Scout 2', beginningBalance: 0, notes: '' },
        { name: 'Scout 3', beginningBalance: 0, notes: '' },
        { name: 'Scout 4', beginningBalance: 0, notes: '' }
    ];

    // Sample scout transactions
    const transactions = [
        {
            date: '2025-01-01',
            scoutName: 'Scout 1',
            description: 'Popcorn Sales',
            type: 'Deposit',
            amount: 200.00,
            notes: 'Fall fundraiser'
        },
        {
            date: '2025-01-01',
            scoutName: 'Scout 2',
            description: 'Pack Dues',
            type: 'Pack Dues Paid',
            amount: 100.00,
            notes: 'Family paid cash up front'
        },
        {
            date: '2025-01-15',
            scoutName: 'Scout 2',
            description: 'Wreath Sales',
            type: 'Deposit',
            amount: 150.00,
            notes: 'Winter fundraiser'
        },
        {
            date: '2025-01-20',
            scoutName: 'Scout 2',
            description: 'Pack Dues Reimbursement',
            type: 'Reimbursement',
            amount: 100.00,
            notes: 'Reimburse family for cash payment'
        },
        {
            date: '2025-02-01',
            scoutName: 'Scout 3',
            description: 'Camp Fee',
            type: 'Withdrawal',
            amount: 300.00,
            notes: 'Family Campout registration'
        },
        {
            date: '2025-02-10',
            scoutName: 'Scout 4',
            description: 'Car Wash',
            type: 'Deposit',
            amount: 75.00,
            notes: 'Den fundraiser'
        }
    ];

    // Sample pack transactions
    const packTransactions = [
        {
            date: '2025-01-01',
            description: 'Adult Leader Registrations',
            type: 'Expense',
            amount: 875.00,
            category: 'Registration',
            notes: '7 leaders @ $125'
        },
        {
            date: '2025-01-15',
            description: 'Awards & Patches Purchase',
            type: 'Expense',
            amount: 245.00,
            category: 'Awards',
            notes: 'Belt loops and patches'
        },
        {
            date: '2025-02-01',
            description: 'Blue & Gold Banquet Supplies',
            type: 'Expense',
            amount: 380.00,
            category: 'Events',
            notes: 'Decorations and awards'
        },
        {
            date: '2025-02-01',
            description: 'Direct Donation from Local Business',
            type: 'Income',
            amount: 500.00,
            category: 'Donation',
            notes: 'Thanks to XYZ Corp'
        },
        {
            date: '2025-02-15',
            description: 'Charter Renewal Fee',
            type: 'Expense',
            amount: 300.00,
            category: 'Charter',
            notes: 'Annual recharter'
        }
    ];

    // Add all scouts
    for (const scout of scouts) {
        await app.db.addScout({
            ...scout,
            createdAt: new Date().toISOString()
        });
    }

    // Add all scout transactions
    for (const transaction of transactions) {
        await app.db.addTransaction({
            ...transaction,
            createdAt: new Date().toISOString()
        });
    }

    // Add all pack transactions
    for (const transaction of packTransactions) {
        await app.db.addPackTransaction({
            ...transaction,
            createdAt: new Date().toISOString()
        });
    }

    // Reload and render
    await app.loadData();
    app.render();

    console.log('Sample data loaded successfully!');
    console.log(`Added ${scouts.length} scouts`);
    console.log(`Added ${transactions.length} scout transactions`);
    console.log(`Added ${packTransactions.length} pack transactions`);
}

// To use: Open browser console and run: loadSampleData()
console.log('Sample data loader ready. Run loadSampleData() to populate the app.');
