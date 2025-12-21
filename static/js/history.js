const historyList = document.getElementById('historyList');

async function laodList() {

    let dateList;
    let userPrice;
    try {
        const response = await fetch('/history', {
            method:'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        // get response from server
        const result = await response.json();

        dateList = result.data;
        userPrice = result.userPrice;

    } catch (error){
        console.log(error)
    }

    let listHtml = '';

    dateList.forEach(element => {
        listHtml+= `
            <li class="py-2 px-3 border border-1 border-info-subtle rounded-1 shadow-sm d-flex justify-content-between my-1">
                <span class="fw-medium text-success">${element.date}</span>
                <span class="fw-medium text-danger">-${userPrice}€</span>
            </li>
        `;
    });

    historyList.innerHTML = listHtml;

}

laodList();