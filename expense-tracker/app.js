// Updated Mock Data (Exact amounts matching second screenshot: $23,470.35 total)
const initialTransactions = [
    { id: 1, type: 'expense', category: 'Groceries', amount: 8750.00, percent: 31, growth: '+12% vs прошлый мес.', date: '2026-11-05' },
    { id: 2, type: 'expense', category: 'Clothing & Shoes', amount: 6420.35, percent: 24.8, growth: '+6% vs прошлый мес.', date: '2026-11-08' },
    { id: 3, type: 'expense', category: 'Transport', amount: 4500.00, percent: 18.5, growth: '-2% vs прошлый мес.', date: '2026-11-02' },
    { id: 4, type: 'expense', category: 'Entertainment', amount: 3800.00, percent: 14.2, growth: '+4% vs прошлый мес.', date: '2026-11-09' }
];

let donutChart = null;

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupModals();
    renderReportTab();
    renderTransactionsTable();
});

function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

            item.classList.add('active');
            const targetPane = 'pane-' + item.getAttribute('data-tab');
            document.getElementById(targetPane).classList.add('active');
        });
    });

    const btnExpenses = document.getElementById('btn-show-expenses');
    const btnIncome = document.getElementById('btn-show-income');

    btnExpenses.addEventListener('click', () => {
        btnExpenses.classList.add('active');
        btnIncome.classList.remove('active');
    });

    btnIncome.addEventListener('click', () => {
        btnIncome.classList.add('active');
        btnExpenses.classList.remove('active');
    });
}

function renderReportTab() {
    const listContainer = document.getElementById('category-list-container');
    listContainer.innerHTML = '';

    let totalAmount = 0;
    initialTransactions.forEach(t => totalAmount += t.amount);

    const formattedTotal = '$' + totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });
    document.getElementById('donut-total').innerText = formattedTotal;
    document.getElementById('details-total-text').innerText = 'Всего ' + formattedTotal;

    const colorMap = {
        'Groceries': '#0284c7',
        'Clothing & Shoes': '#ea580c',
        'Transport': '#16a34a',
        'Entertainment': '#7c3aed'
    };

    // Render Category Rows (Clean text, NO icons/emojis)
    initialTransactions.forEach(t => {
        const barColor = colorMap[t.category] || '#7c3aed';

        const card = document.createElement('div');
        card.className = 'category-item-card';
        card.innerHTML = `
            <div class="item-top-row">
                <div class="item-text">
                    <h4>${t.category}</h4>
                    <p>${t.percent}% от общего объема</p>
                </div>
                <div class="item-amount-box">
                    <div class="item-price">$${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <span class="badge-percent green">${t.growth}</span>
                </div>
            </div>
            <div class="category-progress-track">
                <div class="category-progress-fill" style="width: ${t.percent}%; background-color: ${barColor}"></div>
            </div>
        `;
        listContainer.appendChild(card);
    });

    // Donut Chart
    const ctx = document.getElementById('expensesDonutChart').getContext('2d');
    if (donutChart) donutChart.destroy();

    donutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: initialTransactions.map(t => t.category),
            datasets: [{
                data: initialTransactions.map(t => t.amount),
                backgroundColor: ['#0284c7', '#ea580c', '#16a34a', '#7c3aed'],
                borderWidth: 3,
                borderColor: '#ffffff',
                hoverOffset: 6
            }]
        },
        options: {
            cutout: '76%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.label}: $${context.raw.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function renderTransactionsTable() {
    const tbody = document.getElementById('full-tx-tbody');
    tbody.innerHTML = initialTransactions.map(t => `
        <tr>
            <td>${t.date}</td>
            <td><span style="color:#ef4444;font-weight:700;">Расход</span></td>
            <td>${t.category}</td>
            <td>Транзакция по категории</td>
            <td><b>$${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</b></td>
            <td><span style="color:#7c3aed;font-weight:600;">(Пробный просмотр)</span></td>
        </tr>
    `).join('');
}

function setupModals() {
    const txModal = document.getElementById('tx-modal');
    document.getElementById('open-tx-modal').addEventListener('click', () => txModal.classList.add('active'));
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        });
    });

    document.getElementById('tx-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.getElementById('tx-category').value;
        const amount = parseFloat(document.getElementById('tx-amount').value);

        initialTransactions.unshift({
            id: Date.now(),
            type: 'expense',
            category: category,
            amount: amount,
            percent: 10,
            growth: '+3% vs прошлый мес.',
            date: new Date().toISOString().split('T')[0]
        });

        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        renderReportTab();
        renderTransactionsTable();
    });
}
