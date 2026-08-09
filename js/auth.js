console.log('auth.js loaded');

function loginAdmin() {
    console.log('loginAdmin called');
    const username = document.getElementById('adminUser').value.trim();
    const password = document.getElementById('adminPass').value.trim();
    console.log('Input:', username, password);
    
    // Hardcoded credentials for testing
    if (username === 'Carpet2026' && password === 'Carpet2026') {
        console.log('Login successful');
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
        // Build sidebar
        buildSidebar('admin');
    } else {
        document.getElementById('loginError').textContent = 'Username atau password salah.';
        document.getElementById('loginError').classList.remove('hidden');
    }
}

function loginCustomer() {
    const phone = document.getElementById('custPhone').value.trim();
    if (phone === '60123456789') {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
        buildSidebar('customer');
    } else {
        document.getElementById('loginError').textContent = 'Nombor telefon tidak dijumpai.';
        document.getElementById('loginError').classList.remove('hidden');
    }
}

function buildSidebar(role) {
    const menu = document.getElementById('sidebarMenu');
    menu.innerHTML = '';
    if (role === 'admin') {
        menu.innerHTML = `
            <li class="menu-item active" data-tab="dashboard"><i class="fa-solid fa-chart-pie"></i> Dashboard</li>
            <li class="menu-item" data-tab="temujanji"><i class="fa-solid fa-calendar-check"></i> Temujanji</li>
            <li class="menu-item" data-tab="tempahan"><i class="fa-solid fa-file-invoice-dollar"></i> Tempahan Baru</li>
            <li class="menu-item" data-tab="tracking"><i class="fa-solid fa-qrcode"></i> Tracking</li>
            <li class="menu-item" data-tab="payment"><i class="fa-solid fa-money-bill-wave"></i> Pembayaran</li>
            <li class="menu-item" data-tab="invoice"><i class="fa-solid fa-print"></i> Invois & Resit</li>
            <li class="menu-item" data-tab="pelanggan"><i class="fa-solid fa-users"></i> Pelanggan</li>
            <li class="menu-item" data-tab="laporan"><i class="fa-solid fa-chart-line"></i> Laporan</li>
            <li class="menu-item" data-tab="inventori"><i class="fa-solid fa-boxes"></i> Inventori</li>
            <li class="menu-item" data-tab="pekerja"><i class="fa-solid fa-people-group"></i> Pekerja & Komisen</li>
        `;
    } else {
        menu.innerHTML = `
            <li class="menu-item active" data-tab="customer-portal"><i class="fa-solid fa-eye"></i> Status Karpet Saya</li>
        `;
    }
    // Add click events
    menu.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            menu.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    // Logout button
    document.querySelector('.sidebar-footer .menu-item').addEventListener('click', function() {
        document.getElementById('appContainer').classList.add('hidden');
        document.getElementById('loginScreen').classList.remove('hidden');
    });
}

// Tab switching on login screen
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.login-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const role = this.dataset.role;
            document.getElementById('loginFormAdmin').classList.toggle('active', role === 'admin');
            document.getElementById('loginFormCustomer').classList.toggle('active', role === 'customer');
        });
    });
});
