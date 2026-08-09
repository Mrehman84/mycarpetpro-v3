// Auth Module
function loginAdmin() {
    const username = document.getElementById('adminUser').value.trim();
    const password = document.getElementById('adminPass').value.trim();
    if (!username || !password) {
        showLoginError('Sila isi username dan password.');
        return;
    }
    // Semak dengan data admin dari STATE (nanti GAS hantar)
    const admin = STATE.admin.find(a => normalize(a.username) === normalize(username) && a.password === password);
    if (admin) {
        STATE.currentUser = { role: 'admin', username: admin.username, nama: admin.nama };
        if (document.getElementById('rememberMeAdmin').checked) {
            localStorage.setItem('mycarpet_user', JSON.stringify(STATE.currentUser));
        } else {
            sessionStorage.setItem('mycarpet_user', JSON.stringify(STATE.currentUser));
        }
        // -- DATA DUMMY UNTUK UJIAN (BUANG BILA GAS SUDAH SIAP) --
if (!STATE.admin.length) {
    STATE.admin = [{ username: 'admin', password: 'admin', nama: 'Admin Utama' }];
    STATE.pelanggan = [{ 'CUSTOMER ID': 'C001', NAMA: 'Ali', TELEFON: '60123456789', ALAMAT: 'No 12 Jalan Mawar' }];
}
        hideLoginScreen();
        initApp();
    } else {
        showLoginError('Username atau password salah.');
    }
}

function loginCustomer() {
    const phone = document.getElementById('custPhone').value.trim();
    if (!phone) {
        showLoginError('Sila masukkan nombor telefon.');
        return;
    }
    // Cari pelanggan dalam STATE.pelanggan
    const cust = STATE.pelanggan.find(c => normalize(getField(c, ['TELEFON','NO TELEFON'])) === normalize(phone));
    if (cust) {
        STATE.currentUser = { role: 'customer', customerId: getField(cust, ['CUSTOMER ID','CUSTOMER_ID']), telefon: phone };
        if (document.getElementById('rememberMeCust').checked) {
            localStorage.setItem('mycarpet_user', JSON.stringify(STATE.currentUser));
        } else {
            sessionStorage.setItem('mycarpet_user', JSON.stringify(STATE.currentUser));
        }
        hideLoginScreen();
        initApp();
    } else {
        showLoginError('Nombor telefon tidak dijumpai. Sila hubungi kedai untuk daftar.');
    }
}

function showLoginError(msg) {
    const el = document.getElementById('loginError');
    el.textContent = msg;
    el.classList.remove('hidden');
}

function hideLoginScreen() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('appContainer').classList.remove('hidden');
}

function logout() {
    STATE.currentUser = null;
    localStorage.removeItem('mycarpet_user');
    sessionStorage.removeItem('mycarpet_user');
    document.getElementById('appContainer').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
    // Reset form login
    document.getElementById('adminUser').value = '';
    document.getElementById('adminPass').value = '';
    document.getElementById('custPhone').value = '';
    document.getElementById('loginError').classList.add('hidden');
}

// Semak sesi semasa load
function checkSession() {
    const stored = localStorage.getItem('mycarpet_user') || sessionStorage.getItem('mycarpet_user');
    if (stored) {
        try {
            STATE.currentUser = JSON.parse(stored);
            hideLoginScreen();
            initApp();
            return true;
        } catch(e) { /* abaikan */ }
    }
    return false;
}

// Tukar tab login
document.addEventListener('DOMContentLoaded', function() {
    const tabs = $$('.login-tab');
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
