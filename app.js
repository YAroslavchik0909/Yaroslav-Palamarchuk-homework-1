const STORAGE_KEY = 'shopping_list_items';
const initialProducts = [
    { id: 1, name: 'Помідори', quantity: 2, isBought: true },
    { id: 2, name: 'Печиво', quantity: 2, isBought: false },
    { id: 3, name: 'Сир', quantity: 1, isBought: false }
];

let products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || initialProducts;
function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

const inputNewItem = document.querySelector('.add-item input');
const btnAddItem = document.querySelector('.btn-add');
const itemsList = document.querySelector('.items-list');
const leftStatsContainer = document.querySelector('.stats-section .stats-card:nth-child(1) .stats-tags');
const rightStatsContainer = document.querySelector('.stats-section .stats-card:nth-child(2) .stats-tags');

function render() {
    itemsList.innerHTML = '';
    leftStatsContainer.innerHTML = '';
    rightStatsContainer.innerHTML = '';

    products.forEach(product => {
        const li = document.createElement('li');
        li.className = `item-row ${product.isBought ? 'bought' : ''}`;

        if (product.isBought) {
            li.innerHTML = `
                <span class="item-name">${product.name}</span>
                <div class="item-controls">
                    <span class="quantity-badge">${product.quantity}</span>
                    <button class="btn-status" data-tooltip="Скасувати покупку">Не куплено</button>
                </div>
            `;
            li.querySelector('.btn-status').addEventListener('click', () => toggleStatus(product.id));
        } else {
            const isMinusDisabled = product.quantity === 1 ? 'disabled' : '';
            li.innerHTML = `
                <span class="item-name" data-tooltip="Натисніть для редагування">${product.name}</span>
                <div class="item-controls">
                    <button class="btn-round minus ${isMinusDisabled}" data-tooltip="Зменшити">-</button>
                    <span class="quantity-badge">${product.quantity}</span>
                    <button class="btn-round plus" data-tooltip="Збільшити">+</button>
                    <button class="btn-status buy" data-tooltip="Позначити як куплено">Куплено</button>
                    <button class="btn-round delete" data-tooltip="Видалити">×</button>
                </div>
            `;
            li.querySelector('.plus').addEventListener('click', () => changeQuantity(product.id, 1));
            if (product.quantity > 1) {
                li.querySelector('.minus').addEventListener('click', () => changeQuantity(product.id, -1));
            }
            li.querySelector('.buy').addEventListener('click', () => toggleStatus(product.id));
            li.querySelector('.delete').addEventListener('click', () => deleteProduct(product.id));
            const nameSpan = li.querySelector('.item-name');
            nameSpan.addEventListener('click', () => activateEditMode(nameSpan, product.id));
        }
        itemsList.appendChild(li);
        const tag = document.createElement('span');
        tag.className = `tag ${product.isBought ? 'bought-tag' : ''}`;
        tag.innerHTML = `${product.name} <span class="tag-num">${product.quantity}</span>`;

        if (product.isBought) {
            rightStatsContainer.appendChild(tag);
        } else {
            leftStatsContainer.appendChild(tag);
        }
    });
    saveState();
}

function addProduct() {
    const name = inputNewItem.value.trim();
    if (!name) return;
    const newProduct = {
        id: Date.now(),
        name: name,
        quantity: 1,
        isBought: false
    };
    products.push(newProduct);
    inputNewItem.value = '';
    inputNewItem.focus();
    
    render();
}

btnAddItem.addEventListener('click', addProduct);
inputNewItem.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addProduct();
});

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    render();
}

function changeQuantity(id, amount) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.quantity += amount;
        render();
    }
}

function toggleStatus(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.isBought = !product.isBought;
        render();
    }
}

function activateEditMode(spanElement, id) {
    const currentName = spanElement.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'item-name-edit';
    input.value = currentName;
    spanElement.replaceWith(input);
    input.focus();

    function saveNewName() {
        const newName = input.value.trim();
        const product = products.find(p => p.id === id);
        
        if (product && newName) {
            product.name = newName;
        }
        render();
    }
    input.addEventListener('blur', saveNewName);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        }
    });
}

render();
