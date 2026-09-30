// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let wishlist = [];
let currentFilter = 'all';

// ===== ЭЛЕМЕНТЫ DOM =====
const addItemForm = document.getElementById('addItemForm');
const itemNameInput = document.getElementById('itemName');
const itemLinkInput = document.getElementById('itemLink');
const itemPriceInput = document.getElementById('itemPrice');
const itemCategoryInput = document.getElementById('itemCategory');
const wishlistItems = document.getElementById('wishlistItems');
const totalPriceElement = document.getElementById('totalPrice');

// ===== ЗАГРУЗКА ДАННЫХ ПРИ СТАРТЕ =====
window.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    renderWishlist();
});

// ===== ОБРАБОТЧИК ОТПРАВКИ ФОРМЫ =====
addItemForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addItem();
});

// ===== ФУНКЦИЯ ДОБАВЛЕНИЯ ТОВАРА =====
function addItem() {
    if (!validateInputs()) {
        return;
    }

    const item = {
        id: Date.now(), // Уникальный ID
        name: itemNameInput.value.trim(),
        link: itemLinkInput.value.trim(),
        price: parseFloat(itemPriceInput.value),
        category: itemCategoryInput.value,
        date: new Date().toISOString()
    };

    wishlist.push(item);
    saveToLocalStorage();
    
    // Очистка формы
    addItemForm.reset();
    
    renderWishlist();
    
    // Показать уведомление
    showNotification('Товар добавлен!', 'success');
}

// ===== ФУНКЦИЯ УДАЛЕНИЯ ТОВАРА =====
function deleteItem(id) {
    if (confirm('Удалить этот товар из списка?')) {
        wishlist = wishlist.filter(item => item.id !== id);
        saveToLocalStorage();
        renderWishlist();
        showNotification('Товар удалён', 'info');
    }
}

// ===== ФУНКЦИЯ ФИЛЬТРАЦИИ =====
function filterItems(category) {
    currentFilter = category;
    
    // Обновляем активную кнопку
    document.querySelectorAll('.btn-group .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderWishlist();
}

// ===== ФУНКЦИЯ ОТРИСОВКИ СПИСКА =====
function renderWishlist() {
    wishlistItems.innerHTML = '';
    
    // Фильтруем товары
    const filteredItems = currentFilter === 'all' 
        ? wishlist 
        : wishlist.filter(item => item.category === currentFilter);
    
    // Если список пуст
    if (filteredItems.length === 0) {
        wishlistItems.innerHTML = `
            <div class="empty-message">
                <i class="bi bi-inbox"></i>
                <h4>Список желаний пуст</h4>
                <p>Добавьте первый товар выше!</p>
            </div>
        `;
        totalPriceElement.textContent = '0 ₽';
        return;
    }
    
    // Считаем общую сумму
    let total = 0;
    
    // Создаём карточки для каждого товара
    filteredItems.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-4';
        
        const categoryNames = {
            'electronics': '📱 Электроника',
            'clothes': '👕 Одежда',
            'books': '📚 Книги',
            'other': '📦 Другое'
        };
        
        col.innerHTML = `
            <div class="card h-100 shadow-sm card-item">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-secondary category-badge">${categoryNames[item.category]}</span>
                        <button class="btn btn-sm btn-outline-danger delete-btn" onclick="deleteItem(${item.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <h5 class="card-title mb-2">
                        <a href="${item.link}" target="_blank" class="item-link">
                            ${item.name}
                            <i class="bi bi-box-arrow-up-right"></i>
                        </a>
                    </h5>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="text-muted">
                            <i class="bi bi-tag"></i> Цена:
                        </span>
                        <h4 class="text-success mb-0">${item.price.toLocaleString('ru-RU')} ₽</h4>
                    </div>
                </div>
            </div>
        `;
        
        wishlistItems.appendChild(col);
        total += item.price;
    });
    
    // Обновляем общую сумму
    totalPriceElement.textContent = total.toLocaleString('ru-RU') + ' ₽';
}

// ===== ВАЛИДАЦИЯ ВВОДА =====
function validateInputs() {
    const name = itemNameInput.value.trim();
    const link = itemLinkInput.value.trim();
    const price = parseFloat(itemPriceInput.value);

    if (name === '' || name.length < 2) {
        showNotification('Название должно содержать минимум 2 символа', 'warning');
        itemNameInput.focus();
        return false;
    }

    if (link === '' || !isValidURL(link)) {
        showNotification('Введите корректную ссылку (https://...)', 'warning');
        itemLinkInput.focus();
        return false;
    }

    if (isNaN(price) || price <= 0) {
        showNotification('Цена должна быть больше нуля', 'warning');
        itemPriceInput.focus();
        return false;
    }

    return true;
}

// ===== ПРОВЕРКА URL =====
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// ===== LOCAL STORAGE =====
function saveToLocalStorage() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
        wishlist = JSON.parse(saved);
    }
}

// ===== УВЕДОМЛЕНИЯ =====
function showNotification(message, type) {
    // Создаём элемент уведомления
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
