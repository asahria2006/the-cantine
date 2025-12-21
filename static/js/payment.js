import { toastMessage } from './layout.js';


document.getElementById('rechargeBtn').addEventListener('click', async (e) => {
    e.preventDefault();

    const code = document.getElementById('couponCode').value.trim();

    const data = {
        code: code
    }

    try {

        const response = await fetch('/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if(response.ok) {
            toastMessage('Payments', result.message);
            document.getElementById('currentBalance').innerHTML = `
                Current balance: <span class="text-success"> ${result.currentBalance}€</span>
            `;
        } else {
            toastMessage('Payments', result.message);
        }

    } catch(error) {
        console.log(error);
    }
});