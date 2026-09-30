// ===== ПОЛУЧАЕМ ЭЛЕМЕНТЫ СО СТРАНИЦЫ =====
const itemNameInput = document.getElementById('itemName');
const itemLinkInput = document.getElementById('itemLink');
const itemPriceInput = document.getElementById('itemPrice');
const addBtn = document.getElementById('addBtn');
const wishlistItems = document.getElementById('wishlistItems');
const totalPriceElement = document.getElementById('totalPrice');

// ===== ХРАНИЛИЩЕ ДАННЫХ =====
let wishlist = [];

// ===== ФУНКЦИЯ ПРОВЕРКИ URL =====
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// ===== ФУНКЦИЯ ПРОВЕРКИ ВСЕХ ПОЛЕЙ =====
function validateInputs() {
    const name = itemNameInput.value.trim();
    const link = itemLinkInput.value.trim();
    const price = itemPriceInput.value.trim();

    // Проверяем название
    if (name === '') {
        alert('Название товара не может быть пустым!');
        itemNameInput.focus();
        return false;
    }

    if (name.length < 2) {
        alert('Название должно содержать минимум 2 символа!');
        itemNameInput.focus();
        return false;
    }

    // Проверяем ссылку
    if (link === '') {
        alert('Ссылка на товар обязательна!');
        itemLinkInput.focus();
        return false;
    }

    if (!isValidURL(link)) {
        alert('Неверный формат ссылки! Пример: https://example.com');
        itemLinkInput.focus();
        return false;
    }

    // Проверяем цену
    if (price === '') {
        alert('Цена не может быть пустой!');
        itemPriceInput.focus();
        return false;
    }

    const priceNum = parseFloat(price);
    
    if (isNaN(priceNum)) {
        alert('Цена должна быть числом!');
        itemPriceInput.focus();
        return false;
    }

    if (priceNum <= 0) {
        alert('Цена должна быть больше нуля!');
        itemPriceInput.focus();
        return false;
    }

    if (priceNum > 1000000000) {
        alert('Цена слишком большая!');
        itemPriceInput.focus();
        return false;
    }

    return true;
}

// ===== ФУНКЦИЯ ДОБАВЛЕНИЯ ТОВАРА =====
function addItem() {
    // Сначала проверяем все поля
    if (!validateInputs()) {
        return;  // Если проверка не прошла — выходим
    }

    // Получаем значения (теперь мы уверены, что они корректны)
    const name = itemNameInput.value.trim();
    const link = itemLinkInput.value.trim();
    const price = parseFloat(itemPriceInput.value);

    // Создаём объект товара
    const item = {
        name: name,
        link: link,
        price: price
    };

    // Добавляем товар в массив
    wishlist.push(item);

    // Очищаем поля ввода
    itemNameInput.value = '';
    itemLinkInput.value = '';
    itemPriceInput.value = '';

    // Обновляем отображение списка
    renderWishlist();
}

// ===== ФУНКЦИЯ УДАЛЕНИЯ ТОВАРА =====
function deleteItem(index) {
    wishlist.splice(index, 1);
    renderWishlist();
}

// ===== ФУНКЦИЯ ОТРИСОВКИ СПИСКА =====
function renderWishlist() {
    wishlistItems.innerHTML = '';
    let total = 0;

    wishlist.forEach((item, index) => {
        const li = document.createElement('li');
        
        li.innerHTML = `
            <span>
                <a href="${item.link}" target="_blank">${item.name}</a>
                - ${item.price.toFixed(2)} руб.
            </span>
            <button class="delete-btn" onclick="deleteItem(${index})">Удалить</button>
        `;
        
        wishlistItems.appendChild(li);
        total += item.price;
    });

    totalPriceElement.textContent = total.toFixed(2);
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
addBtn.addEventListener('click', addItem);

itemPriceInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addItem();
    }
});

// ===== ДОПОЛНИТЕЛЬНАЯ ЗАЩИТА: только цифры в поле цены =====
itemPriceInput.addEventListener('input', function(e) {
    // Удаляем всё, что не является цифрой или точкой
    this.value = this.value.replace(/[^0-9.]/g, '');
    
    // Не даём ввести больше одной точки
    const parts = this.value.split('.');
    if (parts.length > 2) {
        this.value = parts[0] + '.' + parts.slice(1).join('');
    }
});

// ===== ДОПОЛНИТЕЛЬНАЯ ЗАЩИТА: проверка ссылки при вводе =====
itemLinkInput.addEventListener('blur', function() {
    const link = this.value.trim();
    if (link !== '' && !isValidURL(link)) {
        this.style.borderColor = 'red';
        this.title = 'Неверный формат ссылки';
    } else {
        this.style.borderColor = '';
        this.title = '';
    }
});

itemLinkInput.addEventListener('input', function() {
    this.style.borderColor = '';
    this.title = '';
});