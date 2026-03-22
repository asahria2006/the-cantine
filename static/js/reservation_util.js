import {toastMessage} from './layout.js';

export const DATE_FORMAT = {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
}

export function getDayColor(day, events) {

    const obj = {color: '', icon: ''};
    const today = new Date();
    const dateString = day.toLocaleDateString('en-GB', DATE_FORMAT);
    const reservedDay = events.find(e => e.date === dateString);

    if (day.toDateString() === today.toDateString() && !reservedDay) {
        obj.color = 'warning';
        obj.icon = 'plus-lg';
    } else if (day < today) {
        obj.color = 'info';
        obj.icon = 'ban';
    } else if (reservedDay) {
        obj.color = 'success';
        obj.icon = 'check';
    } else {
        obj.color = 'primary';
        obj.icon = 'plus-lg';
    }

    return obj;

}

export async function fetch_to_backend (date) {

    const data = {
        date: date
    }
    try {
        
        // submit data to backend
        const response = await fetch('/reservation',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        // get response from server
        const result = await response.json();


        if(response.ok){
            // alert(result.message);
            toastMessage('Reservation', result.message);

        } else {
            toastMessage('Reservation', result.message);
        }

    } catch (error){
        console.log(error)
    }
}

export async function getEvents(){
    try {
        // submit data to backend
        const response = await fetch('/reservation_data');

        // get response from server
        const result = await response.json();

        return result.data;

    } catch (error){
        console.log(error)
    }
}

export async function fetchRemovedReservation(date) {
    try {
        const data = {
            date: date
        }
        // submit data to backend
        const response = await fetch('/remove_reservation',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        // get response from server
        const result = await response.json();


        if(response.ok){
            toastMessage('Reservation', result.message);

        } else {
            toastMessage('Reservation', result.message)
        }

    } catch (error){
        console.log(error)
    }
}