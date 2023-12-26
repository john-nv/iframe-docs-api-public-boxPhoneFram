import { API_URL as apiUrl, KEY_LOCAL } from "../../util/constants.js";
import { formatToVND } from "../../util/format.js";

$( document ).ready( async ()=> {
    let token = localStorage.getItem('token')
    let me = JSON.parse(localStorage.getItem('me'))
    let key
    let jwt
    
    if(!token || token.length < 1) {
        backPageLogin()
    } 

    await _getMe(token)

    $('#getUsername').text(me.username)
    $('#getPrice').text(formatToVND(me.price))
    $('#keyAccount').text('Key account: ' + key)
    $('#accountId').text('Account ID: ' + jwt.id)

    async function _getMe(token) {
        try {
            const response = await $.ajax({
                url: `${apiUrl}/v1/me`,
                type: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            me = response
            jwt = JSON.parse(_readTokenJwt(token))
            console.log(jwt)
            localStorage.setItem(KEY_LOCAL.ME, JSON.stringify(response));
            await _getKey(token)
            if(response.isPermission !== 'admin') backPageLogin()
        } catch (error) {
            backPageLogin()
            console.error(error)
        }
    }

    $('#add').on('click', async () => {
        $("#add").prop("disabled", true);
        if(!isNumber($('#moneyValue').val())) {
            $("#add").prop("disabled", false);
            $('#moneyValue').val('')
            alert('amount must be numeric')
            return
        }
        
        if($('#userId').val().length !== 24) {
            $("#add").prop("disabled", false);
            $('#userId').val('')
            alert('check again userid')
            return
        }
        try {
            let userConfirmation = confirm(`Are you sure to recharge userId ${$('#userId').val()} with the amount of ${$('#moneyValue').val()} vnd?`);
            console.log(userConfirmation);
            
            if (!userConfirmation) {
                $("#add").prop("disabled", false);
                $('#moneyValue').val('');
                $('#userId').val('');
                return;
            }
            const topup = await $.ajax({
                url: `${apiUrl}/v1/topup`,
                type: 'POST',
                data: { topup: Number($('#moneyValue').val()), userId: $('#userId').val() },
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if(topup.message) alert(topup.message)
            $('#moneyValue').val('');
            $('#userId').val('');
            $("#add").prop("disabled", false);
        } catch (error) {
            alert('error')
            $("#add").prop("disabled", false);
            console.error(error)
        }
    })

    async function _getKey(token = token) {
        try {
            const response = await $.ajax({
                url: `${apiUrl}/v1/token`,
                type: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if(response.token) {
                localStorage.setItem(KEY_LOCAL.KEY, response.token);
                key = response.token
            }
        } catch (error) {
            console.error(error)
            alert('Error get key')
            backPageLogin()
        }
    }
    
    function _readTokenJwt(jwt) {
        try {
            return atob(jwt.split('.')[1]); 
        } catch (error) {
            console.error("Error decoding JWT:", error);
        }
    }
    
    function isNumber(value) {
        return /^\d+$/.test(value);
    }

    function backPageLogin(){
        localStorage.clear();
        window.location.href = "/login";
    }
})
