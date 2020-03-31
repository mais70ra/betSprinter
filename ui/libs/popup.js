var popupElement;
var popupTitle;
var popupContent;
var popup = {
    success: function(msg) {
        popupTitle.innerHTML = 'Success';
        popupContent.innerHTML = msg;
        popupElement.style.display = 'block';
    },
    error: function(msg) {
        popupTitle.innerHTML = 'Error';
        popupContent.innerHTML = msg;
        popupElement.style.display = 'block';
    }
};
window.onload = function() {
    document.body.insertAdjacentHTML('beforeend', `<div id="popup" class="modal">
    <div class="modal-content">
    <div class="modal-header">
        <span class="close" id="closePopup">×</span>
        <h2 id="popupTitle"></h2>
    </div>
    <div class="modal-body" id="popupContent">
    </div>
    </div>
    </div>`);
    popupElement = document.getElementById('popup');
    popupTitle = document.getElementById('popupTitle');
    popupContent = document.getElementById('popupContent');
    document.getElementById("closePopup").onclick = function() {
        popupElement.style.display = "none";
    };
};
