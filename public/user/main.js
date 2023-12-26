import { API_URL as apiUrl, KEY_LOCAL } from "../../util/constants.js";
import { formatToVND } from "../../util/format.js";

let me = JSON.parse(localStorage.getItem('me'))
let jwt = ''
let token = localStorage.getItem('token')
let key = ''

if(!me || me.length < 1 || !me.username || !jwt || jwt.length < 1 || !token || token.length < 1 || !key || key.length < 1) 

if(!token || token.length < 1) backPageLogin()

$( document ).ready(async () => {
    await _getMe(token)
    hideOverlay()
    $('#getUsername').text(me.username)
    $('#getPrice').text(formatToVND(me.price))
    $('.content_trans').text(jwt.id)
    $('#keyAccount').text('Key account: ' + key)

    function hideOverlay() {
        $('.overlay, body').addClass('loaded');
        setTimeout(()=>{
            $('.overlay').remove();
        },1500)
    }
});

function backPageLogin(){
    localStorage.clear();
    window.location.href = "/login";
}

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

async function _getMe(token) {
    try {
        const response = await $.ajax({
            url: `${apiUrl}/v1/me`,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        me = response
        localStorage.setItem(KEY_LOCAL.ME, JSON.stringify(response));
        jwt = JSON.parse(_readTokenJwt(token))
        await _getKey(token)
        if(response.isPermission !== 'user') backPageLogin()
    } catch (error) {
        backPageLogin()
        console.error(error)
    }
}

function _readTokenJwt(jwt) {
    try {
        return atob(jwt.split('.')[1]); 
    } catch (error) {
        console.error("Error decoding JWT:", error);
    }
}
