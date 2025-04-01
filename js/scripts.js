// Contact Form Success
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent default form submission behavior
  
    // After form submission, redirect to contact-success page
    window.location.href = "contact-success.html";  // Redirect to the success page
  });
  
  // Membership Form Success
  document.getElementById("membership-form").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent default form submission behavior
    // After form submission, redirect to membership success page
    window.location.href = "membership-success.html";  // Navigate to success page
  });
  
  // E-board Sign Up Handling (creates account)
  document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
  
    fetch('/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, role }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        alert('You are all signed up!'); // Display success message
        window.location.href = 'login.html'; // Redirect to login page
    })
    .catch(error => console.error('Error:', error));
  });
  
  // E-board Login Handling (logs in and redirects to E-board pages)
  document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    fetch('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token); // Store JWT token in localStorage
            localStorage.setItem('username', username); // Store username in localStorage
            window.location.href = 'dashboard.html'; // Redirect to dashboard page
        }
    })
    .catch(error => console.error('Error:', error));
  });
  
  // Display the username on top right if logged in
  document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
  
    if (username) {
        const usernameElement = document.createElement('span');
        usernameElement.textContent = `Welcome, ${username}`;
        usernameElement.style.float = "right"; // Position the username to the top right
        usernameElement.style.padding = "10px"; // Padding for better spacing
        document.querySelector('nav').appendChild(usernameElement); // Append to navigation bar
    }
  });
  
  // Check if E-board member is logged in before allowing access to the Edit Events page
  document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");  // Check if token exists
    if (!token) {
        window.location.href = "login.html";  // If no token, redirect to login page
    }
  });
  
  // Handle event creation
  document.getElementById("edit-event-form").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const eventName = document.getElementById("event-name").value;
    const eventDate = document.getElementById("event-date").value;
    const eventLocation = document.getElementById("event-location").value;
    const eventDescription = document.getElementById("event-description").value;
  
    // Send event data to backend for saving in the database
    fetch("/events", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`  // Include token for authentication
        },
        body: JSON.stringify({
            event_name: eventName,
            event_date: eventDate,
            event_location: eventLocation,
            event_description: eventDescription
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);  // Show success message
        window.location.href = "events.html";  // Redirect back to events page
    })
    .catch(error => {
        console.error("Error creating event:", error);
    });
  });
  
  // Handle viewing of members
  document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");  // Check if token exists
    if (!token) {
        window.location.href = "login.html";  // If no token, redirect to login page
    }
  
    // Fetch and display members
    fetch("/members", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`  // Include token for authentication
        }
    })
    .then(response => response.json())
    .then(data => {
        const membersList = document.getElementById("members-list");
        membersList.innerHTML = data.map(member => `
            <tr>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.message}</td>
                <td>${member.registered_events}</td>
            </tr>
        `).join('');
    })
    .catch(error => {
        console.error("Error fetching members:", error);
    });
  });  