console.log('auth.js loaded'); // Debug

function loginAdmin() {
    console.log('loginAdmin dipanggil');
    const username = document.getElementById('adminUser').value.trim();
    const password = document.getElementById('adminPass').value.trim();
    console.log('Input:', username, password);
    if (!username || !password) {
        showLoginError('Sila isi username dan password.');
        return;
    }
    console.log('STATE.admin:', STATE.admin);
    const admin = STATE.admin.find(a => {
        console.log('Checking', a.username, a.password);
        return normalize(a.username) === normalize(username) && a.password === password;
    });
    console.log('Admin found:', admin);
    if (admin) {
        STATE.currentUser = { role: 'admin', username: admin.username, nama: admin.nama };
        if (document.getElementById('rememberMeAdmin').checked) {
            localStorage.setItem('mycarpet_user', JSON.stringify(STATE.currentUser));
        } else {
            sessionStorage.setItem('mycarpet_user', JSON.stringify(STATE.currentUser));
        }
        hideLoginScreen();
        initApp();
    } else {
        showLoginError('Username atau password salah.');
    }
}
