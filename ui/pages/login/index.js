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

function validateForm(name) {
    var arr = document.forms[name].getElementsByTagName("input");
    var obj = {};
    var len = arr.length;
    var validation = [];
    // arr[0].getAttribute('required')
    for (var i=0; i < len; i++ ) {
        obj[arr[i].getAttribute('name')] = arr[i].value;
        if (arr[i].getAttribute('required') === '' || arr[i].getAttribute('required') === 'true') {
            if (!arr[i].value) {
                validation.push(arr[i].getAttribute('placeholder'));
            }
        }
    }
    if (validation.length > 0) {
        let message = 'These fields are required: ' + validation.join(', ');
        alert(message);
        throw new Error(message);
    }
    return obj;
}
// var arr = document.forms["registrationForm"].getElementsByTagName("input");
// for (var i=0; i < arr.length; i++ ) {console.log(arr[i]) }
