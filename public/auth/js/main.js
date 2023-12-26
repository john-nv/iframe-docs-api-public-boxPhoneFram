import { API_URL as apiUrl, KEY_LOCAL } from "../../util/constants.js";

const IS_PERMISSION = {
    USER: 'user',
    ADMIN: 'admin'
}

let token = localStorage.getItem(KEY_LOCAL.TOKEN);

if(token) {
    await _getMe(token);
}else {
    localStorage.clear();
}

$('#login').on('click', async () => {
    $("#login").prop("disabled", true);
    const username = $('#username').val()
    const password = $('#password').val()

    if(username.length < 1 || password.length < 1) return alert('Please fill in your account password')
    await _login(username, password)
})

async function _login(email, password) {
    try {
        const response = await $.ajax({
            url: `${apiUrl}/v1/token`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
        });

        token = response.token;
        localStorage.setItem(KEY_LOCAL.TOKEN, token);
        await _getMe(token);
        $("#login").prop("disabled", false);
    } catch (error) {
        $("#login").prop("disabled", false);
        clearInput()
        alert(error.responseJSON.message);
        console.error(error)
        localStorage.clear();
    }
}

async function _getMe(token) {
    try {
        const response = await $.ajax({
            url: `${apiUrl}/v1/me`,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log(response)
        localStorage.setItem(KEY_LOCAL.ME, JSON.stringify(response));
        switch (response.isPermission) {
            case IS_PERMISSION.USER:
                return window.location.href = "/home";
            case IS_PERMISSION.ADMIN:
                return window.location.href = "/admin";
            default:
                localStorage.clear();
                return window.location.href = window.location.href;
        }
    } catch (error) {
        localStorage.clear();
        console.error(error)
    }
}

function clearInput(){
    $('#username').val('')
    $('#password').val('')
}
