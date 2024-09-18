// Handle registration
document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const phoneNumber = document.getElementById('registerPhoneNumber').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

    const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phoneNumber: phoneNumber,
            password: password,
            role: role  // Send role as well
        })
    });

    const message = await response.text();
    document.getElementById('registerMessage').innerText = message;
});

// Handle login
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const phoneNumber = document.getElementById('loginPhoneNumber').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phoneNumber: phoneNumber,
            password: password
        })
    });

    if (response.ok) {
        const message = await response.text();
        document.getElementById('loginMessage').innerText = message;

        // Redirect to the menu page after successful login
        window.location.href = "menus.html";
    } else {
        document.getElementById('loginMessage').innerText = "Login failed. Please check your credentials.";
    }
});

