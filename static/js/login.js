//import { kosmos_get, kosmos_post } from './kosmosRequest.js';

function authenticate() {
    $('.login-btn').html('Authenticating...').attr('disabled', true)
    let url = `${base_url}students/admin_login/`
    let username = $('#admin-username').val();
    let password = $('#admin-password').val();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    fetch(url, {
        method:'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(res => {return res.json()})
    .then(data => {
        //console.log(data);
        if(data['status'] == 'success') {
            localStorage.setItem('api_key', data.data.api_token)
            localStorage.setItem('username', username)
            if(data.data.image) {
                localStorage.setItem('dp', data.data.image)
            }
            localStorage.setItem('names', `${data.data.first_name} ${data.data.last_name}`);
            location.href = './admin.html'
        }
        else if(data['status'] == 'error') {
            $('#admin_err').html(`<i class="fa fa-warning"></i> ${data['message']}`)
            swal('Error', data['message'], "error")
        }
        $('.login-btn').html('Log In').attr('disabled', false)
    })
    .catch(err => {
        console.log(err);
        swal("Error", "Please check your internet connection", "error")
        $('.login-btn').html('Log In').attr('disabled', false);
    })
}

function logout() {
    let url = `${base_url}students/admin_logout/`
    const formData = new FormData();
    formData.append('api_token', localStorage.api_key);

    fetch(url, {
        method:'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(res => {return res.json()})
    .then(data => {
        //console.log(data);
        if(data['status'] == 'success') {
            localStorage.removeItem('api_key')
            localStorage.removeItem('names');
            localStorage.removeItem('dp');
            localStorage.removeItem('username');
            location.href = './index.html'
        }
        else if(data['status'] == 'error') {
            console.log(data)
            swal('Error', "Error occured", "error")
        }
    })
    .catch(err => {
        console.log(err);
        swal("Error", "Please check your internet connection", "error")
        swal('Error', "Error occured", "error")
    })
}


