// App initialization & navigation
function initApp() {
    // -----------------------------------------------
    // DATA DUMMY UNTUK UJIAN (BUANG BILA GAS SIAP)
    // -----------------------------------------------
    if (!STATE.admin.length) {
        STATE.admin = [
            { username: 'Carpet2026', password: 'Carpet2026', nama: 'Admin MyCarpet' }
        ];
    }
    if (!STATE.pelanggan.length) {
        STATE.pelanggan = [
            { 'CUSTOMER ID': 'C001', NAMA: 'Ali', TELEFON: '60123456789', ALAMAT: 'No. 12, Jalan Mawar, Taman Melati' }
        ];
    }
    // Kosongkan data lain dengan array kosong supaya tidak undefined
    STATE.karpet = STATE.karpet || [];
    STATE.tempahan = STATE.tempahan || [];
    STATE.payment = STATE.payment || [];
    STATE.expenses = STATE.expenses || [];
    STATE.inventori = STATE.inventori || [];
    STATE.pekerja = STATE.pekerja || [];
    // -----------------------------------------------

    // Bina menu sidebar
    renderSidebar();
    // Muat data dari GAS (nanti akan timpa data dummy)
    if (!STATE.karpet.length && !STATE.tempahan.length) {
        fetchData();
    } else {
        refreshAllUI();
    }
    // Tab default ikut peranan
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
    // Tukar active menu
    $$('.menu-item').forEach(el => el.classList.remove('active'));
    const activeMenu = $(`.menu-item[data-tab="${tabId}"]`);
    if (activeMenu) activeMenu.classList.add('active');

    // Sembunyi semua tab
    const tabContainer = document.getElementById('tabContainer');
    tabContainer.innerHTML = '';

    // Panggil fungsi render berdasarkan tab
    // Buat masa ini cuma dashboard & customer portal akan dipaparkan, yang lain kita akan bina kemudian
    switch(tabId) {
        case 'dashboard': renderDashboard(); break;
        case 'customer-portal': renderCustomerPortal(); break;
        // Untuk tab yang belum ada, kita paparkan placeholder
        case 'temujanji':
        case 'tempahan':
        case 'tracking':
        case 'payment':
        case 'invoice':
        case 'pelanggan':
        case 'laporan':
        case 'inventori':
        case 'pekerja':
            tabContainer.innerHTML = '<div class="card"><h2>🛠️ Modul Akan Datang</h2><p>Fungsi ini sedang dibina. Tunggu update seterusnya!</p></div>';
            break;
        default:
            tabContainer.innerHTML = '<div class="card muted text-center">Kandungan tidak tersedia.</div>';
    }

    // Tutup sidebar di mobile
    if (window.innerWidth <= 992) document.body.classList.remove('sidebar-open');
}

function refreshAllUI() {
    if (STATE.currentUser) {
        const currentTab = document.querySelector('.menu-item.active');
        if (currentTab) switchTab(currentTab.dataset.tab);
    }
}

// Toggle sidebar untuk mobile
function toggleSidebar() { document.body.classList.toggle('sidebar-open'); }

// Event tutup sidebar bila klik luar
document.addEventListener('click', function(e) {
    if (window.innerWidth <= 992 && !e.target.closest('aside') && !e.target.closest('.mobile-menu')) {
        document.body.classList.remove('sidebar-open');
    }
});

// Semak session semasa page load
document.addEventListener('DOMContentLoaded', function() {
    if (!checkSession()) {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('appContainer').classList.add('hidden');
    }
});
