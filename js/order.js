// Function to update an order by ID
async function updateOrder() {
    const orderId = prompt("Please enter the Order ID to update:");
    const status = document.getElementById('orderstatus').value;

    if (!orderId || !status) {
        alert("Order ID and status are required for updating an order.");
        return;
    }

    const orderDTO = {
        status: status  
    };

    try {
        // Send a PUT request to update the order
        const response = await fetch(`http://localhost:8080/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderDTO)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to update order. Status: ${response.status}. Message: ${errorMessage}`);
        }

        const updatedOrder = await response.json();
        alert(`Order ID: ${updatedOrder.id} updated`);
    } catch (error) {
        console.error('Error updating order:', error);
        alert('Failed to update the order. Please try again.');
    }
}

// Add event listener for the Update Order button
document.addEventListener('DOMContentLoaded', function () {
    const updateOrderBtn = document.getElementById('updateOrderBtn');
    if (updateOrderBtn) {
        updateOrderBtn.addEventListener('click', function(event) {
            event.preventDefault();
            updateOrder();  
        });
    }
});



// Function to fetch the order by ID
async function fetchOrderById() {
    const orderId = document.getElementById('fetchOrderId').value;

    if (!orderId) {
        alert("Please enter an Order ID");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/orders/${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching order with ID: ${orderId}. Status: ${response.status}`);
        }

        const order = await response.json();
        console.log(order);
        alert(`Order ID: ${order.id}, Table ID: ${order.tableId}, Status: ${order.status}`);
    } catch (error) {
        console.error('Error fetching order:', error);
        alert('Failed to fetch order.');
    }
}

// Add event listener for the View Order button
document.addEventListener('DOMContentLoaded', function () {
    const fetchOrderBtn = document.getElementById('fetchOrderBtn');
    if (fetchOrderBtn) {
        fetchOrderBtn.addEventListener('click', function (event) {
            event.preventDefault();
            fetchOrderById();  
        });
    }
});
