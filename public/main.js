const apiUrl = 'http://38.242.159.108:5001/api';
const localStorageKey = 'token';
let token = localStorage.getItem(localStorageKey);

$(document).ready(async function() {
    $("#domain").text(apiUrl);

    if (!token || token.length < 1) {
        showDialogAlert();
    }

    await getKey();

    $('#login').on('click', async () => {
        const username = $('#username').val();
        const password = $('#password').val();

        if (username.length < 3 || password.length < 4) {
            return alert('Please enter your email and password');
        }

        await login(username, password);
    });
});

async function login(email, password) {
    try {
        const response = await $.ajax({
            url: `${apiUrl}/v1/token`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
        });

        token = response.token;
        localStorage.setItem(localStorageKey, token);
        await getKey();
        hideDialogAlert();
    } catch (error) {
        alert(error.responseJSON.message);
        clearInputFields();
    }
}

async function getKey() {
    try {
        const response = await $.ajax({
            url: `${apiUrl}/v1/token`,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log(response)
        $('#key').text(response.token || 'null');
    } catch (error) {
        showDialogAlert();
    }
}

function showDialogAlert() {
    $('#dialog_alert').modal('show');
}

function hideDialogAlert() {
    $('#dialog_alert').modal('hide');
}

function clearInputFields() {
    $('#username').val('');
    $('#password').val('');
}