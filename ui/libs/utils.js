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

function clearForm(name) {
    var arr = document.forms[name].getElementsByTagName("input");
    var len = arr.length;
    for (var i=0; i < len; i++ ) {
        arr[i].value = undefined;
    }
}

function getCookie(name){
    var pattern = RegExp(name + "=.[^;]*")
    var matched = document.cookie.match(pattern)
    if(matched){
        var cookie = matched[0].split('=')
        return cookie[1]
    }
    return false
}

function setCookie(key, value){
    document.cookie = key + '=' + value + ';';
}

function deleteAllCookies(){
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++)
      deleteCookie(cookies[i].split("=")[0]);
 }
 
 function setCookie2(name, value, expirydays) {
  var d = new Date();
  expirydays = expirydays !== undefined ? expirydays : 1; // it could be zero
  d.setTime(d.getTime() + (expirydays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = name + "=" + value + "; " + expires;
 }
 
 function deleteCookie(name){
   setCookie2(name,"",-1);
 }