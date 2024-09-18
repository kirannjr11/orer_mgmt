let cart = [];  
let totalPrice = 0;  

async function fetchMenu() {

    const phoneNumber = "your-phone-number";  // Example placeholder for phone number
    const password = "your-password"; 
    try {
        const response = await fetch('http://localhost:8080/menus', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': btoa(phoneNumber  + ':' + password),
            },
             credentials: 'include'
        });

        const menuItems = await response.json();  

        const menuList = document.getElementById('menuList');
        menuList.innerHTML = '';  

        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('menuItem');
            menuItem.innerHTML = `
                <p><strong>${item.name}</strong></p>
                <p>Description: ${item.description}</p>
                <p>Price: $${item.price.toFixed(2)}</p>
                <button onclick="addToCart('${item.name}', ${item.price})">Add to Cart</button>
            `;
            menuList.appendChild(menuItem);
        });
    } catch (error) {
        console.error('Error fetching menu:', error);
    }
}

function addToCart(menuName, menuPrice) {
    const existingItem = cart.find(item => item.name === menuName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: menuName, price: menuPrice, quantity: 1 });
    }

    updateCartDisplay(); 
}

function updateCartDisplay() {
    const cartList = document.getElementById('cartList');
    const totalPriceElement = document.getElementById('totalPrice');

    cartList.innerHTML = ''; 
    totalPrice = 0;  // Reset the total price before recalculating

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
            </tr>
        </thead>
    `;

    const tbody = document.createElement('tbody');

    cart.forEach((item, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
    <td class="cart-item-name">${item.name}</td>
    <td class="cart-actions">
        <button class="cart-action-btn" onclick="decreaseQuantity(${index})">-</button>
        ${item.quantity}
        <button class="cart-action-btn" onclick="increaseQuantity(${index})">+</button>
    </td>
    <td>$${(item.price * item.quantity).toFixed(2)}</td>
    <td><button class="delete-action-btn" onclick="deleteCartItem(${index})">Delete</button></td>
`;


        tbody.appendChild(row);

        // Correctly calculate the total price
        totalPrice += item.price * item.quantity;
    });

    table.appendChild(tbody);
    cartList.appendChild(table);

    // Update the total price display
    totalPriceElement.innerText = `Total Price: $${totalPrice.toFixed(2)}`;
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    updateCartDisplay(); 
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        deleteCartItem(index);  
    }
    updateCartDisplay();  
}

function deleteCartItem(index) {
    cart.splice(index, 1);  
    updateCartDisplay();  
}

document.addEventListener('DOMContentLoaded', function () {
    fetchMenu();  
});

async function placeOrder() {
    const userId = document.getElementById('userId').value;
    const tableId = document.getElementById('tableId').value;
    const status = document.getElementById('orderstatus').value;  

    if (!userId || !tableId || cart.length === 0) {
        alert("Please fill out all the fields and ensure your cart is not empty.");
        return;
    }

    const orderDTO = {
        userId: parseInt(userId),
        tableId: parseInt(tableId),
        items: cart.map(item => ({
            itemId: item.name,  
            quantity: item.quantity
        })),
        status: status  
    };

    try {
        const response = await fetch('http://localhost:8080/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderDTO)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to place order. Status: ${response.status}. Message: ${errorMessage}`);
        }

        alert("Order placed successfully!");
        clearCart();  
        document.getElementById('userId').value = '';
        document.getElementById('tableId').value = '';
        document.getElementById('orderstatus').value = 'CANCEL';  
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place the order. Please try again.');
    }
}

function clearCart() {
    cart = [];
    updateCartDisplay();
}

document.addEventListener('DOMContentLoaded', function () {
    fetchMenu();  

    const placeOrderBtn = document.getElementById('placeOrderBtn');

    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function(event) {
            event.preventDefault();  // Prevent default form submission
            placeOrder();  // Call the placeOrder function
        });
    } else {
        console.error('Place Order button not found.');
    }
});
