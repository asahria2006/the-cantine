
document.querySelector('#registerForm').addEventListener('submit', async (e) => {
    // prevent all default action by form
    e.preventDefault();

    const data = {
        firstname: document.querySelector('#firstName').value,
        lastname: document.querySelector('#lastName').value,
        studentClass: document.querySelector('#studentClass').value,
        tier: document.querySelector('#tier').value,
        email: document.querySelector('#email').value,
        username: document.querySelector('#username').value,
        password: document.querySelector('#password').value,
        confirmpassword: document.querySelector('#confirmPassword').value
    }

    // form validation

    if (!data.firstname || !data.lastname || !data.studentClass || !data.tier || !data.email 
        || !data.username || !data.password || !data.confirmpassword
    ) {
        alert('Please fill all the fields');
        return;
    }

    if (data.tier > 7 || data.tier < 1){
        alert('tier must be between 1 and 7');
        return;
    }

    if (data.password !== data.confirmpassword){
        alert('password must match Confirm password');
        return;
    }

    // send data to backend
    try {
        
        // submit data to backend
        const response = await fetch('/register',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });


        // get response from server
        const result = await response.json();


        if(response.ok){
            // alert(result.message)
            alert(result.message);
            window.location.href = result.redirect;

        } else {
            alert(result.message)
        }

    } catch (error){
        console.log(error)
    }

});






function test(){
    const data = {
        firstname: document.querySelector('#firstName').value,
        lastname: document.querySelector('#lastName').value,
        studentClass: document.querySelector('#studentClass').value,
        tier: document.querySelector('#tier').value,
        email: document.querySelector('#email').value,
        username: document.querySelector('#username').value,
        password: document.querySelector('#password').value,
        confirmpassword: document.querySelector('#confirmPassword').value
    }

    if (data.studentClass == ''){
        console.log("its null");
    }

    console.log(data);
}

//11