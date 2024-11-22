async function fetchUserData(token) {
    let res;
    const url = '/web-api-service/Fl64_Gpt_User_Shared_Web_Api_SignUp_Verify';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token})
        });
        if (response.ok) {
            const {data} = await response.json();
            res = data;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
    return res;
}

function showUserData(data) {
    document.getElementById('title').innerText = 'Email Verified Successfully';
    document.getElementById('email').innerText = data.email;
    document.getElementById('dateCreated').innerText = new Date(data.dateCreated).toLocaleDateString();
    document.getElementById('pin').innerText = data.pin;
    document.getElementById('pinInfo').innerText = data.pin;
    document.getElementById('status').innerText = data.status;
    document.getElementById('loader').style.display = 'none';
    document.getElementById('info').style.display = 'block';
    document.getElementById('redirectBtn').style.display = 'inline-block';
}

function showError(message) {
    document.getElementById('title').innerText = message || 'Verification Failed';
    document.getElementById('loader').style.display = 'none';
}

export default async function initialize() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        showError('Token is missing in the URL');
        return;
    }

    const data = await fetchUserData(token);
    if (data) {
        switch (data.resultCode) {
            case 'SUCCESS':
                showUserData(data);
                break;
            case 'INVALID_TOKEN':
                showError('Invalid or expired verification token.');
                break;
            case 'USER_NOT_FOUND':
                showError('User associated with the token was not found.');
                break;
            default:
                showError('An unknown error occurred during verification.');
        }
    } else {
        showError('Failed to fetch verification data.');
    }
}

export function redirectToChat() {
    window.location.href = 'https://chatgpt.com/g/g-FaoraVhde-nutri-log';
}
