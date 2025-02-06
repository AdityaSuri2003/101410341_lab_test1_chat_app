async function register(username, password) {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    alert(data.msg);
}

async function login(username, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token); 
        alert("Login successful!");
    } else {
        alert(data.msg);
    }
}

async function fetchMessages() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("You need to log in first!");
        return;
    }

    const response = await fetch('/api/chat/messages', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    console.log("Messages:", data);
}

async function sendMessage(message) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("You need to log in first!");
        return;
    }

    const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: message })
    });

    const data = await response.json();
    console.log("Message sent:", data);
}
