const navlist = document.querySelectorAll('.nav-link');


navlist.forEach((element) => {
    let path = element.getAttribute('href');
    if ( path == window.location.pathname){
        element.classList.add('text-primary');
    }

});