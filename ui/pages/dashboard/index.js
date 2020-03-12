function logout() {
    reqWSC('user.logout', {})
    .then(r => {
        popup.success(JSON.stringify(r));
        deleteCookie('jwtToken');
        window.location = '/';
    })
    .catch(e => {
        popup.error(e.message);
    });
}
