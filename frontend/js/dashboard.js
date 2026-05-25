const API_BASE_URL = 'http://localhost:3000/api';

// Check authorization
function ensureAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(user);
}

let currentUser = ensureAuth();

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

// Show section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Remove active class from menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId)?.classList.remove('hidden');
    
    // Add active class to clicked menu item
    event.target.closest('.menu-item')?.classList.add('active');
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'cars': 'Browse Cars',
        'my-sales': 'My Purchases',
        'installments': 'Installments',
        'sell-car': 'Sell Your Car',
        'settings': 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[sectionId] || 'Dashboard';
    
    // Load section data
    if (sectionId === 'dashboard') loadDashboard();
    if (sectionId === 'cars') loadCars();
    if (sectionId === 'my-sales') loadSales();
    if (sectionId === 'installments') loadInstallments();
    if (sectionId === 'settings') loadSettings();
}

// Load dashboard
async function loadDashboard() {
    try {
        const token = localStorage.getItem('token');
        
        const salesResponse = await fetch(`${API_BASE_URL}/sales`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const sales = await salesResponse.json();
        
        const installmentsResponse = await fetch(`${API_BASE_URL}/sales/installment/plans`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const installments = await installmentsResponse.json();
        
        document.getElementById('totalPurchases').textContent = sales.filter(s => s.buyer === currentUser.id).length;
        document.getElementById('activeInstallments').textContent = installments.filter(i => i.status === 'active').length;
        document.getElementById('carsSold').textContent = sales.filter(s => s.status === 'completed').length;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load cars
async function loadCars() {
    try {
        const response = await fetch(`${API_BASE_URL}/cars?status=available`);
        const cars = await response.json();
        
        const carsList = document.getElementById('carsList');
        carsList.innerHTML = cars.map(car => `
            <div class="car-item">
                <div class="car-image"><i class="fas fa-car"></i> Image</div>
                <div class="car-content">
                    <div class="car-title">${car.brand} ${car.model}</div>
                    <div class="car-price">$${car.price.toLocaleString()}</div>
                    <div class="car-specs">
                        <p><strong>Year:</strong> ${car.year}</p>
                        <p><strong>Mileage:</strong> ${car.mileage} km</p>
                        <p><strong>Transmission:</strong> ${car.transmission}</p>
                    </div>
                    <button class="btn btn-primary" onclick="purchaseCar('${car._id}')">Purchase</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading cars:', error);
    }
}

// Load sales
async function loadSales() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/sales`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const sales = await response.json();
        
        const salesList = document.getElementById('salesList');
        salesList.innerHTML = sales.map(sale => `
            <div class="list-item">
                <div class="list-item-info">
                    <div class="list-item-title">${sale.car.brand} ${sale.car.model}</div>
                    <div class="list-item-details">
                        Price: $${sale.salePrice.toLocaleString()} | Status: ${sale.status} | Date: ${new Date(sale.saleDate).toLocaleDateString()}
                    </div>
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-secondary btn-small">View Details</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading sales:', error);
    }
}

// Load installments
async function loadInstallments() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/sales/installment/plans`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const plans = await response.json();
        
        const installmentsList = document.getElementById('installmentsList');
        installmentsList.innerHTML = plans.map(plan => `
            <div class="list-item">
                <div class="list-item-info">
                    <div class="list-item-title">${plan.car.brand} ${plan.car.model} - Installment Plan</div>
                    <div class="list-item-details">
                        Total: $${plan.totalAmount.toLocaleString()} | Remaining: $${plan.remainingAmount.toLocaleString()} | Installments: ${plan.numberOfInstallments} | Status: ${plan.status}
                    </div>
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-secondary btn-small" onclick="viewInstallmentDetails('${plan._id}')">View Details</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading installments:', error);
    }
}

// Load settings
function loadSettings() {
    if (currentUser) {
        document.getElementById('profileName').value = currentUser.name || '';
        document.getElementById('profileEmail').value = currentUser.email || '';
        document.getElementById('profilePhone').value = currentUser.phone || '';
        document.getElementById('profileAddress').value = currentUser.address || '';
        
        // Load customization settings
        const customization = currentUser.customization || {};
        document.getElementById('fontSizeSlider').value = customization.fontSize || 14;
        document.getElementById('fontSizeValue').textContent = (customization.fontSize || 14) + 'px';
        document.getElementById('themeSelect').value = customization.theme || 'light';
        document.getElementById('languageSelect').value = customization.language || 'en';
    }
}

// Save settings
async function saveSettings() {
    try {
        const fontSize = document.getElementById('fontSizeSlider').value;
        const theme = document.getElementById('themeSelect').value;
        const language = document.getElementById('languageSelect').value;
        
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/customization/settings/${currentUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                fontSize: parseInt(fontSize),
                theme,
                language,
                sidebarCollapsed: false
            })
        });
        
        if (response.ok) {
            document.body.style.fontSize = fontSize + 'px';
            alert('Settings saved successfully');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Failed to save settings');
    }
}

// Save profile
async function saveProfile() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/profile/${currentUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: document.getElementById('profileName').value,
                phone: document.getElementById('profilePhone').value,
                address: document.getElementById('profileAddress').value
            })
        });
        
        if (response.ok) {
            alert('Profile updated successfully');
        }
    } catch (error) {
        console.error('Error saving profile:', error);
    }
}

// Update font size
function updateFontSize() {
    const size = document.getElementById('fontSizeSlider').value;
    document.getElementById('fontSizeValue').textContent = size + 'px';
    document.body.style.fontSize = size + 'px';
}

// Update theme
function updateTheme() {
    const theme = document.getElementById('themeSelect').value;
    document.body.classList.toggle('dark-theme', theme === 'dark');
}

// Update language
function updateLanguage() {
    const language = document.getElementById('languageSelect').value;
    document.documentElement.lang = language;
    if (language === 'ar') {
        document.body.style.direction = 'rtl';
    } else {
        document.body.style.direction = 'ltr';
    }
}

// Purchase car
function purchaseCar(carId) {
    alert(`Purchase dialog would open for car: ${carId}`);
}

// View installment details
function viewInstallmentDetails(planId) {
    alert(`Installment details modal would open for plan: ${planId}`);
}

// Update user name in header
function updateUserName() {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name || 'User';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateUserName();
    loadDashboard();
});
