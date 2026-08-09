// App initialization & navigation
function initApp() {
    // -- DATA DUMMY UNTUK UJIAN (BUANG BILA GAS SUDAH SIAP) --
if (!STATE.admin.length) {
    STATE.admin = [{ username: 'admin', password: 'admin', nama: 'Admin Utama' }];
    STATE.pelanggan = [{ 'CUSTOMER ID': 'C001', NAMA: 'Ali', TELEFON: '60123456789', ALAMAT: 'No 12 Jalan Mawar' }];
}
    // Bina menu sidebar mengikut peranan
    renderSidebar();
    // Muatkan data dari GAS (hanya jika belum ada)
    if (!STATE.senaraiHarga.length && !STATE.pelanggan.length) {
        fetchData();
    } else {
        // Data mungkin sudah ada, cuma refresh UI
        refreshAllUI();
    }
    // Default tab untuk admin: dashboard, untuk customer: customer portal
    const defaultTab = STATE.currentUser.role === 'admin' ? 'dashboard' : 'customer-portal';
    switchTab(defaultTab);
}

function renderSidebar() {
    const menuContainer = document.getElementById('sidebarMenu');
    menuContainer.innerHTML = '';
    const role = STATE.currentUser.role;

    if (role === 'admin') {
        const adminMenu = [
            { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
            { id: 'temujanji', icon: 'fa-calendar-check', label: 'Temujanji' },
            { id: 'tempahan', icon: 'fa-file-invoice-dollar', label: 'Tempahan Baru' },
            { id: 'tracking', icon: 'fa-qrcode', label: 'Tracking' },
            { id: 'payment', icon: 'fa-money-bill-wave', label: 'Pembayaran' },
            { id: 'invoice', icon: 'fa-print', label: 'Invois & Resit' },
            { id: 'pelanggan', icon: 'fa-users', label: 'Pelanggan' },
            { id: 'laporan', icon: 'fa-chart-line', label: 'Laporan' },
            { id: 'inventori', icon: 'fa-boxes', label: 'Inventori' },
            { id: 'pekerja', icon: 'fa-people-group', label: 'Pekerja & Komisen' }
        ];
        adminMenu.forEach(item => {
            const li = document.createElement('li');
            li.className = 'menu-item';
            li.dataset.tab = item.id;
            li.innerHTML = `<i class="fa-solid ${item.icon}"></i> ${item.label}`;
            li.addEventListener('click', () => switchTab(item.id));
            menuContainer.appendChild(li);
        });
    } else {
        // Pelanggan
        const customerMenu = [
            { id: 'customer-portal', icon: 'fa-eye', label: 'Status Karpet Saya' }
        ];
        customerMenu.forEach(item => {
            const li = document.createElement('li');
            li.className = 'menu-item';
            li.dataset.tab = item.id;
            li.innerHTML = `<i class="fa-solid ${item.icon}"></i> ${item.label}`;
            li.addEventListener('click', () => switchTab(item.id));
            menuContainer.appendChild(li);
        });
    }
}

function switchTab(tabId) {
    // Buang semua active class dari menu
    $$('.menu-item').forEach(el => el.classList.remove('active'));
    const activeMenu = $(`.menu-item[data-tab="${tabId}"]`);
    if (activeMenu) activeMenu.classList.add('active');

    // Sembunyi semua tab content
    const tabContainer = document.getElementById('tabContainer');
    // Kita akan guna dynamic rendering: setiap kali switch, kita panggil fungsi render yang sepadan
    // Buat masa ini, kita hanya alert atau render dashboard/customer portal dulu
    tabContainer.innerHTML = ''; // clear

    // Panggil fungsi render berdasarkan tab
    switch(tabId) {
        case 'dashboard': renderDashboard(); break;
        case 'temujanji': renderTemujanji(); break;
        case 'tempahan': renderTempahan(); break;
        case 'tracking': renderTracking(); break;
        case 'payment': renderPayment(); break;
        case 'invoice': renderInvoice(); break;
        case 'pelanggan': renderPelanggan(); break;
        case 'laporan': renderLaporan(); break;
        case 'inventori': renderInventori(); break;
        case 'pekerja': renderPekerjaDanKomisen(); break;
        case 'customer-portal': renderCustomerPortal(); break;
        default: tabContainer.innerHTML = '<div class="card">Kandungan akan datang.</div>';
    }

    // Tutup sidebar di mobile
    if (window.innerWidth <= 992) document.body.classList.remove('sidebar-open');
}

function refreshAllUI() {
    // Akan dipanggil selepas fetchData. Buat masa ini, hanya switch tab semula.
    if (STATE.currentUser) {
        const currentTab = document.querySelector('.menu-item.active');
        if (currentTab) switchTab(currentTab.dataset.tab);
    }
}

// Mobile sidebar toggle
function toggleSidebar() { document.body.classList.toggle('sidebar-open'); }

// Event: klik pada mana-mana bahagian untuk tutup sidebar di mobile (optional)
document.addEventListener('click', function(e) {
    if (window.innerWidth <= 992 && !e.target.closest('aside') && !e.target.closest('.mobile-menu')) {
        document.body.classList.remove('sidebar-open');
    }
});

// Check session on load
document.addEventListener('DOMContentLoaded', function() {
    // Check session
    if (!checkSession()) {
        // Tunjuk login screen
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('appContainer').classList.add('hidden');
    }
});
