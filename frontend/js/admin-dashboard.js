const API_BASE_URL = 'http://localhost:3000/api';

// Check authorization (admin only)
function ensureAdminAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    
    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
        alert('Admin access required');
        window.location.href = '../index.html';
        return null;
    }
    
    return userData;
}

let currentAdmin = ensureAdminAuth();

// Show admin section
function showAdminSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Remove active class from menu items
    document.querySelectorAll('.admin-menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId)?.classList.remove('hidden');
    
    // Add active class to clicked menu item
    event.target.closest('.admin-menu-item')?.classList.add('active');
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'cars': 'Manage Cars',
        'users': 'Manage Users',
        'sales': 'Sales Reports',
        'settings': 'System Settings'
    };
    document.getElementById('adminPageTitle').textContent = titles[sectionId] || 'Dashboard';
    
    // Load section data
    if (sectionId === 'dashboard') loadAdminDashboard();
    if (sectionId === 'cars') loadAdminCars();
    if (sectionId === 'users') loadAdminUsers();
    if (sectionId === 'sales') loadAdminSalesReports();
}

// Load admin dashboard
async function loadAdminDashboard() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const stats = await response.json();
        
        document.getElementById('statsUsers').textContent = stats.totalUsers;
        document.getElementById('statsCars').textContent = stats.totalCars;
        document.getElementById('statsSales').textContent = stats.totalSales;
        document.getElementById('statsRevenue').textContent = '$' + stats.totalRevenue.toLocaleString();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Show add car form
function showAddCarForm() {
    document.getElementById('addCarForm').classList.remove('hidden');
}

// Hide add car form
function hideAddCarForm() {
    document.getElementById('addCarForm').classList.add('hidden');
}

// Load admin cars
async function loadAdminCars() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/cars`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const cars = await response.json();
        
        const carsList = document.getElementById('carsList');
        carsList.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Brand</th>
                        <th>Model</th>
                        <th>Year</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${cars.map(car => `
                        <tr>
                            <td>${car.brand}</td>
                            <td>${car.model}</td>
                            <td>${car.year}</td>
                            <td>$${car.price.toLocaleString()}</td>
                            <td>${car.status}</td>
                            <td>
                                <button class="btn btn-secondary btn-small">Edit</button>
                                <button class="btn btn-danger btn-small" onclick="deleteCar('${car._id}')">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading cars:', error);
    }
}

// Load admin users
async function loadAdminUsers() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const users = await response.json();
        
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>City</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.phone}</td>
                            <td>${user.role}</td>
                            <td>${user.city || '-'}</td>
                            <td>
                                <button class="btn btn-secondary btn-small">Edit</button>
                                <button class="btn btn-danger btn-small" onclick="deleteUser('${user._id}')">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Load admin sales reports
async function loadAdminSalesReports() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/admin/reports/sales`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const sales = await response.json();
        
        const salesReport = document.getElementById('salesReport');
        salesReport.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Car</th>
                        <th>Buyer</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${sales.map(sale => `
                        <tr>
                            <td>${sale.car.brand} ${sale.car.model}</td>
                            <td>${sale.buyer.name}</td>
                            <td>$${sale.salePrice.toLocaleString()}</td>
                            <td>${new Date(sale.saleDate).toLocaleDateString()}</td>
                            <td>${sale.paymentMethod}</td>
                            <td>${sale.status}</td>
                            <td>
                                <button class="btn btn-secondary btn-small">View</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading sales reports:', error);
    }
}

// Delete car
async function deleteCar(carId) {
    if (!confirm('Are you sure you want to delete this car?')) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/cars/${carId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            alert('Car deleted successfully');
            loadAdminCars();
        }
    } catch (error) {
        console.error('Error deleting car:', error);
        alert('Failed to delete car');
    }
}

// Delete user
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            alert('User deleted successfully');
            loadAdminUsers();
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadAdminDashboard();
    
    // Add car form submission
    document.getElementById('addCarForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/cars`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                alert('Car added successfully');
                hideAddCarForm();
                loadAdminCars();
            }
        } catch (error) {
            console.error('Error adding car:', error);
            alert('Failed to add car');
        }
    });
});
