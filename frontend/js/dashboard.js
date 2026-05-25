const API_BASE_URL = 'http://localhost:3000/api';

function ensureAuth() {
    const user = localStorage.getItem('user');
    if (!user) { window.location.href = 'login.html'; return null; }
    return JSON.parse(user);
}

let currentUser = ensureAuth();

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    document.getElementById(sectionId)?.classList.remove('hidden');
    event.target.closest('.menu-item')?.classList.add('active');

    const titles = {
        'dashboard': t('dash.section.dashboard'),
        'cars': t('dash.section.cars'),
        'my-sales': t('dash.section.purchases'),
        'installments': t('dash.section.installments'),
        'sell-car': t('dash.section.sellCar'),
        'settings': t('dash.section.settings')
    };
    document.getElementById('pageTitle').textContent = titles[sectionId] || t('dash.section.dashboard');

    if (sectionId === 'dashboard') loadDashboard();
    if (sectionId === 'cars') loadCars();
    if (sectionId === 'my-sales') loadSales();
    if (sectionId === 'installments') loadInstallments();
    if (sectionId === 'settings') loadSettings();
}

function updateWelcomeBanner() {
    const name = currentUser?.name || '';
    const greeting = t('dash.greeting');
    document.getElementById('welcomeGreeting').textContent = name ? `${greeting}، ${name}` : greeting;

    const now = new Date();
    const dayNames = {
        ar: ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],
        ku: ['یەکشەممە','دووشەممە','سێشەممە','چوارشەممە','پێنجشەممە','هەینی','شەممە'],
        en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    };
    const lang = getLang();
    const days = dayNames[lang] || dayNames.en;
    document.getElementById('welcomeDay').textContent = days[now.getDay()];
    document.getElementById('welcomeDate').textContent = now.toLocaleDateString(
        lang === 'ar' ? 'ar-IQ' : lang === 'ku' ? 'ku' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
    );
}

async function loadDashboard() {
    try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const [salesRes, installRes, carsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/sales`, { headers }),
            fetch(`${API_BASE_URL}/sales/installment/plans`, { headers }),
            fetch(`${API_BASE_URL}/cars?status=available`)
        ]);
        const sales = await salesRes.json();
        const installments = await installRes.json();
        const cars = await carsRes.json();
        document.getElementById('totalPurchases').textContent = Array.isArray(sales) ? sales.length : 0;
        document.getElementById('activeInstallments').textContent = Array.isArray(installments)
            ? installments.filter(i => i.status === 'active').length : 0;
        document.getElementById('carsSold').textContent = Array.isArray(cars) ? cars.length : 0;
    } catch (error) { console.error('Error loading dashboard:', error); }
}

function statusBadge(status) {
    const label = t(`dyn.status.${status}`) || status;
    return `<span class="status-badge ${status}">${label}</span>`;
}

async function loadCars() {
    try {
        const response = await fetch(`${API_BASE_URL}/cars?status=available`);
        const cars = await response.json();
        if (!Array.isArray(cars) || cars.length === 0) {
            document.getElementById('carsList').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-car"></i>
                    <p>${t('dyn.available')}</p>
                </div>`;
            return;
        }
        document.getElementById('carsList').innerHTML = cars.map(car => `
            <div class="car-item">
                <div class="car-image">
                    <i class="fas fa-car"></i>
                    <span class="car-badge">${t('dyn.available')}</span>
                </div>
                <div class="car-content">
                    <div class="car-title">${car.brand} ${car.model}</div>
                    <div class="car-price">$${car.price.toLocaleString()}</div>
                    <div class="car-specs">
                        <span class="spec-chip"><i class="fas fa-calendar"></i> ${car.year}</span>
                        <span class="spec-chip"><i class="fas fa-tachometer-alt"></i> ${car.mileage?.toLocaleString()} km</span>
                        <span class="spec-chip"><i class="fas fa-gas-pump"></i> ${car.fuel || '–'}</span>
                        ${car.color ? `<span class="spec-chip"><i class="fas fa-circle"></i> ${car.color}</span>` : ''}
                    </div>
                    <button class="btn btn-primary" onclick="purchaseCar('${car._id}')">${t('dyn.purchase')}</button>
                </div>
            </div>
        `).join('');
    } catch (error) { console.error('Error loading cars:', error); }
}

async function loadSales() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/sales`, { headers: { 'Authorization': `Bearer ${token}` } });
        const sales = await response.json();
        if (!Array.isArray(sales) || sales.length === 0) {
            document.getElementById('salesList').innerHTML = `
                <div class="empty-state"><i class="fas fa-shopping-cart"></i><p>–</p></div>`;
            return;
        }
        document.getElementById('salesList').innerHTML = sales.map(sale => `
            <div class="list-item">
                <div class="list-item-icon"><i class="fas fa-car"></i></div>
                <div class="list-item-info">
                    <div class="list-item-title">${sale.car?.brand || ''} ${sale.car?.model || ''}</div>
                    <div class="list-item-details">
                        ${t('dyn.price')}: $${sale.salePrice?.toLocaleString()} &nbsp;|&nbsp;
                        ${t('dyn.date')}: ${new Date(sale.saleDate).toLocaleDateString()}
                    </div>
                </div>
                <div class="list-item-actions">
                    ${statusBadge(sale.status)}
                    <button class="btn btn-secondary btn-small">${t('dyn.viewDetails')}</button>
                </div>
            </div>
        `).join('');
    } catch (error) { console.error('Error loading sales:', error); }
}

async function loadInstallments() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/sales/installment/plans`, { headers: { 'Authorization': `Bearer ${token}` } });
        const plans = await response.json();
        if (!Array.isArray(plans) || plans.length === 0) {
            document.getElementById('installmentsList').innerHTML = `
                <div class="empty-state"><i class="fas fa-credit-card"></i><p>–</p></div>`;
            return;
        }
        document.getElementById('installmentsList').innerHTML = plans.map(plan => `
            <div class="list-item">
                <div class="list-item-icon"><i class="fas fa-credit-card"></i></div>
                <div class="list-item-info">
                    <div class="list-item-title">${plan.car?.brand || ''} ${plan.car?.model || ''} — ${t('dyn.installmentPlan')}</div>
                    <div class="list-item-details">
                        ${t('dyn.total')}: $${plan.totalAmount?.toLocaleString()} &nbsp;|&nbsp;
                        ${t('dyn.remaining')}: $${plan.remainingAmount?.toLocaleString()} &nbsp;|&nbsp;
                        ${t('dyn.installments')}: ${plan.numberOfInstallments}
                    </div>
                </div>
                <div class="list-item-actions">
                    ${statusBadge(plan.status)}
                    <button class="btn btn-secondary btn-small" onclick="viewInstallmentDetails('${plan._id}')">${t('dyn.viewDetails')}</button>
                </div>
            </div>
        `).join('');
    } catch (error) { console.error('Error loading installments:', error); }
}

function loadSettings() {
    if (!currentUser) return;
    document.getElementById('profileName').value = currentUser.name || '';
    document.getElementById('profileEmail').value = currentUser.email || '';
    document.getElementById('profilePhone').value = currentUser.phone || '';
    document.getElementById('profileAddress').value = currentUser.address || '';
    document.getElementById('fontSizeSlider').value = currentUser.customization?.fontSize || 14;
    document.getElementById('fontSizeValue').textContent = (currentUser.customization?.fontSize || 14) + 'px';
    document.getElementById('themeSelect').value = currentUser.customization?.theme || 'light';
    document.getElementById('languageSelect').value = getLang();
}

async function saveSettings() {
    try {
        const fontSize = document.getElementById('fontSizeSlider').value;
        const theme = document.getElementById('themeSelect').value;
        const language = document.getElementById('languageSelect').value;
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/customization/settings/${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ fontSize: parseInt(fontSize), theme, language, sidebarCollapsed: false })
        });
        if (response.ok) {
            document.body.style.fontSize = fontSize + 'px';
            setLang(language);
            alert(t('alert.settingsSaved'));
            window.location.reload();
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        alert(t('alert.settingsFailed'));
    }
}

async function saveProfile() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/profile/${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                name: document.getElementById('profileName').value,
                phone: document.getElementById('profilePhone').value,
                address: document.getElementById('profileAddress').value
            })
        });
        if (response.ok) alert(t('alert.profileSaved'));
    } catch (error) { console.error('Error saving profile:', error); }
}

function updateFontSize() {
    const size = document.getElementById('fontSizeSlider').value;
    document.getElementById('fontSizeValue').textContent = size + 'px';
    document.body.style.fontSize = size + 'px';
}

function updateTheme() {
    document.body.classList.toggle('dark-theme', document.getElementById('themeSelect').value === 'dark');
}

function purchaseCar(carId) { alert(`${t('dyn.purchase')}: ${carId}`); }
function viewInstallmentDetails(planId) { alert(`${t('dyn.viewDetails')}: ${planId}`); }

function updateUserName() {
    if (!currentUser) return;
    const name = currentUser.name || 'User';
    const el = document.getElementById('userName');
    if (el) el.textContent = name;
    const sidebarEl = document.getElementById('sidebarUserName');
    if (sidebarEl) sidebarEl.textContent = name;
}

document.addEventListener('DOMContentLoaded', () => {
    updateUserName();
    updateWelcomeBanner();
    loadDashboard();

    document.getElementById('sellCarForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        data.year = parseInt(data.year);
        data.price = parseFloat(data.price);
        data.mileage = parseInt(data.mileage);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/cars`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                alert(t('alert.carAdded'));
                e.target.reset();
                showSection('cars');
            } else {
                const err = await response.json();
                alert(err.message || t('alert.carAddFailed'));
            }
        } catch (error) { console.error('Error adding car:', error); alert(t('alert.carAddFailed')); }
    });
});
