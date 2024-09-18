document.addEventListener('DOMContentLoaded', function () {
    const menuForm = document.getElementById('menu-form');
    const existingMenuList = document.getElementById('existingMenuList');

    // Fetch and display existing menus
    async function fetchMenus() {
        try {
            const response = await fetch('http://localhost:8080/menus', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch menus');
            }

            const menus = await response.json();
            displayMenus(menus);
        } catch (error) {
            console.error('Error fetching menus:', error);
        }
    }

    // Display the list of menus
    function displayMenus(menus) {
        existingMenuList.innerHTML = ''; // Clear current list
        menus.forEach(menu => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${menu.name}</strong> - $${menu.price.toFixed(2)}
                <br>Description: ${menu.description}
                <br>
                <button onclick="editMenu(${menu.id})">Edit</button>
                <button onclick="deleteMenu(${menu.id})">Delete</button>
            `;
            existingMenuList.appendChild(li);
        });
    }

    // Function to create a new menu item
    menuForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const menuName = document.getElementById('menuName').value;
        const menuDescription = document.getElementById('menuDescription').value;
        const menuPrice = parseFloat(document.getElementById('menuPrice').value);

        const menuDTO = {
            name: menuName,
            description: menuDescription,
            price: menuPrice,
        };

        try {
            const response = await fetch('http://localhost:8080/menus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(menuDTO),
            });

            if (!response.ok) {
                throw new Error('Failed to create menu');
            }

            // Clear form fields after creation
            menuForm.reset();
            fetchMenus(); // Refresh menu list
        } catch (error) {
            console.error('Error creating menu:', error);
        }
    });

    // Function to edit an existing menu
    window.editMenu = async function (menuId) {
        const menuName = prompt('Enter new name for the menu:');
        const menuDescription = prompt('Enter new description for the menu:');
        const menuPrice = parseFloat(prompt('Enter new price for the menu:'));

        if (menuName && menuDescription && menuPrice) {
            const menuDTO = {
                name: menuName,
                description: menuDescription,
                price: menuPrice,
            };

            try {
                const response = await fetch(`http://localhost:8080/menus/${menuId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(menuDTO),
                });

                if (!response.ok) {
                    throw new Error('Failed to update menu');
                }

                fetchMenus(); // Refresh menu list after update
            } catch (error) {
                console.error('Error updating menu:', error);
            }
        } else {
            alert('All fields are required.');
        }
    };

    // Function to delete a menu
    window.deleteMenu = async function (menuId) {
        const confirmDelete = confirm('Are you sure you want to delete this menu item?');

        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8080/menus/${menuId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete menu');
                }

                fetchMenus(); // Refresh menu list after deletion
            } catch (error) {
                console.error('Error deleting menu:', error);
            }
        }
    };

    // Initial fetch to load all menus
    fetchMenus();
});
