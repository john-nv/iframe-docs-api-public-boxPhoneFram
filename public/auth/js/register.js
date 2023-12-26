import { API_URL as apiUrl } from "../../util/constants.js";

$('#register').on('click', async () => {
    $("#register").prop("disabled", true);
    const email = $('#email').val()
    const username = $('#username').val()
    const firstName = $('#firstName').val()
    const lastName = $('#lastName').val()
    const password = $('#password').val()
    const re_password = $('#re_password').val()

    if(email.length < 1 
    || username.length < 1 
    || firstName.length < 1 
    || lastName.length < 1 
    || password.length < 1
    || re_password.length < 1) {
        $("#register").prop("disabled", false);
        return alert('Each data must have at least 1 character and correct format')
    }
    if(password !== re_password) {
        $("#register").prop("disabled", false);
        return alert('Password incorrect')
    }

    const data  = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        username: username
    }

    try {
        const response = await $.ajax({
            url: `${apiUrl}/v1/register`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
        });

        if(response) {
            const response = await $.ajax({
                url: `${apiUrl}/v1/token`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ email, password }),
            });
            let token = response.token;
            await $.ajax({
                url: `${apiUrl}/v1/token/refresh`,
                type: 'POST',
                contentType: 'application/json',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            $("#register").prop("disabled", false);
            window.location.href = "/login";
        }
    }
    catch(error){
        $("#register").prop("disabled", false);
        console.error(error)
        alert(error.responseJSON.message)
    }

    

    
})