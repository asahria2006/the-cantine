import {getDayColor, fetch_to_backend, getEvents, fetchRemovedReservation} from './reservation_util.js';

let nav = 0;
let clicked = null;

const newEventModal = document.getElementById('newEventModal');
const backdrop = document.getElementById('modalBackDrop');
const cancelButton = document.getElementById('cancelButton');
const saveButton = document.getElementById('saveButton');

const calendar = document.getElementById('calendar');
const reservedList = document.getElementById('reservedList');

// weeddays in a list, later used to check padding days
const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

// we have to fetch info from backend
let events;

async function load() {
    const dt = new Date();

    if (nav !== 0){
        dt.setMonth(new Date().getMonth() + nav);
    }

    // day, month, year of a current date
    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();


    // get 1st day of month
    const firstDayOfMonth = new Date(year, month, 1);

    // get last day of month, by incrementing to next month;
    // and indexing day param to zero, it directly point to the last ay of month
    // if its 31, 30, 29, or 28 _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
    const daysInMonth = new Date(year, month+1, 0).getDate();

    // get a date string, to be able to extract the first week day of the month
    const dateString = firstDayOfMonth.toLocaleDateString('en-gb',{
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    // calculating the padding, to be able to find how much day to skip
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    //populate current month
    document.getElementById('monthDisplay').innerText = 
        `${dt.toLocaleDateString('en-gb', {month: 'long'})} ${year}`;

    
        
    events = await getEvents();
        
    calendar.innerHTML = '';


    // final loop to load the calendar
    for(let i = 1; i <= paddingDays + daysInMonth; i++){

        
        //
        const currentDate = new Date(year, month, i-paddingDays)

        const daySquare = document.createElement('div');
        daySquare.classList.add('day', 'border', 'border-info-subtle', 'border-1', 'rounded-1', 'shadow-sm');

        if (i > paddingDays){
            // daySquare.innerText = i - paddingDays;

            // const dayColor = getDayColor(currentDate);
            const {color, icon} = getDayColor(currentDate, events);

            daySquare.innerHTML = `
                
                <span class="fs-3 fw-semibold text-${color}">${i - paddingDays}</span>
                <span class="col-6 badge bg-${color} rounded-pill"><i class="bi bi-${icon}"></i></span> 
            `;

            // check if its reserved show green dot and directly make inner html
            if (color !== 'info') {

                daySquare.classList.add('day-active');

                daySquare.addEventListener('click', () => {
                    openModal(currentDate);
                    
                });
            }
            

        } else {
            daySquare.classList.add('padding');
        }

        calendar.appendChild(daySquare);
    }
}

function openModal(date) {
    clicked = date;

    const dateString = date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const reservedDay = events.find(e => e.date === dateString);

    if (reservedDay) {
        newEventModal.style.display = 'block';
        saveButton.innerHTML = 'Remove Reservation';
    } else {
        newEventModal.style.display = 'block';
        saveButton.innerHTML = 'Save';
    }
    cancelButton.innerHTML = 'Cancel';

    document.querySelector('.modal-body').innerHTML = `
        <span class="text-primary bg-primary-subtle fw-semibold rounded-3 px-2 py-1 mb-3 d-inline-block">${dateString}</span>

        <h5> Today menus: </h5>
    `;

    backdrop.style.display = 'block';
}

async function closeModal() {
    newEventModal.style.display = 'none';
    backdrop.style.display = 'none';
    clicked = null;
    await load();
}

async function saveEvent() {
    const dateString = clicked.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const reservedDay = events.find(e => e.date === dateString);

    if(reservedDay) {
        await fetchRemovedReservation(dateString);
    } else {
        await fetch_to_backend(dateString);
    }

    await closeModal();
    await loadReservedList();

}

function initButton() {
    document.getElementById('nextButton').addEventListener('click', async () => {
        nav++;
        await load();
    });

    document.getElementById('backButton').addEventListener('click', async () => {
        nav--;
        await load();
    });

    document.getElementById('saveButton').addEventListener('click', saveEvent);
    document.getElementById('cancelButton').addEventListener('click', async () => {await closeModal()});
    document.getElementById('crossButton').addEventListener('click', async () => {await closeModal()});

}

async function loadReservedList() {
    events = await getEvents();
    const today = new Date;

    const filteredList = events.filter((element) => {
        element.dateObj = new Date(element.date);

        if (element.dateObj < today){
            return false;
        }

        return true;
    });

    filteredList.sort((a, b) => a.dateObj - b.dateObj);

    if (filteredList.length == 0) {
        reservedList.innerHTML = `
            <li class="py-2 px-3 border border-1 border-info-subtle rounded-1 shadow-sm d-flex justify-content-between my-1">
                <span class="fw-medium text-danger">No reserved day!</span>
            </li>
        `;
        return;
    }

    let listHtml = '';

    for(let i = 0; i < filteredList.length; i++){

        listHtml += `
            <li class="py-2 px-3 border border-1 border-info-subtle rounded-1 shadow-sm d-flex justify-content-between my-1">
                <span class="fw-medium text-success">${filteredList[i].date}</span>
                <button class="btn btn-danger py-0 js-removeReservation" data-date="${filteredList[i].date}"><i class="bi bi-x-circle text-light"></i></button>
            </li>
        `;

    }
    
    reservedList.innerHTML = listHtml;

    const list = document.querySelectorAll('.js-removeReservation');
    
    list.forEach((element) => {
        element.addEventListener('click', async function(){
            await remove_reservation(element.dataset.date);
        });
    });

}

async function remove_reservation(date) {
    await fetchRemovedReservation(date);
    await loadReservedList();
    await load();
}

initButton();
load();
loadReservedList();