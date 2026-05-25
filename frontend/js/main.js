const API_BASE_URL = 'http://localhost:3000/api';

// Load cars on home page
async function loadHomeCars() {
    try {
        const response = await fetch(`${API_BASE_URL}/cars?status=available`);
        const cars = await response.json();
        
        const carsList = document.getElementById('carsList');
        if (!carsList) return;
        
        carsList.innerHTML = cars.slice(0, 6).map(car => `
            <div class="car-card">
                <div class="car-image">
                    <i class="fas fa-car"></i> Image
                </div>
                <div class="car-info">
                    <div class="car-title">${car.brand} ${car.model}</div>
                    <div class="car-price">$${car.price.toLocaleString()}</div>
                    <div class="car-details">
                        <p><strong>Year:</strong> ${car.year}</p>
                        <p><strong>Mileage:</strong> ${car.mileage} km</p>
                        <p><strong>Fuel:</strong> ${car.fuel}</p>
                    </div>
                    <div class="car-actions">
                        <button class="btn btn-primary" onclick="viewCar(${car._id})">View Details</button>
                        ${checkAuth() ? '<button class="btn btn-secondary" onclick="buyNow(' + car._id + ')">Buy Now</button>' : ''}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading cars:', error);
    }
}

// Filter cars
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
                <div class="car-image">
                    <i class="fas fa-car"></i> Image
                </div>
                <div class="car-info">
                    <div class="car-title">${car.brand} ${car.model}</div>
                    <div class="car-price">$${car.price.toLocaleString()}</div>
                    <div class="car-details">
                        <p><strong>Year:</strong> ${car.year}</p>
                        <p><strong>Mileage:</strong> ${car.mileage} km</p>
                        <p><strong>Fuel:</strong> ${car.fuel}</p>
                    </div>
                    <div class="car-actions">
                        <button class="btn btn-primary" onclick="viewCar(${car._id})">View Details</button>
                        ${checkAuth() ? '<button class="btn btn-secondary" onclick="buyNow(' + car._id + ')">Buy Now</button>' : ''}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error filtering cars:', error);
    }
}

// View car details
function viewCar(carId) {
    alert(`Car details modal would open for car: ${carId}`);
}

// Buy now
function buyNow(carId) {
    const user = checkAuth();
    if (!user) {
        window.location.href = 'pages/login.html';
        return;
    }
    
    alert(`Purchase process would start for car: ${carId}`);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateLoginButton();
    loadHomeCars();
    
    // Set up filter button
    const filterBtn = document.querySelector('button[onclick="filterCars()"]');
    if (filterBtn) {
        filterBtn.addEventListener('click', filterCars);
    }
});
