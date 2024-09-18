// Function to handle the logout
async function logoutUser() {
    try {
        // Send a POST request to the /auth/logout endpoint
        const response = await fetch('http://localhost:8080/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to log out. Status: ${response.status}. Message: ${errorMessage}`);
        }

        // On successful logout, clear any stored session data if applicable
        alert('Logout successful!');

        // Redirect to login page or clear the UI
        // Assuming there's a login/auth page here
    } catch (error) {
        console.error('Error logging out:', error);
        alert('Failed to log out. Please try again.');
    }
}

// Add event listener for the Logout button
document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('lg');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (event) {
            event.preventDefault();
            logoutUser(); 
            window.location.href = '/auth.html';  
        });
    }
});
