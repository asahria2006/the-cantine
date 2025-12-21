const navlist = document.querySelectorAll('.nav-link');


navlist.forEach((element) => {
    let path = element.getAttribute('href');
    if ( path == window.location.pathname){
        element.classList.add('text-primary');
    }

});


export function toastMessage(routeName, message) {
    const toast = document.getElementById('toast');
    
    toast.style.display = 'block';

    const closeButton = document.getElementById('closeToast');

    document.getElementById('routeName').innerHTML = routeName;
    document.getElementById('toastMessage').innerHTML = message;

    closeButton.addEventListener('click', () => {
        toast.style.display = 'none';
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const msg = JSON.parse(localStorage.getItem('toastMessage'));

    if (msg) {
        toastMessage(msg.routeName, msg.message);
        localStorage.removeItem('toastMessage');
    }
});
