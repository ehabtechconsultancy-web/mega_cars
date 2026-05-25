const API_BASE_URL = 'http://localhost:3000/api';

async function loadHomeCars() {
    try {
        const response = await fetch(`${API_BASE_URL}/cars?status=available`);
        const cars = await response.json();
        const carsList = document.getElementById('carsList');
        if (!carsList) return;
        carsList.innerHTML = cars.slice(0, 6).map(car => `
            <div class="car-card">
                <div class="car-image"><i class="fas fa-car"></i></div>
                <div class="car-info">
                    <div class="car-title">${car.brand} ${car.model}</div>
                    <div class="car-price">$${car.price.toLocaleString()}</div>
                    <div class="car-details">
                        <p><strong>${t('dyn.year')}:</strong> ${car.year}</p>
                        <p><strong>${t('dyn.mileage')}:</strong> ${car.mileage} km</p>
                        <p><strong>${t('dyn.fuel')}:</strong> ${car.fuel}</p>
                    </div>
                    <div class="car-actions">
                        <button class="btn btn-primary" onclick="viewCar('${car._id}')">${t('cars.viewDetails')}</button>
                        ${checkAuth() ? `<button class="btn btn-secondary" onclick="buyNow('${car._id}')">${t('cars.buyNow')}</button>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading cars:', error);
    }
}

async function filterCars() {
    const brand = document.getElementById('brandFilter')?.value;
    const status = document.getElementById('statusFilter')?.value;
    const minPrice = document.getElementById('minPrice')?.value;
    const maxPrice = document.getElementById('maxPrice')?.value;
    let query = '?';
    if (brand) query += `brand=${brand}&`;
    if (status) query += `status=${status}&`;
    if (minPrice) query += `minPrice=${minPrice}&`;
    if (maxPrice) query += `maxPrice=${maxPrice}`;
    try {
        const response = await fetch(`${API_BASE_URL}/cars${query}`);
        const cars = await response.json();
        const carsList = document.getElementById('carsList');
        if (!carsList) return;
        carsList.innerHTML = cars.map(car => `
            <div class="car-card">
                <div class="car-image"><i class="fas fa-car"></i></div>
                <div class="car-info">
                    <div class="car-title">${car.brand} ${car.model}</div>
                    <div class="car-price">$${car.price.toLocaleString()}</div>
                    <div class="car-details">
                        <p><strong>${t('dyn.year')}:</strong> ${car.year}</p>
                        <p><strong>${t('dyn.mileage')}:</strong> ${car.mileage} km</p>
                        <p><strong>${t('dyn.fuel')}:</strong> ${car.fuel}</p>
                    </div>
                    <div class="car-actions">
                        <button class="btn btn-primary" onclick="viewCar('${car._id}')">${t('cars.viewDetails')}</button>
                        ${checkAuth() ? `<button class="btn btn-secondary" onclick="buyNow('${car._id}')">${t('cars.buyNow')}</button>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error filtering cars:', error);
    }
}

function viewCar(carId) { alert(`${t('cars.viewDetails')}: ${carId}`); }

function buyNow(carId) {
    if (!checkAuth()) { window.location.href = 'pages/login.html'; return; }
    alert(`${t('cars.buyNow')}: ${carId}`);
}

document.addEventListener('DOMContentLoaded', () => {
    updateLoginButton();
    loadHomeCars();
});
