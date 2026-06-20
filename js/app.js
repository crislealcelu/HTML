/**
 * Alke Wallet - App Core (shared JS)
 * Módulo 2: Fundamentos del desarrollo Front-end
 * Funcionalidades: Balance, Transacciones, Contactos con localStorage
 */

// ================== CONFIG & INITIAL DATA ==================
const DEFAULT_BALANCE = 3450.75;
const DEMO_USER = {
    email: 'clealp',
    password: 'Leal12345!',
    name: 'Cris Leal'
};

const INITIAL_CONTACTS = [
    { id: 1, name: 'Juan Pérez', account: 'juan.perez@email.com' },
    { id: 2, name: 'María López', account: 'maria.lopez@email.com' },
    { id: 3, name: 'Carlos Rodríguez', account: 'carlos.rodriguez@email.com' },
    { id: 4, name: 'Ana García', account: 'ana.garcia@email.com' },
    { id: 5, name: 'Pedro Martínez', account: 'pedro.martinez@email.com' }
];

const INITIAL_TRANSACTIONS = [
    { 
        id: 101, 
        type: 'deposit', 
        amount: 1500.00, 
        date: '2026-06-10T09:30:00', 
        description: 'Depósito inicial desde cuenta bancaria',
        fromTo: 'Banco Estado'
    },
    { 
        id: 102, 
        type: 'sent', 
        amount: 250.50, 
        date: '2026-06-12T14:15:00', 
        description: 'Pago alquiler junio',
        fromTo: 'Juan Pérez'
    },
    { 
        id: 103, 
        type: 'receive', 
        amount: 320.00, 
        date: '2026-06-14T11:45:00', 
        description: 'Reembolso compra online',
        fromTo: 'María López'
    },
    { 
        id: 104, 
        type: 'sent', 
        amount: 89.99, 
        date: '2026-06-15T16:20:00', 
        description: 'Transferencia a proveedor',
        fromTo: 'Carlos Rodríguez'
    },
    { 
        id: 105, 
        type: 'deposit', 
        amount: 500.00, 
        date: '2026-06-17T08:00:00', 
        description: 'Depósito de sueldo quincena',
        fromTo: 'Empresa XYZ'
    }
];

// ================== STORAGE HELPERS ==================
function getBalance() {
    const balance = localStorage.getItem('alke_balance');
    return balance !== null ? parseFloat(balance) : null;
}

function setBalance(newBalance) {
    localStorage.setItem('alke_balance', newBalance.toFixed(2));
}

function getTransactions() {
    const txs = localStorage.getItem('alke_transactions');
    return txs ? JSON.parse(txs) : [];
}

function saveTransactions(transactions) {
    localStorage.setItem('alke_transactions', JSON.stringify(transactions));
}

function addTransaction(transaction) {
    const transactions = getTransactions();
    if (!transaction.id) {
        transaction.id = Date.now();
    }
    if (!transaction.date) {
        transaction.date = new Date().toISOString();
    }
    transactions.unshift(transaction);
    saveTransactions(transactions);
    return transaction;
}

function getContacts() {
    const contacts = localStorage.getItem('alke_contacts');
    return contacts ? JSON.parse(contacts) : [];
}

function saveContacts(contacts) {
    localStorage.setItem('alke_contacts', JSON.stringify(contacts));
}

function addContact(contact) {
    const contacts = getContacts();
    contact.id = Date.now();
    contacts.push(contact);
    saveContacts(contacts);
    return contact;
}

// ================== INITIALIZATION ==================
function initDataIfEmpty() {
    if (getBalance() === null) {
        setBalance(DEFAULT_BALANCE);
    }
    if (getTransactions().length === 0) {
        saveTransactions([...INITIAL_TRANSACTIONS]);
    }
    if (getContacts().length === 0) {
        saveContacts([...INITIAL_CONTACTS]);
    }
}

initDataIfEmpty();

// ================== UTILITY FUNCTIONS ==================
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getTransactionIcon(type) {
    if (type === 'deposit' || type === 'receive') {
        return '<i class="bi bi-arrow-down-circle-fill text-success"></i>';
    } else if (type === 'sent') {
        return '<i class="bi bi-arrow-up-circle-fill text-danger"></i>';
    }
    return '<i class="bi bi-arrow-left-right text-primary"></i>';
}

function getTransactionBadge(type) {
    if (type === 'deposit') return '<span class="badge bg-success">Depósito</span>';
    if (type === 'receive') return '<span class="badge bg-info">Recibido</span>';
    if (type === 'sent') return '<span class="badge bg-danger">Enviado</span>';
    return '<span class="badge bg-secondary">Transacción</span>';
}

// ================== NOTIFICATIONS ==================
function showNotification(message, type = 'success') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    const toastId = 'toast-' + Date.now();
    const bgClass = type === 'success' ? 'bg-success' : 
                    type === 'danger' ? 'bg-danger' : 
                    type === 'warning' ? 'bg-warning' : 'bg-info';
    const textClass = (type === 'warning') ? 'text-dark' : 'text-white';

    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center ${bgClass} ${textClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3500 });
    toast.show();

    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

function updateBalanceDisplay(elementId = 'balance-display') {
    const balanceEl = document.getElementById(elementId);
    if (balanceEl) {
        const balance = getBalance();
        balanceEl.textContent = formatCurrency(balance);
    }
}

// ================== AUTH HELPERS ==================
function isLoggedIn() {
    return localStorage.getItem('alke_loggedIn') === 'true';
}

function getCurrentUser() {
    return localStorage.getItem('alke_userName') || DEMO_USER.name;
}

function logout() {
    localStorage.removeItem('alke_loggedIn');
    localStorage.removeItem('alke_userName');
    window.location.href = 'login.html';
}

function protectPage() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

window.AlkeWallet = {
    getBalance,
    setBalance,
    getTransactions,
    addTransaction,
    getContacts,
    addContact,
    formatCurrency,
    formatDate,
    showNotification,
    updateBalanceDisplay,
    protectPage,
    logout,
    isLoggedIn
};