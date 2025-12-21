import {toastMessage} from './layout.js';

const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const studentClass = document.getElementById('studentClass');
const tier = document.getElementById('tier');
const email = document.getElementById('email');
const username = document.getElementById('username');

const personalInfoForm = document.getElementById('personal_info');


let userData;

async function loadData() {
    try {
    const response = await fetch('/personal_info', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    // get response from server
    const result = await response.json();

    userData = result.user_data;

    console.log(userData);

    } catch (error){
        console.log(error)
    }

    firstName.value = userData.firstName;
    lastName.value = userData.lastName;
    username.value = userData.username;
    studentClass.value = userData.section;
    tier.value = userData.tier;
    email.value = userData.email;

}

personalInfoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const data = {
            email: email.value
        }
        
        // submit data to backend
        const response = await fetch('/personal_info',{
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        // get response from server
        const result = await response.json();


        if(response.ok){
            toastMessage('Personal Info', result.message);

        } else {
            alert(result.message)
        }

    } catch (error){
        console.log(error)
    }

    await loadData();
});


loadData();



