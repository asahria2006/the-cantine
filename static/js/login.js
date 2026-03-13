document.querySelector('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const loginData = {
        username: document.querySelector('#username').value,
        password: document.querySelector('#password').value
    }

    if (!loginData.username || !loginData.password){
        alert('please fill inputs');
        return;
    }

    try {

        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        }) 

        const result = await response.json();

        if (response.ok) {
            window.location.href = result.redirect
        } else {
            alert(result.message)
        }


    } catch (error) {
        console.log(error);
    }

});


document.getElementById('demoLogin').addEventListener('click', async () => {
    const loginData = {
        username: 'johndoe2',
        password: 'demoJohnDoe2'
    }
    
    try {

        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        }) 

        const result = await response.json();

        if (response.ok) {
            window.location.href = result.redirect
        } else {
            alert(result.message)
        }


    } catch (error) {
        console.log(error);
    }

});