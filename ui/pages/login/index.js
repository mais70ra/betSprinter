function login() {
    var msg = validateForm('loginForm');
    reqWSC('user.login', msg)
    .then(r => {
        setCookie('jwtToken', r.token);
        popup.success(JSON.stringify(r));
        window.location = '/pages/dashboard/';
    })
    .catch(e => {
        popup.error(e.message);
    });
}

function showRegister() {
    var registrationForm = document.getElementById("registrationForm");
    if (registrationForm.style.display === '' || registrationForm.style.display === "none") {
        document.getElementById("showRegister").innerHTML = 'Hide registration form';
        registrationForm.style.display = "block";
    } else {
        document.getElementById("showRegister").innerHTML = 'Not registered?';
        registrationForm.style.display = "none";
    }
}

function registerUser() {
    var msg = validateForm('registrationForm');
    if (msg.password !== msg.repassword) {
        alert('Password and repeat password are not matching');
        return
    }
    delete msg.repassword;
    reqWSC('user.add', msg)
    .then(r => {
        popup.success(JSON.stringify(r));
    })
    .catch(e => {
        popup.error(e.message);
    });
}
