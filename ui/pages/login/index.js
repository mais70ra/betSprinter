function login() {
    let username = document.getElementById('login.username').value;
    if (!username) {
        alert('Please enter username');
        return;
    }
    let password = document.getElementById('login.password').value;
    if (!password) {
        alert('Please enter password');
        return;
    }
    reqWSC('user.login', {
        username: username,
        password: password
    })
    .then(r => {
        setCookie('jwtToken', r.token);
        popup.success(JSON.stringify(r));
    })
    .catch(e => {
        popup.error(e.message);
    });
}

function testRequest() {
    reqWSC('user.add', {
        username: 'asd',
        password: 'asd'
    })
    .then(r => {
        popup.success(JSON.stringify(r));
    })
    .catch(e => {
        popup.error(e.message);
    });
}